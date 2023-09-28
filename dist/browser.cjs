var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
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

// node_modules/b4a/lib/ascii.js
var require_ascii = __commonJS({
  "node_modules/b4a/lib/ascii.js"(exports, module2) {
    function byteLength(string) {
      return string.length;
    }
    function toString(buffer) {
      const len = buffer.byteLength;
      let result = "";
      for (let i = 0; i < len; i++) {
        result += String.fromCharCode(buffer[i]);
      }
      return result;
    }
    function write(buffer, string, offset = 0, length = byteLength(string)) {
      const len = Math.min(length, buffer.byteLength - offset);
      for (let i = 0; i < len; i++) {
        buffer[offset + i] = string.charCodeAt(i);
      }
      return len;
    }
    module2.exports = {
      byteLength,
      toString,
      write
    };
  }
});

// node_modules/b4a/lib/base64.js
var require_base64 = __commonJS({
  "node_modules/b4a/lib/base64.js"(exports, module2) {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var codes = new Uint8Array(256);
    for (let i = 0; i < alphabet.length; i++) {
      codes[alphabet.charCodeAt(i)] = i;
    }
    codes[
      /* - */
      45
    ] = 62;
    codes[
      /* _ */
      95
    ] = 63;
    function byteLength(string) {
      let len = string.length;
      if (string.charCodeAt(len - 1) === 61)
        len--;
      if (len > 1 && string.charCodeAt(len - 1) === 61)
        len--;
      return len * 3 >>> 2;
    }
    function toString(buffer) {
      const len = buffer.byteLength;
      let result = "";
      for (let i = 0; i < len; i += 3) {
        result += alphabet[buffer[i] >> 2] + alphabet[(buffer[i] & 3) << 4 | buffer[i + 1] >> 4] + alphabet[(buffer[i + 1] & 15) << 2 | buffer[i + 2] >> 6] + alphabet[buffer[i + 2] & 63];
      }
      if (len % 3 === 2) {
        result = result.substring(0, result.length - 1) + "=";
      } else if (len % 3 === 1) {
        result = result.substring(0, result.length - 2) + "==";
      }
      return result;
    }
    function write(buffer, string, offset = 0, length = byteLength(string)) {
      const len = Math.min(length, buffer.byteLength - offset);
      for (let i = 0, j = 0; j < len; i += 4) {
        const a = codes[string.charCodeAt(i)];
        const b = codes[string.charCodeAt(i + 1)];
        const c = codes[string.charCodeAt(i + 2)];
        const d = codes[string.charCodeAt(i + 3)];
        buffer[j++] = a << 2 | b >> 4;
        buffer[j++] = (b & 15) << 4 | c >> 2;
        buffer[j++] = (c & 3) << 6 | d & 63;
      }
      return len;
    }
    module2.exports = {
      byteLength,
      toString,
      write
    };
  }
});

// node_modules/b4a/lib/hex.js
var require_hex = __commonJS({
  "node_modules/b4a/lib/hex.js"(exports, module2) {
    function byteLength(string) {
      return string.length >>> 1;
    }
    function toString(buffer) {
      const len = buffer.byteLength;
      buffer = new DataView(buffer.buffer, buffer.byteOffset, len);
      let result = "";
      let i = 0;
      for (let n = len - len % 4; i < n; i += 4) {
        result += buffer.getUint32(i).toString(16).padStart(8, "0");
      }
      for (; i < len; i++) {
        result += buffer.getUint8(i).toString(16).padStart(2, "0");
      }
      return result;
    }
    function write(buffer, string, offset = 0, length = byteLength(string)) {
      const len = Math.min(length, buffer.byteLength - offset);
      for (let i = 0; i < len; i++) {
        const a = hexValue(string.charCodeAt(i * 2));
        const b = hexValue(string.charCodeAt(i * 2 + 1));
        if (a === void 0 || b === void 0) {
          return buffer.subarray(0, i);
        }
        buffer[offset + i] = a << 4 | b;
      }
      return len;
    }
    module2.exports = {
      byteLength,
      toString,
      write
    };
    function hexValue(char) {
      if (char >= 48 && char <= 57)
        return char - 48;
      if (char >= 65 && char <= 70)
        return char - 65 + 10;
      if (char >= 97 && char <= 102)
        return char - 97 + 10;
    }
  }
});

