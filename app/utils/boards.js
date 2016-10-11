import { difference, equals } from 'ramda';
import ArduinoProMicro from './boards/Arduino_Pro_Micro.json';
import ArduinoZero from './boards/Arduino_Zero.json';
import ArduinoMicro from './boards/Arduino_Micro.json';
import ArduinoDue from './boards/Arduino_Due.json';
import ArduinoLeonardo from './boards/Arduino_Leonardo.json';
import ArduinoMini from './boards/Arduino_Mini.json';
import ArduinoMKR1000 from './boards/Arduino_MKR1000.json';
import ArduinoUNO from './boards/Arduino_UNO.json';
import Arduino101 from './boards/Arduino_101.json';
import ArduinoProMini from './boards/Arduino_Pro_Mini.json';
import ArduinoNano from './boards/Arduino_Nano.json';
import ArduinoMega from './boards/Arduino_Mega.json';
import ArduinoYun from './boards/Arduino_Yun.json';

export default function identify(board) {
  const boards = [
    ArduinoProMicro,
    ArduinoZero,
    ArduinoMicro,
    ArduinoDue,
    ArduinoLeonardo,
    ArduinoMini,
    ArduinoMKR1000,
    ArduinoUNO,
    Arduino101,
    ArduinoProMini,
    ArduinoNano,
    ArduinoMega,
    ArduinoYun
  ];

  // Return if the board type is already known
  if (board.type === 'MEGA') return ArduinoMega;

  const { ANALOG, PWM, OUTPUT } = board.MODES;
  const analogPins = [];
  const pwmPins = [];
  const outputPins = [];

  Object.keys(board.pins).forEach((key) => {
    const pin = board.pins[key];

    if (pin.supportedModes.includes(ANALOG)) {
      analogPins.push(key);
    }
    if (pin.supportedModes.includes(PWM)) {
      pwmPins.push(key);
    }
    if (pin.supportedModes.includes(OUTPUT)) {
      outputPins.push(key);
    }
  });

  const digitalPins = difference(outputPins, analogPins);

  return boards.find((board2) => {
    const analogPins2 = [];
    const pwmPins2 = [];
    let digitalPins2 = [];

    Object.keys(board2.pins).forEach((key) => {
      const pin = board2.pins[key];

      if (pin.categories.includes('Analog')) {
        analogPins2.push(key);
      }
      if (pin.categories.includes('PWM')) {
        pwmPins2.push(key);
      }
      if (pin.categories.includes('Digital')) {
        digitalPins2.push(key);
      }
    });

    // exclude D0 & D1 (serial Rx & Tx on most arduinos)
    digitalPins2 = difference(digitalPins2, ['0', '1']);

    return equals(digitalPins.sort(), digitalPins2.sort()) &&
           equals(analogPins.sort(), analogPins2.sort()) &&
           equals(pwmPins.sort(), pwmPins2.sort());
  });
}
