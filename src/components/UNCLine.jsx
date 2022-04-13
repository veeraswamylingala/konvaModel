import { Line } from "react-konva";
import { getLinePoints } from "./CanvasUtils.js";
import {hextoRGBA,lineStyle} from './Utils';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  intervalUpdate, getTagValueApi,
  androidToRgba, paramsList
} from './Utils';

const UNCLine = (shapeProps) => {
  const { shape, parentX, parentY, parent} = shapeProps;
  const [refTagValue, setRefTagValue] = useState(0);
  // const [render, isRendered] = useState(false);
  //Hide------
  const [hide, setHide] = useState(true);
  //Apperance-----
  //  shape.dynamic_fill
  //  shape.dynamic_fill_level 
  //  shape.dynamic_fill?.multi_state
  //  shape.array 
  //  shape.dynamic_fill?.on_off  
  const [dynamcifill, setDynamicFill] =
    useState(hextoRGBA(shape?.fill?.fill));
    

  useEffect(() => {
    //setDynamicFill(hextoRGBA(shape?.fill?.fill))
    const interval = setInterval(() => {
      dynamciAssociation();
      
    }, intervalUpdate);
    return () => {
      window.clearInterval(interval)
    }
  });
  function dynamciAssociation() {

    //Dynamic_Filll-----------------------------------------------------------------------
    if (shape.dynamic_fill?.on_off != undefined) {
      //     //console.log("Dynamic_Filll")
      // //////console.log( shape.dynamic_fill.on_off.on_color_when.__cdata)
      var value = shape.dynamic_fill.on_off?.on_color_when?.__cdata;
      if (value.includes("%")) {
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
      } else {
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
        // //console.log(res)
        if (res.status === 200) {
          if (res.data.error === "false") {
            if (res.data.data == 'True' || res.data.data >= 1) {
            //console.log("True");
              console.log(hextoRGBA(shape.dynamic_fill.on_off.on_color));
              setDynamicFill(hextoRGBA(shape.dynamic_fill.on_off.on_color));
              
            } else if (res.data.data == 'False' || res.data.data == 0) {
              //console.log("False");
              // //console.log(hextoRGBA(shape.dynamic_fill.on_off.off_color));
              setDynamicFill(hextoRGBA(shape.dynamic_fill.on_off.off_color));
              
            } else {
              setDynamicFill("Black");
            }
          }else {
            setDynamicFill("Black");
          }
        } else {
          setDynamicFill("Black");
        }
      }).catch((err => {
      //console.log("-ERROR-")
      //console.log(err)
        setDynamicFill("Black");//RAJESH
      }));
    }
    if (shape.object.security != undefined) {
      //  //////console.log("Hidden_when")
      var value = shape.object.security.hidden_when.__cdata.toString();
      //if --_%TAG%
      //With Param
      if (value.includes("%")) {
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
      } else {
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
        if (res.status === 200) {
          if (res.data.error === "false") {
            // //console.log(paramsList.length)

            //setDynamicFill(hextoRGBA(shape?.fill?.fill))
            if (res.data.data == "True" || res.data.data >= 1) {
              setHide(false)
              //console.log("Visible")
            } else if (res.data.data == "False" || res.data.data == 0) {
              setHide(true)
              //console.log("Not Visible")
            } else {
              setHide(hide)
            }
          }
        } else {
          setHide(hide)
        }
      }).catch((err => {
      //console.log("-ERROR-")
      //console.log(err)
        setHide(hide)

      }));

    }
    if (shape.array != undefined) {
      // //////console.log("Array")
      // //////console.log("Array")
      var value = shape.array.expression.__cdata;
      var colorsList = shape.array.colors.__cdata;
      // //////console.log(shape.array);
      // //////console.log(colorsList);
      if (value) {
        if (value.includes("%")) {
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
        } else {
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

          if (res.data.data != "") {
            colorsList.map((color, i) => {
              if (i == res.data.data) {
                setDynamicFill(hextoRGBA(color))
              }
            })
          }
        }).catch((err => {
        //console.log("-ERROR-")
        //console.log(err)
          setDynamicFill("Black")

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

      if (body1.includes("%")) {
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
      } else {
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

      if (body2.includes("%")) {
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
      } else {
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
            //console.log(condition2Responce)
            //console.log(condition1Responce)


            if (condition1Responce.data.error == "false" && condition2Responce.data.error == "false") {
              //0-0
              if (condition1Responce.data.data == "False" && condition2Responce.data.data == "False" || condition1Responce.data.data == 0 && condition2Responce.data.data == 0) {

                setDynamicFill(hextoRGBA(colors[0]))
              }//0-1
              else if (condition1Responce.data.data == "False" && condition2Responce.data.data == "True" || condition1Responce.data.data == 0 && condition2Responce.data.data >= 1) {

                setDynamicFill(hextoRGBA(colors[1]))
              }//1-0
              else if (condition1Responce.data.data == "True" && condition2Responce.data.data == "False" || condition1Responce.data.data >= 1 && condition2Responce.data.data == 0) {

                setDynamicFill(hextoRGBA(colors[2]))
              }//1-1
              else if (condition1Responce.data.data == "True" && condition2Responce.data.data == "True" || condition1Responce.data.data >= 1 && condition2Responce.data.data >= 1) {
                setDynamicFill(hextoRGBA(colors[3]))
              }
            }
          }).catch((err => {
          //console.log("-ERROR-")
          //console.log(err)
            setDynamicFill("Black")

          }));
        }).catch((err => {
        //console.log("-ERROR-")
        //console.log(err)
          setDynamicFill("Black")

        }));
        //   mutiState()
      }
    }
  }
  
  return (
    <Line
      key={"Line_" +  shape.object.object_number}
      id={"Line_" + shape.object.object_id}
       points={getLinePoints(shape, parentX, parentY)}
       fill = {dynamcifill}
      visible={shape.object.security != undefined ? hide : true}
      //dynamcifill={hextoRGBA(shape.dynamic_fill.on_off.on_color)}
     /* fill={
        shape.dynamic_fill_level === undefined ?
          shape.gradient === undefined ?
            dynamcifill : "" : ""
      }*/
      dashEnabled={true}
      dash={lineStyle(shape.line.style)}
      stroke={hextoRGBA(dynamcifill) ?? "Black"}
     // stroke={hextoRGBA(shape.line.color) ?? "grey"}
      strokeWidth={parseInt(shape.line.line_width) ?? 1}
      //strokeWidth={10}
      draggable={false}
      lineCap={"round"}
      lineJoin={"round"}
      
    ></Line>
  );
  
};

export default UNCLine;
