import React, { PropTypes } from 'react';
import Translate from 'react-translate-component';
import '../utils/l10n.js';
import PinList from '../containers/PinList';
import './Microcontroller.sass';
import Timeline from '../containers/Timeline';
import ImportExport from '../containers/ImportExport';
import Checkbox from './Checkbox';

const Microcontroller = props => {
  const { visibilityFilter, setVisibilityFilter } = props;
  const setFilter = (name) => (checked) => setVisibilityFilter(name, checked);
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
                <Checkbox checked={showDisabled} onChange={setFilter('showDisabled')} />
                <Translate content="microcontroller.hidden" />
              </div>
              <div className="filter-section">
                <div>
                  <Checkbox checked={showDigitalIn} onChange={setFilter('showDigitalIn')} />
                  <Translate content="microcontroller.digital_in" />
                </div>
                <div>
                  <Checkbox checked={showDigitalOut} onChange={setFilter('showDigitalOut')} />
                  <Translate content="microcontroller.digital_out" />
                </div>
              </div>
              <div className="filter-section">
                <div>
                  <Checkbox checked={showAnalogIn} onChange={setFilter('showAnalogIn')} />
                  <Translate content="microcontroller.analog_in" />
                </div>
                <div>
                  <Checkbox checked={showAnalogOut} onChange={setFilter('showAnalogOut')} />
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
      <div className="replay">
        <Timeline />
      </div>
    </div>
  );
};

Microcontroller.propTypes = {
  visibilityFilter: PropTypes.object.isRequired,
  setVisibilityFilter: PropTypes.func.isRequired,
};

export default Microcontroller;
