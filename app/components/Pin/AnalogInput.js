import React, { PropTypes } from 'react';
import { AreaChart } from 'rd3';

const AnalogInput = ({ values, min, max }) => {
  // TODO: add translations
  if (values.length === 0) return <div><p>No data</p></div>;

  const data = [
    { name: 'series1', values },
  ];

  return (
    <div>
      <p className="nomargin">
        Value: {Math.round(values[0].y)}%
        (
        raw: {Math.round(values[0].y * 10.23)},
        min: {Math.round(min * 10.23)},
        max: {Math.round(max * 10.23)}
        )
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
};

AnalogInput.propTypes = {
  values: PropTypes.array.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
};

export default AnalogInput;
