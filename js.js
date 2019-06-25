// https://thebookofshaders.com/
console.clear()

class CanvasManager {
	constructor(element){
		this.canvas = document.querySelector(element);
		
		this.canvas.insertAdjacentHTML('afterend', `<small class="canvas-name">${element}</small>`)
		
		this.fragmentShaderSource = fragmentShaders[element.replace('#','')]
	}
	init(){
		this.camera = new THREE.Camera();
    this.camera.position.z = 1;
		this.scene = new THREE.Scene();
		this.geometry = new THREE.PlaneBufferGeometry( 2, 2 );
		
		this.uniforms = {
			u_time: { type: "f", value: 1.0 },
			u_resolution: { type: "v2", value: new THREE.Vector2() },
			u_mouse: { type: "v2", value: new THREE.Vector2() }
		};

		this.material = new THREE.ShaderMaterial( {
			uniforms: this.uniforms,
			vertexShader: document.getElementById( 'vertexShader' ).textContent,
			fragmentShader: this.fragmentShaderSource
		} );

		this.mesh = new THREE.Mesh( this.geometry, this.material );
		this.scene.add( this.mesh );

		this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
		this.renderer.setPixelRatio( window.devicePixelRatio );
	
		this.onWindowResize();
		window.addEventListener( 'resize', ()=>this.onWindowResize(), false );

		this.canvas.onmousemove = e => {
			this.uniforms.u_mouse.value.x = e.layerX
			this.uniforms.u_mouse.value.y = e.layerY
		}
		this.animate()
	}
	onWindowResize(event){
		this.renderer.setSize( document.body.clientWidth / 2, document.body.clientWidth / 2 );
		this.uniforms.u_resolution.value.x = this.renderer.domElement.width;
		this.uniforms.u_resolution.value.y = this.renderer.domElement.height;
	}
	animate(){
		requestAnimationFrame(()=>this.animate());
		this.render();
	}
	render() {
		this.uniforms.u_time.value += 0.05;
		this.renderer.render( this.scene, this.camera );
	}
}

