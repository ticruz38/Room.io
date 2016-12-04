import * as React from 'react';
import * as classnames from 'classnames';
import { Link } from 'react-router';

import { observable, extendObservable, computed } from 'mobx';
import { observer } from 'mobx-react';
import { nonEmpty, email, Input, Textarea } from '../../crankshaft/Input';
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
export class StartBusiness extends React.Component< any, {isValid: boolean} > {
    state = {isValid: false};
    @observable errorChecker: {[prop: string]: string} = {
        name: '',
        description: '',
        email: '',
        phoneNumber: ''
    };

    initForm () {
        Object.keys( this.errorChecker ).map( (key: string) => {
        })
    }

    uploadDataToIPFS() {
        if( !this.isFormValid ) return this.initForm();
        console.log(ipfsApi.nodeID);
        ipfsApi.restaurant.put({
            _id: "ambrosia",
            doc: start.name,
        });
    }

    onDrop = (e: any) => {

  };
    }
      console.log(e.target.result);
    fileReader.onloadend = (e: any) => {
    fileReader.readAsDataURL(e.dataTransfer.files[0]);
    const fileReader = new FileReader();
    e.preventDefault();
    getDataFromIpfs() {
        ipfsApi.restaurant.get( ipfsApi.nodeID ).map( (e: any) => console.log(e) );
        const all = ipfsApi.restaurant.query((doc: any) => !!doc.name)
        console.log(all);
    }

    @computed get isFormValid() {
        return !Object.keys( this.errorChecker ).filter( error => !!this.errorChecker[error] ).length;
    }

    render() {
        return (
            <div className="start-business" onDrop={ e => this.onDrop(e)} onDragOver={e => e.preventDefault()}>>
                <div className="intro-layer"/>
                <Input
                    id="name"
                    type="text"
                    label="Business Name"
                    errorChecker={ this.errorChecker }
                    value={start.name}
                    onChange={ (e: any) => start.name = e.currentTarget.value }
                    constraints={ [ nonEmpty ]}
                />
                <Textarea
                    id="description"
                    errorChecker={ this.errorChecker }
                    label="Put a brief description on what your business offer"
                    value={start.description} 
                    onChange={ (e: any) => start.description = e.currentTarget.value } />
                <Input
                    id="email"
                    errorChecker={ this.errorChecker }
                    label="Email Address"
                    type='email'
                    value={start.email}
                    onChange={ (e:any) => start.email = e.currentTarget.value }
                    constraints={ [ email ] }
                />
                <Input
                    id="phone number"
                    errorChecker={ this.errorChecker }
                    label="Phone Number"
                    type="tel"
                    value={start.phoneNumber}
                    onChange={ (e: any) => start.phoneNumber = e.currentTarget.value }
                />
                <button
                    className={ classnames( 'button', { disabled: !this.isFormValid }) }
                    onClick={ _ => this.uploadDataToIPFS() }
                >Open it
                </button>
                <div className="room">
                    <Link to="room">
                        <div>Set your room up</div> 
                        <i className="material-icons">expand_more</i>
                    </Link>
                </div>
            </div>
        );
    }
}

import './StartBusiness.scss';