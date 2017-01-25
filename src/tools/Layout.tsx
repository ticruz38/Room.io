import * as React from 'react';
import * as classnames  from 'classnames';
import { Link } from 'react-router';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import Login from '../auth/Login';

interface LayoutProps {
  children: React.Component< any, any >,
}

const ModalContent = () => {
  return <div> Hi Guys, I'm a modal</div>;
}

export class LayoutState {

  @observable modal: boolean | React.ReactElement< any >;
  @observable searchBar: boolean = true;
  @observable backRoute: string;
  @observable toolBar: React.ReactElement< any >;
  @observable title: string;
}

export const layoutState = new LayoutState();

@observer
export class Layout extends React.Component<any, any> {

  get backButton() {
    return (
      <Link to={layoutState.backRoute} className={classnames('back-button', {hidden: !layoutState.backRoute})}>
        <i className="material-icons">keyboard_arrow_left</i>
        <p>{ layoutState.backRoute }</p>
      </Link>
    );
  }

  get icon() {
    return (
      <Link className='app-icon' to="/">
        <i className="material-icons">local_florist</i>
      </Link>
    );
  }

  get toolBar(): React.ReactElement< any > {
    return layoutState.toolBar;
  }

  render() {
    return (
      <div className='layout'>
        <div className={classnames({blur: !!layoutState.modal})}>
          <header className="navigation">
            <div className="left-items">
              { this.icon }
              <div className="title">
                { layoutState.title }
              </div>
                { this.backButton }
              <div className="toolBar">
                { layoutState.toolBar }
              </div>
            </div>
            <div className="right-items">
              <div className='signin' onClick={_ => {layoutState.modal = <Login/>} }>
                <button className='ambrosia-button'>
                  <i className="fa fa-sign-in" />
                  <span>Login</span>
                </button>
              </div>
            </div>
          </header>
        { this.props.children }
        </div>
        <Modal>
          { layoutState.modal }
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
    if(!props) return;

    const close = (e: MouseEvent ) => {
      e.preventDefault();
      layoutState.modal = false;
    }
    
    return (
      <div className={classnames('modal', {hidden: !props.children})} onClick={ (e: any) => close(e) } >
        <div className='modal-content' 
          tabIndex={-1}
          onClick={ (e) => e.stopPropagation() }
          autoFocus>
          { props.children }
        </div>
      </div>
    );
}


import './Layout.scss';