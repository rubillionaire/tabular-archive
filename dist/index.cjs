var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var __await = function(promise, isYieldStar) {
  this[0] = promise;
  this[1] = isYieldStar;
};
var __asyncGenerator = (__this, __arguments, generator) => {
  var resume = (k, v, yes, no) => {
    try {
      var x = generator[k](v), isAwait = (v = x.value) instanceof __await, done = x.done;
      Promise.resolve(isAwait ? v[0] : v).then((y) => isAwait ? resume(k === "return" ? k : "next", v[1] ? { done: y.done, value: y.value } : y, yes, no) : yes({ value: y, done })).catch((e) => resume("throw", e, yes, no));
    } catch (e) {
      no(e);
    }
  };
  var method = (k) => it[k] = (x) => new Promise((yes, no) => resume(k, x, yes, no));
  var it = {};
  return generator = generator.apply(__this, __arguments), it[Symbol.asyncIterator] = () => it, method("next"), method("throw"), method("return"), it;
};

// node_modules/b4a/index.js
var require_b4a = __commonJS({
  "node_modules/b4a/index.js"(exports, module2) {
    function isBuffer(value) {
      return Buffer.isBuffer(value) || value instanceof Uint8Array;
    }
    function isEncoding(encoding) {
      return Buffer.isEncoding(encoding);
    }
    function alloc(size, fill2, encoding) {
      return Buffer.alloc(size, fill2, encoding);
    }
    function allocUnsafe(size) {
      return Buffer.allocUnsafe(size);
    }
    function allocUnsafeSlow(size) {
      return Buffer.allocUnsafeSlow(size);
    }
    function byteLength(string, encoding) {
      return Buffer.byteLength(string, encoding);
    }
    function compare(a, b) {
      return Buffer.compare(a, b);
    }
    function concat(buffers, totalLength) {
      return Buffer.concat(buffers, totalLength);
    }
    function copy(source, target, targetStart, start, end) {
      return toBuffer(source).copy(target, targetStart, start, end);
    }
    function equals(a, b) {
      return toBuffer(a).equals(b);
    }
    function fill(buffer, value, offset, end, encoding) {
      return toBuffer(buffer).fill(value, offset, end, encoding);
    }
    function from(value, encodingOrOffset, length) {
      return Buffer.from(value, encodingOrOffset, length);
    }
    function includes(buffer, value, byteOffset, encoding) {
      return toBuffer(buffer).includes(value, byteOffset, encoding);
    }
    function indexOf(buffer, value, byfeOffset, encoding) {
      return toBuffer(buffer).indexOf(value, byfeOffset, encoding);
    }
    function lastIndexOf(buffer, value, byteOffset, encoding) {
      return toBuffer(buffer).lastIndexOf(value, byteOffset, encoding);
    }
    function swap16(buffer) {
      return toBuffer(buffer).swap16();
    }
    function swap32(buffer) {
      return toBuffer(buffer).swap32();
    }
    function swap64(buffer) {
      return toBuffer(buffer).swap64();
    }
    function toBuffer(buffer) {
      if (Buffer.isBuffer(buffer))
        return buffer;
      return Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    }
    function toString(buffer, encoding, start, end) {
      return toBuffer(buffer).toString(encoding, start, end);
    }
    function write(buffer, string, offset, length, encoding) {
      return toBuffer(buffer).write(string, offset, length, encoding);
    }
    function writeDoubleLE(buffer, value, offset) {
      return toBuffer(buffer).writeDoubleLE(value, offset);
    }
    function writeFloatLE(buffer, value, offset) {
      return toBuffer(buffer).writeFloatLE(value, offset);
    }
    function writeUInt32LE(buffer, value, offset) {
      return toBuffer(buffer).writeUInt32LE(value, offset);
    }
    function writeInt32LE(buffer, value, offset) {
      return toBuffer(buffer).writeInt32LE(value, offset);
    }
    function readDoubleLE(buffer, offset) {
      return toBuffer(buffer).readDoubleLE(offset);
    }
    function readFloatLE(buffer, offset) {
      return toBuffer(buffer).readFloatLE(offset);
    }
    function readUInt32LE(buffer, offset) {
      return toBuffer(buffer).readUInt32LE(offset);
    }
    function readInt32LE(buffer, offset) {
      return toBuffer(buffer).readInt32LE(offset);
    }
    module2.exports = {
      isBuffer,
      isEncoding,
      alloc,
      allocUnsafe,
      allocUnsafeSlow,
      byteLength,
      compare,
      concat,
      copy,
      equals,
      fill,
      from,
      includes,
      indexOf,
      lastIndexOf,
      swap16,
      swap32,
      swap64,
      toBuffer,
      toString,
      write,
      writeDoubleLE,
      writeFloatLE,
      writeUInt32LE,
      writeInt32LE,
      readDoubleLE,
      readFloatLE,
      readUInt32LE,
      readInt32LE
    };
  }
});

// node_modules/varint/encode.js
var require_encode = __commonJS({
  "node_modules/varint/encode.js"(exports, module2) {
    module2.exports = encode7;
    var MSB = 128;
    var REST = 127;
    var MSBALL = ~REST;
    var INT = Math.pow(2, 31);
    function encode7(num, out, offset) {
      out = out || [];
      offset = offset || 0;
      var oldOffset = offset;
      while (num >= INT) {
        out[offset++] = num & 255 | MSB;
        num /= 128;
      }
      while (num & MSBALL) {
        out[offset++] = num & 255 | MSB;
        num >>>= 7;
      }
      out[offset] = num | 0;
      encode7.bytes = offset - oldOffset + 1;
      return out;
    }
  }
});

// node_modules/varint/decode.js
var require_decode = __commonJS({
  "node_modules/varint/decode.js"(exports, module2) {
    module2.exports = read;
    var MSB = 128;
    var REST = 127;
    function read(buf, offset) {
      var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf.length;
      do {
        if (counter >= l) {
          read.bytes = 0;
          throw new RangeError("Could not decode varint");
        }
        b = buf[counter++];
        res += shift < 28 ? (b & REST) << shift : (b & REST) * Math.pow(2, shift);
        shift += 7;
      } while (b >= MSB);
      read.bytes = counter - offset;
      return res;
    }
  }
});

// node_modules/varint/length.js
var require_length = __commonJS({
  "node_modules/varint/length.js"(exports, module2) {
    var N1 = Math.pow(2, 7);
    var N2 = Math.pow(2, 14);
    var N3 = Math.pow(2, 21);
    var N4 = Math.pow(2, 28);
    var N5 = Math.pow(2, 35);
    var N6 = Math.pow(2, 42);
    var N7 = Math.pow(2, 49);
    var N8 = Math.pow(2, 56);
    var N9 = Math.pow(2, 63);
    module2.exports = function(value) {
      return value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
    };
  }
});

// node_modules/varint/index.js
var require_varint = __commonJS({
  "node_modules/varint/index.js"(exports, module2) {
    module2.exports = {
      encode: require_encode(),
      decode: require_decode(),
      encodingLength: require_length()
    };
  }
});

// node_modules/signed-varint/index.js
var require_signed_varint = __commonJS({
  "node_modules/signed-varint/index.js"(exports) {
    var varint = require_varint();
    exports.encode = function encode7(v, b, o) {
      v = v >= 0 ? v * 2 : v * -2 - 1;
      var r = varint.encode(v, b, o);
      encode7.bytes = varint.encode.bytes;
      return r;
    };
    exports.decode = function decode8(b, o) {
      var v = varint.decode(b, o);
      decode8.bytes = varint.decode.bytes;
      return v & 1 ? (v + 1) / -2 : v / 2;
    };
    exports.encodingLength = function(v) {
      return varint.encodingLength(v >= 0 ? v * 2 : v * -2 - 1);
    };
  }
});

