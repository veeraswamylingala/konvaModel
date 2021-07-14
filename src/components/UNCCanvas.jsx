import React, { Component } from "react"; 
import listReactFiles from 'list-react-files'
import { getRectPointX, getRectPointY } from "./CanvasUtils.js";
import { useState } from 'react'
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
import { Navbar, Nav, NavItem, NavDropdown, MenuItem ,Form ,FormControl,Button } from 'react-bootstrap';
import { getPloyPoints } from "./JSONUtil.js";
import UNCRectangle from "./UNCRectangle";
import preFunctions from "./preFunctions";
import UNCEllipse from "./UNCEllipse";
import UNCPipe from "./UNCPipe";
import UNCLine from "./UNCLine";
import UNCPolygon from "./UNCPolygon";
import UNCLabel from "./UNCLabel";
import UNCButton from "./UNCButton";
import ShapesData from "../data/shapesData";
import { XmlToJson } from "./XmlToJson.es6";
import { getStateObject, ShapeObjects } from "./JSONUtil";
import axios from 'axios';
 import XMLData from './templates/xmlFiles/template_4.pagex';
import UNCDynamicText from "./UNCDynamicText.jsx";
import { style } from "d3-selection";
import UNCText from "./UNCText.jsx";
import { geoGnomonic } from "d3";
import { isDOMComponentElement } from "react-dom/cjs/react-dom-test-utils.production.min";


class UNCCanvas extends Component {



  constructor(props) {
    super(props);
    this.state = {
      shapes: [],
      lables: [],
      stageScale: 1,
      stageX: 0,
      ProjectId:null,
      stageY: 0,
      loading :false,
      currentXml:"",
      imagesArray:[],
      display_on_off_value:false,
     randomValue:0,
     xmlsList:[],
      tagValue : {},
      templateData : null,
        image: null,
        windowheight : null,
        windowwidth : null ,
          windowColor : null
    };
    this.myRef = React.createRef();
    this.App = React.createRef();

    

  }
 

  


  componentDidMount() {
    
    const image = new window.Image();
    image.src = "assets/ecs.png";
    
    image.onload = () => {
      this.setState({
        image: image
      });
    };
    //Default Index Xml- HomePage----
    this.handleSubmit("Home_Page");
    //Importing Xmls-------
  this.importingXmls()
  } 




    //This Function Convets AndroidColorCode to RgbaColorCode-----------------
    androidToRgba(color){
      const colorArray = []
      for(let i=0; i<4; i++){
        colorArray.push(color % 256)
        color>>>=8
      }
      this.vv();
      const alpha = colorArray.pop() / 255
      return `rgba(${colorArray.reverse()},${alpha})`
    }
  
  
    //Dynamic Importing of Xmls------------------------
    importingXmls(){
      function importAll(r) {
        return r.keys().map(r);
      }
      var images = importAll(require.context('./Xml', false, /\.(pagex)$/));
      console.log(images)
      this.setState({
        xmlsList:images},() => {
          console.log(this.state.xmlsList)
        })    
    }
    


