import preFunctions from "./preFunctions";
import {
  Rect,
  Text,
  Group,
} from "react-konva";
import React from "react";
import { hextoRGBA,lineStyle } from './Utils';
import UNCCanvas from "./UNCCanvas";

const UNCButton = (shapeElement) => {
  const { shape, parentX, parentY, ProjectId } = shapeElement;


  
  return (
    <Group>
      <Rect
        id={"Button" + shape.object.object_id + shape.object.object_number}
        x={parseFloat(parentX) + parseFloat(shape.box.axis_offset_left) + ((parseFloat(shape.box.left)) / 2)}
        y={parseFloat(parentY) + parseFloat(shape.box.axis_offset_top) + ((parseFloat(shape.box.top)) / 2)}
        width={parseFloat(shape.box.right)}
        height={parseFloat(shape.box.bottom)}
        fill={shape.button?.fill_color_up != undefined ? hextoRGBA(shape.button.fill_color_up) : "grey"}
        //Default Configuration 
        strokeWidth={1.5}
        stroke={"#eaeaea"}
        shadowColor={"grey"}
        shadowBlur={4}
        shadowOffsetX={3}
        shadowOffsetY={3}
        showOpacity={0.8}
        shadowBlur={3}
        draggable={false}
        dashEnabled={true}
        dash={lineStyle(shape.line.style)}

        onClick={() => {
          if(shape.input_touch != undefined)
          {
            //console.log(shape?.input_touch?.up?.command.__cdata)
            var cdata = shape?.input_touch?.up?.command.__cdata;
            cdata = cdata.split("(");
           
            if(cdata[0]=="openPage")
            {
              var targetPage = cdata[1].replace(")","");
             targetPage = targetPage.replace(";","");
             //console.log("targetPage : "+targetPage)
            new UNCCanvas().handleSubmit(targetPage.toString());

            }
          }else{
            //console.log(shape?.button?.buttontext?.text)
          }
         
        }}


      />
      <Text
        align={"center"}
        width={parseFloat(shape.box.right)}
        height={parseFloat(shape.box.bottom)}
        fontSize={parseFloat(shape.button?.buttontext?.font_size) ?? 15}
        fill={shape.button != undefined ? hextoRGBA(shape.button?.buttontext?.color) : ""}
        x={parseFloat(parentX) + (parseFloat(shape.box.axis_offset_left) + (parseFloat(shape.box.left)) + parseFloat(0) / 2)}
        y={parseFloat(parentY) + parseFloat(shape.box.axis_offset_top) + ((parseFloat(shape.box.top)) + parseFloat(shape.box.bottom) / 2)}
        text={shape.button?.buttontext?.text ?? "Button"}
        draggable={false}
        onClick={() => {
         
        }}

      ></Text>
    </Group>
  );
};


export default UNCButton;
