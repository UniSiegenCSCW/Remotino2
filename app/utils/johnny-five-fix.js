"use strict";
import { Readable } from 'stream';
import  * as util from 'util';

export default function fixJohnnyFive() {
  util.inherits(MyStream, Readable);

  function MyStream(opt) {
    Readable.call(this, opt);
  }

  MyStream.prototype._read = function () {};

  // hook in our stream
  process.__defineGetter__("stdin", function () {
    if (process.__stdin) return process.__stdin;
    process.__stdin = new MyStream();
    return process.__stdin;
  });
};