    //This Loads  User Selected Xml 
  async handleSubmit(event) {
    this.setState({
      loading : true,
      currentXml:event
    })
    console.log(event)
      var parser = require('fast-xml-parser');
      var he = require('he');
      var options = {
        attributeNamePrefix : "",
        //attrNodeName: false,
        //textNodeName : "#text",
        ignoreAttributes : false,
        ignoreNameSpace: false,
        // attributeNamePrefix : "",
        // attrNodeName: "attr", //default is 'false'
        // textNodeName : "",
        // ignoreAttributes : true,
        // ignoreNameSpace : true,
        // allowBooleanAttributes : false,
        // parseNodeValue : true,
        // parseAttributeValue : false,
        // trimValues: true,
        cdataTagName: "__cdata", //default is 'false'
        cdataPositionChar: "\c",
        // parseTrueNumberOnly: false,
        // arrayMode: false, //"strict"
        // attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//default is a=>a
        // tagValueProcessor : (val, tagName) => he.decode(val), //default is a=>a
        // stopNodes: ["parse-me-as-string"]
    };

    try{
      var value = require('./Xml/'+ event +'.pagex');
    }catch{

    }
     var data = [];
  console.log(value)
    await axios.get( value.default, {
      "Content-Type": "application/xml; charset=utf-8"
   }) .then( (response) =>  {
     console.log(response)
     data = response.data;
   }).catch(error => {
    console.log(error.response)
});

    
    // Page Convertion---------------------------------------------------------------------
    var tObj = parser.getTraversalObj(data,options);
    var jsonObj = parser.convertToJson(tObj,options);
      console.log("jsonPageObj--------------------------------------------------------------")
     console.log(jsonObj)
    
     this.setState({
       ProjectId:jsonObj.hmipage?.id
     })

   var  v = androidToRgba(jsonObj.hmipage.color);
   console.log(v)


   function androidToRgba(color){
    const colorArray = []
    for(let i=0; i<4; i++){
      colorArray.push(color % 256)
      color>>>=8
    }
    const alpha = colorArray.pop() / 255
    return `rgba(${colorArray.reverse()},${alpha})`
  }


     this.setState({windowColor:v ?? null})
     this.setState({windowheight:jsonObj.hmipage.height ?? "1050"})
     this.setState({windowwidth:jsonObj.hmipage.width ?? "1890"})
   

    var pageShape = ShapeObjects(jsonObj);
    // console.log("PageShapes ------------------------------------------------------------------")
    // console.log(pageShape);

    // console.log("-------------------------JsonTemplateID-----------------------------")
    // console.log(jsonObj.hmipage.template_id)

    var templateShapes = [];
    // require('../' + this.props.termsAndCondition.pdfDocument);
    
    try{
      var value = require('./templates/'+jsonObj.hmipage.template_id+'.pagex');
    }catch{

    }

    // console.log(value)
    if(value != undefined)
       {
    //  console.log("Entered If "+value.default)
     await axios.get( value.default, {
      "Content-Type": "application/xml; charset=utf-8"
   }) .then( (response) =>  {
    //  console.log(response)
        // console.log('Your xml file as string', response.data);
      this.setState({templateData:response.data}, () => {
        // console.log(this.state.templateData)
         //Template Convertion-----------------------------------------------------------------------
      var template = parser.getTraversalObj(this.state.templateData,options)
      var templateJson = parser.convertToJson(template,options);
      // console.log("jsonTemplateObj--------------------------------------------------------------")
       // console.log(templateJson)

      templateShapes = ShapeObjects(templateJson)
      // console.log("TemplateShapes ------------------------------------------------------------------")
      // console.log(templateShapes);
      }) 
     } ) }else{
      // console.log("NO File Detected!")
     }
  
      pageShape.map((val)=>{
        templateShapes.push(val)
      })

      this.setState({
          shapes:templateShapes},() => {
            console.log(this.state.shapes)
            this.setState({
              loading:false
            })
          })    
  }

    //Render Images---------------------------------------------------------------------
    renderImages(image, obj)
    {
      return  <Image x={parseFloat(image.x)} y={parseFloat(image.y)}
          image= {this.state.image}
      height ={parseFloat(image.box.bottom)}
      width = {parseFloat(image.box.right)} />
    }


