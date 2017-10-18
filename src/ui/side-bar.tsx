import * as React from 'react';

import {NavLink} from 'react-router-dom'
import * as sClient from 'socket.io-client';
import { FileListChange } from '../receiver'

interface props {
 files: string[]   
}

export class SideBar extends React.Component<{},props> {
    state = {files: []}
    constructor(props: {}) {
        super(props);

        const socket = sClient();
        socket.on('files changed', (msg: FileListChange) => {
            this.setState(()=>({files: msg.files}));
        });

        fetch('/api/files')
        .then(r => r.json())
        .then(j => {console.log(j); return j})
        .then(json => !json.files || this.setState(()=>({files: json.files})));
    }
    render() {
        console.log(this.props);
        return <div>{this.state.files.map(f => <div key={f}><NavLink activeStyle={{fontWeight: 'bold'}} to={'/file/'+f} >{f}</NavLink></div>)}</div>;
    }
}