import { Text } from "react-konva";
import { getPloyPoints } from "./JSONUtil.js";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {intervalUpdate, androidToRgba, hextoRGBA ,getTagValueApi} from './Utils';
import { interpolate } from "d3";

const UNCLabel = (shapeProps) => {
  const { text } = shapeProps;
  const [hide, setHidden] = useState(true);
  const [display_on_off_text, setOnOffText] = useState('');

  const [display_value, setDisplayValue] = useState(text.static_text.toString());
  // const [display_numeric, setDisplayNumericValue] = useState(0);
  // const [display_array, setDisplayArray] = useState();
  var value = " ";

  value = text.static_text.toString()
  value = value.replace(/&amp;/g, '')
  value = value.replace(/#xa;/g, '')
  value = value.replace(/&/g, '')
  value = value.replace(/#x9;/g, '')
  value = value.replace(/  /g, '')

  useEffect(() => {
   const  interval = setInterval(() => {
      dynamciAssociation();
    }, intervalUpdate);
    return ()=>{
      window.clearInterval(interval)
    }
  });


  function dynamciAssociation() {
    // //Display------------------------------------
    //Display Numeric-----------------------------------------------------------------------------------------------------------
    if (text.display_numeric != undefined) {
      value = text.display_numeric.expression.__cdata;
      if (value) {
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

          data: {
            InputScript: value, // This is the body part
          }
        }).then((res) => {
          // console.log(res)
          if (res.data.error == "false") {
            //      var names = {};
            //    names = display_numeric;
            //    //console.log(names);
            //  names[value] =res.data;
            setDisplayValue(res.data.data);
          }
        });
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
    if (text.display_on_off != undefined) {
      value = text.display_on_off.__cdata;
      if (value) {
        //Removing DataTypes ---Float,
        value = value.replace("static", "");
        value = value.replace("int", "");
        value = value.replace("float", "");
        value = value.replace("double", "");
        value = value.replace("bool", "");
        value = value.replace("boolean", "");
        value = value.replace(/\r\n|\n|\r/gm, "$");
        value = value + "$;";
        //console.log(value)
        axios({
          method: 'post',
          url: getTagValueApi,
          headers: {},
          data: {
            InputScript: value, // This is the body part
          }
        }).then((res) => {
          if (res.data.error == "false") {
            if (res.data.data == "True") {
              setDisplayValue(text.display_on_off.text_on);
            } else if (res.data.data == "False") {
              setDisplayValue(text.display_on_off.text_off);
            }
          }
        });
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
    if (text.display_array != undefined) {
      var value = text.display_array?.index_expression?.__cdata;
      var arrayData = text.display_array?.array_text?.__cdata;
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
          //    console.log(res)
          if (res.data.data != "") {
            arrayData.map((singleDataPoint, i) => {
              // console.log(singleDataPoint)
              if (i == parseInt(res.data.data)) {
                setDisplayValue(singleDataPoint)
              }
            });
          }
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
    if (text.display_multi_state != undefined) {
      var conditions = text.display_multi_state?.conditions?.__cdata;
      var stateText = text.display_multi_state?.state_text?.__cdata;
      // console.log("Multi State Data----------")
      // console.log(stateText);
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

                setDisplayValue(stateText[0])
              }//0-1
              else if (condition1Responce.data.data == "False" && condition2Responce.data.data == "True") {

                setDisplayValue(stateText[1])
              }//1-0
              else if (condition1Responce.data.data == "True" && condition2Responce.data.data == "False") {

                setDisplayValue(stateText[2])
              }//1-1
              else if (condition1Responce.data.data == "True" && condition2Responce.data.data == "True") {

                setDisplayValue(stateText[3])
              }
            }
          })
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
    if (text.object.security != undefined) {
      var value = text.object.security?.hidden_when?.__cdata;
      //Removing DataTypes ---Float,
      value = value.replace("static", "");
      value = value.replace("int", "");
      value = value.replace("float", "");
      value = value.replace("double", "");
      value = value.replace("bool", "");
      value = value.replace("boolean", "");
      value = value.replace(/\r\n|\n|\r/gm, "$");
      value = value + "$;";
      // console.log(value)
      if (value) {
        axios({
          method: 'post',
          url: getTagValueApi,
          headers: {},
          data: {
            InputScript: value, // This is the body part
          }
        }).then((res) => {
          //    console.log(res)
          if (res.data.error === "false") {
            if (res.data.data == "True") {
              setHidden(true);
            } else if (res.data.data == "False") {
              setHidden(false);
            }
          }
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
 
  }


  //if no Dynamic Association showing StaticText
  if (text.display_numeric == undefined && text.display_on_off == undefined &&
    text.display_array == undefined && text.display_multi_state == undefined) {

    value = text.static_text.toString()
    value = value.replace(/&amp;/g, '')
    value = value.replace(/#xa;/g, '')
    value = value.replace(/&/g, '')
    value = value.replace(/#x9;/g, '')
    value = value.replace(/  /g, '')
 
  }


  return <Text fontFamily={text.font_family}
    draggable={false}
    fontSize={parseInt(text.font_size)}
    fill={hextoRGBA(text.color)}
    visible={text.object.security != undefined ? hide : true}
    // text={text.display_numeric != undefined ? text.display_numeric.expression.__cdata ?  display_numeric : value :
    //   text.display_on_off != undefined ?  text.display_on_off?.__cdata ? display_on_off_text : value : text.display_array != undefined ? value:
    //   value}
    text={text.display_numeric == undefined &&
      text.display_on_off == undefined &&
      text.display_array == undefined && 
      text.display_multi_state == undefined
      ? value : display_value}
    x={parseFloat(text.box.axis_offset_left) + parseFloat(text.box.axis_anchor) + (parseFloat(text.box.left))}
    y={parseFloat(text.box.axis_offset_top) + 5 + parseFloat(text.box.axis_anchor) + ((parseFloat(text.box.top)))}
  />
}

export default UNCLabel;
