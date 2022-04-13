import { Text } from "react-konva";
import { getPloyPoints } from "./JSONUtil.js";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getTagValueApi, androidToRgba, hextoRGBA, intervalUpdate, paramsList } from './Utils';


const UNCText = (shapeProps) => {

  const { text, parentX, parentY, parent } = shapeProps;

  //visible
  const [hide, setHidden] = useState(true);
  //text
  const [display_value, setDisplayValue] = useState(0);
  const [dynamcifill, setDynamicFill] =
    useState(hextoRGBA(text.color));

  // const [display_on_off_text, setOnOffText] = useState('');
  // const [display_numeric, setDisplayNumericValue] = useState({});
  // const [display_array, setDisplayArray] = useState();

  var value = " ";

  value = text.static_text.toString()
  value = value.replace(/&amp;/g, '')
  value = value.replace(/#xa;/g, '')
  value = value.replace(/&/g, '')
  value = value.replace(/#x9;/g, '')
  value = value.replace(/  /g, '')

  useEffect(() => {
    const interval = setInterval(() => {
      dynamciAssociation();
    }, intervalUpdate);
    return () => {
      window.clearInterval(interval)
    }
  });

  function dynamciAssociation() {

      if (text.display_string !== undefined) {
        value = text.display_string.__cdata.toString();

        if(value == "getDate()")
        {
          setDisplayValue("2022-02-10");
        }      
      }



    // //Display------------------------------------
    //Display Numeric-----------------------------------------------------------------------------------------------------------
    if (text.display_numeric !== undefined) {
      value = text.display_numeric.expression.__cdata.toString();
      if (value) {
        //With Param
        if (value.includes("%")) {
          //////console.log(value);
          ////////console.log(paramsList.length);
          ////////console.log(paramsList);
          //value.toString().replace("%","");
          // console.log(value.indexOf("%"))
          // console.log(value.lastIndexOf("%"))
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

        console.log(value)


        axios({
          method: 'post',
          url: getTagValueApi,
          data: {
            InputScript: value, // This is the body part
          }
        }).then((res) => {
          //console.log(res)
          if (res.data.error == "false") {
            setDisplayValue(res.data.data);
          } else {
            setDisplayValue("ERROR")
          }
        }).catch((err) => {
          // //console("Error")
          // //console(err)
          setDisplayValue("ERROR")
        })

      } else {
        value = text.static_text.toString()
        value = value.replace(/&amp;/g, '')
        value = value.replace(/#xa;/g, '')
        value = value.replace(/&/g, '')
        value = value.replace(/#x9;/g, '')
        value = value.replace(/  /g, '')
      }
    }

    //Display_on_off-------------------------------------------------------------------------------------------------------
    if (text.display_on_off !== undefined) {
      value = text.display_on_off.__cdata;
      if (value) {
        //With Param-------------------
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
          if (res.data.error == "false") {
            //////console.log(res.data.data)
            if (res.data.data == "True" || res.data.data >= 1) {
              setDisplayValue(text.display_on_off.text_on);
            } else if (res.data.data == "False" || res.data.data == 0) {
              setDisplayValue(text.display_on_off.text_off);
            }
          }
        }).catch((err) => {
          ////console("Error")
          ////console(err)
          setDisplayValue("ERROR")
        })
      } else {
        value = text.static_text.toString()
        value = value.replace(/&amp;/g, '')
        value = value.replace(/#xa;/g, '')
        value = value.replace(/&/g, '')
        value = value.replace(/#x9;/g, '')
        value = value.replace(/  /g, '')
      }
    }


    //Display_array-----------------------------------------------------------------------------------------------------------
    if (text.display_array !== undefined) {
      var value = text.display_array?.index_expression?.__cdata;
      var arrayData = text.display_array?.array_text?.__cdata;
      if (value) {
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
          data: {
            InputScript: value, // This is the body part
          }
        }).then((res) => {
          //    ////////console.log(res)
          if (res.data.data !== "") {
            arrayData.map((singleDataPoint, i) => {
              // ////////console.log(singleDataPoint)
              if (i == parseInt(res.data.data)) {
                setDisplayValue(singleDataPoint)
              }
            });
          }
        }).catch((err) => {
          ////console("Error")
          // //console(err)
          setDisplayValue("ERROR")
        })
      } else {
        value = text.static_text.toString()
        value = value.replace(/&amp;/g, '')
        value = value.replace(/#xa;/g, '')
        value = value.replace(/&/g, '')
        value = value.replace(/#x9;/g, '')
        value = value.replace(/  /g, '')
      }
    }


    //MultiState-------------------------------------------------------------------------------------------------
    if (text.display_multi_state !== undefined) {
      var conditions = text.display_multi_state?.conditions?.__cdata;
      var stateText = text.display_multi_state?.state_text?.__cdata;
      // ////////console.log("Multi State Data----------")
      // ////////console.log(stateText);
      //With Param
      ////console.log(conditions)
      var body1 = conditions[0];
      ////console.log(body1)
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
      ////console.log(body2)
      //With Param
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
      ////console.log(body1)
      ////console.log(body2)
      if (conditions !== null) {
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
            ////console.log(condition1Responce)
            ////console.log(condition2Responce)
            ////console.log(stateText)

            if (condition1Responce.data.error == "false" && condition2Responce.data.error == "false") {

              //0-0
              if (condition1Responce.data.data == "False" && condition2Responce.data.data == "False" || condition1Responce.data.data == 0 && condition2Responce.data.data == 0) {

                setDisplayValue(stateText[0])
              }//0-1
              else if (condition1Responce.data.data == "False" && condition2Responce.data.data == "True" || condition1Responce.data.data == 0 && condition2Responce.data.data >= 1) {

                setDisplayValue(stateText[1])
              }//1-0
              else if (condition1Responce.data.data == "True" && condition2Responce.data.data == "False" || condition1Responce.data.data >= 1 && condition2Responce.data.data == 0) {

                setDisplayValue(stateText[2])
              }//1-1
              else if (condition1Responce.data.data == "True" && condition2Responce.data.data == "True" || condition1Responce.data.data >= 1 && condition2Responce.data.data >= 1) {

                setDisplayValue(stateText[3])
              }
            }
          }).catch((err) => {
            // //console("Error")
            // //console(err)
            setDisplayValue("ERROR")
          })
        }).catch((err) => {
          // //console("Error")
          // //console(err)
          setDisplayValue("ERROR")
        })
        //   mutiState()
      } else {
        value = text.static_text.toString()
        value = value.replace(/&amp;/g, '')
        value = value.replace(/#xa;/g, '')
        value = value.replace(/&/g, '')
        value = value.replace(/#x9;/g, '')
        value = value.replace(/  /g, '')
      }
    }

    //Visibility------------------------------------
    //Hiddden_When-------------------------------------------------------------------------------------------------------------
    if (text.object.security !== undefined) {
      var value = text.object.security?.hidden_when?.__cdata.toString();
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
      // ////////console.log(value)
      if (value) {
        axios({
          method: 'post',
          url: getTagValueApi,
          headers: {},
          data: {
            InputScript: value, // This is the body part
          }
        }).then((res) => {
          //    ////////console.log(res)
          if (res.data.error === "false") {
            if (res.data.data == "True" || res.data.data >= 1) {
              setHidden(true);
            } else if (res.data.data == "False" || res.data.data == 0) {
              setHidden(false);
            }
          }
        }).catch((err) => {
          ////console("Error")
          ////console(err)
          setDisplayValue("ERROR")
        })
      } else {
        value = text.static_text.toString()
        value = value.replace(/&amp;/g, '')
        value = value.replace(/#xa;/g, '')
        value = value.replace(/&/g, '')
        value = value.replace(/#x9;/g, '')
        value = value.replace(/  /g, '')
      }
    }

    //Dynamic_Filll-----------------------------------------------------------------------
    if (text.dynamic_fill?.on_off != undefined) {
      //     ////console.log("Dynamic_Filll")
      // ////////console.log( shape.dynamic_fill.on_off.on_color_when.__cdata)
      var value = text.dynamic_fill.on_off?.on_color_when?.__cdata;
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
        // ////console.log(res)
        if (res.status === 200) {
          if (res.data.error === "false") {
            if (res.data.data == 'True' || res.data.data >= 1) {
              //////console.log("True");
              //////console.log(hextoRGBA(shape.dynamic_fill.on_off.on_color));
              setDynamicFill(hextoRGBA(text.dynamic_fill.on_off.on_color));
            } else if (res.data.data == 'False' || res.data.data == 0) {
              //  ////console.log("False");
              // ////console.log(hextoRGBA(shape.dynamic_fill.on_off.off_color));
              setDynamicFill(hextoRGBA(text.dynamic_fill.on_off.off_color));
            } else {
              setDynamicFill(dynamcifill);
            }
          }
        } else {
          setDynamicFill(dynamcifill);
        }
      }).catch((err => {
        //console.log("-ERROR-")
        //console.log(err)
        //  setDynamicFill(123);//RAJESH

      }));
    }

  }


  if (text.display_numeric == undefined &&
    text.display_on_off == undefined &&
    text.display_array == undefined && text.display_multi_state == undefined) {

    value = text.static_text.toString()
    value = value.replace(/&amp;/g, '')
    value = value.replace(/#xa;/g, '')
    value = value.replace(/&/g, '')
    value = value.replace(/#x9;/g, '')
    value = value.replace(/  /g, '')
  }


  return <Text fontFamily={text.font_family}
    align={"center"}
    fontSize={text.font_size}
    //   fill={hextoRGBA(text.color)}
    fill={dynamcifill}
    visible={text.object.security !== undefined ? hide : true}
    //  text={"Normal Text"}
    // text={text.display_numeric !== undefined ? text.display_numeric.expression.__cdata ? display_numeric[value] : value :
    //   text.display_on_off !== undefined ? text.display_on_off?.__cdata ? display_on_off_text : value : text.display_array !== undefined ? value :
    //     value}
    text={text.display_numeric == undefined &&
      text.display_on_off == undefined &&
      text.display_array == undefined && text.display_multi_state == undefined
      ? value : display_value}
    x={parseFloat(parentX) + parseFloat(text.box.axis_anchor) + parseFloat(text.box.axis_offset_left) + ((parseFloat(text.box.left)) / 2)}
    y={parseFloat(parentY) + 5 + parseFloat(text.box.axis_anchor) + parseFloat(text.box.axis_offset_top) + ((parseFloat(text.box.top)) / 2)}

  />
}



export default UNCText;
