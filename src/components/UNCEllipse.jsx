import { Ellipse, Rect } from "react-konva";
import { getRectPointX, getRectPointY } from "./CanvasUtils.js";
import React, { useEffect ,useState } from 'react'
import axios from 'axios';
import { intervalUpdate,androidToRgba ,lineStyle,hextoRGBA,getTagValueApi } from './Utils';
import { color } from "d3";

const UNCEllipse = (shapeProps) => {
  const { shape, parentX, parentY } = shapeProps;
  const [refTagValue, setRefTagValue] = useState(0);


  //Hide------
  const [hide, setHide] = useState(Boolean);
  //Apperance-----
        //  shape.dynamic_fill
        //  shape.dynamic_fill_level 
        //  shape.dynamic_fill?.multi_state
        //  shape.array 
        //  shape.dynamic_fill?.on_off  
  const [dynamcifill, setDynamicFill] = 
  useState(hextoRGBA(shape?.fill?.fill));

  useEffect(()=>{
    const interval = setInterval(() => {
     dynamciAssociation();
   },intervalUpdate);
   return ()=>{
      window.clearInterval(interval)
    }
  } );
  

 function dynamciAssociation(){
  //Dynamic_Filll-----------------------------------------------------------------------
  if (shape.dynamic_fill?.on_off != undefined) {

  //  //console.log( shape.dynamic_fill)
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
          InputScript:value, // This is the body part
        }
      }).then((res)=>{
     //   //console.log(res)
       if(res.data.error === "false")
     if(res.data.data == 'True'|| res.data.data >= 1)
     {
      setDynamicFill(hextoRGBA(shape.dynamic_fill.on_off.on_color))
     }else if(res.data.data == 'False'|| res.data.data == 0){
      setDynamicFill(hextoRGBA(shape.dynamic_fill.on_off.off_color))
     }
      });
  }

  //hidden_When-------------------------------------------------------------------------------------
  if (shape.object.security != undefined) {
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
          InputScript:value, // This is the body part
        }
      }).then((res)=>{
       if(res.data.error == "false"){
        setDynamicFill(shape?.fill?.fill)
     if(res.data.data == "True" || res.data.data >= 1)
     {
      setHide(true)
     // ////console.log("Visible")
     }else if(res.data.data == "False"|| res.data.data == 0){
      setHide(false)
      //////console.log("Not Visible")
     }
    }
      });
  }

  //Array--------------
  if(shape.array!= undefined)
  {
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
          })}
        });
    }
  }


  //MultiState-------------------------------------------------------------------------------------------------
  if (shape.dynamic_fill?.multi_state != undefined) {
      var conditions = shape.dynamic_fill.multi_state.condition?.__cdata;
      var colors =shape.dynamic_fill.multi_state.color.__cdata;
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
            url:getTagValueApi,
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
 // //console.log("Dynamic_Fill_Level")
  var value = shape.dynamic_fill_level.expression.__cdata;

  
  var fillLevelColor = shape.dynamic_fill_level.background_color;
  var direction = shape.dynamic_fill_level.fill_direction;
  var maximumPoint = shape.dynamic_fill_level.maximum;
  var minimumPoint = shape.dynamic_fill_level.minimum;
  var levelAtMaximum = shape.dynamic_fill_level.level_at_maximum;
  var levelAtMinimun = shape.dynamic_fill_level.level_at_minimum;


  ////console.log(value)
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
      if(res.data.error == "false"){
         //Maximumvalue and  and minimunvalue is TagValue limits----
            //Percentage is the value made by Maximum and minimum value --
            //now fetch tag value and find the tag value percentage based on based percentage
            var max = levelAtMaximum - levelAtMinimun;
            var maxTagPoint = maximumPoint - minimumPoint
            var rate = (res.data.data/maxTagPoint)*max;
           
            switch (parseInt(shape.dynamic_fill_level.fill_direction)) {
              //-Up---Bottom to UP     
              case 0:    
              var tagValue = shape.ellipse.y2 * (rate/100);
              setRefTagValue(tagValue);   
              //-Right --Left to Right
              case 1:
                var tagValue = shape.ellipse.x2 * (rate/100);
                setRefTagValue(tagValue);   
              //-Bottom --Top to Bottom
              case 2:
                var tagValue = shape.ellipse.y2 * (rate/100);
                setRefTagValue(tagValue);
              //-Left--Right-to-Left
              case 3:
                var tagValue = shape.ellipse.x2 * (rate/100);
                setRefTagValue(tagValue);   
                default:
            }
      }});
    }
      }
  }




  //EllipseGradientStartPoints----------------------------------------
  function ellipseGradientStartPoints(shape, x1, x2, y1, y2) {
   // //console.log(x2,y2)
       //console.log("ellipseGradientStartPoints")
    // //console.log(parseInt(shape.dynamic_fill_level.fill_direction))
    //////console.log(shape.gradient.gradient_direction)

    if(shape.dynamic_fill_level != undefined )
    {
      // //console.log("dynamic_fill_level")
      switch (parseInt(shape.dynamic_fill_level.fill_direction)) {
        //-Up---Bottom to UP     
        case 0:
          return  { x: x2, y: y2 };
        //-Right --Left to  
        case 1:
          return {x: -x2 , y: y2 };
        //-Bottom --Top to Bottom
        case 2:
          return { x: x2, y: -y2 };
        //-Left--Right-to-Left
        case 3:
          return { x: x2, y: y2 };
          default:
             return { x: 0, y: 0 };
      }
    }else{
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
  }

  //Ellipse Gardient End Point----------------------------------------------
  function ellipseGradientEndPoints(shape, x1, x2, y1, y2) {
    //console.log("ellipseGradientEndPoints")
    if(shape.dynamic_fill_level != undefined )
    {
      switch (parseInt(shape.dynamic_fill_level.fill_direction)) {
        //-Up---Bottom to UP     
        case 0:
          var point ;
          var height = shape.ellipse.y2;
          var ration = height/2;
          if(refTagValue > ration)
          {
            point  = refTagValue -ration;
            point = -point;
          }else if(refTagValue < ration)
          {
            point  = ration - refTagValue;
         
          }else{
            point = 0
          }
        
          return { x: x2, y: point};
        //-Right --Left to Right
        case 1:
          var point ;
          var width = shape.ellipse.x2;
          var ration = width/2;
          if(refTagValue > ration)
          {
            point  = refTagValue -ration;
          }else if(refTagValue < ration)
          {
            point  = ration - refTagValue;
            point =  -point;
         
          }else{
            point = 0
          }
          return { x: point, y: y2 };
        //-Bottom --Top to Bottom
        case 2:
          var point ;
          var height = shape.ellipse.y2;
          var ration = height/2;
          if(refTagValue > ration)
          {
            point  = refTagValue -ration;
          }else if(refTagValue < ration)
          {
            point  = ration - refTagValue;
            point =  -point;
          }else{
            point = 0
          }
        
          return { x: x2, y:point };
        //-Left--Right-to-Left
        case 3:
          var point ;
          var width = shape.ellipse.x2;
          var ration = width/2;
          if(refTagValue > ration)
          {
            point  = refTagValue -ration;
            point =  -point;
          }else if(refTagValue < ration)
          {
            point  = ration - refTagValue;
    
          }else{
            point = 0
          }
          return { x: point, y: y2 };
          default:
          return { x: 0, y: 0 };
      }
    }else{
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
  }

  //Gradient Fill Basedon the gradient_Direction----------------
  function gradientFill() {

    if(shape.dynamic_fill_level != undefined )
    {
      return [0,hextoRGBA(shape.fill.fill),
      0.99,hextoRGBA(shape.fill.fill),
         1.,hextoRGBA(shape.dynamic_fill_level.background_color)];
    }else{
      //Gradient Colors all below 4 we user 2 colors [0,1]
    if (shape.gradient.gradient_direction < 4) {
      return [0,
         shape.dynamic_fill != undefined ? dynamcifill ?? "black" : shape.fill != undefined ? hextoRGBA(shape.fill.fill) : "grey" ?? "black"
        , 1, shape.gradient != undefined ? hextoRGBA(shape?.gradient?.gradient_color) : "grey" ?? "black"];
    } else if (shape.gradient.gradient_direction >= 4) {
    //Gradient Colors all >= 4 we user 3 colors [0,0.5,1]
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

    <Ellipse
      key={"Ellipse_" + shape.object.object_id + shape.object.object_number}
      id={"Ellipse_" + shape.object.object_id + shape.object.object_number}

      x={getRectPointX(shape, parentX)}
      y={getRectPointY(shape, parentY)}
      width={parseFloat(shape.ellipse.x2)}
      height={parseFloat(shape.ellipse.y2)}

      visible={shape.object.security != undefined ? !hide : true}

      // Gradient Start Point---only when gradient is there and dynamic_fill_level is there
      fillLinearGradientStartPoint={
        shape.dynamic_fill_level === undefined ?
        shape.gradient != undefined ?
        ellipseGradientStartPoints(shape,
           shape.ellipse.x1 / 2, shape.ellipse.x2 / 2,
          shape.ellipse.y1 / 2,shape.ellipse.y2 / 2
        ) : {}  
      :  ellipseGradientStartPoints(shape,
         shape.ellipse.x1 /2 , shape.ellipse.x2 /2 ,
        shape.ellipse.y1 /2 ,shape.ellipse.y2 /2 
      )    }

      // Gradient End Point---only when gradient is there and dynamic_fill_level is there
      fillLinearGradientEndPoint={
        shape.dynamic_fill_level === undefined ?
        shape.gradient != undefined ?
        ellipseGradientEndPoints(shape,
           shape.ellipse.x1 / 2, shape.ellipse.x2 / 2,
          shape.ellipse.y1 / 2,shape.ellipse.y2 / 2) : {}
          :    ellipseGradientEndPoints(shape,
             shape.ellipse.x1 /2, shape.ellipse.x2/2 ,
            shape.ellipse.y1 /2,shape.ellipse.y2 /2 )}
      //  fillLinearGradientColorStops={[0,"red",1,"green"]}

    
      fillLinearGradientColorStops={
        shape.dynamic_fill_level === undefined ?
        shape.gradient === undefined ? [] :
        gradientFill():  gradientFill()
      }

      fill={
        shape.dynamic_fill_level === undefined ?
         shape.gradient === undefined ?
            dynamcifill : "" :""
           }

      strokeWidth={parseFloat(shape.line.line_width)}
      stroke={hextoRGBA(shape.line.color)}
      draggable={false}

      dashEnabled={true}
      dash={lineStyle(shape.line.style)}
    />
  );
};

export default UNCEllipse;
