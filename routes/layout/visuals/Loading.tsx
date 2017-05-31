import * as React from 'react';

import { SpinnerIcon } from 'components/icons';


export default (props: {message: string}) => {
    return (
        <div>
            <SpinnerIcon size='2em'/>
            <p>{ props.message }</p>
        </div>
    );
}