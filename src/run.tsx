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

const index = path.join(__dirname, '../index.html');

app.get('/', function (req, res) {
    res.sendFile(index);
});
function jsFriendlyJSONStringify (s: any) {
    return JSON.stringify(s).
        replace(/\u2028/g, '\\u2028').
        replace(/\u2029/g, '\\u2029').
        replace(/</g, '\\u003c');
}

app.get('/file/:filename', function (req, res) {
    res.sendFile(index);
});

app.get('/api/file/:filename', function (req, res) {
    const filename = req.params.filename;
    if (!files[filename]) {
        res.sendStatus(404);
    }
    res.json(files[filename])
});

app.get('/api/files/', function (req, res) {
    res.json({files: Object.keys(files)})
});

app.use('/public', express.static('public'));
app.use('/node_modules', express.static('node_modules'));



io.on('connection', function(socket){
    socket.on('file update', function(msg: FileUpdateMessage){
        files[msg.file] = msg;
        io.emit('file updated', msg);
        io.emit('files changed', {files: Object.keys(files)})
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
    