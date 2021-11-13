import { Rect } from "react-konva";
import { getRectPointX, getRectPointY } from "./CanvasUtils.js";
import { useState  } from 'react';
import axios from 'axios';
import { hextoRGBA, lineStyle ,gradientStartPoints ,gradientEndPoints ,androidToRgba} from './Utils';


const UNCRectangle = (shapeElement) => {
const { shape, parentX, parentY } = shapeElement;

const [hide, setHide] = useState(0);
const [dynamcifill, setDynamicFill] = useState(0);


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
   
  function gradientFill(){

    if(shape.gradient.gradient_direction < 4)
    {

      return [0, shape.dynamic_fill != undefined ? dynamcifill ?? "black" : shape.fill != undefined ? hextoRGBA(shape.fill.fill) : "grey" ?? "black"
      , 1, shape.gradient != undefined ? hextoRGBA(shape?.gradient?.gradient_color) : "grey" ?? "black"];
    }else if(shape.gradient.gradient_direction >= 4)
    {

         if(shape.gradient.gradient_direction == 4 || shape.gradient.gradient_direction == 6 )
         {
          return  [0, shape.dynamic_fill != undefined ? dynamcifill ?? "black" : shape.fill != undefined ? hextoRGBA(shape.fill.fill) : "grey" ?? "black",
       0.5,shape.gradient != undefined ? hextoRGBA(shape?.gradient?.gradient_color) : "grey" ?? "black"
      
         , 1,shape.dynamic_fill != undefined ? dynamcifill ?? "black" : shape.fill != undefined ? hextoRGBA(shape.fill.fill) : "grey" ?? "black"];
         }
         else if(shape.gradient.gradient_direction == 5 || shape.gradient.gradient_direction == 7 )
         {
            return    [0, shape.dynamic_fill != undefined ? dynamcifill ?? "black" : shape.fill != undefined ? hextoRGBA(shape?.gradient?.gradient_color) : "grey" ?? "black",
      0.5,shape.gradient != undefined ? hextoRGBA(shape.fill.fill) : "grey" ?? "black"
      
         , 1,shape.dynamic_fill != undefined ? dynamcifill ?? "black" : shape.fill != undefined ? hextoRGBA(shape?.gradient?.gradient_color)  : "grey" ?? "black"];

         }
    }
   
  }




  return (
     <Rect
      key={"Rect_" + shape.object.object_id + shape.object.object_number}
      id={"Rect_" + shape.object.object_id + shape.object.object_number}

      x={getRectPointX(shape, parentX)}
      y={getRectPointY(shape, parentY)}

      width={parseFloat(shape.rectangle.x2)}
      height={parseFloat(shape.rectangle.y2)}
      visible={shape.object.security != undefined ? !hide : true}

      fillLinearGradientStartPoint={shape.gradient != undefined ? gradientStartPoints(shape,shape.rectangle.x1,shape.rectangle.x2,shape.rectangle.y1,shape.rectangle.y2) : {}}
      fillLinearGradientEndPoint={shape.gradient != undefined ? gradientEndPoints(shape,shape.rectangle.x1,shape.rectangle.x2,shape.rectangle.y1,shape.rectangle.y2) : {}}
      fillLinearGradientColorStops={
        shape.gradient === undefined ? [] :
       gradientFill() 
        }

      fill={shape.gradient === undefined ?
        shape.dynamic_fill != undefined ? dynamcifill :
          shape.fill != undefined ? hextoRGBA(shape.fill.fill) : "" : ""}


      //  fill={ shape.dynamic_fill == undefined?  shape.fill == undefined ? "" : shape.fill.fill == "#5b5b5b" ? "#c0c0c0"  :shape.fill.fill:
      //  this.state.display_on_off_value == true ?  this.androidToRgba(shape.dynamic_fill.on_off.on_color) : this.androidToRgba(shape.dynamic_fill.on_off?.off_color) }
      // strokeWidth={parseFloat(shape.line.line_width)}
      // shadowBlur={10}
      strokeWidth={parseFloat(shape.line.line_width)}
      stroke={hextoRGBA(shape.line.color) ?? "Black"}
      dashEnabled={true}
      dash={lineStyle(shape.line.style)}
      // shadowBlur={10} 
      draggable={false}
      cornerRadius={parseFloat(shape.rectangle.corner_radius)}
    />
  );
};

export default UNCRectangle;
