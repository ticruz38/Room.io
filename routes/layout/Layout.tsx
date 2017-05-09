import * as React from 'react';
import * as classnames from 'classnames';
import { Link } from 'react-router';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';

import { Dropdown } from 'components';
import Login from '../auth/Login';
import db from 'graph/IpfsApiStore';

interface LayoutProps {
    children: React.Component<any, any>,
}

const ModalContent = () => {
    return <div> Hi Guys, I'm a modal</div>;
}

export class LayoutState {
    @observable modal: boolean | React.ReactElement<any> | React.ReactNode;
    @observable searchBar: boolean = true;
    @observable backRoute: string;
    @observable toolBar: React.ReactElement<any> | React.ReactElement<any>[];
    @observable title: string;
    @observable isLogged: boolean = !!sessionStorage.getItem('user');
    @observable backgroundImage: string;
    @observable isApplicationReady: boolean;
    onClose: Function;

    constructor() {
        db.starting.then( _ => this.isApplicationReady = true );
    }

    reset() {
        this.backgroundImage = null;
        this.modal = false;
        this.searchBar = false;
        this.backRoute = null;
        this.toolBar = null;
        this.title = null;
        this.backgroundImage = null;
        this.onClose = null;
    }

    get user(): ObjectLitteral {
        if (!this.isLogged) return {};
        return JSON.parse(sessionStorage.getItem('user'));
    }
}



export const layoutState = new LayoutState();




@observer
export default class Layout extends React.PureComponent<any, any> {

    get backButton() {
        return (
            <Link to={layoutState.backRoute} className={classnames('back-button', { hidden: !layoutState.backRoute })}>
                <i className="material-icons">keyboard_arrow_left</i>
                <p>{layoutState.backRoute}</p>
            </Link>
        );
    }

    get icon() {
        return (
            <Link className='app-icon' to="/rooms">
                <i className="material-icons">local_florist</i>
            </Link>
        );
    }

    get authButton() {
        return layoutState.isLogged ?
            <Dropdown
                align='right'
                button={<a>{layoutState.user["name"]}</a>}
                list={[
                    <Link
                        to="profile"
                    >Profile
                    </Link>,
                    <Link to="preferences">Preferences</Link>,
                    <a>
                        <i className="material-icons"
                            onClick={_ => { layoutState.isLogged = false }}>
                            exit_to_app
                        </i>
                    </a>
                ]}
            /> :
            <button className='ambrosia-button'
                onClick={_ => { layoutState.modal = <Login /> }}
            >
                <i className="material-icons">input</i>
            </button>
    }

    render() {
        return (
            <div className='layout'>
                <div className={classnames({ blur: !!layoutState.modal })}>
                    <div className="background" style={{ backgroundImage: layoutState.backgroundImage ? 'url(' + layoutState.backgroundImage + ')' : 'none' }} />
                    <header className="navigation">
                        <div className="left-items">
                            {this.icon}
                            <div className="title">
                                {layoutState.title}
                            </div>
                            {this.backButton}
                            <div className="toolbar">
                                {layoutState.toolBar}
                            </div>
                        </div>
                        <div className="right-items">
                            <div className='auth'>
                                {this.authButton}
                            </div>
                        </div>
                    </header>
                    {this.props.children}
                </div>
                <Modal>
                    {layoutState.modal}
                </Modal>
            </div>
        )
    }
}

const SearchBar = () => {
    return (
        <div className="search-wrapper">
            <i className="material-icons">search</i>
            <div className='search-bar'><input type='text' placeholder='search..' /></div>
        </div>
    );
}

const Modal = (props: any) => {
    if (!props) return;

    const close = (e: MouseEvent) => {
        e.preventDefault();
        const clickedElement: any = e.target;
        console.log(clickedElement.id)
        if (clickedElement.id === "wrapper") {
            if (layoutState.onClose) layoutState.onClose();
            layoutState.modal = false;
        }
    }

    return (
        <div
            id="wrapper"
            className={classnames('modal', { hidden: !props.children })}
            onClick={(e: any) => close(e)}
        >
            {props.children}
        </div>
    );
}


import './Layout.scss';