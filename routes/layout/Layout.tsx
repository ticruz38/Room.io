import * as React from 'react';
import * as classnames from 'classnames';
import { Link } from 'react-router';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';
import { Connect } from 'uport-connect';

import AuthButton from './visuals/AuthButton';
import Modal from './visuals/Modal';
import Loading from './visuals/Loading';
import Loader from "graph/Loader";
import Button from 'components/Button';
import { EditableUser } from "models";

import db from 'graph/IpfsApiStore';
const Document = require('./Layout.gql');

interface LayoutProps {
    children: React.Component<any, any>,
}

export class LayoutState {
    @observable searchBar: boolean = true;
    @observable backRoute: string;
    @observable title: string;
    @observable user: User
    @observable backgroundImage: string;

    constructor() {
        if (this.userId) {
            Loader.execute(Document, 'getUser', { id: this.userId }).then(result => {
                if (result.errors) throw result.errors;
                this.user = result.data.user;
            });
        }
    }

    onClose: Function;
    setModal: (modal: boolean | React.ReactElement<any> | React.ReactNode | any[]) => void;
    setToolbar: (toolbar: React.ReactElement<any> | React.ReactElement<any>[]) => void;

    get userId(): string { return sessionStorage.getItem('userId') };
    reset() {
        this.setModal(null);
        this.setToolbar(<span />);
        this.onClose = null;
        this.backgroundImage = null;
        this.searchBar = false;
        this.backRoute = null;
        this.title = null;
        this.backgroundImage = null;
    }
}

export const layoutState = new LayoutState();




type state = {
    modal: boolean | React.ReactElement<any> | React.ReactNode | any[],
    loader: boolean | React.ReactElement<any> | React.ReactNode | any[],
    toolbar: React.ReactElement<any> | React.ReactElement<any>[],
}
@observer
export default class Layout extends React.Component<any, state> {
    state = { modal: false, toolbar: null, loader: false };

    componentWillMount() {
        this.setState({ ...this.state, loader: <Loading message='looking for peers' /> })
        // startup web3Db;
        db.bootingDb.then(web3DB => {
            this.setState({ ...this.state, loader: <Loading message='starting up db' /> })
            web3DB.startUp((err, credentials) => {
                this.setState({ ...this.state, loader: <Loading message='resolving ipfs address' /> })
                // console.log(err, credentials);
                if (!credentials) this.props.router.push('/'); //back to home page
                new EditableUser({
                    _id: credentials.address,
                    name: credentials.name,
                    picture: credentials.image ? credentials.image.contentUrl.split('/').pop() : ''
                }).logWithUport(result => {
                    this.setState({...this.state, loader: false});
                    const user = result.data.user;
                    layoutState.user = user;
                    sessionStorage.setItem('userId', user._id);
                });
            });
        });
        layoutState.setModal = (modal) => this.setState({ ...this.state, modal: modal });
        layoutState.setToolbar = (toolbar: React.ReactElement<any> | React.ReactElement<any>[]) => this.setState({ ...this.state, toolbar: toolbar });
    }

    get backButton() {
        return (
            <Button
                message={layoutState.backRoute}
                icon={<i className="material-icons">keyboard_arrow_left</i>}
                to={layoutState.backRoute}
                className={classnames('back-button', { hidden: !layoutState.backRoute })}
            />
        );
    }

    get icon() {
        return (
            <Button
                to="/rooms"
                icon={<i className="material-icons">weekend</i>}
                className='app-icon'
                appear
            />
        );
    }

    render() {
        return (
            <div className='layout'>
                <div className={classnames({ blur: this.state.modal || this.state.loader })}>
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
                                    reset={_ => layoutState.user = {}}
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
                <Modal unclosable>
                    {this.state.loader}
                </Modal>
            </div>
        )
    }
}


import './Layout.scss';

