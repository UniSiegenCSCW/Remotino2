import React, { Component, PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import Translate from 'react-translate-component';
import '../utils/l10n.js';
import { CONNECTION_STATE } from '../reducers/microcontrollerEnums';
import Microcontroller from '../containers/Microcontroller';
import Link from '../components/Link';
import LocaleSwitcher from '../containers/LocaleSwitcher';
import './Home.sass';

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
    const { connectToBoard, connectionState, detectPorts, ports } = this.props;

    const portElem = (port) => (
      <li key={port.path}>
        <Link className="port" onClick={() => connectToBoard(port.path)}>
          <p>{port.name} ({port.path})</p>
          {port.image ?
            <img className="port__image" src={`./utils/boards/${port.image}`} alt={port.name} />
            : ''}
        </Link>
      </li>
    );

    switch (connectionState) {
      case CONNECTION_STATE.NOT_CONNECTED:
        return (
          <div className="port-list">
            <div>
              <h4>Sprache / Language</h4>
              <LocaleSwitcher locale="de">Deutsch</LocaleSwitcher>
              <LocaleSwitcher locale="en">English</LocaleSwitcher>
            </div>
            <div>
              <h4>Verbundene Geräte / Connected Boards</h4>
              <Link onClick={detectPorts}>
                { ports.remaining > 0 ?
                  <FontAwesome spin name="spinner" /> :
                    <FontAwesome name="refresh" />
                }
                <Translate content="home.refresh" />
              </Link>
              <ul>{ports.names.map(portElem)}</ul>
            </div>
          </div>
        );
      case CONNECTION_STATE.CONNECTING:
        return (
          <div className="port-list">
            <p><FontAwesome spin name="spinner" /> Connecting...</p>
          </div>
        );
      case CONNECTION_STATE.CONNECTED:
        return <Microcontroller />;
      default:
        return <div />;
    }
  }
}
