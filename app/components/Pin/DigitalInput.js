import React, { PropTypes } from 'react';
import { AreaChart } from 'rd3';

const DigitalInput = props => {
  // TODO: add translations
  if (props.values.length === 0) return <div><p>No data</p></div>;

  const data = [
    {
      name: 'series1',
      values: props.values,
    },
  ];

  return (
    <div>
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
        domain={{ y: [0, 1] }}
        gridHorizontal
      />
    </div>
  );
};

DigitalInput.propTypes = {
  values: PropTypes.array.isRequired,
};

export default DigitalInput;
