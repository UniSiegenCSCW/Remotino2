import React, { Component, PropTypes } from 'react';
import Pin from './Pin';
import { CONNECTION_STATE } from '../reducers/microcontrollerEnums';
import spinner from '../static-html/spinner.html';
import { defaultTo, values } from 'ramda';

export default class Microcontroller extends Component {
  static propTypes = {
    microcontroller: PropTypes.object.isRequired,
    changeMode: PropTypes.func.isRequired,
    connectToBoard: PropTypes.func.isRequired,
    listenToPinChanges: PropTypes.func.isRequired
  };

  render() {
    const { changeMode, connectToBoard, microcontroller, listenToPinChanges } = this.props;
    const { pins, connectionState, mapping } = microcontroller;

    const connectView = (currentState) => {
      switch (currentState) {
        case CONNECTION_STATE.NOT_CONNECTED:
          return <div className="btn--blue" onClick={connectToBoard}>Connect to Arduino</div>;
        case CONNECTION_STATE.CONNECTING:
          return (<div className="btn--blue">
            <span dangerouslySetInnerHTML={{ __html: spinner }} /> Connecting...
          </div>);
        default:
          return <div></div>;
      }
    };

    const pinView = (pin) => {
      const name = defaultTo(`Pin ${pin.id}`, mapping[pin.id].name);
      const tags = defaultTo([], mapping[pin.id].categories);
      return (
        <Pin
          key={pin.id}
          values={pin.values}
          name={name}
          tags={tags}
          changeMode={changeMode}
          pin={pin}
          listen={listenToPinChanges}
        />
      );
    };

    return (
      <div>
        {connectView(connectionState)}
        <div className="pin-list">
          {values(pins).map(pinView)}
        </div>
      </div>
    );
  }
}
