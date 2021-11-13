import { Ellipse } from "react-konva";
import { getRectPointX, getRectPointY } from "./CanvasUtils.js";
import React, { useState } from 'react'
import axios from 'axios';
import { hextoRGBA, lineStyle, gradientStartPoints, gradientEndPoints } from './Utils';



const UNCEllipse = (shapeProps) => {
  const { shape, parentX, parentY } = shapeProps;


  const [hide, setHide] = useState(0);
  const [dynamcifill, setDynamicFill] = useState(0);


  function androidToRgba(color){
   
    const colorArray = []
    for(let i=0; i<4; i++){
      colorArray.push(color % 256)
      color>>>=8
    }
    const alpha = colorArray.pop() / 255
    return `rgba(${colorArray.reverse()},${alpha})`
  }
 

  //Dynamic_Filll-----------------------------------------------------------------------
  if(shape.dynamic_fill != undefined)
  {
    var value = shape.dynamic_fill.on_off.on_color_when
    axios({
      method: 'post',
      url: "https://demo3412.herokuapp.com/tag",
      headers: {}, 
      data: {
        tagname:value, // This is the body part
      }
    }).then((res)=>{
   if(res.data.tagValue > 80)
   {
     console.log("onColor")
    setDynamicFill(androidToRgba(shape.dynamic_fill.on_off.on_color))
    
   }else{
    console.log("OffColor")
    setDynamicFill(androidToRgba(shape.dynamic_fill.on_off.off_color))
   }
    });
  }
  
  //hidden_When-------------------------------------------------------------------------------------
  if(shape.object.security != undefined)
  {
    var value = shape.object.security.hidden_when.__cdata ;
    axios({
      method: 'post',
      url: "https://demo3412.herokuapp.com/tag",
      headers: {}, 
      data: {
        tagname:value, // This is the body part
      }
    }).then((res)=>{
      // console.log(res.data.tagValue)
     
   if(res.data.tagValue > 50)
   {
    setHide(true)
    console.log("Visible")
   }else{
    setHide(false)
    console.log("Not Visible")
   }
    });
  }

  
  //EllipseGradientStartPoints----------------------------------------
  function ellipseGradientStartPoints(shape, x1, x2, y1, y2) {
    ////console.log(shape.gradient.gradient_direction)

    switch (parseInt(shape.gradient.gradient_direction)) {
      //-0---GRADIENT_LEFT_TO_RIGHT     
      case 0:
        return { x: -x2 / 2, y: y2 };
      //-1--GRADIENT_RIGHT_TO_LEFT
      case 1:
        return { x: x2 / 2, y: y2 };
      //-2--GRADIENT_TOP_TO_BOTTOM
      case 2:
        return { x: x2, y: -y2 / 2 };
      //-3--GRADIENT_BOTTOM_TO_TOP 
      case 3:
        return { x: x2, y: y2 / 2 };
      //-4--GRADIENT_HORIZONTAL_TO_MIDDLE 
      case 4:
        return { x: -x2 / 2, y: y2 };

      //-5---GRADIENT_HORIZONTAL_FROM_MIDDLE 
      case 5:
        return { x: -x2 / 2, y: y2 };

      //-6--GRADIENT_HORIZONTAL_TO_MIDDLE 
      case 6:
        return { x: x2, y: y2 / 2 };

      // //--7--GRADIENT_VERTICAL_FROM_MIDDLE
      case 7:
        return { x: x2, y: - y2 / 2 };

      default: return { x: 0, y: 0 };
    }
  }

  //Ellipse Gardient End Point----------------------------------------------
  function ellipseGradientEndPoints(shape, x1, x2, y1, y2) {
    switch (parseInt(shape.gradient.gradient_direction)) {
      //-0---GRADIENT_LEFT_TO_RIGHT     
      case 0:
        return { x: x2 / 2, y: y2 };
      //-1--GRADIENT_RIGHT_TO_LEFT
      case 1:
        return { x: -x2 / 2, y: y2 };
      //-2--GRADIENT_TOP_TO_BOTTOM
      case 2:
        return { x: x2, y: y2 / 2 };
      //-3--GRADIENT_BOTTOM_TO_TOP 
      case 3:
        return { x: x2, y: - y2 / 2 };
      //-4--GRADIENT_HORIZONTAL_TO_MIDDLE 
      case 4:
        return { x: x2 / 2, y: y2 };
      //-5---GRADIENT_HORIZONTAL_FROM_MIDDLE
      case 5:
        return { x: x2 / 2, y: y2 };
      //-6--GRADIENT_VERTICAL_TO_MIDDLE 
      case 6:
        return { x: x2, y: - y2 / 2 };
      // //--7--GRADIENT_VERTICAL_FROM_MIDDLE
      case 7:
        return { x: x2, y: y2 / 2 };
      default: return { x: 0, y: 0 };
    }
  }

  //Gradient Fill Basedon the gradient_Direction----------------
  function gradientFill() {

    if (shape.gradient.gradient_direction < 4) {

      return [0, shape.dynamic_fill != undefined ? dynamcifill ?? "black" : shape.fill != undefined ? hextoRGBA(shape.fill.fill) : "grey" ?? "black"
        , 1, shape.gradient != undefined ? hextoRGBA(shape?.gradient?.gradient_color) : "grey" ?? "black"];
    } else if (shape.gradient.gradient_direction >= 4) {

      if (shape.gradient.gradient_direction == 4 || shape.gradient.gradient_direction == 6) {
        return [0, shape.dynamic_fill != undefined ? dynamcifill ?? "black" : shape.fill != undefined ? hextoRGBA(shape.fill.fill) : "grey" ?? "black",
          0.5, shape.gradient != undefined ? hextoRGBA(shape?.gradient?.gradient_color) : "grey" ?? "black"

          , 1, shape.dynamic_fill != undefined ? dynamcifill ?? "black" : shape.fill != undefined ? hextoRGBA(shape.fill.fill) : "grey" ?? "black"];
      }
      else if (shape.gradient.gradient_direction == 5 || shape.gradient.gradient_direction == 7) {
        return [0, shape.dynamic_fill != undefined ? dynamcifill ?? "black" : shape.fill != undefined ? hextoRGBA(shape?.gradient?.gradient_color) : "grey" ?? "black",
          0.5, shape.gradient != undefined ? hextoRGBA(shape.fill.fill) : "grey" ?? "black"

          , 1, shape.dynamic_fill != undefined ? dynamcifill ?? "black" : shape.fill != undefined ? hextoRGBA(shape?.gradient?.gradient_color) : "grey" ?? "black"];

      }
    }

  }



  return (
   <Ellipse
      key={"Ellipse_" + shape.object.object_id + shape.object.object_number}
      id={"Ellipse_" + shape.object.object_id + shape.object.object_number}

      x={getRectPointX(shape, parentX)}
      y={getRectPointY(shape, parentY)}
      width={parseFloat(shape.ellipse.x2)}
      height={parseFloat(shape.ellipse.y2)}

      visible={shape.object.security != undefined ? !hide : true}

      fillLinearGradientStartPoint={shape.gradient != undefined ?
        ellipseGradientStartPoints(shape, shape.ellipse.x1 / 2, shape.ellipse.x2 / 2,
          shape.ellipse.y1 / 2,
          shape.ellipse.y2 / 2
        ) : {}}

      fillLinearGradientEndPoint={shape.gradient != undefined ?
        ellipseGradientEndPoints(shape, shape.ellipse.x1 / 2, shape.ellipse.x2 / 2,
          shape.ellipse.y1 / 2,
          shape.ellipse.y2 / 2) : {}}
      //  fillLinearGradientColorStops={[0,"red",1,"green"]}

      fillLinearGradientColorStops={shape.gradient === undefined ? [] :
        gradientFill()}

      fill={shape.gradient === undefined ?
        shape.dynamic_fill != undefined ? dynamcifill :
          shape.fill != undefined ? hextoRGBA(shape.fill.fill) : "grey" : ""}

      strokeWidth={parseFloat(shape.line.line_width)}
      stroke={hextoRGBA(shape.line.color)}
      draggable={false}

      dashEnabled={true}
      dash={lineStyle(shape.line.style)}
    />
  );
};

export default UNCEllipse;
