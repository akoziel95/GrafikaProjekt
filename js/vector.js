var Vector = {};

// stale wektorow
Vector.UP = { x: 0, y: 1, z: 0 };
Vector.ZERO = { x: 0, y: 0, z: 0 };
Vector.WHITE = { x: 255, y: 255, z: 255 };
Vector.ZEROcp = function() {
    return { x: 0, y: 0, z: 0 };
};

// operacje na wektorach
// funkcja liczaca iloczyn skalarny wektora
Vector.dotProduct = function(a, b) {
    return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
};

// funkcja liczaca iloczyn wektorowy
// (wektor prostopadly do obydwu podanych)
Vector.crossProduct = function(a, b) {
    return {
        x: (a.y * b.z) - (a.z * b.y),
        y: (a.z * b.x) - (a.x * b.z),
        z: (a.x * b.y) - (a.y * b.x)
    };
};

// skaluje wektor o wspolczynnik t
Vector.scale = function(a, t) {
    return {
        x: a.x * t,
        y: a.y * t,
        z: a.z * t
    };
};

// funkcja liczaca wektor jednostkowy, czyli wektor o dlugosci 1 pokazujacy
// kierunek i zwrot danego wektora
Vector.unitVector = function(a) {
    return Vector.scale(a, 1 / Vector.length(a));
};

// funkcja dodajaca dwa wektory
Vector.add = function(a, b) {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
        z: a.z + b.z
    };
};

// funkcja dodajaca trzy wektory
Vector.add3 = function(a, b, c) {
    return {
        x: a.x + b.x + c.x,
        y: a.y + b.y + c.y,
        z: a.z + b.z + c.z
    };
};

// funkcja odejmujaca dwa wektory
Vector.subtract = function(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z
    };
};

// funkcja liczaca dlugosc danego wektora wg normy Euklidesowej
Vector.length = function(a) {
    return Math.sqrt(Vector.dotProduct(a, a));
};

// funkcja liczaca wektor bedacy odbiciem danego wektora od powierzchni
Vector.reflectThrough = function(a, normal) {
    var d = Vector.scale(normal, Vector.dotProduct(a, normal));
    return Vector.subtract(Vector.scale(d, 2), a);
};
