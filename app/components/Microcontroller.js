import React, { Component, PropTypes } from 'react';
import Translate from 'react-translate-component';
import '../utils/l10n.js';
import PinList from '../containers/PinList';
import './Microcontroller.sass';
import ReplayControls from '../containers/ReplayControls';
import ImportExport from '../containers/ImportExport';

export default class Microcontroller extends Component {
  static propTypes = {
    visibilityFilter: PropTypes.object.isRequired,
    setVisibilityFilter: PropTypes.func.isRequired,
  };

  render() {
    const {
      visibilityFilter,
      setVisibilityFilter,
    } = this.props;

    const setFilter = (name) => (e) => setVisibilityFilter(name, e.target.checked);
    const {
      showDisabled,
      showDigitalIn,
      showAnalogIn,
      showDigitalOut,
      showAnalogOut,
    } = visibilityFilter;

    return (
      <div id="main">
        <header>
          <div className="header-left">
            <div>
              <div className="header--filter">
                <div className="filter-description">
                  <p><Translate content="microcontroller.filter_pins" />:</p>
                </div>
                <div className="filter-section">
                  <input
                    type="checkbox"
                    name="Disabled"
                    checked={showDisabled}
                    onChange={setFilter('showDisabled')}
                  />
                  <Translate content="microcontroller.hidden" />
                </div>
                <div className="filter-section">
                  <div>
                    <input
                      type="checkbox" name="DigitalIn"
                      checked={showDigitalIn} onChange={setFilter('showDigitalIn')}
                    />
                    <Translate content="microcontroller.digital_in" />
                  </div>
                  <div>
                    <input
                      type="checkbox" name="DigitalOut"
                      checked={showDigitalOut} onChange={setFilter('showDigitalOut')}
                    />
                    <Translate content="microcontroller.digital_out" />
                  </div>
                </div>
                <div className="filter-section">
                  <div>
                    <input
                      type="checkbox" name="AnalogIn"
                      checked={showAnalogIn} onChange={setFilter('showAnalogIn')}
                    />
                    <Translate content="microcontroller.analog_in" />
                  </div>
                  <div>
                    <input
                      type="checkbox" name="AnalogOut"
                      checked={showAnalogOut} onChange={setFilter('showAnalogOut')}
                    />
                    <Translate content="microcontroller.analog_out" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="header-right">
            <ImportExport />
          </div>
        </header>
        <PinList />
        <ReplayControls />
      </div>
    );
  }
}