// node_modules/protocol-buffers-encodings/index.js
var require_protocol_buffers_encodings = __commonJS({
  "node_modules/protocol-buffers-encodings/index.js"(exports) {
    var varint = require_varint();
    var svarint = require_signed_varint();
    var b4a8 = require_b4a();
    exports.make = encoder2;
    exports.name = function(enc) {
      var keys = Object.keys(exports);
      for (var i = 0; i < keys.length; i++) {
        if (exports[keys[i]] === enc)
          return keys[i];
      }
      return null;
    };
    exports.skip = function(type, buffer, offset) {
      switch (type) {
        case 0:
          varint.decode(buffer, offset);
          return offset + varint.decode.bytes;
        case 1:
          return offset + 8;
        case 2:
          var len = varint.decode(buffer, offset);
          return offset + varint.decode.bytes + len;
        case 3:
        case 4:
          throw new Error("Groups are not supported");
        case 5:
          return offset + 4;
      }
      throw new Error("Unknown wire type: " + type);
    };
    exports.bytes = encoder2(
      2,
      function encode7(val, buffer, offset) {
        var oldOffset = offset;
        var len = bufferLength(val);
        varint.encode(len, buffer, offset);
        offset += varint.encode.bytes;
        if (b4a8.isBuffer(val))
          b4a8.copy(val, buffer, offset);
        else
          b4a8.write(buffer, val, offset, len);
        offset += len;
        encode7.bytes = offset - oldOffset;
        return buffer;
      },
      function decode8(buffer, offset) {
        var oldOffset = offset;
        var len = varint.decode(buffer, offset);
        offset += varint.decode.bytes;
        var val = buffer.subarray(offset, offset + len);
        offset += val.length;
        decode8.bytes = offset - oldOffset;
        return val;
      },
      function encodingLength4(val) {
        var len = bufferLength(val);
        return varint.encodingLength(len) + len;
      }
    );
    exports.string = encoder2(
      2,
      function encode7(val, buffer, offset) {
        var oldOffset = offset;
        var len = b4a8.byteLength(val);
        varint.encode(len, buffer, offset, "utf-8");
        offset += varint.encode.bytes;
        b4a8.write(buffer, val, offset, len);
        offset += len;
        encode7.bytes = offset - oldOffset;
        return buffer;
      },
      function decode8(buffer, offset) {
        var oldOffset = offset;
        var len = varint.decode(buffer, offset);
        offset += varint.decode.bytes;
        var val = b4a8.toString(buffer, "utf-8", offset, offset + len);
        offset += len;
        decode8.bytes = offset - oldOffset;
        return val;
      },
      function encodingLength4(val) {
        var len = b4a8.byteLength(val);
        return varint.encodingLength(len) + len;
      }
    );
    exports.bool = encoder2(
      0,
      function encode7(val, buffer, offset) {
        buffer[offset] = val ? 1 : 0;
        encode7.bytes = 1;
        return buffer;
      },
      function decode8(buffer, offset) {
        var bool = buffer[offset] > 0;
        decode8.bytes = 1;
        return bool;
      },
      function encodingLength4() {
        return 1;
      }
    );
    exports.int32 = encoder2(
      0,
      function encode7(val, buffer, offset) {
        varint.encode(val < 0 ? val + 4294967296 : val, buffer, offset);
        encode7.bytes = varint.encode.bytes;
        return buffer;
      },
      function decode8(buffer, offset) {
        var val = varint.decode(buffer, offset);
        decode8.bytes = varint.decode.bytes;
        return val > 2147483647 ? val - 4294967296 : val;
      },
      function encodingLength4(val) {
        return varint.encodingLength(val < 0 ? val + 4294967296 : val);
      }
    );
    exports.int64 = encoder2(
      0,
      function encode7(val, buffer, offset) {
        if (val < 0) {
          var last = offset + 9;
          varint.encode(val * -1, buffer, offset);
          offset += varint.encode.bytes - 1;
          buffer[offset] = buffer[offset] | 128;
          while (offset < last - 1) {
            offset++;
            buffer[offset] = 255;
          }
          buffer[last] = 1;
          encode7.bytes = 10;
        } else {
          varint.encode(val, buffer, offset);
          encode7.bytes = varint.encode.bytes;
        }
        return buffer;
      },
      function decode8(buffer, offset) {
        var val = varint.decode(buffer, offset);
        if (val >= Math.pow(2, 63)) {
          var limit = 9;
          while (buffer[offset + limit - 1] === 255)
            limit--;
          limit = limit || 9;
          var subset = b4a8.allocUnsafe(limit);
          b4a8.copy(buffer, subset, 0, offset, offset + limit);
          subset[limit - 1] = subset[limit - 1] & 127;
          val = -1 * varint.decode(subset, 0);
          decode8.bytes = 10;
        } else {
          decode8.bytes = varint.decode.bytes;
        }
        return val;
      },
      function encodingLength4(val) {
        return val < 0 ? 10 : varint.encodingLength(val);
      }
    );
    exports.sint32 = exports.sint64 = encoder2(
      0,
      svarint.encode,
      svarint.decode,
      svarint.encodingLength
    );
    exports.uint32 = exports.uint64 = exports.enum = exports.varint = encoder2(
      0,
      varint.encode,
      varint.decode,
      varint.encodingLength
    );
    exports.fixed64 = exports.sfixed64 = encoder2(
      1,
      function encode7(val, buffer, offset) {
        b4a8.copy(val, buffer, offset);
        encode7.bytes = 8;
        return buffer;
      },
      function decode8(buffer, offset) {
        var val = buffer.subarray(offset, offset + 8);
        decode8.bytes = 8;
        return val;
      },
      function encodingLength4() {
        return 8;
      }
    );
    exports.double = encoder2(
      1,
      function encode7(val, buffer, offset) {
        b4a8.writeDoubleLE(buffer, val, offset);
        encode7.bytes = 8;
        return buffer;
      },
      function decode8(buffer, offset) {
        var val = b4a8.readDoubleLE(buffer, offset);
        decode8.bytes = 8;
        return val;
      },
      function encodingLength4() {
        return 8;
      }
    );
    exports.fixed32 = encoder2(
      5,
      function encode7(val, buffer, offset) {
        b4a8.writeUInt32LE(buffer, val, offset);
        encode7.bytes = 4;
        return buffer;
      },
      function decode8(buffer, offset) {
        var val = b4a8.readUInt32LE(buffer, offset);
        decode8.bytes = 4;
        return val;
      },
      function encodingLength4() {
        return 4;
      }
    );
    exports.sfixed32 = encoder2(
      5,
      function encode7(val, buffer, offset) {
        b4a8.writeInt32LE(buffer, val, offset);
        encode7.bytes = 4;
        return buffer;
      },
      function decode8(buffer, offset) {
        var val = b4a8.readInt32LE(buffer, offset);
        decode8.bytes = 4;
        return val;
      },
      function encodingLength4() {
        return 4;
      }
    );
    exports.float = encoder2(
      5,
      function encode7(val, buffer, offset) {
        b4a8.writeFloatLE(buffer, val, offset);
        encode7.bytes = 4;
        return buffer;
      },
      function decode8(buffer, offset) {
        var val = b4a8.readFloatLE(buffer, offset);
        decode8.bytes = 4;
        return val;
      },
      function encodingLength4() {
        return 4;
      }
    );
    function encoder2(type, encode7, decode8, encodingLength4) {
      encode7.bytes = decode8.bytes = 0;
      return {
        type,
        encode: encode7,
        decode: decode8,
        encodingLength: encodingLength4
      };
    }
    function bufferLength(val) {
      return b4a8.isBuffer(val) ? val.length : b4a8.byteLength(val);
    }
  }
});

