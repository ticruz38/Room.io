import * as React from 'react';
import * as classnames from 'classnames';


type DropdownProps = {
    button: React.ReactElement< any >;
    list: React.ReactElement< any >[];
    align?: 'left' | 'right'
}

export default class Dropdown extends React.Component< DropdownProps, {expand: boolean} > {
    state = { expand: false };
    render() {
        return (
            <div className="dropdown"
                style={{ justifyContent: this.props.align === 'right' ? 'flex-end' : 'flex-start'}}>
                <span onClick={ _ => this.setState( { expand: !this.state.expand }, () => this.refs['list'].focus() ) }>{this.props.button}</span>
                <div
                    ref='list'
                    tabIndex={-1}
                    className={ classnames("dropdown-list", { hidden: !this.state.expand}) }
                    onBlur={ _ => this.setState( { expand: false } ) }
                >
                    { this.props.list.map( l => <div style={{ justifyContent: this.props.align === 'right' ? 'flex-end' : 'flex-start'}}>{l}</div> ) }
                </div>
            </div>
        );
    }
}

import './Dropdown.scss';