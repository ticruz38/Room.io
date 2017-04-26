import * as Select from 'react-select';
import { Option } from "react-select";
import * as React from 'react';
import { observer } from "mobx-react";
import { toJS } from "mobx";



type SelectProps = {
    values: {
        filters: Option[] | Option,
        options: Option[]
    },
    allowCreate?: boolean,
    placeholder?: string; 
}

@observer
export default class SelectComponent extends React.PureComponent< SelectProps, any > {

    render() {
        const { filters, options } = this.props.values;
        return (
            <Select
                placeholder={ this.props.placeholder || "Filter by..." }
                name="select-test"
                value={ toJS(filters) }
                onChange={ options => this.props.values.filters = options }
                options={ options }
                noResultsText=""
                multi
                autosize
            />
        );
    }
}

