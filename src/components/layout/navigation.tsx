import * as React from "react";

interface Props {
  children: Object,
}

export class NavigationBar extends React.Component<{children?: React.ReactElement<any>}, any> {

    render() {
        return (
            <nav>
              <ul className = "navbar">
                <li>
                  <form className="search-bar" role="search">
                    <input type="search" placeholder="Enter Search" onClick={e => e.preventDefault} />
                      <button type="submit">
                        <i className='fa fa-search'/>
                      </button>
                  </form>
                </li>
                <li className = "dropdown" >
                  <span>One Item</span>
                  <ul>
                    <li>another item</li>
                    <li>another other item</li>
                    <li> another other item</li>
                  </ul>
                </li>
                <li>3rd Itemm</li>
                <li>top right item</li>
              </ul>
              {this.props.children}
            </nav>
        );
    }
}

export class DropdownButton extends React.Component<any, any> {

    render() {
        return (
            <div></div>
        );
    }
}
