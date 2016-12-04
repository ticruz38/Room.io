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
        ipfsApi.restaurant.put({
            _id: "ambrosia",
            doc: start.name,
        });
    }

    onDrop = (e: any) => {
    e.preventDefault();
    const fileReader = new FileReader();
    fileReader.readAsDataURL(e.dataTransfer.files[0]);
    fileReader.onloadend = (e: any) => {
      console.log(e.target.result);
    }
  };

    get buttonDisabled() {
        if( !start.name || !start.description) return true;
        return !start.name.length && !start.description.length && !ipfsApi.nodeID; 
    }

    render() {
        return (
            <div className="start-business" onDrop={ e => this.onDrop(e)} onDragOver={e => e.preventDefault()}>>
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
                <p className="dragdrop">Drag & drop a picture in the window to upload an image</p>
            </div>
        );
    }
}

import './StartBusiness.scss';