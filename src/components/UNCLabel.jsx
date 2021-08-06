import { Text } from "react-konva";
import { getPloyPoints } from "./JSONUtil.js";
import { useState ,useEffect } from 'react';
import axios from 'axios';

function UNCLabel(shapeProps){
  
  const [hide, setHidden] = useState(true);
  const [display_on_off_text, setOnOffText] = useState('');
  const [display_numeric, setDisplayNumericValue] = useState({});
  const [display_array, setDisplayArray] = useState();

  const { text} = shapeProps; 
  
  var value = " ";
  
  value = text.static_text.toString()
  value =  value.replace(/&amp;/g,'')
  value =  value.replace(/#xa;/g,'')    
  value =  value.replace(/&/g,'')   
  value =  value.replace(/#x9;/g,'') 
  value =  value.replace(/  /g,'') 

  useEffect(() => {
    console.log("VAlue Cahanging")
  }, [display_on_off_text]);


  
  function androidToRgba(color){
    const colorArray = []
    for(let i=0; i<4; i++){
      colorArray.push(color % 256)
      color>>>=8
    }
    const alpha = colorArray.pop() / 255
    return `rgba(${colorArray.reverse()},${alpha})`
  }


  //Display Numeric-----------------------------------------------------------------------------------------------------------
  if(text.display_numeric != undefined)
  {
    value = text.display_numeric.expression.__cdata ;

    if(value){

    //Removing DataTypes ---Float,
    value = value.replace("static","");
     value = value.replace("int","");
     value = value.replace("float","");
     value = value.replace("double","");
     value = value.replace("bool","");
     value = value.replace("boolean","");
  
  
     value = value.replace(/\r\n|\n|\r/gm ,"$");
     var staticExpression = "val=6.5;$if(_HTR_1A == 1)${$val = val + 1;$if(val >= 100)$val = 0;$return val;$}$else${$val = _DTms_0003+val;$return val;$}$;";
     
  
     axios({
      method: 'post',
      url: "http://localhost:8080/tag",
      headers: {}, 
      data: {
        tagname:value, // This is the body part
      }
    }).then((res)=>{
      //console.log(display_numeric)  

      var names = {};
    
         names = display_numeric;
         console.log(names);
       names[value] =res.data.tagValue;
       setDisplayNumericValue(names);
  
    });
  

  }else
  {
    value = text.static_text.toString()
    value =  value.replace(/&amp;/g,'')
    value =  value.replace(/#xa;/g,'')    
    value =  value.replace(/&/g,'')   
    value =  value.replace(/#x9;/g,'') 
    value =  value.replace(/  /g,'') 

  }
}


  //Display_on_off-------------------------------------------------------------------------------------------------------
   if(text.display_on_off != undefined)
  {
    value = text.display_on_off.__cdata;
    if(value)
    {
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
    
     setOnOffText(previousState => text.display_on_off.text_on);
     
     }else{
   
  setOnOffText(previousState => text.display_on_off.text_off);
     }
      });

    }else
    {
      value = text.static_text.toString()
      value =  value.replace(/&amp;/g,'')
      value =  value.replace(/#xa;/g,'')    
      value =  value.replace(/&/g,'')   
      value =  value.replace(/#x9;/g,'') 
      value =  value.replace(/  /g,'') 
    
    }
   
  }


  
  //Hiddden_When-------------------------------------------------------------------------------------------------------------
   if(text.security != undefined)
  {
    var value = text.object.security?.hidden_when?.__cdata ;
    if(value)
    {
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
    setHidden(true)
   }else{
    setHidden(false)
   }
  })
}else{
  value = text.static_text.toString()
  value =  value.replace(/&amp;/g,'')
  value =  value.replace(/#xa;/g,'')    
  value =  value.replace(/&/g,'')   
  value =  value.replace(/#x9;/g,'') 
  value =  value.replace(/  /g,'')  
}
}  



  //Display_array-----------------------------------------------------------------------------------------------------------
   if(text.display_array != undefined)
  {
   
     
      // value = text.static_text.toString()
      // value =  value.replace(/&amp;/g,'')
      // value =  value.replace(/#xa;/g,'')    
      // value =  value.replace(/&/g,'')   
      // value =  value.replace(/#x9;/g,'') 
      // value =  value.replace(/  /g,'') 
      // console.log(value)
     // setDisplayArray(val)
    // // console.log("---------------------------------DirectText.display_array.index_expression.__cdata--------------------------------------")
    // // console.log(val)
    // var first = 10;
  
    // if(val.includes("+"))
    // {
    //     val = val.split("+");
  
    //     if(val[0].includes("("))
    //     {
    //     first = preFunctions.mainFunction(val[0],this.state.ProjectId,text.object.object_id)
    //     }else{
    //       first = parseInt(val[0],10)
  
    //     }
    // val = first  + parseInt(val[1],10)
    // }
  }
  
  if(text.display_numeric == undefined && 
    text.display_on_off == undefined &&
     text.display_array == undefined)
  {

    value = text.static_text.toString()
    value =  value.replace(/&amp;/g,'')
    value =  value.replace(/#xa;/g,'')    
    value =  value.replace(/&/g,'')   
    value =  value.replace(/#x9;/g,'') 
    value =  value.replace(/  /g,'') 
  
  }
  
  
          return  <Text fontFamily={text.font_family}  
         fontSize={text.font_size }
              fill={androidToRgba(text.color)}
              visible={ text.object.security != undefined ? hide :  true }
              text={text.display_numeric != undefined ? text.display_numeric.expression.__cdata ?  display_numeric[value] : value :
                text.display_on_off != undefined ?  text.display_on_off?.__cdata ? display_on_off_text : value : text.display_array != undefined ? value:
                value}
            x = {parseFloat(text.box.axis_offset_left)+parseFloat(text.box.axis_anchor)+(parseFloat(text.box.left)) }
            y = {parseFloat(text.box.axis_offset_top)+parseFloat(text.box.axis_anchor)+((parseFloat(text.box.top))) }  
          />
        }
      


export default UNCLabel;
