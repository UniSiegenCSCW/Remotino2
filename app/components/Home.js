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
    searchFlashableBoards: PropTypes.func.isRequired,
    connectionState: PropTypes.number.isRequired,
    ports: PropTypes.object.isRequired,
    flash: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { detectPorts } = this.props;
    detectPorts();
  }

  componentWillReceiveProps(nextProps) {
    // this will restart the port detection after successfull flash
    if (nextProps.flash.flashDone
      && nextProps.flash.flashDone !== this.props.flash.flashDone) {
      this.props.detectPorts();
    }
  }

  render() {
    const {
      connectToBoard,
      connectionState,
      detectPorts,
      searchFlashableBoards,
      ports,
      flash,
    } = this.props;

    switch (connectionState) {
      case CONNECTION_STATE.NOT_CONNECTED:
        return (
          <div className="port-list">
            <div>
              <LocaleSwitcher locale="de">Deutsch</LocaleSwitcher>
              <LocaleSwitcher locale="en">English</LocaleSwitcher>
            </div>
            <div className="refresh">
              <Link onClick={detectPorts}>
                {ports.refreshing ?
                  <FontAwesome spin name="spinner" /> :
                  <FontAwesome name="refresh" />} <Translate content="home.refresh" />
              </Link>
            </div>
            <div>
              <ul>
                {
                ports.names.map((port) => (
                  <li key={port.path}>
                    <Link className="port" onClick={() => connectToBoard(port.path)}>
                      <div>
                        {port.name} ({port.path})
                      </div>
                      {port.image ?
                        <img
                          className="port__image"
                          src={`./utils/boards/${port.image}`}
                          alt={`${port.name} icon`}
                        /> : ''}
                    </Link>
                  </li>
                ))
              }
              </ul>
            </div>
            <div>
              <Link onClick={searchFlashableBoards}>
                <Translate content="home.flash" />
              </Link>
            </div>
          </div>
        );
      case CONNECTION_STATE.FLASHING:
        return (
          <div className="port-list">
            <p>
              <FontAwesome
                spin
                name="spinner"
              /> <Translate
                with={{ boardType: flash.boardType }}
                content="home.flashing"
              />
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
