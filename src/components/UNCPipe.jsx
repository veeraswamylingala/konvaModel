import { Line ,Group} from "react-konva";
import { getPipePoints } from "./CanvasUtils.js";
import { useEffect, useState  } from 'react';
import axios from 'axios';
import { hextoRGBA ,lineStyle,androidToRgba} from './Utils';


const UNCPipe = (shapeElement) => {
  const { shape, parentX, parentY } = shapeElement;
 
  const [hide, setHide] = useState(0);
  const [dynamcifill, setDynamicFill] = useState(0);

  useEffect(() => {
  // console.log(getPloyPoints(shape, parentX, parentY))
   })
 




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
  <Group>
      
    <Line
      key={"Pipe_" + shape.object.object_number}
      id={"Pipe_" + shape.object.object_id}
      points={getPipePoints(shape, parentX, parentY)}
      visible={shape.object.security != undefined ? hide : true}
      stroke={hextoRGBA(shape.pipe.lowlight_color)}
      strokeWidth={parseFloat(shape.pipe.pipe_width)}
      // closed={"true"}
      // shadowColor={hextoRGBA(shape.pipe.lowlight_color)}
      // shadowBlur={10}
      // shadowForStrokeEnabled={true}
      // shadowOffsetX={0}
      // shadowOffsetY={0}
      // showOpacity={100}

      dashEnabled={false}
      dash={lineStyle(shape.line.style)}


    />
      <Line
      // key={"Pipe_" + shape.object.object_number}
      // id={"Pipe_" + shape.object.object_id}
      points={getPipePoints(shape, parentX, parentY)}
      visible={shape.object.security != undefined ? hide : true}
      stroke={hextoRGBA(shape.pipe.highlight_color)}
      strokeWidth={parseFloat(shape.pipe.pipe_width) / 3}
      // closed={"true"}
      // shadowColor={hextoRGBA(shape.pipe.lowlight_color)}
      // shadowBlur={10}
      // shadowForStrokeEnabled={true}
      // shadowOffsetX={0}
      // shadowOffsetY={0}
      // showOpacity={100}

      dashEnabled={false}
      dash={lineStyle(shape.line.style)}


    />
    </Group>
  );
};

export default UNCPipe;
