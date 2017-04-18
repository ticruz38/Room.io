import * as React   from "react"; 
import {Link}       from "react-router"; 
import {computed, observable, toJS, autorun} from 'mobx' 
import { observer } from 'mobx-react'; 
 
import { layoutState } from '../layout/Layout'; 
import Login from '../auth/Login'; 
 
 
 
 
export default class Welcome extends React.Component< any, any > { 
    render() { 
        return ( 
            <div> 
                <div className='presentation'> 
                    <h1>Caddy makes it easy to anyone to open it's business</h1> 
                    <p> 
                        Caddy is a very simple concept, you show and detail what you are offering, in a nicely usable yet beautiful interface, it can be anything, 
                        goods, services, foods, homemade beauty product... And let your customer enter in a deal with you in total trust and simplicity. 
                    </p> 
                    <p> 
                        As soon as your customer is in a deal with you, he subscribes to the rule of your contract, 
                        Contract are a set of basic rules defining how you will interact with your customer. 
                        You could say for example that the customer payment will be triggered as soon as goods are in customer's hands. 
                    </p> 
                    <p> 
                        Caddy is build on top of Ethereum, it means that the contract you submit are immutable thus they can't be altered. 
                        The customer does'nt have to trust you. It just works. 
                    </p> 
                    <p> 
                        Go fill your caddy account, share your profile, grab popularity in the network, and make yourself the greatest caddyer ever! 
                    </p> 
                </div> 
                <div className='pick'> 
                    { 
                        layoutState.isLogged ? 
                        <Link to="start/room" className='box'> 
                            <span>Become a caddyer</span> 
                        </Link> : 
                        <a className="box" onClick={ _ => layoutState.modal = <Login/> }> 
                            <span>Become a caddyer</span> 
                        </a> 
                    } 
                    <Link to="feed" className='box'> 
                        <span>Look around</span> 
                    </Link> 
                </div> 
            </div> 
        ); 
    } 
} 
 
import './Welcome.scss';