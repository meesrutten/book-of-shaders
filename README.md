# Book of Shaders

[Patricio Gonzalez Vivo](https://github.com/patriciogonzalezvivo/) and [Jen Lowe](http://jenlowe.net/) created a step-by-step guide to the abstract and complex Fragment Shaders of GLSL ([OpenGL Shading Language](https://en.wikipedia.org/wiki/OpenGL_Shading_Language/)). Patricio and Jen created a book about these shaders that offer the possibility of taking digitally generated images to the next level.

Fragment shaders give you control over the pixels rendered on the screen at a fast speed by utilizing the GPU. This is why they’re used in all sort of cases, from 3D web animation of [Three.js](https://threejs.org/) to the 2D layers of [Pixi.js](https://www.pixijs.com/)

WebGL, available in most browsers, uses GLSL to access the GPU from your browser. Enabling developers like myself to implement this on any website. 

[Github Pages here](https://meesrutten.github.io/book-of-shaders/)

## Table of Contents
- [About this project](#about-this-project)
- [How to start](#how-to-start)
- [How it works](#how-it-works)

## About this project

After spending almost a day of setting up an environment for WebGL which had support for the WebGL uniforms like `u_mouse` which tracks mouse position, `u_time` which tracks passed time and `u_resolution` which is the canvas width and height. \
I gave up. \
5 seconds after giving up, I went to the next page of The Book of Shaders and noticed that they had already built environments for me to test my GLSL fragments shader code...
[https://thebookofshaders.com/04/](https://thebookofshaders.com/04/) 

Failed attempts at building environments: \
[https://codepen.io/meesrutten/pen/qzmewR](https://codepen.io/meesrutten/pen/qzmewR) \
[https://codepen.io/meesrutten/pen/RzVKVN](https://codepen.io/meesrutten/pen/RzVKVN)

The good thing about this is that I did really learn what uniforms are in fragment shaders.

## How to start
[https://yarnpkg.com/lang/en/docs/install/](Yarn)

After cloning the repository, head to the folder and run:

```sh
yarn
```

To start developing, run the command:

```sh
yarn start
```

This will start a development server at ```localhost:1234```

\
If this does not work, please install ParcelJS globally:

```sh
yarn global add parcel-bundler
```

## How it works

In the JS I use: `class CanvasManager`. This class gets all the canvas elements that contain `id="lesson${NUMBER}"`.

On these canvas I add `THREE.Camera`, `THREE.Scene`, `THREE.PlaneBuggerGeometry` to create a visible area.

Afterwards I create a new `THREE.ShaderMaterial` which contains all the `uniforms` like, `u_mouse`, `u_resolution`, `u_time` that I use in my shaders. The material also contains the fragment shader I wrote for the particular lesson and a vertex shader which is just the area of the canvas.

I combine the `THREE.ShaderMaterial` with the `THREE.PlaneBuggerGeometry` to create a `THREE.Mesh`. This mesh gets added to the scene and I use a `THREE.WebGLRenderer` to render the scene. 

To animate the fragment shaders I update `this.uniforms.u_time.value += 0.05;` on each frame (60 times per second).

The fragment shaders are written in the variable: `fragmentShaders` and sorted by each lesson.
Most of these fragment shaders come directly from The Book of Shaders but are all modified to my liking to learn about the calculations.

Try to view this project by running it locally, that way you can change values in the fragment shaders to fully understand what I'm talking about.