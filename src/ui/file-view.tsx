import * as React from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNight } from 'react-syntax-highlighter/dist/styles';
import * as sClient from 'socket.io-client';
import {FileUpdateMessage, FileChangeMessage, replaceRange} from '../receiver'


interface FileViewProps {
    file: string, 
}

const onClient = typeof window !== 'undefined' && window.document && window.document.createElement;

export class FileView extends React.Component<FileViewProps,{type?: string, content?: string}> {
    state: {type?: string, content?: string} = {};
    constructor(props: FileViewProps) {
        super(props);

        fetch('/api/file/'+props.file)
        .then(r => r.json())
        .then(json => this.setState(()=>json));

        if (onClient) {
            const socket = sClient();
            socket.on('file updated', (msg: FileUpdateMessage) => {
                if (!this.state.content) return;
                if (msg.file === this.props.file) {
                    this.setState(() => {
                        return {content: msg.content, type: msg.type}
                    })
                }
            });
            socket.on('file changed', (msg: FileChangeMessage) => {
                if (msg.file === this.props.file) {
                    if (!this.state.content) return;
                    const newContent = replaceRange(this.state.content, msg.newContent, msg.start, msg.length);
                    this.setState(() => {
                        return {content: newContent}
                    })
                }
            });
        }
    }

    componentWillReceiveProps(newProps: FileViewProps) {
        fetch('/api/file/'+newProps.file)
        .then(r => r.json())
        .then(json => this.setState(()=>json));
    }
    render() {
        if (!this.state.content) return <div>Loading</div>
        
        return <SyntaxHighlighter className='code-view' language={this.state.type} style={tomorrowNight}>{this.state.content}</SyntaxHighlighter>;
    }
}