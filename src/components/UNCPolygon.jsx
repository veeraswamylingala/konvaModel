import { Line } from "react-konva";
import { getPolygonPoints } from "./CanvasUtils.js";
import { useState , useEffect} from 'react';
import axios from 'axios';
import { hextoRGBA, lineStyle ,gradientStartPoints ,gradientEndPoints } from './Utils';


const UNCPolygon = (shapeProps) => {
  const { shape, parentX, parentY } = shapeProps;
  
const [hide, setHide] = useState(0);
const [dynamcifill, setDynamicFill] = useState(0);

useEffect(() => {

 })

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
  var value = shape.dynamic_fill.on_off.on_color_when
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
  setDynamicFill(androidToRgba(shape.dynamic_fill.on_off.on_color))
 }else{
  console.log("NDynamicFill")
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
    <Line
      key={"Polygon_" + shape.object.object_id + shape.object.object_number}
      id={"Polygon_" + shape.object.object_id + shape.object.object_number}
      points={getPolygonPoints(shape, parentX, parentY)}

    //fill={shape.fill == undefined ? "" : shape.fill.fill == "#5b5b5b" ? "#c0c0c0"  :shape.fill.fill}
       fill = {shape.dynamic_fill != undefined ? dynamcifill : shape.fill != undefined ? hextoRGBA(shape.fill.fill) : "white"}
      visible={ shape.object.security != undefined ? hide :  true }
      strokeWidth={parseFloat(shape.line.line_width) ?? 2}
      stroke = {hextoRGBA(shape.line.color)  ?? "black"}
     // strokeWidth={parseInt(shape.line.line_width)}
      draggable={false}
      dashEnabled={true}
      dash={lineStyle(shape.line.style)}
      closed={parseInt(shape.polyline.closed)}
      // fillLinearGradientStartPointX={this.getXPoint(shape)+parseFloat(obj.x1)}
      // fillLinearGradientStartPointY={this.getYPoint(shape)+parseFloat(obj.y1)}
      // fillLinearGradientColorStops={1,shape.gradient===undefined?"nofill":hextoRGBA(shape.gradient.gradient_color)}
    >

      
    </Line>
  );
};

export default UNCPolygon;