// node_modules/csv-parser/index.js
var require_csv_parser = __commonJS({
  "node_modules/csv-parser/index.js"(exports, module2) {
    var { Transform } = require("stream");
    var [cr] = Buffer.from("\r");
    var [nl] = Buffer.from("\n");
    var defaults = {
      escape: '"',
      headers: null,
      mapHeaders: ({ header }) => header,
      mapValues: ({ value }) => value,
      newline: "\n",
      quote: '"',
      raw: false,
      separator: ",",
      skipComments: false,
      skipLines: null,
      maxRowBytes: Number.MAX_SAFE_INTEGER,
      strict: false
    };
    var CsvParser = class extends Transform {
      constructor(opts = {}) {
        super({ objectMode: true, highWaterMark: 16 });
        if (Array.isArray(opts))
          opts = { headers: opts };
        const options = Object.assign({}, defaults, opts);
        options.customNewline = options.newline !== defaults.newline;
        for (const key of ["newline", "quote", "separator"]) {
          if (typeof options[key] !== "undefined") {
            [options[key]] = Buffer.from(options[key]);
          }
        }
        options.escape = (opts || {}).escape ? Buffer.from(options.escape)[0] : options.quote;
        this.state = {
          empty: options.raw ? Buffer.alloc(0) : "",
          escaped: false,
          first: true,
          lineNumber: 0,
          previousEnd: 0,
          rowLength: 0,
          quoted: false
        };
        this._prev = null;
        if (options.headers === false) {
          options.strict = false;
        }
        if (options.headers || options.headers === false) {
          this.state.first = false;
        }
        this.options = options;
        this.headers = options.headers;
      }
      parseCell(buffer, start, end) {
        const { escape, quote } = this.options;
        if (buffer[start] === quote && buffer[end - 1] === quote) {
          start++;
          end--;
        }
        let y = start;
        for (let i = start; i < end; i++) {
          if (buffer[i] === escape && i + 1 < end && buffer[i + 1] === quote) {
            i++;
          }
          if (y !== i) {
            buffer[y] = buffer[i];
          }
          y++;
        }
        return this.parseValue(buffer, start, y);
      }
      parseLine(buffer, start, end) {
        const { customNewline, escape, mapHeaders, mapValues, quote, separator, skipComments, skipLines } = this.options;
        end--;
        if (!customNewline && buffer.length && buffer[end - 1] === cr) {
          end--;
        }
        const comma = separator;
        const cells = [];
        let isQuoted = false;
        let offset = start;
        if (skipComments) {
          const char = typeof skipComments === "string" ? skipComments : "#";
          if (buffer[start] === Buffer.from(char)[0]) {
            return;
          }
        }
        const mapValue = (value) => {
          if (this.state.first) {
            return value;
          }
          const index = cells.length;
          const header = this.headers[index];
          return mapValues({ header, index, value });
        };
        for (let i = start; i < end; i++) {
          const isStartingQuote = !isQuoted && buffer[i] === quote;
          const isEndingQuote = isQuoted && buffer[i] === quote && i + 1 <= end && buffer[i + 1] === comma;
          const isEscape = isQuoted && buffer[i] === escape && i + 1 < end && buffer[i + 1] === quote;
          if (isStartingQuote || isEndingQuote) {
            isQuoted = !isQuoted;
            continue;
          } else if (isEscape) {
            i++;
            continue;
          }
          if (buffer[i] === comma && !isQuoted) {
            let value = this.parseCell(buffer, offset, i);
            value = mapValue(value);
            cells.push(value);
            offset = i + 1;
          }
        }
        if (offset < end) {
          let value = this.parseCell(buffer, offset, end);
          value = mapValue(value);
          cells.push(value);
        }
        if (buffer[end - 1] === comma) {
          cells.push(mapValue(this.state.empty));
        }
        const skip = skipLines && skipLines > this.state.lineNumber;
        this.state.lineNumber++;
        if (this.state.first && !skip) {
          this.state.first = false;
          this.headers = cells.map((header, index) => mapHeaders({ header, index }));
          this.emit("headers", this.headers);
          return;
        }
        if (!skip && this.options.strict && cells.length !== this.headers.length) {
          const e = new RangeError("Row length does not match headers");
          this.emit("error", e);
        } else {
          if (!skip)
            this.writeRow(cells);
        }
      }
      parseValue(buffer, start, end) {
        if (this.options.raw) {
          return buffer.slice(start, end);
        }
        return buffer.toString("utf-8", start, end);
      }
      writeRow(cells) {
        const headers = this.headers === false ? cells.map((value, index) => index) : this.headers;
        const row = cells.reduce((o, cell, index) => {
          const header = headers[index];
          if (header === null)
            return o;
          if (header !== void 0) {
            o[header] = cell;
          } else {
            o[`_${index}`] = cell;
          }
          return o;
        }, {});
        this.push(row);
      }
      _flush(cb) {
        if (this.state.escaped || !this._prev)
          return cb();
        this.parseLine(this._prev, this.state.previousEnd, this._prev.length + 1);
        cb();
      }
      _transform(data, enc, cb) {
        if (typeof data === "string") {
          data = Buffer.from(data);
        }
        const { escape, quote } = this.options;
        let start = 0;
        let buffer = data;
        if (this._prev) {
          start = this._prev.length;
          buffer = Buffer.concat([this._prev, data]);
          this._prev = null;
        }
        const bufferLength = buffer.length;
        for (let i = start; i < bufferLength; i++) {
          const chr = buffer[i];
          const nextChr = i + 1 < bufferLength ? buffer[i + 1] : null;
          this.state.rowLength++;
          if (this.state.rowLength > this.options.maxRowBytes) {
            return cb(new Error("Row exceeds the maximum size"));
          }
          if (!this.state.escaped && chr === escape && nextChr === quote && i !== start) {
            this.state.escaped = true;
            continue;
          } else if (chr === quote) {
            if (this.state.escaped) {
              this.state.escaped = false;
            } else {
              this.state.quoted = !this.state.quoted;
            }
            continue;
          }
          if (!this.state.quoted) {
            if (this.state.first && !this.options.customNewline) {
              if (chr === nl) {
                this.options.newline = nl;
              } else if (chr === cr) {
                if (nextChr !== nl) {
                  this.options.newline = cr;
                }
              }
            }
            if (chr === this.options.newline) {
              this.parseLine(buffer, this.state.previousEnd, i + 1);
              this.state.previousEnd = i + 1;
              this.state.rowLength = 0;
            }
          }
        }
        if (this.state.previousEnd === bufferLength) {
          this.state.previousEnd = 0;
          return cb();
        }
        if (bufferLength - this.state.previousEnd < data.length) {
          this._prev = data;
          this.state.previousEnd -= bufferLength - data.length;
          return cb();
        }
        this._prev = buffer;
        cb();
      }
    };
    module2.exports = (opts) => new CsvParser(opts);
  }
});

// index.mjs
var tabular_archive_exports = {};
__export(tabular_archive_exports, {
  decode: () => decode7,
  decodeFs: () => decodeFs,
  encode: () => encode6,
  encoderTypes: () => encoderTypes
});
module.exports = __toCommonJS(tabular_archive_exports);

// src/read-range/node-fs.mjs
var import_b4a = __toESM(require_b4a(), 1);
var import_node_fs = __toESM(require("fs"), 1);
var import_node_stream = require("stream");
var import_promises = require("stream/promises");
function readRange(_0) {
  return __async(this, arguments, function* ({ filePath, start, end, ranges }) {
    let completeBuffer = import_b4a.default.alloc(0);
    if (!ranges) {
      ranges = [{ start, end }];
    }
    const captureBuffer = () => new import_node_stream.Writable({
      write: (buffer, enc, next) => {
        const len = completeBuffer.length + buffer.length;
        completeBuffer = import_b4a.default.concat([completeBuffer, buffer], len);
        next();
      }
    });
    return new Promise((resolve, reject) => __async(this, null, function* () {
      for (const range of ranges) {
        yield (0, import_promises.pipeline)(
          import_node_fs.default.createReadStream(filePath, __spreadValues({}, range)),
          captureBuffer()
        );
      }
      resolve(completeBuffer);
    }));
  });
}

// src/tabular-archive-encode.mjs
var import_node_fs4 = __toESM(require("fs"), 1);
var import_promises3 = __toESM(require("fs/promises"), 1);
var import_node_stream3 = require("stream");
var import_promises4 = require("stream/promises");
var import_b4a6 = __toESM(require_b4a(), 1);

// node_modules/fflate/esm/index.mjs
var import_module = require("module");
var require2 = (0, import_module.createRequire)("/");
var Worker;
try {
  Worker = require2("worker_threads").Worker;
} catch (e) {
}
var u8 = Uint8Array;
var u16 = Uint16Array;
var i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start) {
  var b = new u16(31);
  for (var i = 0; i < 31; ++i) {
    b[i] = start += 1 << eb[i - 1];
  }
  var r = new i32(b[30]);
  for (var i = 1; i < 30; ++i) {
    for (var j = b[i]; j < b[i + 1]; ++j) {
      r[j] = j - b[i] << 5 | i;
    }
  }
  return { b, r };
};
var _a = freb(fleb, 2);
var fl = _a.b;
var revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0);
var fd = _b.b;
var revfd = _b.r;
var rev = new u16(32768);
for (i = 0; i < 32768; ++i) {
  x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var x;
var i;
var hMap = function(cd, mb, r) {
  var s = cd.length;
  var i = 0;
  var l = new u16(mb);
  for (; i < s; ++i) {
    if (cd[i])
      ++l[cd[i] - 1];
  }
  var le = new u16(mb);
  for (i = 1; i < mb; ++i) {
    le[i] = le[i - 1] + l[i - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        var sv = i << 4 | cd[i];
        var r_1 = mb - cd[i];
        var v = le[cd[i] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        co[i] = rev[le[cd[i] - 1]++] >> 15 - cd[i];
      }
    }
  }
  return co;
};
var flt = new u8(288);
for (i = 0; i < 144; ++i)
  flt[i] = 8;
var i;
for (i = 144; i < 256; ++i)
  flt[i] = 9;
var i;
for (i = 256; i < 280; ++i)
  flt[i] = 7;
var i;
for (i = 280; i < 288; ++i)
  flt[i] = 8;
var i;
var fdt = new u8(32);
for (i = 0; i < 32; ++i)
  fdt[i] = 5;
var i;
var flm = /* @__PURE__ */ hMap(flt, 9, 0);
var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdm = /* @__PURE__ */ hMap(fdt, 5, 0);
var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = function(a) {
  var m = a[0];
  for (var i = 1; i < a.length; ++i) {
    if (a[i] > m)
      m = a[i];
  }
  return m;
};
var bits = function(d, p, m) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
};
var bits16 = function(d, p) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
};
var shft = function(p) {
  return (p + 7) / 8 | 0;
};
var slc = function(v, s, e) {
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  return new u8(v.subarray(s, e));
};
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
};
var inflt = function(dat, st, buf, dict) {
  var sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st.f && !st.l)
    return buf || new u8(0);
  var noBuf = !buf;
  var resize = noBuf || st.i != 2;
  var noSt = st.i;
  if (noBuf)
    buf = new u8(sl * 3);
  var cbuf = function(l2) {
    var bl = buf.length;
    if (l2 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l2));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
  var tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
        if (t > sl) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + l);
        buf.set(dat.subarray(s, t), bt);
        st.b = bt += l, st.p = pos = t * 8, st.f = final;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i = 0; i < hcLen; ++i) {
          clt[clim[i]] = bits(dat, pos + i * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        var clm = hMap(clt, clb, 1);
        for (var i = 0; i < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s = r >> 4;
          if (s < 16) {
            ldt[i++] = s;
          } else {
            var c = 0, n = 0;
            if (s == 16)
              n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
            else if (s == 17)
              n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18)
              n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--)
              ldt[i++] = c;
          }
        }
        var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
        lbt = max(lt);
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else
        err(1);
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
    }
    if (resize)
      cbuf(bt + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    var lpos = pos;
    for (; ; lpos = pos) {
      var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
      if (!c)
        err(2);
      if (sym < 256)
        buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i = sym - 257, b = fleb[i];
          add = bits(dat, pos, (1 << b) - 1) + fl[i];
          pos += b;
        }
        var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
        if (!d)
          err(3);
        pos += d & 15;
        var dt = fd[dsym];
        if (dsym > 3) {
          var b = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + 131072);
        var end = bt + add;
        if (bt < dt) {
          var shift = dl - dt, dend = Math.min(dt, end);
          if (shift + bt < 0)
            err(3);
          for (; bt < dend; ++bt)
            buf[bt] = dict[shift + bt];
        }
        for (; bt < end; ++bt)
          buf[bt] = buf[bt - dt];
      }
    }
    st.l = lm, st.p = lpos, st.b = bt, st.f = final;
    if (lm)
      final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
