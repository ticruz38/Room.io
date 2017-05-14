import * as React from 'react';
import * as classnames from 'classnames';


type DropdownProps = {
    button: React.ReactElement< any >;
    list: React.ReactElement< any >[];
    align?: 'left' | 'right'
}

export default class Dropdown extends React.Component< DropdownProps, {expand: boolean} > {
    state = { expand: false };

    expand() {
        const list: any = this.refs['list'];
        this.setState({expand: !this.state.expand}, () => list.focus());
    }
    
    render() {
        return (
            <div className="dropdown"
                style={{ justifyContent: this.props.align === 'right' ? 'flex-end' : 'flex-start'}}>
                <span onClick={ _ => this.expand() }>{this.props.button}</span>
                <div
                    ref='list'
                    tabIndex={-1}
                    className={ classnames("dropdown-list", { hidden: !this.state.expand}) }
                    onBlur={ _ => setTimeout( _ => this.setState( { expand: false } ), 100 ) }
                >
                    { this.props.list.map( (l, i) =>
                      <div
                        key={i} 
                        style={{ justifyContent: this.props.align === 'right' ? 'flex-end' : 'flex-start'}}
                      >
                        {l}
                      </div> ) }
                </div>
            </div>
        );
    }
}

import './Dropdown.scss';