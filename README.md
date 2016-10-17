# Remotino

An app to remote control your Arduino.

## Setup

### Clone with all submodules

`git clone --recursive git@github.com:UniSiegenCSCW/remotino`

### Compile `node_serialport` against the current version of Electron

`node_modules/serialport/node_modules/node-pre-gyp/bin/node-pre-gyp install --fallback-to-build --runtime=electron --target=1.3.7 --target_arch=x64 --directory=node_modules/serialport/ --update-binary --dist-url=https://atom.io/download/atom-shell`

### Build the app

`npm run buld`

### Start remotino with

`npm start`

## License
The MIT License (MIT)
Copyright (c) 2016 Julian Dax, Leon Rische

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Credits

* Arduino Icons: <https://github.com/fritzing/fritzing-parts>