var wbits = function(d, p, v) {
  v <<= p & 7;
  var o = p / 8 | 0;
  d[o] |= v;
  d[o + 1] |= v >> 8;
};
var wbits16 = function(d, p, v) {
  v <<= p & 7;
  var o = p / 8 | 0;
  d[o] |= v;
  d[o + 1] |= v >> 8;
  d[o + 2] |= v >> 16;
};
var hTree = function(d, mb) {
  var t = [];
  for (var i = 0; i < d.length; ++i) {
    if (d[i])
      t.push({ s: i, f: d[i] });
  }
  var s = t.length;
  var t2 = t.slice();
  if (!s)
    return { t: et, l: 0 };
  if (s == 1) {
    var v = new u8(t[0].s + 1);
    v[t[0].s] = 1;
    return { t: v, l: 1 };
  }
  t.sort(function(a, b) {
    return a.f - b.f;
  });
  t.push({ s: -1, f: 25001 });
  var l = t[0], r = t[1], i0 = 0, i1 = 1, i2 = 2;
  t[0] = { s: -1, f: l.f + r.f, l, r };
  while (i1 != s - 1) {
    l = t[t[i0].f < t[i2].f ? i0++ : i2++];
    r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++];
    t[i1++] = { s: -1, f: l.f + r.f, l, r };
  }
  var maxSym = t2[0].s;
  for (var i = 1; i < s; ++i) {
    if (t2[i].s > maxSym)
      maxSym = t2[i].s;
  }
  var tr = new u16(maxSym + 1);
  var mbt = ln(t[i1 - 1], tr, 0);
  if (mbt > mb) {
    var i = 0, dt = 0;
    var lft = mbt - mb, cst = 1 << lft;
    t2.sort(function(a, b) {
      return tr[b.s] - tr[a.s] || a.f - b.f;
    });
    for (; i < s; ++i) {
      var i2_1 = t2[i].s;
      if (tr[i2_1] > mb) {
        dt += cst - (1 << mbt - tr[i2_1]);
        tr[i2_1] = mb;
      } else
        break;
    }
    dt >>= lft;
    while (dt > 0) {
      var i2_2 = t2[i].s;
      if (tr[i2_2] < mb)
        dt -= 1 << mb - tr[i2_2]++ - 1;
      else
        ++i;
    }
    for (; i >= 0 && dt; --i) {
      var i2_3 = t2[i].s;
      if (tr[i2_3] == mb) {
        --tr[i2_3];
        ++dt;
      }
    }
    mbt = mb;
  }
  return { t: new u8(tr), l: mbt };
};
var ln = function(n, l, d) {
  return n.s == -1 ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1)) : l[n.s] = d;
};
var lc = function(c) {
  var s = c.length;
  while (s && !c[--s])
    ;
  var cl = new u16(++s);
  var cli = 0, cln = c[0], cls = 1;
  var w = function(v) {
    cl[cli++] = v;
  };
  for (var i = 1; i <= s; ++i) {
    if (c[i] == cln && i != s)
      ++cls;
    else {
      if (!cln && cls > 2) {
        for (; cls > 138; cls -= 138)
          w(32754);
        if (cls > 2) {
          w(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
          cls = 0;
        }
      } else if (cls > 3) {
        w(cln), --cls;
        for (; cls > 6; cls -= 6)
          w(8304);
        if (cls > 2)
          w(cls - 3 << 5 | 8208), cls = 0;
      }
      while (cls--)
        w(cln);
      cls = 1;
      cln = c[i];
    }
  }
  return { c: cl.subarray(0, cli), n: s };
};
var clen = function(cf, cl) {
  var l = 0;
  for (var i = 0; i < cl.length; ++i)
    l += cf[i] * cl[i];
  return l;
};
var wfblk = function(out, pos, dat) {
  var s = dat.length;
  var o = shft(pos + 2);
  out[o] = s & 255;
  out[o + 1] = s >> 8;
  out[o + 2] = out[o] ^ 255;
  out[o + 3] = out[o + 1] ^ 255;
  for (var i = 0; i < s; ++i)
    out[o + i + 4] = dat[i];
  return (o + 4 + s) * 8;
};
var wblk = function(dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
  wbits(out, p++, final);
  ++lf[256];
  var _a2 = hTree(lf, 15), dlt = _a2.t, mlb = _a2.l;
  var _b2 = hTree(df, 15), ddt = _b2.t, mdb = _b2.l;
  var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
  var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
  var lcfreq = new u16(19);
  for (var i = 0; i < lclt.length; ++i)
    ++lcfreq[lclt[i] & 31];
  for (var i = 0; i < lcdt.length; ++i)
    ++lcfreq[lcdt[i] & 31];
  var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
  var nlcc = 19;
  for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
    ;
  var flen = bl + 5 << 3;
  var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
  var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
  if (bs >= 0 && flen <= ftlen && flen <= dtlen)
    return wfblk(out, p, dat.subarray(bs, bs + bl));
  var lm, ll, dm, dl;
  wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
  if (dtlen < ftlen) {
    lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
    var llm = hMap(lct, mlcb, 0);
    wbits(out, p, nlc - 257);
    wbits(out, p + 5, ndc - 1);
    wbits(out, p + 10, nlcc - 4);
    p += 14;
    for (var i = 0; i < nlcc; ++i)
      wbits(out, p + 3 * i, lct[clim[i]]);
    p += 3 * nlcc;
    var lcts = [lclt, lcdt];
    for (var it = 0; it < 2; ++it) {
      var clct = lcts[it];
      for (var i = 0; i < clct.length; ++i) {
        var len = clct[i] & 31;
        wbits(out, p, llm[len]), p += lct[len];
        if (len > 15)
          wbits(out, p, clct[i] >> 5 & 127), p += clct[i] >> 12;
      }
    }
  } else {
    lm = flm, ll = flt, dm = fdm, dl = fdt;
  }
  for (var i = 0; i < li; ++i) {
    var sym = syms[i];
    if (sym > 255) {
      var len = sym >> 18 & 31;
      wbits16(out, p, lm[len + 257]), p += ll[len + 257];
      if (len > 7)
        wbits(out, p, sym >> 23 & 31), p += fleb[len];
      var dst = sym & 31;
      wbits16(out, p, dm[dst]), p += dl[dst];
      if (dst > 3)
        wbits16(out, p, sym >> 5 & 8191), p += fdeb[dst];
    } else {
      wbits16(out, p, lm[sym]), p += ll[sym];
    }
  }
  wbits16(out, p, lm[256]);
  return p + ll[256];
};
var deo = /* @__PURE__ */ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
var et = /* @__PURE__ */ new u8(0);
var dflt = function(dat, lvl, plvl, pre, post, st) {
  var s = st.z || dat.length;
  var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7e3)) + post);
  var w = o.subarray(pre, o.length - post);
  var lst = st.l;
  var pos = (st.r || 0) & 7;
  if (lvl) {
    if (pos)
      w[0] = st.r >> 3;
    var opt = deo[lvl - 1];
    var n = opt >> 13, c = opt & 8191;
    var msk_1 = (1 << plvl) - 1;
    var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
    var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
    var hsh = function(i2) {
      return (dat[i2] ^ dat[i2 + 1] << bs1_1 ^ dat[i2 + 2] << bs2_1) & msk_1;
    };
    var syms = new i32(25e3);
    var lf = new u16(288), df = new u16(32);
    var lc_1 = 0, eb = 0, i = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
    for (; i + 2 < s; ++i) {
      var hv = hsh(i);
      var imod = i & 32767, pimod = head[hv];
      prev[imod] = pimod;
      head[hv] = imod;
      if (wi <= i) {
        var rem = s - i;
        if ((lc_1 > 7e3 || li > 24576) && (rem > 423 || !lst)) {
          pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
          li = lc_1 = eb = 0, bs = i;
          for (var j = 0; j < 286; ++j)
            lf[j] = 0;
          for (var j = 0; j < 30; ++j)
            df[j] = 0;
        }
        var l = 2, d = 0, ch_1 = c, dif = imod - pimod & 32767;
        if (rem > 2 && hv == hsh(i - dif)) {
          var maxn = Math.min(n, rem) - 1;
          var maxd = Math.min(32767, i);
          var ml = Math.min(258, rem);
          while (dif <= maxd && --ch_1 && imod != pimod) {
            if (dat[i + l] == dat[i + l - dif]) {
              var nl = 0;
              for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl)
                ;
              if (nl > l) {
                l = nl, d = dif;
                if (nl > maxn)
                  break;
                var mmd = Math.min(dif, nl - 2);
                var md = 0;
                for (var j = 0; j < mmd; ++j) {
                  var ti = i - dif + j & 32767;
                  var pti = prev[ti];
                  var cd = ti - pti & 32767;
                  if (cd > md)
                    md = cd, pimod = ti;
                }
              }
            }
            imod = pimod, pimod = prev[imod];
            dif += imod - pimod & 32767;
          }
        }
        if (d) {
          syms[li++] = 268435456 | revfl[l] << 18 | revfd[d];
          var lin = revfl[l] & 31, din = revfd[d] & 31;
          eb += fleb[lin] + fdeb[din];
          ++lf[257 + lin];
          ++df[din];
          wi = i + l;
          ++lc_1;
        } else {
          syms[li++] = dat[i];
          ++lf[dat[i]];
        }
      }
    }
    for (i = Math.max(i, wi); i < s; ++i) {
      syms[li++] = dat[i];
      ++lf[dat[i]];
    }
    pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos);
    if (!lst) {
      st.r = pos & 7 | w[pos / 8 | 0] << 3;
      pos -= 7;
      st.h = head, st.p = prev, st.i = i, st.w = wi;
    }
  } else {
    for (var i = st.w || 0; i < s + lst; i += 65535) {
      var e = i + 65535;
      if (e >= s) {
        w[pos / 8 | 0] = lst;
        e = s;
      }
      pos = wfblk(w, pos + 1, dat.subarray(i, e));
    }
    st.i = s;
  }
  return slc(o, 0, pre + shft(pos) + post);
};
var crct = /* @__PURE__ */ function() {
  var t = new Int32Array(256);
  for (var i = 0; i < 256; ++i) {
    var c = i, k = 9;
    while (--k)
      c = (c & 1 && -306674912) ^ c >>> 1;
    t[i] = c;
  }
  return t;
}();
var crc = function() {
  var c = -1;
  return {
    p: function(d) {
      var cr = c;
      for (var i = 0; i < d.length; ++i)
        cr = crct[cr & 255 ^ d[i]] ^ cr >>> 8;
      c = cr;
    },
    d: function() {
      return ~c;
    }
  };
};
var dopt = function(dat, opt, pre, post, st) {
  if (!st) {
    st = { l: 1 };
    if (opt.dictionary) {
      var dict = opt.dictionary.subarray(-32768);
      var newDat = new u8(dict.length + dat.length);
      newDat.set(dict);
      newDat.set(dat, dict.length);
      dat = newDat;
      st.w = dict.length;
    }
  }
  return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 12 + opt.mem, pre, post, st);
};
var wbytes = function(d, b, v) {
  for (; v; ++b)
    d[b] = v, v >>>= 8;
};
var gzh = function(c, o) {
  var fn = o.filename;
  c[0] = 31, c[1] = 139, c[2] = 8, c[8] = o.level < 2 ? 4 : o.level == 9 ? 2 : 0, c[9] = 3;
  if (o.mtime != 0)
    wbytes(c, 4, Math.floor(new Date(o.mtime || Date.now()) / 1e3));
  if (fn) {
    c[3] = 8;
    for (var i = 0; i <= fn.length; ++i)
      c[i + 10] = fn.charCodeAt(i);
  }
};
var gzs = function(d) {
  if (d[0] != 31 || d[1] != 139 || d[2] != 8)
    err(6, "invalid gzip data");
  var flg = d[3];
  var st = 10;
  if (flg & 4)
    st += (d[10] | d[11] << 8) + 2;
  for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++])
    ;
  return st + (flg & 2);
};
var gzl = function(d) {
  var l = d.length;
  return (d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16 | d[l - 1] << 24) >>> 0;
};
var gzhl = function(o) {
  return 10 + (o.filename ? o.filename.length + 1 : 0);
};
function gzipSync(data, opts) {
  if (!opts)
    opts = {};
  var c = crc(), l = data.length;
  c.p(data);
  var d = dopt(data, opts, gzhl(opts), 8), s = d.length;
  return gzh(d, opts), wbytes(d, s - 8, c.d()), wbytes(d, s - 4, l), d;
}
function gunzipSync(data, opts) {
  var st = gzs(data);
  if (st + 8 > data.length)
    err(6, "invalid gzip data");
  return inflt(data.subarray(st, -8), { i: 2 }, opts && opts.out || new u8(gzl(data)), opts && opts.dictionary);
}
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {
}

