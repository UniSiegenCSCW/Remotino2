import React, { Component, PropTypes } from 'react';
import { MODE_NAMES, MODES } from '../reducers/microcontrollerEnums';
// import { intersection, range, propOr, ifElse } from 'ramda';
import { intersection, propOr, ifElse } from 'ramda';
import styles from './Pin.sass'; // eslint-disable-line no-unused-vars
import rd3 from 'rd3';

export default class Pin extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired,
    pin: PropTypes.object.isRequired,
    changeMode: PropTypes.func.isRequired,
    setEnabled: PropTypes.func.isRequired,
    listen: PropTypes.func.isRequired
  };

  render() {
    const { changeMode, setEnabled, listen, pin, name, tags } = this.props;
    const { id, mode, report, values } = pin;

    const supportedModes = intersection(
      pin.supportedModes,
      Object.keys(MODE_NAMES).map(k => parseInt(k, 10))
    );
    const getModeDescriptionForModeNumber = (num) => propOr('Not Set', num, MODE_NAMES);

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
        yAxisLabel="Value (%)"
        xAxisTickValues={[]}
        xAxisLabel="Elapsed Time"
        domain={{ y: [0, 100] }}
        gridHorizontal
      />
    );

    const modeSelector = (
      <select
        defaultValue="{defaultMode}"
        onChange={event => changeMode(id, event.target.value)}
        disabled={supportedModes.length === 0}
      >
        {supportedModes.map((supportedMode) => (
          <option key={supportedMode} value={supportedMode}>
            {getModeDescriptionForModeNumber(supportedMode)}
          </option>
          )
        )}
      </select>
    );

    const pinClass = pin.isAnalogPin ? 'pin pin--analog' : 'pin pin--digital';

    return (
      <div className={pinClass}>
        <div className="pin__header">
          <h2 className="pin__name">{name}</h2>
          {tags.map((tag) =>
            <div key={tag} className="pin__tag">{tag}</div>
          )}
        </div>
        <div className="pin__body">
          Reporting: {report},
          {modeSelector}

          {ifElse(() => mode === MODES.INPUT || mode === MODES.ANALOG,
            () => (
              <span className="btn--blue btn--s px1 mx1" onClick={() => listen(id, mode, name)}>
                Listen
                {chart}
              </span>
            ),
            () =>
              <span>
                {mode} {MODES.ANALOG}
              </span>)()}
        </div>
        <div className="pin__footer">
          <input
            type="checkbox"
            name="Enabled"
            checked={pin.enabled}
            onChange={(e) => setEnabled(pin.id, e.target.checked)}
          />
          Enabled
        </div>
      </div>
    );
  }
}
