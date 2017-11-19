
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
setCanvasSize(canvas);

var howFar = 200;

var rotateX = 0;
var rotateY = 0;




function initButtons() {
  // transform functions bindings to buttons
    $("#transformup").click(function() {
      moveUp();
    });

    $("#transformdown").click(function() {
      moveDown();
    });

    $("#transformleft").click(function() {
      moveLeft();
    });

    $("#transformright").click(function() {
      moveRight();
    });

    $("#transformforward").click(function() {
      moveForward();
    });

    $("#transformbackward").click(function() {
      moveBackward();
    });

    // rotate functions bindings to buttons
    $("#rotateup").click(function() {
      rotateUp();zoomIn
    });

    $("#rotatedown").click(function() {
      rotateDown();
    });

    $("#rotateleft").click(function() {
      rotateLeft();
    });

    $("#rotateright").click(function() {
      rotateRight();
    });

    $("#rotateleftaxis").click(function() {
      rotateLeftAxis();
    });

    $("#rotaterightaxis").click(function() {
      rotateRightAxis();
    });

    // zoom functions bindings to buttons
    $("#zoomin").click(function() {
      zoomIn();
    });

    $("#zoomout").click(function() {
      zoomOut();
    });
}

function setCanvasSize(canvas) {
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
};


var Vertex = function(x, y, z) {
  this.x = parseFloat(x);
  this.y = parseFloat(y);
  this.z = parseFloat(z);
};

var Vertex2D = function(x, y) {
  this.x = parseFloat(x);
  this.y = parseFloat(y);
};

var Cube = function(center, side) {
  // Generate the vertices
  this.type = "Cube";
  this.side= side;
  this.centerPoint = center;

  var d = side / 2;

  this.vertices = [
    new Vertex(center.x - d, center.y - d, center.z + d),
    new Vertex(center.x - d, center.y - d, center.z - d),
    new Vertex(center.x + d, center.y - d, center.z - d),
    new Vertex(center.x + d, center.y - d, center.z + d),
    new Vertex(center.x + d, center.y + d, center.z + d),
    new Vertex(center.x + d, center.y + d, center.z - d),
    new Vertex(center.x - d, center.y + d, center.z - d),
    new Vertex(center.x - d, center.y + d, center.z + d)
  ];

  // Generate the faces
  this.faces = [
    [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
    [this.vertices[3], this.vertices[2], this.vertices[5], this.vertices[4]],
    [this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7]],
    [this.vertices[7], this.vertices[6], this.vertices[1], this.vertices[0]],
    [this.vertices[7], this.vertices[0], this.vertices[3], this.vertices[4]],
    [this.vertices[1], this.vertices[6], this.vertices[5], this.vertices[2]]
  ];
};

var Cuboid = function (center, widthX ,lengthY,  heightZ) {


  this.widthX = widthX;
  this.lengthY = lengthY;
  this.heightZ = heightZ;
  this.type = "Cuboid"
  this.centerPoint = center;
  var x = widthX/2;
  var y = lengthY/2;
  var z = heightZ/2;

  this.vertices = [
    new Vertex(center.x - x, center.y - y, center.z + z),
    new Vertex(center.x - x, center.y - y, center.z - z),
    new Vertex(center.x + x, center.y - y, center.z - z),
    new Vertex(center.x + x, center.y - y, center.z + z),
    new Vertex(center.x + x, center.y + y, center.z + z),
    new Vertex(center.x + x, center.y + y, center.z - z),
    new Vertex(center.x - x, center.y + y, center.z - z),
    new Vertex(center.x - x, center.y + y, center.z + z)
  ];

  // Generate the faces
  this.faces = [
    [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
    [this.vertices[3], this.vertices[2], this.vertices[5], this.vertices[4]],
    [this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7]],
    [this.vertices[7], this.vertices[6], this.vertices[1], this.vertices[0]],
    [this.vertices[7], this.vertices[0], this.vertices[3], this.vertices[4]],
    [this.vertices[1], this.vertices[6], this.vertices[5], this.vertices[2]]
  ];
}