// src/encoder.mjs
var import_protocol_buffers_encodings = __toESM(require_protocol_buffers_encodings(), 1);
var categories = [];
var setCategories = (c) => {
  categories = c;
};
import_protocol_buffers_encodings.default.date = import_protocol_buffers_encodings.default.make(
  8,
  function encode(val, buffer, offset) {
    const date = new Date(val);
    let timestamp = date.getTime();
    if (isNaN(timestamp)) {
      timestamp = -1;
    }
    import_protocol_buffers_encodings.default.int64.encode(timestamp, buffer, offset);
    encode.bytes = import_protocol_buffers_encodings.default.int64.encode.bytes;
    return buffer;
  },
  function decode(buffer, offset) {
    const timestamp = import_protocol_buffers_encodings.default.int64.decode(buffer, offset);
    decode.bytes = import_protocol_buffers_encodings.default.int64.decode.bytes;
    const date = new Date(timestamp);
    const value = date.toISOString();
    return value;
  },
  function encodingLength(val) {
    const date = new Date(val);
    let timestamp = date.getTime();
    if (isNaN(timestamp)) {
      timestamp = -1;
    }
    return import_protocol_buffers_encodings.default.int64.encodingLength(timestamp);
  }
);
import_protocol_buffers_encodings.default.category = import_protocol_buffers_encodings.default.make(
  7,
  function encode2(val, buffer, offset) {
    let valueIndex = categories.indexOf(val);
    if (valueIndex === -1) {
      categories.push(val);
      valueIndex = categories.length - 1;
    }
    import_protocol_buffers_encodings.default.int32.encode(valueIndex, buffer, offset);
    encode2.bytes = import_protocol_buffers_encodings.default.int32.encode.bytes;
    return buffer;
  },
  function decode2(buffer, offset) {
    const valueIndex = import_protocol_buffers_encodings.default.int32.decode(buffer, offset);
    decode2.bytes = import_protocol_buffers_encodings.default.int32.decode.bytes;
    const value = categories[valueIndex];
    return value;
  },
  function encodingLength2(val) {
    let valIndex = categories.indexOf(val);
    if (valIndex === -1) {
      categories.push(val);
      valIndex = categories.length - 1;
    }
    return import_protocol_buffers_encodings.default.int32.encodingLength(valIndex);
  }
);
import_protocol_buffers_encodings.default.geo = import_protocol_buffers_encodings.default.make(
  6,
  function encode3(val, buffer, offset) {
    const value = Math.floor(val * 1e7);
    import_protocol_buffers_encodings.default.int32.encode(value, buffer, offset);
    encode3.bytes = import_protocol_buffers_encodings.default.int32.encode.bytes;
    return buffer;
  },
  function decode3(buffer, offset) {
    const val = import_protocol_buffers_encodings.default.int32.decode(buffer, offset);
    decode3.bytes = import_protocol_buffers_encodings.default.int32.decode.bytes;
    return val / 1e7;
  },
  function encodingLength3(val) {
    return import_protocol_buffers_encodings.default.int32.encodingLength(Math.floor(val * 1e7));
  }
);
var encoderTypeKeys = Object.keys(import_protocol_buffers_encodings.default).filter((type) => {
  return typeof import_protocol_buffers_encodings.default[type].encodingLength === "function" && typeof import_protocol_buffers_encodings.default[type].encode === "function" && typeof import_protocol_buffers_encodings.default[type].decode === "function";
});
var encoderTypes = encoderTypeKeys.map((type) => {
  return { [type]: type };
}).reduce((accumulator, current) => {
  return __spreadValues(__spreadValues({}, accumulator), current);
}, {});
var maxEncoderTypeLength = encoderTypeKeys.map((type) => type.length).sort().pop();

