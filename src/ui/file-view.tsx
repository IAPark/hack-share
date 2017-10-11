import * as React from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles';
import * as sClient from 'socket.io-client';
const server = 'http://localhost:3000'

interface FileViewProps {
    file: string, 
    initial: {type: string, content: string}
}
interface FileUpdateMessage{
    file: string,
    text: string
}

const onClient = typeof window !== 'undefined' && window.document && window.document.createElement;

export class FileView extends React.Component<FileViewProps,{type: string, content: string}> {
    constructor(props: FileViewProps) {
        super(props)
        this.state = this.props.initial;
        console.log('here');

        if (onClient) {
            console.log('on client');
            const socket = sClient(server);
            socket.on('file updated', (msg: FileUpdateMessage) => {
                if (msg.file === this.props.file) {
                    console.log('got an update')
                    this.setState(() => {
                        return {content: msg.text}
                    })
                }
            });
        }
    }
    render() {
        return <SyntaxHighlighter language={this.state.type} style={docco}>{this.state.content}</SyntaxHighlighter>;
    }
}