import React, { Component, PropTypes } from 'react';
import LineChart from '../Graph/LineChart';

export default class AnalogInput extends Component {
  // TODO: add translations
  if (values.length === 0) return <div><p>No data</p></div>;
  static propTypes = {
    values: PropTypes.array.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
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
