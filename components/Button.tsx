/* @flow */
import * as React                                            from 'react';
import * as classNames                                       from 'classnames';


type ButtonProps = {
    icon?: React.ReactElement< any >,
    className?: string,
    message: string, // traduction key for the button
    action?: Function, // what happen when you click that button
    fileUpload?: boolean,
    disabled?: boolean,
    size?: 'small' | 'medium' | 'large',
    mode?: 'warning' | 'info' | 'action' | 'default'
}


export default class Button extends React.Component< ButtonProps, {loading: boolean} > {
    state = { loading: false };

    static defaultProps = {
        size: 'medium',
        mode: 'default'
    }

    _onClick = (e) => {
        if( this.props.fileUpload ) return this.refs.fileInput['click'](e);
        const action = this.props.action();
        if( action instanceof Promise ) {
            this.setState( { loading: true } ); 
            action.then( res => { this.setState( { loading: false } ); return res } )
        }
    }

    get icon(): React.ReactElement< any > {
        return this.state.loading ? 
            <i className="material-icons loading">cached</i> :
            this.props.icon || null
    }

    render() : React.ReactElement< any > {
        return (
            <button
                className={ classNames('react-btn',
                    this.props.className, 
                    this.props.mode,
                    this.props.size,
                    { disabled: this.props.disabled }
                ) }
                onClick={ this._onClick }
                disabled={ this.props.disabled }
            >
                { this.icon } {this.props.message}
                { this.props.fileUpload ? 
                    <input type="file" ref="fileInput" onChange={ e => this.props.action(e) }/> :
                    null
                }
            </button>
        );
    }
}

import './Button.scss';