// import * as five from 'johnny-five';
import { filter, values } from 'ramda';
import { MODES } from '../reducers/microcontrollerEnums';

const pinName = (pin) => (pin.name.replace(' ', ''));
const pinInit = (pin) => {
  if (pin.mode === MODES.ANALOG) {
    // For analog pins pinName(pin) would be A0, A1, ...
    // and this constants are defined by default
    return '';
  } else {
    return `const int ${pinName(pin)} = ${pin.id};`;
  }
};

function pinValue(pin) {
  if (pin.mode === MODES.INPUT || pin.mode === MODES.ANALOG) {
    return `sensor_${pinName(pin)}_state`;
  }
}

function digitalOut(pin) {
  const level = pin.value === 0 ? 'LOW' : 'HIGH';
  return (
    `${pinInit(pin)}\n\n` +
    '// this runs once when you power the board\n' +
    'void setup() {\n' +
    '  // initialize pin as an output\n' +
    `  pinMode(${pinName(pin)}, OUTPUT);\n` +
    '}\n\n' +
    '// this runs over and over again forever\n' +
    'void loop() {\n' +
    '  // turn the pin on (HIGH = on, LOW = off)\n' +
    `  digitalWrite(${pinName(pin)}, ${level});\n` +
    '}'
  );
}

function digitalIn(pin) {
  return (
    `${pinInit(pin)}\n\n` +
    `int ${pinValue(pin)} = 0;\n\n` +
    '// this runs once when you power the board\n' +
    'void setup() {\n' +
    '  // initialize pin as an input\n' +
    `  pinMode(${pinName(pin)}, INPUT);\n` +
    '}\n\n' +
    '// this runs over and over again forever\n' +
    'void loop() {\n' +
    '  // read the value of the sensor\n' +
    `  ${pinValue(pin)} = digitalRead(${pinName(pin)});\n\n` +
    `  if (${pinValue(pin)} == HIGH) {\n` +
    '    // if pressed do this\n' +
    '  } else {\n' +
    '    // if not, do this\n' +
    '  }\n' +
    '}'
  );
}

function analogOut(pin) {
  return (
    `${pinInit(pin)}\n\n` +
    '// this runs once when you power the board\n' +
    'void setup() {\n' +
    '   // initialize pin as an output\n' +
    `   pinMode(${pinName(pin)}, OUTPUT);\n` +
    ' }\n\n' +
    ' // this runs over and over again forever\n' +
    ' void loop() {\n' +
    '   // turn the pin on (raw value, 0 to 255)\n' +
    `   analogWrite(${pinName(pin)}, ${Math.round(pin.value)});\n` +
    ' }'
  );
}

function analogIn(pin) {
  return (
    `int ${pinValue(pin)} = 0;\n\n` +
    '// this runs once when you power the board\n' +
    'void setup() {\n' +
    '  // initialize pin as an input\n' +
    `  pinMode(${pinName(pin)}, INPUT);\n` +
    '}\n\n' +
    '// this runs over and over again forever\n' +
    'void loop() {\n' +
    '  // read the value of the sensor\n' +
    `  ${pinValue(pin)} = analogRead(${pinName(pin)});\n\n` +
    '  // check if the sensor value is higher than some limit\n' +
    `  if (${pinValue(pin)} > 100) {\n` +
    '    // if, do this\n' +
    '  } else {\n' +
    '    // if not, do this\n' +
    '  }\n' +
    '}'
  );
}

export function getCode(pin) {
  switch (pin.mode) {
    case MODES.INPUT:
      return digitalIn(pin);
    case MODES.ANALOG:
      return analogIn(pin);
    case MODES.OUTPUT:
      return digitalOut(pin);
    case MODES.PWM:
      return analogOut(pin);
    default:
      return '';
  }
}

export function getFullCode(pins) {
  let code = '';
  const activePins = filter(pin => (pin.mode !== MODES.NOT_SET), values(pins));
  activePins.forEach(pin => (code += `${pinInit(pin)}\n`));

  const digitalInPins = filter(pin => pin.mode === MODES.INPUT, values(pins));
  const analogInPins = filter(pin => pin.mode === MODES.ANALOG, values(pins));
  const digitalOutPins = filter(pin => pin.mode === MODES.OUTPUT, values(pins));
  const analogOutPins = filter(pin => pin.mode === MODES.PWM, values(pins));

  digitalInPins.forEach(pin => (code += `int ${pinValue(pin)} = 0;\n`));
  analogInPins.forEach(pin => (code += `int ${pinValue(pin)} = 0;\n`));

  code += '// this runs once when you power the board\n';
  code += 'void setup() {\n';
  if (digitalOutPins.length + analogOutPins.length > 0) {
    code += '  // initialize output pins\n';
    digitalOutPins.forEach(pin => (code += `  pinMode(${pinName(pin)}, OUTPUT);\n`));
    analogOutPins.forEach(pin => (code += `  pinMode(${pinName(pin)}, OUTPUT);\n`));
  }
  if (digitalInPins.length + analogInPins.length > 0) {
    code += '  // initialize input pins\n';
    digitalInPins.forEach(pin => (code += `  pinMode(${pinName(pin)}, INPUT);\n`));
    analogInPins.forEach(pin => (code += `  pinMode(${pinName(pin)}, INPUT);\n`));
  }
  code += '}\n';

  code += '// this runs over and over again forever\n';
  code += 'void loop() {\n';
  digitalOutPins.forEach(pin => {
    const level = pin.value === 0 ? 'LOW' : 'HIGH';
    code += '  // turn the pin on (HIGH = on, LOW = off)\n';
    code += `  digitalWrite(${pinName(pin)}, ${level});\n`;
  });
  analogOutPins.forEach(pin => {
    code += '   // turn the pin on (raw value, 0 to 255)\n';
    code += `  analogWrite(${pinName(pin)}, ${Math.round(pin.value)});\n`;
  });
  digitalInPins.forEach(pin => {
    code += `  ${pinValue(pin)} = digitalRead(${pinName(pin)});\n`;
  });
  analogInPins.forEach(pin => {
    code += `  ${pinValue(pin)} = analogRead(${pinName(pin)});\n`;
  });
  code += '\n\n';
  code += '  // insert your code here\n';
  code += '}';

  return code;
}
