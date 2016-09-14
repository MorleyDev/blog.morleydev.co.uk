SystemJS.config({
  paths: {
    "npm:": "jspm_packages/npm/",
    "github:": "jspm_packages/github/"
  },
  browserConfig: {
    "baseURL": "/",
    "paths": {
      "blog.morleydev.co.uk/": "src/"
    }
  },
  nodeConfig: {
    "paths": {
      "blog.morleydev.co.uk/": "server/"
    }
  },
  devConfig: {
    "map": {
      "plugin-babel": "npm:systemjs-plugin-babel@0.0.12",
      "ts": "github:frankwallis/plugin-typescript@5.0.8",
      "scss": "github:mobilexag/plugin-sass@0.4.6",
      "babel-plugin-transform-react-jsx": "npm:babel-plugin-transform-react-jsx@6.8.0",
      "typemoq": "npm:typemoq@0.3.2",
      "babel-runtime": "npm:babel-runtime@6.11.6",
      "tape": "npm:tape@4.6.0"
    },
    "packages": {
      "github:frankwallis/plugin-typescript@5.0.8": {
        "map": {
          "typescript": "npm:typescript@2.0.0"
        }
      },
      "github:mobilexag/plugin-sass@0.4.6": {
        "map": {
          "lodash": "npm:lodash@4.14.1",
          "postcss": "npm:postcss@5.1.1",
          "autoprefixer": "npm:autoprefixer@6.3.7",
          "sass.js": "npm:sass.js@0.9.11",
          "path": "github:jspm/nodelibs-path@0.1.0",
          "fs": "github:jspm/nodelibs-fs@0.1.2",
          "url": "github:jspm/nodelibs-url@0.1.0",
          "reqwest": "github:ded/reqwest@2.0.5"
        }
      },
      "npm:autoprefixer@6.3.7": {
        "map": {
          "postcss": "npm:postcss@5.1.1",
          "normalize-range": "npm:normalize-range@0.1.2",
          "postcss-value-parser": "npm:postcss-value-parser@3.3.0",
          "caniuse-db": "npm:caniuse-db@1.0.30000512",
          "num2fraction": "npm:num2fraction@1.2.2",
          "browserslist": "npm:browserslist@1.3.5"
        }
      },
      "npm:postcss@5.1.1": {
        "map": {
          "supports-color": "npm:supports-color@3.1.2",
          "source-map": "npm:source-map@0.5.6",
          "js-base64": "npm:js-base64@2.1.9"
        }
      },
      "npm:supports-color@3.1.2": {
        "map": {
          "has-flag": "npm:has-flag@1.0.0"
        }
      },
      "npm:browserslist@1.3.5": {
        "map": {
          "caniuse-db": "npm:caniuse-db@1.0.30000512"
        }
      },
      "github:jspm/nodelibs-path@0.1.0": {
        "map": {
          "path-browserify": "npm:path-browserify@0.0.0"
        }
      },
      "github:jspm/nodelibs-url@0.1.0": {
        "map": {
          "url": "npm:url@0.10.3"
        }
      },
      "npm:url@0.10.3": {
        "map": {
          "querystring": "npm:querystring@0.2.0",
          "punycode": "npm:punycode@1.3.2"
        }
      },
      "npm:babel-plugin-transform-react-jsx@6.8.0": {
        "map": {
          "babel-helper-builder-react-jsx": "npm:babel-helper-builder-react-jsx@6.9.0",
          "babel-plugin-syntax-jsx": "npm:babel-plugin-syntax-jsx@6.8.0",
          "babel-runtime": "npm:babel-runtime@6.11.6"
        }
      },
      "npm:babel-helper-builder-react-jsx@6.9.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.11.6",
          "esutils": "npm:esutils@2.0.2",
          "babel-types": "npm:babel-types@6.11.1",
          "lodash": "npm:lodash@4.14.1"
        }
      },
      "npm:babel-plugin-syntax-jsx@6.8.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.11.6"
        }
      },
      "npm:babel-types@6.11.1": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.11.6",
          "esutils": "npm:esutils@2.0.2",
          "lodash": "npm:lodash@4.14.1",
          "to-fast-properties": "npm:to-fast-properties@1.0.2",
          "babel-traverse": "npm:babel-traverse@6.12.0"
        }
      },
      "npm:babel-traverse@6.12.0": {
        "map": {
          "lodash": "npm:lodash@4.14.1",
          "babel-runtime": "npm:babel-runtime@6.11.6",
          "babel-types": "npm:babel-types@6.11.1",
          "invariant": "npm:invariant@2.2.1",
          "babel-messages": "npm:babel-messages@6.8.0",
          "babel-code-frame": "npm:babel-code-frame@6.11.0",
          "babylon": "npm:babylon@6.8.4",
          "debug": "npm:debug@2.2.0",
          "globals": "npm:globals@8.18.0"
        }
      },
      "npm:babel-messages@6.8.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.11.6"
        }
      },
      "npm:babel-code-frame@6.11.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.11.6",
          "esutils": "npm:esutils@2.0.2",
          "js-tokens": "npm:js-tokens@2.0.0",
          "chalk": "npm:chalk@1.1.3"
        }
      },
      "npm:babylon@6.8.4": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.11.6"
        }
      },
      "npm:chalk@1.1.3": {
        "map": {
          "ansi-styles": "npm:ansi-styles@2.2.1",
          "strip-ansi": "npm:strip-ansi@3.0.1",
          "has-ansi": "npm:has-ansi@2.0.0",
          "supports-color": "npm:supports-color@2.0.0",
          "escape-string-regexp": "npm:escape-string-regexp@1.0.5"
        }
      },
      "npm:strip-ansi@3.0.1": {
        "map": {
          "ansi-regex": "npm:ansi-regex@2.0.0"
        }
      },
      "npm:has-ansi@2.0.0": {
        "map": {
          "ansi-regex": "npm:ansi-regex@2.0.0"
        }
      },
      "npm:typemoq@0.3.2": {
        "map": {
          "underscore": "npm:underscore@1.8.3"
        }
      },
      "npm:tape@4.6.0": {
        "map": {
          "deep-equal": "npm:deep-equal@1.0.1",
          "function-bind": "npm:function-bind@1.1.0",
          "through": "npm:through@2.3.8",
          "has": "npm:has@1.0.1",
          "resumer": "npm:resumer@0.0.0",
          "minimist": "npm:minimist@1.2.0",
          "resolve": "npm:resolve@1.1.7",
          "object-inspect": "npm:object-inspect@1.2.1",
          "defined": "npm:defined@1.0.0",
          "inherits": "npm:inherits@2.0.1",
          "string.prototype.trim": "npm:string.prototype.trim@1.1.2",
          "glob": "npm:glob@7.0.5"
        }
      },
      "npm:has@1.0.1": {
        "map": {
          "function-bind": "npm:function-bind@1.1.0"
        }
      },
      "npm:resumer@0.0.0": {
        "map": {
          "through": "npm:through@2.3.8"
        }
      },
      "npm:string.prototype.trim@1.1.2": {
        "map": {
          "function-bind": "npm:function-bind@1.1.0",
          "define-properties": "npm:define-properties@1.1.2",
          "es-abstract": "npm:es-abstract@1.5.1"
        }
      },
      "npm:glob@7.0.5": {
        "map": {
          "inherits": "npm:inherits@2.0.1",
          "inflight": "npm:inflight@1.0.5",
          "path-is-absolute": "npm:path-is-absolute@1.0.0",
          "fs.realpath": "npm:fs.realpath@1.0.0",
          "once": "npm:once@1.3.3",
          "minimatch": "npm:minimatch@3.0.2"
        }
      },
      "npm:es-abstract@1.5.1": {
        "map": {
          "function-bind": "npm:function-bind@1.1.0",
          "is-regex": "npm:is-regex@1.0.3",
          "es-to-primitive": "npm:es-to-primitive@1.1.1",
          "is-callable": "npm:is-callable@1.1.3"
        }
      },
      "npm:inflight@1.0.5": {
        "map": {
          "once": "npm:once@1.3.3",
          "wrappy": "npm:wrappy@1.0.2"
        }
      },
      "npm:define-properties@1.1.2": {
        "map": {
          "foreach": "npm:foreach@2.0.5",
          "object-keys": "npm:object-keys@1.0.11"
        }
      },
      "npm:once@1.3.3": {
        "map": {
          "wrappy": "npm:wrappy@1.0.2"
        }
      },
      "npm:minimatch@3.0.2": {
        "map": {
          "brace-expansion": "npm:brace-expansion@1.1.6"
        }
      },
      "npm:es-to-primitive@1.1.1": {
        "map": {
          "is-callable": "npm:is-callable@1.1.3",
          "is-symbol": "npm:is-symbol@1.0.1",
          "is-date-object": "npm:is-date-object@1.0.1"
        }
      },
      "npm:brace-expansion@1.1.6": {
        "map": {
          "concat-map": "npm:concat-map@0.0.1",
          "balanced-match": "npm:balanced-match@0.4.2"
        }
      },
      "npm:debug@2.2.0": {
        "map": {
          "ms": "npm:ms@0.7.1"
        }
      }
    }
  },
  transpiler: "plugin-babel",
  typescriptOptions: {
    "module": "es6",
    "target": "es6",
    "typeCheck": "strict",
    "tsconfig": true
  },
  sassPluginOptions: {
    "autoprefixer": true
  },
  babelOptions: {
    "plugins": [
      "babel-plugin-transform-react-jsx"
    ]
  },
  packages: {
    "blog.morleydev.co.uk": {
      "main": "index.js",
      "meta": {
        "*.js": {
          "loader": "plugin-babel"
        },
        "*.jsx": {
          "loader": "plugin-babel"
        }
      }
    }
  },
  meta: {
    "*.ts": {
      "loader": "ts"
    },
    "*.tsx": {
      "loader": "ts"
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {
    "assert": "github:jspm/nodelibs-assert@0.2.0-alpha",
    "bootstrap": "npm:bootstrap@4.0.0-alpha.3",
    "buffer": "github:jspm/nodelibs-buffer@0.2.0-alpha",
    "child_process": "github:jspm/nodelibs-child_process@0.2.0-alpha",
    "constants": "github:jspm/nodelibs-constants@0.2.0-alpha",
    "crossroads": "npm:crossroads@0.12.2",
    "crypto": "github:jspm/nodelibs-crypto@0.2.0-alpha",
    "domain": "github:jspm/nodelibs-domain@0.2.0-alpha",
    "es5-shim": "github:es-shims/es5-shim@4.5.9",
    "es6-shim": "github:es-shims/es6-shim@0.35.1",
    "events": "github:jspm/nodelibs-events@0.2.0-alpha",
    "firebase": "github:firebase/firebase-bower@3.2.1",
    "font-awesome": "npm:font-awesome@4.6.3",
    "fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
    "http": "github:jspm/nodelibs-http@0.2.0-alpha",
    "https": "github:jspm/nodelibs-https@0.2.0-alpha",
    "immutable": "npm:immutable@3.8.1",
    "os": "github:jspm/nodelibs-os@0.2.0-alpha",
    "path": "github:jspm/nodelibs-path@0.2.0-alpha",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha",
    "react": "npm:react@15.3.0",
    "react-dom": "npm:react-dom@15.3.0",
    "redux": "npm:redux@3.5.2",
    "redux-devtools": "npm:redux-devtools@3.3.1",
    "redux-devtools-dock-monitor": "npm:redux-devtools-dock-monitor@1.1.1",
    "redux-devtools-log-monitor": "npm:redux-devtools-log-monitor@1.0.11",
    "rxjs": "npm:rxjs@5.0.0-beta.10",
    "showdown": "github:showdownjs/showdown@1.4.2",
    "stream": "github:jspm/nodelibs-stream@0.2.0-alpha",
    "string_decoder": "github:jspm/nodelibs-string_decoder@0.2.0-alpha",
    "url": "github:jspm/nodelibs-url@0.2.0-alpha",
    "util": "github:jspm/nodelibs-util@0.2.0-alpha",
    "vm": "github:jspm/nodelibs-vm@0.2.0-alpha",
    "zlib": "github:jspm/nodelibs-zlib@0.2.0-alpha"
  },
  packages: {
    "github:jspm/nodelibs-os@0.2.0-alpha": {
      "map": {
        "os-browserify": "npm:os-browserify@0.2.1"
      }
    },
    "github:jspm/nodelibs-crypto@0.2.0-alpha": {
      "map": {
        "crypto-browserify": "npm:crypto-browserify@3.11.0"
      }
    },
    "npm:crypto-browserify@3.11.0": {
      "map": {
        "browserify-cipher": "npm:browserify-cipher@1.0.0",
        "browserify-sign": "npm:browserify-sign@4.0.0",
        "diffie-hellman": "npm:diffie-hellman@5.0.2",
        "create-hash": "npm:create-hash@1.1.2",
        "pbkdf2": "npm:pbkdf2@3.0.4",
        "create-hmac": "npm:create-hmac@1.1.4",
        "inherits": "npm:inherits@2.0.1",
        "public-encrypt": "npm:public-encrypt@4.0.0",
        "randombytes": "npm:randombytes@2.0.3",
        "create-ecdh": "npm:create-ecdh@4.0.0"
      }
    },
    "npm:browserify-sign@4.0.0": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2",
        "create-hmac": "npm:create-hmac@1.1.4",
        "inherits": "npm:inherits@2.0.1",
        "bn.js": "npm:bn.js@4.11.5",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "parse-asn1": "npm:parse-asn1@5.0.0",
        "elliptic": "npm:elliptic@6.3.1"
      }
    },
    "npm:create-hash@1.1.2": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "sha.js": "npm:sha.js@2.4.5",
        "ripemd160": "npm:ripemd160@1.0.1",
        "cipher-base": "npm:cipher-base@1.0.2"
      }
    },
    "npm:create-hmac@1.1.4": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2",
        "inherits": "npm:inherits@2.0.1"
      }
    },
    "npm:pbkdf2@3.0.4": {
      "map": {
        "create-hmac": "npm:create-hmac@1.1.4"
      }
    },
    "npm:public-encrypt@4.0.0": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2",
        "bn.js": "npm:bn.js@4.11.5",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "parse-asn1": "npm:parse-asn1@5.0.0",
        "randombytes": "npm:randombytes@2.0.3"
      }
    },
    "npm:browserify-cipher@1.0.0": {
      "map": {
        "browserify-des": "npm:browserify-des@1.0.0",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "browserify-aes": "npm:browserify-aes@1.0.6"
      }
    },
    "npm:diffie-hellman@5.0.2": {
      "map": {
        "miller-rabin": "npm:miller-rabin@4.0.0",
        "bn.js": "npm:bn.js@4.11.5",
        "randombytes": "npm:randombytes@2.0.3"
      }
    },
    "npm:browserify-des@1.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "des.js": "npm:des.js@1.0.0",
        "cipher-base": "npm:cipher-base@1.0.2"
      }
    },
    "npm:miller-rabin@4.0.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.5",
        "brorand": "npm:brorand@1.0.5"
      }
    },
    "npm:sha.js@2.4.5": {
      "map": {
        "inherits": "npm:inherits@2.0.1"
      }
    },
    "npm:browserify-rsa@4.0.1": {
      "map": {
        "bn.js": "npm:bn.js@4.11.5",
        "randombytes": "npm:randombytes@2.0.3"
      }
    },
    "npm:parse-asn1@5.0.0": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "pbkdf2": "npm:pbkdf2@3.0.4",
        "browserify-aes": "npm:browserify-aes@1.0.6",
        "asn1.js": "npm:asn1.js@4.8.0"
      }
    },
    "npm:create-ecdh@4.0.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.5",
        "elliptic": "npm:elliptic@6.3.1"
      }
    },
    "npm:evp_bytestokey@1.0.0": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2"
      }
    },
    "npm:des.js@1.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:browserify-aes@1.0.6": {
      "map": {
        "cipher-base": "npm:cipher-base@1.0.2",
        "create-hash": "npm:create-hash@1.1.2",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "inherits": "npm:inherits@2.0.1",
        "buffer-xor": "npm:buffer-xor@1.0.3"
      }
    },
    "npm:asn1.js@4.8.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.5",
        "inherits": "npm:inherits@2.0.1",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:cipher-base@1.0.2": {
      "map": {
        "inherits": "npm:inherits@2.0.1"
      }
    },
    "npm:elliptic@6.3.1": {
      "map": {
        "bn.js": "npm:bn.js@4.11.5",
        "inherits": "npm:inherits@2.0.1",
        "hash.js": "npm:hash.js@1.0.3",
        "brorand": "npm:brorand@1.0.5"
      }
    },
    "npm:hash.js@1.0.3": {
      "map": {
        "inherits": "npm:inherits@2.0.1"
      }
    },
    "github:jspm/nodelibs-buffer@0.2.0-alpha": {
      "map": {
        "buffer-browserify": "npm:buffer@4.7.1"
      }
    },
    "github:jspm/nodelibs-stream@0.2.0-alpha": {
      "map": {
        "stream-browserify": "npm:stream-browserify@2.0.1"
      }
    },
    "npm:stream-browserify@2.0.1": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "readable-stream": "npm:readable-stream@2.1.4"
      }
    },
    "npm:buffer@4.7.1": {
      "map": {
        "ieee754": "npm:ieee754@1.1.6",
        "isarray": "npm:isarray@1.0.0",
        "base64-js": "npm:base64-js@1.1.2"
      }
    },
    "npm:readable-stream@2.1.4": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "isarray": "npm:isarray@1.0.0",
        "buffer-shims": "npm:buffer-shims@1.0.0",
        "util-deprecate": "npm:util-deprecate@1.0.2",
        "core-util-is": "npm:core-util-is@1.0.2",
        "string_decoder": "npm:string_decoder@0.10.31",
        "process-nextick-args": "npm:process-nextick-args@1.0.7"
      }
    },
    "github:jspm/nodelibs-string_decoder@0.2.0-alpha": {
      "map": {
        "string_decoder-browserify": "npm:string_decoder@0.10.31"
      }
    },
    "npm:babel-runtime@6.11.6": {
      "map": {
        "regenerator-runtime": "npm:regenerator-runtime@0.9.5",
        "core-js": "npm:core-js@2.4.1"
      }
    },
    "npm:invariant@2.2.1": {
      "map": {
        "loose-envify": "npm:loose-envify@1.2.0"
      }
    },
    "npm:loose-envify@1.2.0": {
      "map": {
        "js-tokens": "npm:js-tokens@1.0.3"
      }
    },
    "npm:redux-devtools-dock-monitor@1.1.1": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.11.6",
        "react-dock": "npm:react-dock@0.2.3",
        "parse-key": "npm:parse-key@0.2.1",
        "react-pure-render": "npm:react-pure-render@1.0.2"
      }
    },
    "npm:redux-devtools-log-monitor@1.0.11": {
      "map": {
        "lodash.debounce": "npm:lodash.debounce@4.0.7",
        "redux-devtools-themes": "npm:redux-devtools-themes@1.0.0",
        "react-json-tree": "npm:react-json-tree@0.6.8",
        "react-pure-render": "npm:react-pure-render@1.0.2"
      }
    },
    "npm:bootstrap@4.0.0-alpha.3": {
      "map": {
        "jquery": "npm:jquery@3.1.0",
        "tether": "github:HubSpot/tether@1.3.3"
      }
    },
    "npm:react-dock@0.2.3": {
      "map": {
        "lodash.debounce": "npm:lodash.debounce@3.1.1",
        "object-assign": "npm:object-assign@4.1.0"
      }
    },
    "npm:crossroads@0.12.2": {
      "map": {
        "signals": "npm:signals@1.0.0"
      }
    },
    "npm:react-json-tree@0.6.8": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.11.6",
        "react-pure-render": "npm:react-pure-render@1.0.2",
        "babel-plugin-transform-runtime": "npm:babel-plugin-transform-runtime@6.12.0",
        "react-mixin": "npm:react-mixin@1.7.0"
      }
    },
    "npm:redux-devtools-themes@1.0.0": {
      "map": {
        "base16": "npm:base16@1.0.0"
      }
    },
    "npm:lodash.debounce@3.1.1": {
      "map": {
        "lodash._getnative": "npm:lodash._getnative@3.9.1"
      }
    },
    "npm:react@15.3.0": {
      "map": {
        "object-assign": "npm:object-assign@4.1.0",
        "fbjs": "npm:fbjs@0.8.3",
        "loose-envify": "npm:loose-envify@1.2.0"
      }
    },
    "npm:font-awesome@4.6.3": {
      "map": {
        "css": "github:systemjs/plugin-css@0.1.25"
      }
    },
    "npm:rxjs@5.0.0-beta.10": {
      "map": {
        "symbol-observable": "npm:symbol-observable@1.0.1"
      }
    },
    "npm:redux-devtools@3.3.1": {
      "map": {
        "redux-devtools-instrument": "npm:redux-devtools-instrument@1.1.1",
        "lodash": "npm:lodash@4.14.1",
        "react-redux": "npm:react-redux@4.4.5"
      }
    },
    "npm:redux-devtools-instrument@1.1.1": {
      "map": {
        "symbol-observable": "npm:symbol-observable@0.2.4",
        "lodash": "npm:lodash@4.14.1"
      }
    },
    "npm:redux@3.5.2": {
      "map": {
        "symbol-observable": "npm:symbol-observable@0.2.4",
        "loose-envify": "npm:loose-envify@1.2.0",
        "lodash": "npm:lodash@4.14.1",
        "lodash-es": "npm:lodash-es@4.14.1"
      }
    },
    "npm:fbjs@0.8.3": {
      "map": {
        "core-js": "npm:core-js@1.2.7",
        "immutable": "npm:immutable@3.8.1",
        "object-assign": "npm:object-assign@4.1.0",
        "loose-envify": "npm:loose-envify@1.2.0",
        "isomorphic-fetch": "npm:isomorphic-fetch@2.2.1",
        "ua-parser-js": "npm:ua-parser-js@0.7.10",
        "promise": "npm:promise@7.1.1"
      }
    },
    "npm:babel-plugin-transform-runtime@6.12.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.11.6"
      }
    },
    "npm:react-mixin@1.7.0": {
      "map": {
        "object-assign": "npm:object-assign@2.1.1",
        "smart-mixin": "npm:smart-mixin@1.2.1"
      }
    },
    "npm:isomorphic-fetch@2.2.1": {
      "map": {
        "node-fetch": "npm:node-fetch@1.5.3",
        "whatwg-fetch": "npm:whatwg-fetch@1.0.0"
      }
    },
    "npm:react-redux@4.4.5": {
      "map": {
        "lodash": "npm:lodash@4.14.1",
        "loose-envify": "npm:loose-envify@1.2.0",
        "hoist-non-react-statics": "npm:hoist-non-react-statics@1.2.0",
        "invariant": "npm:invariant@2.2.1"
      }
    },
    "npm:promise@7.1.1": {
      "map": {
        "asap": "npm:asap@2.0.4"
      }
    },
    "npm:node-fetch@1.5.3": {
      "map": {
        "is-stream": "npm:is-stream@1.1.0",
        "encoding": "npm:encoding@0.1.12"
      }
    },
    "npm:encoding@0.1.12": {
      "map": {
        "iconv-lite": "npm:iconv-lite@0.4.13"
      }
    },
    "github:jspm/nodelibs-domain@0.2.0-alpha": {
      "map": {
        "domain-browserify": "npm:domain-browser@1.1.7"
      }
    },
    "github:jspm/nodelibs-zlib@0.2.0-alpha": {
      "map": {
        "zlib-browserify": "npm:browserify-zlib@0.1.4"
      }
    },
    "github:jspm/nodelibs-http@0.2.0-alpha": {
      "map": {
        "http-browserify": "npm:stream-http@2.3.1"
      }
    },
    "npm:browserify-zlib@0.1.4": {
      "map": {
        "readable-stream": "npm:readable-stream@2.1.4",
        "pako": "npm:pako@0.2.9"
      }
    },
    "npm:stream-http@2.3.1": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "readable-stream": "npm:readable-stream@2.1.4",
        "xtend": "npm:xtend@4.0.1",
        "to-arraybuffer": "npm:to-arraybuffer@1.0.1",
        "builtin-status-codes": "npm:builtin-status-codes@2.0.0"
      }
    },
    "github:jspm/nodelibs-url@0.2.0-alpha": {
      "map": {
        "url-browserify": "npm:url@0.11.0"
      }
    },
    "npm:url@0.11.0": {
      "map": {
        "querystring": "npm:querystring@0.2.0",
        "punycode": "npm:punycode@1.3.2"
      }
    }
  }
});
