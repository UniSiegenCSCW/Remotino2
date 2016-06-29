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
    ports: PropTypes.array.isRequired,
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
              <FontAwesome name="refresh" /> Refresh
            </Link>
            <ul>
            {
              ports.map((port) => (
                <li key={port} >
                  <Link onClick={() => connectToBoard(port)}>
                    {port}
                  </Link>
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