var Wall = function (center, sideA, sideB)
{
  var a = sideA/2;
  var b = sideB/2;
  this.centerPoint = center;

  this.vertices= [
    new Vertex( center.x, center.y + a, center.z + b),
    new Vertex( center.x, center.y + a, center.z - b),
    new Vertex( center.x, center.y - a, center.z - b),
    new Vertex( center.x, center.y - a, center.z + b),
  ]
  this.faces = [
    [this.vertices[0], this.vertices[1] ,this.vertices[2] , this.vertices[3]]
  ];
};

var FrontWall = function (center, sideA, sideB)
{
  var a = sideA/2;
  var b = sideB/2;
  this.centerPoint = center;

  this.vertices= [
    new Vertex( center.x + a, center.y, center.z + b),
    new Vertex( center.x + a, center.y, center.z - b),
    new Vertex( center.x - a, center.y, center.z - b),
    new Vertex( center.x - a, center.y, center.z + b),
  ]
  this.faces = [
    [this.vertices[0], this.vertices[1] ,this.vertices[2] , this.vertices[3]]
  ];
};
var BottomWall = function (center, sideA, sideB)
{
  this.sideA = sideA;
  this.sideB = sideB;
  this.type = "BottomWall"
  var a = sideA/2;
  var b = sideB/2;
  this.centerPoint = center;

  this.vertices= [
    new Vertex( center.x + a, center.y + b, center.z),
    new Vertex( center.x + a, center.y - b, center.z + 40),
    new Vertex( center.x - a, center.y - b, center.z + 40),
    new Vertex( center.x - a, center.y + b, center.z),
  ]
  this.faces = [
    [this.vertices[0], this.vertices[1] ,this.vertices[2] , this.vertices[3]]
  ];
};

function project(M, d) {
  // Distance between the camera and the plane
  //var d = 200;
  var r = d / M.y;

  return new Vertex2D(r * M.x, r * M.z);
}

function render(allObjects, ctx, dx, dy, howFar) {
  // Clear the previous frame
  ctx.clearRect(0, 0, 2*dx, 2*dy);
  var objectsToRender = refreshObjectsToRender(allObjects);
  // For each object

  var facesToRender = getSortedFacesToRender(backfaceCulling(objectsToRender));


  for (var j = 0, n_faces = facesToRender.length; j < n_faces; ++j) {
    // Current face
    var face = facesToRender[j];

    // Draw the first vertex
    var P = project(face[0], howFar);
    ctx.beginPath();
    ctx.moveTo(P.x + dx, -P.y + dy);

    // Draw the other vertices
    for (var k = 1, n_vertices = face.length; k < n_vertices; ++k) {
      P = project(face[k], howFar);
      ctx.lineTo(P.x + dx, -P.y + dy);
    }


    // Close the path and draw the face
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }

}

function refreshObjectsToRender(objects)
{
  var objectsToRender = []
  for(var i=0; i < objects.length; i++){

    if (objects[i].centerPoint.y - getAdditionalDistanceFromYForObject(objects[i])> 0)
    objectsToRender.push(objects[i])
  }
  return objectsToRender;
}

function getAdditionalDistanceFromYForObject(object){
  switch(object.type){
    case "Cube":
    return object.side;
    break;
    case "Cuboid":
    return object.lengthY / 2;
    break;
    case "BottomWall":
    return object.sideA;
    break;
  }

}

function getSortedFacesToRender(faces){
  return faces.sort(compare);
}

function compare(a,b) {
  var aY = 0;
  var bY= 0;
  for(var i =0; i< a.length; i++){
    aY += a[i].y
  }
  for(var i =0; i< b.length; i++){
    bY += b[i].y
  }
  aY /= a.length;
  bY /= b.length;
  if (aY > bY)
    return -1;
  if (aY < bY)
    return 1;
  return 0;
}

function backfaceCulling(objects){
  var cameraposition = new Vertex(0, 0, 0);
  var visibleFaces = [];

  for (var i = 0, n_obj = objects.length; i < n_obj; ++i) {
    for (var j = 0, n_faces = objects[i].faces.length; j < n_faces; ++j) {

      var face = objects[i].faces[j];

      if(objects[i].type == "BottomWall")
      {
        visibleFaces.push(face);
        continue;
      }
      var vec = GetNormalVector(face);

      // <p - o, n>
      //we should do face[4] - cameraposition, but since cameraposition is always (0,0,0) I will omit this for clean code
      var anyPointOnFace = face[3];

      var oriented = anyPointOnFace.x * vec.x + anyPointOnFace.y * vec.y + anyPointOnFace.z * vec.z;

      if(oriented < 0 )
      visibleFaces.push(face);
    }
  }

  return visibleFaces;
}

