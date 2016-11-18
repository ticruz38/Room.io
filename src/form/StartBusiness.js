import * as React from 'react';


import { observable } from 'mobx';
import { observer } from 'mobx-react';



export class StartBusinessState {
    @observable title;
    @observable description;
    @observable urPicture;
}

export const startBusinessState = new StartBusinessState();


@observer
export class StartBusiness extends React.Component< any, any > {

    uploadDataToIPFS(){
        const data = {
            title: startBusinessState.title,
            description: startBusinessState.description
        };
        console.log(Ipfs, new Ipfs());
        
        getIpfsNode();
    }

    render() {
        console.log("startBusiness");
        
        return (
            <div className="start-business">
                <input value={startBusinessState.title} onChange={ (e: any) => startBusinessState.title = e.currentTarget.value } />
                <textarea value={startBusinessState.description} onChange={ (e: any) => startBusinessState.description = e.currentTarget.value } />
                <input type='file'/>
                <button onClick={ _ => this.uploadDataToIPFS() }>Ipfs</button>
            </div>
        );
    }
}

function getIpfsNode() {
}