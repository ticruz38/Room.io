import * as React from "react";
import {NavigationBar} from './layout/navigation';
import {Navbar} from './layout/navbar';

export interface HelloProps { compiler: string; framework: string; }

export class Hello extends React.Component<HelloProps, {}> {
    render() {
        return (
          <Navbar/>
        );
    }
}
