import * as React   from "react"; 
import {Link}       from "react-router"; 
import {computed, observable, toJS, autorun} from 'mobx' 
import { observer } from 'mobx-react'; 
 
import { layoutState } from 'routes/layout/Layout'; 
import Login from 'routes/auth/Login'; 
import Button from "components/Button";
 
 
export default class Welcome extends React.Component< any, any > {

    render() {
        return (
            <div className="welcome">
                <div className="header" style={ { backgroundImage: 'url("public/roomio-background.jpg")' } }>
                    <div>
                        <h1>Room</h1>
                        <h3>It's all yours</h3>
                    </div>
                </div>
                <ul className='presentation'>
                    <li> 
                        Room.io is a very simple concept, you show and detail what you are offering, in a nicely usable yet beautiful interface, it can be anything, 
                        goods, services, foods, homemade beauty product... And let your customer enter in a deal with you in total trust and simplicity. 
                    </li> 
                    <li>
                        Caddy is a decentralized, peer-to-peer application, there is no server here, you exchange directly with your customer with no third parties
                        Your goods will be barter or buyed with cryptomonney
                    </li>
                    <li>
                        Go fill your caddy account, share your profile, grab popularity in the network, and make yourself the greatest roomer ever! 
                        Nobody owns your data, it's all yours!
                    </li> 
                </ul>
                <div className='pick'>
                    <Button 
                        action={_ => this.props.router.push('login')} 
                        message="Get Started"
                    />
                    <Button
                        action={_ => this.props.router.push('rooms')}
                        message="Look Around"
                    />
                </div>
            </div>
        ); 
    } 
}
 
import './Welcome.scss';
