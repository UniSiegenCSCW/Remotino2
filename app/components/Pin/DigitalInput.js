import React, { Component, PropTypes } from 'react';
import LineChart from '../Graph/LineChart';

export default class DigitalInput extends Component {
  static propTypes = {
    values: PropTypes.array.isRequired,
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
        yMax={1}
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
