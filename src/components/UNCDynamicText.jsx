import React, { useState, useEffect } from "react";
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

  const UNCDynamicText = (shapeElement) => {
    const { shape, parentX, parentY } = shapeElement;
  
    console.log(shapeElement)
//   const [hasError, setErrors] = useState(false); 
//   const [tagValues, setTagValues] = useState({});

//   useEffect(() => {
//     async function fetchData() {
//       const res = await fetch("http://worldclockapi.com/api/json/est/now");
//       res
//         .json()
//         .then(res => setTagValues(res))
//         .catch(err => setErrors(err));
//     }

//     fetchData();
//   });


//   if(obj===null)
//   {
//       console.log(text)
//       obj={ "zIndex": "0",
//       "objectNumber": "0",
//       "x1": "0",
//       "y1": "0",
//       "x2": "0",
//       "y2": "0",
//       "objectId": ""}
//   }
//   else  {
//     // console.log("obj is not null")
//   }

console.log(shape.static_text)

  return (
    <Text 
  fontFamily={shape.font_family} 
    
    fontSize={shape.font_size}

        fill={"black"}
      // text={JSON.stringify(tagValues['currentFileTime'])}

       text= {shape.static_text}
      
  
       x={ parseFloat(parentX)+ parseFloat(shape.box.axis_anchor)+parseFloat(shape.box.axis_offset_left)+((parseFloat(shape.box.left))/2)}
       y={ parseFloat(parentY)+parseFloat(shape.box.axis_anchor)+parseFloat(shape.box.axis_offset_top)+((parseFloat(shape.box.top))/2)}
    />
  );
};



export default UNCDynamicText

