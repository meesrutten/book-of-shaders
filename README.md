# Book of Shaders

After spending almost a day of setting up an environment for WebGL which had support for the WebGL uniforms like `u_mouse` which tracks mouse position, `u_time` which tracks passed time and `u_resolution` which is the canvas width and height. \
I gave up. \
5 seconds after giving up, I went to the next page of The Book of Shaders and noticed that they had already built environments for me to test my GLSL fragments shader code...
[https://thebookofshaders.com/04/](https://thebookofshaders.com/04/) \

Failed attempts at building environments: \
[https://codepen.io/meesrutten/pen/qzmewR](https://codepen.io/meesrutten/pen/qzmewR) \
[https://codepen.io/meesrutten/pen/RzVKVN](https://codepen.io/meesrutten/pen/RzVKVN)

The good thing about this is that I did really learn what uniforms are in fragment shaders.

# Table of Contents
- [How to start](#how-to-start)
- [Build](#build)

## How to start

After cloning the repository, head to the folder and run:

```sh
yarn
```

To start developing, run the command:

```sh
yarn start
```

This will start a development server at ```localhost:1234```

## Build

In the JS I use: `class CanvasManager`. This class gets all the canvas elements that contain `id="lesson${NUMBER}"`.

On these canvas I add `THREE.Camera`, `THREE.Scene`, `THREE.PlaneBuggerGeometry` to create a visible area.

Afterwards I create a new `THREE.ShaderMaterial` which contains all the `uniforms` like, `u_mouse`, `u_resolution`, `u_time` that I use in my shaders. The material also contains the fragment shader I wrote for the particular lesson and a vertex shader which is just the area of the canvas.

I combine the `THREE.ShaderMaterial` with the `THREE.PlaneBuggerGeometry` to create a `THREE.Mesh`. This mesh gets added to the scene and I use a `THREE.WebGLRenderer` to render the scene. 

To animate the fragment shaders I update `this.uniforms.u_time.value += 0.05;` on each frame (60 times per second).

The fragment shaders are written in the variable: `fragmentShaders` and sorted by each lesson.
Most of these fragment shaders come directly from The Book of Shaders but are all modified to my liking to learn about the calculations.

Try to view this project by running it locally, that way you can change values in the fragment shaders to fully understand what I'm talking about.