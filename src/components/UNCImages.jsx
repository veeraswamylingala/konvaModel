import { Text,Image } from "react-konva";
import { getPloyPoints } from "./JSONUtil.js";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { intervalUpdate, androidToRgba, hextoRGBA, getTagValueApi, paramsList } from './Utils';



const UNCImage = (shapeProps) => {
  const { image ,parent } = shapeProps;
  const imageData = new window.Image();
  //Defauklt Image
  imageData.src = "assets/ecs.png";
  const [allImages, setAllImages] = useState();
  const [imageName, setImage] = useState(imageData);
    //Hide------
    const [hide, setHide] = useState(true);

  useEffect(() => {
    //Assign image.filename.src Image
    if(image.filename.src != undefined)
    {
      try
      {
        var value = require("C:/ECWEBSERVER/Images/"+image.filename.src);
      }catch(error)
      {
        console.log(error)
      }
      if(value != undefined)
      {
        imageData.src  = value.default;
        console.log(imageData)
         //imageData.src =  "assets/"+image.filename.src;
           imageData.onload = () => {
             setImage(imageData)
           }; 
      }
    }  

    
    const interval = setInterval(() => {
      dynamciAssociation();
    }, intervalUpdate);
    return () => {
      window.clearInterval(interval)
    }
  },[]);

      function dynamciAssociation(){

   //hidden_When-------------------------------------------------------------------------------------
   if (image.hidden_when != undefined) {
    //  //////console.log("Hidden_when")
    var value = image.hidden_when.__cdata.toString();
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
        console.log(res)
        if (res.data.error === "false") {
          if (res.data.data == "True" || res.data.data >= 1) {
            setHide(true)
            // ////////console.log("Visible")
          } else if (res.data.data == "False" || res.data.data == 0) {
            setHide(false)
            //////////console.log("Not Visible")
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

    //Dynamic_Filll-----------------------------------------------------------------------
    if (image.on_off != undefined) {
      //     //console.log("Dynamic_Filll")
      // //////console.log( shape.dynamic_fill.on_off.on_color_when.__cdata)
      var value = image.on_off.__cdata;
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
        const imageData = new window.Image();
        // //console.log(res)
        if (res.status === 200) {
          if (res.data.error === "false") {
            if (res.data.data == 'True' || res.data.data >= 1) {
          //ON
          try
          {
            var value = require("C:/ECWEBSERVER/Images/"+image.on_off.on_name);
          }catch(error)
          {
            console.log(error)
          }
          if(value != undefined)
          {
            imageData.src  = value.default;
            console.log(imageData)
             //imageData.src =  "assets/"+image.filename.src;
               imageData.onload = () => {
                 setImage(imageData)
               }; 
          }
            } else if (res.data.data == 'False' || res.data.data == 0) {
          //OFF
          try
          {
            var value = require("C:/ECWEBSERVER/Images/"+image.on_off.off_name);
          }catch(error)
          {
            console.log(error)
          }
          if(value != undefined)
          {
            imageData.src  = value.default;
            console.log(imageData)
             //imageData.src =  "assets/"+image.filename.src;
               imageData.onload = () => {
                 setImage(imageData)
               }; 
          }
     
            } else {
          
            }
          }else {
     
          }
        } else {
      
        }
      }).catch((err => {
    
      }));
    }
}  


  return <Image x={parseFloat(image.x)} y={parseFloat(image.y)}
    image={imageName}
    visible={image.hidden_when != undefined ? !hide : true}
    height={parseFloat(image.box.bottom)}
    width={parseFloat(image.box.right)} />
  
};

export default UNCImage;
