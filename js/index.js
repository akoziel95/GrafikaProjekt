initButtons();
var c = document.getElementById('cnv');
c.style.width = '100%';
c.style.height = '100%';
c.width = c.offsetWidth;
c.height = c.offsetHeight;
width = c.width;
height = c.height;
var ctx = c.getContext('2d'),
data = ctx.getImageData(0, 0, width, height);

// scena
var scene = {};

// kamera w scenie
scene.camera = {
  point: {x: -8,
    y: 0,
    z: 18
  },
  fieldOfView: 45,
  vector: {
    x: 0,
    y: 3,
    z: 0
  }
};

// swiatlo w scenie
var selectedLight = 0
lightsToSelect = [{
  x: -30,
  y: -10,
  z: 20
}]

scene.lights = [lightsToSelect[0]];

// obiekty w scenie, kazda sfera ma punkt gdzie sie znajduje, kolor, promien
// oraz wlasciwosci materialu
// duza sfera
var bigSphere = {
  type: 'sphere',
  point: {
    x: 0,
    y: 3.5,
    z: -3
  },
  color: {
    x: Math.floor(Math.random() * 256),
    y: Math.floor(Math.random() * 256),
    z: Math.floor(Math.random() * 256)
  },
  specular: 0.1,
  lambert: 0.7,
  ambient: 0.1,
  radius: 3
}

// mala sfera
var smallSphere = {
  type: 'sphere',
  point: {
    x: 5,
    y: 4.5,
    z: -1
  },
  color: {
    x: Math.floor(Math.random() * 256),
    y: Math.floor(Math.random() * 256),
    z: Math.floor(Math.random() * 256)
  },
  specular: 0.1,
  lambert: 0.9,
  ambient: 0.0,
  radius: 1.2
}

// obiekty w scenie
scene.objects = [bigSphere, smallSphere];

// funkcja renderujaca scene
function render(scene) {
  var camera = scene.camera,
  objects = scene.objects,
  lights = scene.lights;

  var eyeVector = Vector.unitVector(Vector.subtract(camera.vector, camera.point)),

  vpRight = Vector.unitVector(Vector.crossProduct(eyeVector, Vector.UP)),
  vpUp = Vector.unitVector(Vector.crossProduct(vpRight, eyeVector)),

  fovRadians = Math.PI * (camera.fieldOfView / 2) / 180,
  heightWidthRatio = height / width,
  halfWidth = Math.tan(fovRadians),
  halfHeight = heightWidthRatio * halfWidth,
  camerawidth = halfWidth * 2,
  cameraheight = halfHeight * 2,
  pixelWidth = camerawidth / (width - 1),
  pixelHeight = cameraheight / (height - 1);

  var index, color;
  var ray = {
    point: camera.point
  };
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      var xcomp = Vector.scale(vpRight, (x * pixelWidth) - halfWidth),
      ycomp = Vector.scale(vpUp, (y * pixelHeight) - halfHeight);

      ray.vector = Vector.unitVector(Vector.add3(eyeVector, xcomp, ycomp));

      // uzywamy wektora aby wykonac raytrace sceny czego wynikiem jest zestaw
      // zmiennych x, y, z bedacy wartosciami R, G, B koloru
      color = trace(ray, scene, 0);
      index = (x * 4) + (y * width * 4),
      data.data[index + 0] = color.x;
      data.data[index + 1] = color.y;
      data.data[index + 2] = color.z;
      data.data[index + 3] = 255;
    }
  }

  // wypelniamy kontekst w canvasie przygotowanymi danymi
  ctx.putImageData(data, 0, 0);
}

// funkcja liczaca slad kazdego promienia
function trace(ray, scene, depth) {
  if (depth > 3) return;

  var distObject = intersectScene(ray, scene);

  // jesli nie ma zadnej kolizji to wektor jest bialy aby wtopic sie w tlo
  if (distObject[0] === Infinity) {
    return Vector.WHITE;
  }

  var dist = distObject[0],
  object = distObject[1];

  var pointAtTime = Vector.add(ray.point, Vector.scale(ray.vector, dist));

  return surface(ray, scene, object, pointAtTime, sphereNormal(object, pointAtTime), depth);
}

// funkcja obliczajaca kolizje promieni ze scena
function intersectScene(ray, scene) {
  // na poczatku zakladamy, ze nie ma kolizji wiec promien idzie w nieskonczonosc
  var closest = [Infinity, null];

  // sprawdzamy kolizje promieni ze wszystkimi obiektami po kolei
  for (var i = 0; i < scene.objects.length; i++) {
    var object = scene.objects[i],
    dist = sphereIntersection(object, ray);
    if (dist !== undefined && dist < closest[0]) {
      closest = [dist, object];
    }
  }
  return closest;
}

