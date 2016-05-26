import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import Pin from './Pin';
import { CONNECTION_STATE } from '../reducers/microcontrollerEnums';


export default class Microcontroller extends Component {
  static propTypes = {
    microcontroller: PropTypes.object.isRequired,
    changeMode: PropTypes.func.isRequired,
    connectToBoard: PropTypes.func.isRequired,
    listenToPinChanges: PropTypes.func.isRequired
  };

  render() {
    const {changeMode, connectToBoard, microcontroller, listenToPinChanges} = this.props;
    const {pins, connectionState} = microcontroller;

    const createSpinner = () => ({__html: require('../static-html/spinner.html')});

    const connectView = (connectionState) => {
        switch (connectionState){
          case CONNECTION_STATE.NOT_CONNECTED:
                return <div className="btn--blue" onClick={connectToBoard}>Connect to Arduino</div>;
          case CONNECTION_STATE.CONNECTING:
                return <div className="btn--blue"> <span dangerouslySetInnerHTML={createSpinner()}/> Connecting...</div>
          default:
                return <div></div>;
        }
    };
    return (
      <div>
        {connectView(connectionState)}
        <ul>
          {pins.map((pin)=> <Pin key={pin.id} changeMode={changeMode} pin={pin} listen={listenToPinChanges}/>)}
        </ul>
      </div>
    );
  }
}
