import { invertObj } from 'ramda';
export const CONNECTION_STATE = Object.freeze({
  NOT_CONNECTED: 0,
  CONNECTING: 1,
  CONNECTED: 2
});

export const MODE_NAMES = Object.freeze({
  0: "Digital Input",
  1: "Digital Output",
  2: "Analog Input",
  3: "Analog Output",
  16: "Not Set"
});

export const MODES = Object.freeze({
  INPUT: 0,
  OUTPUT: 1,
  ANALOG: 2,
  PWM: 3,
  NOT_SET: 16
});