  //Render Shapes --------------------------------
  renderShapes(shape, parentX, parentY) {
    
   if(shape) {
    if(shape.type != undefined)
    { 
    switch (shape.type) {
      case "Rectangle":
        return <UNCRectangle shape={shape} parentX={parentX} parentY={parentY} />;
      case "Ellipse":
        return <UNCEllipse shape={shape} parentX={parentX} parentY={parentY} />;
      case "Pipe":      
        return <UNCPipe shape={shape} parentX={parentX} parentY={parentY} />;
      case "Line":        
        return <UNCLine shape={shape} parentX={parentX} parentY={parentY} />;
      case "Polygon":
        return <UNCPolygon shape={shape} parentX={parentX} parentY={parentY} />;
          case "Button":

          return <UNCButton shape={shape} parentX={parentX} parentY={parentY} ProjectId={this.state.ProjectId}/>
       }
      }
    }   
  }

  
//Render Group-------------------------------------------------
renderGroupsMian(shape,Obj)
{
   if(shape.group)
    {
      console.log("-0-group")
      if(shape.group.length != undefined) {
        return shape.group.map((group) =>
        this.renderGroupsMian(group,Obj))
      }else{
        return   this.renderGroupsMian(shape.group,Obj) 

      }     
    }


    if(shape.text)
    {
      console.log("-0-text")
          if(shape.text.length != undefined )
          {
        return   shape.text.map((text) => this.renderGrouptext(text,Obj))
          }
          else{
            return  this.renderGrouptext(shape.text,Obj)
          }
    }
    

     if(shape.shape)
    {
      console.log("-0-shape")
      if( shape.shape.length != undefined){
    return    shape.shape.map((shape) =>
        this.renderShapes(shape,Obj.x1,Obj.y1))
      }else{

     return   this.renderShapes(shape.shape,Obj.x1,Obj.y1) 
      }  
    } 
}


