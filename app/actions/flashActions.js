import Avrgirl from 'avrgirl-arduino';

// list of supported boards, that are also supported by remotino
const supportedBoards = [
  {
    type: 'leonardo',
    name: 'Arduino Leonardo',
    filename: './app/binary/arduino-leonardo.hex',
  },
  {
    type: 'micro',
    name: 'Arduino Micro',
    filename: '/.app/binary/arduino-micro.hex',
  },
  {
    type: 'mega',
    name: 'Arduino Mega',
    filename: './app/binary/arduino-mega-2560.hex',
  },
  {
    type: 'nano',
    name: 'Arduino Nano',
    filename: './app/binary/arduino-nano.hex',
  },
  {
    type: 'uno',
    name: 'Arduino Uno',
    filename: './app/binary/arduino-uno.hex',
  }
];

// TRY_FLASHING_BOARD action is dispatched everytime avrgirl is called
// payload is the boardtype as string
export const TRY_FLASHING_BOARD = 'TRY_FLASHING_BOARD';
export function tryFlashingBoard(boardType) {
  return {
    type: TRY_FLASHING_BOARD,
    boardType,
  };
}

// FLASHING_DONE action is dispatched after a successfull flash or
// when end of supported boards list is reached
export const FLASHING_DONE = 'FLASHING_DONE';
export function flashingDone() {
  return {
    type: FLASHING_DONE,
  };
}

export const FLASHING_ERROR = 'FLASHING_ERROR';
export function flashingError() {
  return {
    type: FLASHING_ERROR,
  };
}

// this will iterate through the supportedBoars array an call avrgirl
// to start the flash. On failure, the next board is tried. Doing it
// by recursion guarantees that the port is not blocked by a synchronous
// flashing attempt for a different board.
export function searchFlashableBoards() {
  return (dispatch) => {
    let i = 0;
    const length = supportedBoards.length;
    const fn = (err) => {
      if (!err) {
        // if no error is received then the flash was successfull
        // share the good news with dispatch
        dispatch(flashingDone());
        // exit the flash function after one successfull try
        return;
      }
      if (i < length) {
        // get new avrgirl object with current boardtype we are trying
        const avrGirl = new Avrgirl({
          board: supportedBoards[i].type,
        });
        // dispatching the current flashing attempt with board name
        dispatch(tryFlashingBoard(supportedBoards[i].name));
        // calling actual flash function
        avrGirl.flash(supportedBoards[i].filename, fn);
        i++;
      } else {
        dispatch(flashingError());
      }
    };
    // needed to start the recursive function,
    // empty call would be considered successfull previous run.
    fn('first run error hack');
  };
}
