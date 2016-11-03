import * as React from 'react';
import * as classnames  from 'classnames';
import { Link } from 'react-router';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { Login } from '../src/login/login';

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

}

export const layoutState = new LayoutState();

@observer
export class Layout extends React.Component<any, any> {

  get searchbar() {
    return (
      <div className={ classnames('search-wrapper', { hidden: !layoutState.searchBar} ) }>
        <i className="material-icons">search</i>
        <div className='search-bar'><input type='text' placeholder='search..' /></div>
      </div>
    );
  }

  get backButton() {
    return (
      <Link to={layoutState.backRoute} className={classnames('back-button', {hidden: !layoutState.backRoute})}>
        <i className="material-icons">keyboard_arrow_left</i>
      </Link>
    );
  }

  get icon() {
    return (
      <div className='app-icon'>
        <div><i className="material-icons">local_florist</i></div>
      </div>
    );
  }

  render() {
    return (
      <div className='layout'>
        <header className="navigation">
          { this.icon }
          { this.backButton }
          { this.searchbar }  
          <div className='signin' onClick={_ => {console.log('layoutState'); layoutState.modal = <Login/>} }>
            <button className='ambrosia-button'>
            <i className="fa fa-sign-in" />
              <span>Login</span>
            </button>
          </div>
        </header>
        { this.props.children }
        <Modal>
          { layoutState.modal }
        </Modal>
    </div>
    )
  }
}

const Modal = (props: any) => {
    console.log(props);
  
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


import './layout.scss';