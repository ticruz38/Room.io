import * as React from 'react';
import * as classnames from 'classnames';
import { Link } from 'react-router';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';

import AuthButton from './visuals/AuthButton';
import Modal from './visuals/Modal';

import db from 'graph/IpfsApiStore';

interface LayoutProps {
    children: React.Component<any, any>,
}

const ModalContent = () => {
    return <div> Hi Guys, I'm a modal</div>;
}

export class LayoutState {
    @observable searchBar: boolean = true;
    @observable backRoute: string;
    @observable title: string;
    @observable isLogged: boolean = !!sessionStorage.getItem('user');
    @observable backgroundImage: string;

    onClose: Function;
    setModal: (modal: boolean | React.ReactElement<any> | React.ReactNode | any[]) => void;
    setToolbar: (toolbar: React.ReactElement<any> | React.ReactElement<any>[]) => void;

    reset() {
        this.setModal(null);
        this.setToolbar(null);
        this.backgroundImage = null;
        this.searchBar = false;
        this.backRoute = null;
        this.title = null;
        this.backgroundImage = null;
    }

    get user(): ObjectLitteral {
        if (!this.isLogged) return {};
        return JSON.parse(sessionStorage.getItem('user'));
    }
}

export const layoutState = new LayoutState();




type state = {
    modal: boolean | React.ReactElement<any> | React.ReactNode | any[],
    toolbar: React.ReactElement<any> | React.ReactElement<any>[]
}
@observer
export default class Layout extends React.Component<any, state> {
    state = { modal: false, toolbar: null };

    componentWillMount() {
        layoutState.setModal = (modal) => this.setState({ ...this.state, modal: modal });
        layoutState.setToolbar = (toolbar: React.ReactElement<any> | React.ReactElement<any>[]) => this.setState({ ...this.state, toolbar: toolbar });
    }

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
                <i className="material-icons">weekend</i>
            </Link>
        );
    }

    render() {
        return (
            <div className='layout'>
                <div className={classnames({ blur: !!this.state.modal })}>
                    <div className="background" style={{ backgroundImage: layoutState.backgroundImage ? 'url(' + layoutState.backgroundImage + ')' : 'none' }} />
                    <header className="navigation">
                        <div className="left-items">
                            {this.icon}
                            <div className="title">
                                {layoutState.title}
                            </div>
                            {this.backButton}
                            <div className="toolbar">
                                {this.state.toolbar}
                            </div>
                        </div>
                        <div className="right-items">
                            <div className='auth'>
                                <AuthButton
                                    isLogged={layoutState.isLogged}
                                    setLog={log => layoutState.isLogged = log}
                                    user={layoutState.user}
                                    setModal={layoutState.setModal}
                                />
                            </div>
                        </div>
                    </header>
                    {this.props.children}
                </div>
                <Modal
                    onClose={layoutState.onClose}
                    setModal={layoutState.setModal}
                >
                    {this.state.modal}
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


import './Layout.scss';