// node_modules/b4a/lib/utf8.js
var require_utf8 = __commonJS({
  "node_modules/b4a/lib/utf8.js"(exports, module2) {
    function byteLength(string) {
      let length = 0;
      for (let i = 0, n = string.length; i < n; i++) {
        const code = string.charCodeAt(i);
        if (code >= 55296 && code <= 56319 && i + 1 < n) {
          const code2 = string.charCodeAt(i + 1);
          if (code2 >= 56320 && code2 <= 57343) {
            length += 4;
            i++;
            continue;
          }
        }
        if (code <= 127)
          length += 1;
        else if (code <= 2047)
          length += 2;
        else
          length += 3;
      }
      return length;
    }
    var toString;
    if (typeof TextDecoder !== "undefined") {
      const decoder = new TextDecoder();
      toString = function toString2(buffer) {
        return decoder.decode(buffer);
      };
    } else {
      toString = function toString2(buffer) {
        const len = buffer.byteLength;
        let output = "";
        let i = 0;
        while (i < len) {
          let byte = buffer[i];
          if (byte <= 127) {
            output += String.fromCharCode(byte);
            i++;
            continue;
          }
          let bytesNeeded = 0;
          let codePoint = 0;
          if (byte <= 223) {
            bytesNeeded = 1;
            codePoint = byte & 31;
          } else if (byte <= 239) {
            bytesNeeded = 2;
            codePoint = byte & 15;
          } else if (byte <= 244) {
            bytesNeeded = 3;
            codePoint = byte & 7;
          }
          if (len - i - bytesNeeded > 0) {
            let k = 0;
            while (k < bytesNeeded) {
              byte = buffer[i + k + 1];
              codePoint = codePoint << 6 | byte & 63;
              k += 1;
            }
          } else {
            codePoint = 65533;
            bytesNeeded = len - i;
          }
          output += String.fromCodePoint(codePoint);
          i += bytesNeeded + 1;
        }
        return output;
      };
    }
    var write;
    if (typeof TextEncoder !== "undefined") {
      const encoder2 = new TextEncoder();
      write = function write2(buffer, string, offset = 0, length = byteLength(string)) {
        const len = Math.min(length, buffer.byteLength - offset);
        encoder2.encodeInto(string, buffer.subarray(offset, offset + len));
        return len;
      };
    } else {
      write = function write2(buffer, string, offset = 0, length = byteLength(string)) {
        const len = Math.min(length, buffer.byteLength - offset);
        buffer = buffer.subarray(offset, offset + len);
        let i = 0;
        let j = 0;
        while (i < string.length) {
          const code = string.codePointAt(i);
          if (code <= 127) {
            buffer[j++] = code;
            i++;
            continue;
          }
          let count = 0;
          let bits2 = 0;
          if (code <= 2047) {
            count = 6;
            bits2 = 192;
          } else if (code <= 65535) {
            count = 12;
            bits2 = 224;
          } else if (code <= 2097151) {
            count = 18;
            bits2 = 240;
          }
          buffer[j++] = bits2 | code >> count;
          count -= 6;
          while (count >= 0) {
            buffer[j++] = 128 | code >> count & 63;
            count -= 6;
          }
          i += code >= 65536 ? 2 : 1;
        }
        return len;
      };
    }
    module2.exports = {
      byteLength,
      toString,
      write
    };
  }
});

// node_modules/b4a/lib/utf16le.js
var require_utf16le = __commonJS({
  "node_modules/b4a/lib/utf16le.js"(exports, module2) {
    function byteLength(string) {
      return string.length * 2;
    }
    function toString(buffer) {
      const len = buffer.byteLength;
      let result = "";
      for (let i = 0; i < len - 1; i += 2) {
        result += String.fromCharCode(buffer[i] + buffer[i + 1] * 256);
      }
      return result;
    }
    function write(buffer, string, offset = 0, length = byteLength(string)) {
      const len = Math.min(length, buffer.byteLength - offset);
      let units = len;
      for (let i = 0; i < string.length; ++i) {
        if ((units -= 2) < 0)
          break;
        const c = string.charCodeAt(i);
        const hi = c >> 8;
        const lo = c % 256;
        buffer[offset + i * 2] = lo;
        buffer[offset + i * 2 + 1] = hi;
      }
      return len;
    }
    module2.exports = {
      byteLength,
      toString,
      write
    };
  }
});

