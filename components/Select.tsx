import * as Select from 'react-select';
import { Option } from "react-select";
import * as React from 'react';
import { observer } from "mobx-react";
import { toJS } from "mobx";



type SelectProps = {
    store: any
}

@observer
export default class SelectComponent extends React.PureComponent< SelectProps, any > {

    render() {
        const { filters, options } = this.props.store;
        return (
            <Select
                placeholder="Filter by..."
                name="select-test"
                value={ filters.length ? toJS(filters) : null }
                onChange={ options => {
                    console.log(options)
                    this.props.store.filters = options
                } }
                options={ options }
                noResultsText=""
                multi
                autosize
            />
        );
    }
}

