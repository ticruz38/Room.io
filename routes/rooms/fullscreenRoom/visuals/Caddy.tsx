import * as React from "react";
import { computed, observable, toJS, autorun } from 'mobx';
import { observer } from 'mobx-react';
import * as classnames from 'classnames';


@observer
export default class Caddy extends React.Component<any, any> {

    get roomState() {
        return this.props.roomState
    }

    renderStuffs() {
        const { room, caddy, amount, categories, order } = this.roomState;
        return Object.keys( categories ).map( key => (
            <div key={key} className="caddy-category">
                <h4>{key}</h4>
                { categories[key].map( ( s, i ) => (
                    <div key={s[1]._id} className="caddy-stuff">
                        { s[0] > 1 ? <i className="times">{s[0]}</i> : null }
                        <i className="material-icons close" onClick={ _ => order.removeStuff( s[1]._id ) }>close</i>
                        <strong>{s[1].name}</strong>
                    </div>
                ) ) }
            </div>
        ) );
    }

    render() {
        return (
            <div className="caddy-container">
                <div className="caddy-line"><i className="shopping material-icons">shopping_cart</i></div>
                <div className="caddy">
                    { this.renderStuffs() }
                </div>
            </div>
        );
    }
}

import './Caddy.scss';