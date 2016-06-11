import React, { Component, PropTypes } from 'react';
import rd3 from 'rd3';

export default class DigitalInput extends Component {
  static propTypes = {
    listen: PropTypes.func.isRequired,
    values: PropTypes.array.isRequired,
  };

  render() {
    const {
      listen,
      values,
    } = this.props;

    const data = [
      {
        name: 'series1',
        values,
      },
    ];

    const AreaChart = rd3.AreaChart;
    const chart = values.length === 0 ? <p>No data</p> : (
      <AreaChart
        data={data}
        width="100%"
        height={200}
        viewBoxObject={{
          x: 0,
          y: 0,
          width: 500,
          height: 200
        }}
        title="Line Chart"
        xAxisTickValues={[]}
        domain={{ y: [0, 1] }}
        gridHorizontal
      />
    );

    return (
      <div>
        <span className="btn--blue btn--s px1 mx1" onClick={() => listen()}>
          Listen
        </span>
        {chart}
      </div>
    );
  }
}
