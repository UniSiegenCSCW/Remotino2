import React, { Component, PropTypes } from 'react';
import Pin from './Pin';
import FilterLink from '../containers/FilterLink';
import { CONNECTION_STATE } from '../reducers/microcontrollerEnums';
import spinner from '../static-html/spinner.html';
import { defaultTo } from 'ramda';
import styles from './Microcontroller.sass'; // eslint-disable-line no-unused-vars

export default class Microcontroller extends Component {
  static propTypes = {
    changeMode: PropTypes.func.isRequired,
    setEnabled: PropTypes.func.isRequired,
    connectToBoard: PropTypes.func.isRequired,
    listenToPinChanges: PropTypes.func.isRequired,
    pins: PropTypes.array.isRequired,
    connectionState: PropTypes.number.isRequired,
    mapping: PropTypes.object.isRequired,
  };

  render() {
    const {
      changeMode,
      setEnabled,
      connectToBoard,
      listenToPinChanges,
      pins,
      connectionState,
      mapping,
    } = this.props;

    const connectView = (currentState) => {
      switch (currentState) {
        case CONNECTION_STATE.NOT_CONNECTED:
          return (
            <button
              className="button-submit"
              onClick={connectToBoard}
            >
            Connect to Arduino
            </button>);
        case CONNECTION_STATE.CONNECTING:
          return (
            <p><span dangerouslySetInnerHTML={{ __html: spinner }} /> Connecting...</p>
          );
        default:
          return (
            <div>
              <p>{`Connected to ${mapping.name}`}</p>
              <p>
                Show:
                {" "}
                <FilterLink filter="SHOW_ALL">
                  All
                </FilterLink>
                {", "}
                <FilterLink filter="SHOW_DIGITAL">
                  Digital
                </FilterLink>
                {", "}
                <FilterLink filter="SHOW_ANALOG">
                  Analog
                </FilterLink>
                {", "}
                <FilterLink filter="SHOW_ENABLED">
                  Enabled
                </FilterLink>
              </p>
            </div>
          );
      }
    };

    const pinView = (pin) => {
      const pinName = defaultTo(`Pin ${pin.id}`, mapping.pins[pin.id].name);
      const tags = defaultTo([], mapping.pins[pin.id].categories);
      return (
        <Pin
          key={pin.id}
          values={pin.values}
          name={pinName}
          tags={tags}
          changeMode={changeMode}
          setEnabled={setEnabled}
          pin={pin}
          listen={listenToPinChanges}
        />
      );
    };

    return (
      <div>
        <header>
          {connectView(connectionState)}
        </header>
        <div className="pin-list">
          {pins.map(pinView)}
        </div>
      </div>
    );
  }
}
