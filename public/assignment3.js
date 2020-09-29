
const RED_HEX = "#FF0000"
const RED_RGB = webglUtils.hexToRgb(RED_HEX)
const RECTANGLE = "RECTANGLE"
const TRIANGLE = "TRIANGLE"

let shapes = [
  {
    type: RECTANGLE,
    position: {
      x: 200,
      y: 100
    },
    dimensions: {
      width: 50,
      height: 50
    },
    color: {
      red: Math.random(),
      green: Math.random(),
      blue: Math.random()
    }
  },
  {
    type: TRIANGLE,
    position: {
      x: 300,
      y: 100
    },
    dimensions: {
      width: 50,
      height: 50
    },
    color: RED_RGB
  }
]

const addTriangle = (center) => {
  let x = parseInt(document.getElementById("x").value)
  let y = parseInt(document.getElementById("y").value)
  const colorHex = document.getElementById("color").value
  const colorRgb = webglUtils.hexToRgb(colorHex)
  const width = parseInt(document.getElementById("width").value)
  const height = parseInt(document.getElementById("height").value)
  if (center) {
    x = center.position.x
    y = center.position.y
  }
  const triangle = {
    type: TRIANGLE,
    position: {x, y},
    dimensions: {width, height},
    color: colorRgb
  }
  shapes.push(triangle)
  render()
}

const addRectangle = (center) => {
  let x = parseInt(document.getElementById("x").value)
  let y = parseInt(document.getElementById("y").value)
  const width = parseInt(document.getElementById("width").value)
  const height = parseInt(document.getElementById("height").value)

  const hex = document.getElementById("color").value
  console.log(hex)
  const rgb = webglUtils.hexToRgb(hex)
  console.log(rgb)


  if(center) {
    x = center.position.x
    y = center.position.y
  }

  const rectangle = {
    type: RECTANGLE,
    position: {
      "x": x,
      y: y
    },
    dimensions: {
      width,
      height
    },
    color: rgb
  }

  shapes.push(rectangle)
  render()
}

let gl
let attributeCoords
let uniformColor
let bufferCoords

const doMouseDown = (event) => {
  const boundingRectangle = canvas.getBoundingClientRect()
  // console.log(boundingRectangle)
  const x = event.clientX - boundingRectangle.left
  const y = event.clientY - boundingRectangle.top
  console.log(x, y)

  const shape = document.querySelector("input[name='shape']:checked").value
  console.log(shape)

  const center = {
    position: {x, y}
  }

  if(shape === "RECTANGLE") {
    addRectangle(center)
  } else if(shape === "TRIANGLE") {
    addTriangle(center)
  }

}

const init = () => {

  const canvas = document.querySelector("#canvas");
  gl = canvas.getContext("webgl");

  canvas.addEventListener(
    "mousedown",
    doMouseDown,
    false);

  const program = webglUtils.createProgramFromScripts(gl, "#vertex-shader-2d", "#fragment-shader-2d");
  gl.useProgram(program);

  // get reference to GLSL attributes and uniforms
  attributeCoords = gl.getAttribLocation(program, "a_coords");
  const uniformResolution = gl.getUniformLocation(program, "u_resolution");
  uniformColor = gl.getUniformLocation(program, "u_color");

  // initialize coordinate attribute
  gl.enableVertexAttribArray(attributeCoords);

  // initialize coordinate buffer
  bufferCoords = gl.createBuffer();

  // configure canvas resolution
  gl.uniform2f(uniformResolution, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

const render = () => {
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferCoords);
  gl.vertexAttribPointer(
    attributeCoords,
    2,           // size = 2 components per iteration
    gl.FLOAT,    // type = gl.FLOAT; i.e., the data is 32bit floats
    false,       // normalize = false; i.e., don't normalize the data
    0,           // stride = 0; ==> move forward size * sizeof(type)
    // each iteration to get the next position
    0);          // offset = 0; i.e., start at the beginning of the buffer

  shapes.forEach(shape => {
    gl.uniform4f(uniformColor,
      shape.color.red,
      shape.color.green,
      shape.color.blue, 1);

    if(shape.type === RECTANGLE) {
      renderRectangle(shape)
    } else if(shape.type === TRIANGLE) {
      renderTriangle(shape)
    }
  })
}

const renderTriangle = (triangle) => {
  const x1 = triangle.position.x
    - triangle.dimensions.width / 2
  const y1 = triangle.position.y
    + triangle.dimensions.height / 2
  const x2 = triangle.position.x
    + triangle.dimensions.width / 2
  const y2 = triangle.position.y
    + triangle.dimensions.height / 2
  const x3 = triangle.position.x
  const y3 = triangle.position.y
    - triangle.dimensions.height / 2

  const float32Array = new Float32Array([
    x1, y1,   x2, y2,   x3, y3
  ])

  gl.bufferData(gl.ARRAY_BUFFER,
    float32Array, gl.STATIC_DRAW);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
}


const renderRectangle = (rectangle) => {
  const x1 = rectangle.position.x
    - rectangle.dimensions.width/2;
  const y1 = rectangle.position.y
    - rectangle.dimensions.height/2;
  const x2 = rectangle.position.x
    + rectangle.dimensions.width/2;
  const y2 = rectangle.position.y
    + rectangle.dimensions.height/2;

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1, x2, y1, x1, y2,
    x1, y2, x2, y1, x2, y2,
  ]), gl.STATIC_DRAW);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}