// funkcja obliczajaca kolizje promieni ze sfera
function sphereIntersection(sphere, ray) {
  var eye_to_center = Vector.subtract(sphere.point, ray.point),
  v = Vector.dotProduct(eye_to_center, ray.vector),
  eoDot = Vector.dotProduct(eye_to_center, eye_to_center),
  discriminant = (sphere.radius * sphere.radius) - eoDot + (v * v);

  // jesli dyskryminanta jest ujemna to zaden promien nie dotarl do sfery
  if (discriminant < 0) {
    return;
  } else {
    // w przeciwnym wypadku zwracamy odleglosc
    // od kamery do sfery gdzie nastapila kolizja
    return v - Math.sqrt(discriminant);
  }
}

// funkcja obliczajaca wektor normalny dla danego punktu sfery,
// potrzebny aby wiedziec jak promien odbija sie od sfery
function sphereNormal(sphere, pos) {
  return Vector.unitVector(
    Vector.subtract(pos, sphere.point));
}

  // funkcja obliczajaca kolor danej powierzchni jesli zostala wykryta kolizja
function surface(ray, scene, object, pointAtTime, normal, depth) {
  var b = object.color,
  c = Vector.ZERO,
  lambertAmount = 0;

  // odbicie lambertowskie dzieki ktoremu mozemy zobaczyc gradacje na obiekcie
  if (object.lambert) {
    for (var i = 0; i < scene.lights.length; i++) {
      var lightPoint = scene.lights[0];
      if (!isLightVisible(pointAtTime, scene, lightPoint)) continue;

      var contribution = Vector.dotProduct(Vector.unitVector(
        Vector.subtract(lightPoint, pointAtTime)), normal);
        if (contribution > 0) lambertAmount += contribution;
      }
    }

    // odbicie lustrzane
    if (object.specular) {
      var reflectedRay = {
        point: pointAtTime,
        vector: Vector.reflectThrough(ray.vector, normal)
      };
      var reflectedColor = trace(reflectedRay, scene, ++depth);
      if (reflectedColor) {
        c = Vector.add(c, Vector.scale(reflectedColor, object.specular));
      }
    }

    lambertAmount = Math.min(1, lambertAmount);

    // ambient czyli kolor otaczajacy obiekt, nawet jesli nie ma widocznego
    // zrodla swiatla to obiekt nadal zachowa swoje wlasciwosci kolorystyczne
    return Vector.add3(c,
      Vector.scale(b, lambertAmount * object.lambert),
      Vector.scale(b, object.ambient));
}

// funkcja sprawdzajaca czy z danego punktu jest widoczne zrodlo swiatla
// dzieki temu widzimy na jednych obiektach cien drugich
function isLightVisible(pt, scene, light) {
  var distObject =  intersectScene({
    point: pt,
    vector: Vector.unitVector(Vector.subtract(pt, light))
  }, scene);
  return distObject[0] > -0.005;
}

render(scene);

// funkcje zmiany wlasciwosci obiektow
// specular duzej sfery
function changeBigSphereSpecular(){
  bigSphere.specular = this.value/100;
  render(scene);
}

// lambert duzej sfery
function changeBigSphereLambert(){
  bigSphere.lambert = this.value/100;
  render(scene);
}

// ambient duzej sfery
function changeBigSphereAmbient(){
  bigSphere.ambient = this.value/100;
  render(scene);
}

// specular malej sfery
function changeSmallSphereSpecular(){
  smallSphere.specular = this.value/100;
  render(scene);
}

// lambert malej sfery
function changeSmallSphereLambert(){
  smallSphere.lambert = this.value/100;
  render(scene);
}

// ambient malej sfery
function changeSmallSphereAmbient(){
  smallSphere.ambient = this.value/100;
  render(scene);
}

// obsluga sliderow z wlasciwosciami obiektow
document.getElementById('bigSphereSpecular').onchange = changeBigSphereSpecular;
document.getElementById('bigSphereLambert').onchange = changeBigSphereLambert;
document.getElementById('bigSphereAmbient').onchange = changeBigSphereAmbient;

document.getElementById('smallSphereSpecular').onchange = changeSmallSphereSpecular;
document.getElementById('smallSphereLambert').onchange = changeSmallSphereLambert;
document.getElementById('smallSphereAmbient').onchange = changeSmallSphereAmbient;


render(scene);

