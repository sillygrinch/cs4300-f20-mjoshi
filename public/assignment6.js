const up = [0, 1, 0]
let target = [0, 0, 0]
let lookAt = true
let attributeNormals
let uniformWorldViewProjection
let uniformWorldInverseTranspose
let uniformReverseLightDirectionLocation
let normalBuffer
const zNear = 1;
const zFar = 2000;
const RED_HEX = "#FF0000"
const RED_RGB = webglUtils.hexToRgb(RED_HEX)
const BLUE_HEX = "#0000FF"
const BLUE_RGB = webglUtils.hexToRgb(BLUE_HEX)
const GREEN_HEX = "#00FF00"
const GREEN_RGB = webglUtils.hexToRgb(GREEN_HEX)
const RECTANGLE = "RECTANGLE"
const TRIANGLE = "TRIANGLE"
const LETTER_F = "LETTER_F"
const STAR = "STAR"
const CIRCLE = "CIRCLE"
const CUBE = "CUBE"
const origin = {x: 0, y: 0, z: 0}
const sizeOne = {width: 1, height: 1, depth: 1}

let camera = {
    translation: {x: -45, y: -35, z: 21},
    rotation: {x: 40, y: 235, z: 0}
}


let lightSource = [0.4, 0.3, 0.5]

let shapes = [
    {
        type: CUBE,
        position: origin,
        dimensions: sizeOne,
        color: BLUE_RGB,
        translation: {x: 0, y: 0, z: 0},
        scale: {x: 0.5, y: 0.5, z: 0.5},
        rotation: {x: 0, y: 0, z: 0},
    },
    {
        type: CUBE,
        position: origin,
        dimensions: sizeOne,
        color: GREEN_RGB,
        translation: {x: 20, y: 0, z: 0},
        scale: {x: 0.5, y: 0.5, z: 0.5},
        rotation: {x: 0, y: 0, z: 0},
    },
    {
        type: CUBE,
        position: origin,
        dimensions: sizeOne,
        color: RED_RGB,
        translation: {x: -20, y: 0, z: 0},
        scale: {x: 0.5, y: 0.5, z: 0.5},
        rotation: {x: 0, y: 0, z: 0}
    },

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


    if (center) {
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
let uniformMatrix
let uniformColor
let bufferCoords


const init = () => {
    const canvas = document.querySelector("#canvas");
    gl = canvas.getContext("webgl");

    document.getElementById("dlrx").value = lightSource[0]
    document.getElementById("dlry").value = lightSource[1]
    document.getElementById("dlrz").value = lightSource[2]

    document.getElementById("dlrx").onchange
        = event => webglUtils.updateLightDirection(event, 0)
    document.getElementById("dlry").onchange
        = event => webglUtils.updateLightDirection(event, 1)
    document.getElementById("dlrz").onchange
        = event => webglUtils.updateLightDirection(event, 2)

    canvas.addEventListener(
        "mousedown",
        webglUtils.doMouseDown,
        false);

    const program = webglUtils
        .createProgramFromScripts(gl, "#vertex-shader-3d", "#fragment-shader-3d");
    console.log(program)
    gl.useProgram(program);

    // get reference to GLSL attributes and uniforms
    attributeCoords = gl.getAttribLocation(program, "a_coords");
    uniformMatrix = gl.getUniformLocation(program, "u_matrix");
    // alert(attributeCoords)
    // alert(uniformMatrix)
    const uniformResolution = gl.getUniformLocation(program, "u_resolution");
    uniformColor = gl.getUniformLocation(program, "u_color");
    console.log(uniformColor)


    // initialize coordinate attribute
    gl.enableVertexAttribArray(attributeCoords);

    // initialize coordinate buffer
    bufferCoords = gl.createBuffer();
    attributeNormals = gl.getAttribLocation(program, "a_normals");
    gl.enableVertexAttribArray(attributeNormals);
    normalBuffer = gl.createBuffer();

    uniformWorldViewProjection
        = gl.getUniformLocation(program, "u_worldViewProjection");
    uniformWorldInverseTranspose
        = gl.getUniformLocation(program, "u_worldInverseTranspose");
    uniformReverseLightDirectionLocation
        = gl.getUniformLocation(program, "u_reverseLightDirection");

    // configure canvas resolution
    gl.uniform2f(uniformResolution, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    document.getElementById("lookAt").onchange = event => webglUtils.toggleLookAt(event)
    document.getElementById("ctx").onchange = event => webglUtils.updateCameraTranslation(event, "x")
    document.getElementById("cty").onchange = event => webglUtils.updateCameraTranslation(event, "y")
    document.getElementById("ctz").onchange = event => webglUtils.updateCameraTranslation(event, "z")
    document.getElementById("crx").onchange = event => webglUtils.updateCameraRotation(event, "x")
    document.getElementById("cry").onchange = event => webglUtils.updateCameraRotation(event, "y")
    document.getElementById("crz").onchange = event => webglUtils.updateCameraRotation(event, "z")
    document.getElementById("ltx").onchange = event => webglUtils.updateLookAtTranslation(event, 0)
    document.getElementById("lty").onchange = event => webglUtils.updateLookAtTranslation(event, 1)
    document.getElementById("ltz").onchange = event => webglUtils.updateLookAtTranslation(event, 2)

    document.getElementById("lookAt").checked = lookAt
    document.getElementById("ctx").value = camera.translation.x
    document.getElementById("cty").value = camera.translation.y
    document.getElementById("ctz").value = camera.translation.z
    document.getElementById("crx").value = camera.rotation.x
    document.getElementById("cry").value = camera.rotation.y
    document.getElementById("crz").value = camera.rotation.z
    document.getElementById("tx").onchange = event => updateTranslation(event, "x")
    document.getElementById("ty").onchange = event => updateTranslation(event, "y")
    document.getElementById("tz").onchange = event => updateTranslation(event, "z")

    document.getElementById("sx").onchange = event => updateScale(event, "x")
    document.getElementById("sy").onchange = event => updateScale(event, "y")
    document.getElementById("sz").onchange = event => updateScale(event, "z")

    document.getElementById("rx").onchange = event => updateRotation(event, "x")
    document.getElementById("ry").onchange = event => updateRotation(event, "y")
    document.getElementById("rz").onchange = event => updateRotation(event, "z")

    document.getElementById("fv").onchange = event => updateFieldOfView(event)

    document.getElementById("color").onchange = event => updateColor(event)
    webglUtils.selectShape(0)

}

const updateFieldOfView = (event) => {
    fieldOfViewRadians = m4.degToRad(event.target.value);
    render();
}
const updateTranslation = (event, axis) => {
    const value = event.target.value
    shapes[selectedShapeIndex].translation[axis] = value
    render()
}

const updateScale = (event, axis) => {
    const value = event.target.value
    shapes[selectedShapeIndex].scale[axis] = value
    render()
}

const updateRotation = (event, axis) => {
    shapes[selectedShapeIndex].rotation[axis] = event.target.value
    render();
}

const updateColor = (event) => {
    const value = event.target.value
    shapes[selectedShapeIndex].color = webglUtils.hexToRgb(value)
    // Use webglUtils.hexToRgb to convert hex color to rgb
}


let fieldOfViewRadians = m4.degToRad(60)


const computeModelViewMatrix = (shape, viewProjectionMatrix) => {
    M = m4.translate(viewProjectionMatrix,
        shape.translation.x,
        shape.translation.y,
        shape.translation.z)
    M = m4.xRotate(M, m4.degToRad(shape.rotation.x))
    M = m4.yRotate(M, m4.degToRad(shape.rotation.y))
    M = m4.zRotate(M, m4.degToRad(shape.rotation.z))
    M = m4.scale(M, shape.scale.x, shape.scale.y, shape.scale.z)
    return M
}

const render = () => {
    if (lookAt) {
        console.log("Asdasd")
        let cameraMatrix = m4.identity()
        cameraMatrix = m4.translate(
            cameraMatrix,
            camera.translation.x,
            camera.translation.y,
            camera.translation.z)
        const cameraPosition = [
            cameraMatrix[12],
            cameraMatrix[13],
            cameraMatrix[14]]
        cameraMatrix = m4.lookAt(
            cameraPosition,
            target,
            up)
        cameraMatrix = m4.inverse(cameraMatrix)
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const projectionMatrix = m4.perspective(
            fieldOfViewRadians, aspect, zNear, zFar)
        var viewProjectionMatrix
        viewProjectionMatrix = m4.multiply(
            projectionMatrix, cameraMatrix)
        console.log(projectionMatrix)
    } else {
        console.log("asdasdasdasdasd22222")
        cameraMatrix = m4.zRotate(
            cameraMatrix,
            m4.degToRad(camera.rotation.z));
        cameraMatrix = m4.xRotate(
            cameraMatrix,
            m4.degToRad(camera.rotation.x));
        cameraMatrix = m4.yRotate(
            cameraMatrix,
            m4.degToRad(camera.rotation.y));
        cameraMatrix = m4.translate(
            cameraMatrix,
            camera.translation.x,
            camera.translation.y,
            camera.translation.z);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCoords);
    gl.vertexAttribPointer(
        attributeCoords,
        3, // size = 3 floats per vertex
        gl.FLOAT,
        false,
        0,
        0);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(attributeNormals, 3, gl.FLOAT, false, 0, 0);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    console.log(viewProjectionMatrix)


    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCoords);
    let worldMatrix = m4.identity()
    const worldViewProjectionMatrix
        = m4.multiply(viewProjectionMatrix, worldMatrix);
    const worldInverseMatrix
        = m4.inverse(worldMatrix);
    const worldInverseTransposeMatrix
        = m4.transpose(worldInverseMatrix);

    gl.uniformMatrix4fv(uniformWorldViewProjection, false,
        worldViewProjectionMatrix);
    gl.uniformMatrix4fv(uniformWorldInverseTranspose, false,
        worldInverseTransposeMatrix);

    gl.uniform3fv(uniformReverseLightDirectionLocation,
        m4.normalize(lightSource));

    shapes.forEach(shape => {
        let M = computeModelViewMatrix(shape, worldViewProjectionMatrix)
        gl.uniformMatrix4fv(uniformWorldViewProjection, false, M)
        gl.uniform4f(uniformColor,
            shape.color.red,
            shape.color.green,
            shape.color.blue, 1);
        gl.uniformMatrix4fv(uniformMatrix, false, M)
        if (shape.type === CUBE) {
            renderCube(shape)
        } else if (shape.type === RECTANGLE) {
            webglUtils.renderRectangle(shape)
        } else if (shape.type === TRIANGLE) {
            webglUtils.renderTriangle(shape)
        } else if (shape.type === STAR) {
            renderStar(shape)
        } else if (shape.type === CIRCLE) {
            renderCircle(shape)
        }
    })

    const $shapeList = $("#object-list")
    $shapeList.empty()
    shapes.forEach((shape, index) => {

        const $li = $(`
     <li>
     <input
     type="radio"
     id="${shape.type}-${index}"
     name="shape-index"
     ${index === selectedShapeIndex ? "checked" : ""}
     onclick="webglUtils.selectShape(${index})"
     value="${index}"/>
     <button onclick="webglUtils.deleteShape(${index})">
          Delete
        </button>
       <label>
         ${shape.type};
         X: ${shape.translation.x};
         Y: ${shape.translation.y}
       </label>
     </li>
   `)
        $shapeList.append($li)

    })
}

const renderStar = (star) => {
    const x1 = star.position.x
        - star.dimensions.width / 2
    const y1 = star.position.y
        + star.dimensions.height / 2
    const x2 = star.position.x
        + star.dimensions.width / 2
    const y2 = star.position.y
        + star.dimensions.height / 2
    const x3 = star.position.x
    const y3 = star.position.y
        - star.dimensions.height / 2
    const x4 = star.position.x
        - star.dimensions.width / -2
    const y4 = star.position.y
        + star.dimensions.height / -2
    const x5 = star.position.x
        + star.dimensions.width / -2
    const y5 = star.position.y
        + star.dimensions.height / -2
    const x6 = star.position.x
    const y6 = star.position.y
        - star.dimensions.height / -2

    const float32Array = new Float32Array([
        x1, y1, x2, y2, x3, y3,
        x4, y4 - (-0.3), x5, y5 - (-0.3), x6, y6 - (-0.3)
    ])

    gl.bufferData(gl.ARRAY_BUFFER,
        float32Array, gl.STATIC_DRAW);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}


const renderCircle = (circle) => {
    let circlecoords = []
    //Map coords of a full circle
    for (var x = 0; x <= 360; x += 1) {
        var circ = x * Math.PI / 180;
        var circvertex = [
            Math.sin(circ),
            Math.cos(circ),
            0,
            0,
            0,
            0,
        ];
        circlecoords = circlecoords.concat(circvertex);
    }
    var count = circlecoords.length
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(circlecoords), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, count);
}

const renderCube = (cube) => {
  let geometry = [
     0,  0,  0,    0, 30,  0,   30,  0,  0,
     0, 30,  0,   30, 30,  0,   30,  0,  0,
     0,  0, 30,   30,  0, 30,    0, 30, 30,
     0, 30, 30,   30,  0, 30,   30, 30, 30,
     0, 30,  0,    0, 30, 30,   30, 30, 30,
     0, 30,  0,   30, 30, 30,   30, 30,  0,
     0,  0,  0,   30,  0,  0,   30,  0, 30,
     0,  0,  0,   30,  0, 30,    0,  0, 30,
     0,  0,  0,    0,  0, 30,    0, 30, 30,
     0,  0,  0,    0, 30, 30,    0, 30,  0,
    30,  0, 30,   30,  0,  0,   30, 30, 30,
    30, 30, 30,   30,  0,  0,   30, 30,  0
  ]
    geometry = new Float32Array(geometry)
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferCoords);
      gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.STATIC_DRAW)

      var normals = new Float32Array([
         0,0, 1,  0,0, 1,  0,0, 1,    0,0, 1,  0,0, 1,  0,0, 1,
         0,0,-1,  0,0,-1,  0,0,-1,    0,0,-1,  0,0,-1,  0,0,-1,
         0,-1,0,  0,-1,0,  0,-1,0,    0,-1,0,  0,-1,0,  0,-1,0,
         0, 1,0,  0, 1,0,  0, 1,0,    0, 1,0,  0, 1,0,  0, 1,0,
        -1, 0,0, -1, 0,0, -1, 0,0,   -1, 0,0, -1, 0,0, -1, 0,0,
         1, 0,0,  1, 0,0,  1, 0,0,    1, 0,0,  1, 0,0,  1 ,0,0,
        ]);
   gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);

}





let selectedShapeIndex = 1