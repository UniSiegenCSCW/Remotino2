import React, { Component, PropTypes } from 'react';
import LineChart from '../Graph/LineChart';

export default class AnalogInput extends Component {
  static propTypes = {
    values: React.PropTypes.arrayOf(React.PropTypes.shape({
      x: React.PropTypes.number,
      y: React.PropTypes.number,
    })),
//    min: PropTypes.number.isRequired,
//    max: PropTypes.number.isRequired,
    showMarker: PropTypes.bool,
    markerTime: PropTypes.number,
    autoscroll: PropTypes.bool,
    interval: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
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
