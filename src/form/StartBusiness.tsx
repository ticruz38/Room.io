import * as React from 'react';
import * as classnames from 'classnames';


import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { NonEmpty, Email, Input, Textarea } from '../../crankshaft/Input';
//import ipfs from '../IpfsStore';
import ipfsApi from '../IpfsApiStore';


export class StartBusinessState {
    @observable name: string;
    @observable description: string;
    @observable email: string;
    @observable phoneNumber: string;
    @observable urPicture: string;
    @observable nodeError: string;
}

export const start = new StartBusinessState();


@observer
export class StartBusiness extends React.Component< any, any > {

    uploadDataToIPFS() {
        console.log(ipfsApi.nodeID);
        ipfsApi.restaurant.put({
            _id: ipfsApi.nodeID,
            name: start.name,
            description: start.description
        }).then((hash: string) => console.log(hash));
    }

    get buttonDisabled() {
        if( !start.name || !start.description) return true;
        return !start.name.length && !start.description.length && !ipfsApi.nodeID; 
    }

    render() {
        return (
            <div className="start-business">
                <div className="intro-layer"/>
                <Input
                    type="text"
                    label="Business Name"
                    value={start.name}
                    onChange={ (e: any) => start.name = e.currentTarget.value }
                    constraints={ [ new NonEmpty() ]}
                />
                <Textarea
                    label="Put a brief description on what your business offer"
                    value={start.description} 
                    onChange={ (e: any) => start.description = e.currentTarget.value } />
                <Input
                    label="Email Address"
                    type='email'
                    value={start.email}
                    onChange={ (e:any) => start.email = e.currentTarget.value }
                    constraints={ [ new Email() ] }
                />
                <Input
                    label="Phone Number"
                    type="tel"
                    value={start.phoneNumber}
                    onChange={ (e: any) => start.phoneNumber = e.currentTarget.value }
                    />
                <button
                    className={ classnames( 'button', { disabled: this.buttonDisabled }) }
                    onClick={ _ => this.uploadDataToIPFS() }
                    disabled={this.buttonDisabled}
                >Open it
                </button>
            </div>
        );
    }
}

import './StartBusiness.scss';