function GetNormalVector(face){
  var a = face[0];
  var b = face[1];
  var c = face[2];

  var AB = new Vertex(b.x - a.x, b.y - a.y, b.z - a.z);
  var BC = new Vertex(c.x - b.x, c.y - b.y, c.z - b.z);

  //AB x BC
  var vector = new Vertex(0,0,0);
  vector.x = AB.y * BC.z - AB.z * BC.y;
  vector.y = AB.z * BC.x - AB.x * BC.z;
  vector.z = AB.x * BC.y - AB.y * BC.x;

  return vector;
}

$(document).ready(function() {
  // Fix the canvas width and height
  var canvas = document.getElementById('cnv');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  var dx = canvas.width / 2;
  var dy = canvas.height / 2;

  // Objects style
  var ctx = canvas.getContext('2d');
  ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillStyle = 'rgba(0, 150, 255, 1)';

  // Create the cube

  var rightfront = new Vertex(230, 250, -300);
  var rightback = new Vertex(300, 400, -200);

  var leftfront = new Vertex(-230, 250, -300);
  var leftback = new Vertex(-300, 400, -200);

  var wallCenter = new Vertex(0, 300, -300);
  var wall = new BottomWall(wallCenter, 200, 200);

  var rightCuboid= new Cuboid(rightfront, 100, 30, 100);
  var leftCuboid= new Cuboid(leftfront, 100, 30, 100);


  var rightBackCuboid= new Cuboid(rightback, 100, 100, 400);
  var leftBackCuboid= new Cuboid(leftback, 100, 100, 400);

  var objects = [rightCuboid, leftCuboid, rightBackCuboid, leftBackCuboid, wall];


  function renderScene() {
    render(objects, ctx, dx, dy, howFar);
  }

  var moveRight = function() {
    move(new Vertex(-10, 0 , 0));
    renderScene();
  };

  var moveLeft = function() {
    move(new Vertex(10, 0 , 0));
    renderScene();
  };

  function moveUp() {
    move(new Vertex(0, 0 , -10));
    renderScene();
  };

  var moveDown = function() {
    move(new Vertex(0, 0 , 10));
    renderScene();
  };

  var moveForward = function() {
    move(new Vertex(0, -10 , 0));
    renderScene();
  };

  var moveBackward = function() {
    move(new Vertex(0, 10 , 0));
    renderScene();
  };

  var rotateUp = function() {
    rotateY -= 5;
    buttonRotate();
    renderScene();
  }

  var rotateDown = function() {
    rotateY += 5;
    buttonRotate();
    renderScene();
  }

  var rotateLeft = function() {
    rotateX -= 5;
    buttonRotate();
    renderScene();
  }

  var rotateRight = function() {
    rotateX += 5;
    buttonRotate();
    renderScene();
  }

  // var rotateLeftAxis = function() {
  //   rotateX += 5;
  //   rotateY -= 5;
  //   buttonRotate();
  //   renderScene();
  // }
  //
  // var rotateRightAxis = function() {
  //   rotateX -= 5;
  //   rotateY += 5;
  //   buttonRotate();
  //   renderScene();
  // }

  var zoomIn = function() {
    howFar += 5;
    renderScene()
  };

  var zoomOut = function() {
    howFar -= 5;
    renderScene()
  };

  $("#transformup").click(function() {
    moveUp();
  });

  $("#transformdown").click(function() {
    moveDown();
  });

  $("#transformleft").click(function() {
    moveLeft();
  });

  $("#transformright").click(function() {
    moveRight();
  });

  $("#transformforward").click(function() {
    moveForward();
  });

  $("#transformbackward").click(function() {
    moveBackward();
  });

  // rotate functions bindings to buttons
  $("#rotateup").click(function() {
    rotateUp();
  });

  $("#rotatedown").click(function() {
    rotateDown();
  });

  $("#rotateleft").click(function() {
    rotateLeft();
  });

  $("#rotateright").click(function() {
    rotateRight();
  });

  // $("#rotateleftaxis").click(function() {
  //   rotateLeftAxis();
  // });
  //
  // $("#rotaterightaxis").click(function() {
  //   rotateRightAxis();
  // });

  // zoom functions bindings to buttons
  $("#zoomin").click(function() {
    zoomIn();
  });

  $("#zoomout").click(function() {
    zoomOut();
  });





  render(objects, ctx, dx, dy, howFar);

  document.onkeydown = function(evt){
    //alert(evt.keyCode)
    switch(event.keyCode)
    {
      case 68://d
      //alert("w prawo!");
        moveRight();
        break;
      case 65://a
      //alert("w lewo!");
        moveLeft();
        break;
      case 87:// w
        moveUp();
        break;
      case 83: //s
        moveDown();
        break;
      case 69: //e
        moveForward();
        break;
      case 82: //e
        moveBackward();
        break;
      case 90: // Z
        zoomIn();
        break;
      case 88: // X
        zoomOut();
        break;
      case 189: // -
        zoomOut();
        break;
      case 187: // +
        zoomIn();
        break;
      case 37: // left
        rotateLeft();
        break;
      case 38: // up
        rotateUp();
        break;
      case 39: // right
        rotateRight();
        break;
      case 40: // down
        rotateDown();
        break;
    }
  }

  var translate = function(object, vector){
    object.x += vector.x;
    object.y += vector.y;
    object.z+= vector.z;
  }

  var move = function(vec){
    for(var i = 0; i< objects.length; i++)
    {
      translate(objects[i].centerPoint, vec);
      objects[i] = refresh(objects[i]);
    }

  }

  var	refresh = function(object){
    switch(object.type){
      case "Cube":
      return  new Cube(object.centerPoint, object.side)
      break;
      case "Cuboid":
      return new Cuboid(object.centerPoint, object.widthX, object.lengthY, object.heightZ);
      break;
      case "BottomWall":
      return new BottomWall(object.centerPoint, object.sideA, object.sideB);
      break;
    }

  }

  // Events
  var mousedown = false;
  var mx = 0;
  var my = 0;

  canvas.addEventListener('mousedown', initMove);
  document.addEventListener('mousemove', startRotation);
  document.addEventListener('mouseup', stopMove);

  function rotate(M, center, theta, phi) {
    // Rotation matrix coefficients

    //1 var center = new Vertex(0, 300, -300);
    var ct = Math.cos(theta);
    var st = Math.sin(theta);
    var cp = Math.cos(phi);
    var sp = Math.sin(phi);



    // Rotation
    var x = M.x - center.x;
    var y = M.y - center.y;
    var z = M.z - center.z;

    // debugger;
    M.x = ct * x - st * cp * y + st * sp * z + center.x;
    M.y = st * x + ct * cp * y - ct * sp * z + center.y;
    M.z = sp * y + cp * z + center.z;
    // debugger;
  }

  // Initialize the movement
  function initMove(evt) {
    mousedown = true;
    mx = evt.clientX;
    my = evt.clientY;
    console.log(mx);
    console.log(my);
  }

  function startRotation(evt) {
    if (mousedown) {
      var theta = (evt.clientX - mx) * Math.PI / 360;
      var phi = (evt.clientY - my) * Math.PI / 180;

      for(var j = 0; j < objects.length; j++)
      for (var i = 0; i < objects[j].vertices.length; ++i)
      //rotate(objects[j].vertices[i], objects[j].centerPoint, theta, phi);
      rotate(objects[j].vertices[i], wallCenter, theta, phi);
      mx = evt.clientX;
      my = evt.clientY;

      render(objects, ctx, dx, dy, howFar);
    }
  }

  function buttonRotate() {
    var theta = rotateX * Math.PI / 360;
    var phi = rotateY * Math.PI / 180;

    for(var j = 0; j < objects.length; j++)
    for (var i = 0; i < objects[j].vertices.length; ++i)
    //rotate(objects[j].vertices[i], objects[j].centerPoint, theta, phi);
    rotate(objects[j].vertices[i], wallCenter, theta, phi);
    rotateX = 0;
    rotateY = 0;
    //render(objects, ctx, dx, dy, howFar);
  }

  function stopMove() {
    mousedown = false;
  }
});
