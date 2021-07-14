import preFunctions from "./preFunctions";
import {
  Stage,
  Polyline,
  Shape,
  Layer,
  Rect,
  Ellipse,
  Text,
  Circle,
  Line,
  Group,
  Arc,
  Image
} from "react-konva";
// import "konva/lib/shapes";
import { getRectPointX, getRectPointY } from "./CanvasUtils.js";
import React, { Component } from "react";
import { render } from "react-dom"; 
const UNCButton = (shapeElement) => {
  const { shape, parentX, parentY,ProjectId } = shapeElement;

  
var finalLabel = "";
var buttonLabel = "" ;
 buttonLabel = shape?.input_touch?.up?.command?.__cdata.toString();
 var objectId= shape.object.object_id


finalLabel = preFunctions.mainFunction(buttonLabel,ProjectId,objectId)

  return (
          <Group>
   
         <Rect
      id={"But" + shape.object.object_id + shape.object.object_number}

     x={ parseFloat(parentX)+ parseFloat(shape.box.axis_offset_left)+((parseFloat(shape.box.left))/2)}
     y={ parseFloat(parentY) +parseFloat(shape.box.axis_offset_top)+((parseFloat(shape.box.top))/2)}
     
        width={parseFloat(shape.box.right)}
      height={parseFloat(shape.box.bottom)}

     fill ='white'
  strokeWidth={2}
     stroke = { "grey" }


      />
      <Text  
        x={ parseFloat(parentX)+ parseFloat(shape.box.axis_offset_left)+((parseFloat(shape.box.left))+parseFloat(0)/2)}
       y={ parseFloat(parentY) +parseFloat(shape.box.axis_offset_top)+((parseFloat(shape.box.top))+parseFloat(20)/2)}
       text = {finalLabel}
      ></Text>

          </Group>
      );
};


export default UNCButton;
