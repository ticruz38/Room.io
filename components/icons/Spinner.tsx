import * as React from 'react';

export default (props: {size?: string}) => 
    <div className='spinner-wrapper'>
        <i className="material-icons spinner" style={ { fontSize: props.size || '2em' } }>filter_vintage</i>
    </div>

import './icons.scss';