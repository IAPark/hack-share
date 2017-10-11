import * as React from 'react';

import * as ReactDOM from 'react-dom';
import {FileView} from './file-view';


declare var state: {
    file: string, 
    initial: {type: string, content: string}
}

ReactDOM.hydrate(<FileView {...state}/>, document.getElementById('react'));