// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// https://thebookofshaders.com/
console.clear();

var CanvasManager =
/*#__PURE__*/
function () {
  function CanvasManager(element) {
    _classCallCheck(this, CanvasManager);

    this.canvas = document.querySelector(element);
    this.fragmentShaderSource = fragmentShaders[element.replace('#', '')];
    this.canvas.parentElement.querySelector('.webgl.dynamic').textContent = this.fragmentShaderSource;
    this.canvas.insertAdjacentHTML('afterend', "<small class=\"canvas-name\">".concat(element, "</small>"));
  }

  _createClass(CanvasManager, [{
    key: "init",
    value: function init() {
      var _this = this;

      this.camera = new THREE.Camera();
      this.camera.position.z = 1;
      this.scene = new THREE.Scene();
      this.geometry = new THREE.PlaneBufferGeometry(2, 2);
      this.uniforms = {
        u_time: {
          type: "f",
          value: 1.0
        },
        u_resolution: {
          type: "v2",
          value: new THREE.Vector2()
        },
        u_mouse: {
          type: "v2",
          value: new THREE.Vector2()
        }
      };
      this.material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: this.fragmentShaderSource
      });
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.scene.add(this.mesh);
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.onWindowResize();
      window.addEventListener('resize', function () {
        return _this.onWindowResize();
      }, false);

      this.canvas.onmousemove = function (e) {
        _this.uniforms.u_mouse.value.x = e.layerX;
        _this.uniforms.u_mouse.value.y = e.layerY;
      };

      this.animate();
    }
  }, {
    key: "onWindowResize",
    value: function onWindowResize(event) {
      this.renderer.setSize(document.body.clientWidth / 2, document.body.clientWidth / 2);
      this.uniforms.u_resolution.value.x = this.renderer.domElement.width;
      this.uniforms.u_resolution.value.y = this.renderer.domElement.height;
    }
  }, {
    key: "animate",
    value: function animate() {
      var _this2 = this;

      requestAnimationFrame(function () {
        return _this2.animate();
      });
      this.render();
    }
  }, {
    key: "render",
    value: function render() {
      this.uniforms.u_time.value += 0.05;
      this.renderer.render(this.scene, this.camera);
    }
  }]);

  return CanvasManager;
}();

