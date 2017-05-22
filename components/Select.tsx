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

    _addValue = (e) => {
        if( !this.props.allowCreate ) return;
        if( e.keyCode === 13 ) {
            this.props.values.options.push({
                label: e.target.value,
                value: e.target.value
            });
            this.props.values.filters.push({
                label: e.target.value,
                value: e.target.value
            });
            e.target.value = '';
            this.setState({});
        }
    }

    render() {
        const { filters, options } = this.props.values;
        console.log(filters, options);
        return (
            <Select
                placeholder={ this.props.placeholder || "Filter by..." }
                name="select-test"
                value={ toJS(filters) }
                onChange={ options => this.props.values.filters = options }
                options={ options }
                onInputKeyDown={ this._addValue }
                noResultsText=""
                clearable={false}
                multi
                autosize
                backspaceRemoves
            />
        );
    }
}

