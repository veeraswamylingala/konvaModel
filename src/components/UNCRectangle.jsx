import { Rect } from "react-konva";
import { getRectPointX, getRectPointY } from "./CanvasUtils.js";
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  hextoRGBA, intervalUpdate, getTagValueApi,
  androidToRgba, lineStyle, gradientStartPoints, gradientEndPoints
} from './Utils';

const UNCRectangle = (shapeElement) => {

  const { shape, parentX, parentY } = shapeElement;

// const [render, isRendered] = useState(false);
  //Hide------
  const [hide, setHide] = useState(Boolean);
  //Apperance-----
  //  shape.dynamic_fill
  //  shape.dynamic_fill_level 
  //  shape.dynamic_fill?.multi_state
  //  shape.array 
  //  shape.dynamic_fill?.on_off  
  const [dynamcifill, setDynamicFill] = useState(hextoRGBA(shape?.fill?.fill));
  const [refTagValue, setRefTagValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      dynamciAssociation();
    }, intervalUpdate);
    return ()=>{
      window.clearInterval(interval)
    }
  });


  function  dynamciAssociation() {
    //console.log("Dynamic Association")

    //Dynamic_Filll-----------------------------------------------------------------------
    if (shape.dynamic_fill?.on_off != undefined) {
      //   //console.log("Dynamic_Filll")
      // //console.log( shape.dynamic_fill.on_off.on_color_when.__cdata)
      var value = shape.dynamic_fill.on_off?.on_color_when?.__cdata;
      //Removing DataTypes ---Float,
      value = value.replace("static", "");
      value = value.replace("int", "");
      value = value.replace("float", "");
      value = value.replace("double", "");
      value = value.replace("bool", "");
      value = value.replace("boolean", "");
      value = value.replace(/\r\n|\n|\r/gm, "$");
      value = value + "$;";
      axios({
        method: 'post',
        url: getTagValueApi,
        headers: {},
        data: {
          InputScript: value, // This is the body part
        }
      }).then((res) => {
        //   //console.log(res)
        if (res.data.error === "false")
          if (res.data.data == 'True' || res.data.data >= 1) {
            setDynamicFill(hextoRGBA(shape.dynamic_fill.on_off.on_color))
          } else if (res.data.data == 'False' || res.data.data == 0) {
            setDynamicFill(hextoRGBA(shape.dynamic_fill.on_off.off_color))
          }
      });
    }

    //hidden_When-------------------------------------------------------------------------------------
    if (shape.object.security != undefined) {
      //  //console.log("Hidden_when")
      var value = shape.object.security.hidden_when.__cdata;
      //Removing DataTypes ---Float,
      value = value.replace("static", "");
      value = value.replace("int", "");
      value = value.replace("float", "");
      value = value.replace("double", "");
      value = value.replace("bool", "");
      value = value.replace("boolean", "");

      value = value.replace(/\r\n|\n|\r/gm, "$");

      value = value + "$;";
      axios({
        method: 'post',
        url: getTagValueApi,
        headers: {},
        data: {
          InputScript: value, // This is the body part
        }
      }).then((res) => {
        if (res.data.error == "false") {
          setDynamicFill(shape?.fill?.fill)
          if (res.data.data == "True" || res.data.data >= 1) {
            setHide(true)
            // ////console.log("Visible")
          } else if (res.data.data == "False" || res.data.data == 0) {
            setHide(false)
            //////console.log("Not Visible")
          }
        }
      });
    }

    //Array--------------
    if (shape.array != undefined) {
      // //console.log("Array")
      // //console.log("Array")
      var value = shape.array.expression.__cdata;
      var colorsList = shape.array.colors.__cdata;
      // //console.log(shape.array);
      // //console.log(colorsList);
      if (value) {
        value = value.replace("static", "");
        value = value.replace("int", "");
        value = value.replace("float", "");
        value = value.replace("double", "");
        value = value.replace("bool", "");
        value = value.replace("boolean", "");
        value = value.replace(/\r\n|\n|\r/gm, "$");
        value = value + "$;";

        axios({
          method: 'post',
          url: getTagValueApi,
          data: {
            InputScript: value, // This is the body part
          }
        }).then((res) => {

          if (res.data.data != "") {
            colorsList.map((color, i) => {

              if (i == res.data.data) {
                setDynamicFill(hextoRGBA(color))
              }
            })
          }
        });
      }
    }

    //MultiState-------------------------------------------------------------------------------------------------
    if (shape.dynamic_fill?.multi_state != undefined) {
      //  //console.log("MultiState")
      var conditions = shape.dynamic_fill.multi_state.condition?.__cdata;
      var colors = shape.dynamic_fill.multi_state.color.__cdata;
      // //console.log("Multi State Data----------")
      // //console.log(stateText);
      var body1 = conditions[0];
      body1 = body1.replace("static", "");
      body1 = body1.replace("int", "");
      body1 = body1.replace("float", "");
      body1 = body1.replace("double", "");
      body1 = body1.replace("bool", "");
      body1 = body1.replace("boolean", "");
      body1 = body1.replace(/\r\n|\n|\r/gm, "$");
      body1 = body1 + "$;";
      var body2 = conditions[1];
      body2 = body2.replace("static", "");
      body2 = body2.replace("int", "");
      body2 = body2.replace("float", "");
      body2 = body2.replace("double", "");
      body2 = body2.replace("bool", "");
      body2 = body2.replace("boolean", "");
      body2 = body2.replace(/\r\n|\n|\r/gm, "$");
      body2 = body2 + "$;";


      if (conditions != null) {
        //Condition A
        axios({
          method: 'post',
          url: getTagValueApi,
          headers: {},
          data: {
            InputScript: body1, // This is the body part
          }
        }).then((condition1Responce) => {
          //Condition B

          axios({
            method: 'post',
            url: getTagValueApi,
            headers: {},
            data: {
              InputScript: body2, // This is the body part
            }
          }).then((condition2Responce) => {

            if (condition1Responce.data.error == "false" && condition2Responce.data.error == "false") {
              //0-0
              if (condition1Responce.data.data == "False" && condition2Responce.data.data == "False") {

                setDynamicFill(hextoRGBA(colors[0]))
              }//0-1
              else if (condition1Responce.data.data == "False" && condition2Responce.data.data == "True") {

                setDynamicFill(hextoRGBA(colors[1]))
              }//1-0
              else if (condition1Responce.data.data == "True" && condition2Responce.data.data == "False") {

                setDynamicFill(hextoRGBA(colors[2]))
              }//1-1
              else if (condition1Responce.data.data == "True" && condition2Responce.data.data == "True") {
                setDynamicFill(hextoRGBA(colors[3]))
              }
            }
          })
        })
        //   mutiState()
      }
    }

    /// Dynamic_Fill_Level-------------------------------------------------------------------------------------
    if (shape.dynamic_fill_level != undefined) {
    //    //console.log("Dynamic_Fill_Level")
      var value = shape.dynamic_fill_level.expression.__cdata;

      var fillLevelColor = shape.dynamic_fill_level.background_color;
      var direction = shape.dynamic_fill_level.fill_direction;
      var maximumPoint = shape.dynamic_fill_level.maximum;
      var minimumPoint = shape.dynamic_fill_level.minimum;
      var levelAtMaximum = shape.dynamic_fill_level.level_at_maximum;
      var levelAtMinimun = shape.dynamic_fill_level.level_at_minimum;

     // //console.log(value)
      if (value) {
        value = value.replace("static", "");
        value = value.replace("int", "");
        value = value.replace("float", "");
        value = value.replace("double", "");
        value = value.replace("bool", "");
        value = value.replace("boolean", "");
        value = value.replace(/\r\n|\n|\r/gm, "$");
        value = value + "$;";
        axios({
          method: 'post',
          url: getTagValueApi,
          data: {
            InputScript: value, // This is the body part
          }
        }).then((res) => {
          if (res.data.error == "false") {
            setRefTagValue(res.data.data);   
             //x1-
            //x2-width
            //y1-
            //y2-height
            //Maximumvalue and  and minimunvalue is TagValue limits----
            //Percentage is the value made by Maximum and minimum value --
            //now fetch tag value and find the tag value percentage based on based percentage

            var max = levelAtMaximum - levelAtMinimun;
            var maxTagPoint = maximumPoint - minimumPoint
            var rate = (res.data.data/maxTagPoint)*max;
            // //console.log("Data ",res.data.data)
            // //console.log("maxTagPoint ",maxTagPoint)
            // //console.log("Lavelemax ",max)
            // switch (parseInt(shape.dynamic_fill_level.fill_direction)) {
            //   //-Up---Bottom to UP     
            //   case 0:    
            //   var tagValue = shape.rectangle.y2 * (rate/100);
            //  // //console.log("TagValuev  is" +  tagValue)
            //   setRefTagValue(tagValue);   
            //   //-Right --Left to Right
            //   case 1:
            //     var tagValue = shape.rectangle.x2 * (rate/100);
            //     setRefTagValue(tagValue);   
            //   //-Bottom --Top to Bottom
            //   case 2:
            //     // //console.log("Rate is ",rate)
            //     // //console.log(shape.rectangle.y2)
            //     var tagValue = shape.rectangle.y2 * (rate/100);
            //   //  //console.log("R value",tagValue)
            //     setRefTagValue(tagValue);
            //   //-Left--Right-to-Left
            //   case 3:
            //     var tagValue = shape.rectangle.x2 * (rate/100);
            //     setRefTagValue(tagValue);   
            //     default:
            // }
     
          }
        });
      }
    }
  }



  //Rectangle Gradient StartPoints-------------------------------------------
  function rectangleGradientStartPoints(shape, x1, x2, y1, y2) {
    //x1-
    //x2-width
    //y1-
    //y2-height
    if(shape.dynamic_fill_level != undefined )
    {
      var maximum = shape.dynamic_fill_level.maximum;
      var minimum = shape.dynamic_fill_level.minimum;
      var levelAtMaximum = shape.dynamic_fill_level.level_at_maximum;
      var levelAtMinimun = shape.dynamic_fill_level.level_at_minimum;

      switch (parseInt(shape.dynamic_fill_level.fill_direction)) {
        case 0:
        //-Up---Bottom to UP  
        var startPoint = y2*(levelAtMinimun/100)
        var endPoint = y2*(levelAtMaximum/100)
        console.log("startPoint"+startPoint)
        var pvalue = ((refTagValue -(minimum))/(maximum-minimum))*100;
        var value = (endPoint - startPoint)*pvalue/100;
        console.log(y2*(value/100))
        if( y2*(value/100) > parseFloat(startPoint)  &&   y2*(value/100) <  parseFloat(endPoint)  )
        {
          console.log("startPoint"+0)
          return { x:x2, y: y2-startPoint };
        }else{
          console.log("startPoint"+1)
          return { x: x2, y: y2-startPoint };
        }
        case 1:
        //-Right --Left to Right
          var startPoint = x2*(levelAtMinimun/100)
          var endPoint = x2*(levelAtMaximum/100)
          console.log("startPoint"+startPoint)
          var pvalue = ((refTagValue -(minimum))/(maximum-minimum))*100;
          var value = (endPoint - startPoint)*pvalue/100;
          console.log(x2*(value/100))
          if( x2*(value/100) > parseFloat(startPoint)  &&   x2*(value/100) <  parseFloat(endPoint)  )
          {
            console.log("startPoint"+0)
            return { x:startPoint, y: y2 };
          }else{
            console.log("startPoint"+1)
            return { x: startPoint, y: y2 };
          }
        case 2:
        //-Bottom --Top to Bottom
        var startPoint = y2*(shape.dynamic_fill_level.level_at_minimum/100)
          return { x: x2, y: startPoint };
        case 3:
        //-Left--Right-to-Left
          var startPoint = x2*(levelAtMinimun/100)
          var endPoint = x2*(levelAtMaximum/100)
          console.log("startPoint"+startPoint)
          var pvalue = ((refTagValue -(minimum))/(maximum-minimum))*100;
          var value = (endPoint - startPoint)*pvalue/100;
          console.log(x2*(value/100))
          if( x2*(value/100) > parseFloat(startPoint)  &&   x2*(value/100) <  parseFloat(endPoint)  )
          {
            return { x:shape.rectangle.x2-startPoint, y: y2 };
          }else{
            return { x: shape.rectangle.x2-startPoint, y: y2 };
          }
          default:
             return { x: 0, y: 0 };
      }
    }else if(shape.gradient != undefined){

    switch (parseInt(shape.gradient.gradient_direction)) {
      //-0---GRADIENT_LEFT_TO_RIGHT     
      case 0:
        return { x: x2 / 2 - x2 / 4, y: y2 };
      //-1--GRADIENT_RIGHT_TO_LEFT
      case 1:
        return { x: x2 - x2 / 4, y: y2 };
      //-2--GRADIENT_TOP_TO_BOTTOM
      case 2:
        return { x: x2, y: y2 / 2 - y2 / 4 };
      //-3--GRADIENT_BOTTOM_TO_TOP 
      case 3:
        return { x: x2, y: y2 - y2 / 4 };
      //-4--GRADIENT_HORIZONTAL_TO_MIDDLE 
      case 4:
        return { x: x2 / 2 - x2 / 3, y: y2 };
      //-5---GRADIENT_HORIZONTAL_FROM_MIDDLE 
      case 5:
        return { x: x2 / 2 - x2 / 3, y: y2 };
      //-6--GRADIENT_HORIZONTAL_TO_MIDDLE 
      case 6:
        return { x: x2, y: y2 / 2 - y2 / 3 };
      // //--7--GRADIENT_VERTICAL_FROM_MIDDLE
      case 7:
        return { x: x2, y: y2 / 2 - y2 / 3 };
      default: return { x: 0, y: 0 };
    }
  }
}


  //Rectangle Gradient End POints-------------------------------------
 function rectangleGradientEndPoints(shape, x1, x2, y1, y2) {
    //x1-
    //x2-width
    //y1-
    //y2-height
    if(shape.dynamic_fill_level != undefined )
    {
      var maximum = shape.dynamic_fill_level.maximum;
      var minimum = shape.dynamic_fill_level.minimum;
      var levelAtMaximum = shape.dynamic_fill_level.level_at_maximum;
      var levelAtMinimun = shape.dynamic_fill_level.level_at_minimum;
      switch (parseInt(shape.dynamic_fill_level.fill_direction)) {
    
        case 0:
          //-Up---Bottom to UP 
        // return { x: x2, y: shape.rectangle.y2- y2*(value/100)  };
        var startPoint = y2*(levelAtMinimun/100)
        var endPoint = y2*(levelAtMaximum/100)
        console.log("startPoint"+startPoint)
        var pvalue = ((refTagValue -(minimum))/(maximum-minimum))*100;
        var value = (endPoint - startPoint)*pvalue/100;
        console.log(y2*(value/100))
        if( y2*(value/100) > parseFloat(startPoint)  &&   y2*(value/100) <  parseFloat(endPoint)  )
        {
          console.log("startPoint"+0)
          return { x:x2, y:shape.rectangle.y2 -y2*(value/100) };
        }else{
          console.log("startPoint"+1)
          return { x: x2, y:shape.rectangle.y2-endPoint };
        }
        //-Right --Left to Right
        case 1:
          var startPoint = x2*(levelAtMinimun/100)
          var endPoint = x2*(levelAtMaximum/100)
          console.log("endPoint"+endPoint)
          var pvalue = ((refTagValue -(minimum))/(maximum-minimum))*100;
          var value = (endPoint - startPoint)*pvalue/100;
          if( x2*(value/100) > parseFloat(startPoint)  &&   x2*(value/100) <  parseFloat(endPoint)  )
          {
            console.log({ x: x2*(value/100), y: y2 })
            return { x: x2*(value/100), y: y2 };
          }else{
           console.log("startPoint"+1)
            return { x: endPoint, y:y2 };
       }
        
        
        
        //-Bottom --Top to Bottom
        case 2:
          var startPoint = y2*(levelAtMinimun/100)
          var endPoint = y2*(levelAtMaximum/100)
          var pvalue = ((refTagValue -(minimum))/(maximum-minimum))*100;
          var value = (endPoint - startPoint)*pvalue/100;  
          return { x: x2, y: y2*(value/100) };
        //-Left--Right-to-Left
        case 3:
          var startPoint = x2*(levelAtMinimun/100)
          var endPoint = x2*(levelAtMaximum/100)
          console.log("endPoint"+endPoint)
          var pvalue = ((refTagValue -(minimum))/(maximum-minimum))*100;
          var value = (endPoint - startPoint)*pvalue/100;
          if( x2*(value/100) > parseFloat(startPoint)  &&   x2*(value/100) <  parseFloat(endPoint)  )
          {
            console.log({ x: x2*(value/100), y: y2 })
            return { x: shape.rectangle.x2-x2*(value/100), y: y2 };
          }else{
           console.log("startPoint"+1)
            return { x: shape.rectangle.x2-endPoint, y:y2 };
       }

          default:
          return { x: 0, y: 0 };
      }
    }else if(shape.gradient != undefined ){
    switch (parseInt(shape.gradient.gradient_direction)) {
      //-0---GRADIENT_LEFT_TO_RIGHT     
      case 0:
        return { x: x2 - x2 / 4, y: y2 };
      //-1--GRADIENT_RIGHT_TO_LEFT
      case 1:
        return { x: x2 / 2 - x2 / 4, y: y2 };
      //-2--GRADIENT_TOP_TO_BOTTOM
      case 2:
        return { x: x2, y: y2 - y2 / 4 };
      //-3--GRADIENT_BOTTOM_TO_TOP 
      case 3:
        return { x: x2, y: y2 / 2 - y2 / 4 };
      //-4--GRADIENT_HORIZONTAL_TO_MIDDLE 
      case 4:
        return { x: x2 - x2 / 8, y: y2 };
      //-5---GRADIENT_HORIZONTAL_FROM_MIDDLE
      case 5:
        return { x: x2 - x2 / 8, y: y2 };
      //-6--GRADIENT_VERTICAL_TO_MIDDLE 
      case 6:
        return { x: x2, y: y2 - y2 / 10 };
      // //--7--GRADIENT_VERTICAL_FROM_MIDDLE
      case 7:
        return { x: x2, y: y2 - y2 / 10 };
      default: return { x: 0, y: 0 };
    }
  }
  }

  function gradientFill() {
  //Gradient Fill Basedon the gradient_Direction----------------
    if(shape.dynamic_fill_level != undefined )
    {
    //   if(shape.dynamic_fill_level.fill_direction == 3)
    //   {
    //  //   //console.log("Fill Direction "+shape.dynamic_fill_level.fill_direction);
    //     return  [0,hextoRGBA(shape.dynamic_fill_level.background_color),
    //       0.99,hextoRGBA(shape.dynamic_fill_level.background_color),
    //       1.0,hextoRGBA(shape.fill.fill)];
    //   }else{
       // //console.log("Fill Direction "+shape.dynamic_fill_level.fill_direction);
      return  [
        0,hextoRGBA(shape.dynamic_fill_level.background_color),
          0.01,hextoRGBA(shape.fill.fill),
          0.99,hextoRGBA(shape.fill.fill),
          1.0,hextoRGBA(shape.dynamic_fill_level.background_color)];
          }
      //  }
        else{
  //Gradient Colors all below 4 we user 2 colors [0,1]
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
  }


  return (
    //console.log("Render called"+refTagValue),
    <Rect
      key={"Rect_" + shape.object.object_id + shape.object.object_number}
      id={"Rect_" + shape.object.object_id + shape.object.object_number}

      x={getRectPointX(shape, parentX)}
      y={getRectPointY(shape, parentY)}

      width={parseFloat(shape.rectangle.x2)}
      height={parseFloat(shape.rectangle.y2)}
      visible={shape.object.security != undefined ? !hide : true}
  

      // Gradient Start Point---only when gradient is there and dynamic_fill_level is there
      fillLinearGradientStartPoint={
        shape.dynamic_fill_level === undefined ?
          shape.gradient != undefined ?
            rectangleGradientStartPoints(shape,
              shape.rectangle.x1, shape.rectangle.x2,
              shape.rectangle.y1, shape.rectangle.y2 
            ) : {}
          : rectangleGradientStartPoints(shape,
            shape.rectangle.x1 , shape.rectangle.x2 ,
            shape.rectangle.y1 , shape.rectangle.y2 
          )}
         
      // Gradient End Point---only when gradient is there and dynamic_fill_level is there
      fillLinearGradientEndPoint={
    
          rectangleGradientEndPoints(shape,
              shape.rectangle.x1 , shape.rectangle.x2,
              shape.rectangle.y1 , shape.rectangle.y2 ) }

//fillLinearGradientColorStops
      fillLinearGradientColorStops={
        shape.dynamic_fill_level === undefined ?
          shape.gradient === undefined ? [] :
            gradientFill() : gradientFill()
      }

      fill={
        shape.dynamic_fill_level === undefined ?
          shape.gradient === undefined ?
            dynamcifill : "" : ""
      }

      strokeWidth={parseFloat(shape.line.line_width)}
      stroke={hextoRGBA(shape.line.color) ?? "Black"}
      dashEnabled={true}
      dash={lineStyle(shape.line.style)}
      // shadowBlur={10} 
      draggable={true}
      cornerRadius={parseFloat(shape.rectangle.corner_radius)}
    />
  );
};

export default UNCRectangle;
