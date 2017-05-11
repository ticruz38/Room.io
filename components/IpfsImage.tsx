import * as React from 'react';
import { observer } from "mobx-react";
import { toJS, computed, observable, autorun } from "mobx";
import db from 'graph/IpfsApiStore';



type ImageProps = {
    onUpload?: (err: Error, res: any) => void;
    picture?: Field;
    defaultPicture: string; // url picture;
    className?: string;
    readOnly?: boolean;
    urlPicture?: string; // To be fullfilled only in readOnly mode 
    onClick?: (e: MouseEvent ) => void; // To be fullfilled only in readOnly mode 
}

@observer
export default class ImageComponent extends React.PureComponent< ImageProps, any > {

    @observable url: string

    constructor(props: ImageProps) {
        super(props);
        autorun( _ => {
            if( props.picture || props.urlPicture ) {
                db.getFile( props.picture && props.picture.value ? props.picture.value : props.urlPicture  ).then( res => this.url = res ) 
            }
        } );
    }

    uploadFile = () => db.uploadFile( this.refs.fileinput['files'][0], this.props.onUpload )

    render() {
        return (
            <div 
                className={ "ipfs-picture " + (this.props.className || "") }
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
                        src={ this.url ? this.url : this.props.defaultPicture }
                    />
                </div>
            </div>
        );
    }
}

import './IpfsImage.scss';