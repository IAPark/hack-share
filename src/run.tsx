import * as express from 'express';
import {Server} from 'http';
import * as socket from 'socket.io';
import * as ReactDOMServer from 'react-dom/server';
import {FileView} from './ui/file-view';
import * as React from 'react';


var app = express();
var http = new Server(app);
var io = socket(http);

var files: {[filename: string]: {content: string, type: string}} = {}


app.get('/file/:filename', function (req, res) {
    const filename = req.params.filename;
    res.send(ReactDOMServer.renderToStaticMarkup(
        <FileView type='javascript' content={files[filename].content}/>
    ));
});


interface FileUpdateMessage{
    file: string,
    text: string
}

io.on('connection', function(socket){
    socket.on('file update', function(msg: FileUpdateMessage){
        files[msg.file] = {content: msg.text, type: ''};
        io.emit('file updated', msg);
        console.log(msg.file);
    });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
    