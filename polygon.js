/** A primitive function for rounded polygonal shape
 * Polygon is circumscribed in a circle of radius 'size'
 * Round corners radius is speci
 * similar to circle(x,y,s) with an extra parameters
 * @param x - x center of polygon
 * @param y - y center of polygon
 * @param size - size of polygon (radius of circumscribed circle)
 * @param sides - number of polygon sides
 * @param radius - radius of rounded corners
 * @param res - angular resolution of each corner in points (default 5)
 * @param rot - global rotation applied to shape (default 0)
 * @author Gilles Gonon - http://gilles.gonon.free.fr
 * @license GPL
 */
function polygon(x, y, size, sides = 3, radius = 0, res = 5, rot = 0) {
  // Polygon is drawned inside a circle
  // Angle of 1 corner of polygon
  let apoly = (sides > 2 ? (sides - 2) * PI : TWO_PI) / sides;
  // Radius angle
  let aradius = sides > 2 ? PI - apoly : PI;
  // distance between vertex and radius center
  let r = 2 * radius * sin(HALF_PI - 0.5 * apoly);
  push();
  // debug log
  // console.log('Polygon : sides '+sides+', apoly:'+degrees(apoly).toPrecision(4)+', aradius:'+degrees(aradius).toPrecision(4)+',distance from vertex for radius:'+rproj.toPrecision(4))

  // Start drawing
  push();
  translate(x, y);
  rotate(rot);
  beginShape();
  for (let a = 0; a < sides; a++) {
    // Rotation for polygon vertex
    let rot = (a * TWO_PI) / sides;
    if (radius) {
      // Vertex coordinates
      let cx = (size - r) * cos(rot);
      let cy = (size - r) * sin(rot);
      for (let i = 0; i < res; i++) {
        let rotrad = rot + (i * aradius) / (res - 1) - 0.5 * aradius;
        let px = radius * cos(rotrad);
        let py = radius * sin(rotrad);
        vertex(cx + px, cy + py);
        // circle(cx + px, cy + py, 0.15*i+2)
      }
      // circle(cx, cy, 0.15*a+2)
    } else {
      let dx = size * cos(rot);
      let dy = size * sin(rot);
      vertex(dx, dy);
      // circle(dx,dy, 0.15*a+2);
    }
  }
  endShape(CLOSE);
  pop();
}
