import React, { Component, PropTypes } from 'react';
import rd3 from 'rd3';

export default class DigitalInput extends Component {
  static propTypes = {
    values: PropTypes.array.isRequired,
  };

  render() {
    const { values } = this.props;

    const data = [
      {
        name: 'series1',
        values,
      },
    ];

    const AreaChart = rd3.AreaChart;
    const chart = values.length === 0 ? <p>No data</p> : (
      <div>
        <p className="nomargin">
          Value: {Math.round(values[0].y)}%
          ({Math.round(values[0].y * 10.23)})
        </p>
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
          xAxisTickValues={[]}
          domain={{ y: [0, 100] }}
          gridHorizontal
        />
      </div>
    );

    return chart;
  }
}