// funkcje obslugujace parametry kamery tzn translacje, obroty i zoom
// translacja kamery w prawo
function increaseCameraX() {
  currentX = scene.camera.point.x;
  scene.camera.point.x += 5;
  render(scene);
}

// translacja kamery w lewo
function decreaseCameraX() {
  currentX = scene.camera.point.x;
  scene.camera.point.x -= 5;
  render(scene);
}

// translacja kamery do gory
function increaseCameraY() {
  currentY = scene.camera.point.y;
  scene.camera.point.y += 5;
  render(scene);
}

// translacja kamery w dol
function decreaseCameraY() {
  currentY = scene.camera.point.y;
  scene.camera.point.y -= 5;
  render(scene);
}

// translacja kamery do przodu
function increaseCameraZ() {
  currentZ = scene.camera.point.z;
  scene.camera.point.z += 5;
  render(scene);
}

// translacja kamery do tylu
function decreaseCameraZ() {
  currentZ = scene.camera.point.z;
  scene.camera.point.z -= 5;
  render(scene);
}

// poszerzenie pola widzenia kamery
function increaseFieldOfView() {
  currentFieldOfView = scene.camera.fieldOfView;
  scene.camera.fieldOfView += 5;
  render(scene);
}

// zmniejszenie pola widzenia kamery
function decreaseFieldOfView() {
  currentFieldOfView = scene.camera.fieldOfView;
  scene.camera.fieldOfView -= 5;
  render(scene);
}

// obrot kamery w prawo
function increaseCameraVectorX() {
  currentX = scene.camera.vector.x;
  scene.camera.vector.x += 0.5;
  render(scene);
}

// obrot kamery w lewo
function decreaseCameraVectorX() {
  currentX = scene.camera.vector.x;
  scene.camera.vector.x -= 0.5;
  render(scene);
}

// obrot kamery do gory
function increaseCameraVectorY() {
  currentY = scene.camera.vector.y;
  scene.camera.vector.y += 0.5;
  render(scene);
}

// obrot kamery w dol
function decreaseCameraVectorY() {
  currentY = scene.camera.vector.y;
  scene.camera.vector.y -= 0.5;
  render(scene);
}

// funkcje zmiany parametrow zrodla swiatla
// translacja zrodla swiatla w prawo
function increaseLightX() {
  scene.lights[0].x += 5;
  render(scene);
}

// translacja zrodla swiatla w lewo
function decreaseLightX() {
  scene.lights[0].x -= 5;
  render(scene);
}

// translacja zrodla swiatla do gory
function increaseLightY() {
  scene.lights[0].y += 5;
  render(scene);
}

// translacja zrodla swiatla do dolu
function decreaseLightY() {
  scene.lights[0].y -= 5;
  render(scene);
}

// translacja zrodla swiatla do przodu
function increaseLightZ() {
  scene.lights[0].z += 5;
  render(scene);
}

// translacja zrodla swiatla do tylu
function decreaseLightZ() {
  scene.lights[0].z -= 5;
  render(scene);
}

// funkcja initujaca funkcje guzikow na panelu z guzikami
function initButtons() {
  // translacje kamery
  $("#transformup").click(function() {
    decreaseCameraVectorY();
  });

  $("#transformdown").click(function() {
    increaseCameraVectorY();
  });

  $("#transformleft").click(function() {
    decreaseCameraVectorX();
  });

  $("#transformright").click(function() {
    increaseCameraVectorX();
  });

  $("#transformforward").click(function() {
    decreaseCameraZ();
  });

  $("#transformbackward").click(function() {
    increaseCameraZ();
  });

  // rotacje kamery
  $("#rotateup").click(function() {
    increaseCameraY();
  });

  $("#rotatedown").click(function() {
    decreaseCameraY();
  });

  $("#rotateleft").click(function() {
    increaseCameraX();
  });

  $("#rotateright").click(function() {
    decreaseCameraX();
  });

  // zoom
  $("#zoomin").click(function() {
    decreaseFieldOfView();
  });

  $("#zoomout").click(function() {
    increaseFieldOfView();
  });

  // translacje zrodla swiatla
  $("#transformLightup").click(function() {
    decreaseLightY();
  });

  $("#transformLightdown").click(function() {
    increaseLightY();
  });

  $("#transformLightleft").click(function() {
    decreaseLightX();
  });

  $("#transformLightright").click(function() {
    increaseLightX();
  });

  $("#transformLightforward").click(function() {
    decreaseLightZ();
  });

  $("#transformLightbackward").click(function() {
    increaseLightZ();
  });
}
