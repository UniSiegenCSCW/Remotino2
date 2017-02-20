import React, { Component, PropTypes } from 'react';
import LineChart from '../Graph/LineChart';

export default class AnalogOutput extends Component {
  static propTypes = {
    write: PropTypes.func.isRequired,
    values: PropTypes.array.isRequired,
    value:	React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    showMarker: PropTypes.bool,
    markerTime: PropTypes.number,
    autoscroll: PropTypes.bool,
    interval: PropTypes.array,
    onIntervalUpdate: React.PropTypes.func,
    onAutoScrollUpdate: React.PropTypes.func,
  };

  render() {
    const {
      values,
      showMarker,
      markerTime,
      onIntervalUpdate,
      onAutoScrollUpdate,
      autoscroll,
      interval
    } = this.props;

    const chart = (
      <LineChart
        yMin={0}
        yMax={255}
        data={values}
        width="100%"
        height="100%"
        onIntervalUpdate={onIntervalUpdate}
        onAutoScrollUpdate={onAutoScrollUpdate}
        interval={interval}
        autoscroll={autoscroll}
        showMarker={showMarker}
        markerTime={markerTime}
      />
    );

    return chart;
  }
}
