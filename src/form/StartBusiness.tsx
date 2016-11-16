import * as React from 'react';


import { observable } from 'mobx';
import { observer } from 'mobx-react';

const IPFS = require('ipfs');


export class StartBusinessState {
    @observable title: string;
    @observable description: string;
    @observable urPicture: string;
}

export const startBusinessState = new StartBusinessState();


@observer
export class StartBusiness extends React.Component< any, any > {

    uploadDataToIPFS(){
        const data = {
            title: startBusinessState.title,
            description: startBusinessState.description
        };
        console.log(IPFS);
        
        getIpfsNode();
    }

    render() {
        console.log("startBusiness");
        
        return (
            <div className="start-business">
                <input value={startBusinessState.title} onChange={ (e: any) => startBusinessState.title = e.currentTarget.value } />
                <textarea value={startBusinessState.description} onChange={ (e: any) => startBusinessState.description = e.currentTarget.value } />
                <input type='file'>Select File</input>
                <button onClick={ _ => this.uploadDataToIPFS() }></button>
            </div>
        );
    }
}

function getIpfsNode() {
}