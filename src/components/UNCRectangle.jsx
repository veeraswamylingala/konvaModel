import { Rect } from "react-konva";
import { getRectPointX, getRectPointY } from "./CanvasUtils.js";
import { useState  } from 'react';
import axios from 'axios';


const UNCRectangle = (shapeElement) => {
const { shape, parentX, parentY } = shapeElement;

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


//Dynamci_fILL---------------------------------------------------------------
if(shape.dynamic_fill != undefined)
{
  var value = shape.dynamic_fill?.on_off?.on_color_when?.__cdata
  axios({
    method: 'post',
    url: "https://demo3412.herokuapp.com/tag",
    headers: {}, 
    data: {
      tagname:value, // This is the body part
    }
  }).then((res)=>{
 if(res.data.tagValue > 50)
 {
   console.log("DynamicFill")
  //  this.androidToRgba(shape.dynamic_fill.on_off.on_color)
  setDynamicFill(androidToRgba(shape.dynamic_fill?.on_off?.on_color))
  
 }else{
  console.log("NDynamicFill")
  setDynamicFill(androidToRgba(shape?.dynamic_fill.on_off?.off_color))
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
     console.log(res.data.tagValue)
    
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
    <Rect
    key={"Rect_" + shape.object.object_id + shape.object.object_number}
    id={"Rect_" + shape.object.object_id + shape.object.object_number}

    x={getRectPointX(shape, parentX)}
    y={getRectPointY(shape, parentY)}
    

    width={parseFloat(shape.rectangle.x2)}
    height={parseFloat(shape.rectangle.y2)}
    visible={ shape.object.security != undefined ? hide :  true }

    // fillLinearGradientStartPoint = {{x : 100, y : 50}}
    // fillLinearGradientEndPoint = {{x : 100, y : 100}}
    // fillLinearGradientColorStops={[0, shape.fill  ===  undefined ? "white" : shape.fill.fill ,1,shape.gradient === undefined ? "white" : shape.gradient.gradient_color]}

    //  fill={ shape.dynamic_fill == undefined?  shape.fill == undefined ? "" : shape.fill.fill == "#5b5b5b" ? "#c0c0c0"  :shape.fill.fill:
    //  this.state.display_on_off_value == true ?  this.androidToRgba(shape.dynamic_fill.on_off.on_color) : this.androidToRgba(shape.dynamic_fill.on_off?.off_color) }
       fill = {shape.dynamic_fill != undefined ? dynamcifill : shape?.fill?.fill}
      // strokeWidth={parseFloat(shape.line.line_width)}
      // shadowBlur={10}
    strokeWidth={parseFloat(shape.line.line_width)}
   stroke = {shape.line.color}
   
    // fillLinearGradientColorStops={
    //   (1,
    //   shape.gradient === undefined ? "nofill" : shape.gradient.gradient_color)
    // }
    // cornerRadius={parseFloat(shape.rectangle.corner_radius)}
  />
  );
};

export default UNCRectangle;
