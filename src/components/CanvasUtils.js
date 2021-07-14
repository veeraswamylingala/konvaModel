export const getRectPointX = (shape, parentX) => {
  parentX = parentX === undefined ? 0 : parentX;
  switch (shape.type) {
    case "Rectangle":
      // console.log(parentX);
      return (
        parseFloat(shape.rectangle.x1) +
        parseFloat(shape.box.axis_offset_left) +
        parseFloat(parentX)
      );
    case "Ellipse":
      return (
        parseFloat(parentX) +parseFloat(shape.ellipse.x1) + parseFloat(shape.box.axis_offset_left) + (parseFloat(shape.box.left) + parseFloat(shape.box.right)) / 2
      );
    
  }
};

export const getRectPointY = (shape, parentY) => {
  parentY = parentY === undefined ? 0 : parentY;
  //console.log(shape.type);
  switch (shape.type) {
    case "Rectangle":
      return (
        parseFloat(parentY) +
        parseFloat(shape.rectangle.y1) +
        parseFloat(shape.box.axis_offset_top)
      );
    case "Ellipse":
      return (
        parseFloat(parentY) +
        parseFloat(shape.ellipse.y1) +
        parseFloat(shape.box.axis_offset_top) +
        (parseFloat(shape.box.top) + parseFloat(shape.box.bottom)) / 2
      );
  }
};

export const getPloyPoints = (shape, parentX, parentY) => {
  // console.log("getPloyPoints");
  parentY = parentY === undefined ? 0 : parentY;
  parentX = parentX === undefined ? 0 : parentX;
  var ptx = [];
  // console.log(shape.type);
  switch (shape.type) {
    case "Pipe":
      if (Array.isArray(shape.pipe.points)) {
        ptx = shape.pipe.points.map((o) => ({
          x: parseFloat(o.x),
          y: parseFloat(o.y),
        }));
      } else {
        ptx = shape.pipe.points.point.map((g) => ({
          x: parseFloat(g.x),
          y: parseFloat(g.y),
        }));
      }
      break;
    case "Polygon":
      if (Array.isArray(shape.polyline.points)) {
        ptx = shape.polyline.points.map((o) => ({
          x: parseFloat(o.x),
          y: parseFloat(o.y),
        }));
      } else {
        ptx = shape.polyline.points.point.map((g) => ({
          x: parseFloat(g.x),
          y: parseFloat(g.y),
        }));
      }
      break;
      case "Line":
        ptx.push({ x: shape.box.left, y: shape.box.top });
        ptx.push({ x: shape.box.right, y: shape.box.bottom });
        break;
  }

  let ptArray = [];
  ptx.forEach((element) => {
    ptArray.push(
      parseFloat(element.x) +
        parseFloat(parentX) +
        parseFloat(shape.box.axis_offset_left) +
        parseFloat(shape.box.left) / 2
    );
    ptArray.push(
      parseFloat(element.y) +
        parseFloat(parentY) +
        parseFloat(shape.box.axis_offset_top) +
        parseFloat(shape.box.top) / 2
    );
  });
  // console.log(ptArray);
  return ptArray;
};
