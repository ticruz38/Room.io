import * as React from 'react';
import Login from 'routes/auth/Login';
import { Link } from 'react-router';

import { Dropdown } from 'components';


export default ( props: { isLogged: boolean, setLog: (boolean) => void, setModal: Function, user: object} ) => {
    return props.isLogged ?
        <Dropdown
            align='right'
            button={<a>{props.user["name"]}</a>}
            list={[
                <Link
                    to="profile"
                >Profile
                </Link>,
                <Link to="preferences">Preferences</Link>,
                <a>
                    <i className="material-icons"
                        onClick={_ => { props.setLog(false) }}>
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