const fragmentShaders = {
	lesson1: `
		#ifdef GL_ES
		precision mediump float;
		#endif

		void main() {
			gl_FragColor = vec4(vec3(0.2,0.4,0.9),1.0);
		}
`,
	lesson2:
	`
		precision mediump float;

		uniform float u_time;
		uniform vec2 u_mouse;

		void main() {
			gl_FragColor = vec4(abs(sin(u_time)),abs(u_mouse.x*0.001),abs(u_mouse.y*0.001) ,1.0);
		}
`,
	lesson3: 
	`
	#ifdef GL_ES
		precision mediump float;
	#endif

	uniform vec2 u_resolution;
	uniform vec2 u_mouse;
	uniform float u_time;

	void main() {
		vec2 st = gl_FragCoord.xy/u_resolution;
		gl_FragColor = vec4(abs(cos(u_time * st.x)),abs(sin(u_time * st.y)),abs(sin(u_time * st.y * st.x)),1.0);
	}
`,
lesson4:
	`
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;

    float y = log(st.x * PI);

    vec3 color = vec3(y);

    float pct = plot(st,y);
    color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);

    gl_FragColor = vec4(color,1.0);
}
`,
lesson5:
	`
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;

    // Smooth interpolation between 0.1 and 0.9
    float y = smoothstep(0.2,0.5,st.x) - smoothstep(0.5,0.8,st.x);

    vec3 color = vec3(y);

    float pct = plot(st,y);
    color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);

    gl_FragColor = vec4(color,1.0);
}
`,
lesson6:
	`
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592653589793
#define HALF_PI 1.5707963267948966

uniform vec2 u_resolution;
uniform float u_time;

vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(0.649,0.641,0.912);

float circularOut(float t) {
  return sqrt((2.0 - t) * t);
}

void main() {
    vec3 color = vec3(0.0);

    float t = u_time*0.5;
    float pct = circularOut( abs(fract(t)*2.0-1.) );
    // Mix uses pct (a value from 0-1) to
    // mix the two colors
    gl_FragColor = vec4(vec3(mix(colorA, colorB, pct)),1.0);
}
`,
lesson7:
	`
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(1.000,0.833,0.224);

float plot (vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.x) -
          smoothstep( pct, pct+0.01, st.x);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec3 pct = vec3(st.y);

    pct.r = smoothstep(0.2,0.0, st.y);
    pct.g = smoothstep(st.x*0.1,st.x*0.0,st.y*0.1);
    pct.b = pow(st.y,0.5);

    color = mix(colorA, colorB, pct);

    // Plot transition lines for each channel
    color = mix(color,vec3(1.0,0.0,0.0),plot(st,pct.r));
    color = mix(color,vec3(0.0,1.0,0.0),plot(st,pct.g));
    color = mix(color,vec3(0.0,0.0,1.0),plot(st,pct.b));

    gl_FragColor = vec4(color,1.0);
}
`,
lesson8:
	`
#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718
#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);

    // Use polar coordinates instead of cartesian
    vec2 toCenter = vec2(0.5)-st;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0;

    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius
    color = hsb2rgb(vec3((angle/TWO_PI)+cos(u_time) * 0.5,radius,1.0));

    gl_FragColor = vec4(color,1.0);
}
`,
lesson9:
	`
// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    // bottom-left
    vec2 bl = step(vec2(0.1),st);
    float pct = bl.x * bl.y;

    // top-right
    vec2 tr = step(vec2(0.1),1.0-st);
    pct *= tr.x * tr.y;

    // HALF A SQUARE
    // vec2 bl = ceil(smoothstep(vec2(0.1),st, st.yx));
    // float pct = bl.x * bl.y;

    // HALF A SQUARE
    // vec2 tr = floor(smoothstep(vec2(0.1),1.0-st, st.yx));
    // pct *= tr.x * tr.y;


    color = vec3(pct);

    gl_FragColor = vec4(color,1.0);
}
`,
lesson10:
	`
// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;
    float pct = 0.0;

    vec2 tC = vec2(15.5)-st*31.0;
    pct = sqrt(tC.x*tC.x+tC.y*tC.y-15.5);

    vec3 color = vec3(pct);

	gl_FragColor = vec4( color, 1.0 );
}
`,
lesson11:
	`
// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution.xy;

	vec3 color = vec3(circle(st,0.3));

	gl_FragColor = vec4( color, 1.0 );
}
`,
lesson12:
	`
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.0);
  float d = 0.0;

  // Remap the space to -1. to 1.
  st = st *2.-1.;

  // Make the distance field
  // d = length( abs(st)-.3 );
  // d = length( min(abs(st)-.3,0.) );
  d = length( max(abs(st * abs(cos(u_time*0.5)))-.0,0.) );

  // Visualize the distance field
  gl_FragColor = vec4(vec3(fract(d*10.0)),1.0);

  // Drawing with the distance field
  // gl_FragColor = vec4(vec3( step(.3,d) ),1.0);
  // gl_FragColor = vec4(vec3( step(.3,d) * step(d,.4)),1.0);
  gl_FragColor = vec4(vec3( smoothstep(.1,.4,d)* smoothstep(.6,.55,d)) ,1.0);
}
`,
lesson13:
	`
// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st, float pct){
  return  smoothstep( pct+0.9, pct, st.y) -
          smoothstep( pct, pct-1.0, st.y);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec2 pos = vec2(0.5)-st;

    float r = length(pos)*2.0 ;
    float a = atan(pos.y,pos.x) +PI*(u_time*0.25);

    float f = cos(a*3.);
    float q = abs(cos(a*12.)*sin(a*3.))*.8+.2;
    // f = abs(cos(a*3.));
    // f = abs(cos(a*2.5))*.5+.3;
    // f = abs(cos(a*12.)*sin(a*3.))*.8+.1;
    f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;

    color = vec3( 1.-smoothstep(f,f+0.01,r) * 1.-smoothstep(f,0.4,r));
    
    float pct = plot(st,1.-smoothstep(f-0.0,f,r));
    color = 1.0 * color+pct * vec3(abs(sin(u_time*0.5)),abs(cos(u_time*0.5)),abs(tan(u_time*0.5)));

    gl_FragColor = vec4(color, 1.0);
}
`,
lesson14:
	`
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Reference to
// http://thndl.com/square-shaped-shaders.html

vec3 makeShape(vec2 st, int N){
  float d = 0.0;
  // Remap the space to -1. to 1.
  st = st *2.-1.;
  // Angle and radius from the current pixel
  float a = atan(st.x,st.y)+PI;
  float r = TWO_PI/float(N);
		d = cos(floor(.5+a/r)*r-a)*length(st);
  return vec3(1.0-smoothstep(.4,.41,d));
}

void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 	color = vec3(0.0);
		color = makeShape(st, 3);

  gl_FragColor = vec4(color,1.0);
}
`
}

const lessons = Array.from(document.querySelectorAll('canvas[id^="lesson"]'))
const lessonClasses = lessons.map( part => {
	const lesson = new CanvasManager(`#${part.id}`)
	lesson.init()
	return lesson
})