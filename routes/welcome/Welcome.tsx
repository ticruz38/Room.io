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
                        <p>
                            Room.io is a very simple concept, you show and detail what you are offering, in a nicely usable yet beautiful interface, it can be anything: 
                            goods, services, foods, homemade beauty product...
                        </p> 
                        <p>
                            Your customer will deal with you in total trust and simplicity.
                        </p>
                    </li> 
                    <li>
                        <p>
                            Room.io is a distributed, peer-to-peer application, it has no central point of authority, no server, you exchange directly with your customer.
                        </p>
                        <div 
                            className="img distributed" 
                            style={{backgroundImage: 'url("https://blog.savoirfairelinux.com/en-ca/wp-content/uploads/sites/2/2016/11/Social-network-sphere-1024x798.jpg")'}} 
                        />
                        <p>
                            Your goods will be barter or buyed with cryptocurrency
                        </p>
                    </li>
                    <li>
                        <p>
                            Go fill your account, share your profile, grab popularity in the network, and make yourself the greatest roomer ever! 
                            Nobody owns your data or identity, it's all yours!
                        </p>
                    </li> 
                </ul>
                <div className='pick'>
                    <Button
                        action={_ => this.props.router.push('rooms')}
                        message="Let's get started"
                    />
                </div>
            </div>
        ); 
    } 
}
 
import './Welcome.scss';
