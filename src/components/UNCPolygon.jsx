import { Line } from "react-konva";
import { getPolygonPoints } from "./CanvasUtils.js";
import { useState  } from 'react';
import axios from 'axios';
import { useEffect } from "react";
import {
  hextoRGBA, intervalUpdate, getTagValueApi,
  androidToRgba, lineStyle, gradientStartPoints, gradientEndPoints ,paramsList
} from './Utils';

const UNCPolygon = (shapeProps) => {

  const { shape, parentX, parentY ,parent } = shapeProps;  
  //Hide------
  const [hide, setHide] = useState(true);
  //Apperance-----
  //  shape.dynamic_fill
  //  shape.dynamic_fill_level 
  //  shape.dynamic_fill?.multi_state
  //  shape.array 
  //  shape.dynamic_fill?.on_off  
  const [dynamcifill, setDynamicFill] = useState(hextoRGBA(shape?.fill?.fill));
  const [refTagValue, setRefTagValue] = useState(0);

  var value = '';
  useEffect(() => {
    
    const interval = setInterval(() => {
      dynamciAssociation();
    }, intervalUpdate);
    return ()=>{
      window.clearInterval(interval)
    }
  });

  function dynamciAssociation() {
        //Dynamic_Filll-----------------------------------------------------------------------
        if (shape.dynamic_fill?.on_off != undefined) {

           //console.log("Dynamic_Filll")
          // //////console.log( shape.dynamic_fill.on_off.on_color_when.__cdata)
          var value = shape.dynamic_fill.on_off?.on_color_when?.__cdata;
        //With Param
      if(value.includes("%"))
      {
     
        var listOfParamIndex = [];
        for (var i = 0; i < value.length; i++) {
          if (value[i] == "%") {
            console.log(i)
            listOfParamIndex.push(i)
          }
        }
        if (listOfParamIndex.length == 4) {
          var param1 = value.substring(listOfParamIndex[0]+1, listOfParamIndex[1] );
          var param2 = value.substring(listOfParamIndex[2]+1, listOfParamIndex[3]);
          console.log(param1)
          console.log(param2)
          paramsList.map((val) => {
            if (val['name'] == param1 && val['componentID'] == parent.objectId) {
              value = value.replace("%"+param1+"%", val['value'])
            } else if (val['name'] == param2 && val['componentID'] == parent.objectId) {
              value = value.replace("%"+param2+"%", val['value'])
            }
          })
          value = value + "$;";
        } else {
          var param = value.substring(value.indexOf("%") + 1, value.lastIndexOf("%"))
          paramsList.map((val) => {
            if (val['name'] == param && val['componentID'] == parent.objectId) {
              //CHECKING IF STRING HAS ANY PARAM(%%)
              if (value.substring(value.indexOf("%"), value.lastIndexOf("%") + 1) != "") {
                //REPLACING PARAM STRING(%%) WITH THE PARAM VALUE  
                value = value.replace(value.substring(value.indexOf("%"), value.lastIndexOf("%") + 1), val['value'])
                value = value + "$;";
              }
            }
          })
        }
      }else{
         //Removing DataTypes ---Float,
         value = value.replace("static", "");
         value = value.replace("int", "");
         value = value.replace("float", "");
         value = value.replace("double", "");
         value = value.replace("bool", "");
         value = value.replace("boolean", "");
         value = value.replace(/\r\n|\n|\r/gm, "$");
         value = value + "$;";
      
        }
          axios({
            method: 'post',
            url: getTagValueApi,
            headers: {},
            data: {
              InputScript: value, // This is the body part
            }
          }).then((res) => {
             //console.log(res)
           if(res.status === 200)
           {
            //console.log(res.status)
            if (res.data.error === "false")
            {
              //console.log("ERROR=FALSE")
              if (res.data.data == 'True' || res.data.data >= 1) {
                setDynamicFill(hextoRGBA(shape.dynamic_fill.on_off.on_color))
              } else if (res.data.data == 'False' || res.data.data == 0) {
                setDynamicFill(hextoRGBA(shape.dynamic_fill.on_off.off_color))
              }else{
                setDynamicFill(dynamcifill)
              }
            }else
            {
              //console.log("ERROR=TRUE")
              setDynamicFill(dynamcifill)
            }
            }else{
              //console.log(res.status)
            }
          }).catch((err=>{
            //console.log("-ERROR-")
            //console.log(err)
            setDynamicFill(dynamcifill)

          }));
        
        }

        //hidden_When-------------------------------------------------------------------------------------
    if (shape.object.security != undefined) {
      //  //////console.log("Hidden_when")
      var value = shape.object.security.hidden_when.__cdata;
     //With Param
     if(value.includes("%"))
     {
      var listOfParamIndex = [];
          for (var i = 0; i < value.length; i++) {
            if (value[i] == "%") {
              console.log(i)
              listOfParamIndex.push(i)
            }
          }
          if (listOfParamIndex.length == 4) {
            var param1 = value.substring(listOfParamIndex[0]+1, listOfParamIndex[1] );
            var param2 = value.substring(listOfParamIndex[2]+1, listOfParamIndex[3]);
            console.log(param1)
            console.log(param2)
            paramsList.map((val) => {
              if (val['name'] == param1 && val['componentID'] == parent.objectId) {
                value = value.replace("%"+param1+"%", val['value'])
              } else if (val['name'] == param2 && val['componentID'] == parent.objectId) {
                value = value.replace("%"+param2+"%", val['value'])
              }
            })
            value = value + "$;";
          } else {
            var param = value.substring(value.indexOf("%") + 1, value.lastIndexOf("%"))
            paramsList.map((val) => {
              if (val['name'] == param && val['componentID'] == parent.objectId) {
                //CHECKING IF STRING HAS ANY PARAM(%%)
                if (value.substring(value.indexOf("%"), value.lastIndexOf("%") + 1) != "") {
                  //REPLACING PARAM STRING(%%) WITH THE PARAM VALUE  
                  value = value.replace(value.substring(value.indexOf("%"), value.lastIndexOf("%") + 1), val['value'])
                  value = value + "$;";
                }
              }
            })
          }
     }else{
        //Removing DataTypes ---Float,
        value = value.replace("static", "");
        value = value.replace("int", "");
        value = value.replace("float", "");
        value = value.replace("double", "");
        value = value.replace("bool", "");
        value = value.replace("boolean", "");
        value = value.replace(/\r\n|\n|\r/gm, "$");
        value = value + "$;";
     
       }
      axios({
        method: 'post',
        url: getTagValueApi,
        headers: {},
        data: {
          InputScript: value, // This is the body part
        }
      }).then((res) => {
        if (res.data.error == "false") {
      setDynamicFill(hextoRGBA(shape?.fill?.fill))
          if (res.data.data == "True" || res.data.data >= 1) {
            setHide(true)
            // ////////console.log("Visible")
          } else if (res.data.data == "False" || res.data.data == 0) {
            setHide(false)
            //////////console.log("Not Visible")
          }else{
            setHide(hide)
          }
        }
      }).catch((err=>{
        //console.log("-ERROR-")
        //console.log(err)
        setHide(hide)
      }));
    }
    
    //Array--------------
    if (shape.array != undefined) {
      // //////console.log("Array")
      // //////console.log("Array")
      var value = shape.array.expression.__cdata;
      var colorsList = shape.array.colors.__cdata;
      // //////console.log(shape.array);
      // //////console.log(colorsList);
      if (value) {
        //With Param
      if(value.includes("%"))
      {
        var listOfParamIndex = [];
        for (var i = 0; i < value.length; i++) {
          if (value[i] == "%") {
            console.log(i)
            listOfParamIndex.push(i)
          }
        }
        if (listOfParamIndex.length == 4) {
          var param1 = value.substring(listOfParamIndex[0]+1, listOfParamIndex[1] );
          var param2 = value.substring(listOfParamIndex[2]+1, listOfParamIndex[3]);
          console.log(param1)
          console.log(param2)
          paramsList.map((val) => {
            if (val['name'] == param1 && val['componentID'] == parent.objectId) {
              value = value.replace("%"+param1+"%", val['value'])
            } else if (val['name'] == param2 && val['componentID'] == parent.objectId) {
              value = value.replace("%"+param2+"%", val['value'])
            }
          })
          value = value + "$;";
        } else {
          var param = value.substring(value.indexOf("%") + 1, value.lastIndexOf("%"))
          paramsList.map((val) => {
            if (val['name'] == param && val['componentID'] == parent.objectId) {
              //CHECKING IF STRING HAS ANY PARAM(%%)
              if (value.substring(value.indexOf("%"), value.lastIndexOf("%") + 1) != "") {
                //REPLACING PARAM STRING(%%) WITH THE PARAM VALUE  
                value = value.replace(value.substring(value.indexOf("%"), value.lastIndexOf("%") + 1), val['value'])
                value = value + "$;";
              }
            }
          })
        }
      }else{
         //Removing DataTypes ---Float,
         value = value.replace("static", "");
         value = value.replace("int", "");
         value = value.replace("float", "");
         value = value.replace("double", "");
         value = value.replace("bool", "");
         value = value.replace("boolean", "");
         value = value.replace(/\r\n|\n|\r/gm, "$");
         value = value + "$;";
        }
        ////console.log(value);

        axios({
          method: 'post',
          url: getTagValueApi,
          data: {
            InputScript: value, // This is the body part
          }
        }).then((res) => {

          if (res.data.data != "") {
            ////console.log(res);
            colorsList.map((color, i) => {
              if (i == res.data.data) {
                setDynamicFill(hextoRGBA(color))
              }
            })
          }
        }).catch((err=>{
          //console.log("-ERROR-")
          //console.log(err)

        }));
      }
    }

    //MultiState-------------------------------------------------------------------------------------------------
    if (shape.dynamic_fill?.multi_state != undefined) {
      //  //////console.log("MultiState")
      var conditions = shape.dynamic_fill.multi_state.condition?.__cdata;
      var colors = shape.dynamic_fill.multi_state.color.__cdata;
      // //////console.log("Multi State Data----------")
      // //////console.log(stateText);
      var body1 = conditions[0];
      //With Param
      if(body1.includes("%"))
      {
        var listOfParamIndex = [];
        for (var i = 0; i < body1.length; i++) {
          if (body1[i] == "%") {
            console.log(i)
            listOfParamIndex.push(i)
          }
        }
        if (listOfParamIndex.length == 4) {
          var param1 = body1.substring(listOfParamIndex[0]+1, listOfParamIndex[1] );
          var param2 = body1.substring(listOfParamIndex[2]+1, listOfParamIndex[3]);
          console.log(param1)
          console.log(param2)
          paramsList.map((val) => {
            if (val['name'] == param1 && val['componentID'] == parent.objectId) {
              body1 = body1.replace("%"+param1+"%", val['value'])
            } else if (val['name'] == param2 && val['componentID'] == parent.objectId) {
              body1 = body1.replace("%"+param2+"%", val['value'])
            }
          })
          body1 = body1 + "$;";
        } else {
          var param = body1.substring(body1.indexOf("%") + 1, body1.lastIndexOf("%"))
          paramsList.map((val) => {
            if (val['name'] == param && val['componentID'] == parent.objectId) {
              //CHECKING IF STRING HAS ANY PARAM(%%)
              if (body1.substring(body1.indexOf("%"), body1.lastIndexOf("%") + 1) != "") {
                //REPLACING PARAM STRING(%%) WITH THE PARAM VALUE  
                body1 = body1.replace(body1.substring(body1.indexOf("%"), body1.lastIndexOf("%") + 1), val['value'])
                body1 = body1 + "$;";
              }
            }
          })
        }
      }else{
         //Removing DataTypes ---Float,
         body1 = body1.replace("static", "");
         body1 = body1.replace("int", "");
         body1 = body1.replace("float", "");
         body1 = body1.replace("double", "");
         body1 = body1.replace("bool", "");
         body1 = body1.replace("boolean", "");
         body1 = body1.replace(/\r\n|\n|\r/gm, "$");
         body1 = body1 + "$;";
      
        }

        var body2 = conditions[1];
        if(body2.includes("%"))
        {
          var listOfParamIndex = [];
        for (var i = 0; i < body2.length; i++) {
          if (body2[i] == "%") {
            console.log(i)
            listOfParamIndex.push(i)
          }
        }
        if (listOfParamIndex.length == 4) {
          var param1 = body2.substring(listOfParamIndex[0]+1, listOfParamIndex[1] );
          var param2 = body2.substring(listOfParamIndex[2]+1, listOfParamIndex[3]);
          console.log(param1)
          console.log(param2)
          paramsList.map((val) => {
            if (val['name'] == param1 && val['componentID'] == parent.objectId) {
              body2 = body2.replace("%"+param1+"%", val['value'])
            } else if (val['name'] == param2 && val['componentID'] == parent.objectId) {
              body2 = body2.replace("%"+param2+"%", val['value'])
            }
          })
          body2 = body2 + "$;";
        } else {
          var param = body2.substring(body2.indexOf("%") + 1, body2.lastIndexOf("%"))
          paramsList.map((val) => {
            if (val['name'] == param && val['componentID'] == parent.objectId) {
              //CHECKING IF STRING body2 ANY PARAM(%%)
              if (body2.substring(body1.indexOf("%"), body2.lastIndexOf("%") + 1) != "") {
                //REPLACING PARAM STRING(%%) WITH THE PARAM VALUE  
                body2 = body2.replace(body2.substring(body2.indexOf("%"), body2.lastIndexOf("%") + 1), val['value'])
                body2 = body2 + "$;";
              }
            }
          })
        }
        }else{
           //Removing DataTypes ---Float,
           body2 = body2.replace("static", "");
           body2 = body2.replace("int", "");
           body2 = body2.replace("float", "");
           body2 = body2.replace("double", "");
           body2 = body2.replace("bool", "");
           body2 = body2.replace("boolean", "");
           body2 = body2.replace(/\r\n|\n|\r/gm, "$");
           body2 = body2 + "$;";
        
          }

     
     
     


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
          }).catch((err=>{
            //console.log("-ERROR-")
            //console.log(err)

          }));
        }).catch((err=>{
          //console.log("-ERROR-")
          //console.log(err)

        }));
        //   mutiState()
      }
    }


    /// Dynamic_Fill_Level-------------------------------------------------------------------------------------
    if (shape.dynamic_fill_level != undefined) {
      //////console.log("Dynamic_Fill_Level")
      var value = shape.dynamic_fill_level.expression.__cdata;

      var fillLevelColor = shape.dynamic_fill_level.background_color;
      var direction = shape.dynamic_fill_level.fill_direction;
      var maximumPoint = shape.dynamic_fill_level.maximum;
      var minimumPoint = shape.dynamic_fill_level.minimum;
      var levelAtMaximum = shape.dynamic_fill_level.levelAtMaximum;
      var levelAtMinimun = shape.dynamic_fill_level.levelAtMinimun;

      //////console.log(value)
      if (value) {
      //With Param
      if(value.includes("%"))
      {
        var listOfParamIndex = [];
        for (var i = 0; i < value.length; i++) {
          if (value[i] == "%") {
            console.log(i)
            listOfParamIndex.push(i)
          }
        }
        if (listOfParamIndex.length == 4) {
          var param1 = value.substring(listOfParamIndex[0]+1, listOfParamIndex[1] );
          var param2 = value.substring(listOfParamIndex[2]+1, listOfParamIndex[3]);
          console.log(param1)
          console.log(param2)
          paramsList.map((val) => {
            if (val['name'] == param1 && val['componentID'] == parent.objectId) {
              value = value.replace("%"+param1+"%", val['value'])
            } else if (val['name'] == param2 && val['componentID'] == parent.objectId) {
              value = value.replace("%"+param2+"%", val['value'])
            }
          })
          value = value + "$;";
        } else {
          var param = value.substring(value.indexOf("%") + 1, value.lastIndexOf("%"))
          paramsList.map((val) => {
            if (val['name'] == param && val['componentID'] == parent.objectId) {
              //CHECKING IF STRING HAS ANY PARAM(%%)
              if (value.substring(value.indexOf("%"), value.lastIndexOf("%") + 1) != "") {
                //REPLACING PARAM STRING(%%) WITH THE PARAM VALUE  
                value = value.replace(value.substring(value.indexOf("%"), value.lastIndexOf("%") + 1), val['value'])
                value = value + "$;";
              }
            }
          })
        }
      }else{
         //Removing DataTypes ---Float,
         value = value.replace("static", "");
         value = value.replace("int", "");
         value = value.replace("float", "");
         value = value.replace("double", "");
         value = value.replace("bool", "");
         value = value.replace("boolean", "");
         value = value.replace(/\r\n|\n|\r/gm, "$");
         value = value + "$;";
      
        }
        axios({
          method: 'post',
          url: getTagValueApi,
          data: {
            InputScript: value, // This is the body part
          }
        }).then((res) => {
          if (res.data.error == "false") {
            //Maximumvalue and  and minimunvalue is TagValue limits----
            //Percentage is the value made by Maximum and minimum value --
            //now fetch tag value and find the tag value percentage based on based percentage
            //////console.log(res.data.data);
           setRefTagValue(res.data.data)
          }
        }).catch((err=>{
          //console.log("-ERROR-")
          //console.log(err)

        }));
      }
    }
  }


  return (
    <Line
      key={"Polygon_" + shape.object.object_id + shape.object.object_number}
      id={"Polygon_" + shape.object.object_id + shape.object.object_number}
      points={getPolygonPoints(shape, parentX, parentY)}

    //fill={shape.fill == undefined ? "" : shape.fill.fill == "#5b5b5b" ? "#c0c0c0"  :shape.fill.fill}
     fill = {dynamcifill}
  //  fill={
  //   shape.dynamic_fill_level === undefined ?
  //     shape.gradient === undefined ?
  //       dynamcifill : "" : ""}

   visible={shape.object.security != undefined ? !hide :  true}
      strokeWidth={parseFloat(shape.line.line_width) ?? 2}
      stroke = {hextoRGBA(shape.line.color)  ?? "black"}
     // strokeWidth={parseInt(shape.line.line_width)}
      draggable={false}
      dashEnabled={true}
      dash={lineStyle(shape.line.style)}
      closed={parseInt(shape.polyline.closed)}
      // fillLinearGradientStartPoint={{ x: -50, y: -50 }}
      // fillLinearGradientEndPoint={{ x: 50, y: 100 }}
      // fillLinearGradientColorStops={[0,"green",1,"red"]}
    >
    </Line>
  );
};

export default UNCPolygon;
