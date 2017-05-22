import * as React from 'react';
import Login from 'routes/auth/Login';
import { Link } from 'react-router';

import { Dropdown, IpfsImage, Button } from 'components';


export default ( props: { reset: Function, setModal: Function, user: any} ) => {
    const ButtonContent = (user: any) => {
        if(user.picture) return (
            <IpfsImage
                className="a-b-image"
                defaultPicture="public/uport-logo-white.svg"
                urlPicture={user.picture}
                readOnly
            />
        );
        return <Button message={props.user.name} />
    }

    return props.user ?
        <Dropdown
            align='right'
            button={<ButtonContent {...props.user} />}
            list={[
                <Link
                    to="profile"
                >Profile
                </Link>,
                <Link to="preferences">Preferences</Link>,
                <a>
                    <i className="material-icons"
                        onClick={_ => { props.reset() }}>
                        exit_to_app
                    </i>
                </a>
            ]}
        /> :
        <button className='ambrosia-button'
            onClick={_ => { props.setModal(<Login/>) }}
        >
            <i className="material-icons">input</i>
        </button>
}

import './AuthButton.scss';