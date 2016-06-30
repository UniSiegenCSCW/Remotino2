import React, { Component, PropTypes } from 'react';
import { CONNECTION_STATE } from '../reducers/microcontrollerEnums';
import './Home.sass';
import FontAwesome from 'react-fontawesome';
import Microcontroller from '../containers/Microcontroller';
import Link from '../components/Link';

export default class Home extends Component {
  static propTypes = {
    connectToBoard: PropTypes.func.isRequired,
    detectPorts: PropTypes.func.isRequired,
    connectionState: PropTypes.number.isRequired,
    ports: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { detectPorts } = this.props;
    detectPorts();
  }

  render() {
    const {
      connectToBoard,
      connectionState,
      detectPorts,
      ports,
    } = this.props;

    switch (connectionState) {
      case CONNECTION_STATE.NOT_CONNECTED:
        return (
          <div className="port-list">
            <Link onClick={detectPorts}>
              {ports.refreshing ?
                <FontAwesome spin name="spinner" /> :
                <FontAwesome name="refresh" />} Refresh
            </Link>
            <ul>
            {
              ports.names.map((port) => (
                <li key={port.path} className="port">
                  <Link className="port__header" onClick={() => connectToBoard(port.path)}>
                    {port.name} ({port.path})
                  </Link>
                  {port.image ?
                    <img
                      className="port__image"
                      src={`./utils/boards/${port.image}`}
                      alt={`${port.name} icon`}
                    /> : ''}
                </li>
              ))
            }
            </ul>
          </div>
        );
      case CONNECTION_STATE.CONNECTING:
        return (
          <div className="port-list">
            <p>
              <FontAwesome spin name="spinner" /> Connecting...
            </p>
          </div>
        );
      case CONNECTION_STATE.CONNECTED:
        return <Microcontroller />;
      default:
        return <div />;
    }
  }
}
