import * as React from 'react';

export class Navbar extends React.Component<any, any> {

  render() {
    return (
      <header className="navigation">
        <div>
          <div><i className="material-icons">local_florist</i></div>
        </div>
        <div className='search-wrapper'>
          <i className="material-icons">search</i>
          <div className='search-bar'><input type='text' placeholder='search..' /></div>
        </div>
        <div>
          <i className="fa fa-sign-in" />
          <button className='ambrosia-button'>Login</button>
        </div>
      </header>
    );
  }
}
