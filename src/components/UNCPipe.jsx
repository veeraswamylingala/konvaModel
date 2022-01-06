import { Line,Group } from "react-konva";
import { getPipePoints } from "./CanvasUtils.js";
import { useState } from 'react';
import axios from 'axios';
import {
  Rect,
  Text,
  
} from "react-konva";
import { hextoRGBA,androidToRgba, lineStyle ,gradientStartPoints ,gradientEndPoints } from './Utils';


const UNCPipe = (shapeElement) => {
  const { shape, parentX, parentY } = shapeElement;

  const [hide, setHide] = useState(0);
  const [dynamcifill, setDynamicFill] = useState(0);

  //Dynamci_fILL---------------------------------------------------------------
  if (shape.dynamic_fill != undefined) {
    var value = shape.dynamic_fill.on_off.on_color_when
      axios({
        method: 'post',
        url: "http://localhost:8080/tag",
        headers: {}, 
        data: {
          tagname:value, // This is the body part
        }
      }).then((res)=>{
     if(res.data.tagValue > 50)
     {
       //console.log("DynamicFill")
      //  this.androidToRgba(shape.dynamic_fill.on_off.on_color)
      setDynamicFill(androidToRgba(shape.dynamic_fill.on_off.on_color))

     }else{
      //console.log("NDynamicFill")
      setDynamicFill(androidToRgba(shape.dynamic_fill.on_off.off_color))
     }

      });
  }

  //hidden_When-------------------------------------------------------------------------------------
  if (shape.object.security != undefined) {
    var value = shape.object.security.hidden_when.__cdata;
     axios({
       method: 'post',
       url: "http://localhost:8080/tag",
       headers: {}, 
       data: {
         tagname:value, // This is the body part
       }
     }).then((res)=>{
       //console.log(res.data.tagValue)

    if(res.data.tagValue > 50)
    {
     setHide(true)
     //console.log("Visible")
    }else{
     setHide(false)
     //console.log("Not Visible")
    }

     });

  }
  // -0---GRADIENT_LEFT_TO_RIGHT-------------------------------
  //startPoint:   {x1:x2/2 - x2/4 , y1:y2}
  //endPoint:     {x2:x2 - x4/4,y2:y2 }

  //-1--GRADIENT_RIGHT_TO_LEFT----------------------------------
  //startPoint:  {x1: x2 - x2/4   , y1:y2   }
  //endPoint:    {x2: x2/2 - x2/4 , y2:    y2  }

  //--2---GRADIENT_TOP_TO_BOTTOM -----------------------------
  //startPoint:  {x1: x2    , y1:y2 - y2/4  }
  //endPoint:    {x2: x2 , y2:y2/2 - y2/4  }

  //--3---GRADIENT_BOTTOM_TO_TOP  -----------------------------
  //startPoint:  {x1: x2    , y1:y2/2 - y2/4  }
  //endPoint:    {x2: x2 , y2:y2 - y2/4  }

  //--4--GRADIENT_HORIZONTAL_TO_MIDDLE -------------------------
  //startPoint:  {x1: x2    , y1:y2/2 }
  //endPoint:    {x2: x2 , y2:y2/2 + 1  }

  //---
  //---5---GRADIENT_HORIZONTAL_FROM_MIDDLE ---------------------
  //startPoint:  {x1: x2    , y1:y2/2 }
  //endPoint:    {x2: x2 , y2:y2 - 1  }

  //--6---GRADIENT_VERTICAL_TO_MIDDLE----------------------------
  //startPoint:  {x1: x2/2   , y1:y2 }
  //endPoint:    {x2: x2/2 -1 , y2:y2 }

  //---
  //--7--GRADIENT_VERTICAL_FROM_MIDDLE----------------------------
  //startPoint:  {x1: x2/2   , y1:y2 }
  //endPoint:    {x2: x2 -1 , y2:y2 }





  function startPoints() {
    //console.log(shape.gradient.gradient_direction)

    switch (parseInt("2")) {
      //-0---GRADIENT_LEFT_TO_RIGHT     
      case 0:
        return { x: shape.rectangle.x2 / 2 - shape.rectangle.x2 / 4, y: shape.rectangle.y2 };
      //-1--GRADIENT_RIGHT_TO_LEFT
      case 1:
        return { x: shape.rectangle.x2 - shape.rectangle.x2 / 4, y: shape.rectangle.y2 };
      //-2--GRADIENT_TOP_TO_BOTTOM
      case 2:
        return { x: shape.rectangle.x2, y: shape.rectangle.y2 - shape.rectangle.y2 / 4 };
      //-3--GRADIENT_BOTTOM_TO_TOP 
      case 3:
        return { x: shape.rectangle.x2, y: shape.rectangle.y2 / 2 - shape.rectangle.y2 / 4 };
      //-4--GRADIENT_HORIZONTAL_TO_MIDDLE 
      case 4:
        return { x: shape.rectangle.x2, y: shape.rectangle.y2 / 2 };
      //-5---GRADIENT_HORIZONTAL_FROM_MIDDLE ---------------------
      case 5:
        return { x: shape.rectangle.x2, y: shape.rectangle.y2 / 2 };

      //-6--GRADIENT_HORIZONTAL_TO_MIDDLE 
      case 6:
        return { x: shape.rectangle.x2 / 2, y: shape.rectangle.y2 };

      // //--7--GRADIENT_VERTICAL_FROM_MIDDLE----------------------------
      case 7:
        return { x: shape.rectangle.x2 / 2, y: shape.rectangle.y2 };

      default: return { x: 0, y: 0 };

    }

  }


  function endPoint() {
    switch (parseInt("2")) {
      //-0---GRADIENT_LEFT_TO_RIGHT     
      case 0:
        return { x: shape.rectangle.x2 - shape.rectangle.x2 / 4, y: shape.rectangle.y2 };
      //-1--GRADIENT_RIGHT_TO_LEFT
      case 1:
        return { x: shape.rectangle.x2 / 2 - shape.rectangle.x2 / 4, y: shape.rectangle.y2 };
      //-2--GRADIENT_TOP_TO_BOTTOM
      case 2:
        return { x: shape.rectangle.x2, y: shape.rectangle.y2 / 2 - shape.rectangle.y2 / 4 };
      //-3--GRADIENT_BOTTOM_TO_TOP 
      case 3:
        return { x: shape.rectangle.x2, y: shape.rectangle.y2 - shape.rectangle.y2 / 4 };
      //-4--GRADIENT_HORIZONTAL_TO_MIDDLE 
      case 4:
        return { x: shape.rectangle.x2, y: shape.rectangle.y2 / 2 + 1 };

      //-5---GRADIENT_HORIZONTAL_FROM_MIDDLE ---------------------
      case 5:
        return { x: shape.rectangle.x2, y: shape.rectangle.y2 - 1 };

      //-6--GRADIENT_VERTICAL_TO_MIDDLE 
      case 6:
        return { x: shape.rectangle.x2 / 2 - 1, y: shape.rectangle.y2 };

      // //--7--GRADIENT_VERTICAL_FROM_MIDDLE----------------------------
      case 7:
        return { x: shape.rectangle.x2 - 1, y: shape.rectangle.y2 };
      default: return { x: 0, y: 0 };
    }
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
