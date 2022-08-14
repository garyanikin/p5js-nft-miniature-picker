const CANVAS_SIZE = Math.min(window.innerWidth, 400);

let cursor;
let touchMove,
  touchZoom = null;
let photo, maskImage;

function preload() {
  photo = loadImage("./bg.jpg");
  maskImage = loadImage("./polygon.png");
}

function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);

  cursor = createCursor();
}

function draw() {
  clear();

  const { getPos, getSize } = cursor;
  const size = getSize();
  const { u, v } = getPos();
  const x = width * u;
  const y = height * v;

  drawingContext.save();
  // draw mask
  strokeWeight(6);
  stroke("white");
  fill(color("red"));

  const polygonSize = size * width * 0.45;
  polygon(x, y, polygonSize, 7, 20, 5, PI / 2.8);
  drawingContext.clip();
  // draw photo
  photo.resize(width, 0);
  image(photo, 0, 0);
  drawingContext.restore();

  // вписанная окружность
  // strokeWeight(2);
  // noFill();
  // circle(x, y, size * width * 0.85);
}

function touchStarted() {
  // support only 2 touches
  if (touches.length > 2) return;

  if (isCursorTouched()) {
    setTouchMove();
  }

  const zoomer = getZoomer();
  if (zoomer) {
    const mover = getMover();
    touchZoom = {
      size: cursor.getSize(),
      init: dist(mover.u, mover.v, zoomer.u, zoomer.v),
    };
  }

  // prevent default
  return false;
}

function setTouchMove() {
  touchMove = { cursor: cursor.getPos(), mover: getMover() };
}

function touchEnded() {
  if (touchZoom && !getZoomer()) {
    touchZoom = null;
    touchMove = null;
  }
}

function touchMoved() {
  const zoomer = getZoomer();
  if (zoomer) {
    const mover = getMover();
    const delta = dist(mover.u, mover.v, zoomer.u, zoomer.v);
    const scale = touchZoom.size * (delta / touchZoom.init);
    const normalized = Math.max(Math.min(scale, 1), 0.3);
    cursor.scale(normalized);
    return;
  }

  if (touchMove && isCursorTouched()) {
    moveCursor(touchMove);
  }
}

function getMover() {
  const mover = touches[0];
  if (mover) {
    return uv(mover);
  }
  return null;
}

function getZoomer() {
  const zoomer = touches[1];
  return zoomer ? uv(zoomer) : null;
}

function isCursorTouched() {
  const mover = getMover();
  return mover ? cursor.isTouch(mover) : false;
}

function moveCursor({ mover: initPos, cursor: initCursor }) {
  const mover = getMover();
  if (cursor.isTouch(mover)) {
    const delta = subUv(mover, initPos);
    const newPos = addUv(initCursor, delta);
    cursor.move(cursor.inLimits(newPos));
    setTouchMove();
  }
}

function createCursor() {
  const circle = 0.45;
  const vCorrector = 0.02;

  let u = 0.5,
    v = 0.5,
    size = 1;
  const inLimits = ({ u, v }) => {
    const scaledCircle = circle * size;
    const scaledCorrector = vCorrector * size;

    const maxU = (u) => Math.min(u, 1 - scaledCircle);
    const minU = (u) => Math.max(u, scaledCircle);
    const newU = minU(maxU(u));

    const maxV = (v) => Math.min(v, 1 + scaledCorrector - scaledCircle);
    const minV = (v) => Math.max(v, scaledCircle + scaledCorrector);
    const newV = minV(maxV(v));

    return {
      u: newU,
      v: newV,
    };
  };
  const move = (pos) => {
    u = pos.u;
    v = pos.v;
  };
  const getSize = () => size;
  const scale = (_scale) => (size = _scale);
  const getPos = () => ({
    u,
    v,
  });
  const isTouch = (pos) => {
    // касание внтури вписанной в курсор окружности
    const distance = dist(pos.u, pos.v, u, v);
    return distance < 0.445 * size;
  };

  return {
    getPos,
    isTouch,
    getSize,
    move,
    scale,
    inLimits,
  };
}

function subUv(uv1, uv2) {
  return {
    u: uv1.u - uv2.u,
    v: uv1.v - uv2.v,
  };
}

function addUv(uv1, uv2) {
  return {
    u: uv1.u + uv2.u,
    v: uv1.v + uv2.v,
  };
}

function uv({ x, y }) {
  return { u: x / width, v: y / height };
}

function xy({ u, v }) {
  return { x: u * width, y: v * height };
}
