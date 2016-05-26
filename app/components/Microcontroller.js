import React, { Component, PropTypes } from 'react';
import Pin from './Pin';
import { CONNECTION_STATE } from '../reducers/microcontrollerEnums';
import spinner from '../static-html/spinner.html';

export default class Microcontroller extends Component {
  static propTypes = {
    microcontroller: PropTypes.object.isRequired,
    changeMode: PropTypes.func.isRequired,
    connectToBoard: PropTypes.func.isRequired,
    listenToPinChanges: PropTypes.func.isRequired
  };

  render() {
    const { changeMode, connectToBoard, microcontroller, listenToPinChanges } = this.props;
    const { pins, connectionState } = microcontroller;

    const createSpinner = () => ({ __html: spinner });

    const connectView = (currentState) => {
      switch (currentState) {
        case CONNECTION_STATE.NOT_CONNECTED:
          return <div className="btn--blue" onClick={connectToBoard}>Connect to Arduino</div>;
        case CONNECTION_STATE.CONNECTING:
          return (<div className="btn--blue">
            <span dangerouslySetInnerHTML={createSpinner()} /> Connecting...
          </div>);
        default:
          return <div></div>;
      }
    };

    const pinView = (pin) => (
      <Pin key={pin.id} changeMode={changeMode} pin={pin} listen={listenToPinChanges} />
    );

    return (
      <div>
        {connectView(connectionState)}
        <ul>
          {pins.map(pinView)}
        </ul>
      </div>
    );
  }
}