// node_modules/b4a/browser.js
var require_browser = __commonJS({
  "node_modules/b4a/browser.js"(exports, module2) {
    var ascii = require_ascii();
    var base64 = require_base64();
    var hex = require_hex();
    var utf8 = require_utf8();
    var utf16le = require_utf16le();
    var LE = new Uint8Array(Uint16Array.of(255).buffer)[0] === 255;
    function codecFor(encoding) {
      switch (encoding) {
        case "ascii":
          return ascii;
        case "base64":
          return base64;
        case "hex":
          return hex;
        case "utf8":
        case "utf-8":
        case void 0:
          return utf8;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return utf16le;
        default:
          throw new Error(`Unknown encoding: ${encoding}`);
      }
    }
    function isBuffer(value) {
      return value instanceof Uint8Array;
    }
    function isEncoding(encoding) {
      try {
        codecFor(encoding);
        return true;
      } catch (e) {
        return false;
      }
    }
    function alloc(size, fill2, encoding) {
      const buffer = new Uint8Array(size);
      if (fill2 !== void 0)
        exports.fill(buffer, fill2, 0, buffer.byteLength, encoding);
      return buffer;
    }
    function allocUnsafe(size) {
      return new Uint8Array(size);
    }
    function allocUnsafeSlow(size) {
      return new Uint8Array(size);
    }
    function byteLength(string, encoding) {
      return codecFor(encoding).byteLength(string);
    }
    function compare(a, b) {
      if (a === b)
        return 0;
      const len = Math.min(a.byteLength, b.byteLength);
      a = new DataView(a.buffer, a.byteOffset, a.byteLength);
      b = new DataView(b.buffer, b.byteOffset, b.byteLength);
      let i = 0;
      for (let n = len - len % 4; i < n; i += 4) {
        const x = a.getUint32(i, LE);
        const y = b.getUint32(i, LE);
        if (x !== y)
          break;
      }
      for (; i < len; i++) {
        const x = a.getUint8(i);
        const y = b.getUint8(i);
        if (x < y)
          return -1;
        if (x > y)
          return 1;
      }
      return a.byteLength > b.byteLength ? 1 : a.byteLength < b.byteLength ? -1 : 0;
    }
    function concat(buffers, totalLength) {
      if (totalLength === void 0) {
        totalLength = buffers.reduce((len, buffer) => len + buffer.byteLength, 0);
      }
      const result = new Uint8Array(totalLength);
      let offset = 0;
      for (const buffer of buffers) {
        if (offset + buffer.byteLength > result.byteLength) {
          const sub = buffer.subarray(0, result.byteLength - offset);
          result.set(sub, offset);
          return result;
        }
        result.set(buffer, offset);
        offset += buffer.byteLength;
      }
      return result;
    }
    function copy(source, target, targetStart = 0, start = 0, end = source.byteLength) {
      if (end > 0 && end < start)
        return 0;
      if (end === start)
        return 0;
      if (source.byteLength === 0 || target.byteLength === 0)
        return 0;
      if (targetStart < 0)
        throw new RangeError("targetStart is out of range");
      if (start < 0 || start >= source.byteLength)
        throw new RangeError("sourceStart is out of range");
      if (end < 0)
        throw new RangeError("sourceEnd is out of range");
      if (targetStart >= target.byteLength)
        targetStart = target.byteLength;
      if (end > source.byteLength)
        end = source.byteLength;
      if (target.byteLength - targetStart < end - start) {
        end = target.length - targetStart + start;
      }
      const len = end - start;
      if (source === target) {
        target.copyWithin(targetStart, start, end);
      } else {
        target.set(source.subarray(start, end), targetStart);
      }
      return len;
    }
    function equals(a, b) {
      if (a === b)
        return true;
      if (a.byteLength !== b.byteLength)
        return false;
      const len = a.byteLength;
      a = new DataView(a.buffer, a.byteOffset, a.byteLength);
      b = new DataView(b.buffer, b.byteOffset, b.byteLength);
      let i = 0;
      for (let n = len - len % 4; i < n; i += 4) {
        if (a.getUint32(i, LE) !== b.getUint32(i, LE))
          return false;
      }
      for (; i < len; i++) {
        if (a.getUint8(i) !== b.getUint8(i))
          return false;
      }
      return true;
    }
    function fill(buffer, value, offset, end, encoding) {
      if (typeof value === "string") {
        if (typeof offset === "string") {
          encoding = offset;
          offset = 0;
          end = buffer.byteLength;
        } else if (typeof end === "string") {
          encoding = end;
          end = buffer.byteLength;
        }
      } else if (typeof value === "number") {
        value = value & 255;
      } else if (typeof value === "boolean") {
        value = +value;
      }
      if (offset < 0 || buffer.byteLength < offset || buffer.byteLength < end) {
        throw new RangeError("Out of range index");
      }
      if (offset === void 0)
        offset = 0;
      if (end === void 0)
        end = buffer.byteLength;
      if (end <= offset)
        return buffer;
      if (!value)
        value = 0;
      if (typeof value === "number") {
        for (let i = offset; i < end; ++i) {
          buffer[i] = value;
        }
      } else {
        value = isBuffer(value) ? value : from(value, encoding);
        const len = value.byteLength;
        for (let i = 0; i < end - offset; ++i) {
          buffer[i + offset] = value[i % len];
        }
      }
      return buffer;
    }
    function from(value, encodingOrOffset, length) {
      if (typeof value === "string")
        return fromString(value, encodingOrOffset);
      if (Array.isArray(value))
        return fromArray(value);
      if (ArrayBuffer.isView(value))
        return fromBuffer(value);
      return fromArrayBuffer(value, encodingOrOffset, length);
    }
    function fromString(string, encoding) {
      const codec = codecFor(encoding);
      const buffer = new Uint8Array(codec.byteLength(string));
      codec.write(buffer, string, 0, buffer.byteLength);
      return buffer;
    }
    function fromArray(array) {
      const buffer = new Uint8Array(array.length);
      buffer.set(array);
      return buffer;
    }
    function fromBuffer(buffer) {
      const copy2 = new Uint8Array(buffer.byteLength);
      copy2.set(buffer);
      return copy2;
    }
    function fromArrayBuffer(arrayBuffer, byteOffset, length) {
      return new Uint8Array(arrayBuffer, byteOffset, length);
    }
    function includes(buffer, value, byteOffset, encoding) {
      return indexOf(buffer, value, byteOffset, encoding) !== -1;
    }
    function bidirectionalIndexOf(buffer, value, byteOffset, encoding, first) {
      if (buffer.byteLength === 0)
        return -1;
      if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset === void 0) {
        byteOffset = first ? 0 : buffer.length - 1;
      } else if (byteOffset < 0) {
        byteOffset += buffer.byteLength;
      }
      if (byteOffset >= buffer.byteLength) {
        if (first)
          return -1;
        else
          byteOffset = buffer.byteLength - 1;
      } else if (byteOffset < 0) {
        if (first)
          byteOffset = 0;
        else
          return -1;
      }
      if (typeof value === "string") {
        value = from(value, encoding);
      } else if (typeof value === "number") {
        value = value & 255;
        if (first) {
          return buffer.indexOf(value, byteOffset);
        } else {
          return buffer.lastIndexOf(value, byteOffset);
        }
      }
      if (value.byteLength === 0)
        return -1;
      if (first) {
        let foundIndex = -1;
        for (let i = byteOffset; i < buffer.byteLength; i++) {
          if (buffer[i] === value[foundIndex === -1 ? 0 : i - foundIndex]) {
            if (foundIndex === -1)
              foundIndex = i;
            if (i - foundIndex + 1 === value.byteLength)
              return foundIndex;
          } else {
            if (foundIndex !== -1)
              i -= i - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + value.byteLength > buffer.byteLength) {
          byteOffset = buffer.byteLength - value.byteLength;
        }
        for (let i = byteOffset; i >= 0; i--) {
          let found = true;
          for (let j = 0; j < value.byteLength; j++) {
            if (buffer[i + j] !== value[j]) {
              found = false;
              break;
            }
          }
          if (found)
            return i;
        }
      }
      return -1;
    }
    function indexOf(buffer, value, byteOffset, encoding) {
      return bidirectionalIndexOf(
        buffer,
        value,
        byteOffset,
        encoding,
        true
        /* first */
      );
    }
    function lastIndexOf(buffer, value, byteOffset, encoding) {
      return bidirectionalIndexOf(
        buffer,
        value,
        byteOffset,
        encoding,
        false
        /* last */
      );
    }
    function swap(buffer, n, m) {
      const i = buffer[n];
      buffer[n] = buffer[m];
      buffer[m] = i;
    }
    function swap16(buffer) {
      const len = buffer.byteLength;
      if (len % 2 !== 0)
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (let i = 0; i < len; i += 2)
        swap(buffer, i, i + 1);
      return buffer;
    }
    function swap32(buffer) {
      const len = buffer.byteLength;
      if (len % 4 !== 0)
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (let i = 0; i < len; i += 4) {
        swap(buffer, i, i + 3);
        swap(buffer, i + 1, i + 2);
      }
      return buffer;
    }
    function swap64(buffer) {
      const len = buffer.byteLength;
      if (len % 8 !== 0)
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (let i = 0; i < len; i += 8) {
        swap(buffer, i, i + 7);
        swap(buffer, i + 1, i + 6);
        swap(buffer, i + 2, i + 5);
        swap(buffer, i + 3, i + 4);
      }
      return buffer;
    }
    function toBuffer(buffer) {
      return buffer;
    }
    function toString(buffer, encoding, start = 0, end = buffer.byteLength) {
      const len = buffer.byteLength;
      if (start >= len)
        return "";
      if (end <= start)
        return "";
      if (start < 0)
        start = 0;
      if (end > len)
        end = len;
      if (start !== 0 || end < len)
        buffer = buffer.subarray(start, end);
      return codecFor(encoding).toString(buffer);
    }
    function write(buffer, string, offset, length, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
      } else if (length === void 0 && typeof offset === "string") {
        encoding = offset;
        offset = void 0;
      } else if (encoding === void 0 && typeof length === "string") {
        encoding = length;
        length = void 0;
      }
      return codecFor(encoding).write(buffer, string, offset, length);
    }
    function writeDoubleLE(buffer, value, offset) {
      if (offset === void 0)
        offset = 0;
      const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      view.setFloat64(offset, value, true);
      return offset + 8;
    }
    function writeFloatLE(buffer, value, offset) {
      if (offset === void 0)
        offset = 0;
      const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      view.setFloat32(offset, value, true);
      return offset + 4;
    }
    function writeUInt32LE(buffer, value, offset) {
      if (offset === void 0)
        offset = 0;
      const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      view.setUint32(offset, value, true);
      return offset + 4;
    }
    function writeInt32LE(buffer, value, offset) {
      if (offset === void 0)
        offset = 0;
      const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      view.setInt32(offset, value, true);
      return offset + 4;
    }
    function readDoubleLE(buffer, offset) {
      if (offset === void 0)
        offset = 0;
      const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      return view.getFloat64(offset, true);
    }
    function readFloatLE(buffer, offset) {
      if (offset === void 0)
        offset = 0;
      const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      return view.getFloat32(offset, true);
    }
    function readUInt32LE(buffer, offset) {
      if (offset === void 0)
        offset = 0;
      const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      return view.getUint32(offset, true);
    }
    function readInt32LE(buffer, offset) {
      if (offset === void 0)
        offset = 0;
      const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      return view.getInt32(offset, true);
    }
    module2.exports = exports = {
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
    module2.exports = encode4;
    var MSB = 128;
    var REST = 127;
    var MSBALL = ~REST;
    var INT = Math.pow(2, 31);
    function encode4(num, out, offset) {
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
      encode4.bytes = offset - oldOffset + 1;
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
    exports.encode = function encode4(v, b, o) {
      v = v >= 0 ? v * 2 : v * -2 - 1;
      var r = varint.encode(v, b, o);
      encode4.bytes = varint.encode.bytes;
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
    var b4a7 = require_browser();
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
      function encode4(val, buffer, offset) {
        var oldOffset = offset;
        var len = bufferLength(val);
        varint.encode(len, buffer, offset);
        offset += varint.encode.bytes;
        if (b4a7.isBuffer(val))
          b4a7.copy(val, buffer, offset);
        else
          b4a7.write(buffer, val, offset, len);
        offset += len;
        encode4.bytes = offset - oldOffset;
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
      function encode4(val, buffer, offset) {
        var oldOffset = offset;
        var len = b4a7.byteLength(val);
        varint.encode(len, buffer, offset, "utf-8");
        offset += varint.encode.bytes;
        b4a7.write(buffer, val, offset, len);
        offset += len;
        encode4.bytes = offset - oldOffset;
        return buffer;
      },
      function decode8(buffer, offset) {
        var oldOffset = offset;
        var len = varint.decode(buffer, offset);
        offset += varint.decode.bytes;
        var val = b4a7.toString(buffer, "utf-8", offset, offset + len);
        offset += len;
        decode8.bytes = offset - oldOffset;
        return val;
      },
      function encodingLength4(val) {
        var len = b4a7.byteLength(val);
        return varint.encodingLength(len) + len;
      }
    );
    exports.bool = encoder2(
      0,
      function encode4(val, buffer, offset) {
        buffer[offset] = val ? 1 : 0;
        encode4.bytes = 1;
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
      function encode4(val, buffer, offset) {
        varint.encode(val < 0 ? val + 4294967296 : val, buffer, offset);
        encode4.bytes = varint.encode.bytes;
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
      function encode4(val, buffer, offset) {
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
          encode4.bytes = 10;
        } else {
          varint.encode(val, buffer, offset);
          encode4.bytes = varint.encode.bytes;
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
          var subset = b4a7.allocUnsafe(limit);
          b4a7.copy(buffer, subset, 0, offset, offset + limit);
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
      function encode4(val, buffer, offset) {
        b4a7.copy(val, buffer, offset);
        encode4.bytes = 8;
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
      function encode4(val, buffer, offset) {
        b4a7.writeDoubleLE(buffer, val, offset);
        encode4.bytes = 8;
        return buffer;
      },
      function decode8(buffer, offset) {
        var val = b4a7.readDoubleLE(buffer, offset);
        decode8.bytes = 8;
        return val;
      },
      function encodingLength4() {
        return 8;
      }
    );
    exports.fixed32 = encoder2(
      5,
      function encode4(val, buffer, offset) {
        b4a7.writeUInt32LE(buffer, val, offset);
        encode4.bytes = 4;
        return buffer;
      },
      function decode8(buffer, offset) {
        var val = b4a7.readUInt32LE(buffer, offset);
        decode8.bytes = 4;
        return val;
      },
      function encodingLength4() {
        return 4;
      }
    );
    exports.sfixed32 = encoder2(
      5,
      function encode4(val, buffer, offset) {
        b4a7.writeInt32LE(buffer, val, offset);
        encode4.bytes = 4;
        return buffer;
      },
      function decode8(buffer, offset) {
        var val = b4a7.readInt32LE(buffer, offset);
        decode8.bytes = 4;
        return val;
      },
      function encodingLength4() {
        return 4;
      }
    );
    exports.float = encoder2(
      5,
      function encode4(val, buffer, offset) {
        b4a7.writeFloatLE(buffer, val, offset);
        encode4.bytes = 4;
        return buffer;
      },
      function decode8(buffer, offset) {
        var val = b4a7.readFloatLE(buffer, offset);
        decode8.bytes = 4;
        return val;
      },
      function encodingLength4() {
        return 4;
      }
    );
    function encoder2(type, encode4, decode8, encodingLength4) {
      encode4.bytes = decode8.bytes = 0;
      return {
        type,
        encode: encode4,
        decode: decode8,
        encodingLength: encodingLength4
      };
    }
    function bufferLength(val) {
      return b4a7.isBuffer(val) ? val.length : b4a7.byteLength(val);
    }
  }
});

// browser.mjs
var browser_exports = {};
__export(browser_exports, {
  decode: () => decode7,
  decodeFetch: () => decodeFetch
});
module.exports = __toCommonJS(browser_exports);

// src/read-range/fetch.mjs
var import_b4a = __toESM(require_browser(), 1);
function readRange(_0) {
  return __async(this, arguments, function* ({ filePath, start, end, ranges }) {
    const headers = new Headers();
    if (!ranges) {
      ranges = [{ start, end }];
    }
    const byteRange = `bytes=${ranges.map((r) => `${r.start}-${r.end}`).join(", ")}`;
    headers.append("Range", byteRange);
    const res = yield fetch(filePath, { headers });
    const arrayBuffer = yield res.arrayBuffer();
    const buffer = import_b4a.default.from(arrayBuffer);
    return buffer;
  });
}

// src/tabular-archive-decode.mjs
var import_b4a6 = __toESM(require_browser(), 1);

// node_modules/fflate/esm/browser.js
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
var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
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
var et = /* @__PURE__ */ new u8(0);
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

// src/archive-header.mjs
var import_b4a2 = __toESM(require_browser(), 1);

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

// src/archive-header.mjs
var name = "TabularArchive";
var version = 1;
function create() {
  let bufferLength = 0;
  bufferLength += import_protocol_buffers_encodings.default.string.encodingLength(name);
  bufferLength += import_protocol_buffers_encodings.default.int32.encodingLength(version);
  bufferLength += 4 + 4;
  bufferLength += 4 + 4;
  bufferLength += import_protocol_buffers_encodings.default.string.encodingLength("string".padEnd(maxEncoderTypeLength, " "));
  bufferLength += 4 + 4;
  bufferLength += 8 + 8;
  let buffer = import_b4a2.default.alloc(bufferLength);
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
var decode4 = ({ buffer, offset = 0 }) => {
  const hName = import_protocol_buffers_encodings.default.string.decode(buffer, offset);
  offset += import_protocol_buffers_encodings.default.string.decode.bytes;
  const hVersion = import_protocol_buffers_encodings.default.int32.decode(buffer, offset);
  offset += import_protocol_buffers_encodings.default.int32.decode.bytes;
  if (name !== hName || version !== hVersion)
    throw Error(`Archive does not conform to v${version}`);
  const headerRowStart = import_protocol_buffers_encodings.default.int32.decode(buffer, offset);
  offset += import_protocol_buffers_encodings.default.int32.decode.bytes;
  const headerRowEnd = import_protocol_buffers_encodings.default.int32.decode(buffer, offset);
  offset += import_protocol_buffers_encodings.default.int32.decode.bytes;
  const categoriesStart = import_protocol_buffers_encodings.default.int32.decode(buffer, offset);
  offset += import_protocol_buffers_encodings.default.int32.decode.bytes;
  const categoriesEnd = import_protocol_buffers_encodings.default.int32.decode(buffer, offset);
  offset += import_protocol_buffers_encodings.default.int32.decode.bytes;
  const dataRowIdsEncoderString = import_protocol_buffers_encodings.default.string.decode(buffer, offset).trim();
  offset += import_protocol_buffers_encodings.default.string.decode.bytes;
  const dataRowIdsStart = import_protocol_buffers_encodings.default.int32.decode(buffer, offset);
  offset += import_protocol_buffers_encodings.default.int32.decode.bytes;
  const dataRowIdsEnd = import_protocol_buffers_encodings.default.int32.decode(buffer, offset);
  offset += import_protocol_buffers_encodings.default.int32.decode.bytes;
  const dataRowLengthsStart = import_protocol_buffers_encodings.default.int64.decode(buffer, offset);
  offset += import_protocol_buffers_encodings.default.int64.decode.bytes;
  const dataRowLengthsEnd = import_protocol_buffers_encodings.default.int64.decode(buffer, offset);
  offset += import_protocol_buffers_encodings.default.int64.decode.bytes;
  return {
    headerRowStart,
    headerRowEnd,
    categoriesStart,
    categoriesEnd,
    dataRowIdsEncoderString,
    dataRowIdsStart,
    dataRowIdsEnd,
    dataRowLengthsStart,
    dataRowLengthsEnd
  };
};

// src/header-row.mjs
var import_b4a3 = __toESM(require_browser(), 1);
var decode5 = ({ buffer, offset = 0 }) => {
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
var import_b4a4 = __toESM(require_browser(), 1);
var decode6 = ({ buffer, offset = 0 }) => {
  const uncompressedBuffer = gunzipSync(buffer);
  const categories2 = [];
  while (offset < uncompressedBuffer.length - 1) {
    const category = import_protocol_buffers_encodings.default.string.decode(uncompressedBuffer, offset);
    offset += import_protocol_buffers_encodings.default.string.decode.bytes;
    categories2.push(category);
  }
  return { categories: categories2, offset };
};

// src/data-rows.mjs
var import_b4a5 = __toESM(require_browser(), 1);
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

// src/tabular-archive-decode.mjs
var readArchiveRanges = ({ readRange: readRange2 }) => {
  return {
    archiveHeader: (_0) => __async(void 0, [_0], function* ({ filePath }) {
      const emptyArchiveHeader = create();
      const start = 0;
      const end = emptyArchiveHeader.buffer.byteLength;
      return readRange2({
        filePath,
        start,
        end
      });
    }),
    headerRow: (_0) => __async(void 0, [_0], function* ({ filePath, headerRowStart, headerRowEnd }) {
      return readRange2({
        filePath,
        start: headerRowStart,
        end: headerRowEnd
      });
    }),
    categories: (_0) => __async(void 0, [_0], function* ({ filePath, categoriesStart, categoriesEnd }) {
      return readRange2({
        filePath,
        start: categoriesStart,
        end: categoriesEnd
      });
    }),
    dataRowIds: (_0) => __async(void 0, [_0], function* ({ filePath, dataRowIdsStart, dataRowIdsEnd }) {
      return readRange2({
        filePath,
        start: dataRowIdsStart,
        end: dataRowIdsEnd
      });
    }),
    dataRowLengths: (_0) => __async(void 0, [_0], function* ({ filePath, dataRowLengthsStart, dataRowLengthsEnd }) {
      return readRange2({
        filePath,
        start: dataRowLengthsStart,
        end: dataRowLengthsEnd
      });
    }),
    archiveHeaderPartsBuffer: (_0) => __async(void 0, [_0], function* ({
      filePath,
      headerRowStart,
      headerRowEnd,
      categoriesStart,
      categoriesEnd,
      dataRowIdsStart,
      dataRowIdsEnd,
      dataRowLengthsStart,
      dataRowLengthsEnd
    }) {
      const ranges = [
        {
          name: "headerRow",
          start: headerRowStart,
          end: headerRowEnd
        },
        {
          name: "categories",
          start: categoriesStart,
          end: categoriesEnd
        },
        {
          name: "dataRowIds",
          start: dataRowIdsStart,
          end: dataRowIdsEnd
        },
        {
          name: "dataRowLengths",
          start: dataRowLengthsStart,
          end: dataRowLengthsEnd
        }
      ];
      const buffer = yield readRange2({
        filePath,
        ranges: [{ start: headerRowStart, end: dataRowLengthsEnd }]
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
  const archiveHeader = decode4({ buffer: archiveHeaderBuffer });
  const { dataRowIdsEncoderString } = archiveHeader;
  const startOfDataRows = archiveHeader.dataRowLengthsEnd;
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
  const { headerRow } = decode5({ buffer: headerRowBuffer });
  const { categories: categories2 } = decode6({ buffer: categoriesBuffer });
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
      return { row, rowNumber };
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

// browser.mjs
var decodeFetch = decode7({ readRange });
