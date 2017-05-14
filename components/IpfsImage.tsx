import * as React from 'react';
import * as classNames from 'classnames';
import { observer } from "mobx-react";
import { toJS, computed, observable, autorun } from "mobx";
import db from 'graph/IpfsApiStore';
let index = 0;

type ImageProps = {
    onUpload?: (err: Error, res: any) => void;
    picture?: Field;
    defaultPicture: string; // url picture;
    className?: string;
    readOnly?: boolean;
    urlPicture?: string; // To be fullfilled only in readOnly mode 
    onClick?: (e: MouseEvent ) => void; // To be fullfilled only in readOnly mode 
}

// keep a map of all that has been loaded already;
const pending = {};
const loaded = {};

export default class ImageComponent extends React.PureComponent< ImageProps, {url: string} > {
    state = {url: null};

    componentWillMount() {
        if( this.props.urlPicture ) {
            this.loadImage(this.props.urlPicture);
        }
        if( this.props.picture && this.props.picture.value ) {
            this.loadImage(this.props.picture.value);
        }
    }

    componentWillReceiveProps(nextProps) {
        if( nextProps.urlPicture ) {
            this.loadImage(nextProps.urlPicture);
        }
        if( nextProps.picture && nextProps.picture.value ) {
            this.loadImage(nextProps.picture.value);
        }
    }

    loadImage = (hash) => {
        if( loaded[hash] ) {
            this.setState({url: loaded[hash]});
            return;
        }
        if( pending[hash] ) return;
        pending[hash] = 1;
        db.getFile( hash  ).then( res => {
            loaded[hash] = res;
            this.setState({url: res})
        } )
    }

    uploadFile = () => db.uploadFile( this.refs.fileinput['files'][0], this.props.onUpload )

    render() {
        return (
            <div 
                className={ classNames( "ipfs-picture", this.props.className, { readOnly: this.props.readOnly } ) }
                onClick={ (e: any) => this.props.readOnly ? this.props.onClick(e) : this.refs.fileinput['click']() } 
            >
                <input type='file' ref="fileinput" onChange={ this.uploadFile } />
                {
                    this.props.readOnly ?
                    <span/> :
                    <div className="layer">
                        Click to upload a picture
                    </div>
                }
                <div className={ this.props.readOnly ? "" : "picture-blur" }>
                    <img
                        className='picture'
                        src={ this.state.url ? this.state.url : this.props.defaultPicture }
                    />
                </div>
            </div>
        );
    }
}

import './IpfsImage.scss';