// src/read-csv.mjs
var import_node_fs2 = __toESM(require("fs"), 1);
var import_csv_parser = __toESM(require_csv_parser(), 1);
var import_node_stream2 = require("stream");
var import_promises2 = require("stream/promises");
var EARLY_EXIT_ERROR = "early-exit";
var readCsvHeaderRow = (_0) => __async(void 0, [_0], function* ({ filePath }) {
  const csvStream = (0, import_csv_parser.default)();
  let header;
  csvStream.on("headers", (_header) => {
    header = _header;
  });
  const sink = new import_node_stream2.Writable({
    objectMode: true,
    write: (row, enc, next) => {
      next(new Error(EARLY_EXIT_ERROR));
    }
  });
  try {
    yield (0, import_promises2.pipeline)(
      import_node_fs2.default.createReadStream(filePath),
      csvStream,
      sink
    );
  } catch (error) {
    if (error.message === EARLY_EXIT_ERROR) {
    } else {
      throw error;
    }
  } finally {
    return { header };
  }
});
var readCsvDataRows = (_0) => __async(void 0, [_0], function* ({ filePath, onRow }) {
  let rowCount = 0;
  const sink = new import_node_stream2.Writable({
    objectMode: true,
    write: (row, enc, next) => __async(void 0, null, function* () {
      rowCount += 1;
      yield onRow({ row });
      next();
    })
  });
  yield (0, import_promises2.pipeline)(
    import_node_fs2.default.createReadStream(filePath),
    (0, import_csv_parser.default)(),
    sink
  );
  return { rowCount };
});

// src/data-rows.mjs
var import_b4a2 = __toESM(require_b4a(), 1);
var dataRowEncoder = ({ headerRow }) => {
  const fieldSpecs = ({ row }) => {
    return headerRow.map((fieldSpec) => {
      const encoder2 = import_protocol_buffers_encodings.default[fieldSpec.encoder];
      if (!encoder2)
        throw new Error(`Could not find encoder for field ${fieldSpec.field}`);
      return {
        encoder: encoder2,
        value: row[fieldSpec.field],
        field: fieldSpec.field
      };
    });
  };
  function encodingLength4({ row }) {
    const specs = fieldSpecs({ row });
    const bufferLength = specs.map((spec) => {
      return spec.encoder.encodingLength(spec.value);
    }).reduce((acc, curr) => acc + curr, 0);
    return { bufferLength };
  }
  function encode7({ row }) {
    const specs = fieldSpecs({ row });
    const { bufferLength } = encodingLength4({ row });
    let buffer = import_b4a2.default.alloc(bufferLength);
    let bufOffset = 0;
    specs.forEach((spec) => {
      spec.encoder.encode(spec.value, buffer, bufOffset);
      bufOffset += spec.encoder.encode.bytes;
    });
    return { buffer, bufferLength };
  }
  return {
    encodingLength: encodingLength4,
    encode: encode7
  };
};
var dataRowDecoder = ({ headerRow }) => {
  return ({ buffer, offset = 0 }) => {
    const row = {};
    headerRow.forEach((headerSpec) => {
      const encoder2 = import_protocol_buffers_encodings.default[headerSpec.encoder];
      const value = encoder2.decode(buffer, offset);
      offset += encoder2.decode.bytes;
      row[headerSpec.field] = value;
    });
    return {
      row,
      buffer,
      offset
    };
  };
};

// src/header-row.mjs
var import_b4a3 = __toESM(require_b4a(), 1);
var create = ({ header, userHeader = [] }) => {
  const headerRow = header.map((field) => {
    const userSpec = userHeader.find((s) => s.field === field);
    let encoder2 = "string";
    if (typeof (userSpec == null ? void 0 : userSpec.encoder) === "string") {
      encoder2 = userSpec.encoder;
    }
    return {
      field,
      encoder: encoder2
    };
  });
  return { headerRow };
};
var encode4 = ({ headerRow }) => {
  let bufferLength = headerRow.map((s) => {
    return import_protocol_buffers_encodings.default.string.encodingLength(s.field) + import_protocol_buffers_encodings.default.string.encodingLength(s.encoder);
  }).reduce((a, c) => a + c, 0);
  const buffer = import_b4a3.default.alloc(bufferLength);
  bufferLength = 0;
  headerRow.forEach((s) => {
    import_protocol_buffers_encodings.default.string.encode(s.field, buffer, bufferLength);
    bufferLength += import_protocol_buffers_encodings.default.string.encode.bytes;
    import_protocol_buffers_encodings.default.string.encode(s.encoder, buffer, bufferLength);
    bufferLength += import_protocol_buffers_encodings.default.string.encode.bytes;
  });
  const compressedBuffer = gzipSync(buffer);
  return {
    buffer: compressedBuffer,
    bufferLength: compressedBuffer.length
  };
};
var decode4 = ({ buffer, offset = 0 }) => {
  const uncompressedBuffer = gunzipSync(buffer);
  const headerRow = [];
  while (offset < uncompressedBuffer.length - 1) {
    const field = import_protocol_buffers_encodings.default.string.decode(uncompressedBuffer, offset);
    offset += import_protocol_buffers_encodings.default.string.decode.bytes;
    const encoder2 = import_protocol_buffers_encodings.default.string.decode(uncompressedBuffer, offset);
    offset += import_protocol_buffers_encodings.default.string.decode.bytes;
    headerRow.push({
      field,
      encoder: encoder2
    });
  }
  return { headerRow, offset };
};

// src/categories.mjs
var import_b4a4 = __toESM(require_b4a(), 1);
var encode5 = ({ categories: categories2 }) => {
  let bufferLength = categories2.map((s) => {
    return import_protocol_buffers_encodings.default.string.encodingLength(s);
  }).reduce((a, c) => a + c, 0);
  let buffer = import_b4a4.default.alloc(bufferLength);
  bufferLength = 0;
  categories2.forEach((s) => {
    import_protocol_buffers_encodings.default.string.encode(s, buffer, bufferLength);
    bufferLength += import_protocol_buffers_encodings.default.string.encode.bytes;
  });
  const compressedBuffer = gzipSync(buffer);
  return {
    buffer: compressedBuffer,
    bufferLength: compressedBuffer.length
  };
};
var decode5 = ({ buffer, offset = 0 }) => {
  const uncompressedBuffer = gunzipSync(buffer);
  const categories2 = [];
  while (offset < uncompressedBuffer.length - 1) {
    const category = import_protocol_buffers_encodings.default.string.decode(uncompressedBuffer, offset);
    offset += import_protocol_buffers_encodings.default.string.decode.bytes;
    categories2.push(category);
  }
  return { categories: categories2, offset };
};

// src/stream-helpers.mjs
var import_node_fs3 = __toESM(require("fs"), 1);
var AwaitableWriteStream = (fileName) => {
  const writer = import_node_fs3.default.createWriteStream(fileName);
  return {
    write: (buffer) => {
      writer.write(buffer);
    },
    end: () => {
      return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.end();
      });
    }
  };
};

// src/archive-header.mjs
var import_b4a5 = __toESM(require_b4a(), 1);
var name = "TabularArchive";
var version = 1;
function create2() {
  let bufferLength = 0;
  bufferLength += import_protocol_buffers_encodings.default.string.encodingLength(name);
  bufferLength += import_protocol_buffers_encodings.default.int32.encodingLength(version);
  bufferLength += 4 + 4;
  bufferLength += 4 + 4;
  bufferLength += import_protocol_buffers_encodings.default.string.encodingLength("string".padEnd(maxEncoderTypeLength, " "));
  bufferLength += 4 + 4;
  bufferLength += 8 + 8;
  let buffer = import_b4a5.default.alloc(bufferLength);
  bufferLength = 0;
  import_protocol_buffers_encodings.default.string.encode(name, buffer, bufferLength);
  bufferLength += import_protocol_buffers_encodings.default.string.encode.bytes;
  import_protocol_buffers_encodings.default.int32.encode(version, buffer, bufferLength);
  bufferLength += import_protocol_buffers_encodings.default.int32.encode.bytes;
  let fileHead = buffer.byteLength;
  return {
    buffer,
    bufferLength,
    fileHead
  };
}
var decode6 = ({ buffer, offset = 0 }) => {
  const hName = import_protocol_buffers_encodings.default.string.decode(buffer, offset);
  offset += import_protocol_buffers_encodings.default.string.decode.bytes;
  const hVersion = import_protocol_buffers_encodings.default.int32.decode(buffer, offset);
  offset += import_protocol_buffers_encodings.default.int32.decode.bytes;
  if (name !== hName || version !== hVersion)
    throw Error(`Archive does not conform to v${version}`);
  const headerRowOffsetStart = import_protocol_buffers_encodings.default.int32.decode(buffer, offset);
  offset += import_protocol_buffers_encodings.default.int32.decode.bytes;
  const headerRowOffsetEnd = import_protocol_buffers_encodings.default.int32.decode(buffer, offset);
  offset += import_protocol_buffers_encodings.default.int32.decode.bytes;
  const categoriesOffsetStart = import_protocol_buffers_encodings.default.int32.decode(buffer, offset);
  offset += import_protocol_buffers_encodings.default.int32.decode.bytes;
  const categoriesOffsetEnd = import_protocol_buffers_encodings.default.int32.decode(buffer, offset);
  offset += import_protocol_buffers_encodings.default.int32.decode.bytes;
  const dataRowIdsEncoderString = import_protocol_buffers_encodings.default.string.decode(buffer, offset).trim();
  offset += import_protocol_buffers_encodings.default.string.decode.bytes;
  const dataRowIdsOffsetStart = import_protocol_buffers_encodings.default.int32.decode(buffer, offset);
  offset += import_protocol_buffers_encodings.default.int32.decode.bytes;
  const dataRowIdsOffsetEnd = import_protocol_buffers_encodings.default.int32.decode(buffer, offset);
  offset += import_protocol_buffers_encodings.default.int32.decode.bytes;
  const dataRowLengthsOffsetStart = import_protocol_buffers_encodings.default.int64.decode(buffer, offset);
  offset += import_protocol_buffers_encodings.default.int64.decode.bytes;
  const dataRowLengthsOffsetEnd = import_protocol_buffers_encodings.default.int64.decode(buffer, offset);
  offset += import_protocol_buffers_encodings.default.int64.decode.bytes;
  return {
    headerRowOffsetStart,
    headerRowOffsetEnd,
    categoriesOffsetStart,
    categoriesOffsetEnd,
    dataRowIdsEncoderString,
    dataRowIdsOffsetStart,
    dataRowIdsOffsetEnd,
    dataRowLengthsOffsetStart,
    dataRowLengthsOffsetEnd
  };
};