var fragmentShaders = {
  lesson1: "\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\nvoid main() {\n  gl_FragColor = vec4(vec3(0.2,0.4,0.9),1.0);\n}\n",
  lesson2: "\nprecision mediump float;\n\nuniform float u_time;\nuniform vec2 u_mouse;\n\nvoid main() {\n  gl_FragColor = vec4(abs(sin(u_time)),abs(u_mouse.x*0.001),abs(u_mouse.y*0.001) ,1.0);\n}\n",
  lesson3: "\n#ifdef GL_ES\n  precision mediump float;\n#endif\n\nuniform vec2 u_resolution;\nuniform vec2 u_mouse;\nuniform float u_time;\n\nvoid main() {\n  vec2 st = gl_FragCoord.xy/u_resolution;\n  gl_FragColor = vec4(abs(cos(u_time * st.x)),abs(sin(u_time * st.y)),abs(sin(u_time * st.y * st.x)),1.0);\n}\n",
  lesson4: "\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\n#define PI 3.14159265359\n\nuniform vec2 u_resolution;\nuniform vec2 u_mouse;\nuniform float u_time;\n\nfloat plot(vec2 st, float pct){\n  return  smoothstep( pct-0.02, pct, st.y) -\n          smoothstep( pct, pct+0.02, st.y);\n}\n\nvoid main() {\n    vec2 st = gl_FragCoord.xy/u_resolution;\n\n    float y = log(st.x * PI);\n\n    vec3 color = vec3(y);\n\n    float pct = plot(st,y);\n    color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);\n\n    gl_FragColor = vec4(color,1.0);\n}\n",
  lesson5: "\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\nuniform vec2 u_resolution;\nuniform vec2 u_mouse;\nuniform float u_time;\n\nfloat plot(vec2 st, float pct){\n  return  smoothstep( pct-0.02, pct, st.y) -\n          smoothstep( pct, pct+0.02, st.y);\n}\n\nvoid main() {\n    vec2 st = gl_FragCoord.xy/u_resolution;\n\n    // Smooth interpolation between 0.1 and 0.9\n    float y = smoothstep(0.2,0.5,st.x) - smoothstep(0.5,0.8,st.x);\n\n    vec3 color = vec3(y);\n\n    float pct = plot(st,y);\n    color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);\n\n    gl_FragColor = vec4(color,1.0);\n}\n",
  lesson6: "\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\n#define PI 3.141592653589793\n#define HALF_PI 1.5707963267948966\n\nuniform vec2 u_resolution;\nuniform float u_time;\n\nvec3 colorA = vec3(0.149,0.141,0.912);\nvec3 colorB = vec3(0.649,0.641,0.912);\n\nfloat circularOut(float t) {\n  return sqrt((2.0 - t) * t);\n}\n\nvoid main() {\n    vec3 color = vec3(0.0);\n\n    float t = u_time*0.5;\n    float pct = circularOut( abs(fract(t)*2.0-1.) );\n    // Mix uses pct (a value from 0-1) to\n    // mix the two colors\n    gl_FragColor = vec4(vec3(mix(colorA, colorB, pct)),1.0);\n}\n",
  lesson7: "\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\n#define PI 3.14159265359\n\nuniform vec2 u_resolution;\nuniform vec2 u_mouse;\nuniform float u_time;\n\nvec3 colorA = vec3(0.149,0.141,0.912);\nvec3 colorB = vec3(1.000,0.833,0.224);\n\nfloat plot (vec2 st, float pct){\n  return  smoothstep( pct-0.01, pct, st.x) -\n          smoothstep( pct, pct+0.01, st.x);\n}\n\nvoid main() {\n  vec2 st = gl_FragCoord.xy/u_resolution.xy;\n  vec3 color = vec3(0.0);\n\n  vec3 pct = vec3(st.y);\n\n  pct.r = smoothstep(0.2,0.0, st.y);\n  pct.g = smoothstep(st.x*0.1,st.x*0.0,st.y*0.1);\n  pct.b = pow(st.y,0.5);\n\n  color = mix(colorA, colorB, pct);\n\n  // Plot transition lines for each channel\n  color = mix(color,vec3(1.0,0.0,0.0),plot(st,pct.r));\n  color = mix(color,vec3(0.0,1.0,0.0),plot(st,pct.g));\n  color = mix(color,vec3(0.0,0.0,1.0),plot(st,pct.b));\n\n  gl_FragColor = vec4(color,1.0);\n}\n",
  lesson8: "\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\n#define TWO_PI 6.28318530718\n#define PI 3.14159265359\n\nuniform vec2 u_resolution;\nuniform float u_time;\n\n//  Function from I\xF1igo Quiles\n//  https://www.shadertoy.com/view/MsS3Wc\nvec3 hsb2rgb( in vec3 c ){\n    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),\n                             6.0)-3.0)-1.0,\n                     0.0,\n                     1.0 );\n    rgb = rgb*rgb*(3.0-2.0*rgb);\n    return c.z * mix( vec3(1.0), rgb, c.y);\n}\n\nvoid main(){\n    vec2 st = gl_FragCoord.xy/u_resolution;\n    vec3 color = vec3(0.0);\n\n    // Use polar coordinates instead of cartesian\n    vec2 toCenter = vec2(0.5)-st;\n    float angle = atan(toCenter.y,toCenter.x);\n    float radius = length(toCenter)*2.0;\n\n    // Map the angle (-PI to PI) to the Hue (from 0 to 1)\n    // and the Saturation to the radius\n    color = hsb2rgb(vec3((angle/TWO_PI)+cos(u_time) * 0.5,radius,1.0));\n\n    gl_FragColor = vec4(color,1.0);\n}\n",
  lesson9: "\n// Author @patriciogv - 2015\n// http://patriciogonzalezvivo.com\n\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\nuniform vec2 u_resolution;\nuniform vec2 u_mouse;\nuniform float u_time;\n\nvoid main(){\n    vec2 st = gl_FragCoord.xy/u_resolution.xy;\n    vec3 color = vec3(0.0);\n\n    // bottom-left\n    vec2 bl = step(vec2(0.1),st);\n    float pct = bl.x * bl.y;\n\n    // top-right\n    vec2 tr = step(vec2(0.1),1.0-st);\n    pct *= tr.x * tr.y;\n\n    // HALF A SQUARE\n    // vec2 bl = ceil(smoothstep(vec2(0.1),st, st.yx));\n    // float pct = bl.x * bl.y;\n\n    // HALF A SQUARE\n    // vec2 tr = floor(smoothstep(vec2(0.1),1.0-st, st.yx));\n    // pct *= tr.x * tr.y;\n\n\n    color = vec3(pct);\n\n    gl_FragColor = vec4(color,1.0);\n}\n",
  lesson10: "\n// Author @patriciogv - 2015\n// http://patriciogonzalezvivo.com\n\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\nuniform vec2 u_resolution;\nuniform vec2 u_mouse;\nuniform float u_time;\n\nvoid main(){\n\tvec2 st = gl_FragCoord.xy/u_resolution;\n    float pct = 0.0;\n\n    vec2 tC = vec2(15.5)-st*31.0;\n    pct = sqrt(tC.x*tC.x+tC.y*tC.y-15.5);\n\n    vec3 color = vec3(pct);\n\n\tgl_FragColor = vec4( color, 1.0 );\n}\n",
  lesson11: "\n// Author @patriciogv - 2015\n// http://patriciogonzalezvivo.com\n\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\nuniform vec2 u_resolution;\nuniform vec2 u_mouse;\nuniform float u_time;\n\nfloat circle(in vec2 _st, in float _radius){\n    vec2 dist = _st-vec2(0.5);\n\treturn 1.-smoothstep(_radius-(_radius*0.01),\n                         _radius+(_radius*0.01),\n                         dot(dist,dist)*4.0);\n}\n\nvoid main(){\n\tvec2 st = gl_FragCoord.xy/u_resolution.xy;\n\n\tvec3 color = vec3(circle(st,0.3));\n\n\tgl_FragColor = vec4( color, 1.0 );\n}\n",
  lesson12: "\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\nuniform vec2 u_resolution;\nuniform vec2 u_mouse;\nuniform float u_time;\n\nvoid main(){\n  vec2 st = gl_FragCoord.xy/u_resolution.xy;\n  st.x *= u_resolution.x/u_resolution.y;\n  vec3 color = vec3(0.0);\n  float d = 0.0;\n\n  // Remap the space to -1. to 1.\n  st = st *2.-1.;\n\n  // Make the distance field\n  // d = length( abs(st)-.3 );\n  // d = length( min(abs(st)-.3,0.) );\n  d = length( max(abs(st * abs(cos(u_time*0.5)))-.0,0.) );\n\n  // Visualize the distance field\n  gl_FragColor = vec4(vec3(fract(d*10.0)),1.0);\n\n  // Drawing with the distance field\n  // gl_FragColor = vec4(vec3( step(.3,d) ),1.0);\n  // gl_FragColor = vec4(vec3( step(.3,d) * step(d,.4)),1.0);\n  gl_FragColor = vec4(vec3( smoothstep(.1,.4,d)* smoothstep(.6,.55,d)) ,1.0);\n}\n",
  lesson13: "\n// Author @patriciogv - 2015\n// http://patriciogonzalezvivo.com\n\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\n#define PI 3.14159265359\n\nuniform vec2 u_resolution;\nuniform vec2 u_mouse;\nuniform float u_time;\n\n// Plot a line on Y using a value between 0.0-1.0\nfloat plot(vec2 st, float pct){\n  return  smoothstep( pct+0.9, pct, st.y) -\n          smoothstep( pct, pct-1.0, st.y);\n}\n\nvoid main(){\n    vec2 st = gl_FragCoord.xy/u_resolution.xy;\n    vec3 color = vec3(0.0);\n\n    vec2 pos = vec2(0.5)-st;\n\n    float r = length(pos)*2.0 ;\n    float a = atan(pos.y,pos.x) +PI*(u_time*0.25);\n\n    float f = cos(a*3.);\n    float q = abs(cos(a*12.)*sin(a*3.))*.8+.2;\n    // f = abs(cos(a*3.));\n    // f = abs(cos(a*2.5))*.5+.3;\n    // f = abs(cos(a*12.)*sin(a*3.))*.8+.1;\n    f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;\n\n    color = vec3( 1.-smoothstep(f,f+0.01,r) * 1.-smoothstep(f,0.4,r));\n    \n    float pct = plot(st,1.-smoothstep(f-0.0,f,r));\n    color = 1.0 * color+pct * vec3(abs(sin(u_time*0.5)),abs(cos(u_time*0.5)),abs(tan(u_time*0.5)));\n\n    gl_FragColor = vec4(color, 1.0);\n}\n",
  lesson14: "\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\n#define PI 3.14159265359\n#define TWO_PI 6.28318530718\n\nuniform vec2 u_resolution;\nuniform vec2 u_mouse;\nuniform float u_time;\n\n// Reference to\n// http://thndl.com/square-shaped-shaders.html\n\nvec3 makeShape(vec2 st, int N){\n  float d = 0.0;\n  // Remap the space to -1. to 1.\n  st = st *2.-1.;\n  // Angle and radius from the current pixel\n  float a = atan(st.x,st.y)+PI;\n  float r = TWO_PI/float(N);\n\t\td = cos(floor(.5+a/r)*r-a)*length(st);\n  return vec3(1.0-smoothstep(.4,.41,d));\n}\n\nvoid main(){\n  vec2 st = gl_FragCoord.xy/u_resolution.xy;\n  st.x *= u_resolution.x/u_resolution.y;\n  vec3 \tcolor = vec3(0.0);\n\t\tcolor = makeShape(st, 3);\n\n  gl_FragColor = vec4(color,1.0);\n}\n"
};
var lessons = Array.from(document.querySelectorAll('canvas[id^="lesson"]'));
var lessonClasses = lessons.map(function (part) {
  var lesson = new CanvasManager("#".concat(part.id));
  lesson.init();
  return lesson;
});
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58033" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js.js"], null)
//# sourceMappingURL=/js.00934245.js.map