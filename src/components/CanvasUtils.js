import { parse } from "fast-xml-parser";

//X Position for Rectangle and Ellipse--------------------------
export const getRectPointX = (shape, parentX) => {
  parentX = parentX === undefined ? 0 : parentX;
  switch (shape.type) {
    case "Rectangle":
    case "Image":
      // console.log(parentX);
      return (
        parseFloat(shape.rectangle.x1) +
        parseFloat(shape.box.axis_offset_left) +
        parseFloat(parentX)
      );
    case "Ellipse":
      return (
        parseFloat(parentX) + parseFloat(shape.ellipse.x1) +
         parseFloat(shape.box.axis_offset_left) + 
         (parseFloat(shape.box.left) + parseFloat(shape.box.right)) / 2
      );
  }
};


//Y Position for Rectangle and Ellipse------------------------
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


//Line Related [X,Y]Points-------------------------------------------------------
//Pipe Points--------------------------------------------
export const getPipePoints = (shape, parentX, parentY) => {

  parentY = parentY === undefined ? 0 : parentY;
  parentX = parentX === undefined ? 0 : parentX;
  var ptx = [];

  if (Array.isArray(shape.pipe.points)) {
    ptx = shape.pipe.points.map((o) => ({
      x: parseFloat(o.x),
      y: parseFloat(o.y)
    }));
  } else {
    if(Array.isArray(shape.pipe.points.point)){

    ptx = shape.pipe.points.point.map((g) => ({
      x: parseFloat(g.x),
      y: parseFloat(g.y),
    }));
  }else{
    console.log("entered Else")
    console.log(shape.pipe.points.point)
    ptx = ({
      x: parseFloat(shape.pipe.points.point.x),
      y: parseFloat(shape.pipe.points.point.y),
    });
  }
  }
  var data = [];
  //console.log(ptx)
  //If pipe has multiple Points
  if(Array.isArray(ptx)){
  ptx.map((point) => {

    //if the object is Not from Component_Instance 
    if (parentX == 0 && parentY == 0) {
    //push x
    data.push(point.x + parseFloat(shape.box.axis_offset_left))
    //push y
    data.push(point.y + parseFloat(shape.box.axis_offset_top))

    }  //if the object is Not from Component_Instance 
    else {

  //push x
      data.push(point.x + parseFloat(shape.box.left) / 2 + parseFloat(parentX ?? "0") + parseFloat(shape.box.axis_offset_left))
      //push y
      data.push(point.y + parseFloat(shape.box.top) / 2 + parseFloat(parentY ?? "0") + parseFloat(shape.box.axis_offset_top))
    }

  });
}
  return data;
}




//Polygon-----------------------------------------------------
export const getPolygonPoints = (shape, parentX, parentY) => {

  var ptx = [];
  if (Array.isArray(shape.polyline.points)) {
    ptx = shape.polyline.points.map((o) => ({
      x: parseFloat(o.x),
      y: parseFloat(o.y),
    }));
  } else {
    if(Array.isArray(shape.polyline.points.point)){
      ptx = shape.polyline.points.point.map((g) => {
        return ({
          x: parseFloat(g.x),
          y: parseFloat(g.y),
        });
      })
    }
  }
  var data = [];
  ptx.map((point) => {
    //if the object is Not from Component_Instance 
    if (parentX == 0 && parentY == 0) {
      //push x
      data.push(point.x + parseFloat(shape.box.axis_offset_left))
      //push y
      data.push(point.y + parseFloat(shape.box.axis_offset_top))

    }
    //if the object is  from Component_Instance 
    else {
      // console.log(point.x)
      // console.log(point.y)
      //push x
      data.push(point.x + parseFloat(shape.box.left) / 4 + parseFloat(parentX ?? "0") + parseFloat(shape.box.axis_offset_left))
      //push y
      data.push(point.y + parseFloat(shape.box.top) / 4 + parseFloat(parentY ?? "0") + parseFloat(shape.box.axis_offset_top))
    }
  });
  return data;
}




//Line Points-------------------------------------------------
export const getLinePoints = (shape, parentX, parentY) => {

  var ptx = [];
  //starting Point{x:,y:}
  ptx.push({ x: shape.box.left, y: shape.box.top });
  //Ending Point{x:,y:}
  ptx.push({ x: shape.box.right, y: shape.box.bottom });

  let ptArray = [];
  ptx.map((element) => {
    //If the Object is NotFrom Component Instance 
    if (parentX == 0 && parentY == 0) {
      //XPush
      ptArray.push(
        parseFloat(element.x) +
        parseFloat(shape.box.axis_offset_left)
      );
      //YPush
      ptArray.push(
        parseFloat(element.y) +
        parseFloat(shape.box.axis_offset_top)
      );
    }  //If the Object is From Component Instance 
    else {
      //XPush
      ptArray.push(
        parseFloat(element.x) +
        parseFloat(shape.box.axis_offset_left) + parseFloat(parentX ?? "0")
      );
      //YPush
      ptArray.push(
        parseFloat(element.y) +
        parseFloat(shape.box.axis_offset_top) + parseFloat(parentY ?? "0")
      );

    }
  })


  return ptArray;
};
