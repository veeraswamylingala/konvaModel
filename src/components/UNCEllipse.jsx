import { Ellipse } from "react-konva";
import { getRectPointX, getRectPointY } from "./CanvasUtils.js";
import React, { useState } from 'react'
import axios from 'axios';


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

  return (
    <Ellipse
      key={"Ellipse_" + shape.object.object_id + shape.object.object_number}
      id={"Ellipse_" + shape.object.object_id + shape.object.object_number}
     
      x={getRectPointX(shape, parentX)}
      y={getRectPointY(shape, parentY)}

      
      width={parseFloat(shape.ellipse.x2)}
      height={parseFloat(shape.ellipse.y2)}

      visible={ shape.object.security != undefined ? hide :  true }

      // fill={ shape.dynamic_fill == undefined?  shape.fill == undefined ? "" : shape.fill.fill == "#5b5b5b" ? "#c0c0c0"  :shape.fill.fill:
      // this.state.display_on_off_value == true ?  this.androidToRgba(shape.dynamic_fill.on_off.on_color) : this.androidToRgba(shape.dynamic_fill.on_off?.off_color) }

       fill={shape.dynamic_fill != undefined ? dynamcifill  :shape?.fill?.fill}
 
      stroke={"black"}
      draggable={false}
      shadowBlur={10}
      strokeWidth={parseFloat(shape.line.line_width)}
      //fillLinearGradientStartPointX={this.getXPoint(shape)+parseFloat(obj.x1)}
      //fillLinearGradientStartPointY={this.getYPoint(shape)+parseFloat(obj.y1)}
      // fillLinearGradientColorStops={1,shape.gradient===undefined?"nofill":shape.gradient.gradient_color}
    />
  );
};

export default UNCEllipse;