// src/user-supplied.mjs
function userIdEncoderFn({ idEncoder }) {
  let encoder2 = import_protocol_buffers_encodings.default.string;
  if (typeof idEncoder === "string") {
    encoder2 = import_protocol_buffers_encodings.default[idEncoder];
  }
  return encoder2;
}

// src/tabular-archive-encode.mjs
function encode6(_0) {
  return __async(this, arguments, function* ({
    csvFilePath,
    userHeader,
    userIdForRow,
    userIdEncoder,
    archiveFilePath
  }) {
    const tmpFileBase = `${archiveFilePath}-${Date.now()}`;
    const archiveParts = [
      {
        name: "headerRow",
        archiveHeaderInsert: (_02) => __async(this, [_02], function* ({ archiveHeader: archiveHeader2, tmpFilePath }) {
          const { size } = yield import_promises3.default.stat(tmpFilePath);
          import_protocol_buffers_encodings.default.int32.encode(archiveHeader2.fileHead, archiveHeader2.buffer, archiveHeader2.bufferLength);
          archiveHeader2.bufferLength += import_protocol_buffers_encodings.default.int32.encode.bytes;
          const end = archiveHeader2.fileHead + size;
          import_protocol_buffers_encodings.default.int32.encode(end, archiveHeader2.buffer, archiveHeader2.bufferLength);
          archiveHeader2.bufferLength += import_protocol_buffers_encodings.default.int32.encode.bytes;
          archiveHeader2.fileHead = end;
        })
      },
      {
        name: "categories",
        archiveHeaderInsert: (_02) => __async(this, [_02], function* ({ archiveHeader: archiveHeader2, tmpFilePath }) {
          const { size } = yield import_promises3.default.stat(tmpFilePath);
          import_protocol_buffers_encodings.default.int32.encode(archiveHeader2.fileHead, archiveHeader2.buffer, archiveHeader2.bufferLength);
          archiveHeader2.bufferLength += import_protocol_buffers_encodings.default.int32.encode.bytes;
          const end = archiveHeader2.fileHead + size;
          import_protocol_buffers_encodings.default.int32.encode(end, archiveHeader2.buffer, archiveHeader2.bufferLength);
          archiveHeader2.bufferLength += import_protocol_buffers_encodings.default.int32.encode.bytes;
          archiveHeader2.fileHead = end;
        })
      },
      {
        name: "dataRowIdEncoderString",
        doNotInlineInArchive: true,
        archiveHeaderInsert: (_02) => __async(this, [_02], function* ({ archiveHeader: archiveHeader2 }) {
          const dataRowIdEncoderString2 = getDataRowIdEncoderString({ userIdEncoder });
          import_protocol_buffers_encodings.default.string.encode(dataRowIdEncoderString2, archiveHeader2.buffer, archiveHeader2.bufferLength);
          archiveHeader2.bufferLength += import_protocol_buffers_encodings.default.string.encode.bytes;
        })
      },
      {
        name: "dataRowIds",
        archiveHeaderInsert: (_02) => __async(this, [_02], function* ({ archiveHeader: archiveHeader2, tmpFilePath }) {
          const { size } = yield import_promises3.default.stat(tmpFilePath);
          import_protocol_buffers_encodings.default.int32.encode(archiveHeader2.fileHead, archiveHeader2.buffer, archiveHeader2.bufferLength);
          archiveHeader2.bufferLength += import_protocol_buffers_encodings.default.int32.encode.bytes;
          const end = archiveHeader2.fileHead + size;
          import_protocol_buffers_encodings.default.int32.encode(end, archiveHeader2.buffer, archiveHeader2.bufferLength);
          archiveHeader2.bufferLength += import_protocol_buffers_encodings.default.int32.encode.bytes;
          archiveHeader2.fileHead = end;
        })
      },
      {
        name: "dataRowLengths",
        archiveHeaderInsert: (_02) => __async(this, [_02], function* ({ archiveHeader: archiveHeader2, tmpFilePath }) {
          const { size } = yield import_promises3.default.stat(tmpFilePath);
          import_protocol_buffers_encodings.default.int64.encode(archiveHeader2.fileHead, archiveHeader2.buffer, archiveHeader2.bufferLength);
          archiveHeader2.bufferLength += import_protocol_buffers_encodings.default.int64.encode.bytes;
          const end = archiveHeader2.fileHead + size;
          import_protocol_buffers_encodings.default.int64.encode(end, archiveHeader2.buffer, archiveHeader2.bufferLength);
          archiveHeader2.bufferLength += import_protocol_buffers_encodings.default.int64.encode.bytes;
          archiveHeader2.fileHead = end;
        })
      },
      {
        name: "dataRows",
        archiveHeaderInsert: () => __async(this, null, function* () {
        })
      }
    ].map((part) => {
      const tmpFilePath = `${tmpFileBase}-${part.name}`;
      const tmpFile = AwaitableWriteStream(tmpFilePath);
      return __spreadProps(__spreadValues({}, part), {
        tmpFilePath,
        tmpFile
      });
    });
    const archivePartsNamed = archiveParts.map((part) => {
      return {
        [part.name]: __spreadValues({}, part)
      };
    }).reduce((obj, curr) => {
      return __spreadValues(__spreadValues({}, obj), curr);
    }, {});
    const { header } = yield readCsvHeaderRow({ filePath: csvFilePath });
    const { headerRow } = yield create({ header, userHeader });
    const headerRowEncoded = yield encode4({ headerRow });
    archivePartsNamed.headerRow.tmpFile.write(headerRowEncoded.buffer);
    const rowEncoder = dataRowEncoder({ headerRow });
    const dataRowIdEncoder = userIdEncoderFn({ idEncoder: userIdEncoder });
    const dataRowIdEncoderString = getDataRowIdEncoderString({ userIdEncoder });
    const dataRowIdEncoderBuffer = import_b4a6.default.alloc(
      import_protocol_buffers_encodings.default.string.encodingLength(dataRowIdEncoderString)
    );
    import_protocol_buffers_encodings.default.string.encode(dataRowIdEncoderString, dataRowIdEncoderBuffer, 0);
    archivePartsNamed.dataRowIdEncoderString.tmpFile.write(dataRowIdEncoderBuffer);
    const onRow = ({ row }) => {
      const { buffer } = rowEncoder.encode({ row });
      const compressedBuffer = gzipSync(buffer);
      archivePartsNamed.dataRows.tmpFile.write(compressedBuffer);
      const encodedLengthBuffer = import_b4a6.default.alloc(
        import_protocol_buffers_encodings.default.int64.encodingLength(compressedBuffer.length)
      );
      import_protocol_buffers_encodings.default.int64.encode(compressedBuffer.length, encodedLengthBuffer, 0);
      archivePartsNamed.dataRowLengths.tmpFile.write(encodedLengthBuffer);
      if (typeof userIdForRow === "function") {
        const id = userIdForRow({ row });
        const bufferLength = dataRowIdEncoder.encodingLength(id);
        let buffer2 = import_b4a6.default.alloc(bufferLength);
        dataRowIdEncoder.encode(id, buffer2, 0);
        archivePartsNamed.dataRowIds.tmpFile.write(buffer2);
      }
    };
    const { rowCount } = yield readCsvDataRows({ filePath: csvFilePath, onRow });
    const categoriesEncoded = encode5({ categories });
    archivePartsNamed.categories.tmpFile.write(categoriesEncoded.buffer);
    for (const part of archiveParts) {
      yield part.tmpFile.end();
    }
    const archiveHeader = create2();
    for (const part of archiveParts) {
      yield part.archiveHeaderInsert(__spreadProps(__spreadValues({}, part), { archiveHeader }));
    }
    const archive = AwaitableWriteStream(archiveFilePath);
    archive.write(archiveHeader.buffer);
    const concatStream = () => {
      return new import_node_stream3.Writable({
        write: (buffer, enc, next) => {
          archive.write(buffer);
          next();
        }
      });
    };
    for (const part of archiveParts) {
      if (part.doNotInlineInArchive === true)
        continue;
      yield (0, import_promises4.pipeline)(
        import_node_fs4.default.createReadStream(part.tmpFilePath),
        concatStream()
      );
    }
    for (const part of archiveParts) {
      yield import_promises3.default.unlink(part.tmpFilePath);
    }
    return { rowCount };
  });
}
function getDataRowIdEncoderString({ userIdEncoder }) {
  let dataRowIdEncoderString = "string".padEnd(maxEncoderTypeLength, " ");
  if (typeof userIdEncoder === "string") {
    dataRowIdEncoderString = userIdEncoder.padEnd(maxEncoderTypeLength, " ");
  }
  return dataRowIdEncoderString;
}

