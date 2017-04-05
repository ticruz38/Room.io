import * as React from 'react';
import { observer } from "mobx-react";
import { toJS, computed, observable } from "mobx";
import db from 'graph/IpfsApiStore';



type ImageProps = {
    onUpload: Function;
    picture?: Field;
    className?: string;
}

@observer
export default class ImageComponent extends React.PureComponent< ImageProps, any > {

    @observable base64Image: string

    componentWillMount() {
        if( this.props.picture.value ) db.getImage( this.props.picture.value ).then( res => this.base64Image = res )
    }

    componentWillReceiveProps(nextProps) {
        if( this.props.picture.value ) db.getImage( nextProps.picture.value ).then( res => this.base64Image = res )
    }
    uploadFile = () => db.uploadFile( this.refs.fileinput.files[0], this.props.onUpload )

    render() {
        return (
            <div className={this.props.className} onClick={_ => this.refs.fileinput.click()}>
                <input type='file' ref="fileinput" onChange={ this.uploadFile } />
                <div className="layer">
                    Click to upload a picture
                </div>
                <div className="picture-blur">
                    <img
                        className='picture'
                        src={ this.props.picture.value && this.base64Image ? 'data:image/jpg;base64,' + this.base64Image : 'https://www.jimfitzpatrick.com/wp-content/uploads/2012/10/Che-detail-1.jpg'} 
                    />
                </div>
            </div>
        );
    }
}