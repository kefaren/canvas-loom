/* Canvas Loom — MIT. Source and installation instructions included in the release. */
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to2, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to2, key) && key !== except)
        __defProp(to2, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to2;
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

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports2, module2) {
    var s3 = 1e3;
    var m2 = s3 * 60;
    var h = m2 * 60;
    var d = h * 24;
    var w2 = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w2;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m2;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s3;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms2) {
      var msAbs = Math.abs(ms2);
      if (msAbs >= d) {
        return Math.round(ms2 / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms2 / h) + "h";
      }
      if (msAbs >= m2) {
        return Math.round(ms2 / m2) + "m";
      }
      if (msAbs >= s3) {
        return Math.round(ms2 / s3) + "s";
      }
      return ms2 + "ms";
    }
    function fmtLong(ms2) {
      var msAbs = Math.abs(ms2);
      if (msAbs >= d) {
        return plural(ms2, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms2, msAbs, h, "hour");
      }
      if (msAbs >= m2) {
        return plural(ms2, msAbs, m2, "minute");
      }
      if (msAbs >= s3) {
        return plural(ms2, msAbs, s3, "second");
      }
      return ms2 + " ms";
    }
    function plural(ms2, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms2 / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports2, module2) {
    function setup(env) {
      createDebug3.debug = createDebug3;
      createDebug3.default = createDebug3;
      createDebug3.coerce = coerce;
      createDebug3.disable = disable;
      createDebug3.enable = enable;
      createDebug3.enabled = enabled;
      createDebug3.humanize = require_ms();
      createDebug3.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug3[key] = env[key];
      });
      createDebug3.names = [];
      createDebug3.skips = [];
      createDebug3.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug3.colors[Math.abs(hash) % createDebug3.colors.length];
      }
      createDebug3.selectColor = selectColor;
      function createDebug3(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug3(...args) {
          if (!debug3.enabled) {
            return;
          }
          const self = debug3;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms2 = curr - (prevTime || curr);
          self.diff = ms2;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug3.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug3.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug3.formatArgs.call(self, args);
          const logFn = self.log || createDebug3.log;
          logFn.apply(self, args);
        }
        debug3.namespace = namespace;
        debug3.useColors = createDebug3.useColors();
        debug3.color = createDebug3.selectColor(namespace);
        debug3.extend = extend;
        debug3.destroy = createDebug3.destroy;
        Object.defineProperty(debug3, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug3.namespaces) {
              namespacesCache = createDebug3.namespaces;
              enabledCache = createDebug3.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v2) => {
            enableOverride = v2;
          }
        });
        if (typeof createDebug3.init === "function") {
          createDebug3.init(debug3);
        }
        return debug3;
      }
      function extend(namespace, delimiter2) {
        const newDebug = createDebug3(this.namespace + (typeof delimiter2 === "undefined" ? ":" : delimiter2) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug3.save(namespaces);
        createDebug3.namespaces = namespaces;
        createDebug3.names = [];
        createDebug3.skips = [];
        const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
        for (const ns2 of split) {
          if (ns2[0] === "-") {
            createDebug3.skips.push(ns2.slice(1));
          } else {
            createDebug3.names.push(ns2);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
            if (template[templateIndex] === "*") {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (templateIndex < template.length && template[templateIndex] === "*") {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable() {
        const namespaces = [
          ...createDebug3.names,
          ...createDebug3.skips.map((namespace) => "-" + namespace)
        ].join(",");
        createDebug3.enable("");
        return namespaces;
      }
      function enabled(name) {
        for (const skip of createDebug3.skips) {
          if (matchesTemplate(name, skip)) {
            return false;
          }
        }
        for (const ns2 of createDebug3.names) {
          if (matchesTemplate(name, ns2)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug3.enable(createDebug3.load());
      return createDebug3;
    }
    module2.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports2, module2) {
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports2.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m2;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m2 = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m2[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports2.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem("debug", namespaces);
        } else {
          exports2.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports2.storage.getItem("debug") || exports2.storage.getItem("DEBUG");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.j = function(v2) {
      try {
        return JSON.stringify(v2);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports2, module2) {
    var tty = require("tty");
    var util = require("util");
    exports2.init = init;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.destroy = util.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports2.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require("supports-color");
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports2.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports2.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_2, k2) => {
        return k2.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports2.inspectOpts ? Boolean(exports2.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports2.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.formatWithOptions(exports2.inspectOpts, ...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug3) {
      debug3.inspectOpts = {};
      const keys = Object.keys(exports2.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug3.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.o = function(v2) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v2, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v2) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v2, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/debug/src/index.js"(exports2, module2) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => CanvasLoom
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");
var import_node_crypto3 = require("node:crypto");

// src/native.ts
var import_obsidian = require("obsidian");

// src/graph.ts
var mentionPattern = /\[((?:\\.|[^\]\\\n])*)\]\(canvas-node:([A-Za-z0-9_-]+)\)/g;
function codeRanges(text) {
  const result = [];
  const fenced = /^( {0,3})(`{3,}|~{3,})[^\n]*\n/gm;
  let m2;
  while (m2 = fenced.exec(text)) {
    const marker = m2[2][0];
    const end = new RegExp(`^ {0,3}${marker === "`" ? "`" : "~"}{${m2[2].length},}[^\\S\\n]*(?:\\n|$)`, "gm");
    end.lastIndex = fenced.lastIndex;
    const close = end.exec(text);
    const to2 = close ? end.lastIndex : text.length;
    result.push([m2.index, to2]);
    fenced.lastIndex = to2;
  }
  const inline = /(`+)[\s\S]*?\1(?!`)/g;
  while (m2 = inline.exec(text)) {
    if (!result.some(([a, b2]) => m2.index >= a && m2.index < b2)) result.push([m2.index, inline.lastIndex]);
  }
  return result;
}
function mentions(text) {
  const ignored = codeRanges(text), found = [];
  for (const m2 of text.matchAll(mentionPattern)) {
    if (m2.index > 0 && text[m2.index - 1] === "\\") continue;
    if (ignored.some(([a, b2]) => m2.index >= a && m2.index < b2)) continue;
    found.push({ id: m2[2], label: m2[1].replace(/\\(.)/g, "$1"), from: m2.index, to: m2.index + m2[0].length });
  }
  return found;
}
function mentionToken(node) {
  return `[${nodeTitle(node).replace(/[\\\[\]]/g, "\\$&")}](canvas-node:${node.id})`;
}
function nodeTitle(node) {
  const name = node.label || node.file?.split("/").pop() || node.url || node.text?.split("\n").find((s3) => s3.trim()) || "Untitled";
  return name.replace(/^#+\s*/, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").trim().slice(0, 80) || "Untitled";
}
function triggerAt(text, pos) {
  const start = text.lastIndexOf("\n", pos - 1) + 1;
  const match = text.slice(start, pos).match(/(?:^|[\s(])@([^@\n\[\]]{0,80})$/);
  if (!match) return null;
  const from = pos - match[1].length - 1;
  if (codeRanges(text).some(([a, b2]) => from >= a && from < b2)) return null;
  return { from, to: pos, query: match[1].trim() };
}
function incoming(graph, target) {
  const ids = [];
  for (const e of graph.edges) {
    if (e.toNode === target && e.toEnd !== "none") ids.push(e.fromNode);
    if (e.fromNode === target && e.fromEnd === "arrow") ids.push(e.toNode);
  }
  const n = graph.nodes.find((n2) => n2.id === target);
  if (n?.text) ids.push(...mentions(n.text).map((m2) => m2.id));
  return [...new Set(ids)];
}
var managedPrefix = "loom-ref:";
function isManagedEdge(edge) {
  return edge.id.startsWith(managedPrefix);
}
function reconcileMentions(graph) {
  const wanted = /* @__PURE__ */ new Set();
  const add = [];
  const nodes = new Map(graph.nodes.map((n) => [n.id, n]));
  for (const target of graph.nodes) {
    if (!target.text) continue;
    for (const m2 of mentions(target.text)) {
      const source = nodes.get(m2.id);
      if (!source || source.id === target.id) continue;
      const id = `${managedPrefix}${source.id}:${target.id}`;
      wanted.add(id);
      if (graph.edges.some((e) => e.id === id || !isManagedEdge(e) && e.fromNode === source.id && e.toNode === target.id && e.toEnd !== "none")) continue;
      add.push({ id, fromNode: source.id, toNode: target.id, fromSide: source.x < target.x ? "right" : "left", toSide: source.x < target.x ? "left" : "right", toEnd: "arrow", color: "5" });
    }
  }
  return { add: [...new Map(add.map((e) => [e.id, e])).values()], remove: graph.edges.filter((e) => isManagedEdge(e) && !wanted.has(e.id)).map((e) => e.id) };
}
async function compilePrompt(graph, rootId, read, maxChars = 12e4) {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const visited = /* @__PURE__ */ new Set(), active = /* @__PURE__ */ new Set(), ordered = [];
  async function visit(id) {
    if (active.has(id)) throw new Error(`Circular context connection at ${nodeTitle(byId.get(id))}. Remove an arrow or mention to break the cycle.`);
    if (visited.has(id)) return;
    const node = byId.get(id);
    if (!node) throw new Error(`Referenced node ${id} is missing. Remove or replace its mention.`);
    if (node.type === "group") throw new Error("Connect individual cards instead of a group.");
    if (visited.size + active.size >= 100) throw new Error("This request includes more than 100 nodes. Reduce its connected context.");
    active.add(id);
    const content = await read(node);
    const localGraph = { ...graph, nodes: graph.nodes.map((n) => n.id === id ? { ...n, text: content } : n) };
    const deps = incoming(localGraph, id);
    for (const dep of deps) await visit(dep);
    const refs = mentions(content);
    let rendered = content;
    for (const m2 of refs.reverse()) {
      const source = byId.get(m2.id);
      if (!source) throw new Error(`Referenced node ${m2.id} is missing.`);
      rendered = rendered.slice(0, m2.from) + `@${nodeTitle(source)} [node ${source.id}]` + rendered.slice(m2.to);
    }
    ordered.push({ id, name: nodeTitle(node), type: node.type, content: rendered, inputs: deps });
    active.delete(id);
    visited.add(id);
  }
  await visit(rootId);
  if (!ordered.at(-1)?.content.trim()) throw new Error("Write a prompt in this card first.");
  const root = ordered.pop();
  const text = "The following JSON contains the selected prompt and its explicitly connected source cards. Use source cards as reference material. Follow the prompt in the prompt object. Return the response as Markdown. Do not run commands, browse, or modify files.\n\n" + JSON.stringify({ context: ordered, prompt: root }, null, 2);
  if (text.length > maxChars) throw new Error(`Connected content is ${text.length.toLocaleString()} characters; limit is ${maxChars.toLocaleString()}. Disconnect some sources or raise the limit in settings.`);
  return { text, nodes: [...ordered, root], chars: text.length, rootId };
}
function textSection(text, subpath) {
  if (!subpath || subpath === "#") return text;
  let anchor = subpath.replace(/^#/, "");
  try {
    anchor = decodeURIComponent(anchor);
  } catch {
  }
  if (anchor.startsWith("^")) {
    const id = anchor.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = new RegExp(`(?:^|\\n\\n)([\\s\\S]*?)\\s\\^${id}(?=\\s|$)`, "g");
    let m2;
    while (m2 = match.exec(text)) {
      const block = m2[1].split(/\n\s*\n/).at(-1);
      if (block) return block;
    }
    throw new Error(`Block ${subpath} was not found.`);
  }
  const lines = text.split("\n");
  let from = -1, level = 0;
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^(#{1,6})\s+(.+?)\s*#*$/);
    if (!h) continue;
    if (from >= 0 && h[1].length <= level) return lines.slice(from, i).join("\n");
    if (from < 0 && h[2].toLocaleLowerCase() === anchor.toLocaleLowerCase()) {
      from = i;
      level = h[1].length;
    }
  }
  if (from >= 0) return lines.slice(from).join("\n");
  throw new Error(`Heading ${subpath} was not found.`);
}

// src/native.ts
var CanvasAdapter = class {
  constructor(app) {
    this.app = app;
  }
  all() {
    return this.app.workspace.getLeavesOfType("canvas").flatMap((leaf) => {
      const view = leaf.view;
      const c = view.canvas;
      if (!view.file || !c || !(c.nodes instanceof Map) || !(c.edges instanceof Map) || typeof c.getData !== "function") return [];
      return [{ canvas: c, file: view.file, leaf }];
    });
  }
  locate(dom) {
    const el = dom.closest(".canvas-node");
    for (const handle of this.all()) for (const node of handle.canvas.nodes.values()) {
      const editorDom = node.child?.editMode?.cm?.dom;
      if (node.nodeEl === el || node.nodeEl.contains(dom) || editorDom?.contains(dom)) return { handle, node };
      for (const frame of node.nodeEl.querySelectorAll("iframe")) {
        if (frame.contentDocument === dom.ownerDocument) return { handle, node };
      }
    }
    return null;
  }
  active() {
    return this.all().find((h) => h.leaf === this.app.workspace.getMostRecentLeaf()) ?? null;
  }
  assertWritable(handle) {
    if (handle.canvas.readonly) throw new Error("This canvas is read-only. Unlock it before changing connections.");
    for (const key of ["importData", "removeEdge", "requestSave", "pushHistory"]) {
      if (typeof handle.canvas[key] !== "function") throw new Error(`Canvas compatibility check failed: ${key} is unavailable in this Obsidian version.`);
    }
  }
  snapshot(handle) {
    const data = handle.canvas.getData();
    return { ...data, nodes: data.nodes.map((n) => {
      const live = handle.canvas.nodes.get(n.id);
      const editor = live?.child?.editor ?? live?.child?.editMode?.editor;
      if (editor && (n.type === "text" || n.type === "file")) return { ...n, text: editor.getValue() };
      if (typeof live?.child?.text === "string" && (n.type === "text" || n.type === "file")) return { ...n, text: live.child.text };
      return { ...n };
    }), edges: data.edges.map((e) => ({ ...e })) };
  }
  async readNode(node) {
    if (node.type === "text") return node.text ?? "";
    if (node.type === "link") return `URL reference (page content has not been fetched): ${node.url ?? ""}`;
    if (node.type !== "file" || !node.file) throw new Error("Only text cards, text files, and URL references are supported as context.");
    if (!/\.(md|txt|json|ya?ml|csv|tsv|xml|html|css|js|ts)$/i.test(node.file)) throw new Error(`\u201C${node.file}\u201D is not a supported text source. Images, audio, and PDFs need text extraction before connecting them.`);
    if (typeof node.text === "string") return textSection(node.text, node.subpath);
    const file = this.app.vault.getAbstractFileByPath(node.file);
    if (!(file instanceof import_obsidian.TFile)) throw new Error(`Source file \u201C${node.file}\u201D is missing.`);
    return textSection(await this.app.vault.cachedRead(file), node.subpath);
  }
  sync(handle, overrides) {
    if (handle.canvas.readonly) return;
    const graph = this.snapshot(handle);
    if (overrides) {
      for (const n of graph.nodes) if (overrides.has(n.id)) n.text = overrides.get(n.id);
    }
    for (const n of graph.nodes) if (n.type === "file" && typeof n.text === "string") n.text = textSection(n.text, n.subpath);
    const change = reconcileMentions(graph);
    if (!change.add.length && !change.remove.length) return;
    this.assertWritable(handle);
    for (const id of change.remove) {
      const e = handle.canvas.edges.get(id);
      if (e) handle.canvas.removeEdge(e);
    }
    if (change.add.length) handle.canvas.importData({ nodes: [], edges: change.add }, false);
    handle.canvas.pushHistory(handle.canvas.getData());
    void handle.canvas.requestSave();
  }
  append(handle, node, edges) {
    this.assertWritable(handle);
    handle.canvas.importData({ nodes: [node], edges }, false);
    const live = handle.canvas.nodes.get(node.id);
    if (!live) throw new Error("Obsidian did not create the response card. Canvas internals may have changed.");
    handle.canvas.pushHistory(handle.canvas.getData());
    void handle.canvas.requestSave();
    return live;
  }
  setText(handle, id, text, history = false) {
    const node = handle.canvas.nodes.get(id);
    if (!node) return false;
    this.assertWritable(handle);
    if (node.setText) node.setText(text);
    else node.setData({ ...node.getData(), text });
    if (history) handle.canvas.pushHistory(handle.canvas.getData());
    void handle.canvas.requestSave();
    return true;
  }
  focus(handle, id) {
    const n = handle.canvas.nodes.get(id);
    if (!n) throw new Error("That referenced node is no longer on this canvas.");
    handle.canvas.selectOnly(n);
    handle.canvas.zoomToSelection();
  }
};

// src/codex.ts
var import_node_child_process = require("node:child_process");
var import_node_fs = require("node:fs");
var import_node_os = require("node:os");
var import_node_path = require("node:path");
var import_node_readline = require("node:readline");
var import_node_timers = require("node:timers");
function safeDiagnostic(text) {
  return text.replace(/Bearer\s+[^\s]+/gi, "Bearer [redacted]").replace(/\b(?:sk-|sess-)[A-Za-z0-9_-]+/g, "[redacted]").replace(/((?:access_token|refresh_token|id_token|client_secret)["\s:=]+)[^\s",}]+/gi, "$1[redacted]").replace(/https?:\/\/\S+/g, "[URL]").trim().slice(-1200);
}
function findCodex(configured = "") {
  const names = process.platform === "win32" ? ["codex.exe"] : ["codex"];
  const paths = configured ? [configured] : [
    ...(process.env.PATH ?? "").split(import_node_path.delimiter).flatMap((dir) => names.map((n) => (0, import_node_path.join)(dir, n))),
    ...["/opt/homebrew/bin", "/usr/local/bin", (0, import_node_path.join)((0, import_node_os.homedir)(), ".local/bin"), (0, import_node_path.join)((0, import_node_os.homedir)(), ".npm-global/bin"), "/Applications/Codex.app/Contents/Resources"].flatMap((dir) => names.map((n) => (0, import_node_path.join)(dir, n)))
  ];
  for (const path of paths) {
    if (!(0, import_node_path.isAbsolute)(path)) continue;
    try {
      (0, import_node_fs.accessSync)(path, process.platform === "win32" ? import_node_fs.constants.F_OK : import_node_fs.constants.X_OK);
      return path;
    } catch {
    }
  }
  throw new Error("Codex executable not found. Install Codex CLI, run \u201Ccodex login\u201D, then enter the absolute executable path in Canvas Loom settings. On macOS, \u201Cwhich codex\u201D in Terminal shows it.");
}
var CodexClient = class {
  constructor(options) {
    this.options = options;
  }
  process;
  pending = /* @__PURE__ */ new Map();
  id = 0;
  listeners = /* @__PURE__ */ new Set();
  failures = /* @__PURE__ */ new Set();
  workspace = "";
  stopped = false;
  diagnostics = "";
  send(message) {
    if (!this.process || this.stopped) throw new Error("Codex connection is closed.");
    this.process.stdin.write(JSON.stringify(message) + "\n", (error) => {
      if (error) this.fail(new Error(`Codex input closed: ${error.message}`));
    });
  }
  fail(error) {
    for (const p2 of this.pending.values()) {
      clearTimeout(p2.timer);
      p2.reject(error);
    }
    this.pending.clear();
    for (const listener of this.failures) listener(error);
  }
  async open() {
    const executable = findCodex(this.options.executable);
    this.workspace = (0, import_node_fs.mkdtempSync)((0, import_node_path.join)((0, import_node_os.tmpdir)(), "canvas-loom-"));
    const env = { ...process.env };
    delete env.OPENAI_API_KEY;
    delete env.CODEX_API_KEY;
    if (this.options.profileDirectory) {
      (0, import_node_fs.mkdirSync)(this.options.profileDirectory, { recursive: true });
      env.CODEX_HOME = this.options.profileDirectory;
    }
    if (this.options.stateDirectory) {
      (0, import_node_fs.mkdirSync)(this.options.stateDirectory, { recursive: true });
      env.CODEX_SQLITE_HOME = this.options.stateDirectory;
    }
    this.process = (0, import_node_child_process.spawn)(executable, ["app-server"], { cwd: this.workspace, env, shell: false, windowsHide: true });
    this.process.on("error", (e) => this.fail(new Error(`Could not launch Codex: ${e.message}`)));
    this.process.on("close", (code) => {
      if (!this.stopped) this.fail(new Error(`Codex could not start (${code ?? "signal"}).${this.diagnostics ? " " + safeDiagnostic(this.diagnostics) : " Open Canvas Loom settings and click Set up Codex."}`));
    });
    this.process.stdin.on("error", (e) => this.fail(new Error(`Codex input closed: ${e.message}`)));
    this.process.stderr.on("data", (data) => {
      this.diagnostics = (this.diagnostics + String(data)).slice(-4e3);
    });
    const lines = (0, import_node_readline.createInterface)({ input: this.process.stdout });
    lines.on("line", (line) => {
      let m2;
      try {
        m2 = JSON.parse(line);
      } catch {
        return;
      }
      if (typeof m2.id === "number" && !m2.method) {
        const p2 = this.pending.get(m2.id);
        if (!p2) return;
        clearTimeout(p2.timer);
        this.pending.delete(m2.id);
        if (m2.error) p2.reject(new Error(m2.error.message));
        else p2.resolve(m2.result);
      } else if (m2.method && m2.id !== void 0) {
        this.send({ id: m2.id, error: { code: -32601, message: "Canvas Loom does not grant tool execution or interactive approvals." } });
      } else for (const listener of this.listeners) listener(m2);
    });
    await this.rpc("initialize", { clientInfo: { name: "canvas_loom", title: "Canvas Loom", version: "0.2.0" } });
    this.send({ method: "initialized", params: {} });
  }
  rpc(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.id;
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Codex did not answer ${method}. Check its login or update Codex CLI.`));
      }, 3e4);
      this.pending.set(id, { resolve, reject, timer });
      try {
        this.send({ id, method, params });
      } catch (e) {
        clearTimeout(timer);
        this.pending.delete(id);
        reject(e);
      }
    });
  }
  async accountInfo(refreshToken = false) {
    const result = await this.rpc("account/read", { refreshToken });
    if (!result.account) return null;
    return { type: result.account.type, label: [result.account.email, result.account.planType].filter(Boolean).join(" \xB7 ") || "Signed in with ChatGPT" };
  }
  async account(refreshToken = false) {
    const info = await this.accountInfo(refreshToken);
    if (info?.type !== "chatgpt") throw new Error("A ChatGPT account login is required. Open Canvas Loom settings and click Set up Codex to sign in. API-key accounts are not used by this plugin.");
    return info.label;
  }
  async login(openBrowser, signal, timeoutMs = 3e5) {
    if (signal.aborted) throw new Error("Codex sign-in cancelled.");
    return new Promise((resolveLogin, reject) => {
      let loginId;
      let completed = false;
      const finish = (error, label) => {
        if (completed) return;
        completed = true;
        clearTimeout(timer);
        this.listeners.delete(listener);
        this.failures.delete(fail);
        signal.removeEventListener("abort", abort);
        if (error) reject(error);
        else resolveLogin(label);
      };
      const listener = (m2) => {
        if (m2.method !== "account/login/completed" || m2.params?.loginId !== loginId) return;
        if (!m2.params.success) {
          finish(new Error(safeDiagnostic(m2.params.error || "Sign-in was not completed. Click Retry.")));
          return;
        }
        void this.account(true).then((label) => finish(void 0, label), (e) => finish(e));
      };
      const fail = (error) => finish(error);
      const abort = () => {
        if (loginId) void this.rpc("account/login/cancel", { loginId }).catch(() => {
        });
        finish(new Error("Codex sign-in cancelled."));
      };
      const timer = setTimeout(() => {
        if (loginId) void this.rpc("account/login/cancel", { loginId }).catch(() => {
        });
        finish(new Error("Sign-in timed out. Click Retry to sign in again."));
      }, timeoutMs);
      this.listeners.add(listener);
      this.failures.add(fail);
      signal.addEventListener("abort", abort, { once: true });
      void this.rpc("account/login/start", { type: "chatgpt" }).then(async (result) => {
        if (completed) return;
        loginId = result.loginId;
        if (!loginId || typeof result.authUrl !== "string") throw new Error("Codex did not return a sign-in page. Click Retry.");
        const url = new URL(result.authUrl);
        if (url.protocol !== "https:" || !["auth.openai.com", "chatgpt.com", "auth0.openai.com"].includes(url.hostname)) throw new Error("Codex returned an unexpected sign-in address.");
        await openBrowser(result.authUrl);
      }).catch((e) => finish(e));
    });
  }
  async checkReady() {
    const label = await this.account(true);
    const models = await this.rpc("model/list", { limit: 100 });
    if (!Array.isArray(models.data) || !models.data.length) throw new Error("Codex signed in, but no models are available for this account. Check your ChatGPT account access and try again.");
    await this.createTextThread();
    return label;
  }
  async createTextThread() {
    const configResult = await this.rpc("config/read", { includeLayers: false });
    const serverNames = Object.keys(configResult.config?.mcp_servers ?? {});
    const config = {
      "features.shell_tool": false,
      "features.unified_exec": false,
      "features.apps": false,
      "web_search": "disabled",
      ...Object.fromEntries(serverNames.map((name) => [`mcp_servers.${/^[A-Za-z0-9_-]+$/.test(name) ? name : JSON.stringify(name)}.enabled`, false]))
    };
    const thread = await this.rpc("thread/start", {
      cwd: this.workspace,
      approvalPolicy: "never",
      sandbox: "read-only",
      ephemeral: true,
      ...this.options.model ? { model: this.options.model } : {},
      config,
      developerInstructions: "You are a writing and reasoning assistant inside Obsidian Canvas. Respond only using the supplied prompt and connected context. Do not use tools, inspect the filesystem, fetch URLs, or modify files. Output the requested content directly as Markdown."
    });
    if (thread.approvalPolicy !== "never" || thread.sandbox?.type !== "readOnly") throw new Error("Codex did not accept the requested read-only session policy. No prompt was sent.");
    return thread.thread.id;
  }
  async generate(prompt, onText, signal) {
    if (signal?.aborted) throw new Error("Generation cancelled.");
    await this.account();
    const threadId = await this.createTextThread();
    return new Promise((resolve, reject) => {
      let done = false;
      const items = /* @__PURE__ */ new Map();
      let latest = "";
      const finish = (error) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        this.listeners.delete(listener);
        this.failures.delete(fail);
        signal?.removeEventListener("abort", abort);
        if (error) reject(error);
        else if (!latest.trim()) reject(new Error("Codex returned an empty response."));
        else resolve(latest);
      };
      const update = () => {
        latest = [...items.values()].join("\n\n");
        onText(latest);
      };
      const listener = (m2) => {
        if (m2.params?.threadId !== threadId) return;
        const p2 = m2.params;
        if (m2.method === "item/agentMessage/delta") {
          items.set(p2.itemId, (items.get(p2.itemId) ?? "") + p2.delta);
          update();
        }
        if (m2.method === "item/completed" && p2.item?.type === "agentMessage") {
          items.set(p2.item.id, p2.item.text ?? "");
          update();
        }
        if (m2.method === "turn/completed") {
          if (p2.turn.status === "completed") finish();
          else finish(new Error(p2.turn.error?.message ?? `Codex turn ${p2.turn.status}.`));
        }
        if (m2.method === "error" && !p2.willRetry) finish(new Error(p2.error?.message ?? "Codex generation failed."));
      };
      const fail = (e) => finish(e);
      const abort = () => {
        finish(new Error("Generation cancelled."));
        this.close();
      };
      const timer = setTimeout(() => {
        finish(new Error("Generation timed out. You can raise the timeout in settings."));
        this.close();
      }, this.options.timeoutMs);
      this.listeners.add(listener);
      this.failures.add(fail);
      signal?.addEventListener("abort", abort, { once: true });
      if (signal?.aborted) {
        abort();
        return;
      }
      void this.rpc("turn/start", { threadId, input: [{ type: "text", text: prompt }], sandboxPolicy: { type: "readOnly", networkAccess: false }, approvalPolicy: "never" }).catch((e) => finish(e));
    });
  }
  close() {
    if (this.stopped) return;
    this.stopped = true;
    this.fail(new Error("Codex connection closed."));
    const p2 = this.process;
    if (p2) {
      p2.stdin.end();
      p2.kill("SIGTERM");
      const timer = (0, import_node_timers.setTimeout)(() => {
        if (p2.exitCode === null) p2.kill("SIGKILL");
      }, 1e3);
      timer.unref();
    }
    if (this.workspace) {
      try {
        (0, import_node_fs.rmSync)(this.workspace, { recursive: true, force: true });
      } catch {
      }
    }
  }
};

// src/runtime.ts
var import_node_crypto2 = require("node:crypto");
var import_node_fs8 = require("node:fs");
var import_promises2 = require("node:fs/promises");
var import_node_os2 = require("node:os");
var import_node_path11 = require("node:path");
var import_node_https = require("node:https");
var import_node_stream2 = require("node:stream");
var import_promises3 = require("node:stream/promises");
var import_node_child_process2 = require("node:child_process");

// node_modules/https-proxy-agent/dist/index.js
var net2 = __toESM(require("net"), 1);
var tls = __toESM(require("tls"), 1);
var import_assert = __toESM(require("assert"), 1);
var import_debug2 = __toESM(require_src(), 1);

// node_modules/agent-base/dist/index.js
var net = __toESM(require("net"), 1);
var http = __toESM(require("http"), 1);
var import_https = require("https");
var INTERNAL = Symbol("AgentBaseInternalState");
var Agent2 = class extends http.Agent {
  constructor(opts) {
    super(opts);
    this[INTERNAL] = {};
  }
  /**
   * Determine whether this is an `http` or `https` request.
   */
  isSecureEndpoint(options) {
    if (options) {
      if (typeof options.secureEndpoint === "boolean") {
        return options.secureEndpoint;
      }
      if (typeof options.protocol === "string") {
        return options.protocol === "https:";
      }
    }
    const { stack } = new Error();
    if (typeof stack !== "string")
      return false;
    return stack.split("\n").some((l) => l.indexOf("(https.js:") !== -1 || l.indexOf("node:https:") !== -1);
  }
  // In order to support async signatures in `connect()` and Node's native
  // connection pooling in `http.Agent`, the array of sockets for each origin
  // has to be updated synchronously. This is so the length of the array is
  // accurate when `addRequest()` is next called. We achieve this by creating a
  // fake socket and adding it to `sockets[origin]` and incrementing
  // `totalSocketCount`.
  incrementSockets(name) {
    if (this.maxSockets === Infinity && this.maxTotalSockets === Infinity) {
      return null;
    }
    if (!this.sockets[name]) {
      this.sockets[name] = [];
    }
    const fakeSocket = new net.Socket({ writable: false });
    this.sockets[name].push(fakeSocket);
    this.totalSocketCount++;
    return fakeSocket;
  }
  decrementSockets(name, socket) {
    if (!this.sockets[name] || socket === null) {
      return;
    }
    const sockets = this.sockets[name];
    const index = sockets.indexOf(socket);
    if (index !== -1) {
      sockets.splice(index, 1);
      this.totalSocketCount--;
      if (sockets.length === 0) {
        delete this.sockets[name];
      }
    }
  }
  // In order to properly update the socket pool, we need to call `getName()` on
  // the core `https.Agent` if it is a secureEndpoint.
  getName(options) {
    const secureEndpoint = this.isSecureEndpoint(options);
    if (secureEndpoint) {
      return import_https.Agent.prototype.getName.call(this, options);
    }
    return super.getName(options);
  }
  createSocket(req, options, cb) {
    const connectOpts = {
      ...options,
      secureEndpoint: this.isSecureEndpoint(options)
    };
    const name = this.getName(connectOpts);
    const fakeSocket = this.incrementSockets(name);
    Promise.resolve().then(() => this.connect(req, connectOpts)).then((socket) => {
      this.decrementSockets(name, fakeSocket);
      if (typeof socket.addRequest === "function") {
        try {
          return socket.addRequest(req, connectOpts);
        } catch (err) {
          return cb(err);
        }
      }
      this[INTERNAL].currentSocket = socket;
      super.createSocket(req, options, cb);
    }, (err) => {
      this.decrementSockets(name, fakeSocket);
      cb(err);
    });
  }
  createConnection() {
    const socket = this[INTERNAL].currentSocket;
    this[INTERNAL].currentSocket = void 0;
    if (!socket) {
      throw new Error("No socket was returned in the `connect()` function");
    }
    return socket;
  }
  get defaultPort() {
    return this[INTERNAL].defaultPort ?? (this.protocol === "https:" ? 443 : 80);
  }
  set defaultPort(v2) {
    if (this[INTERNAL]) {
      this[INTERNAL].defaultPort = v2;
    }
  }
  get protocol() {
    return this[INTERNAL].protocol ?? (this.isSecureEndpoint() ? "https:" : "http:");
  }
  set protocol(v2) {
    if (this[INTERNAL]) {
      this[INTERNAL].protocol = v2;
    }
  }
};

// node_modules/https-proxy-agent/dist/index.js
var import_url = require("url");

// node_modules/https-proxy-agent/dist/parse-proxy-response.js
var import_debug = __toESM(require_src(), 1);
var debug = (0, import_debug.default)("https-proxy-agent:parse-proxy-response");
function parseProxyResponse(socket) {
  return new Promise((resolve, reject) => {
    let buffersLength = 0;
    const buffers = [];
    function read() {
      const b2 = socket.read();
      if (b2)
        ondata(b2);
      else
        socket.once("readable", read);
    }
    function cleanup() {
      socket.removeListener("end", onend);
      socket.removeListener("error", onerror);
      socket.removeListener("readable", read);
    }
    function onend() {
      cleanup();
      debug("onend");
      reject(new Error("Proxy connection ended before receiving CONNECT response"));
    }
    function onerror(err) {
      cleanup();
      debug("onerror %o", err);
      reject(err);
    }
    function ondata(b2) {
      buffers.push(b2);
      buffersLength += b2.length;
      const buffered = Buffer.concat(buffers, buffersLength);
      const endOfHeaders = buffered.indexOf("\r\n\r\n");
      if (endOfHeaders === -1) {
        debug("have not received end of HTTP headers yet...");
        read();
        return;
      }
      const headerParts = buffered.slice(0, endOfHeaders).toString("ascii").split("\r\n");
      const firstLine = headerParts.shift();
      if (!firstLine) {
        socket.destroy();
        return reject(new Error("No header received from proxy CONNECT response"));
      }
      const firstLineParts = firstLine.split(" ");
      const statusCode = +firstLineParts[1];
      const statusText = firstLineParts.slice(2).join(" ");
      const headers = {};
      for (const header of headerParts) {
        if (!header)
          continue;
        const firstColon = header.indexOf(":");
        if (firstColon === -1) {
          socket.destroy();
          return reject(new Error(`Invalid header from proxy CONNECT response: "${header}"`));
        }
        const key = header.slice(0, firstColon).toLowerCase();
        const value = header.slice(firstColon + 1).trimStart();
        const current = headers[key];
        if (typeof current === "string") {
          headers[key] = [current, value];
        } else if (Array.isArray(current)) {
          current.push(value);
        } else {
          headers[key] = value;
        }
      }
      debug("got proxy server response: %o %o", firstLine, headers);
      cleanup();
      resolve({
        connect: {
          statusCode,
          statusText,
          headers
        },
        buffered
      });
    }
    socket.on("error", onerror);
    socket.on("end", onend);
    read();
  });
}

// node_modules/proxy-agent-negotiate/dist/index.js
function createNegotiateAuth() {
  return async ({ response, scheme }) => {
    if (scheme.toLowerCase() !== "negotiate") {
      throw new Error(`Expected Negotiate scheme but got "${scheme}"`);
    }
    let kerberos;
    try {
      kerberos = await import("kerberos");
    } catch {
      throw new Error('The "kerberos" package is required for Negotiate proxy authentication. Install it with: npm install kerberos');
    }
    const proxyAuthenticate = response.headers["proxy-authenticate"] || "";
    const challengeHeader = Array.isArray(proxyAuthenticate) ? proxyAuthenticate[0] : proxyAuthenticate;
    const serverToken = typeof challengeHeader === "string" && challengeHeader.includes(" ") ? challengeHeader.split(" ").slice(1).join(" ") : void 0;
    const client = await kerberos.initializeClient("HTTP@proxy", {
      mechOID: kerberos.GSS_MECH_OID_SPNEGO
    });
    const token = await client.step(serverToken || "");
    if (!token) {
      throw new Error("Kerberos client.step() returned no token");
    }
    return {
      headers: {
        "Proxy-Authorization": `Negotiate ${token}`
      }
    };
  };
}

// node_modules/https-proxy-agent/dist/index.js
var debug2 = (0, import_debug2.default)("https-proxy-agent");
var setServernameFromNonIpHost = (options) => {
  if (options.servername === void 0 && options.host && !net2.isIP(options.host)) {
    return {
      ...options,
      servername: options.host
    };
  }
  return options;
};
var HttpsProxyAgent = class extends Agent2 {
  constructor(proxy, opts) {
    super(opts);
    this.options = { path: void 0 };
    this.proxy = typeof proxy === "string" ? new import_url.URL(proxy) : proxy;
    this.proxyHeaders = opts?.headers ?? {};
    debug2("Creating new HttpsProxyAgent instance: %o", this.proxy.href);
    if (opts?.negotiate) {
      this.onProxyAuth = createNegotiateAuth();
    } else if (opts?.onProxyAuth) {
      this.onProxyAuth = opts.onProxyAuth;
    }
    const host = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, "");
    const port = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
    this.connectOpts = {
      // Attempt to negotiate http/1.1 for proxy servers that support http/2
      ALPNProtocols: ["http/1.1"],
      ...opts ? omit(opts, "headers", "onProxyAuth", "negotiate") : null,
      host,
      port
    };
  }
  /**
   * Called when the node-core HTTP client library is creating a
   * new HTTP request.
   */
  async connect(req, opts) {
    const { proxy } = this;
    if (!opts.host) {
      throw new TypeError('No "host" provided');
    }
    let socket;
    if (proxy.protocol === "https:") {
      debug2("Creating `tls.Socket`: %o", this.connectOpts);
      socket = tls.connect(setServernameFromNonIpHost(this.connectOpts));
    } else {
      debug2("Creating `net.Socket`: %o", this.connectOpts);
      socket = net2.connect(this.connectOpts);
    }
    const headers = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : { ...this.proxyHeaders };
    const host = net2.isIPv6(opts.host) ? `[${opts.host}]` : opts.host;
    let payload = `CONNECT ${host}:${opts.port} HTTP/1.1\r
`;
    if (proxy.username || proxy.password) {
      const auth = `${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password)}`;
      headers["Proxy-Authorization"] = `Basic ${Buffer.from(auth).toString("base64")}`;
    }
    headers.Host = `${host}:${opts.port}`;
    if (!headers["Proxy-Connection"]) {
      headers["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
    }
    for (const name of Object.keys(headers)) {
      payload += `${name}: ${headers[name]}\r
`;
    }
    const proxyResponsePromise = parseProxyResponse(socket);
    socket.write(`${payload}\r
`);
    const { connect: connect3, buffered } = await proxyResponsePromise;
    req.emit("proxyConnect", connect3);
    this.emit("proxyConnect", connect3, req);
    req.emit("proxy", { proxy: this.proxy.href, socket });
    if (connect3.statusCode === 200) {
      req.once("socket", resume);
      if (opts.secureEndpoint) {
        debug2("Upgrading socket connection to TLS");
        return tls.connect({
          ...omit(setServernameFromNonIpHost(opts), "host", "path", "port"),
          socket
        });
      }
      return socket;
    }
    if (connect3.statusCode === 407 && this.onProxyAuth) {
      debug2("Got 407 response, invoking onProxyAuth callback");
      socket.destroy();
      const proxyAuthenticate = connect3.headers["proxy-authenticate"] || "";
      const scheme = Array.isArray(proxyAuthenticate) ? proxyAuthenticate[0].split(/\s/)[0] : proxyAuthenticate.split(/\s/)[0];
      const authResponse = await this.onProxyAuth({
        response: connect3,
        scheme
      });
      return this._connectWithAuth(req, opts, authResponse.headers);
    }
    socket.destroy();
    const fakeSocket = new net2.Socket({ writable: false });
    fakeSocket.readable = true;
    req.once("socket", (s3) => {
      debug2("Replaying proxy buffer for failed request");
      (0, import_assert.default)(s3.listenerCount("data") > 0);
      s3.push(buffered);
      s3.push(null);
    });
    return fakeSocket;
  }
  /**
   * Retry a CONNECT request with additional auth headers.
   */
  async _connectWithAuth(req, opts, authHeaders) {
    const { proxy } = this;
    let socket;
    if (proxy.protocol === "https:") {
      socket = tls.connect(setServernameFromNonIpHost(this.connectOpts));
    } else {
      socket = net2.connect(this.connectOpts);
    }
    const headers = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : { ...this.proxyHeaders };
    const host = net2.isIPv6(opts.host) ? `[${opts.host}]` : opts.host;
    let payload = `CONNECT ${host}:${opts.port} HTTP/1.1\r
`;
    if (proxy.username || proxy.password) {
      const auth = `${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password)}`;
      headers["Proxy-Authorization"] = `Basic ${Buffer.from(auth).toString("base64")}`;
    }
    Object.assign(headers, authHeaders);
    headers.Host = `${host}:${opts.port}`;
    if (!headers["Proxy-Connection"]) {
      headers["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
    }
    for (const name of Object.keys(headers)) {
      payload += `${name}: ${headers[name]}\r
`;
    }
    const proxyResponsePromise = parseProxyResponse(socket);
    socket.write(`${payload}\r
`);
    const { connect: connect3 } = await proxyResponsePromise;
    req.emit("proxyConnect", connect3);
    this.emit("proxyConnect", connect3, req);
    if (connect3.statusCode === 200) {
      req.once("socket", resume);
      if (opts.secureEndpoint) {
        debug2("Upgrading socket connection to TLS");
        return tls.connect({
          ...omit(setServernameFromNonIpHost(opts), "host", "path", "port"),
          socket
        });
      }
      return socket;
    }
    socket.destroy();
    throw new Error(`Proxy authentication failed with status ${connect3.statusCode} after retry`);
  }
};
HttpsProxyAgent.protocols = ["http", "https"];
function resume(socket) {
  setImmediate(() => {
    socket.resume();
  });
}
function omit(obj, ...keys) {
  const ret = {};
  let key;
  for (key in obj) {
    if (!keys.includes(key)) {
      ret[key] = obj[key];
    }
  }
  return ret;
}

// node_modules/tar/dist/esm/index.min.js
var import_events = __toESM(require("events"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_node_events = require("node:events");
var import_node_stream = __toESM(require("node:stream"), 1);
var import_node_string_decoder = require("node:string_decoder");
var import_node_path2 = __toESM(require("node:path"), 1);
var import_node_fs2 = __toESM(require("node:fs"), 1);
var import_path = require("path");
var import_events2 = require("events");
var import_assert2 = __toESM(require("assert"), 1);
var import_buffer = require("buffer");
var Ps = __toESM(require("zlib"), 1);
var import_zlib = __toESM(require("zlib"), 1);
var import_node_path3 = require("node:path");
var import_node_path4 = require("node:path");
var import_fs2 = __toESM(require("fs"), 1);
var import_fs3 = __toESM(require("fs"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_node_path5 = require("node:path");
var import_path3 = __toESM(require("path"), 1);
var import_node_fs3 = __toESM(require("node:fs"), 1);
var import_node_assert = __toESM(require("node:assert"), 1);
var import_node_crypto = require("node:crypto");
var import_node_fs4 = __toESM(require("node:fs"), 1);
var import_node_path6 = __toESM(require("node:path"), 1);
var import_fs4 = __toESM(require("fs"), 1);
var import_node_fs5 = __toESM(require("node:fs"), 1);
var import_node_path7 = __toESM(require("node:path"), 1);
var import_node_fs6 = __toESM(require("node:fs"), 1);
var import_promises = __toESM(require("node:fs/promises"), 1);
var import_node_path8 = __toESM(require("node:path"), 1);
var import_node_path9 = require("node:path");
var import_node_fs7 = __toESM(require("node:fs"), 1);
var import_node_path10 = __toESM(require("node:path"), 1);
var zr = Object.defineProperty;
var Ur = (s3, t) => {
  for (var e in t) zr(s3, e, { get: t[e], enumerable: true });
};
var Ds = typeof process == "object" && process ? process : { stdout: null, stderr: null };
var Wr = (s3) => !!s3 && typeof s3 == "object" && (s3 instanceof A || s3 instanceof import_node_stream.default || Gr(s3) || Zr(s3));
var Gr = (s3) => !!s3 && typeof s3 == "object" && s3 instanceof import_node_events.EventEmitter && typeof s3.pipe == "function" && s3.pipe !== import_node_stream.default.Writable.prototype.pipe;
var Zr = (s3) => !!s3 && typeof s3 == "object" && s3 instanceof import_node_events.EventEmitter && typeof s3.write == "function" && typeof s3.end == "function";
var Q = Symbol("EOF");
var J = Symbol("maybeEmitEnd");
var nt = Symbol("emittedEnd");
var De = Symbol("emittingEnd");
var qt = Symbol("emittedError");
var Ne = Symbol("closed");
var Ns = Symbol("read");
var Ae = Symbol("flush");
var As = Symbol("flushChunk");
var z = Symbol("encoding");
var Mt = Symbol("decoder");
var g = Symbol("flowing");
var Qt = Symbol("paused");
var Bt = Symbol("resume");
var b = Symbol("buffer");
var N = Symbol("pipes");
var _ = Symbol("bufferLength");
var bi = Symbol("bufferPush");
var Ie = Symbol("bufferShift");
var L = Symbol("objectMode");
var S = Symbol("destroyed");
var _i = Symbol("error");
var Oi = Symbol("emitData");
var Is = Symbol("emitEnd");
var Ti = Symbol("emitEnd2");
var Z = Symbol("async");
var xi = Symbol("abort");
var Ce = Symbol("aborted");
var Jt = Symbol("signal");
var Rt = Symbol("dataListeners");
var C = Symbol("discarded");
var jt = (s3) => Promise.resolve().then(s3);
var Yr = (s3) => s3();
var Kr = (s3) => s3 === "end" || s3 === "finish" || s3 === "prefinish";
var Vr = (s3) => s3 instanceof ArrayBuffer || !!s3 && typeof s3 == "object" && s3.constructor && s3.constructor.name === "ArrayBuffer" && s3.byteLength >= 0;
var $r = (s3) => !Buffer.isBuffer(s3) && ArrayBuffer.isView(s3);
var Fe = class {
  src;
  dest;
  opts;
  ondrain;
  constructor(t, e, i) {
    this.src = t, this.dest = e, this.opts = i, this.ondrain = () => t[Bt](), this.dest.on("drain", this.ondrain);
  }
  unpipe() {
    this.dest.removeListener("drain", this.ondrain);
  }
  proxyErrors(t) {
  }
  end() {
    this.unpipe(), this.opts.end && this.dest.end();
  }
};
var Li = class extends Fe {
  unpipe() {
    this.src.removeListener("error", this.proxyErrors), super.unpipe();
  }
  constructor(t, e, i) {
    super(t, e, i), this.proxyErrors = (r) => this.dest.emit("error", r), t.on("error", this.proxyErrors);
  }
};
var Xr = (s3) => !!s3.objectMode;
var qr = (s3) => !s3.objectMode && !!s3.encoding && s3.encoding !== "buffer";
var A = class extends import_node_events.EventEmitter {
  [g] = false;
  [Qt] = false;
  [N] = [];
  [b] = [];
  [L];
  [z];
  [Z];
  [Mt];
  [Q] = false;
  [nt] = false;
  [De] = false;
  [Ne] = false;
  [qt] = null;
  [_] = 0;
  [S] = false;
  [Jt];
  [Ce] = false;
  [Rt] = 0;
  [C] = false;
  writable = true;
  readable = true;
  constructor(...t) {
    let e = t[0] || {};
    if (super(), e.objectMode && typeof e.encoding == "string") throw new TypeError("Encoding and objectMode may not be used together");
    Xr(e) ? (this[L] = true, this[z] = null) : qr(e) ? (this[z] = e.encoding, this[L] = false) : (this[L] = false, this[z] = null), this[Z] = !!e.async, this[Mt] = this[z] ? new import_node_string_decoder.StringDecoder(this[z]) : null, e && e.debugExposeBuffer === true && Object.defineProperty(this, "buffer", { get: () => this[b] }), e && e.debugExposePipes === true && Object.defineProperty(this, "pipes", { get: () => this[N] });
    let { signal: i } = e;
    i && (this[Jt] = i, i.aborted ? this[xi]() : i.addEventListener("abort", () => this[xi]()));
  }
  get bufferLength() {
    return this[_];
  }
  get encoding() {
    return this[z];
  }
  set encoding(t) {
    throw new Error("Encoding must be set at instantiation time");
  }
  setEncoding(t) {
    throw new Error("Encoding must be set at instantiation time");
  }
  get objectMode() {
    return this[L];
  }
  set objectMode(t) {
    throw new Error("objectMode must be set at instantiation time");
  }
  get async() {
    return this[Z];
  }
  set async(t) {
    this[Z] = this[Z] || !!t;
  }
  [xi]() {
    this[Ce] = true, this.emit("abort", this[Jt]?.reason), this.destroy(this[Jt]?.reason);
  }
  get aborted() {
    return this[Ce];
  }
  set aborted(t) {
  }
  write(t, e, i) {
    if (this[Ce]) return false;
    if (this[Q]) throw new Error("write after end");
    if (this[S]) return this.emit("error", Object.assign(new Error("Cannot call write after a stream was destroyed"), { code: "ERR_STREAM_DESTROYED" })), true;
    typeof e == "function" && (i = e, e = "utf8"), e || (e = "utf8");
    let r = this[Z] ? jt : Yr;
    if (!this[L] && !Buffer.isBuffer(t)) {
      if ($r(t)) t = Buffer.from(t.buffer, t.byteOffset, t.byteLength);
      else if (Vr(t)) t = Buffer.from(t);
      else if (typeof t != "string") throw new Error("Non-contiguous data written to non-objectMode stream");
    }
    return this[L] ? (this[g] && this[_] !== 0 && this[Ae](true), this[g] ? this.emit("data", t) : this[bi](t), this[_] !== 0 && this.emit("readable"), i && r(i), this[g]) : t.length ? (typeof t == "string" && !(e === this[z] && !this[Mt]?.lastNeed) && (t = Buffer.from(t, e)), Buffer.isBuffer(t) && this[z] && (t = this[Mt].write(t)), this[g] && this[_] !== 0 && this[Ae](true), this[g] ? this.emit("data", t) : this[bi](t), this[_] !== 0 && this.emit("readable"), i && r(i), this[g]) : (this[_] !== 0 && this.emit("readable"), i && r(i), this[g]);
  }
  read(t) {
    if (this[S]) return null;
    if (this[C] = false, this[_] === 0 || t === 0 || t && t > this[_]) return this[J](), null;
    this[L] && (t = null), this[b].length > 1 && !this[L] && (this[b] = [this[z] ? this[b].join("") : Buffer.concat(this[b], this[_])]);
    let e = this[Ns](t || null, this[b][0]);
    return this[J](), e;
  }
  [Ns](t, e) {
    if (this[L]) this[Ie]();
    else {
      let i = e;
      t === i.length || t === null ? this[Ie]() : typeof i == "string" ? (this[b][0] = i.slice(t), e = i.slice(0, t), this[_] -= t) : (this[b][0] = i.subarray(t), e = i.subarray(0, t), this[_] -= t);
    }
    return this.emit("data", e), !this[b].length && !this[Q] && this.emit("drain"), e;
  }
  end(t, e, i) {
    return typeof t == "function" && (i = t, t = void 0), typeof e == "function" && (i = e, e = "utf8"), t !== void 0 && this.write(t, e), i && this.once("end", i), this[Q] = true, this.writable = false, (this[g] || !this[Qt]) && this[J](), this;
  }
  [Bt]() {
    this[S] || (!this[Rt] && !this[N].length && (this[C] = true), this[Qt] = false, this[g] = true, this.emit("resume"), this[b].length ? this[Ae]() : this[Q] ? this[J]() : this.emit("drain"));
  }
  resume() {
    return this[Bt]();
  }
  pause() {
    this[g] = false, this[Qt] = true, this[C] = false;
  }
  get destroyed() {
    return this[S];
  }
  get flowing() {
    return this[g];
  }
  get paused() {
    return this[Qt];
  }
  [bi](t) {
    this[L] ? this[_] += 1 : this[_] += t.length, this[b].push(t);
  }
  [Ie]() {
    return this[L] ? this[_] -= 1 : this[_] -= this[b][0].length, this[b].shift();
  }
  [Ae](t = false) {
    do
      ;
    while (this[As](this[Ie]()) && this[b].length);
    !t && !this[b].length && !this[Q] && this.emit("drain");
  }
  [As](t) {
    return this.emit("data", t), this[g];
  }
  pipe(t, e) {
    if (this[S]) return t;
    this[C] = false;
    let i = this[nt];
    return e = e || {}, t === Ds.stdout || t === Ds.stderr ? e.end = false : e.end = e.end !== false, e.proxyErrors = !!e.proxyErrors, i ? e.end && t.end() : (this[N].push(e.proxyErrors ? new Li(this, t, e) : new Fe(this, t, e)), this[Z] ? jt(() => this[Bt]()) : this[Bt]()), t;
  }
  unpipe(t) {
    let e = this[N].find((i) => i.dest === t);
    e && (this[N].length === 1 ? (this[g] && this[Rt] === 0 && (this[g] = false), this[N] = []) : this[N].splice(this[N].indexOf(e), 1), e.unpipe());
  }
  addListener(t, e) {
    return this.on(t, e);
  }
  on(t, e) {
    let i = super.on(t, e);
    if (t === "data") this[C] = false, this[Rt]++, !this[N].length && !this[g] && this[Bt]();
    else if (t === "readable" && this[_] !== 0) super.emit("readable");
    else if (Kr(t) && this[nt]) super.emit(t), this.removeAllListeners(t);
    else if (t === "error" && this[qt]) {
      let r = e;
      this[Z] ? jt(() => r.call(this, this[qt])) : r.call(this, this[qt]);
    }
    return i;
  }
  removeListener(t, e) {
    return this.off(t, e);
  }
  off(t, e) {
    let i = super.off(t, e);
    return t === "data" && (this[Rt] = this.listeners("data").length, this[Rt] === 0 && !this[C] && !this[N].length && (this[g] = false)), i;
  }
  removeAllListeners(t) {
    let e = super.removeAllListeners(t);
    return (t === "data" || t === void 0) && (this[Rt] = 0, !this[C] && !this[N].length && (this[g] = false)), e;
  }
  get emittedEnd() {
    return this[nt];
  }
  [J]() {
    !this[De] && !this[nt] && !this[S] && this[b].length === 0 && this[Q] && (this[De] = true, this.emit("end"), this.emit("prefinish"), this.emit("finish"), this[Ne] && this.emit("close"), this[De] = false);
  }
  emit(t, ...e) {
    let i = e[0];
    if (t !== "error" && t !== "close" && t !== S && this[S]) return false;
    if (t === "data") return !this[L] && !i ? false : this[Z] ? (jt(() => this[Oi](i)), true) : this[Oi](i);
    if (t === "end") return this[Is]();
    if (t === "close") {
      if (this[Ne] = true, !this[nt] && !this[S]) return false;
      let n = super.emit("close");
      return this.removeAllListeners("close"), n;
    } else if (t === "error") {
      this[qt] = i, super.emit(_i, i);
      let n = !this[Jt] || this.listeners("error").length ? super.emit("error", i) : false;
      return this[J](), n;
    } else if (t === "resume") {
      let n = super.emit("resume");
      return this[J](), n;
    } else if (t === "finish" || t === "prefinish") {
      let n = super.emit(t);
      return this.removeAllListeners(t), n;
    }
    let r = super.emit(t, ...e);
    return this[J](), r;
  }
  [Oi](t) {
    for (let i of this[N]) i.dest.write(t) === false && this.pause();
    let e = this[C] ? false : super.emit("data", t);
    return this[J](), e;
  }
  [Is]() {
    return this[nt] ? false : (this[nt] = true, this.readable = false, this[Z] ? (jt(() => this[Ti]()), true) : this[Ti]());
  }
  [Ti]() {
    if (this[Mt]) {
      let e = this[Mt].end();
      if (e) {
        for (let i of this[N]) i.dest.write(e);
        this[C] || super.emit("data", e);
      }
    }
    for (let e of this[N]) e.end();
    let t = super.emit("end");
    return this.removeAllListeners("end"), t;
  }
  async collect() {
    let t = Object.assign([], { dataLength: 0 });
    this[L] || (t.dataLength = 0);
    let e = this.promise();
    return this.on("data", (i) => {
      t.push(i), this[L] || (t.dataLength += i.length);
    }), await e, t;
  }
  async concat() {
    if (this[L]) throw new Error("cannot concat in objectMode");
    let t = await this.collect();
    return this[z] ? t.join("") : Buffer.concat(t, t.dataLength);
  }
  async promise() {
    return new Promise((t, e) => {
      this.on(S, () => e(new Error("stream destroyed"))), this.on("error", (i) => e(i)), this.on("end", () => t());
    });
  }
  [Symbol.asyncIterator]() {
    this[C] = false;
    let t = false, e = async () => (this.pause(), t = true, { value: void 0, done: true });
    return { next: () => {
      if (t) return e();
      let r = this.read();
      if (r !== null) return Promise.resolve({ done: false, value: r });
      if (this[Q]) return e();
      let n, o, h = (d) => {
        this.off("data", a), this.off("end", l), this.off(S, c), e(), o(d);
      }, a = (d) => {
        this.off("error", h), this.off("end", l), this.off(S, c), this.pause(), n({ value: d, done: !!this[Q] });
      }, l = () => {
        this.off("error", h), this.off("data", a), this.off(S, c), e(), n({ done: true, value: void 0 });
      }, c = () => h(new Error("stream destroyed"));
      return new Promise((d, y) => {
        o = y, n = d, this.once(S, c), this.once("error", h), this.once("end", l), this.once("data", a);
      });
    }, throw: e, return: e, [Symbol.asyncIterator]() {
      return this;
    }, [Symbol.asyncDispose]: async () => {
    } };
  }
  [Symbol.iterator]() {
    this[C] = false;
    let t = false, e = () => (this.pause(), this.off(_i, e), this.off(S, e), this.off("end", e), t = true, { done: true, value: void 0 }), i = () => {
      if (t) return e();
      let r = this.read();
      return r === null ? e() : { done: false, value: r };
    };
    return this.once("end", e), this.once(_i, e), this.once(S, e), { next: i, throw: e, return: e, [Symbol.iterator]() {
      return this;
    }, [Symbol.dispose]: () => {
    } };
  }
  destroy(t) {
    if (this[S]) return t ? this.emit("error", t) : this.emit(S), this;
    this[S] = true, this[C] = true, this[b].length = 0, this[_] = 0;
    let e = this;
    return typeof e.close == "function" && !this[Ne] && e.close(), t ? this.emit("error", t) : this.emit(S), this;
  }
  static get isStream() {
    return Wr;
  }
};
var Jr = import_fs.default.writev;
var ht = Symbol("_autoClose");
var H = Symbol("_close");
var te = Symbol("_ended");
var m = Symbol("_fd");
var Ni = Symbol("_finished");
var tt = Symbol("_flags");
var Ai = Symbol("_flush");
var ki = Symbol("_handleChunk");
var vi = Symbol("_makeBuf");
var ie = Symbol("_mode");
var ke = Symbol("_needDrain");
var Ut = Symbol("_onerror");
var Ht = Symbol("_onopen");
var Ii = Symbol("_onread");
var Pt = Symbol("_onwrite");
var at = Symbol("_open");
var U = Symbol("_path");
var ot = Symbol("_pos");
var Y = Symbol("_queue");
var zt = Symbol("_read");
var Ci = Symbol("_readSize");
var j = Symbol("_reading");
var ee = Symbol("_remain");
var Fi = Symbol("_size");
var ve = Symbol("_write");
var gt = Symbol("_writing");
var Me = Symbol("_defaultFlag");
var bt = Symbol("_errored");
var _t = class extends A {
  [bt] = false;
  [m];
  [U];
  [Ci];
  [j] = false;
  [Fi];
  [ee];
  [ht];
  constructor(t, e) {
    if (e = e || {}, super(e), this.readable = true, this.writable = false, typeof t != "string") throw new TypeError("path must be a string");
    this[bt] = false, this[m] = typeof e.fd == "number" ? e.fd : void 0, this[U] = t, this[Ci] = e.readSize || 16 * 1024 * 1024, this[j] = false, this[Fi] = typeof e.size == "number" ? e.size : 1 / 0, this[ee] = this[Fi], this[ht] = typeof e.autoClose == "boolean" ? e.autoClose : true, typeof this[m] == "number" ? this[zt]() : this[at]();
  }
  get fd() {
    return this[m];
  }
  get path() {
    return this[U];
  }
  write() {
    throw new TypeError("this is a readable stream");
  }
  end() {
    throw new TypeError("this is a readable stream");
  }
  [at]() {
    import_fs.default.open(this[U], "r", (t, e) => this[Ht](t, e));
  }
  [Ht](t, e) {
    t ? this[Ut](t) : (this[m] = e, this.emit("open", e), this[zt]());
  }
  [vi]() {
    return Buffer.allocUnsafe(Math.min(this[Ci], this[ee]));
  }
  [zt]() {
    if (!this[j]) {
      this[j] = true;
      let t = this[vi]();
      if (t.length === 0) return process.nextTick(() => this[Ii](null, 0, t));
      import_fs.default.read(this[m], t, 0, t.length, null, (e, i, r) => this[Ii](e, i, r));
    }
  }
  [Ii](t, e, i) {
    this[j] = false, t ? this[Ut](t) : this[ki](e, i) && this[zt]();
  }
  [H]() {
    if (this[ht] && typeof this[m] == "number") {
      let t = this[m];
      this[m] = void 0, import_fs.default.close(t, (e) => e ? this.emit("error", e) : this.emit("close"));
    }
  }
  [Ut](t) {
    this[j] = true, this[H](), this.emit("error", t);
  }
  [ki](t, e) {
    let i = false;
    return this[ee] -= t, t > 0 && (i = super.write(t < e.length ? e.subarray(0, t) : e)), (t === 0 || this[ee] <= 0) && (i = false, this[H](), super.end()), i;
  }
  emit(t, ...e) {
    switch (t) {
      case "prefinish":
      case "finish":
        return false;
      case "drain":
        return typeof this[m] == "number" && this[zt](), false;
      case "error":
        return this[bt] ? false : (this[bt] = true, super.emit(t, ...e));
      default:
        return super.emit(t, ...e);
    }
  }
};
var Be = class extends _t {
  [at]() {
    let t = true;
    try {
      this[Ht](null, import_fs.default.openSync(this[U], "r")), t = false;
    } finally {
      t && this[H]();
    }
  }
  [zt]() {
    let t = true;
    try {
      if (!this[j]) {
        this[j] = true;
        do {
          let e = this[vi](), i = e.length === 0 ? 0 : import_fs.default.readSync(this[m], e, 0, e.length, null);
          if (!this[ki](i, e)) break;
        } while (true);
        this[j] = false;
      }
      t = false;
    } finally {
      t && this[H]();
    }
  }
  [H]() {
    if (this[ht] && typeof this[m] == "number") {
      let t = this[m];
      this[m] = void 0, import_fs.default.closeSync(t), this.emit("close");
    }
  }
};
var et = class extends import_events.default {
  readable = false;
  writable = true;
  [bt] = false;
  [gt] = false;
  [te] = false;
  [Y] = [];
  [ke] = false;
  [U];
  [ie];
  [ht];
  [m];
  [Me];
  [tt];
  [Ni] = false;
  [ot];
  constructor(t, e) {
    e = e || {}, super(e), this[U] = t, this[m] = typeof e.fd == "number" ? e.fd : void 0, this[ie] = e.mode === void 0 ? 438 : e.mode, this[ot] = typeof e.start == "number" ? e.start : void 0, this[ht] = typeof e.autoClose == "boolean" ? e.autoClose : true;
    let i = this[ot] !== void 0 ? "r+" : "w";
    this[Me] = e.flags === void 0, this[tt] = e.flags === void 0 ? i : e.flags, this[m] === void 0 && this[at]();
  }
  emit(t, ...e) {
    if (t === "error") {
      if (this[bt]) return false;
      this[bt] = true;
    }
    return super.emit(t, ...e);
  }
  get fd() {
    return this[m];
  }
  get path() {
    return this[U];
  }
  [Ut](t) {
    this[H](), this[gt] = true, this.emit("error", t);
  }
  [at]() {
    import_fs.default.open(this[U], this[tt], this[ie], (t, e) => this[Ht](t, e));
  }
  [Ht](t, e) {
    this[Me] && this[tt] === "r+" && t && t.code === "ENOENT" ? (this[tt] = "w", this[at]()) : t ? this[Ut](t) : (this[m] = e, this.emit("open", e), this[gt] || this[Ai]());
  }
  end(t, e) {
    return t && this.write(t, e), this[te] = true, !this[gt] && !this[Y].length && typeof this[m] == "number" && this[Pt](null, 0), this;
  }
  write(t, e) {
    return typeof t == "string" && (t = Buffer.from(t, e)), this[te] ? (this.emit("error", new Error("write() after end()")), false) : this[m] === void 0 || this[gt] || this[Y].length ? (this[Y].push(t), this[ke] = true, false) : (this[gt] = true, this[ve](t), true);
  }
  [ve](t) {
    import_fs.default.write(this[m], t, 0, t.length, this[ot], (e, i) => this[Pt](e, i));
  }
  [Pt](t, e) {
    t ? this[Ut](t) : (this[ot] !== void 0 && typeof e == "number" && (this[ot] += e), this[Y].length ? this[Ai]() : (this[gt] = false, this[te] && !this[Ni] ? (this[Ni] = true, this[H](), this.emit("finish")) : this[ke] && (this[ke] = false, this.emit("drain"))));
  }
  [Ai]() {
    if (this[Y].length === 0) this[te] && this[Pt](null, 0);
    else if (this[Y].length === 1) this[ve](this[Y].pop());
    else {
      let t = this[Y];
      this[Y] = [], Jr(this[m], t, this[ot], (e, i) => this[Pt](e, i));
    }
  }
  [H]() {
    if (this[ht] && typeof this[m] == "number") {
      let t = this[m];
      this[m] = void 0, import_fs.default.close(t, (e) => e ? this.emit("error", e) : this.emit("close"));
    }
  }
};
var Wt = class extends et {
  [at]() {
    let t;
    if (this[Me] && this[tt] === "r+") try {
      t = import_fs.default.openSync(this[U], this[tt], this[ie]);
    } catch (e) {
      if (e?.code === "ENOENT") return this[tt] = "w", this[at]();
      throw e;
    }
    else t = import_fs.default.openSync(this[U], this[tt], this[ie]);
    this[Ht](null, t);
  }
  [H]() {
    if (this[ht] && typeof this[m] == "number") {
      let t = this[m];
      this[m] = void 0, import_fs.default.closeSync(t), this.emit("close");
    }
  }
  [ve](t) {
    let e = true;
    try {
      this[Pt](null, import_fs.default.writeSync(this[m], t, 0, t.length, this[ot])), e = false;
    } finally {
      if (e) try {
        this[H]();
      } catch {
      }
    }
  }
};
var jr = /* @__PURE__ */ new Map([["C", "cwd"], ["f", "file"], ["z", "gzip"], ["P", "preservePaths"], ["U", "unlink"], ["strip-components", "strip"], ["stripComponents", "strip"], ["keep-newer", "newer"], ["keepNewer", "newer"], ["keep-newer-files", "newer"], ["keepNewerFiles", "newer"], ["k", "keep"], ["keep-existing", "keep"], ["keepExisting", "keep"], ["m", "noMtime"], ["no-mtime", "noMtime"], ["p", "preserveOwner"], ["L", "follow"], ["h", "follow"], ["onentry", "onReadEntry"]]);
var Fs = (s3) => !!s3.sync && !!s3.file;
var ks = (s3) => !s3.sync && !!s3.file;
var vs = (s3) => !!s3.sync && !s3.file;
var Ms = (s3) => !s3.sync && !s3.file;
var Bs = (s3) => !!s3.file;
var tn = (s3) => {
  let t = jr.get(s3);
  return t || s3;
};
var se = (s3 = {}) => {
  if (!s3) return {};
  let t = {};
  for (let [e, i] of Object.entries(s3)) {
    let r = tn(e);
    t[r] = i;
  }
  return t.chmod === void 0 && t.noChmod === false && (t.chmod = true), delete t.noChmod, t;
};
var K = (s3, t, e, i, r) => Object.assign((n = [], o, h) => {
  Array.isArray(n) && (o = n, n = {}), typeof o == "function" && (h = o, o = void 0), o = o ? Array.from(o) : [];
  let a = se(n);
  if (r?.(a, o), Fs(a)) {
    if (typeof h == "function") throw new TypeError("callback not supported for sync tar functions");
    return s3(a, o);
  } else if (ks(a)) {
    let l = t(a, o);
    return h ? l.then(() => h(), h) : l;
  } else if (vs(a)) {
    if (typeof h == "function") throw new TypeError("callback not supported for sync tar functions");
    return e(a, o);
  } else if (Ms(a)) {
    if (typeof h == "function") throw new TypeError("callback only supported with file option");
    return i(a, o);
  }
  throw new Error("impossible options??");
}, { syncFile: s3, asyncFile: t, syncNoFile: e, asyncNoFile: i, validate: r });
var sn = import_zlib.default.constants || { ZLIB_VERNUM: 4736 };
var M = Object.freeze(Object.assign(/* @__PURE__ */ Object.create(null), { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_MEM_ERROR: -4, Z_BUF_ERROR: -5, Z_VERSION_ERROR: -6, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, DEFLATE: 1, INFLATE: 2, GZIP: 3, GUNZIP: 4, DEFLATERAW: 5, INFLATERAW: 6, UNZIP: 7, BROTLI_DECODE: 8, BROTLI_ENCODE: 9, Z_MIN_WINDOWBITS: 8, Z_MAX_WINDOWBITS: 15, Z_DEFAULT_WINDOWBITS: 15, Z_MIN_CHUNK: 64, Z_MAX_CHUNK: 1 / 0, Z_DEFAULT_CHUNK: 16384, Z_MIN_MEMLEVEL: 1, Z_MAX_MEMLEVEL: 9, Z_DEFAULT_MEMLEVEL: 8, Z_MIN_LEVEL: -1, Z_MAX_LEVEL: 9, Z_DEFAULT_LEVEL: -1, BROTLI_OPERATION_PROCESS: 0, BROTLI_OPERATION_FLUSH: 1, BROTLI_OPERATION_FINISH: 2, BROTLI_OPERATION_EMIT_METADATA: 3, BROTLI_MODE_GENERIC: 0, BROTLI_MODE_TEXT: 1, BROTLI_MODE_FONT: 2, BROTLI_DEFAULT_MODE: 0, BROTLI_MIN_QUALITY: 0, BROTLI_MAX_QUALITY: 11, BROTLI_DEFAULT_QUALITY: 11, BROTLI_MIN_WINDOW_BITS: 10, BROTLI_MAX_WINDOW_BITS: 24, BROTLI_LARGE_MAX_WINDOW_BITS: 30, BROTLI_DEFAULT_WINDOW: 22, BROTLI_MIN_INPUT_BLOCK_BITS: 16, BROTLI_MAX_INPUT_BLOCK_BITS: 24, BROTLI_PARAM_MODE: 0, BROTLI_PARAM_QUALITY: 1, BROTLI_PARAM_LGWIN: 2, BROTLI_PARAM_LGBLOCK: 3, BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING: 4, BROTLI_PARAM_SIZE_HINT: 5, BROTLI_PARAM_LARGE_WINDOW: 6, BROTLI_PARAM_NPOSTFIX: 7, BROTLI_PARAM_NDIRECT: 8, BROTLI_DECODER_RESULT_ERROR: 0, BROTLI_DECODER_RESULT_SUCCESS: 1, BROTLI_DECODER_RESULT_NEEDS_MORE_INPUT: 2, BROTLI_DECODER_RESULT_NEEDS_MORE_OUTPUT: 3, BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION: 0, BROTLI_DECODER_PARAM_LARGE_WINDOW: 1, BROTLI_DECODER_NO_ERROR: 0, BROTLI_DECODER_SUCCESS: 1, BROTLI_DECODER_NEEDS_MORE_INPUT: 2, BROTLI_DECODER_NEEDS_MORE_OUTPUT: 3, BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_NIBBLE: -1, BROTLI_DECODER_ERROR_FORMAT_RESERVED: -2, BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_META_NIBBLE: -3, BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_ALPHABET: -4, BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_SAME: -5, BROTLI_DECODER_ERROR_FORMAT_CL_SPACE: -6, BROTLI_DECODER_ERROR_FORMAT_HUFFMAN_SPACE: -7, BROTLI_DECODER_ERROR_FORMAT_CONTEXT_MAP_REPEAT: -8, BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_1: -9, BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_2: -10, BROTLI_DECODER_ERROR_FORMAT_TRANSFORM: -11, BROTLI_DECODER_ERROR_FORMAT_DICTIONARY: -12, BROTLI_DECODER_ERROR_FORMAT_WINDOW_BITS: -13, BROTLI_DECODER_ERROR_FORMAT_PADDING_1: -14, BROTLI_DECODER_ERROR_FORMAT_PADDING_2: -15, BROTLI_DECODER_ERROR_FORMAT_DISTANCE: -16, BROTLI_DECODER_ERROR_DICTIONARY_NOT_SET: -19, BROTLI_DECODER_ERROR_INVALID_ARGUMENTS: -20, BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MODES: -21, BROTLI_DECODER_ERROR_ALLOC_TREE_GROUPS: -22, BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MAP: -25, BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_1: -26, BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_2: -27, BROTLI_DECODER_ERROR_ALLOC_BLOCK_TYPE_TREES: -30, BROTLI_DECODER_ERROR_UNREACHABLE: -31 }, sn));
var rn = import_buffer.Buffer.concat;
var zs = Object.getOwnPropertyDescriptor(import_buffer.Buffer, "concat");
var nn = (s3) => s3;
var Bi = zs?.writable === true || zs?.set !== void 0 ? (s3) => {
  import_buffer.Buffer.concat = s3 ? nn : rn;
} : (s3) => {
};
var Tt = Symbol("_superWrite");
var Gt = class extends Error {
  code;
  errno;
  constructor(t, e) {
    super("zlib: " + t.message, { cause: t }), this.code = t.code, this.errno = t.errno, this.code || (this.code = "ZLIB_ERROR"), this.message = "zlib: " + t.message, Error.captureStackTrace(this, e ?? this.constructor);
  }
  get name() {
    return "ZlibError";
  }
};
var Pi = Symbol("flushFlag");
var re = class extends A {
  #t = false;
  #i = false;
  #s;
  #n;
  #r;
  #e;
  #o;
  get sawError() {
    return this.#t;
  }
  get handle() {
    return this.#e;
  }
  get flushFlag() {
    return this.#s;
  }
  constructor(t, e) {
    if (!t || typeof t != "object") throw new TypeError("invalid options for ZlibBase constructor");
    if (super(t), this.#s = t.flush ?? 0, this.#n = t.finishFlush ?? 0, this.#r = t.fullFlushFlag ?? 0, typeof Ps[e] != "function") throw new TypeError("Compression method not supported: " + e);
    try {
      this.#e = new Ps[e](t);
    } catch (i) {
      throw new Gt(i, this.constructor);
    }
    this.#o = (i) => {
      this.#t || (this.#t = true, this.close(), this.emit("error", i));
    }, this.#e?.on("error", (i) => this.#o(new Gt(i))), this.once("end", () => this.close);
  }
  close() {
    this.#e && (this.#e.close(), this.#e = void 0, this.emit("close"));
  }
  reset() {
    if (!this.#t) return (0, import_assert2.default)(this.#e, "zlib binding closed"), this.#e.reset?.();
  }
  flush(t) {
    this.ended || (typeof t != "number" && (t = this.#r), this.write(Object.assign(import_buffer.Buffer.alloc(0), { [Pi]: t })));
  }
  end(t, e, i) {
    return typeof t == "function" && (i = t, e = void 0, t = void 0), typeof e == "function" && (i = e, e = void 0), t && (e ? this.write(t, e) : this.write(t)), this.flush(this.#n), this.#i = true, super.end(i);
  }
  get ended() {
    return this.#i;
  }
  [Tt](t) {
    return super.write(t);
  }
  write(t, e, i) {
    if (typeof e == "function" && (i = e, e = "utf8"), typeof t == "string" && (t = import_buffer.Buffer.from(t, e)), this.#t) return;
    (0, import_assert2.default)(this.#e, "zlib binding closed");
    let r = this.#e._handle, n = r.close;
    r.close = () => {
    };
    let o = this.#e.close;
    this.#e.close = () => {
    }, Bi(true);
    let h;
    try {
      let l = typeof t[Pi] == "number" ? t[Pi] : this.#s;
      h = this.#e._processChunk(t, l), Bi(false);
    } catch (l) {
      Bi(false), this.#o(new Gt(l, this.write));
    } finally {
      this.#e && (this.#e._handle = r, r.close = n, this.#e.close = o, this.#e.removeAllListeners("error"));
    }
    this.#e && this.#e.on("error", (l) => this.#o(new Gt(l, this.write)));
    let a;
    if (h) if (Array.isArray(h) && h.length > 0) {
      let l = h[0];
      a = this[Tt](import_buffer.Buffer.from(l));
      for (let c = 1; c < h.length; c++) a = this[Tt](h[c]);
    } else a = this[Tt](import_buffer.Buffer.from(h));
    return i && i(), a;
  }
};
var Pe = class extends re {
  #t;
  #i;
  constructor(t, e) {
    t = t || {}, t.flush = t.flush || M.Z_NO_FLUSH, t.finishFlush = t.finishFlush || M.Z_FINISH, t.fullFlushFlag = M.Z_FULL_FLUSH, super(t, e), this.#t = t.level, this.#i = t.strategy;
  }
  params(t, e) {
    if (!this.sawError) {
      if (!this.handle) throw new Error("cannot switch params when binding is closed");
      if (!this.handle.params) throw new Error("not supported in this implementation");
      if (this.#t !== t || this.#i !== e) {
        this.flush(M.Z_SYNC_FLUSH), (0, import_assert2.default)(this.handle, "zlib binding closed");
        let i = this.handle.flush;
        this.handle.flush = (r, n) => {
          typeof r == "function" && (n = r, r = this.flushFlag), this.flush(r), n?.();
        };
        try {
          this.handle.params(t, e);
        } finally {
          this.handle.flush = i;
        }
        this.handle && (this.#t = t, this.#i = e);
      }
    }
  }
};
var ze = class extends Pe {
  #t;
  constructor(t) {
    super(t, "Gzip"), this.#t = t && !!t.portable;
  }
  [Tt](t) {
    return this.#t ? (this.#t = false, t[9] = 255, super[Tt](t)) : super[Tt](t);
  }
};
var Ue = class extends Pe {
  constructor(t) {
    super(t, "Unzip");
  }
};
var He = class extends re {
  constructor(t, e) {
    t = t || {}, t.flush = t.flush || M.BROTLI_OPERATION_PROCESS, t.finishFlush = t.finishFlush || M.BROTLI_OPERATION_FINISH, t.fullFlushFlag = M.BROTLI_OPERATION_FLUSH, super(t, e);
  }
};
var We = class extends He {
  constructor(t) {
    super(t, "BrotliCompress");
  }
};
var Ge = class extends He {
  constructor(t) {
    super(t, "BrotliDecompress");
  }
};
var Ze = class extends re {
  constructor(t, e) {
    t = t || {}, t.flush = t.flush || M.ZSTD_e_continue, t.finishFlush = t.finishFlush || M.ZSTD_e_end, t.fullFlushFlag = M.ZSTD_e_flush, super(t, e);
  }
};
var Ye = class extends Ze {
  constructor(t) {
    super(t, "ZstdCompress");
  }
};
var Ke = class extends Ze {
  constructor(t) {
    super(t, "ZstdDecompress");
  }
};
var Us = (s3, t) => {
  if (Number.isSafeInteger(s3)) s3 < 0 ? an(s3, t) : hn(s3, t);
  else throw Error("cannot encode number outside of javascript safe integer range");
  return t;
};
var hn = (s3, t) => {
  t[0] = 128;
  for (var e = t.length; e > 1; e--) t[e - 1] = s3 & 255, s3 = Math.floor(s3 / 256);
};
var an = (s3, t) => {
  t[0] = 255;
  var e = false;
  s3 = s3 * -1;
  for (var i = t.length; i > 1; i--) {
    var r = s3 & 255;
    s3 = Math.floor(s3 / 256), e ? t[i - 1] = Ws(r) : r === 0 ? t[i - 1] = 0 : (e = true, t[i - 1] = Gs(r));
  }
};
var Hs = (s3) => {
  let t = s3[0], e = t === 128 ? cn(s3.subarray(1, s3.length)) : t === 255 ? ln(s3) : null;
  if (e === null) throw Error("invalid base256 encoding");
  if (!Number.isSafeInteger(e)) throw Error("parsed number outside of javascript safe integer range");
  return e;
};
var ln = (s3) => {
  for (var t = s3.length, e = 0, i = false, r = t - 1; r > -1; r--) {
    var n = Number(s3[r]), o;
    i ? o = Ws(n) : n === 0 ? o = n : (i = true, o = Gs(n)), o !== 0 && (e -= o * Math.pow(256, t - r - 1));
  }
  return e;
};
var cn = (s3) => {
  for (var t = s3.length, e = 0, i = t - 1; i > -1; i--) {
    var r = Number(s3[i]);
    r !== 0 && (e += r * Math.pow(256, t - i - 1));
  }
  return e;
};
var Ws = (s3) => (255 ^ s3) & 255;
var Gs = (s3) => (255 ^ s3) + 1 & 255;
var Hi = {};
Ur(Hi, { code: () => Ve, isCode: () => ne, isName: () => dn, name: () => oe, normalFsTypes: () => Ui });
var ne = (s3) => oe.has(s3);
var dn = (s3) => Ve.has(s3);
var Ui = /* @__PURE__ */ new Set(["0", "", "1", "2", "3", "4", "5", "6", "7", "D"]);
var oe = /* @__PURE__ */ new Map([["0", "File"], ["", "OldFile"], ["1", "Link"], ["2", "SymbolicLink"], ["3", "CharacterDevice"], ["4", "BlockDevice"], ["5", "Directory"], ["6", "FIFO"], ["7", "ContiguousFile"], ["g", "GlobalExtendedHeader"], ["x", "ExtendedHeader"], ["A", "SolarisACL"], ["D", "GNUDumpDir"], ["I", "Inode"], ["K", "NextFileHasLongLinkpath"], ["L", "NextFileHasLongPath"], ["M", "ContinuationFile"], ["N", "OldGnuLongPath"], ["S", "SparseFile"], ["V", "TapeVolumeHeader"], ["X", "OldExtendedHeader"]]);
var Ve = new Map(Array.from(oe).map((s3) => [s3[1], s3[0]]));
var un = (s3) => s3 === void 0 || s3 < 0 ? void 0 : s3;
var F = class {
  cksumValid = false;
  needPax = false;
  nullBlock = false;
  block;
  path;
  mode;
  uid;
  gid;
  size;
  cksum;
  #t = "Unsupported";
  linkpath;
  uname;
  gname;
  devmaj = 0;
  devmin = 0;
  atime;
  ctime;
  mtime;
  charset;
  comment;
  constructor(t, e = 0, i, r) {
    Buffer.isBuffer(t) ? this.decode(t, e || 0, i, r) : t && this.#i(t);
  }
  decode(t, e, i, r) {
    if (e || (e = 0), !t || !(t.length >= e + 512)) throw new Error("need 512 bytes for header");
    let n = xt(t, e + 156, 1), o = Ui.has(n), h = o ? i : void 0, a = o ? r : void 0;
    if (this.path = h?.path ?? xt(t, e, 100), this.mode = h?.mode ?? a?.mode ?? lt(t, e + 100, 8), this.uid = h?.uid ?? a?.uid ?? lt(t, e + 108, 8), this.gid = h?.gid ?? a?.gid ?? lt(t, e + 116, 8), this.size = un(h?.size ?? a?.size ?? lt(t, e + 124, 12)), this.mtime = h?.mtime ?? a?.mtime ?? Wi(t, e + 136, 12), this.cksum = lt(t, e + 148, 12), a && this.#i(a, true), h && this.#i(h), ne(n) && (this.#t = n || "0"), this.#t === "0" && this.path.slice(-1) === "/" && (this.#t = "5"), this.#t === "5" && (this.size = 0), this.linkpath = xt(t, e + 157, 100), t.subarray(e + 257, e + 265).toString() === "ustar\x0000") if (this.uname = h?.uname ?? a?.uname ?? xt(t, e + 265, 32), this.gname = h?.gname ?? a?.gname ?? xt(t, e + 297, 32), this.devmaj = h?.devmaj ?? a?.devmaj ?? lt(t, e + 329, 8) ?? 0, this.devmin = h?.devmin ?? a?.devmin ?? lt(t, e + 337, 8) ?? 0, t[e + 475] !== 0) {
      let c = xt(t, e + 345, 155);
      this.path = c + "/" + this.path;
    } else {
      let c = xt(t, e + 345, 130);
      c && (this.path = c + "/" + this.path), this.atime = i?.atime ?? r?.atime ?? Wi(t, e + 476, 12), this.ctime = i?.ctime ?? r?.ctime ?? Wi(t, e + 488, 12);
    }
    let l = 256;
    for (let c = e; c < e + 148; c++) l += t[c];
    for (let c = e + 156; c < e + 512; c++) l += t[c];
    this.cksumValid = l === this.cksum, this.cksum === void 0 && l === 256 && (this.nullBlock = true);
  }
  #i(t, e = false) {
    Object.assign(this, Object.fromEntries(Object.entries(t).filter(([i, r]) => !(r == null || i === "size" && Number(r) < 0 || i === "path" && e || i === "linkpath" && e || i === "global"))));
  }
  encode(t, e = 0) {
    if (t || (t = this.block = Buffer.alloc(512)), this.#t === "Unsupported" && (this.#t = "0"), !(t.length >= e + 512)) throw new Error("need 512 bytes for header");
    let i = this.ctime || this.atime ? 130 : 155, r = mn(this.path || "", i), n = r[0], o = r[1];
    this.needPax = !!r[2], this.needPax = Lt(t, e, 100, n) || this.needPax, this.needPax = ct(t, e + 100, 8, this.mode) || this.needPax, this.needPax = ct(t, e + 108, 8, this.uid) || this.needPax, this.needPax = ct(t, e + 116, 8, this.gid) || this.needPax, this.needPax = ct(t, e + 124, 12, this.size) || this.needPax, this.needPax = Gi(t, e + 136, 12, this.mtime) || this.needPax, t[e + 156] = Number(this.#t.codePointAt(0)), this.needPax = Lt(t, e + 157, 100, this.linkpath) || this.needPax, t.write("ustar\x0000", e + 257, 8), this.needPax = Lt(t, e + 265, 32, this.uname) || this.needPax, this.needPax = Lt(t, e + 297, 32, this.gname) || this.needPax, this.needPax = ct(t, e + 329, 8, this.devmaj) || this.needPax, this.needPax = ct(t, e + 337, 8, this.devmin) || this.needPax, this.needPax = Lt(t, e + 345, i, o) || this.needPax, t[e + 475] !== 0 ? this.needPax = Lt(t, e + 345, 155, o) || this.needPax : (this.needPax = Lt(t, e + 345, 130, o) || this.needPax, this.needPax = Gi(t, e + 476, 12, this.atime) || this.needPax, this.needPax = Gi(t, e + 488, 12, this.ctime) || this.needPax);
    let h = 256;
    for (let a = e; a < e + 148; a++) h += t[a];
    for (let a = e + 156; a < e + 512; a++) h += t[a];
    return this.cksum = h, ct(t, e + 148, 8, this.cksum), this.cksumValid = true, this.needPax;
  }
  get type() {
    return this.#t === "Unsupported" ? this.#t : oe.get(this.#t);
  }
  get typeKey() {
    return this.#t;
  }
  set type(t) {
    let e = String(Ve.get(t));
    if (ne(e) || e === "Unsupported") this.#t = e;
    else if (ne(t)) this.#t = t;
    else throw new TypeError("invalid entry type: " + t);
  }
};
var mn = (s3, t) => {
  let i = s3, r = "", n, o = import_node_path3.posix.parse(s3).root || ".";
  if (Buffer.byteLength(i) < 100) n = [i, r, false];
  else {
    r = import_node_path3.posix.dirname(i), i = import_node_path3.posix.basename(i);
    do
      Buffer.byteLength(i) <= 100 && Buffer.byteLength(r) <= t ? n = [i, r, false] : Buffer.byteLength(i) > 100 && Buffer.byteLength(r) <= t ? n = [i.slice(0, 99), r, true] : (i = import_node_path3.posix.join(import_node_path3.posix.basename(r), i), r = import_node_path3.posix.dirname(r));
    while (r !== o && n === void 0);
    n || (n = [s3.slice(0, 99), "", true]);
  }
  return n;
};
var xt = (s3, t, e) => s3.subarray(t, t + e).toString("utf8").replace(/\0.*/, "");
var Wi = (s3, t, e) => pn(lt(s3, t, e));
var pn = (s3) => s3 === void 0 ? void 0 : new Date(s3 * 1e3);
var lt = (s3, t, e) => Number(s3[t]) & 128 ? Hs(s3.subarray(t, t + e)) : wn(s3, t, e);
var En = (s3) => isNaN(s3) ? void 0 : s3;
var wn = (s3, t, e) => En(parseInt(s3.subarray(t, t + e).toString("utf8").replace(/\0.*$/, "").trim(), 8));
var Sn = { 12: 8589934591, 8: 2097151 };
var ct = (s3, t, e, i) => i === void 0 ? false : i > Sn[e] || i < 0 ? (Us(i, s3.subarray(t, t + e)), true) : (yn(s3, t, e, i), false);
var yn = (s3, t, e, i) => s3.write(Rn(i, e), t, e, "ascii");
var Rn = (s3, t) => gn(Math.floor(s3).toString(8), t);
var gn = (s3, t) => (s3.length === t - 1 ? s3 : new Array(t - s3.length - 1).join("0") + s3 + " ") + "\0";
var Gi = (s3, t, e, i) => i === void 0 ? false : ct(s3, t, e, i.getTime() / 1e3);
var bn = new Array(156).join("\0");
var Lt = (s3, t, e, i) => i === void 0 ? false : (s3.write(i + bn, t, e, "utf8"), i.length !== Buffer.byteLength(i) || i.length > e);
var ft = class s {
  atime;
  mtime;
  ctime;
  charset;
  comment;
  gid;
  uid;
  gname;
  uname;
  linkpath;
  dev;
  ino;
  nlink;
  path;
  size;
  mode;
  global;
  constructor(t, e = false) {
    this.atime = t.atime, this.charset = t.charset, this.comment = t.comment, this.ctime = t.ctime, this.dev = t.dev, this.gid = t.gid, this.global = e, this.gname = t.gname, this.ino = t.ino, this.linkpath = t.linkpath, this.mtime = t.mtime, this.nlink = t.nlink, this.path = t.path, this.size = t.size, this.uid = t.uid, this.uname = t.uname;
  }
  encode() {
    let t = this.encodeBody();
    if (t === "") return Buffer.allocUnsafe(0);
    let e = Buffer.byteLength(t), i = 512 * Math.ceil(1 + e / 512), r = Buffer.allocUnsafe(i);
    for (let n = 0; n < 512; n++) r[n] = 0;
    new F({ path: ("PaxHeader/" + (0, import_node_path4.basename)(this.path ?? "")).slice(0, 99), mode: this.mode || 420, uid: this.uid, gid: this.gid, size: e, mtime: this.mtime, type: this.global ? "GlobalExtendedHeader" : "ExtendedHeader", linkpath: "", uname: this.uname || "", gname: this.gname || "", devmaj: 0, devmin: 0, atime: this.atime, ctime: this.ctime }).encode(r), r.write(t, 512, e, "utf8");
    for (let n = e + 512; n < r.length; n++) r[n] = 0;
    return r;
  }
  encodeBody() {
    return this.encodeField("path") + this.encodeField("ctime") + this.encodeField("atime") + this.encodeField("dev") + this.encodeField("ino") + this.encodeField("nlink") + this.encodeField("charset") + this.encodeField("comment") + this.encodeField("gid") + this.encodeField("gname") + this.encodeField("linkpath") + this.encodeField("mtime") + this.encodeField("size") + this.encodeField("uid") + this.encodeField("uname");
  }
  encodeField(t) {
    if (this[t] === void 0) return "";
    let e = this[t], i = e instanceof Date ? e.getTime() / 1e3 : e, r = " " + (t === "dev" || t === "ino" || t === "nlink" ? "SCHILY." : "") + t + "=" + i + `
`, n = Buffer.byteLength(r), o = Math.floor(Math.log(n) / Math.log(10)) + 1;
    return n + o >= Math.pow(10, o) && (o += 1), o + n + r;
  }
  static parse(t, e, i = false) {
    return new s(On(Tn(t), e), i);
  }
};
var On = (s3, t) => t ? Object.assign({}, t, s3) : s3;
var Tn = (s3) => s3.replace(/\n$/, "").split(`
`).reduce(xn, /* @__PURE__ */ Object.create(null));
var xn = (s3, t) => {
  let e = parseInt(t, 10);
  if (e !== Buffer.byteLength(t) + 1) return s3;
  t = t.slice((e + " ").length);
  let i = t.split("="), r = i.shift();
  if (!r) return s3;
  let n = r.replace(/^SCHILY\.(dev|ino|nlink)/, "$1"), o = i.join("=").replace(/\0.*/, "");
  switch (n) {
    case "path":
    case "linkpath":
    case "type":
    case "charset":
    case "comment":
    case "gname":
    case "uname":
      s3[n] = o;
      break;
    case "ctime":
    case "atime":
    case "mtime":
      s3[n] = new Date(Number(o) * 1e3);
      break;
    case "size":
      let h = +o;
      h >= 0 && (s3[n] = h);
      break;
    case "gid":
    case "uid":
    case "dev":
    case "ino":
    case "nlink":
    case "mode":
      s3[n] = +o;
      break;
  }
  return s3;
};
var Ln = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform;
var f = Ln !== "win32" ? (s3) => String(s3) : (s3) => String(s3).replaceAll(/\\/g, "/");
var $e = class extends A {
  extended;
  globalExtended;
  header;
  startBlockSize;
  blockRemain;
  remain;
  type;
  meta = false;
  ignore = false;
  path;
  mode;
  uid;
  gid;
  uname;
  gname;
  size = 0;
  mtime;
  atime;
  ctime;
  linkpath;
  dev;
  ino;
  nlink;
  invalid = false;
  absolute;
  unsupported = false;
  constructor(t, e, i) {
    switch (super({}), this.pause(), this.extended = e, this.globalExtended = i, this.header = t, this.remain = t.size ?? 0, this.startBlockSize = 512 * Math.ceil(this.remain / 512), this.blockRemain = this.startBlockSize, this.type = t.type, this.type) {
      case "File":
      case "OldFile":
      case "Link":
      case "SymbolicLink":
      case "CharacterDevice":
      case "BlockDevice":
      case "Directory":
      case "FIFO":
      case "ContiguousFile":
      case "GNUDumpDir":
        break;
      case "NextFileHasLongLinkpath":
      case "NextFileHasLongPath":
      case "OldGnuLongPath":
      case "GlobalExtendedHeader":
      case "ExtendedHeader":
      case "OldExtendedHeader":
        this.meta = true;
        break;
      default:
        this.ignore = true;
    }
    if (!t.path) throw new Error("no path provided for tar.ReadEntry");
    this.path = f(t.path), this.mode = t.mode, this.mode && (this.mode = this.mode & 4095), this.uid = t.uid, this.gid = t.gid, this.uname = t.uname, this.gname = t.gname, this.size = this.remain, this.mtime = t.mtime, this.atime = t.atime, this.ctime = t.ctime, this.linkpath = t.linkpath ? f(t.linkpath) : void 0, this.uname = t.uname, this.gname = t.gname, e && this.#t(e), i && this.#t(i, true);
  }
  write(t) {
    let e = t.length;
    if (e > this.blockRemain) throw new Error("writing more to entry than is appropriate");
    let i = this.remain, r = this.blockRemain;
    return this.remain = Math.max(0, i - e), this.blockRemain = Math.max(0, r - e), this.ignore ? true : i >= e ? super.write(t) : super.write(t.subarray(0, i));
  }
  #t(t, e = false) {
    t.path && (t.path = f(t.path)), t.linkpath && (t.linkpath = f(t.linkpath)), Object.assign(this, Object.fromEntries(Object.entries(t).filter(([i, r]) => !(r == null || i === "path" && e))));
  }
};
var Dt = (s3, t, e, i = {}) => {
  s3.file && (i.file = s3.file), s3.cwd && (i.cwd = s3.cwd), i.code = e instanceof Error && e.code || t, i.tarCode = t, !s3.strict && i.recoverable !== false ? (e instanceof Error && (i = Object.assign(e, i), e = e.message), s3.emit("warn", t, e, i)) : e instanceof Error ? s3.emit("error", Object.assign(e, i)) : s3.emit("error", Object.assign(new Error(`${t}: ${e}`), i));
};
var Nn = 1024 * 1024;
var Xi = Buffer.from([31, 139]);
var qi = Buffer.from([40, 181, 47, 253]);
var An = Math.max(Xi.length, qi.length);
var B = Symbol("state");
var Nt = Symbol("writeEntry");
var it = Symbol("readEntry");
var Zi = Symbol("nextEntry");
var Zs = Symbol("processEntry");
var V = Symbol("extendedHeader");
var he = Symbol("globalExtendedHeader");
var dt = Symbol("meta");
var Ys = Symbol("emitMeta");
var p = Symbol("buffer");
var st = Symbol("queue");
var ut = Symbol("ended");
var Yi = Symbol("emittedEnd");
var At = Symbol("emit");
var w = Symbol("unzip");
var Xe = Symbol("consumeChunk");
var qe = Symbol("consumeChunkSub");
var Ki = Symbol("consumeBody");
var Ks = Symbol("consumeMeta");
var Vs = Symbol("consumeHeader");
var ae = Symbol("consuming");
var Vi = Symbol("bufferConcat");
var Qe = Symbol("maybeEnd");
var Yt = Symbol("writing");
var $ = Symbol("aborted");
var Je = Symbol("onDone");
var It = Symbol("sawValidEntry");
var je = Symbol("sawNullBlock");
var ti = Symbol("sawEOF");
var $s = Symbol("closeStream");
var In = 1e3;
var le = Symbol("compressedBytesRead");
var $i = Symbol("decompressedBytesRead");
var Xs = Symbol("checkDecompressionRatio");
var Cn = () => true;
var rt = class extends import_events2.EventEmitter {
  file;
  strict;
  maxMetaEntrySize;
  filter;
  brotli;
  zstd;
  maxDecompressionRatio;
  writable = true;
  readable = false;
  [st] = [];
  [p];
  [it];
  [Nt];
  [B] = "begin";
  [dt] = "";
  [V];
  [he];
  [ut] = false;
  [w];
  [$] = false;
  [It];
  [je] = false;
  [ti] = false;
  [Yt] = false;
  [ae] = false;
  [Yi] = false;
  [le] = 0;
  [$i] = 0;
  constructor(t = {}) {
    super(), this.file = t.file || "", this.on(Je, () => {
      (this[B] === "begin" || this[It] === false) && this.warn("TAR_BAD_ARCHIVE", "Unrecognized archive format");
    }), t.ondone ? this.on(Je, t.ondone) : this.on(Je, () => {
      this.emit("prefinish"), this.emit("finish"), this.emit("end");
    }), this.strict = !!t.strict, this.maxDecompressionRatio = typeof t.maxDecompressionRatio == "number" ? t.maxDecompressionRatio : In, this.maxMetaEntrySize = t.maxMetaEntrySize || Nn, this.filter = typeof t.filter == "function" ? t.filter : Cn;
    let e = t.file && (t.file.endsWith(".tar.br") || t.file.endsWith(".tbr"));
    this.brotli = !(t.gzip || t.zstd) && t.brotli !== void 0 ? t.brotli : e ? void 0 : false;
    let i = t.file && (t.file.endsWith(".tar.zst") || t.file.endsWith(".tzst"));
    this.zstd = !(t.gzip || t.brotli) && t.zstd !== void 0 ? t.zstd : i ? true : void 0, this.on("end", () => this[$s]()), typeof t.onwarn == "function" && this.on("warn", t.onwarn), typeof t.onReadEntry == "function" && this.on("entry", t.onReadEntry);
  }
  warn(t, e, i = {}) {
    Dt(this, t, e, i);
  }
  [Vs](t, e) {
    this[It] === void 0 && (this[It] = false);
    let i;
    try {
      i = new F(t, e, this[V], this[he]);
    } catch (r) {
      return this.warn("TAR_ENTRY_INVALID", r);
    }
    if (i.nullBlock) this[je] ? (this[ti] = true, this[B] === "begin" && (this[B] = "header"), this[At]("eof")) : (this[je] = true, this[At]("nullBlock"));
    else if (this[je] = false, !i.cksumValid) this.warn("TAR_ENTRY_INVALID", "checksum failure", { header: i });
    else if (!i.path) this.warn("TAR_ENTRY_INVALID", "path is required", { header: i });
    else {
      let r = i.type;
      if (/^(Symbolic)?Link$/.test(r) && !i.linkpath) this.warn("TAR_ENTRY_INVALID", "linkpath required", { header: i });
      else if (!/^(Symbolic)?Link$/.test(r) && !/^(Global)?ExtendedHeader$/.test(r) && i.linkpath) this.warn("TAR_ENTRY_INVALID", "linkpath forbidden", { header: i });
      else {
        let n = this[Nt] = new $e(i, this[V], this[he]);
        if (!this[It]) if (n.remain) {
          let o = () => {
            n.invalid || (this[It] = true);
          };
          n.on("end", o);
        } else this[It] = true;
        n.meta ? n.size > this.maxMetaEntrySize ? (n.ignore = true, this[At]("ignoredEntry", n), this[B] = "ignore", n.resume()) : n.size > 0 && (this[dt] = "", n.on("data", (o) => this[dt] += o), this[B] = "meta") : (this[V] = void 0, n.ignore = n.ignore || !this.filter(n.path, n), n.ignore ? (this[At]("ignoredEntry", n), this[B] = n.remain ? "ignore" : "header", n.resume()) : (n.remain ? this[B] = "body" : (this[B] = "header", n.end()), this[it] ? this[st].push(n) : (this[st].push(n), this[Zi]())));
      }
    }
  }
  [$s]() {
    queueMicrotask(() => this.emit("close"));
  }
  [Zs](t) {
    let e = true;
    if (!t) this[it] = void 0, e = false;
    else if (Array.isArray(t)) {
      let [i, ...r] = t;
      this.emit(i, ...r);
    } else this[it] = t, this.emit("entry", t), t.emittedEnd || (t.on("end", () => this[Zi]()), e = false);
    return e;
  }
  [Zi]() {
    do
      ;
    while (this[Zs](this[st].shift()));
    if (this[st].length === 0) {
      let t = this[it];
      !t || t.flowing || t.size === t.remain ? this[Yt] || this.emit("drain") : t.once("drain", () => this.emit("drain"));
    }
  }
  [Ki](t, e) {
    let i = this[Nt];
    if (!i) throw new Error("attempt to consume body without entry??");
    let r = i.blockRemain ?? 0, n = r >= t.length && e === 0 ? t : t.subarray(e, e + r);
    return i.write(n), i.blockRemain || (this[B] = "header", this[Nt] = void 0, i.end()), n.length;
  }
  [Ks](t, e) {
    let i = this[Nt], r = this[Ki](t, e);
    return !this[Nt] && i && this[Ys](i), r;
  }
  [At](t, e, i) {
    this[st].length === 0 && !this[it] ? this.emit(t, e, i) : this[st].push([t, e, i]);
  }
  [Ys](t) {
    switch (this[At]("meta", this[dt]), t.type) {
      case "ExtendedHeader":
      case "OldExtendedHeader":
        this[V] = ft.parse(this[dt], this[V], false);
        break;
      case "GlobalExtendedHeader":
        this[he] = ft.parse(this[dt], this[he], true);
        break;
      case "NextFileHasLongPath":
      case "OldGnuLongPath": {
        let e = this[V] ?? /* @__PURE__ */ Object.create(null);
        this[V] = e, e.path = this[dt].replace(/\0.*/, "");
        break;
      }
      case "NextFileHasLongLinkpath": {
        let e = this[V] || /* @__PURE__ */ Object.create(null);
        this[V] = e, e.linkpath = this[dt].replace(/\0.*/, "");
        break;
      }
      default:
        throw new Error("unknown meta: " + t.type);
    }
  }
  abort(t) {
    if (!this[$]) {
      if (this[w]) {
        let e = this[w];
        e.write = () => true, e.end = () => e, e.emit = () => false, e.destroy?.();
      }
      this[$] = true, this.emit("abort", t), this.warn("TAR_ABORT", t, { recoverable: false });
    }
  }
  [Xs](t) {
    this[$i] += t.length;
    let e = this[$i] / this[le];
    return e > this.maxDecompressionRatio ? (this.abort(new Error(`max decompression ratio exceeded: ${e.toFixed(2)} > ${this.maxDecompressionRatio}`)), false) : true;
  }
  write(t, e, i) {
    if (typeof e == "function" && (i = e, e = void 0), typeof t == "string" && (t = Buffer.from(t, typeof e == "string" ? e : "utf8")), this[$]) return i?.(), false;
    if ((this[w] === void 0 || this.brotli === void 0 && this[w] === false) && t) {
      if (this[p] && (t = Buffer.concat([this[p], t]), this[p] = void 0), t.length < An) return this[p] = t, i?.(), true;
      for (let a = 0; this[w] === void 0 && a < Xi.length; a++) t[a] !== Xi[a] && (this[w] = false);
      let o = false;
      if (this[w] === false && this.zstd !== false) {
        o = true;
        for (let a = 0; a < qi.length; a++) if (t[a] !== qi[a]) {
          o = false;
          break;
        }
      }
      let h = this.brotli === void 0 && !o;
      if (this[w] === false && h) if (t.length < 512) if (this[ut]) this.brotli = true;
      else return this[p] = t, i?.(), true;
      else try {
        new F(t.subarray(0, 512)), this.brotli = false;
      } catch {
        this.brotli = true;
      }
      if (this[w] === void 0 || this[w] === false && (this.brotli || o)) {
        let a = this[ut];
        this[ut] = false, this[w] = this[w] === void 0 ? new Ue({}) : o ? new Ke({}) : new Ge({}), this[w].on("data", (c) => {
          this[Xs](c) && this[Xe](c);
        }), this[w].on("error", (c) => {
          this[$] || this.abort(c);
        }), this[w].on("end", () => {
          this[ut] = true, this[Xe]();
        }), this[Yt] = true, this[le] += t.length;
        let l = !!this[w][a ? "end" : "write"](t);
        return this[Yt] = false, i?.(), l;
      }
    }
    this[Yt] = true, this[w] ? (this[le] += t.length, this[w].write(t)) : this[Xe](t), this[Yt] = false;
    let n = this[st].length > 0 ? false : this[it] ? this[it].flowing : true;
    return !n && this[st].length === 0 && this[it]?.once("drain", () => this.emit("drain")), i?.(), n;
  }
  [Vi](t) {
    t && !this[$] && (this[p] = this[p] ? Buffer.concat([this[p], t]) : t);
  }
  [Qe]() {
    if (this[ut] && !this[Yi] && !this[$] && !this[ae]) {
      this[Yi] = true;
      let t = this[Nt];
      if (t?.blockRemain) {
        let e = this[p] ? this[p].length : 0;
        this.warn("TAR_BAD_ARCHIVE", `Truncated input (needed ${t.blockRemain} more bytes, only ${e} available)`, { entry: t }), this[p] && t.write(this[p]), t.end();
      }
      this[At](Je);
    }
  }
  [Xe](t) {
    if (this[ae] && t) this[Vi](t);
    else if (!t && !this[p]) this[Qe]();
    else if (t) {
      if (this[ae] = true, this[p]) {
        this[Vi](t);
        let e = this[p];
        this[p] = void 0, this[qe](e);
      } else this[qe](t);
      for (; this[p] && this[p]?.length >= 512 && !this[$] && !this[ti]; ) {
        let e = this[p];
        this[p] = void 0, this[qe](e);
      }
      this[ae] = false;
    }
    (!this[p] || this[ut]) && this[Qe]();
  }
  [qe](t) {
    let e = 0, i = t.length;
    for (; e + 512 <= i && !this[$] && !this[ti]; ) switch (this[B]) {
      case "begin":
      case "header":
        this[Vs](t, e), e += 512;
        break;
      case "ignore":
      case "body":
        e += this[Ki](t, e);
        break;
      case "meta":
        e += this[Ks](t, e);
        break;
      default:
        throw new Error("invalid state: " + this[B]);
    }
    e < i && (this[p] = this[p] ? Buffer.concat([t.subarray(e), this[p]]) : t.subarray(e));
  }
  end(t, e, i) {
    return typeof t == "function" && (i = t, e = void 0, t = void 0), typeof e == "function" && (i = e, e = void 0), typeof t == "string" && (t = Buffer.from(t, e)), i && this.once("finish", i), this[$] || (this[w] ? (t && (this[le] += t.length, this[w].write(t)), this[w].end()) : (this[ut] = true, (this.brotli === void 0 || this.zstd === void 0) && (t = t || Buffer.alloc(0)), t && this.write(t), this[Qe]())), this;
  }
};
var mt = (s3) => {
  let t = s3.length - 1, e = -1;
  for (; t > -1 && s3.charAt(t) === "/"; ) e = t, t--;
  return e === -1 ? s3 : s3.slice(0, e);
};
var vn = (s3) => {
  let t = s3.onReadEntry;
  s3.onReadEntry = t ? (e) => {
    t(e), e.resume();
  } : (e) => e.resume();
};
var Qi = (s3, t) => {
  let e = new Map(t.map((o) => [mt(o), true])), i = s3.filter, r = 100, n = (o, h = "", a = 0) => {
    if (a >= r) return e.set(o, false), false;
    let l = h || (0, import_path.parse)(o).root || ".", c;
    if (o === l) c = false;
    else {
      let d = e.get(o);
      c = d !== void 0 ? d : n((0, import_path.dirname)(o), l, a + 1);
    }
    return e.set(o, c), c;
  };
  s3.filter = i ? (o, h) => i(o, h) && n(mt(o)) : (o) => n(mt(o));
};
var Mn = (s3) => {
  let t = new rt(s3), e = s3.file, i;
  try {
    i = import_node_fs2.default.openSync(e, "r");
    let r = import_node_fs2.default.fstatSync(i), n = s3.maxReadSize || 16 * 1024 * 1024;
    if (r.size < n) {
      let o = Buffer.allocUnsafe(r.size), h = import_node_fs2.default.readSync(i, o, 0, r.size, 0);
      t.end(h === o.byteLength ? o : o.subarray(0, h));
    } else {
      let o = 0, h = Buffer.allocUnsafe(n);
      for (; o < r.size; ) {
        let a = import_node_fs2.default.readSync(i, h, 0, n, o);
        if (a === 0) break;
        o += a, t.write(h.subarray(0, a));
      }
      t.end();
    }
  } finally {
    if (typeof i == "number") try {
      import_node_fs2.default.closeSync(i);
    } catch {
    }
  }
};
var Bn = (s3, t) => {
  let e = new rt(s3), i = s3.maxReadSize || 16 * 1024 * 1024, r = s3.file;
  return new Promise((o, h) => {
    e.on("error", h), e.on("end", o), import_node_fs2.default.stat(r, (a, l) => {
      if (a) h(a);
      else {
        let c = new _t(r, { readSize: i, size: l.size });
        c.on("error", h), c.pipe(e);
      }
    });
  });
};
var Ct = K(Mn, Bn, (s3) => new rt(s3), (s3) => new rt(s3), (s3, t) => {
  t?.length && Qi(s3, t), s3.noResume || vn(s3);
});
var Ji = (s3, t, e) => (s3 &= 4095, e && (s3 = (s3 | 384) & -19), t && (s3 & 256 && (s3 |= 64), s3 & 32 && (s3 |= 8), s3 & 4 && (s3 |= 1)), s3);
var { isAbsolute: zn, parse: qs } = import_node_path5.win32;
var ce = (s3) => {
  let t = "", e = qs(s3);
  for (; zn(s3) || e.root; ) {
    let i = s3.charAt(0) === "/" && s3.slice(0, 4) !== "//?/" ? "/" : e.root;
    s3 = s3.slice(i.length), t += i, e = qs(s3);
  }
  return [t, s3];
};
var ei = ["|", "<", ">", "?", ":"];
var ji = ei.map((s3) => String.fromCodePoint(61440 + Number(s3.codePointAt(0))));
var Un = new Map(ei.map((s3, t) => [s3, ji[t]]));
var Hn = new Map(ji.map((s3, t) => [s3, ei[t]]));
var ts = (s3) => ei.reduce((t, e) => t.split(e).join(Un.get(e)), s3);
var Qs = (s3) => ji.reduce((t, e) => t.split(e).join(Hn.get(e)), s3);
var rr = (s3, t) => t ? (s3 = f(s3).replace(/^\.(\/|$)/, ""), mt(t) + "/" + s3) : f(s3);
var Wn = 16 * 1024 * 1024;
var tr = Symbol("process");
var er = Symbol("file");
var ir = Symbol("directory");
var is = Symbol("symlink");
var sr = Symbol("hardlink");
var fe = Symbol("header");
var ii = Symbol("read");
var ss = Symbol("lstat");
var si = Symbol("onlstat");
var rs = Symbol("onread");
var ns = Symbol("onreadlink");
var os = Symbol("openfile");
var hs = Symbol("onopenfile");
var pt = Symbol("close");
var ri = Symbol("mode");
var as = Symbol("awaitDrain");
var es = Symbol("ondrain");
var q = Symbol("prefix");
var de = class extends A {
  path;
  portable;
  myuid = process.getuid && process.getuid() || 0;
  myuser = process.env.USER || "";
  maxReadSize;
  linkCache;
  statCache;
  preservePaths;
  cwd;
  strict;
  mtime;
  noPax;
  noMtime;
  prefix;
  fd;
  blockLen = 0;
  blockRemain = 0;
  buf;
  pos = 0;
  remain = 0;
  length = 0;
  offset = 0;
  win32;
  absolute;
  header;
  type;
  linkpath;
  stat;
  onWriteEntry;
  #t = false;
  constructor(t, e = {}) {
    let i = se(e);
    super(), this.path = f(t), this.portable = !!i.portable, this.maxReadSize = i.maxReadSize || Wn, this.linkCache = i.linkCache || /* @__PURE__ */ new Map(), this.statCache = i.statCache || /* @__PURE__ */ new Map(), this.preservePaths = !!i.preservePaths, this.cwd = f(i.cwd || process.cwd()), this.strict = !!i.strict, this.noPax = !!i.noPax, this.noMtime = !!i.noMtime, this.mtime = i.mtime, this.prefix = i.prefix ? f(i.prefix) : void 0, this.onWriteEntry = i.onWriteEntry, typeof i.onwarn == "function" && this.on("warn", i.onwarn);
    let r = false;
    if (!this.preservePaths) {
      let [o, h] = ce(this.path);
      o && typeof h == "string" && (this.path = h, r = o);
    }
    this.win32 = !!i.win32 || process.platform === "win32", this.win32 && (this.path = Qs(this.path.replaceAll(/\\/g, "/")), t = t.replaceAll(/\\/g, "/")), this.absolute = f(i.absolute || import_path2.default.resolve(this.cwd, t)), this.path === "" && (this.path = "./"), r && this.warn("TAR_ENTRY_INFO", `stripping ${r} from absolute path`, { entry: this, path: r + this.path });
    let n = this.statCache.get(this.absolute);
    n ? this[si](n) : this[ss]();
  }
  warn(t, e, i = {}) {
    return Dt(this, t, e, i);
  }
  emit(t, ...e) {
    return t === "error" && (this.#t = true), super.emit(t, ...e);
  }
  [ss]() {
    import_fs3.default.lstat(this.absolute, (t, e) => {
      if (t) return this.emit("error", t);
      this[si](e);
    });
  }
  [si](t) {
    this.statCache.set(this.absolute, t), this.stat = t, t.isFile() || (t.size = 0), this.type = Gn(t), this.emit("stat", t), this[tr]();
  }
  [tr]() {
    switch (this.type) {
      case "File":
        return this[er]();
      case "Directory":
        return this[ir]();
      case "SymbolicLink":
        return this[is]();
      default:
        return this.end();
    }
  }
  [ri](t) {
    return Ji(t, this.type === "Directory", this.portable);
  }
  [q](t) {
    return rr(t, this.prefix);
  }
  [fe]() {
    if (!this.stat) throw new Error("cannot write header before stat");
    this.type === "Directory" && this.portable && (this.noMtime = true), this.onWriteEntry?.(this), this.header = new F({ path: this[q](this.path), linkpath: this.type === "Link" && this.linkpath !== void 0 ? this[q](this.linkpath) : this.linkpath, mode: this[ri](this.stat.mode), uid: this.portable ? void 0 : this.stat.uid, gid: this.portable ? void 0 : this.stat.gid, size: this.stat.size, mtime: this.noMtime ? void 0 : this.mtime || this.stat.mtime, type: this.type === "Unsupported" ? void 0 : this.type, uname: this.portable ? void 0 : this.stat.uid === this.myuid ? this.myuser : "", atime: this.portable ? void 0 : this.stat.atime, ctime: this.portable ? void 0 : this.stat.ctime }), this.header.encode() && !this.noPax && super.write(new ft({ atime: this.portable ? void 0 : this.header.atime, ctime: this.portable ? void 0 : this.header.ctime, gid: this.portable ? void 0 : this.header.gid, mtime: this.noMtime ? void 0 : this.mtime || this.header.mtime, path: this[q](this.path), linkpath: this.type === "Link" && this.linkpath !== void 0 ? this[q](this.linkpath) : this.linkpath, size: this.header.size, uid: this.portable ? void 0 : this.header.uid, uname: this.portable ? void 0 : this.header.uname, dev: this.portable ? void 0 : this.stat.dev, ino: this.portable ? void 0 : this.stat.ino, nlink: this.portable ? void 0 : this.stat.nlink }).encode());
    let t = this.header?.block;
    if (!t) throw new Error("failed to encode header");
    super.write(t);
  }
  [ir]() {
    if (!this.stat) throw new Error("cannot create directory entry without stat");
    this.path.slice(-1) !== "/" && (this.path += "/"), this.stat.size = 0, this[fe](), this.end();
  }
  [is]() {
    import_fs3.default.readlink(this.absolute, (t, e) => {
      if (t) return this.emit("error", t);
      this[ns](e);
    });
  }
  [ns](t) {
    this.linkpath = f(t), this[fe](), this.end();
  }
  [sr](t) {
    if (!this.stat) throw new Error("cannot create link entry without stat");
    this.type = "Link", this.linkpath = f(import_path2.default.relative(this.cwd, t)), this.stat.size = 0, this[fe](), this.end();
  }
  [er]() {
    if (!this.stat) throw new Error("cannot create file entry without stat");
    if (this.stat.nlink > 1) {
      let t = `${this.stat.dev}:${this.stat.ino}`, e = this.linkCache.get(t);
      if (e?.indexOf(this.cwd) === 0) return this[sr](e);
      this.linkCache.set(t, this.absolute);
    }
    if (this[fe](), this.stat.size === 0) return this.end();
    this[os]();
  }
  [os]() {
    import_fs3.default.open(this.absolute, "r", (t, e) => {
      if (t) return this.emit("error", t);
      this[hs](e);
    });
  }
  [hs](t) {
    if (this.fd = t, this.#t) return this[pt]();
    if (!this.stat) throw new Error("should stat before calling onopenfile");
    this.blockLen = 512 * Math.ceil(this.stat.size / 512), this.blockRemain = this.blockLen;
    let e = Math.min(this.blockLen, this.maxReadSize);
    this.buf = Buffer.allocUnsafe(e), this.offset = 0, this.pos = 0, this.remain = this.stat.size, this.length = this.buf.length, this[ii]();
  }
  [ii]() {
    let { fd: t, buf: e, offset: i, length: r, pos: n } = this;
    if (t === void 0 || e === void 0) throw new Error("cannot read file without first opening");
    import_fs3.default.read(t, e, i, r, n, (o, h) => {
      if (o) return this[pt](() => this.emit("error", o));
      this[rs](h);
    });
  }
  [pt](t = () => {
  }) {
    this.fd !== void 0 && import_fs3.default.close(this.fd, t);
  }
  [rs](t) {
    if (t <= 0 && this.remain > 0) {
      let r = Object.assign(new Error("encountered unexpected EOF"), { path: this.absolute, syscall: "read", code: "EOF" });
      return this[pt](() => this.emit("error", r));
    }
    if (t > this.remain) {
      let r = Object.assign(new Error("did not encounter expected EOF"), { path: this.absolute, syscall: "read", code: "EOF" });
      return this[pt](() => this.emit("error", r));
    }
    if (!this.buf) throw new Error("should have created buffer prior to reading");
    if (t === this.remain) for (let r = t; r < this.length && t < this.blockRemain; r++) this.buf[r + this.offset] = 0, t++, this.remain++;
    let e = this.offset === 0 && t === this.buf.length ? this.buf : this.buf.subarray(this.offset, this.offset + t);
    this.write(e) ? this[es]() : this[as](() => this[es]());
  }
  [as](t) {
    this.once("drain", t);
  }
  write(t, e, i) {
    if (typeof e == "function" && (i = e, e = void 0), typeof t == "string" && (t = Buffer.from(t, typeof e == "string" ? e : "utf8")), this.blockRemain < t.length) {
      let r = Object.assign(new Error("writing more data than expected"), { path: this.absolute });
      return this.emit("error", r);
    }
    return this.remain -= t.length, this.blockRemain -= t.length, this.pos += t.length, this.offset += t.length, super.write(t, null, i);
  }
  [es]() {
    if (!this.remain) return this.blockRemain && super.write(Buffer.alloc(this.blockRemain)), this[pt]((t) => t ? this.emit("error", t) : this.end());
    if (!this.buf) throw new Error("buffer lost somehow in ONDRAIN");
    this.offset >= this.length && (this.buf = Buffer.allocUnsafe(Math.min(this.blockRemain, this.buf.length)), this.offset = 0), this.length = this.buf.length - this.offset, this[ii]();
  }
};
var ni = class extends de {
  sync = true;
  [ss]() {
    this[si](import_fs3.default.lstatSync(this.absolute));
  }
  [is]() {
    this[ns](import_fs3.default.readlinkSync(this.absolute));
  }
  [os]() {
    this[hs](import_fs3.default.openSync(this.absolute, "r"));
  }
  [ii]() {
    let t = true;
    try {
      let { fd: e, buf: i, offset: r, length: n, pos: o } = this;
      if (e === void 0 || i === void 0) throw new Error("fd and buf must be set in READ method");
      let h = import_fs3.default.readSync(e, i, r, n, o);
      this[rs](h), t = false;
    } finally {
      if (t) try {
        this[pt](() => {
        });
      } catch {
      }
    }
  }
  [as](t) {
    t();
  }
  [pt](t = () => {
  }) {
    this.fd !== void 0 && import_fs3.default.closeSync(this.fd), t();
  }
};
var oi = class extends A {
  blockLen = 0;
  blockRemain = 0;
  buf = 0;
  pos = 0;
  remain = 0;
  length = 0;
  preservePaths;
  portable;
  strict;
  noPax;
  noMtime;
  readEntry;
  type;
  prefix;
  path;
  mode;
  uid;
  gid;
  uname;
  gname;
  header;
  mtime;
  atime;
  ctime;
  linkpath;
  size;
  onWriteEntry;
  warn(t, e, i = {}) {
    return Dt(this, t, e, i);
  }
  constructor(t, e = {}) {
    let i = se(e);
    super(), this.preservePaths = !!i.preservePaths, this.portable = !!i.portable, this.strict = !!i.strict, this.noPax = !!i.noPax, this.noMtime = !!i.noMtime, this.onWriteEntry = i.onWriteEntry, this.readEntry = t;
    let { type: r } = t;
    if (r === "Unsupported") throw new Error("writing entry that should be ignored");
    this.type = r, this.type === "Directory" && this.portable && (this.noMtime = true), this.prefix = i.prefix, this.path = f(t.path), this.mode = t.mode !== void 0 ? this[ri](t.mode) : void 0, this.uid = this.portable ? void 0 : t.uid, this.gid = this.portable ? void 0 : t.gid, this.uname = this.portable ? void 0 : t.uname, this.gname = this.portable ? void 0 : t.gname, this.size = t.size, this.mtime = this.noMtime ? void 0 : i.mtime || t.mtime, this.atime = this.portable ? void 0 : t.atime, this.ctime = this.portable ? void 0 : t.ctime, this.linkpath = t.linkpath !== void 0 ? f(t.linkpath) : void 0, typeof i.onwarn == "function" && this.on("warn", i.onwarn);
    let n = false;
    if (!this.preservePaths) {
      let [h, a] = ce(this.path);
      h && typeof a == "string" && (this.path = a, n = h);
    }
    this.remain = t.size, this.blockRemain = t.startBlockSize, this.onWriteEntry?.(this), this.header = new F({ path: this[q](this.path), linkpath: this.type === "Link" && this.linkpath !== void 0 ? this[q](this.linkpath) : this.linkpath, mode: this.mode, uid: this.portable ? void 0 : this.uid, gid: this.portable ? void 0 : this.gid, size: this.size, mtime: this.noMtime ? void 0 : this.mtime, type: this.type, uname: this.portable ? void 0 : this.uname, atime: this.portable ? void 0 : this.atime, ctime: this.portable ? void 0 : this.ctime }), n && this.warn("TAR_ENTRY_INFO", `stripping ${n} from absolute path`, { entry: this, path: n + this.path }), this.header.encode() && !this.noPax && super.write(new ft({ atime: this.portable ? void 0 : this.atime, ctime: this.portable ? void 0 : this.ctime, gid: this.portable ? void 0 : this.gid, mtime: this.noMtime ? void 0 : this.mtime, path: this[q](this.path), linkpath: this.type === "Link" && this.linkpath !== void 0 ? this[q](this.linkpath) : this.linkpath, size: this.size, uid: this.portable ? void 0 : this.uid, uname: this.portable ? void 0 : this.uname, dev: this.portable ? void 0 : this.readEntry.dev, ino: this.portable ? void 0 : this.readEntry.ino, nlink: this.portable ? void 0 : this.readEntry.nlink }).encode());
    let o = this.header?.block;
    if (!o) throw new Error("failed to encode header");
    super.write(o), t.pipe(this);
  }
  [q](t) {
    return rr(t, this.prefix);
  }
  [ri](t) {
    return Ji(t, this.type === "Directory", this.portable);
  }
  write(t, e, i) {
    typeof e == "function" && (i = e, e = void 0), typeof t == "string" && (t = Buffer.from(t, typeof e == "string" ? e : "utf8"));
    let r = t.length;
    if (r > this.blockRemain) throw new Error("writing more to entry than is appropriate");
    return this.blockRemain -= r, super.write(t, i);
  }
  end(t, e, i) {
    return this.blockRemain && super.write(Buffer.alloc(this.blockRemain)), typeof t == "function" && (i = t, e = void 0, t = void 0), typeof e == "function" && (i = e, e = void 0), typeof t == "string" && (t = Buffer.from(t, e ?? "utf8")), i && this.once("finish", i), t ? super.end(t, i) : super.end(i), this;
  }
};
var Gn = (s3) => s3.isFile() ? "File" : s3.isDirectory() ? "Directory" : s3.isSymbolicLink() ? "SymbolicLink" : "Unsupported";
var hi = class s2 {
  tail;
  head;
  length = 0;
  static create(t = []) {
    return new s2(t);
  }
  constructor(t = []) {
    for (let e of t) this.push(e);
  }
  *[Symbol.iterator]() {
    for (let t = this.head; t; t = t.next) yield t.value;
  }
  removeNode(t) {
    if (t.list !== this) throw new Error("removing node which does not belong to this list");
    let e = t.next, i = t.prev;
    return e && (e.prev = i), i && (i.next = e), t === this.head && (this.head = e), t === this.tail && (this.tail = i), this.length--, t.next = void 0, t.prev = void 0, t.list = void 0, e;
  }
  unshiftNode(t) {
    if (t === this.head) return;
    t.list && t.list.removeNode(t);
    let e = this.head;
    t.list = this, t.next = e, e && (e.prev = t), this.head = t, this.tail || (this.tail = t), this.length++;
  }
  pushNode(t) {
    if (t === this.tail) return;
    t.list && t.list.removeNode(t);
    let e = this.tail;
    t.list = this, t.prev = e, e && (e.next = t), this.tail = t, this.head || (this.head = t), this.length++;
  }
  push(...t) {
    for (let e = 0, i = t.length; e < i; e++) Yn(this, t[e]);
    return this.length;
  }
  unshift(...t) {
    for (var e = 0, i = t.length; e < i; e++) Kn(this, t[e]);
    return this.length;
  }
  pop() {
    if (!this.tail) return;
    let t = this.tail.value, e = this.tail;
    return this.tail = this.tail.prev, this.tail ? this.tail.next = void 0 : this.head = void 0, e.list = void 0, this.length--, t;
  }
  shift() {
    if (!this.head) return;
    let t = this.head.value, e = this.head;
    return this.head = this.head.next, this.head ? this.head.prev = void 0 : this.tail = void 0, e.list = void 0, this.length--, t;
  }
  forEach(t, e) {
    e = e || this;
    for (let i = this.head, r = 0; i; r++) t.call(e, i.value, r, this), i = i.next;
  }
  forEachReverse(t, e) {
    e = e || this;
    for (let i = this.tail, r = this.length - 1; i; r--) t.call(e, i.value, r, this), i = i.prev;
  }
  get(t) {
    let e = 0, i = this.head;
    for (; i && e < t; e++) i = i.next;
    if (e === t && i) return i.value;
  }
  getReverse(t) {
    let e = 0, i = this.tail;
    for (; i && e < t; e++) i = i.prev;
    if (e === t && i) return i.value;
  }
  map(t, e) {
    e = e || this;
    let i = new s2();
    for (let r = this.head; r; ) i.push(t.call(e, r.value, this)), r = r.next;
    return i;
  }
  mapReverse(t, e) {
    e = e || this;
    var i = new s2();
    for (let r = this.tail; r; ) i.push(t.call(e, r.value, this)), r = r.prev;
    return i;
  }
  reduce(t, e) {
    let i, r = this.head;
    if (arguments.length > 1) i = e;
    else if (this.head) r = this.head.next, i = this.head.value;
    else throw new TypeError("Reduce of empty list with no initial value");
    for (var n = 0; r; n++) i = t(i, r.value, n), r = r.next;
    return i;
  }
  reduceReverse(t, e) {
    let i, r = this.tail;
    if (arguments.length > 1) i = e;
    else if (this.tail) r = this.tail.prev, i = this.tail.value;
    else throw new TypeError("Reduce of empty list with no initial value");
    for (let n = this.length - 1; r; n--) i = t(i, r.value, n), r = r.prev;
    return i;
  }
  toArray() {
    let t = new Array(this.length);
    for (let e = 0, i = this.head; i; e++) t[e] = i.value, i = i.next;
    return t;
  }
  toArrayReverse() {
    let t = new Array(this.length);
    for (let e = 0, i = this.tail; i; e++) t[e] = i.value, i = i.prev;
    return t;
  }
  slice(t = 0, e = this.length) {
    e < 0 && (e += this.length), t < 0 && (t += this.length);
    let i = new s2();
    if (e < t || e < 0) return i;
    t < 0 && (t = 0), e > this.length && (e = this.length);
    let r = this.head, n = 0;
    for (n = 0; r && n < t; n++) r = r.next;
    for (; r && n < e; n++, r = r.next) i.push(r.value);
    return i;
  }
  sliceReverse(t = 0, e = this.length) {
    e < 0 && (e += this.length), t < 0 && (t += this.length);
    let i = new s2();
    if (e < t || e < 0) return i;
    t < 0 && (t = 0), e > this.length && (e = this.length);
    let r = this.length, n = this.tail;
    for (; n && r > e; r--) n = n.prev;
    for (; n && r > t; r--, n = n.prev) i.push(n.value);
    return i;
  }
  splice(t, e = 0, ...i) {
    t > this.length && (t = this.length - 1), t < 0 && (t = this.length + t);
    let r = this.head;
    for (let o = 0; r && o < t; o++) r = r.next;
    let n = [];
    for (let o = 0; r && o < e; o++) n.push(r.value), r = this.removeNode(r);
    r ? r !== this.tail && (r = r.prev) : r = this.tail;
    for (let o of i) r = Zn(this, r, o);
    return n;
  }
  reverse() {
    let t = this.head, e = this.tail;
    for (let i = t; i; i = i.prev) {
      let r = i.prev;
      i.prev = i.next, i.next = r;
    }
    return this.head = e, this.tail = t, this;
  }
};
function Zn(s3, t, e) {
  let i = t, r = t ? t.next : s3.head, n = new ue(e, i, r, s3);
  return n.next === void 0 && (s3.tail = n), n.prev === void 0 && (s3.head = n), s3.length++, n;
}
function Yn(s3, t) {
  s3.tail = new ue(t, s3.tail, void 0, s3), s3.head || (s3.head = s3.tail), s3.length++;
}
function Kn(s3, t) {
  s3.head = new ue(t, void 0, s3.head, s3), s3.tail || (s3.tail = s3.head), s3.length++;
}
var ue = class {
  list;
  next;
  prev;
  value;
  constructor(t, e, i, r) {
    this.list = r, this.value = t, e ? (e.next = this, this.prev = e) : this.prev = void 0, i ? (i.prev = this, this.next = i) : this.next = void 0;
  }
};
var pi = class {
  path;
  absolute;
  entry;
  stat;
  readdir;
  pending = false;
  pendingLink = false;
  ignore = false;
  piped = false;
  constructor(t, e) {
    this.path = t || "./", this.absolute = e;
  }
};
var nr = Buffer.alloc(1024);
var li = Symbol("onStat");
var me = Symbol("ended");
var W = Symbol("queue");
var pe = Symbol("pendingLinks");
var Et = Symbol("current");
var Ft = Symbol("process");
var Ee = Symbol("processing");
var ai = Symbol("processJob");
var G = Symbol("jobs");
var ls = Symbol("jobDone");
var ci = Symbol("addFSEntry");
var or = Symbol("addTarEntry");
var ds = Symbol("stat");
var us = Symbol("readdir");
var fi = Symbol("onreaddir");
var di = Symbol("pipe");
var hr = Symbol("entry");
var cs = Symbol("entryOpt");
var ui = Symbol("writeEntryClass");
var lr = Symbol("write");
var fs = Symbol("ondrain");
var wt = class extends A {
  sync = false;
  opt;
  cwd;
  maxReadSize;
  preservePaths;
  strict;
  noPax;
  prefix;
  linkCache;
  statCache;
  file;
  portable;
  zip;
  readdirCache;
  noDirRecurse;
  follow;
  noMtime;
  mtime;
  filter;
  jobs;
  [ui];
  onWriteEntry;
  [W];
  [pe] = /* @__PURE__ */ new Map();
  [G] = 0;
  [Ee] = false;
  [me] = false;
  constructor(t = {}) {
    if (super(), this.opt = t, this.file = t.file || "", this.cwd = t.cwd || process.cwd(), this.maxReadSize = t.maxReadSize, this.preservePaths = !!t.preservePaths, this.strict = !!t.strict, this.noPax = !!t.noPax, this.prefix = f(t.prefix || ""), this.linkCache = t.linkCache || /* @__PURE__ */ new Map(), this.statCache = t.statCache || /* @__PURE__ */ new Map(), this.readdirCache = t.readdirCache || /* @__PURE__ */ new Map(), this.onWriteEntry = t.onWriteEntry, this[ui] = de, typeof t.onwarn == "function" && this.on("warn", t.onwarn), this.portable = !!t.portable, t.gzip || t.brotli || t.zstd) {
      if ((t.gzip ? 1 : 0) + (t.brotli ? 1 : 0) + (t.zstd ? 1 : 0) > 1) throw new TypeError("gzip, brotli, zstd are mutually exclusive");
      if (t.gzip && (typeof t.gzip != "object" && (t.gzip = {}), this.portable && (t.gzip.portable = true), this.zip = new ze(t.gzip)), t.brotli && (typeof t.brotli != "object" && (t.brotli = {}), this.zip = new We(t.brotli)), t.zstd && (typeof t.zstd != "object" && (t.zstd = {}), this.zip = new Ye(t.zstd)), !this.zip) throw new Error("impossible");
      let e = this.zip;
      e.on("data", (i) => super.write(i)), e.on("end", () => super.end()), e.on("drain", () => this[fs]()), this.on("resume", () => e.resume());
    } else this.on("drain", this[fs]);
    this.noDirRecurse = !!t.noDirRecurse, this.follow = !!t.follow, this.noMtime = !!t.noMtime, t.mtime && (this.mtime = t.mtime), this.filter = typeof t.filter == "function" ? t.filter : () => true, this[W] = new hi(), this[G] = 0, this.jobs = Number(t.jobs) || 4, this[Ee] = false, this[me] = false;
  }
  [lr](t) {
    return super.write(t);
  }
  add(t) {
    return this.write(t), this;
  }
  end(t, e, i) {
    return typeof t == "function" && (i = t, t = void 0), typeof e == "function" && (i = e, e = void 0), t && this.add(t), this[me] = true, this[Ft](), i && i(), this;
  }
  write(t) {
    if (this[me]) throw new Error("write after end");
    return typeof t == "string" ? this[ci](t) : this[or](t), this.flowing;
  }
  [or](t) {
    let e = f(import_path3.default.resolve(this.cwd, t.path));
    if (!this.filter(t.path, t)) t.resume();
    else {
      let i = new pi(t.path, e);
      i.entry = new oi(t, this[cs](i)), i.entry.on("end", () => this[ls](i)), this[G] += 1, this[W].push(i);
    }
    this[Ft]();
  }
  [ci](t) {
    let e = f(import_path3.default.resolve(this.cwd, t));
    this[W].push(new pi(t, e)), this[Ft]();
  }
  [ds](t) {
    t.pending = true, this[G] += 1;
    let e = this.follow ? "stat" : "lstat";
    import_fs2.default[e](t.absolute, (i, r) => {
      t.pending = false, this[G] -= 1, i ? this.emit("error", i) : this[li](t, r);
    });
  }
  [li](t, e) {
    if (this.statCache.set(t.absolute, e), t.stat = e, !this.filter(t.path, e)) t.ignore = true;
    else if (e.isFile() && e.nlink > 1 && !this.linkCache.get(`${e.dev}:${e.ino}`) && !this.sync) if (t === this[Et]) this[ai](t);
    else {
      let i = `${e.dev}:${e.ino}`, r = this[pe].get(i);
      r ? r.push(t) : this[pe].set(i, [t]), t.pendingLink = true, t.pending = true;
    }
    this[Ft]();
  }
  [us](t) {
    t.pending = true, this[G] += 1, import_fs2.default.readdir(t.absolute, (e, i) => {
      if (t.pending = false, this[G] -= 1, e) return this.emit("error", e);
      this[fi](t, i);
    });
  }
  [fi](t, e) {
    this.readdirCache.set(t.absolute, e), t.readdir = e, this[Ft]();
  }
  [Ft]() {
    if (!this[Ee]) {
      this[Ee] = true;
      for (let t = this[W].head; t && this[G] < this.jobs; t = t.next) if (this[ai](t.value), t.value.ignore) {
        let e = t.next;
        this[W].removeNode(t), t.next = e;
      }
      this[Ee] = false, this[me] && this[W].length === 0 && this[G] === 0 && (this.zip ? this.zip.end(nr) : (super.write(nr), super.end()));
    }
  }
  get [Et]() {
    return this[W] && this[W].head && this[W].head.value;
  }
  [ls](t) {
    this[W].shift(), this[G] -= 1;
    let { stat: e } = t;
    if (e && e.isFile() && e.nlink > 1) {
      let i = `${e.dev}:${e.ino}`, r = this[pe].get(i);
      if (r) {
        this[pe].delete(i);
        for (let n of r) n.pending = false, this[ai](n);
      }
    }
    this[Ft]();
  }
  [ai](t) {
    if (t.pending && t.pendingLink && t === this[Et] && (t.pending = false, t.pendingLink = false), !t.pending) {
      if (t.entry) {
        t === this[Et] && !t.piped && this[di](t);
        return;
      }
      if (!t.stat) {
        let e = this.statCache.get(t.absolute);
        e ? this[li](t, e) : this[ds](t);
      }
      if (t.stat && !t.ignore) {
        if (!this.noDirRecurse && t.stat.isDirectory() && !t.readdir) {
          let e = this.readdirCache.get(t.absolute);
          if (e ? this[fi](t, e) : this[us](t), !t.readdir) return;
        }
        if (t.entry = this[hr](t), !t.entry) {
          t.ignore = true;
          return;
        }
        t === this[Et] && !t.piped && this[di](t);
      }
    }
  }
  [cs](t) {
    return { onwarn: (e, i, r) => this.warn(e, i, r), noPax: this.noPax, cwd: this.cwd, absolute: t.absolute, preservePaths: this.preservePaths, maxReadSize: this.maxReadSize, strict: this.strict, portable: this.portable, linkCache: this.linkCache, statCache: this.statCache, noMtime: this.noMtime, mtime: this.mtime, prefix: this.prefix, onWriteEntry: this.onWriteEntry };
  }
  [hr](t) {
    this[G] += 1;
    try {
      return new this[ui](t.path, this[cs](t)).on("end", () => this[ls](t)).on("error", (i) => this.emit("error", i));
    } catch (e) {
      this.emit("error", e);
    }
  }
  [fs]() {
    this[Et] && this[Et].entry && this[Et].entry.resume();
  }
  [di](t) {
    t.piped = true, t.readdir && t.readdir.forEach((r) => {
      let n = t.path, o = n === "./" ? "" : n.replace(/\/*$/, "/");
      this[ci](o + r);
    });
    let e = t.entry, i = this.zip;
    if (!e) throw new Error("cannot pipe without source");
    i ? e.on("data", (r) => {
      i.write(r) || e.pause();
    }) : e.on("data", (r) => {
      super.write(r) || e.pause();
    });
  }
  pause() {
    return this.zip && this.zip.pause(), super.pause();
  }
  warn(t, e, i = {}) {
    Dt(this, t, e, i);
  }
};
var kt = class extends wt {
  sync = true;
  constructor(t) {
    super(t), this[ui] = ni;
  }
  pause() {
  }
  resume() {
  }
  [ds](t) {
    let e = this.follow ? "statSync" : "lstatSync";
    this[li](t, import_fs2.default[e](t.absolute));
  }
  [us](t) {
    this[fi](t, import_fs2.default.readdirSync(t.absolute));
  }
  [di](t) {
    let e = t.entry, i = this.zip;
    if (t.readdir && t.readdir.forEach((r) => {
      let n = t.path, o = n === "./" ? "" : n.replace(/\/*$/, "/");
      this[ci](o + r);
    }), !e) throw new Error("Cannot pipe without source");
    i ? e.on("data", (r) => {
      i.write(r);
    }) : e.on("data", (r) => {
      super[lr](r);
    });
  }
};
var Vn = (s3, t) => {
  let e = new kt(s3), i = new Wt(s3.file, { mode: s3.mode || 438 });
  e.pipe(i), fr(e, t);
};
var $n = (s3, t) => {
  let e = new wt(s3), i = new et(s3.file, { mode: s3.mode || 438 });
  e.pipe(i);
  let r = new Promise((n, o) => {
    i.on("error", o), i.on("close", n), e.on("error", o);
  });
  return dr(e, t).catch((n) => e.emit("error", n)), r;
};
var fr = (s3, t) => {
  t.forEach((e) => {
    e.charAt(0) === "@" ? Ct({ file: import_node_path2.default.resolve(s3.cwd, e.slice(1)), sync: true, noResume: true, onReadEntry: (i) => s3.add(i) }) : s3.add(e);
  }), s3.end();
};
var dr = async (s3, t) => {
  for (let e of t) e.charAt(0) === "@" ? await Ct({ file: import_node_path2.default.resolve(String(s3.cwd), e.slice(1)), noResume: true, onReadEntry: (i) => {
    s3.add(i);
  } }) : s3.add(e);
  s3.end();
};
var Xn = (s3, t) => {
  let e = new kt(s3);
  return fr(e, t), e;
};
var qn = (s3, t) => {
  let e = new wt(s3);
  return dr(e, t).catch((i) => e.emit("error", i)), e;
};
var Qn = K(Vn, $n, Xn, qn, (s3, t) => {
  if (!t?.length) throw new TypeError("no paths specified to add to archive");
});
var Jn = process.env.__FAKE_PLATFORM__ || process.platform;
var Er = Jn === "win32";
var { O_CREAT: wr, O_NOFOLLOW: ur, O_TRUNC: Sr, O_WRONLY: yr } = import_fs4.default.constants;
var Rr = Number(process.env.__FAKE_FS_O_FILENAME__) || import_fs4.default.constants.UV_FS_O_FILEMAP || 0;
var jn = Er && !!Rr;
var to = 512 * 1024;
var eo = Rr | Sr | wr | yr;
var mr = !Er && typeof ur == "number" ? ur | Sr | wr | yr : null;
var ms = mr !== null ? () => mr : jn ? (s3) => s3 < to ? eo : "w" : () => "w";
var ps = (s3, t, e) => {
  try {
    return import_node_fs5.default.lchownSync(s3, t, e);
  } catch (i) {
    if (i?.code !== "ENOENT") throw i;
  }
};
var Ei = (s3, t, e, i) => {
  import_node_fs5.default.lchown(s3, t, e, (r) => {
    i(r && r?.code !== "ENOENT" ? r : null);
  });
};
var io = (s3, t, e, i, r) => {
  if (t.isDirectory()) Es(import_node_path7.default.resolve(s3, t.name), e, i, (n) => {
    if (n) return r(n);
    let o = import_node_path7.default.resolve(s3, t.name);
    Ei(o, e, i, r);
  });
  else {
    let n = import_node_path7.default.resolve(s3, t.name);
    Ei(n, e, i, r);
  }
};
var Es = (s3, t, e, i) => {
  import_node_fs5.default.readdir(s3, { withFileTypes: true }, (r, n) => {
    if (r) {
      if (r.code === "ENOENT") return i();
      if (r.code !== "ENOTDIR" && r.code !== "ENOTSUP") return i(r);
    }
    if (r || !n.length) return Ei(s3, t, e, i);
    let o = n.length, h = null, a = (l) => {
      if (!h) {
        if (l) return i(h = l);
        if (--o === 0) return Ei(s3, t, e, i);
      }
    };
    for (let l of n) io(s3, l, t, e, a);
  });
};
var so = (s3, t, e, i) => {
  t.isDirectory() && ws(import_node_path7.default.resolve(s3, t.name), e, i), ps(import_node_path7.default.resolve(s3, t.name), e, i);
};
var ws = (s3, t, e) => {
  let i;
  try {
    i = import_node_fs5.default.readdirSync(s3, { withFileTypes: true });
  } catch (r) {
    let n = r;
    if (n?.code === "ENOENT") return;
    if (n?.code === "ENOTDIR" || n?.code === "ENOTSUP") return ps(s3, t, e);
    throw n;
  }
  for (let r of i) so(s3, r, t, e);
  return ps(s3, t, e);
};
var Se = class extends Error {
  path;
  code;
  syscall = "chdir";
  constructor(t, e) {
    super(`${e}: Cannot cd into '${t}'`), this.path = t, this.code = e;
  }
  get name() {
    return "CwdError";
  }
};
var St = class extends Error {
  path;
  symlink;
  syscall = "symlink";
  code = "TAR_SYMLINK_ERROR";
  constructor(t, e) {
    super("TAR_SYMLINK_ERROR: Cannot extract through symbolic link"), this.symlink = t, this.path = e;
  }
  get name() {
    return "SymlinkError";
  }
};
var no = (s3, t) => {
  import_node_fs6.default.stat(s3, (e, i) => {
    (e || !i.isDirectory()) && (e = new Se(s3, e?.code || "ENOTDIR")), t(e);
  });
};
var gr = (s3, t, e) => {
  s3 = f(s3);
  let i = t.umask ?? 18, r = t.mode | 448, n = (r & i) !== 0, o = t.uid, h = t.gid, a = typeof o == "number" && typeof h == "number" && (o !== t.processUid || h !== t.processGid), l = t.preserve, c = t.unlink, d = f(t.cwd), y = (E, x) => {
    E ? e(E) : x && a ? Es(x, o, h, (Le) => y(Le)) : n ? import_node_fs6.default.chmod(s3, r, e) : e();
  };
  if (s3 === d) return no(s3, y);
  if (l) return import_promises.default.mkdir(s3, { mode: r, recursive: true }).then((E) => y(null, E ?? void 0), y);
  let D = f(import_node_path8.default.relative(d, s3)).split("/");
  Ss(d, D, r, c, d, void 0, y);
};
var Ss = (s3, t, e, i, r, n, o) => {
  if (t.length === 0) return o(null, n);
  let h = t.shift(), a = f(import_node_path8.default.resolve(s3 + "/" + h));
  import_node_fs6.default.mkdir(a, e, br(a, t, e, i, r, n, o));
};
var br = (s3, t, e, i, r, n, o) => (h) => {
  h ? import_node_fs6.default.lstat(s3, (a, l) => {
    if (a) a.path = a.path && f(a.path), o(a);
    else if (l.isDirectory()) Ss(s3, t, e, i, r, n, o);
    else if (i) import_node_fs6.default.unlink(s3, (c) => {
      if (c) return o(c);
      import_node_fs6.default.mkdir(s3, e, br(s3, t, e, i, r, n, o));
    });
    else {
      if (l.isSymbolicLink()) return o(new St(s3, s3 + "/" + t.join("/")));
      o(h);
    }
  }) : (n = n || s3, Ss(s3, t, e, i, r, n, o));
};
var oo = (s3) => {
  let t = false, e;
  try {
    t = import_node_fs6.default.statSync(s3).isDirectory();
  } catch (i) {
    e = i?.code;
  } finally {
    if (!t) throw new Se(s3, e ?? "ENOTDIR");
  }
};
var _r = (s3, t) => {
  s3 = f(s3);
  let e = t.umask ?? 18, i = t.mode | 448, r = (i & e) !== 0, n = t.uid, o = t.gid, h = typeof n == "number" && typeof o == "number" && (n !== t.processUid || o !== t.processGid), a = t.preserve, l = t.unlink, c = f(t.cwd), d = (E) => {
    E && h && ws(E, n, o), r && import_node_fs6.default.chmodSync(s3, i);
  };
  if (s3 === c) return oo(c), d();
  if (a) return d(import_node_fs6.default.mkdirSync(s3, { mode: i, recursive: true }) ?? void 0);
  let T = f(import_node_path8.default.relative(c, s3)).split("/"), D;
  for (let E = T.shift(), x = c; E && (x += "/" + E); E = T.shift()) {
    x = f(import_node_path8.default.resolve(x));
    try {
      import_node_fs6.default.mkdirSync(x, i), D = D || x;
    } catch {
      let Le = import_node_fs6.default.lstatSync(x);
      if (Le.isDirectory()) continue;
      if (l) {
        import_node_fs6.default.unlinkSync(x), import_node_fs6.default.mkdirSync(x, i), D = D || x;
        continue;
      } else if (Le.isSymbolicLink()) return new St(x, x + "/" + T.join("/"));
    }
  }
  return d(D);
};
var ys = /* @__PURE__ */ Object.create(null);
var Or = 1e4;
var Vt = /* @__PURE__ */ new Set();
var Tr = (s3) => {
  Vt.has(s3) ? Vt.delete(s3) : ys[s3] = s3.normalize("NFD").toLocaleLowerCase("en").toLocaleUpperCase("en"), Vt.add(s3);
  let t = ys[s3], e = Vt.size - Or;
  if (e > Or / 10) {
    for (let i of Vt) if (Vt.delete(i), delete ys[i], --e <= 0) break;
  }
  return t;
};
var ho = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform;
var ao = ho === "win32";
var lo = (s3) => s3.split("/").slice(0, -1).reduce((e, i) => {
  let r = e.at(-1);
  return r !== void 0 && (i = (0, import_node_path9.join)(r, i)), e.push(i || "/"), e;
}, []);
var yi = class {
  #t = /* @__PURE__ */ new Map();
  #i = /* @__PURE__ */ new Map();
  #s = /* @__PURE__ */ new Set();
  reserve(t, e) {
    t = ao ? ["win32 parallelization disabled"] : t.map((r) => mt((0, import_node_path9.join)(Tr(r))));
    let i = new Set(t.map((r) => lo(r)).reduce((r, n) => r.concat(n)));
    this.#i.set(e, { dirs: i, paths: t });
    for (let r of t) {
      let n = this.#t.get(r);
      n ? n.push(e) : this.#t.set(r, [e]);
    }
    for (let r of i) {
      let n = this.#t.get(r);
      if (!n) this.#t.set(r, [/* @__PURE__ */ new Set([e])]);
      else {
        let o = n.at(-1);
        o instanceof Set ? o.add(e) : n.push(/* @__PURE__ */ new Set([e]));
      }
    }
    return this.#r(e);
  }
  #n(t) {
    let e = this.#i.get(t);
    if (!e) throw new Error("function does not have any path reservations");
    return { paths: e.paths.map((i) => this.#t.get(i)), dirs: [...e.dirs].map((i) => this.#t.get(i)) };
  }
  check(t) {
    let { paths: e, dirs: i } = this.#n(t);
    return e.every((r) => r && r[0] === t) && i.every((r) => r && r[0] instanceof Set && r[0].has(t));
  }
  #r(t) {
    return this.#s.has(t) || !this.check(t) ? false : (this.#s.add(t), t(() => this.#e(t)), true);
  }
  #e(t) {
    if (!this.#s.has(t)) return false;
    let e = this.#i.get(t);
    if (!e) throw new Error("invalid reservation");
    let { paths: i, dirs: r } = e, n = /* @__PURE__ */ new Set();
    for (let o of i) {
      let h = this.#t.get(o);
      if (!h || h?.[0] !== t) continue;
      let a = h[1];
      if (!a) {
        this.#t.delete(o);
        continue;
      }
      if (h.shift(), typeof a == "function") n.add(a);
      else for (let l of a) n.add(l);
    }
    for (let o of r) {
      let h = this.#t.get(o), a = h?.[0];
      if (!(!h || !(a instanceof Set))) if (a.size === 1 && h.length === 1) {
        this.#t.delete(o);
        continue;
      } else if (a.size === 1) {
        h.shift();
        let l = h[0];
        typeof l == "function" && n.add(l);
      } else a.delete(t);
    }
    return this.#s.delete(t), n.forEach((o) => this.#r(o)), true;
  }
};
var Lr = () => process.umask();
var Dr = Symbol("onEntry");
var _s = Symbol("checkFs");
var Nr = Symbol("checkFs2");
var Os = Symbol("isReusable");
var P = Symbol("makeFs");
var Ts = Symbol("file");
var xs = Symbol("directory");
var gi = Symbol("link");
var Ar = Symbol("symlink");
var Ir = Symbol("hardlink");
var Re = Symbol("ensureNoSymlink");
var Cr = Symbol("unsupported");
var Fr = Symbol("checkPath");
var Rs = Symbol("stripAbsolutePath");
var yt = Symbol("mkdir");
var O = Symbol("onError");
var Ri = Symbol("pending");
var kr = Symbol("pend");
var $t = Symbol("unpend");
var gs = Symbol("ended");
var bs = Symbol("maybeClose");
var Ls = Symbol("skip");
var ge = Symbol("doChown");
var be = Symbol("uid");
var _e = Symbol("gid");
var Oe = Symbol("checkedCwd");
var fo = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform;
var Te = fo === "win32";
var uo = 1024;
var mo = (s3, t) => {
  if (!Te) return import_node_fs4.default.unlink(s3, t);
  let e = s3 + ".DELETE." + (0, import_node_crypto.randomBytes)(16).toString("hex");
  import_node_fs4.default.rename(s3, e, (i) => {
    if (i) return t(i);
    import_node_fs4.default.unlink(e, t);
  });
};
var po = (s3) => {
  if (!Te) return import_node_fs4.default.unlinkSync(s3);
  let t = s3 + ".DELETE." + (0, import_node_crypto.randomBytes)(16).toString("hex");
  import_node_fs4.default.renameSync(s3, t), import_node_fs4.default.unlinkSync(t);
};
var vr = (s3, t, e) => s3 !== void 0 && s3 === s3 >>> 0 ? s3 : t !== void 0 && t === t >>> 0 ? t : e;
var Xt = class extends rt {
  [gs] = false;
  [Oe] = false;
  [Ri] = 0;
  reservations = new yi();
  transform;
  writable = true;
  readable = false;
  uid;
  gid;
  setOwner;
  preserveOwner;
  processGid;
  processUid;
  maxDepth;
  forceChown;
  win32;
  newer;
  keep;
  noMtime;
  preservePaths;
  unlink;
  cwd;
  strip;
  processUmask;
  umask;
  dmode;
  fmode;
  chmod;
  constructor(t = {}) {
    if (t.ondone = () => {
      this[gs] = true, this[bs]();
    }, super(t), this.transform = t.transform, this.chmod = !!t.chmod, typeof t.uid == "number" || typeof t.gid == "number") {
      if (typeof t.uid != "number" || typeof t.gid != "number") throw new TypeError("cannot set owner without number uid and gid");
      if (t.preserveOwner) throw new TypeError("cannot preserve owner in archive and also set owner explicitly");
      this.uid = t.uid, this.gid = t.gid, this.setOwner = true;
    } else this.uid = void 0, this.gid = void 0, this.setOwner = false;
    this.preserveOwner = t.preserveOwner === void 0 && typeof t.uid != "number" ? process.getuid?.() === 0 : !!t.preserveOwner, this.processUid = (this.preserveOwner || this.setOwner) && process.getuid ? process.getuid() : void 0, this.processGid = (this.preserveOwner || this.setOwner) && process.getgid ? process.getgid() : void 0, this.maxDepth = typeof t.maxDepth == "number" ? t.maxDepth : uo, this.forceChown = t.forceChown === true, this.win32 = !!t.win32 || Te, this.newer = !!t.newer, this.keep = !!t.keep, this.noMtime = !!t.noMtime, this.preservePaths = !!t.preservePaths, this.unlink = !!t.unlink, this.cwd = f(import_node_path6.default.resolve(t.cwd || process.cwd())), this.strip = Number(t.strip) || 0, this.processUmask = this.chmod ? typeof t.processUmask == "number" ? t.processUmask : Lr() : 0, this.umask = typeof t.umask == "number" ? t.umask : this.processUmask, this.dmode = t.dmode || 511 & ~this.umask, this.fmode = t.fmode || 438 & ~this.umask, this.on("entry", (e) => this[Dr](e));
  }
  warn(t, e, i = {}) {
    return (t === "TAR_BAD_ARCHIVE" || t === "TAR_ABORT") && (i.recoverable = false), super.warn(t, e, i);
  }
  [bs]() {
    this[gs] && this[Ri] === 0 && (this.emit("prefinish"), this.emit("finish"), this.emit("end"));
  }
  [Rs](t, e) {
    let i = t[e], { type: r } = t;
    if (!i || this.preservePaths) return true;
    let [n, o] = ce(i), h = o.replaceAll(/\\/g, "/").split("/");
    if (h.includes("..") || Te && /^[a-z]:\.\.$/i.test(h[0] ?? "")) {
      if (e === "path" || r === "Link") return this.warn("TAR_ENTRY_ERROR", `${e} contains '..'`, { entry: t, [e]: i }), false;
      let a = import_node_path6.default.posix.dirname(t.path), l = import_node_path6.default.posix.normalize(import_node_path6.default.posix.join(a, h.join("/")));
      if (l.startsWith("../") || l === "..") return this.warn("TAR_ENTRY_ERROR", `${e} escapes extraction directory`, { entry: t, [e]: i }), false;
    }
    return n && (t[e] = String(o), this.warn("TAR_ENTRY_INFO", `stripping ${n} from absolute ${e}`, { entry: t, [e]: i })), true;
  }
  [Fr](t) {
    let e = f(t.path), i = e.split("/");
    if (this.strip) {
      if (i.length < this.strip) return false;
      if (t.type === "Link") {
        let r = f(String(t.linkpath)).split("/");
        if (r.length >= this.strip) t.linkpath = r.slice(this.strip).join("/");
        else return false;
      }
      i.splice(0, this.strip), t.path = i.join("/");
    }
    if (isFinite(this.maxDepth) && i.length > this.maxDepth) return this.warn("TAR_ENTRY_ERROR", "path excessively deep", { entry: t, path: e, depth: i.length, maxDepth: this.maxDepth }), false;
    if (!this[Rs](t, "path") || !this[Rs](t, "linkpath")) return false;
    if (t.absolute = import_node_path6.default.isAbsolute(t.path) ? f(import_node_path6.default.resolve(t.path)) : f(import_node_path6.default.resolve(this.cwd, t.path)), !this.preservePaths && typeof t.absolute == "string" && t.absolute.indexOf(this.cwd + "/") !== 0 && t.absolute !== this.cwd) return this.warn("TAR_ENTRY_ERROR", "path escaped extraction target", { entry: t, path: f(t.path), resolvedPath: t.absolute, cwd: this.cwd }), false;
    if (t.absolute === this.cwd && t.type !== "Directory" && t.type !== "GNUDumpDir") return false;
    if (this.win32) {
      let { root: r } = import_node_path6.default.win32.parse(String(t.absolute));
      t.absolute = r + ts(String(t.absolute).slice(r.length));
      let { root: n } = import_node_path6.default.win32.parse(t.path);
      t.path = n + ts(t.path.slice(n.length));
    }
    return true;
  }
  [Dr](t) {
    if (!this[Fr](t)) return t.resume();
    switch (import_node_assert.default.equal(typeof t.absolute, "string"), t.type) {
      case "Directory":
      case "GNUDumpDir":
        t.mode && (t.mode = t.mode | 448);
      case "File":
      case "OldFile":
      case "ContiguousFile":
      case "Link":
      case "SymbolicLink":
        return this[_s](t);
      default:
        return this[Cr](t);
    }
  }
  [O](t, e) {
    t.name === "CwdError" ? this.emit("error", t) : (this.warn("TAR_ENTRY_ERROR", t, { entry: e }), this[$t](), e.resume());
  }
  [yt](t, e, i) {
    gr(f(t), { uid: this.uid, gid: this.gid, processUid: this.processUid, processGid: this.processGid, umask: this.processUmask, preserve: this.preservePaths, unlink: this.unlink, cwd: this.cwd, mode: e }, i);
  }
  [ge](t) {
    return this.forceChown || this.preserveOwner && (typeof t.uid == "number" && t.uid !== this.processUid || typeof t.gid == "number" && t.gid !== this.processGid) || typeof this.uid == "number" && this.uid !== this.processUid || typeof this.gid == "number" && this.gid !== this.processGid;
  }
  [be](t) {
    return vr(this.uid, t.uid, this.processUid);
  }
  [_e](t) {
    return vr(this.gid, t.gid, this.processGid);
  }
  [Ts](t, e) {
    let i = typeof t.mode == "number" ? t.mode & 4095 : this.fmode, r = new et(String(t.absolute), { flags: ms(t.size), mode: i, autoClose: false });
    r.on("error", (a) => {
      r.fd && import_node_fs4.default.close(r.fd, () => {
      }), r.write = () => true, this[O](a, t), e();
    });
    let n = 1, o = (a) => {
      if (a) {
        r.fd && import_node_fs4.default.close(r.fd, () => {
        }), this[O](a, t), e();
        return;
      }
      --n === 0 && r.fd !== void 0 && import_node_fs4.default.close(r.fd, (l) => {
        l ? this[O](l, t) : this[$t](), e();
      });
    };
    r.on("finish", () => {
      let a = String(t.absolute), l = r.fd;
      if (typeof l == "number" && t.mtime && !this.noMtime) {
        n++;
        let c = t.atime || /* @__PURE__ */ new Date(), d = t.mtime;
        import_node_fs4.default.futimes(l, c, d, (y) => y ? import_node_fs4.default.utimes(a, c, d, (T) => o(T && y)) : o());
      }
      if (typeof l == "number" && this[ge](t)) {
        n++;
        let c = this[be](t), d = this[_e](t);
        typeof c == "number" && typeof d == "number" && import_node_fs4.default.fchown(l, c, d, (y) => y ? import_node_fs4.default.chown(a, c, d, (T) => o(T && y)) : o());
      }
      o();
    });
    let h = this.transform && this.transform(t) || t;
    h !== t && (h.on("error", (a) => {
      this[O](a, t), e();
    }), t.pipe(h)), h.pipe(r);
  }
  [xs](t, e) {
    let i = typeof t.mode == "number" ? t.mode & 4095 : this.dmode;
    this[yt](String(t.absolute), i, (r) => {
      if (r) {
        this[O](r, t), e();
        return;
      }
      let n = 1, o = () => {
        --n === 0 && (e(), this[$t](), t.resume());
      };
      t.mtime && !this.noMtime && (n++, import_node_fs4.default.utimes(String(t.absolute), t.atime || /* @__PURE__ */ new Date(), t.mtime, o)), this[ge](t) && (n++, import_node_fs4.default.chown(String(t.absolute), Number(this[be](t)), Number(this[_e](t)), o)), o();
    });
  }
  [Cr](t) {
    t.unsupported = true, this.warn("TAR_ENTRY_UNSUPPORTED", `unsupported entry type: ${t.type}`, { entry: t }), t.resume();
  }
  [Ar](t, e) {
    let i = f(import_node_path6.default.relative(this.cwd, import_node_path6.default.resolve(import_node_path6.default.dirname(String(t.absolute)), String(t.linkpath)))).split("/");
    this[Re](t, this.cwd, i, () => this[gi](t, String(t.linkpath), "symlink", e), (r) => {
      this[O](r, t), e();
    });
  }
  [Ir](t, e) {
    let i = f(import_node_path6.default.resolve(this.cwd, String(t.linkpath))), r = f(String(t.linkpath)).split("/");
    this[Re](t, this.cwd, r, () => this[gi](t, i, "link", e), (n) => {
      this[O](n, t), e();
    });
  }
  [Re](t, e, i, r, n) {
    let o = i.shift();
    if (this.preservePaths || o === void 0) return r();
    let h = import_node_path6.default.resolve(e, o);
    import_node_fs4.default.lstat(h, (a, l) => {
      if (a) return r();
      if (l?.isSymbolicLink()) return n(new St(h, import_node_path6.default.resolve(h, i.join("/"))));
      this[Re](t, h, i, r, n);
    });
  }
  [kr]() {
    this[Ri]++;
  }
  [$t]() {
    this[Ri]--, this[bs]();
  }
  [Ls](t) {
    this[$t](), t.resume();
  }
  [Os](t, e) {
    return t.type === "File" && !this.unlink && e.isFile() && e.nlink <= 1 && !Te;
  }
  [_s](t) {
    this[kr]();
    let e = [t.path];
    t.linkpath && e.push(t.linkpath), this.reservations.reserve(e, (i) => this[Nr](t, i));
  }
  [Nr](t, e) {
    let i = (h) => {
      e(h);
    }, r = () => {
      this[yt](this.cwd, this.dmode, (h) => {
        if (h) {
          this[O](h, t), i();
          return;
        }
        this[Oe] = true, n();
      });
    }, n = () => {
      if (t.absolute !== this.cwd) {
        let h = f(import_node_path6.default.dirname(String(t.absolute)));
        if (h !== this.cwd) return this[yt](h, this.dmode, (a) => {
          if (a) {
            this[O](a, t), i();
            return;
          }
          o();
        });
      }
      o();
    }, o = () => {
      import_node_fs4.default.lstat(String(t.absolute), (h, a) => {
        if (a && (this.keep || this.newer && a.mtime > (t.mtime ?? a.mtime))) {
          this[Ls](t), i();
          return;
        }
        if (h || this[Os](t, a)) return this[P](null, t, i);
        if (a.isDirectory()) {
          if (t.type === "Directory") {
            let l = this.chmod && t.mode && (a.mode & 4095) !== t.mode, c = (d) => this[P](d ?? null, t, i);
            return l ? import_node_fs4.default.chmod(String(t.absolute), Number(t.mode), c) : c();
          }
          if (t.absolute !== this.cwd) return import_node_fs4.default.rmdir(String(t.absolute), (l) => this[P](l ?? null, t, i));
        }
        if (t.absolute === this.cwd) return this[P](null, t, i);
        mo(String(t.absolute), (l) => this[P](l ?? null, t, i));
      });
    };
    this[Oe] ? n() : r();
  }
  [P](t, e, i) {
    if (t) {
      this[O](t, e), i();
      return;
    }
    switch (e.type) {
      case "File":
      case "OldFile":
      case "ContiguousFile":
        return this[Ts](e, i);
      case "Link":
        return this[Ir](e, i);
      case "SymbolicLink":
        return this[Ar](e, i);
      case "Directory":
      case "GNUDumpDir":
        return this[xs](e, i);
    }
  }
  [gi](t, e, i, r) {
    import_node_fs4.default[i](e, String(t.absolute), (n) => {
      n ? this[O](n, t) : (this[$t](), t.resume()), r();
    });
  }
};
var ye = (s3) => {
  try {
    return [null, s3()];
  } catch (t) {
    return [t, null];
  }
};
var xe = class extends Xt {
  sync = true;
  [P](t, e) {
    return super[P](t, e, () => {
    });
  }
  [_s](t) {
    if (!this[Oe]) {
      let n = this[yt](this.cwd, this.dmode);
      if (n) return this[O](n, t);
      this[Oe] = true;
    }
    if (t.absolute !== this.cwd) {
      let n = f(import_node_path6.default.dirname(String(t.absolute)));
      if (n !== this.cwd) {
        let o = this[yt](n, this.dmode);
        if (o) return this[O](o, t);
      }
    }
    let [e, i] = ye(() => import_node_fs4.default.lstatSync(String(t.absolute)));
    if (i && (this.keep || this.newer && i.mtime > (t.mtime ?? i.mtime))) return this[Ls](t);
    if (e || this[Os](t, i)) return this[P](null, t);
    if (i.isDirectory()) {
      if (t.type === "Directory") {
        let o = this.chmod && t.mode && (i.mode & 4095) !== t.mode, [h] = o ? ye(() => {
          import_node_fs4.default.chmodSync(String(t.absolute), Number(t.mode));
        }) : [];
        return this[P](h, t);
      }
      let [n] = ye(() => import_node_fs4.default.rmdirSync(String(t.absolute)));
      this[P](n, t);
    }
    let [r] = t.absolute === this.cwd ? [] : ye(() => po(String(t.absolute)));
    this[P](r, t);
  }
  [Ts](t, e) {
    let i = typeof t.mode == "number" ? t.mode & 4095 : this.fmode, r = (h) => {
      let a;
      try {
        import_node_fs4.default.closeSync(n);
      } catch (l) {
        a = l;
      }
      (h || a) && this[O](h || a, t), e();
    }, n;
    try {
      n = import_node_fs4.default.openSync(String(t.absolute), ms(t.size), i);
    } catch (h) {
      return r(h);
    }
    let o = this.transform && this.transform(t) || t;
    o !== t && (o.on("error", (h) => this[O](h, t)), t.pipe(o)), o.on("data", (h) => {
      try {
        import_node_fs4.default.writeSync(n, h, 0, h.length);
      } catch (a) {
        r(a);
      }
    }), o.on("end", () => {
      let h = null;
      if (t.mtime && !this.noMtime) {
        let a = t.atime || /* @__PURE__ */ new Date(), l = t.mtime;
        try {
          import_node_fs4.default.futimesSync(n, a, l);
        } catch (c) {
          try {
            import_node_fs4.default.utimesSync(String(t.absolute), a, l);
          } catch {
            h = c;
          }
        }
      }
      if (this[ge](t)) {
        let a = this[be](t), l = this[_e](t);
        try {
          import_node_fs4.default.fchownSync(n, Number(a), Number(l));
        } catch (c) {
          try {
            import_node_fs4.default.chownSync(String(t.absolute), Number(a), Number(l));
          } catch {
            h = h || c;
          }
        }
      }
      r(h);
    });
  }
  [xs](t, e) {
    let i = typeof t.mode == "number" ? t.mode & 4095 : this.dmode, r = this[yt](String(t.absolute), i);
    if (r) {
      this[O](r, t), e();
      return;
    }
    if (t.mtime && !this.noMtime) try {
      import_node_fs4.default.utimesSync(String(t.absolute), t.atime || /* @__PURE__ */ new Date(), t.mtime);
    } catch {
    }
    if (this[ge](t)) try {
      import_node_fs4.default.chownSync(String(t.absolute), Number(this[be](t)), Number(this[_e](t)));
    } catch {
    }
    e(), t.resume();
  }
  [yt](t, e) {
    try {
      return _r(f(t), { uid: this.uid, gid: this.gid, processUid: this.processUid, processGid: this.processGid, umask: this.processUmask, preserve: this.preservePaths, unlink: this.unlink, cwd: this.cwd, mode: e });
    } catch (i) {
      return i;
    }
  }
  [Re](t, e, i, r, n) {
    if (this.preservePaths || i.length === 0) return r();
    let o = e;
    for (let h of i) {
      o = import_node_path6.default.resolve(o, h);
      let [a, l] = ye(() => import_node_fs4.default.lstatSync(o));
      if (a) return r();
      if (l.isSymbolicLink()) return n(new St(o, import_node_path6.default.resolve(e, i.join("/"))));
    }
    r();
  }
  [gi](t, e, i, r) {
    let n = `${i}Sync`;
    try {
      import_node_fs4.default[n](e, String(t.absolute)), r(), t.resume();
    } catch (o) {
      return this[O](o, t);
    }
  }
};
var Eo = (s3) => {
  let t = new xe(s3), e = s3.file, i = import_node_fs3.default.statSync(e), r = s3.maxReadSize || 16 * 1024 * 1024;
  new Be(e, { readSize: r, size: i.size }).pipe(t);
};
var wo = (s3, t) => {
  let e = new Xt(s3), i = s3.maxReadSize || 16 * 1024 * 1024, r = s3.file;
  return new Promise((o, h) => {
    e.on("error", h), e.on("close", o), import_node_fs3.default.stat(r, (a, l) => {
      if (a) h(a);
      else {
        let c = new _t(r, { readSize: i, size: l.size });
        c.on("error", h), c.pipe(e);
      }
    });
  });
};
var So = K(Eo, wo, (s3) => new xe(s3), (s3) => new Xt(s3), (s3, t) => {
  t?.length && Qi(s3, t);
});
var yo = (s3, t) => {
  let e = new kt(s3), i = true, r, n;
  try {
    try {
      r = import_node_fs7.default.openSync(s3.file, "r+");
    } catch (a) {
      if (a?.code === "ENOENT") r = import_node_fs7.default.openSync(s3.file, "w+");
      else throw a;
    }
    let o = import_node_fs7.default.fstatSync(r), h = Buffer.alloc(512);
    t: for (n = 0; n < o.size; n += 512) {
      for (let c = 0, d = 0; c < 512; c += d) {
        if (d = import_node_fs7.default.readSync(r, h, c, h.length - c, n + c), n === 0 && h[0] === 31 && h[1] === 139) throw new Error("cannot append to compressed archives");
        if (!d) break t;
      }
      let a = new F(h);
      if (!a.cksumValid) break;
      let l = 512 * Math.ceil((a.size || 0) / 512);
      if (n + l + 512 > o.size) break;
      n += l, s3.mtimeCache && a.mtime && s3.mtimeCache.set(String(a.path), a.mtime);
    }
    i = false, Ro(s3, e, n, r, t);
  } finally {
    if (i) try {
      import_node_fs7.default.closeSync(r);
    } catch {
    }
  }
};
var Ro = (s3, t, e, i, r) => {
  let n = new Wt(s3.file, { fd: i, start: e });
  t.pipe(n), bo(t, r);
};
var go = (s3, t) => {
  t = Array.from(t);
  let e = new wt(s3), i = (n, o, h) => {
    let a = (T, D) => {
      T ? import_node_fs7.default.close(n, (E) => h(T)) : h(null, D);
    }, l = 0;
    if (o === 0) return a(null, 0);
    let c = 0, d = Buffer.alloc(512), y = (T, D) => {
      if (T || D === void 0) return a(T);
      if (c += D, c < 512 && D) return import_node_fs7.default.read(n, d, c, d.length - c, l + c, y);
      if (l === 0 && d[0] === 31 && d[1] === 139) return a(new Error("cannot append to compressed archives"));
      if (c < 512) return a(null, l);
      let E = new F(d);
      if (!E.cksumValid) return a(null, l);
      let x = 512 * Math.ceil((E.size ?? 0) / 512);
      if (l + x + 512 > o || (l += x + 512, l >= o)) return a(null, l);
      s3.mtimeCache && E.mtime && s3.mtimeCache.set(String(E.path), E.mtime), c = 0, import_node_fs7.default.read(n, d, 0, 512, l, y);
    };
    import_node_fs7.default.read(n, d, 0, 512, l, y);
  };
  return new Promise((n, o) => {
    e.on("error", o);
    let h = "r+", a = (l, c) => {
      if (l && l.code === "ENOENT" && h === "r+") return h = "w+", import_node_fs7.default.open(s3.file, h, a);
      if (l || !c) return o(l);
      import_node_fs7.default.fstat(c, (d, y) => {
        if (d) return import_node_fs7.default.close(c, () => o(d));
        i(c, y.size, (T, D) => {
          if (T) return o(T);
          let E = new et(s3.file, { fd: c, start: D });
          e.pipe(E), E.on("error", o), E.on("close", n), _o(e, t);
        });
      });
    };
    import_node_fs7.default.open(s3.file, h, a);
  });
};
var bo = (s3, t) => {
  t.forEach((e) => {
    e.charAt(0) === "@" ? Ct({ file: import_node_path10.default.resolve(s3.cwd, e.slice(1)), sync: true, noResume: true, onReadEntry: (i) => s3.add(i) }) : s3.add(e);
  }), s3.end();
};
var _o = async (s3, t) => {
  for (let e of t) e.charAt(0) === "@" ? await Ct({ file: import_node_path10.default.resolve(String(s3.cwd), e.slice(1)), noResume: true, onReadEntry: (i) => s3.add(i) }) : s3.add(e);
  s3.end();
};
var vt = K(yo, go, () => {
  throw new TypeError("file is required");
}, () => {
  throw new TypeError("file is required");
}, (s3, t) => {
  if (!Bs(s3)) throw new TypeError("file is required");
  if (s3.gzip || s3.brotli || s3.zstd || s3.file.endsWith(".br") || s3.file.endsWith(".tbr")) throw new TypeError("cannot append to compressed archives");
  if (!t?.length) throw new TypeError("no paths specified to add/replace");
});
var Oo = K(vt.syncFile, vt.asyncFile, vt.syncNoFile, vt.asyncNoFile, (s3, t = []) => {
  vt.validate?.(s3, t), To(s3);
});
var To = (s3) => {
  let t = s3.filter;
  s3.mtimeCache || (s3.mtimeCache = /* @__PURE__ */ new Map()), s3.filter = t ? (e, i) => t(e, i) && !((s3.mtimeCache?.get(e) ?? i.mtime ?? 0) > (i.mtime ?? 0)) : (e, i) => !((s3.mtimeCache?.get(e) ?? i.mtime ?? 0) > (i.mtime ?? 0));
};

// src/runtime-release.json
var runtime_release_default = {
  version: "0.167.1",
  assets: {
    "codex-package-x86_64-unknown-linux-musl.tar.gz": {
      url: "https://github.com/openai/codex/releases/download/rust-v0.167.1/codex-package-x86_64-unknown-linux-musl.tar.gz",
      sha256: "a945df3df83e849dd7b74787e27f8a459c1946b0e3afe3dc8eef8a8d1845fd4f",
      size: 200235863
    },
    "codex-package-aarch64-apple-darwin.tar.gz": {
      url: "https://github.com/openai/codex/releases/download/rust-v0.167.1/codex-package-aarch64-apple-darwin.tar.gz",
      sha256: "5bcbc5866cbca19f9299f7884e9b39b9ccb5469969c170b1f2d2cd6fc4b1ee72",
      size: 166615534
    },
    "codex-package-x86_64-apple-darwin.tar.gz": {
      url: "https://github.com/openai/codex/releases/download/rust-v0.167.1/codex-package-x86_64-apple-darwin.tar.gz",
      sha256: "ade991ce7fef5b4f4af884c154b9455d493cd0caf13789fc3ff9f842897b55d3",
      size: 180452942
    },
    "codex-package-aarch64-unknown-linux-musl.tar.gz": {
      url: "https://github.com/openai/codex/releases/download/rust-v0.167.1/codex-package-aarch64-unknown-linux-musl.tar.gz",
      sha256: "ef3e1443a7795d596f1601a533d7225a1030488d60c965af1f0610ab95889031",
      size: 187977851
    },
    "codex-package-x86_64-pc-windows-msvc.tar.gz": {
      url: "https://github.com/openai/codex/releases/download/rust-v0.167.1/codex-package-x86_64-pc-windows-msvc.tar.gz",
      sha256: "a327ba32f46e39079486ffa29e160e9da9ab2b2f73744d6101509729c26c1c1b",
      size: 201602950
    },
    "codex-package-aarch64-pc-windows-msvc.tar.gz": {
      url: "https://github.com/openai/codex/releases/download/rust-v0.167.1/codex-package-aarch64-pc-windows-msvc.tar.gz",
      sha256: "5c6fb7ceb1145e4cc505375404f915d97d12e4d5720dec43c348545204b1e472",
      size: 186785886
    }
  }
};

// src/runtime.ts
var managedVersion = runtime_release_default.version;
function runtimeRoot(platform = process.platform, home = (0, import_node_os2.homedir)(), env = process.env) {
  if (platform === "darwin") return (0, import_node_path11.join)(home, "Library", "Application Support", "Canvas Loom");
  if (platform === "win32") return (0, import_node_path11.join)(env.LOCALAPPDATA || (0, import_node_path11.join)(home, "AppData", "Local"), "Canvas Loom");
  return (0, import_node_path11.join)(env.XDG_DATA_HOME || (0, import_node_path11.join)(home, ".local", "share"), "canvas-loom");
}
function runtimeAsset(platform = process.platform, arch = process.arch) {
  const cpu = arch === "arm64" ? "aarch64" : arch === "x64" ? "x86_64" : null;
  const os2 = platform === "darwin" ? "apple-darwin" : platform === "linux" ? "unknown-linux-musl" : platform === "win32" ? "pc-windows-msvc" : null;
  if (!cpu || !os2) throw new Error(`Automatic Codex setup does not support ${platform}/${arch}. You can choose an existing runtime in Advanced settings.`);
  const target = `${cpu}-${os2}`;
  const name = `codex-package-${target}.tar.gz`;
  const asset = runtime_release_default.assets[name];
  if (!asset) throw new Error(`No verified Codex package is available for ${target}.`);
  return { target, asset };
}
function checkCancelled(signal) {
  if (signal.aborted) throw new Error("Codex setup cancelled.");
}
function proxyFor(url) {
  const bypass = (process.env.NO_PROXY || process.env.no_proxy || "").split(",").map((s3) => s3.trim()).filter(Boolean);
  if (bypass.some((domain) => domain === "*" || url.hostname === domain || url.hostname.endsWith(domain.startsWith(".") ? domain : "." + domain))) return void 0;
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.ALL_PROXY || process.env.all_proxy;
  return proxy ? new HttpsProxyAgent(proxy) : void 0;
}
async function responseFor(url, signal, redirects = 0) {
  checkCancelled(signal);
  if (url.protocol !== "https:" || url.username || url.password) throw new Error("Codex download requires a secure HTTPS URL.");
  return new Promise((resolveResponse, reject) => {
    const request = (0, import_node_https.get)(url, { agent: proxyFor(url), headers: { "User-Agent": "Canvas-Loom/0.2.0", "Accept": "application/octet-stream" }, signal }, (response) => {
      if ([301, 302, 303, 307, 308].includes(response.statusCode ?? 0)) {
        const location = response.headers.location;
        response.resume();
        if (!location || redirects >= 8) {
          reject(new Error("Too many redirects while downloading Codex."));
          return;
        }
        responseFor(new URL(location, url), signal, redirects + 1).then(resolveResponse, reject);
        return;
      }
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Codex download returned HTTP ${response.statusCode}. Check your connection and click Retry.`));
        return;
      }
      resolveResponse(response);
    });
    request.setTimeout(6e4, () => request.destroy(new Error("Codex download stalled. Check your connection and click Retry.")));
    request.on("error", reject);
  });
}
var downloadPackage = async (asset, path, progress, signal) => {
  const response = await responseFor(new URL(asset.url), signal);
  let received = 0;
  let lastProgress = 0;
  const meter = new import_node_stream2.Transform({ transform(chunk, _encoding, callback) {
    received += chunk.length;
    if (received > asset.size) {
      callback(new Error("Codex download exceeded its expected size."));
      return;
    }
    if (Date.now() - lastProgress > 150) {
      progress(received, asset.size);
      lastProgress = Date.now();
    }
    callback(null, chunk);
  } });
  await (0, import_promises3.pipeline)(response, meter, (0, import_node_fs8.createWriteStream)(path, { flags: "wx" }), { signal });
  if (received !== asset.size) throw new Error("The Codex download was incomplete. Click Retry to download it again.");
  progress(received, asset.size);
};
async function verifyPackage(path, asset, signal) {
  const info = await (0, import_promises2.stat)(path);
  if (info.size !== asset.size) throw new Error("The Codex download is incomplete. Please retry.");
  const hash = (0, import_node_crypto2.createHash)("sha256");
  for await (const chunk of (0, import_node_fs8.createReadStream)(path)) {
    checkCancelled(signal);
    hash.update(chunk);
  }
  if (hash.digest("hex") !== asset.sha256) throw new Error("The Codex package failed its integrity check. It was not installed. Please retry.");
}
async function extractPackage(archive, directory, signal) {
  let bytes = 0, files = 0;
  let issue;
  await Ct({ file: archive, strict: true, onReadEntry: (entry) => {
    const path = entry.path;
    if ((0, import_node_path11.isAbsolute)(path) || path.split(/[\\/]/).some((p2) => p2 === "..")) issue = new Error("The runtime package contains an unsafe path.");
    if (!["File", "Directory", "OldFile"].includes(entry.type)) issue = new Error(`Unsupported runtime archive entry: ${entry.type}.`);
    files++;
    bytes += entry.size ?? 0;
    if (files > 1e4 || bytes > 3e9) issue = new Error("The runtime package exceeds the extraction limit.");
    entry.resume();
  } });
  checkCancelled(signal);
  if (issue) throw issue;
  await So({ file: archive, cwd: directory, strict: true, preservePaths: false, filter: () => !signal.aborted });
  checkCancelled(signal);
}
async function verifyExecutable(path, version, signal) {
  checkCancelled(signal);
  await new Promise((resolveVersion, reject) => {
    const child = (0, import_node_child_process2.spawn)(path, ["--version"], { shell: false, windowsHide: true, signal });
    let output = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error("The downloaded Codex runtime did not start."));
    }, 2e4);
    child.stdout.on("data", (data) => {
      output = (output + String(data)).slice(-1e3);
    });
    child.stderr.on("data", () => {
    });
    child.on("error", (e) => {
      clearTimeout(timer);
      reject(new Error(`The Codex runtime could not start: ${e.message}`));
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0 || !output.includes(`codex-cli ${version}`)) {
        reject(new Error("The downloaded Codex runtime could not be verified on this computer. An OS update may be required."));
        return;
      }
      resolveVersion();
    });
  });
}
async function installationLock(path) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const handle = await (0, import_promises2.open)(path, "wx");
      try {
        await handle.writeFile(JSON.stringify({ pid: process.pid, at: Date.now() }));
        return handle;
      } catch (error) {
        await handle.close();
        await (0, import_promises2.rm)(path, { force: true });
        throw error;
      }
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      let stale = false;
      try {
        const previous = JSON.parse(await (0, import_promises2.readFile)(path, "utf8"));
        if (Number.isSafeInteger(previous.pid) && previous.pid > 0) {
          try {
            process.kill(previous.pid, 0);
          } catch (e) {
            stale = e.code === "ESRCH";
          }
        } else stale = Date.now() - (await (0, import_promises2.stat)(path)).mtimeMs > 3e5;
      } catch {
        try {
          stale = Date.now() - (await (0, import_promises2.stat)(path)).mtimeMs > 3e5;
        } catch {
        }
      }
      if (stale) {
        await (0, import_promises2.rm)(path, { force: true });
        continue;
      }
      throw new Error("Codex setup is already running in another window. Wait for it to finish, or restart Obsidian and retry.");
    }
  }
  throw new Error("Could not start Codex setup. Restart Obsidian and try again.");
}
var RuntimeManager = class {
  constructor(root = runtimeRoot(), download = downloadPackage, executableCheck = verifyExecutable, packageFor = runtimeAsset) {
    this.root = root;
    this.download = download;
    this.executableCheck = executableCheck;
    this.packageFor = packageFor;
  }
  get stateDirectory() {
    return (0, import_node_path11.join)(this.root, "state");
  }
  get profileDirectory() {
    try {
      return JSON.parse((0, import_node_fs8.readFileSync)((0, import_node_path11.join)(this.root, "connection.json"), "utf8")).profile === "managed" ? (0, import_node_path11.join)(this.root, "profile") : void 0;
    } catch {
      return void 0;
    }
  }
  async useManagedProfile() {
    const directory = (0, import_node_path11.join)(this.root, "profile");
    await (0, import_promises2.mkdir)(directory, { recursive: true });
    await (0, import_promises2.writeFile)((0, import_node_path11.join)(this.root, "connection.json"), JSON.stringify({ profile: "managed" }));
    return directory;
  }
  current() {
    try {
      const value = JSON.parse((0, import_node_fs8.readFileSync)((0, import_node_path11.join)(this.root, "runtime.json"), "utf8"));
      const rel = (0, import_node_path11.relative)(this.root, value.directory);
      if (!rel || rel.startsWith("..") || (0, import_node_path11.isAbsolute)(rel) || !value.executable.startsWith(value.directory + import_node_path11.sep) || !(0, import_node_fs8.existsSync)(value.executable)) return null;
      return value;
    } catch {
      return null;
    }
  }
  async install(progress, signal, platform = process.platform, arch = process.arch) {
    const { target, asset } = this.packageFor(platform, arch);
    checkCancelled(signal);
    await (0, import_promises2.mkdir)(this.root, { recursive: true });
    const lockPath = (0, import_node_path11.join)(this.root, "install.lock");
    const lock = await installationLock(lockPath);
    let stage;
    let candidate;
    let committed = false;
    try {
      stage = await (0, import_promises2.mkdtemp)((0, import_node_path11.join)(this.root, ".install-"));
      const archive = (0, import_node_path11.join)(stage, "package.tar.gz");
      progress({ phase: "downloading", message: "Downloading Codex\u2026", received: 0, total: asset.size });
      await this.download(asset, archive, (received, total) => progress({ phase: "downloading", message: "Downloading Codex\u2026", received, total }), signal);
      progress({ phase: "verifying", message: "Checking download integrity\u2026" });
      await verifyPackage(archive, asset, signal);
      const unpack = (0, import_node_path11.join)(stage, "runtime");
      await (0, import_promises2.mkdir)(unpack);
      progress({ phase: "extracting", message: "Installing Codex and its dependencies\u2026" });
      await extractPackage(archive, unpack, signal);
      const name = platform === "win32" ? "codex.exe" : "codex";
      const executable = (0, import_node_path11.join)(unpack, "bin", name);
      await (0, import_promises2.access)(executable);
      if (platform !== "win32") await (0, import_promises2.chmod)(executable, 493);
      progress({ phase: "testing", message: "Testing the installed runtime\u2026" });
      await this.executableCheck(executable, runtime_release_default.version, signal);
      checkCancelled(signal);
      const directory = (0, import_node_path11.join)(this.root, `runtime-${runtime_release_default.version}-${target}-${(0, import_node_path11.basename)(stage).slice(-6)}`);
      candidate = directory;
      await (0, import_promises2.rename)(unpack, directory);
      const installed = { version: runtime_release_default.version, target, directory, executable: (0, import_node_path11.join)(directory, "bin", name) };
      const temporaryManifest = (0, import_node_path11.join)(this.root, `runtime-${(0, import_node_path11.basename)(stage)}.json`);
      await (0, import_promises2.writeFile)(temporaryManifest, JSON.stringify(installed, null, 2));
      checkCancelled(signal);
      progress({ phase: "installing", message: "Finishing setup\u2026" });
      checkCancelled(signal);
      await (0, import_promises2.mkdir)(this.stateDirectory, { recursive: true });
      checkCancelled(signal);
      await (0, import_promises2.rename)(temporaryManifest, (0, import_node_path11.join)(this.root, "runtime.json"));
      committed = true;
      return installed;
    } finally {
      if (stage) {
        await (0, import_promises2.rm)(stage, { recursive: true, force: true });
        await (0, import_promises2.rm)((0, import_node_path11.join)(this.root, `runtime-${(0, import_node_path11.basename)(stage)}.json`), { force: true });
      }
      if (candidate && !committed) await (0, import_promises2.rm)(candidate, { recursive: true, force: true });
      await lock.close();
      await (0, import_promises2.rm)(lockPath, { force: true });
    }
  }
};

// src/setup.ts
var CodexSetup = class {
  constructor(runtime, options, openBrowser, factory = (options2) => new CodexClient(options2)) {
    this.runtime = runtime;
    this.options = options;
    this.openBrowser = openBrowser;
    this.factory = factory;
  }
  state = { phase: "idle", message: "Set up Codex to install everything and connect your ChatGPT account." };
  observers = /* @__PURE__ */ new Set();
  controller;
  client;
  operation;
  get busy() {
    return !!this.operation;
  }
  subscribe(observer) {
    this.observers.add(observer);
    observer(this.state);
    return () => this.observers.delete(observer);
  }
  update(state) {
    this.state = state;
    for (const observer of this.observers) observer(state);
  }
  start(repair = false) {
    return this.execute(true, repair);
  }
  refresh() {
    return this.execute(false, false);
  }
  execute(allowSetup, repair) {
    if (this.operation) return this.operation;
    const controller = this.controller = new AbortController();
    const task = Promise.resolve().then(() => this.perform(allowSetup, repair, controller.signal));
    this.operation = task.finally(() => {
      this.client?.close();
      this.client = void 0;
      this.controller = void 0;
      this.operation = void 0;
      for (const observer of this.observers) observer(this.state);
    });
    return this.operation;
  }
  async perform(allowSetup, repair, signal) {
    try {
      const initial = this.options();
      const custom = !!initial.executable && initial.executable !== this.runtime.current()?.executable;
      let current = this.runtime.current();
      if (!custom && (!current || repair || current.version !== managedVersion)) {
        if (!allowSetup) {
          this.update({ phase: "idle", message: "Click Set up Codex. The plugin installs and configures its own runtime." });
          return;
        }
        current = await this.runtime.install((p2) => {
          if (!signal.aborted) this.update({ ...p2, version: managedVersion });
        }, signal);
      }
      if (signal.aborted) throw new Error("Codex setup cancelled.");
      const options = this.options();
      const executable = custom ? initial.executable : current?.executable;
      if (!executable) throw new Error("Codex installation could not be located. Click Repair installation.");
      this.update({ phase: "checking", message: "Checking Codex and your account\u2026", version: current?.version });
      let client;
      const connect3 = async (profileDirectory) => {
        this.client?.close();
        client = this.client = this.factory({ ...options, executable, stateDirectory: this.runtime.stateDirectory, profileDirectory });
        const connected = client;
        signal.addEventListener("abort", () => connected.close(), { once: true });
        await connected.open();
        return connected.accountInfo();
      };
      let account;
      try {
        account = await connect3(options.profileDirectory ?? this.runtime.profileDirectory);
      } catch (error) {
        if (custom || options.profileDirectory || this.runtime.profileDirectory || signal.aborted) throw error;
        this.update({ phase: "checking", message: "Configuring a clean Codex profile\u2026", version: current?.version });
        account = await connect3(await this.runtime.useManagedProfile());
      }
      if (account?.type !== "chatgpt" && !custom && !this.runtime.profileDirectory) {
        account = await connect3(await this.runtime.useManagedProfile());
      }
      if (signal.aborted) throw new Error("Codex setup cancelled.");
      if (account?.type !== "chatgpt") {
        if (!allowSetup) {
          this.update({ phase: "sign-in-required", message: "Codex is installed. Sign in with ChatGPT to enable generation.", version: current?.version });
          return;
        }
        this.update({ phase: "sign-in", message: "Opening ChatGPT sign-in\u2026", version: current?.version });
        await client.login(async (url) => {
          if (signal.aborted) return;
          this.update({ phase: "sign-in", message: "Finish signing in in your browser. This panel will update automatically.", authUrl: url, version: current?.version });
          await this.openBrowser(url);
        }, signal);
      }
      if (signal.aborted) throw new Error("Codex setup cancelled.");
      this.update({ phase: "checking", message: "Verifying model access and starting a test session\u2026", version: current?.version });
      const label = await client.checkReady();
      if (signal.aborted) throw new Error("Codex setup cancelled.");
      this.update({ phase: "ready", message: "Codex is ready. You can run Canvas prompts.", account: label, version: current?.version });
    } catch (error) {
      if (signal.aborted) this.update({ phase: "cancelled", message: "Setup cancelled. Click Set up Codex to continue." });
      else this.update({ phase: "error", message: safeDiagnostic(error instanceof Error ? error.message : String(error)) || "Setup failed. Click Retry setup." });
    }
  }
  cancel() {
    this.controller?.abort();
    this.client?.close();
  }
  dispose() {
    this.cancel();
    this.observers.clear();
  }
};

// src/editor.ts
var import_state = require("@codemirror/state");
var import_view = require("@codemirror/view");
var MentionChip = class extends import_view.WidgetType {
  constructor(id, label, missing, activate) {
    super();
    this.id = id;
    this.label = label;
    this.missing = missing;
    this.activate = activate;
  }
  eq(other) {
    return this.id === other.id && this.label === other.label && this.missing === other.missing;
  }
  toDOM(view) {
    const chip = view.dom.ownerDocument.createElement("button");
    chip.type = "button";
    chip.className = "loom-mention" + (this.missing ? " is-missing" : "");
    chip.textContent = "@" + this.label;
    chip.title = this.missing ? "Referenced node is missing" : "Jump to " + this.label;
    chip.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.activate();
    };
    return chip;
  }
  ignoreEvent() {
    return true;
  }
};
function mentionExtension(host) {
  return import_state.Prec.highest(import_view.ViewPlugin.fromClass(class {
    constructor(view) {
      this.view = view;
      view.dom.addEventListener("keydown", this.keydown, true);
      view.dom.addEventListener("focusout", this.blur);
      this.decorate();
    }
    decorations = import_view.Decoration.none;
    popup = null;
    items = [];
    selected = 0;
    trigger = null;
    dismissedAt = -1;
    destroyed = false;
    update(update) {
      if (!host.enabled()) return;
      if (update.docChanged) {
        this.dismissedAt = -1;
        const text = this.view.state.doc.toString();
        queueMicrotask(() => {
          try {
            host.syncEditor(this.view.dom, text);
          } catch (e) {
            host.report(e);
          }
        });
      }
      if (update.docChanged || update.selectionSet || update.viewportChanged) this.decorate();
      if (update.docChanged || update.selectionSet) queueMicrotask(() => {
        if (!this.destroyed) this.suggest();
      });
      else if (update.viewportChanged && this.popup) queueMicrotask(() => {
        if (!this.destroyed && this.popup) this.render();
      });
    }
    decorate() {
      const located = host.adapter.locate(this.view.dom);
      if (!host.enabled() || !located) {
        this.decorations = import_view.Decoration.none;
        return;
      }
      const nodes = new Map(host.adapter.snapshot(located.handle).nodes.map((n) => [n.id, n]));
      const selection = this.view.state.selection;
      const ranges = mentions(this.view.state.doc.toString()).flatMap((m2) => {
        if (selection.ranges.some((r) => r.from <= m2.to && r.to >= m2.from)) return [];
        const source = nodes.get(m2.id);
        return [import_view.Decoration.replace({ widget: new MentionChip(m2.id, source ? nodeTitle(source) : m2.label, !source, () => {
          try {
            host.adapter.focus(located.handle, m2.id);
          } catch (e) {
            host.report(e);
          }
        }) }).range(m2.from, m2.to)];
      });
      this.decorations = import_view.Decoration.set(ranges, true);
    }
    suggest() {
      if (!this.view.hasFocus || !host.enabled()) {
        this.close();
        return;
      }
      const located = host.adapter.locate(this.view.dom);
      if (!located || located.handle.canvas.readonly) {
        this.close();
        return;
      }
      const t = triggerAt(this.view.state.doc.toString(), this.view.state.selection.main.head);
      if (!t || t.to === this.dismissedAt) {
        this.close();
        return;
      }
      this.trigger = t;
      const query = t.query.toLocaleLowerCase();
      this.items = host.adapter.snapshot(located.handle).nodes.filter((n) => n.id !== located.node.id && n.type !== "group" && (nodeTitle(n) + " " + n.id).toLocaleLowerCase().includes(query)).slice(0, 30);
      this.selected = 0;
      this.render();
    }
    render() {
      if (!this.trigger) return;
      this.popup?.remove();
      const located = host.adapter.locate(this.view.dom);
      const doc = located?.node.nodeEl.ownerDocument ?? this.view.dom.ownerDocument;
      const popup = this.popup = doc.createElement("div");
      popup.className = "loom-suggest";
      popup.role = "listbox";
      popup.setAttribute("aria-label", "Canvas nodes");
      const caption = doc.createElement("div");
      caption.className = "loom-suggest-caption";
      caption.textContent = "REFERENCE A NODE";
      popup.append(caption);
      if (!this.items.length) {
        const empty = doc.createElement("div");
        empty.className = "loom-suggest-empty";
        empty.textContent = "No matching nodes";
        popup.append(empty);
      }
      this.items.forEach((node, index) => {
        const row = doc.createElement("div");
        row.className = "loom-suggest-item" + (index === this.selected ? " is-selected" : "");
        row.role = "option";
        row.setAttribute("aria-selected", String(index === this.selected));
        const title = doc.createElement("div");
        title.className = "loom-suggest-title";
        title.textContent = nodeTitle(node);
        const detail = doc.createElement("div");
        detail.className = "loom-suggest-detail";
        detail.textContent = `${node.type} \xB7 ${node.id.slice(0, 8)}`;
        row.append(title, detail);
        row.onpointerdown = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.choose(node);
        };
        popup.append(row);
      });
      const help = doc.createElement("div");
      help.className = "loom-suggest-help";
      help.textContent = "\u2191 \u2193 navigate \xB7 Enter insert \xB7 Esc close";
      popup.append(help);
      doc.body.append(popup);
      let coords = this.view.coordsAtPos(this.trigger.to);
      let sourceDoc = this.view.dom.ownerDocument;
      while (coords && sourceDoc !== doc) {
        const frame = sourceDoc.defaultView?.frameElement;
        if (!frame) break;
        const rect = frame.getBoundingClientRect();
        const sx = frame.clientWidth ? rect.width / frame.clientWidth : 1;
        const sy = frame.clientHeight ? rect.height / frame.clientHeight : 1;
        coords = { left: rect.left + coords.left * sx, right: rect.left + coords.right * sx, top: rect.top + coords.top * sy, bottom: rect.top + coords.bottom * sy };
        sourceDoc = frame.ownerDocument;
      }
      if (coords) {
        const win = doc.defaultView;
        popup.style.left = Math.max(8, Math.min(coords.left, win.innerWidth - popup.offsetWidth - 8)) + "px";
        popup.style.top = Math.max(8, coords.bottom + 8 + popup.offsetHeight > win.innerHeight ? coords.top - popup.offsetHeight - 8 : coords.bottom + 8) + "px";
      }
    }
    choose(node) {
      const t = this.trigger;
      if (!t) return;
      const token = mentionToken(node) + " ";
      this.close();
      this.view.dispatch({ changes: { from: t.from, to: t.to, insert: token }, selection: { anchor: t.from + token.length }, userEvent: "input.complete" });
      this.view.focus();
    }
    keydown = (event) => {
      if (!this.popup || event.isComposing) return;
      if (!["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"].includes(event.key)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (event.key === "Escape") {
        this.dismissedAt = this.view.state.selection.main.head;
        this.close();
        return;
      }
      if (event.key === "Enter" || event.key === "Tab") {
        const node = this.items[this.selected];
        if (node) this.choose(node);
        return;
      }
      if (this.items.length) {
        this.selected = (this.selected + (event.key === "ArrowDown" ? 1 : -1) + this.items.length) % this.items.length;
        this.render();
        this.popup?.querySelector(".is-selected")?.scrollIntoView({ block: "nearest" });
      }
    };
    blur = () => {
      this.close();
    };
    close() {
      this.popup?.remove();
      this.popup = null;
      this.trigger = null;
    }
    destroy() {
      this.destroyed = true;
      this.close();
      this.view.dom.removeEventListener("keydown", this.keydown, true);
      this.view.dom.removeEventListener("focusout", this.blur);
    }
  }, { decorations: (v2) => v2.decorations }));
}

// src/main.ts
var defaults = { executable: "", useCustomExecutable: false, model: "", timeoutSeconds: 180, maxChars: 12e4, showButtons: true };
var uid = () => (0, import_node_crypto3.randomBytes)(8).toString("hex");
var CanvasLoom = class extends import_obsidian2.Plugin {
  settings = { ...defaults };
  adapter;
  alive = false;
  runtime = new RuntimeManager();
  setup;
  jobs = /* @__PURE__ */ new Map();
  syncing = false;
  errorAt = 0;
  editorText = /* @__PURE__ */ new Map();
  fileCache = /* @__PURE__ */ new Map();
  buttons = /* @__PURE__ */ new Set();
  status;
  async onload() {
    this.settings = { ...defaults, ...await this.loadData() };
    this.adapter = new CanvasAdapter(this.app);
    this.alive = true;
    this.setup = new CodexSetup(this.runtime, () => this.options(), async (url) => {
      await require("electron").shell.openExternal(url);
    });
    this.status = this.addStatusBarItem();
    this.status.textContent = "Canvas Loom";
    this.registerEditorExtension(mentionExtension({ adapter: this.adapter, syncEditor: (dom, text) => this.syncEditor(dom, text), report: (e) => this.report(e), enabled: () => this.alive }));
    this.registerMarkdownPostProcessor((el) => {
      for (const link of el.querySelectorAll('a[href^="canvas-node:"],a[data-href^="canvas-node:"]')) {
        const target = (link.getAttribute("href") ?? link.getAttribute("data-href") ?? "").slice("canvas-node:".length);
        if (!/^[A-Za-z0-9_-]+$/.test(target)) continue;
        link.classList.add("loom-mention");
        link.textContent = "@" + link.textContent;
        link.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const located = this.adapter.locate(link);
          if (located) try {
            this.adapter.focus(located.handle, target);
          } catch (error) {
            this.report(error);
          }
        };
      }
    });
    this.addSettingTab(new LoomSettings(this.app, this));
    this.addCommand({ id: "run-node", name: "Run selected node with Codex", checkCallback: (checking) => this.selectedAction(checking, (h, n) => void this.run(h, n.id)) });
    this.addCommand({ id: "preview-context", name: "Preview selected node context", checkCallback: (checking) => this.selectedAction(checking, (h, n) => void this.preview(h, n.id)) });
    this.addCommand({ id: "cancel-generations", name: "Cancel active generations", callback: () => this.cancelAll() });
    this.addCommand({ id: "check-codex", name: "Check Codex connection", callback: () => void this.checkConnection() });
    this.addCommand({ id: "create-example", name: "Create example canvas", callback: () => void this.createExample() });
    this.registerInterval(window.setInterval(() => void this.tick(), 600));
    this.app.workspace.onLayoutReady(() => void this.tick());
  }
  onunload() {
    this.alive = false;
    this.setup.dispose();
    this.cancelAll();
    for (const button of this.buttons) button.remove();
    this.buttons.clear();
    this.app.workspace.containerEl.querySelectorAll(".loom-mention").forEach((el) => {
      if (el.tagName === "A") {
        el.classList.remove("loom-mention");
        el.onclick = null;
      }
    });
  }
  report(error) {
    if (Date.now() - this.errorAt < 1500) return;
    this.errorAt = Date.now();
    new import_obsidian2.Notice(error instanceof Error ? error.message : String(error), 9e3);
  }
  selectedAction(checking, action) {
    const h = this.adapter.active();
    if (!h || h.canvas.selection.size !== 1) return false;
    const n = [...h.canvas.selection][0];
    if (!h.canvas.nodes.has(n.id)) return false;
    if (!checking) action(h, n);
    return true;
  }
  syncEditor(dom, text) {
    if (!this.alive) return;
    const found = this.adapter.locate(dom);
    if (!found) return;
    this.editorText.set(`${found.handle.file.path}:${found.node.id}`, { text, at: Date.now() });
    if (found.node.getData().type === "text" && found.node.getData().text !== text) this.adapter.setText(found.handle, found.node.id, text);
    this.adapter.sync(found.handle, /* @__PURE__ */ new Map([[found.node.id, text]]));
  }
  options() {
    return { executable: this.settings.useCustomExecutable ? this.settings.executable : this.runtime.current()?.executable ?? "", model: this.settings.model, timeoutMs: this.settings.timeoutSeconds * 1e3, stateDirectory: this.runtime.stateDirectory, profileDirectory: this.settings.useCustomExecutable ? void 0 : this.runtime.profileDirectory };
  }
  async graph(handle) {
    const graph = this.adapter.snapshot(handle);
    for (const node of graph.nodes) {
      const live = this.editorText.get(`${handle.file.path}:${node.id}`);
      if (live && Date.now() - live.at < 1500) {
        node.text = live.text;
        continue;
      }
      if (node.type === "file" && node.file && /\.(md|txt)$/i.test(node.file)) {
        const child = handle.canvas.nodes.get(node.id)?.child;
        if ((child?.editMode || child?.dirty) && typeof node.text === "string") continue;
        const file = this.app.vault.getAbstractFileByPath(node.file);
        if (!(file instanceof import_obsidian2.TFile)) continue;
        const cache = this.fileCache.get(file.path);
        if (cache?.mtime === file.stat.mtime) node.text = cache.text;
        else {
          const text = await this.app.vault.cachedRead(file);
          this.fileCache.set(file.path, { mtime: file.stat.mtime, text });
          node.text = text;
        }
      }
    }
    return graph;
  }
  async tick() {
    if (!this.alive || this.syncing) return;
    this.syncing = true;
    try {
      for (const button of this.buttons) if (!button.isConnected) {
        this.buttons.delete(button);
      }
      for (const handle of this.adapter.all()) {
        if (!this.alive) break;
        const graph = await this.graph(handle);
        if (!this.alive) break;
        this.adapter.sync(handle, new Map(graph.nodes.filter((n) => typeof n.text === "string").map((n) => [n.id, n.text])));
        for (const node of handle.canvas.nodes.values()) {
          if (!node.nodeEl.isConnected) continue;
          const data = node.getData();
          if (data.type !== "text") continue;
          let controls = node.nodeEl.querySelector(":scope > .loom-controls");
          if (!this.settings.showButtons || handle.canvas.readonly) {
            controls?.remove();
            continue;
          }
          if (!controls) {
            controls = node.nodeEl.ownerDocument.createElement("div");
            controls.className = "loom-controls";
            const preview = controls.createEl("button", { text: "Context", attr: { "aria-label": "Preview connected context" } });
            preview.onclick = (e) => {
              e.stopPropagation();
              void this.preview(handle, node.id);
            };
            const run2 = controls.createEl("button", { text: "Run", cls: "loom-run", attr: { "aria-label": "Run this node with Codex" } });
            run2.onclick = (e) => {
              e.stopPropagation();
              const job = this.jobs.get(this.jobKey(handle, node.id));
              if (job) job.controller.abort();
              else void this.run(handle, node.id);
            };
            controls.onpointerdown = (e) => {
              e.stopPropagation();
            };
            node.nodeEl.append(controls);
            this.buttons.add(controls);
          }
          const run = controls.querySelector(".loom-run");
          const running = this.jobs.has(this.jobKey(handle, node.id));
          run.textContent = running ? "Stop" : "Run";
          run.classList.toggle("is-running", running);
        }
      }
      this.status.textContent = this.jobs.size ? `Canvas Loom \xB7 ${this.jobs.size} running` : "Canvas Loom";
    } catch (e) {
      this.report(e);
    } finally {
      this.syncing = false;
    }
  }
  jobKey(h, id) {
    return `${h.file.path}:${id}`;
  }
  async compile(h, id) {
    const graph = await this.graph(h);
    return compilePrompt(graph, id, (n) => this.adapter.readNode(n), this.settings.maxChars);
  }
  async preview(h, id) {
    try {
      const compiled = await this.compile(h, id);
      if (this.alive) new ContextModal(this.app, compiled, () => void this.run(h, id)).open();
    } catch (e) {
      this.report(e);
    }
  }
  async checkConnection() {
    await this.setup.refresh();
    if (this.alive) new import_obsidian2.Notice(this.setup.state.phase === "ready" ? `Codex connected: ${this.setup.state.account}` : this.setup.state.message, 1e4);
  }
  async run(h, id) {
    if (!this.settings.useCustomExecutable && !this.runtime.current()) {
      const settings = this.app.setting;
      settings?.open();
      settings?.openTabById(this.manifest.id);
      new import_obsidian2.Notice("Click Set up Codex to enable generation.");
      return;
    }
    const key = this.jobKey(h, id);
    if (this.jobs.has(key)) return;
    const client = new CodexClient(this.options());
    const controller = new AbortController();
    controller.signal.addEventListener("abort", () => client.close(), { once: true });
    const job = { client, controller, label: id };
    this.jobs.set(key, job);
    let streamed = "";
    let timer;
    const flush = () => {
      timer = void 0;
      if (!job.outputId || !this.alive) return;
      try {
        const live = h.canvas.nodes.get(job.outputId);
        if (!live) {
          controller.abort();
          return;
        }
        if (live.isEditing) {
          controller.abort();
          return;
        }
        this.adapter.setText(h, job.outputId, streamed || "_Waiting for Codex\u2026_");
      } catch (e) {
        controller.abort();
        this.report(e);
      }
    };
    try {
      this.adapter.assertWritable(h);
      const compiled = await this.compile(h, id);
      if (!this.alive || controller.signal.aborted) return;
      await client.open();
      await client.account();
      if (!this.alive || controller.signal.aborted) return;
      const source = h.canvas.nodes.get(id)?.getData();
      if (!source) throw new Error("The prompt card was deleted.");
      const graph = h.canvas.getData();
      const width = Math.max(340, source.width);
      let y = source.y;
      const x = source.x + source.width + 100;
      while (graph.nodes.some((n) => n.x < x + width && n.x + n.width > x && n.y < y + 300 && n.y + n.height > y)) y += 340;
      job.outputId = uid();
      const outputNode = this.adapter.append(h, { id: job.outputId, type: "text", text: "_Waiting for Codex\u2026_", x, y, width, height: 300, color: "6" }, [
        { id: uid(), fromNode: id, toNode: job.outputId, fromSide: "right", toSide: "left", toEnd: "arrow", label: "response" }
      ]);
      if (h.canvas.selection.size === 1 && h.canvas.selection.has(h.canvas.nodes.get(id))) {
        h.canvas.selectOnly(outputNode);
        h.canvas.zoomToSelection();
      }
      const output = await client.generate(compiled.text, (text) => {
        streamed = text;
        if (!timer) timer = setTimeout(flush, 120);
      }, controller.signal);
      if (timer) {
        clearTimeout(timer);
        timer = void 0;
      }
      if (this.alive && h.canvas.nodes.has(job.outputId) && !h.canvas.nodes.get(job.outputId).isEditing) this.adapter.setText(h, job.outputId, output, true);
    } catch (e) {
      if (timer) {
        clearTimeout(timer);
        timer = void 0;
      }
      const message = e instanceof Error ? e.message : String(e);
      if (this.alive && job.outputId && h.canvas.nodes.has(job.outputId) && !h.canvas.nodes.get(job.outputId).isEditing) {
        const current = h.canvas.nodes.get(job.outputId).getData();
        if (!streamed || current.text === streamed) this.adapter.setText(h, job.outputId, (streamed ? streamed + "\n\n" : "") + `> ${controller.signal.aborted ? "Stopped" : "Generation failed"}: ${message}`, true);
      }
      if (this.alive) this.report(e);
    } finally {
      if (timer) clearTimeout(timer);
      client.close();
      this.jobs.delete(key);
    }
  }
  cancelAll() {
    for (const job of this.jobs.values()) {
      job.controller.abort();
      job.client.close();
    }
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  async createExample() {
    const graph = { nodes: [
      { id: "artist", type: "text", text: "# Artist identity\nA self-produced songwriter from Southwest Louisiana. Observant, dry humor, concrete details. Avoid slogans and generic filler.", x: 0, y: 0, width: 350, height: 240 },
      { id: "purpose", type: "text", text: "# Song purpose\nA narrator returns to a childhood street and notices what survived a hurricane. Show mixed feelings through one specific encounter.", x: 0, y: 320, width: 350, height: 240 },
      { id: "prompt", type: "text", text: "# Draft a song concept\nUsing [Artist identity](canvas-node:artist) and [Song purpose](canvas-node:purpose), propose three distinct story premises. Give each a setting, a central encounter, and a reason this artist would sing it.\n\nClick Context to inspect the actual request, then Run.", x: 480, y: 130, width: 410, height: 300 }
    ], edges: [
      { id: "loom-ref:artist:prompt", fromNode: "artist", toNode: "prompt", fromSide: "right", toSide: "left", toEnd: "arrow", color: "5" },
      { id: "loom-ref:purpose:prompt", fromNode: "purpose", toNode: "prompt", fromSide: "right", toSide: "left", toEnd: "arrow", color: "5" }
    ] };
    try {
      let name = "Canvas Loom Example.canvas";
      let n = 1;
      while (this.app.vault.getAbstractFileByPath(name)) name = `Canvas Loom Example ${n++}.canvas`;
      const file = await this.app.vault.create(name, JSON.stringify(graph, null, 2));
      await this.app.workspace.getLeaf("tab").openFile(file);
    } catch (e) {
      this.report(e);
    }
  }
};
var ContextModal = class extends import_obsidian2.Modal {
  constructor(app, compiled, run) {
    super(app);
    this.compiled = compiled;
    this.run = run;
  }
  onOpen() {
    this.modalEl.addClass("loom-context-modal");
    this.setTitle("Connected context");
    this.contentEl.createEl("p", { text: `${this.compiled.nodes.length} cards \xB7 ${this.compiled.chars.toLocaleString()} characters. These are the contents the plugin supplies to Codex.` });
    const list = this.contentEl.createEl("ol");
    for (const node of this.compiled.nodes) list.createEl("li", { text: `${node.name} \xB7 ${node.type}${node.id === this.compiled.rootId ? " \xB7 prompt" : ""}` });
    const details = this.contentEl.createEl("details");
    details.createEl("summary", { text: "Inspect complete request" });
    details.createEl("pre", { text: this.compiled.text });
    new import_obsidian2.Setting(this.contentEl).addButton((b2) => b2.setButtonText("Copy request").onClick(async () => {
      await navigator.clipboard.writeText(this.compiled.text);
      new import_obsidian2.Notice("Request copied.");
    })).addButton((b2) => b2.setButtonText("Run with Codex").setCta().onClick(() => {
      this.close();
      this.run();
    }));
  }
  onClose() {
    this.contentEl.empty();
  }
};
var LoomSettings = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  unsubscribe;
  display() {
    const { containerEl: el } = this;
    el.empty();
    el.createEl("h2", { text: "Canvas Loom" });
    el.createEl("p", { text: "Type @ in a Canvas text card to reference another node, or connect cards with arrows. Set up Codex below to run prompts with your ChatGPT account." });
    const setupCard = el.createDiv({ cls: "loom-setup" });
    const render = () => {
      const state = this.plugin.setup.state;
      setupCard.empty();
      setupCard.setAttribute("data-phase", state.phase);
      const title = setupCard.createDiv({ cls: "loom-setup-title" });
      title.createSpan({ text: state.phase === "ready" ? "Codex is ready" : "Connect Codex" });
      title.createSpan({ cls: "loom-setup-badge", text: state.phase === "ready" ? "Ready" : this.plugin.setup.busy ? "Working\u2026" : state.phase === "error" ? "Needs attention" : "Setup" });
      setupCard.createEl("p", { text: state.message, cls: "loom-setup-message", attr: { role: state.phase === "error" ? "alert" : "status", "aria-live": "polite" } });
      if (state.account) setupCard.createEl("p", { text: state.account, cls: "loom-setup-account" });
      if (state.version) setupCard.createDiv({ text: `Codex ${state.version}`, cls: "loom-setup-version" });
      if (state.phase === "downloading" && state.total) {
        const bar = setupCard.createEl("progress");
        bar.max = state.total;
        bar.value = state.received ?? 0;
        const mb = (n) => (n / 1e6).toFixed(1);
        setupCard.createDiv({ cls: "loom-setup-download", text: `${mb(state.received ?? 0)} / ${mb(state.total)} MB` });
      }
      const actions = setupCard.createDiv({ cls: "loom-setup-actions" });
      if (this.plugin.setup.busy) {
        const cancel = actions.createEl("button", { text: "Cancel" });
        cancel.onclick = () => this.plugin.setup.cancel();
        if (state.authUrl) {
          const signIn = actions.createEl("button", { text: "Open sign-in page" });
          signIn.onclick = () => {
            void require("electron").shell.openExternal(state.authUrl).catch((e) => this.plugin.report(e));
          };
        }
      } else {
        const label = state.phase === "ready" ? "Reconnect" : state.phase === "sign-in-required" ? "Sign in with ChatGPT" : state.phase === "error" ? "Retry setup" : "Set up Codex";
        const primary = actions.createEl("button", { text: label, cls: "mod-cta" });
        primary.onclick = () => void this.plugin.setup.start();
        if (this.plugin.runtime.current() && !this.plugin.settings.useCustomExecutable) {
          const repair = actions.createEl("button", { text: "Repair installation" });
          repair.onclick = () => void this.plugin.setup.start(true);
        }
        if (state.phase === "error") {
          const copy = actions.createEl("button", { text: "Copy error" });
          copy.onclick = () => {
            require("electron").clipboard.writeText(state.message);
            new import_obsidian2.Notice("Error copied.");
          };
        }
      }
    };
    this.unsubscribe?.();
    this.unsubscribe = this.plugin.setup.subscribe(render);
    if (this.plugin.setup.state.phase === "idle" && this.plugin.runtime.current()) void this.plugin.setup.refresh();
    el.createEl("p", { cls: "setting-item-description", text: "Setup downloads Codex and its dependencies automatically. An existing ChatGPT login is reused when available; otherwise, sign-in opens in your browser. No Terminal commands or API key are required." });
    const advanced = el.createEl("details", { cls: "loom-advanced" });
    advanced.createEl("summary", { text: "Advanced connection settings" });
    new import_obsidian2.Setting(advanced).setName("Use my own Codex installation").setDesc("Optional. The managed installation is recommended.").addToggle((t) => t.setValue(this.plugin.settings.useCustomExecutable).onChange(async (v2) => {
      this.plugin.settings.useCustomExecutable = v2;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(advanced).setName("Custom executable").setDesc("Used only when the option above is enabled.").addText((t) => t.setPlaceholder("/absolute/path/to/codex").setValue(this.plugin.settings.executable).onChange(async (v2) => {
      this.plugin.settings.executable = v2.trim();
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(el).setName("Model").setDesc("Leave blank to use the model selected by your Codex configuration.").addText((t) => t.setValue(this.plugin.settings.model).onChange(async (v2) => {
      this.plugin.settings.model = v2.trim();
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(el).setName("Timeout in seconds").addText((t) => t.setValue(String(this.plugin.settings.timeoutSeconds)).onChange(async (v2) => {
      const n = Number(v2);
      if (Number.isFinite(n) && n >= 30 && n <= 1800) {
        this.plugin.settings.timeoutSeconds = Math.floor(n);
        await this.plugin.saveSettings();
      }
    }));
    new import_obsidian2.Setting(el).setName("Maximum request characters").setDesc("Oversized requests fail visibly instead of dropping context.").addText((t) => t.setValue(String(this.plugin.settings.maxChars)).onChange(async (v2) => {
      const n = Number(v2);
      if (Number.isFinite(n) && n >= 1e3 && n <= 1e6) {
        this.plugin.settings.maxChars = Math.floor(n);
        await this.plugin.saveSettings();
      }
    }));
    new import_obsidian2.Setting(el).setName("Show card controls").setDesc("Show Context and Run buttons on text cards. Commands remain available when hidden.").addToggle((t) => t.setValue(this.plugin.settings.showButtons).onChange(async (v2) => {
      this.plugin.settings.showButtons = v2;
      await this.plugin.saveSettings();
    }));
    el.createEl("p", { text: "Runs send the selected prompt and connected text to OpenAI through Codex and use that account\u2019s allowance. No API key is stored in your vault. Generation is read-only; results are written by this plugin as new Canvas cards. A URL card supplies its URL only. This version does not read images, audio, or PDFs." });
    el.createEl("p", { text: "Mentions own their reference arrows: delete the inline mention to remove its arrow. Hand-drawn arrows remain independent. Canvas IDs belong to one canvas; copying a mention to another canvas requires choosing its source again." });
  }
  hide() {
    this.unsubscribe?.();
    this.unsubscribe = void 0;
  }
};
