import * as five from 'johnny-five';
import { values, mapObjIndexed, invertObj, has, contains } from 'ramda';
import { MODES, MODE_NAMES } from '../reducers/microcontrollerEnums';
import { identify } from '../utils/boards';
import { timestamp } from '../utils/utils';

let board;
const sensors = {};

export const ADD_REPLAY_EVENT = 'ADD_REPLAY_EVENT';
export function addReplayEvent(replay, description, time = new Date()) {
  return {
    type: ADD_REPLAY_EVENT,
    replay,
    description,
    time,
  };
}

export const UPDATE_PINS = 'UPDATE_PINS';
export function updatePins(pins) {
  return {
    type: UPDATE_PINS,
    pins,
  };
}

export const CONNECTING_TO_BOARD = 'CONNECTING_TO_BOARD';
export function connectingToBoard() {
  return {
    type: CONNECTING_TO_BOARD,
  };
}

export const CONNECTED_TO_BOARD = 'CONNECTED_TO_BOARD';
export function connectedToBoard() {
  return {
    type: CONNECTED_TO_BOARD,
  };
}

export const IDENTIFIED_BOARD = 'IDENTIFIED_BOARD';
export function identifiedBoard(mapping) {
  return {
    type: IDENTIFIED_BOARD,
    pins: mapping.pins,
    name: mapping.name,
  };
}

export function connectToBoard() {
  const updatePinFromObj = (obj, id) => {
    const serialPorts = invertObj(board.io.SERIAL_PORT_IDs);
    const analogPins = board.io.analogPins;
    const idNumber = parseInt(id, 10);
    return Object.assign({}, obj, {
      id,
      supportedModes: [16, ...obj.supportedModes],
      mode: 16,
      isAnalogPin: contains(idNumber, analogPins),
      isHWSerialPort: has(idNumber, serialPorts) && serialPorts[idNumber].startsWith('HW'),
      isSWSerialPort: has(idNumber, serialPorts) && serialPorts[idNumber].startsWith('SW'),
    });
  };

  return (dispatch) => {
    dispatch(connectingToBoard());
    board = new five.Board({ repl: false });
    board.on('ready', () => {
      dispatch(connectedToBoard());

      const actions = values(mapObjIndexed(updatePinFromObj, board.io.pins));
      dispatch(updatePins(actions));

      const mapping = identify(board);
      if (mapping) {
        dispatch(identifiedBoard(mapping));
      }
    });
  };
}

export const PIN_VALUE_CHANGED = 'PIN_VALUE_CHANGED';
export function pinValueChanged(id, value) {
  return {
    type: PIN_VALUE_CHANGED,
    timestamp: timestamp(),
    id,
    value,
  };
}

export const START_LISTENING_TO_PIN_CHANGES = 'START_LISTENING_TO_PIN_CHANGES';
export function startListeningToPinChanges(id) {
  return {
    type: START_LISTENING_TO_PIN_CHANGES,
    id,
  };
}

export const CHANGE_MODE = 'CHANGE_MODE';
export function changeMode(pin, mode) {
  return (dispatch) => {
    const pinMode = parseInt(mode, 10);
    board.pinMode(pin.id, mode);

    dispatch({
      type: CHANGE_MODE,
      id: pin.id,
      mode: pinMode,
    });

    dispatch(addReplayEvent({ type: CHANGE_MODE, pin, mode },
                            `${pin.name}: Mode = ${MODE_NAMES[mode]}`));

    // Disable the old listener
    if (sensors[pin.id]) {
      sensors[pin.id].disable();
    }

    if (pinMode === MODES.ANALOG) {
      const sensor = new five.Sensor({ pin: pin.analogChannel, freq: 200 });
      sensor.on('data', function onChange() {
        dispatch(pinValueChanged(pin.id, this.fscaleTo([0, 100])));
      });

      sensors[pin.id] = sensor;
    } else if (pinMode === MODES.INPUT) {
      const sensor = new five.Sensor.Digital({ pin: pin.id, freq: 200 });
      sensor.on('data', function onChange() {
        dispatch(pinValueChanged(pin.id, this.value));
      });

      sensors[pin.id] = sensor;
    }
  };
}

export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';
export function setVisibilityFilter(property, value) {
  return {
    type: SET_VISIBILITY_FILTER,
    property,
    value,
  };
}

export const SET_ENABLED = 'SET_ENABLED';
export function setEnabled(id, value) {
  return {
    type: SET_ENABLED,
    id,
    value,
  };
}

export const DIGITAL_WRITE = 'DIGITAL_WRITE';
export function digitalWrite(id, value, name) {
  const pinId = parseInt(id, 10);
  board.digitalWrite(pinId, value);

  return addReplayEvent({ type: DIGITAL_WRITE, id, value },
                        `${name}: Digital write ${value}`);
}

export const ANALOG_WRITE = 'ANALOG_WRITE';
export function analogWrite(id, value, name) {
  const pinId = parseInt(id, 10);
  board.analogWrite(pinId, value);

  return addReplayEvent({ type: ANALOG_WRITE, id, value },
                        `${name}: Analog write ${value}`);
}

export const START_RECORDING = 'START_RECORDING';
export function startRecording() {
  return {
    type: START_RECORDING,
    timestamp: timestamp(),
  };
}

export const STOP_RECORDING = 'STOP_RECORDING';
export function stopRecording() {
  return { type: STOP_RECORDING };
}

export const START_REPLAY = 'START_REPLAY';
export function startReplay() {
  return { type: START_REPLAY };
}

export const STOP_REPLAY = 'STOP_REPLAY';
export function stopReplay() {
  return { type: STOP_REPLAY };
}

export const CHANGE_RANGE = 'CHANGE_RANGE';
export function changeRange(range) {
  return {
    type: CHANGE_RANGE,
    start: range.start,
    end: range.end,
  };
}

export const REMOVE_ITEM = 'REMOVE_ITEM';
export function removeItem(id) {
  return {
    type: REMOVE_ITEM,
    id,
  };
}

export const MOVE_ITEM = 'MOVE_ITEM';
export function moveItem(id, time) {
  return {
    type: MOVE_ITEM,
    id,
    time,
  };
}
