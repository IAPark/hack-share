import * as React from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNight } from 'react-syntax-highlighter/dist/styles';
import * as sClient from 'socket.io-client';
import {FileUpdateMessage, FileChangeMessage, replaceRange} from '../receiver'

const server = 'http://localhost:3000'

interface FileViewProps {
    file: string, 
    initial: {type: string, content: string}
}

const onClient = typeof window !== 'undefined' && window.document && window.document.createElement;

export class FileView extends React.Component<FileViewProps,{type: string, content: string}> {
    constructor(props: FileViewProps) {
        super(props)
        this.state = this.props.initial;

        if (onClient) {
            console.log('on client');
            const socket = sClient(server);
            socket.on('file updated', (msg: FileUpdateMessage) => {
                if (msg.file === this.props.file) {
                    console.log('got an update')
                    this.setState(() => {
                        return {content: msg.content, type: msg.type}
                    })
                }
            });
            socket.on('file changed', (msg: FileChangeMessage) => {
                if (msg.file === this.props.file) {
                    console.log('got an update')
                    const newContent = replaceRange(this.state.content, msg.newContent, msg.start, msg.length);
                    this.setState(() => {
                        return {content: newContent}
                    })
                }
            });
        }
    }
    render() {
        return <SyntaxHighlighter language={this.state.type} style={tomorrowNight}>{this.state.content}</SyntaxHighlighter>;
    }
}