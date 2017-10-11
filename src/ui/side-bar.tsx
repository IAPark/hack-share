import * as React from 'react';

interface SideBarProps {
    files: string[];
}


export function SideBar(props: SideBarProps) {
    return <div>{props.files.map(f => <div key={f}><a href={'/file/'+f}>{f}</a></div>)}</div>;
}