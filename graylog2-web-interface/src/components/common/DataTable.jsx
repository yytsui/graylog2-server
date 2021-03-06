import PropTypes from 'prop-types';
import React from 'react';
import DataTableElement from './DataTableElement';
import { TypeAheadDataFilter } from 'components/common';

/**
 * Component that renders a data table, letting consumers of the component to
 * decide exactly how the data should be rendered. It optionally adds a filter
 * input to the data table by using the the `TypeAheadDataFilter` component.
 */
const DataTable = React.createClass({
  propTypes: {
    /** Adds a custom children element next to the data filter input. */
    children: PropTypes.node,
    /** Adds a custom class to the table element. */
    className: PropTypes.string,
    /** Adds a custom class to the row element. */
    rowClassName: PropTypes.string,
    /** Object key that should be used to display data in the data filter input. */
    displayKey: PropTypes.string,
    /**
     * Function that renders a row in the table. It receives two arguments: the row, and its index.
     * It usually returns a `<tr>` element with the formatted row.
     */
    dataRowFormatter: PropTypes.func.isRequired,
    /** Label to use next to the suggestions for the data filter input. */
    filterBy: PropTypes.string,
    /** Label to use next to the data filter input. */
    filterLabel: PropTypes.string.isRequired,
    /** List of object keys to use as filter in the data filter input. Use an empty array to disable data filter. */
    filterKeys: PropTypes.array.isRequired,
    /** Array to use as suggestions in the data filter input. */
    filterSuggestions: PropTypes.array,
    /**
     * Function that renders a single header cell in the table. It receives two arguments: the header, and its index.
     * It usually returns a `<th>` element with the header.
     */
    headerCellFormatter: PropTypes.func.isRequired,
    /** Array of values to be use as headers. The render is controlled by `headerCellFormatter`. */
    headers: PropTypes.array.isRequired,
    /** Element id to use in the table container */
    id: PropTypes.string,
    /** Text or element to show when there is no data. */
    noDataText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /** Array of objects to be rendered in the table. The render of those values is controlled by `dataRowFormatter`. */
    rows: PropTypes.array.isRequired,
    /** Object key to use to sort data table. */
    sortByKey: PropTypes.string,
  },
  getDefaultProps() {
    return {
      filterSuggestions: [],
      displayKey: 'value',
      noDataText: 'No data available.',
      rowClassName: '',
    };
  },
  getInitialState() {
    return {
      headers: this.props.headers,
      rows: this.props.rows,
      filteredRows: this.props.rows,
    };
  },
  componentWillReceiveProps(newProps) {
    this.setState({
      headers: newProps.headers,
      rows: newProps.rows,
      filteredRows: newProps.rows,
    });
  },
  getFormattedHeaders() {
    let i = 0;
    const formattedHeaders = this.state.headers.map((header) => {
      const el = <DataTableElement key={`header-${i}`} element={header} index={i} formatter={this.props.headerCellFormatter} />;
      i++;
      return el;
    });

    return <tr>{formattedHeaders}</tr>;
  },
  getFormattedDataRows() {
    let i = 0;
    let sortedDataRows = this.state.filteredRows;
    if (this.props.sortByKey) {
      sortedDataRows = sortedDataRows.sort((a, b) => {
        return a[this.props.sortByKey].localeCompare(b[this.props.sortByKey]);
      });
    }
    const formattedDataRows = sortedDataRows.map((row) => {
      const el = <DataTableElement key={`row-${i}`} element={row} index={i} formatter={this.props.dataRowFormatter} />;
      i++;
      return el;
    });

    return formattedDataRows;
  },
  filterDataRows(filteredRows) {
    this.setState({ filteredRows });
  },
  render() {
    let filter;
    if (this.props.filterKeys.length !== 0) {
      filter = (
        <div className="row">
          <div className="col-md-8">
            <TypeAheadDataFilter id={`${this.props.id}-data-filter`}
                                 label={this.props.filterLabel}
                                 data={this.state.rows}
                                 displayKey={this.props.displayKey}
                                 filterBy={this.props.filterBy}
                                 filterSuggestions={this.props.filterSuggestions}
                                 searchInKeys={this.props.filterKeys}
                                 onDataFiltered={this.filterDataRows} />
          </div>
          <div className="col-md-4">
            {this.props.children}
          </div>
        </div>
      );
    }

    let data;
    if (this.state.rows.length === 0) {
      data = <p>{this.props.noDataText}</p>;
    } else if (this.state.filteredRows.length === 0) {
      data = <p>Filter does not match any data.</p>;
    } else {
      data = (
        <table className={`table ${this.props.className}`}>
          <thead>
            {this.getFormattedHeaders()}
          </thead>
          <tbody>
            {this.getFormattedDataRows()}
          </tbody>
        </table>
      );
    }

    return (
      <div>
        {filter}
        <div className={`row ${this.props.rowClassName}`}>
          <div className="col-md-12">
            <div id={this.props.id} className="data-table table-responsive">
              {data}
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default DataTable;
