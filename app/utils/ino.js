// import * as five from 'johnny-five';
import { MODES } from '../reducers/microcontrollerEnums';

function digitalOut(pin) {
  const name = pin.name.replace(' ', '');

  const level = pin.value === 0 ? 'LOW' : 'HIGH';
  return (
    `const int ${name} = ${pin.id};\n` +
    '\n' +
    '// this runs once when you power the board\n' +
    'void setup() {\n' +
    '  // initialize pin as an output.\n' +
    `  pinMode(${name}, OUTPUT);\n` +
    '}\n' +
    '\n' +
    '// this runs over and over again forever\n' +
    'void loop() {\n' +
    '  // turn the pin on (HIGH = on, LOW = off)\n' +
    `  digitalWrite(${name}, ${level});\n` +
    '}'
  );
}

function digitalIn(pin) {
  const name = pin.name.replace(' ', '');

  return (
    `const int ${name} = ${pin.id};\n` +
    `int button_${name}_state = 0;\n` +
    '\n' +
    '// this runs once when you power the board\n' +
    'void setup() {\n' +
    '  // initialize pin as an input.\n' +
    `  pinMode(${name}, INPUT);\n` +
    '}\n' +
    '\n' +
    '// this runs over and over again forever\n' +
    'void loop() {\n' +
    '  // read the state of the pushbutton value\n' +
    `  button_${name}_state = digitalRead(${name})\n` +
    '\n' +
    '  // check if the pushbutton is pressed\n' +
    `  if (button_${name}_state == HIGH) {\n` +
    '    // if pressed do this\n' +
    '  } else {\n' +
    '    // if not, do this\n' +
    '  }\n' +
    '}'
  );
}

function analogOut(pin) {
  const name = pin.name.replace(' ', '');

  return (
    `const int ${name} = ${pin.id};\n` +
    '\n' +
    '// this runs once when you power the board\n' +
    'void setup() {\n' +
    '   // initialize pin as an output.\n' +
    `   pinMode(${name}, OUTPUT);\n` +
    ' }\n' +
    '\n' +
    ' // this runs over and over again forever\n' +
    ' void loop() {\n' +
    '   // turn the pin on (raw value, 0 to 255)\n' +
    `   analogWrite(${name}, ${Math.round(pin.value)});\n` +
    ' }'
  );
}

function analogIn(pin) {
  const name = pin.name.replace(' ', '');

  return (
    `const int ${name} = ${pin.id};\n` +
    `int value_${name} = 0;\n` +
    '\n' +
    '// this runs once when you power the board\n' +
    'void setup() {\n' +
    '  // initialize pin as an input.\n' +
    `  pinMode(${name}, INPUT);\n` +
    '}\n' +
    '\n' +
    '// this runs over and over again forever\n' +
    'void loop() {\n' +
    '  // read the state of the pushbutton value\n' +
    `  value_${name} = analogRead(${name})\n` +
    '\n' +
    '  // check if the sensor value is higher than some limit\n' +
    `  if (value_${name} > 100) {\n` +
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