  //Direct Text-------------------
   rendertext(text,parentX,parentY)
  {
 var val = "";  
var hidden = false;
val = text.static_text;

 //Display Numeric----------------------------------------------
if(text.display_numeric != undefined)
{
  val = text.display_numeric.expression.__cdata ;

// console.log("----------------------------------DirectText.Display_Numeric--------------------------------------")

//it will return Tru or false ----------------
if(val.includes("_"))
{
  //Removing DataTypes ---Float,
  val = val.replace("static","");
  val = val.replace("int","");
  val = val.replace("float","");
  val = val.replace("double","");
  val = val.replace("bool","");
  val = val.replace("boolean","");

   //console.log(val);
   val = val.replace(/\r\n|\n|\r/gm ,"$");
   var staticExpression = "val=6.5;$if(_HTR_1A == 1)${$val = val + 1;$if(val >= 100)$val = 0;$return val;$}$else${$val = _DTms_0003+val;$return val;$}$;";
   axios({
    method: 'post',
    url: "http://localhost:8080/tag",
    headers: {}, 
    data: {
      tagname:val, // This is the body part
    }
  }).then((res)=>{
   
    var names = {};
       names = this.state.tagValue;
       //console.log(names)
     names[val]=res.data.tagValue
    this.setState({
      tagValue :names
    },()=>{
    //  console.log(this.state.tagValue);
    })
   
  });
}
//Display_on_off
}else if(text.display_on_off != undefined)
{
  val = text.display_on_off.__cdata;

  if(val.includes("("))
  {
    var res = preFunctions.mainFunction(val,this.state.ProjectId,text.object.object_id)
  }
 var  onText = text.display_on_off.text_on ;
 var offText = text.display_on_off.text_off;

}
else
{
  val = text.static_text.toString()
  val =  val.replace(/&amp;/g,'')
  val =  val.replace(/#xa;/g,'')    
  val =  val.replace(/&/g,'')   
  val =  val.replace(/#x9;/g,'') 
  val =  val.replace(/  /g,'') 

}



// val =preFunctions.mainFunction(val[0],this.state.ProjectId,text.object.object_id) / parseInt(val[1],10)


// //Display_array--------------------------------
// if(text.display_array != undefined)
// {
//   val = text.display_array.index_expression.__cdata
//   // console.log("---------------------------------DirectText.display_array.index_expression.__cdata--------------------------------------")
//   // console.log(val)
//   var first = 10;

//   if(val.includes("+"))
//   {
//       val = val.split("+");

//       if(val[0].includes("("))
//       {
//       first = preFunctions.mainFunction(val[0],this.state.ProjectId,text.object.object_id)
//       }else{
//         first = parseInt(val[0],10)

//       }
//   val = first  + parseInt(val[1],10)
//   }
// }


var  functionReturnValue ;
//Hidden_When---------------------------------------------
// if(text.security != undefined)
// {
//   // console.log("---------------------------------DirectText.security.hiddenWhen--------------------------------------")
//   // console.log(op)

//   //Indirect ----
//   if(text.security.hidden_when.__cdata  == undefined)
//   {
//     console.log("Hidden When C[dATA] eMPTY")
//      functionReturnValue = preFunctions.designLevelFunction("hidden_when",this.state.ProjectId,text.object.object_id)
  
//   }
//   //Direct
//   else
//   {
//     var op = text.security.hidden_when.__cdata;
//     if(op.includes("("))
//     {
//       var res = preFunctions.mainFunction(op,this.state.ProjectId,text.object.object_id)
//     }
    
//   }
// }

function textData(){
  if(text.display_numerix != undefined )
  {
    return this.state.tagValue[val]
  
  }else if(text.display_on_off != undefined)
  {
    return "vv"

  }else{
    return  val
  }

}



return  <UNCLabel text={text}  />;
        // return  <Text fontFamily={text.font_family}  
        // fontSize={text.font_size}
        //      fill={this.androidToRgba(text.color)}
        //     text={ textData()}
        //     visible = {text.security != undefined? text.security.hidden_when.__cdata != undefined?!this.state.display_on_off_value :functionReturnValue: true}
        //        x={ parseFloat(parentX)+ parseFloat(text.box.axis_anchor)+parseFloat(text.box.axis_offset_left)+((parseFloat(text.box.left))/2)}
        //      y={ parseFloat(parentY)+parseFloat(text.box.axis_anchor)+parseFloat(text.box.axis_offset_top)+((parseFloat(text.box.top))/2)}
        //  /> 
     
        } 
  



  //Group Text-------------------
  renderGrouptext(text,obj)
  {
   
var val = "";  
val = text.static_text;

//Display Numeric----------------------------------------------
if(text.display_numeric != undefined)
{
val = text.display_numeric.expression.__cdata ;
//val = val.split("(");
// console.log(val)
}

//Display_on_off-----------------------------------------------
else if(text.display_on_off != undefined)
{
var  cdataValue = text.display_on_off.__cdata ;
   //this.timer = setInterval(() => this.displayOutput(),1000)  
}

return  <UNCLabel text={text}  />;
        // return  <Text fontFamily={text.font_family} 
          
        // fontSize={text.font_size } 
        //      fill={this.androidToRgba(text.color)}
        //      text={text.display_on_off != undefined?
        //       this.state.display_on_off_value==true ?text.display_on_off.text_on:text.display_on_off.text_off:
        //     val}
 
        //      x = { parseFloat(obj.x1 ?? 0)+ parseFloat(text.box.axis_offset_left)+parseFloat(text.box.axis_anchor)+(parseFloat(text.box.left) )+parseFloat(10) }
        //      y = { parseFloat(obj.y1 ?? 0)+ parseFloat(text.box.axis_offset_top)+parseFloat(text.box.axis_anchor)+((parseFloat(text.box.top))+parseFloat(20)) }  
        //     //  x={ parseFloat(parentX)+ parseFloat(text.box.axis_anchor)+parseFloat(text.box.axis_offset_left)+((parseFloat(text.box.left))/2)}
        //     //  y={ parseFloat(parentY)+parseFloat(text.box.axis_anchor)+parseFloat(text.box.axis_offset_top)+((parseFloat(text.box.top))/2)}
        //  />
  }



      //Labels ------------------------------------------------------------------
      renderLabels(text,obj)
      {
        var value = " ";
        value = text.static_text.toString()
        value =  value.replace(/&amp;/g,'')
        value =  value.replace(/#xa;/g,'')    
        value =  value.replace(/&/g,'')   
        value =  value.replace(/#x9;/g,'') 
        value =  value.replace(/  /g,'') 
      
      
       
      
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
            names = this.state.tagValue;
          //  console.log(names)
          names[value]=res.data.tagValue
     
         this.setState({
           tagValue :names
         },()=>{
           //console.log(this.state.tagValue);
         })
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
            // this.state.setOnOffText(text.display_on_off.text_on)
           }else{
            // setOnOffText(text.display_on_off.text_off)
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
          // setHidden(true)
         }else{
          // setHidden(false)
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
        
        return  <UNCLabel text={text}  />;

              //   return  <Text fontFamily={text.font_family}  
              //  fontSize={text.font_size }
              //       fill={androidToRgba(text.color)}
              //       visible={ text.object.security != undefined ? hide :  true }
              //       text={text.display_numeric != undefined ? text.display_numeric.expression.__cdata ? this.state.tagValue[value] : value :
              //         text.display_on_off != undefined ?  text.display_on_off?.__cdata ? display_on_off_text : value : text.display_array != undefined ? value:
              //         value}
              //     x = {parseFloat(text.box.axis_offset_left)+parseFloat(text.box.axis_anchor)+(parseFloat(text.box.left)) }
              //     y = {parseFloat(text.box.axis_offset_top)+parseFloat(text.box.axis_anchor)+((parseFloat(text.box.top))) }  
              //   />
              }
            
      
      

    


  //Render--------------------------------------------------------------------------------------------------------------------------------------------
  render() {
    const { shapes, lables } = this.state;
    const label =  this.state.loading == true ? <label>Loading.....</label> : <label>Loading.....</label>

    return (
     
      <div id="stageContainer"   width={this.state.windowwidth}
      height={this.state.windowheight} style={{backgroundColor:this.state.windowColor}} >
      <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="#home"> 
    <img
        src="assets/ecs.png"
        width="80"
        height="40"
        className="d-inline-block align-top"
      /></Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link  href="#Home_Page" onClick={()=> this.handleSubmit("Home_Page")}>Home</Nav.Link>
    
       {/* Dynamic Retriving of Xmls from the Folder -----------------------------------------------------------   */}
      <NavDropdown title="Xml's" id="basic-nav-dropdown"> 
        {
          this.state.xmlsList.map((xml) =>
          {

            var name = xml.default.replace("/static/media/","");
           name = name.replace(".pagex","");
          name  =  name.split(".");

            return   <NavDropdown.Item href="#" onClick={()=> this.handleSubmit(name[0])}>{name[0]}</NavDropdown.Item>       
          }
          )

        }
       </NavDropdown>
     
      <Button variant="primary">{this.state.ProjectId}</Button>{' '}
    </Nav>
    <Form inline>
    <Button variant="outline-info">LatestAlarms</Button>{' '}
    <Button variant="outline-info">LatestEvents</Button>{' '}
      <Button variant="outline-info">Login</Button>
    </Form>
  </Navbar>

    
        <center><div style={{display: this.state.loading ? "block" : "none"}}>
          <label>Loading...</label>
          </div></center>
      

       <Stage
          id="konvaStage"
          ref={this.myRef}
          width={this.state.windowwidth}
          height={this.state.windowheight}
          containerId={"stageContainer"}
          //  style={{marginLeft:"250px", backgroundColor:"Grey"}}

          style={{display: this.state.loading ? "none" : "block",backgroundColor:"this.state.windowColor"}}
          
        >
   
          <Layer>
            {shapes.length != undefined ? shapes.map((obj, i) => obj != undefined ?
             (
              <Group
                key={"Grp_" + obj.objectNumber + i}

               // id={obj.objectNumber}
                x={0}
                y={0}
                // width={parseFloat(obj.x2 == undefined ? 0 : obj.x2)}
                // height={parseFloat(obj.y2 == undefined ? 0 : obj.y2)}
                 // fill={"blue"}
                //draggable={true}
              >


 {/* obj.shape--------------------------------------------------------- */}
                {obj.shape === undefined ? (
                  <Group />
                ) : (
                  obj.shape.length != undefined ?
                  obj.shape.map((shape) =>
                    this.renderShapes(shape, obj.x1, obj.y1)
                  ) :this.renderShapes(obj.shape, obj.x1, obj.y1)
                )}


 {/* obj.shapes--------------------------------------------------------- */}
                {obj.shapes === undefined ? (
                  <Group />
                ) : (
                  obj.shapes.map((shape) =>
                    this.renderShapes(shape, obj.x1, obj.y1)
                  )
                )}

               

{/* Obj.text----------------------------------------------------------- */}

                {/* {obj.text === undefined ?(
                  <Group />
                ):
                obj.text.length != undefined ? 
                 obj.text.map((value) => {

                  console.log("*****************************************************************************")
                  return  <UNCDynamicText shape={value} parentX={obj.x1} parentY={obj.y1} />
                 }
                  ):   <UNCDynamicText shape={obj.text} parentX={obj.x1} parentY={obj.y1} />
                } */}

                {obj.text === undefined ?(
                  <Group />
                ):
                obj.text.length != undefined ? 
                 obj.text.map((value) =>   this.rendertext(value, obj.x1, obj.y1)
                  ):   this.rendertext(obj.text, obj.x1, obj.y1)
                }
 
{/* //Obj.Labels---------------------------------------------------- */}
                 {obj.labels === undefined ? (
                  <Group />
                ) :  (
                  //MainLabels length Validation
                obj.labels.length != undefined ?
                //if
                  obj.labels.map((text,i) =>  
                    
                     text.text.length != undefined ?
                  
                         text.text.map((text) =>
                        
                         this.renderLabels(text,obj))

                     : this.renderLabels(text.text,obj))
                     //else
                :   obj.labels.text.length !=undefined ?

                     obj.labels.text.map((text,i)=>
                     this.renderLabels(text,obj)
                     )
                       :this.renderLabels(obj.labels.text,obj)
                )} 
                
 {/* //obj.groups-------------------------------------------------------- */}

             {
             obj.group === undefined ? (
                  <Group />
                ) : (
                  //if--1--------------------
                 
                  obj.group.length != undefined ?
                      obj.group.map((val) => 
                     
                        { 
                        if(val.text)
                        { 
                          console.log("-0-text")
                          console.log(obj)
                         if ( val.text.length != undefined) {
                          return    val.text.map((text) => this.renderGrouptext(text,obj))

                          }
                          else 
                          {
                           return  this.renderGrouptext(val.text,)
                          }
                        }

                        if(val.group)
                        { 
                          console.log("-0-group")
                         if ( val.group.length != undefined) {
                          return   val.group.map((group) => this.renderGroupsMian(group,obj))
                          }
                          else 
                          {
                           return  this.renderGroupsMian(val.group, obj)
                          }
                   
                        }
                        if(val.shape)
                        {
                          console.log("-0-shape")

                          if(val.shape.length != undefined) {
                        return     val.shape.map((shape) =>
                                this.renderShapes(shape,obj.x1,obj.y1)) 
                          }
                           else
                           {
                         return  this.renderShapes(val.shape,obj.x1,obj.y1)
                          
                           }                                
                        }        }
                      ):   this.renderGroupsMian(obj.group,obj) 
                )   }


 {/* //obj.images-------------------------------------------------------- */}

              {obj.image === undefined ? (
                  <Group />
                ) : (
                  obj.image.length != undefined ?
                  obj.image.map((image) =>
                    this.renderImages(image, obj)
                  ):   this.renderImages(obj.image, obj)
                )}

              </Group>
            ):null  ):null }
            
          </Layer>
        </Stage>
        
      </div>
    );
  }
}

export default UNCCanvas;