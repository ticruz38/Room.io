import * as React from 'react';


interface ViewProps {
  children: React.Component< any, any >,
  
}
export class View extends React.Component<any, any> {

  get searchbar() {
    return (
      <div className='search-wrapper'>
        <i className="material-icons">search</i>
        <div className='search-bar'><input type='text' placeholder='search..' /></div>
      </div>
    );
  }

  get icon() {
    return (
      <div className='app-icon'>
        <div><i className="material-icons">local_florist</i></div>
      </div>
    );
  }

  /**
  *to be override by the extending class
  *@override
  */
  get modal() {
    return <span/>
  }

  /**
   *to be override by the extending class
   *@override
   */
  get content() {
    return (
      <div>
        </div>
    )
  }

  render() {
    return (
      <div className='view'>
        <header className="navigation">
          { this.icon }
          { this.searchbar }  
          <div className='signin'>
            <button className='ambrosia-button'>
            <i className="fa fa-sign-in" />
              <span>Login</span>
            </button>
          </div>
        </header>
        { this.content }
        { this.modal }
    </div>    
    )
  }  
}

import './view.scss';