// src/tabular-archive-decode.mjs
var import_b4a7 = __toESM(require_b4a(), 1);
var readArchiveRanges = ({ readRange: readRange2 }) => {
  return {
    archiveHeader: (_0) => __async(void 0, [_0], function* ({ filePath }) {
      const emptyArchiveHeader = create2();
      const start = 0;
      const end = emptyArchiveHeader.buffer.byteLength;
      return readRange2({
        filePath,
        start,
        end
      });
    }),
    headerRow: (_0) => __async(void 0, [_0], function* ({ filePath, headerRowOffsetStart, headerRowOffsetEnd }) {
      return readRange2({
        filePath,
        start: headerRowOffsetStart,
        end: headerRowOffsetEnd
      });
    }),
    categories: (_0) => __async(void 0, [_0], function* ({ filePath, categoriesOffsetStart, categoriesOffsetEnd }) {
      return readRange2({
        filePath,
        start: categoriesOffsetStart,
        end: categoriesOffsetEnd
      });
    }),
    dataRowIds: (_0) => __async(void 0, [_0], function* ({ filePath, dataRowIdsOffsetStart, dataRowIdsOffsetEnd }) {
      return readRange2({
        filePath,
        start: dataRowIdsOffsetStart,
        end: dataRowIdsOffsetEnd
      });
    }),
    dataRowLengths: (_0) => __async(void 0, [_0], function* ({ filePath, dataRowLengthsOffsetStart, dataRowLengthsOffsetEnd }) {
      return readRange2({
        filePath,
        start: dataRowLengthsOffsetStart,
        end: dataRowLengthsOffsetEnd
      });
    }),
    archiveHeaderPartsBuffer: (_0) => __async(void 0, [_0], function* ({
      filePath,
      headerRowOffsetStart,
      headerRowOffsetEnd,
      categoriesOffsetStart,
      categoriesOffsetEnd,
      dataRowIdsOffsetStart,
      dataRowIdsOffsetEnd,
      dataRowLengthsOffsetStart,
      dataRowLengthsOffsetEnd
    }) {
      const ranges = [
        {
          name: "headerRow",
          start: headerRowOffsetStart,
          end: headerRowOffsetEnd
        },
        {
          name: "categories",
          start: categoriesOffsetStart,
          end: categoriesOffsetEnd
        },
        {
          name: "dataRowIds",
          start: dataRowIdsOffsetStart,
          end: dataRowIdsOffsetEnd
        },
        {
          name: "dataRowLengths",
          start: dataRowLengthsOffsetStart,
          end: dataRowLengthsOffsetEnd
        }
      ];
      const buffer = yield readRange2({
        filePath,
        ranges: [{ start: headerRowOffsetStart, end: dataRowLengthsOffsetEnd }]
      });
      let offset = 0;
      const parts = {};
      for (const range of ranges) {
        const length = range.end - range.start;
        const partBuffer = buffer.subarray(offset, offset + length);
        offset += length;
        parts[`${range.name}Buffer`] = partBuffer;
      }
      return parts;
    })
  };
};
var decode7 = ({ readRange: readRange2 }) => (_0) => __async(void 0, [_0], function* ({ archiveFilePath }) {
  const archiveRanges = readArchiveRanges({ readRange: readRange2 });
  const archiveHeaderBuffer = yield archiveRanges.archiveHeader({
    filePath: archiveFilePath
  });
  const archiveHeader = decode6({ buffer: archiveHeaderBuffer });
  const { dataRowIdsEncoderString } = archiveHeader;
  const startOfDataRows = archiveHeader.dataRowLengthsOffsetEnd;
  const userIdEncoder = import_protocol_buffers_encodings.default[dataRowIdsEncoderString];
  const readOptions = __spreadValues({
    filePath: archiveFilePath
  }, archiveHeader);
  const {
    headerRowBuffer,
    categoriesBuffer,
    dataRowIdsBuffer,
    dataRowLengthsBuffer
  } = yield archiveRanges.archiveHeaderPartsBuffer(readOptions);
  const { headerRow } = decode4({ buffer: headerRowBuffer });
  const { categories: categories2 } = decode5({ buffer: categoriesBuffer });
  setCategories(categories2);
  const dataRowIdsDecoded = decodeDataRowIdsBuffer({ buffer: dataRowIdsBuffer });
  const { dataRowIds } = dataRowIdsDecoded;
  const { dataRowLengths } = decodeRowLengthsBuffer({ buffer: dataRowLengthsBuffer });
  const rowDecoder = dataRowDecoder({ headerRow });
  const rowCount = dataRowLengths.length;
  return {
    headerRow,
    rowCount,
    categories: categories2,
    getRowBySequence,
    getRowsBySequence,
    getRowById,
    getRowsByIdWithPage
  };
  function decodeDataRowIdsBuffer({ buffer, offset = 0 }) {
    const dataRowIds2 = [];
    while (offset < buffer.length - 1) {
      const id = userIdEncoder.decode(buffer, offset);
      offset += userIdEncoder.decode.bytes;
      dataRowIds2.push(id);
    }
    return { dataRowIds: dataRowIds2, offset };
  }
  function decodeRowLengthsBuffer({ buffer, offset = 0 }) {
    const dataRowLengths2 = [];
    while (offset < buffer.length - 1) {
      const len = import_protocol_buffers_encodings.default.int64.decode(buffer, offset);
      offset += import_protocol_buffers_encodings.default.int64.decode.bytes;
      dataRowLengths2.push(len);
    }
    return { dataRowLengths: dataRowLengths2, offset };
  }
  function sum(accumulator, current) {
    return accumulator + current;
  }
  function getRowBySequence(_02) {
    return __async(this, arguments, function* ({ rowNumber }) {
      const start = dataRowLengths.slice(0, rowNumber).reduce(sum, startOfDataRows);
      const end = dataRowLengths.slice(rowNumber, rowNumber + 1).reduce(sum, start);
      const compressedBuffer = yield readRange2({
        filePath: archiveFilePath,
        start,
        end
      });
      const buffer = gunzipSync(compressedBuffer);
      const { row } = rowDecoder({ buffer });
      return { row };
    });
  }
  function getRowsBySequence(_02) {
    return __asyncGenerator(this, arguments, function* ({ startRowNumber, endRowNumber }) {
      const start = dataRowLengths.slice(0, startRowNumber).reduce(sum, startOfDataRows);
      const rowLengths = dataRowLengths.slice(startRowNumber, endRowNumber + 1);
      const end = rowLengths.reduce(sum, start);
      const compressedBuffer = yield new __await(readRange2({
        filePath: archiveFilePath,
        start,
        end
      }));
      let offsetStart = 0;
      for (let i = 0; i < rowLengths.length; i++) {
        const offsetEnd = offsetStart + rowLengths[i];
        const compressedBufferSlice = compressedBuffer.slice(offsetStart, offsetEnd);
        const buffer = gunzipSync(compressedBufferSlice);
        const { row } = rowDecoder({ buffer });
        yield { row, rowNumber: startRowNumber + i };
        offsetStart = offsetEnd;
      }
    });
  }
  function getRowById(_02) {
    return __async(this, arguments, function* ({ id }) {
      const index = dataRowIds.indexOf(id);
      if (index === -1)
        throw new Error(`No id value ${id} in this archive`);
      return yield getRowBySequence({ rowNumber: index });
    });
  }
  function getRowsByIdWithPage({ id, pageCount }) {
    const index = dataRowIds.indexOf(id);
    if (index === -1)
      throw new Error(`No id value ${id} in this archive`);
    const rowOffset = (pageCount - 1) / 2;
    let startRowNumber = index - Math.floor(rowOffset);
    let endRowNumber = index + Math.ceil(rowOffset);
    if (startRowNumber < 0) {
      const diff = 0 - startRowNumber;
      startRowNumber = 0;
      endRowNumber += diff;
    } else if (endRowNumber > dataRowIds.length - 1) {
      const diff = endRowNumber - (dataRowIds.length - 1);
      startRowNumber -= diff;
      endRowNumber -= diff;
    }
    return getRowsBySequence({ startRowNumber, endRowNumber });
  }
});

// index.mjs
var decodeFs = decode7({ readRange });
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  decode,
  decodeFs,
  encode,
  encoderTypes
});
