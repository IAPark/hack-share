import * as React from 'react';

import * as ReactDOM from 'react-dom';
import {FileView} from './file-view';
import {SideBar} from './side-bar';

import {
  BrowserRouter as Router,
  Route,
  Link,
  RouteComponentProps
} from 'react-router-dom'

declare var state: {
    file: string, 
    initial: {type: string, content: string}
}

var FileViewRoute: React.StatelessComponent<RouteComponentProps<any>> = (props: {match: {params: {file: string}}}) => {
  console.log(props.match);
  return <FileView file={props.match.params.file}/>
}

ReactDOM.render(
<Router>
  <div className='container'>
    <SideBar/>
    <Route path="/file/:file" component={FileViewRoute}/>
  </div>
</Router>, 
document.getElementById('react'));