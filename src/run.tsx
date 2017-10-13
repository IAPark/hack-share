import * as express from 'express';
import {Server} from 'http';
import * as socket from 'socket.io';
import * as ReactDOMServer from 'react-dom/server';
import {FileView} from './ui/file-view';
import {SideBar} from './ui/side-bar';
import * as fs from 'fs';
import * as path from 'path';

import * as React from 'react';
import {FileUpdateMessage, FileChangeMessage, replaceRange} from './receiver'

var app = express();
var http = new Server(app);
var io = socket(http);

var files: {[filename: string]: {content: string, type: string}} = {}

app.get('/', function (req, res) {
    res.send(ReactDOMServer.renderToStaticMarkup(
        <SideBar files={Object.keys(files)}/>
    ));
});
function jsFriendlyJSONStringify (s: any) {
    return JSON.stringify(s).
        replace(/\u2028/g, '\\u2028').
        replace(/\u2029/g, '\\u2029').
        replace(/</g, '\\u003c');
}

app.get('/file/:filename', function (req, res) {
    const filename = req.params.filename;
    if (!files[filename]) {
        res.sendStatus(404);
    }
    fs.readFile(path.join(__dirname, '../index.html'), (err, data) => {
        if (err) throw err;

        var file = ReactDOMServer.renderToString(<FileView file={filename} initial={files[filename]}/>);
        var state = {
                        file: filename, 
                        initial: files[filename]
                    };
        res.send(data.toString().replace("<div id='react'></div>", 
                                        `<div id='react'>${file}</div><script>var state=${jsFriendlyJSONStringify(state)}</script>`));
    })
});

app.use('/public', express.static('public'));
app.use('/node_modules', express.static('node_modules'));



io.on('connection', function(socket){
    socket.on('file update', function(msg: FileUpdateMessage){
        files[msg.file] = msg;
        io.emit('file updated', msg);
        console.log(msg.file);
    });
    socket.on('file change', function(msg: FileChangeMessage){
        files[msg.file].content = replaceRange(files[msg.file].content, msg.newContent, msg.start, msg.length);
        io.emit('file changed', msg);
        console.log('file change', msg)
    });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
    