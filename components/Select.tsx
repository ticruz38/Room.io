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
    allowCreate?: boolean
}

@observer
export default class SelectComponent extends React.PureComponent< SelectProps, any > {

    render() {
        const { filters, options } = this.props.values;
        return (
            <Select
                placeholder="Filter by..."
                name="select-test"
                value={ Array.isArray(filters) ? toJS(filters) : null }
                onChange={ options => {
                    console.log(options, this.props.values.filters)
                    this.props.values.filters = options
                } }
                options={ options }
                noResultsText=""
                multi
                autosize
                { ...this.props }
            />
        );
    }
}

