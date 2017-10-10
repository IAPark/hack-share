import * as React from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles';

export function FileView(props: {content: string, type: string}) {
    
    return <SyntaxHighlighter language={props.type} style={docco}>{props.content}</SyntaxHighlighter>;  
}