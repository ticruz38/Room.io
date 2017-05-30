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
@observer
export default class ImageComponent extends React.PureComponent< ImageProps, {url: string} > {
    @observable state = {url: ''};

    componentWillMount() {
        const { defaultPicture } = this.props;
        if( defaultPicture ) this.state.url = defaultPicture;
        autorun( _ => {
            if( this.props.urlPicture ) {
                this.loadImage(this.props.urlPicture);
            }
            if( this.props.picture && this.props.picture.value ) {
                this.loadImage(this.props.picture.value);
            }
        } );
    }

    loadImage = (hash) => {
        if( loaded[hash] ) {
            this.state.url = loaded[hash];
            return;
        }
        if( pending[hash] ) return;
        pending[hash] = 1;
        db.getFile( hash  ).then( res => {
            loaded[hash] = res;
            this.state.url = res;
        } )
    }

    uploadFile = () => {
        if( this.props.readOnly ) return;
        if(!this.refs.fileinput['files'][0] ) return;
        db.uploadFile( this.refs.fileinput['files'][0], this.props.onUpload )
    }

    onFileInputClick = (e) => {
        if(this.props.readOnly) e.preventDefault();
    }

    onClick(e) {
        if(this.props.readOnly) return;
        if(this.props.onClick) return this.props.onClick(e)
        this.refs.fileinput['click']();
    }

    render() {
        return (
            <div 
                className={ classNames( "ipfs-picture", this.props.className, { readOnly: this.props.readOnly } ) }
                onClick={ (e: any) => this.onClick(e) } 
            >
                <input 
                    type='file' 
                    ref="fileinput" 
                    onClick={ this.onFileInputClick } 
                    onChange={ this.uploadFile } 
                />
                <div className={ this.props.readOnly ? "" : "picture-blur" }>
                    <img
                        className='picture'
                        src={ this.state.url }
                    />
                </div>
                {
                    this.props.readOnly ?
                    <span/> :
                    <div className="layer">
                        Click to upload a picture
                    </div>
                }
            </div>
        );
    }
}

import './IpfsImage.scss';