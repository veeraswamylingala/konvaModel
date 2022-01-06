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
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Form, FormControl, Button } from 'react-bootstrap';
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

import { androidToRgba,hextoRGBA,lineStyle} from './Utils';


class UNCCanvas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shapes: [],
      lables: [],
      stageScale: 1,
      stageX: 0,
      ProjectId: null,
      stageY: 0,
      loading: false,
      currentXml: "",
      imagesArray: [],
      display_on_off_value: false,
      randomValue: 0,
      xmlsList: [],
      tagValue: {},
      templateData: null,
      image: null,
      windowheight: null,
      windowwidth: null,
      windowColor: "grey"
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





  //Dynamic Importing of Xmls------------------------
  importingXmls() {
    function importAll(r) {
      return r.keys().map(r);
    }
    var images = importAll(require.context('./Xml', false, /\.(pagex)$/));
    // //console.log(images)
    this.setState({
      xmlsList: images
    }, () => {
      //   //console.log(this.state.xmlsList)
    })
  }

  //This Loads  User Selected Xml 
   async handleSubmit(event) {
     console.log(event)
    this.setState({
      loading: true,
      currentXml: event
    })
    ////console.log(event)
    var parser = require('fast-xml-parser');
    var he = require('he');
    var options = {
      attributeNamePrefix: "",
      //attrNodeName: false,
      //textNodeName : "#text",
      ignoreAttributes: false,
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

    console.log('./Xml/' + event + '.pagex')
    try {
      var value = require('./Xml/' + event + '.pagex');
    } catch {

    }

    //console.log(value)
    var data = [];
     
    await axios.get(value.default, {
      "Content-Type": "application/xml; charset=utf-8"
    }).then((response) => {
      // //console.log(response)
      data = response.data;
      //console.log(data)
    }).catch(error => {
      ////console.log(error.response)
    });


    // Page Convertion---------------------------------------------------------------------
    var tObj = parser.getTraversalObj(data, options);
    var jsonObj = parser.convertToJson(tObj, options);
    //console.log("jsonPage--------------------------------------------------------------")
    console.log(jsonObj)

    this.setState({
      ProjectId: jsonObj.hmipage?.id
    })

    var v = hextoRGBA(jsonObj.hmipage.color);
    ////console.log(v)

    this.setState({ windowColor: v ?? null })
    this.setState({ windowheight: jsonObj.hmipage.height ?? "1050" })
    this.setState({ windowwidth: jsonObj.hmipage.width ?? "1890" })


    var pageShape = ShapeObjects(jsonObj);
    console.log("PageShapes ------------------------------------------------------------------")
    console.log(pageShape);

    //console.log(jsonObj.hmipage.template_id)


    if (jsonObj.hmipage.template_id != "") {
       //console.log("-------------------------JsonTemplateID-----------------------------")
          //console.log(jsonObj.hmipage.template_id)

      var templateShapes = [];
      // require('../' + this.props.termsAndCondition.pdfDocument);

      try {
        var value = require('./templates/' + jsonObj.hmipage.template_id + '.pagex');
      } catch {

      }

      // //console.log(value)
      if (value != undefined) {
       //console.log("Entered If "+value.default)
        await axios.get(value.default, {
          "Content-Type": "application/xml; charset=utf-8"
        }).then((response) => {
          //  //console.log(response)
          // //console.log('Your xml file as string', response.data);
          this.setState({ templateData: response.data }, () => {
            // //console.log(this.state.templateData)
            //Template Convertion-----------------------------------------------------------------------
            var template = parser.getTraversalObj(this.state.templateData, options)
            var templateJson = parser.convertToJson(template, options);
            //console.log("jsonTemplateObj--------------------------------------------------------------")
            //console.log(templateJson)

            templateShapes = ShapeObjects(templateJson)
            console.log("TemplateShapes ------------------------------------------------------------------")
            console.log(templateShapes);
          })
        })
      } else {
        // //console.log("NO File Detected!")
      }

      pageShape.map((val) => {
        templateShapes.push(val)
      })

      this.setState({
        shapes: templateShapes
      }, () => {
        //  //console.log(this.state.shapes)
        this.setState({
          loading: false
        })
      })
    } else {
      this.setState({
        shapes: pageShape
      }, () => {
        //  //console.log(this.state.shapes)
        this.setState({
          loading: false
        })
      })
    }
  }

  //Render Images---------------------------------------------------------------------
  renderImages(image, obj) {
    return <Image x={parseFloat(image.x)} y={parseFloat(image.y)}
      image={this.state.image}
      height={parseFloat(image.box.bottom)}
      width={parseFloat(image.box.right)} />
  }

  //Render Shapes --------------------------------
  renderShapes(shape, parentX, parentY) {
    // //console.log(parentX)
    // //console.log(parentY)

    if (shape) {
      if (shape.type != undefined) {
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

           // return <UNCButton shape={shape} parentX={parentX} parentY={parentY} ProjectId={this.state.ProjectId} />
           
           return   <Group>
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
             this.buttonOnclick(shape)
              
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
             text={shape.button != undefined ? this.buttonText(shape.button.buttontext.text)   :  "Button"}
             draggable={false}
             onClick={() => {
              this.buttonOnclick(shape)
             }}
     
           ></Text>
         </Group>

       
          }
      }
    }
  }

  buttonText(buttonTitle){

var text = buttonTitle;
text = text.replace("&#xa;"," ");
    return text;
  }


  buttonOnclick(shape){
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
             try {
         var value = require('./Xml/' + targetPage + '.pagex');
       } catch {
       }
       if(value?.default != undefined)
       {
        this.handleSubmit(targetPage.toString());

       }else{
         alert(targetPage + " Not Found !");
       }
     

    

      }
    }else{
      //console.log(shape?.button?.buttontext?.text)
    }

  }




  //Render Group-------------------------------------------------
  renderGroupsMian(shape, Obj) {
    // //console.log(shape)
    // //console.log(Obj)

    if (shape.group) {
      ////console.log("-0-group")
      if (shape.group.length != undefined) {
        return shape.group.map((group) =>
          this.renderGroupsMian(group, Obj))
      } else {
        return this.renderGroupsMian(shape.group, Obj)

      }
    }


    if (shape.text) {
      ////console.log("-0-text")
      if (shape.text.length != undefined) {
        return shape.text.map((text) => this.renderGrouptext(text, Obj))
      }
      else {
        return this.renderGrouptext(shape.text, Obj)
      }
    }

    if (shape.shape) {
      //   //console.log(Obj.group)
      // //console.log(Obj.x1)
      // //console.log(Obj.y1)
      if (shape.shape.length != undefined) {
        return shape.shape.map((shape) =>
          this.renderShapes(shape, Obj.x1, Obj.y1))
      } else {

        return this.renderShapes(shape.shape, Obj, Obj.y1)
      }
    }
  }


  //Direct Text-------------------
  rendertext(text, parentX, parentY) {
 // console.log(text)
    return <UNCText text={text} parentX={parentX} parentY={parentY} />;
  }



  //Group Text-------------------
  renderGrouptext(text, obj) {
   // var val = "";
  //  val = text.static_text;
    ////console.log("groupText");
    ////console.log(val)

    //Display Numeric----------------------------------------------
    // if (text.display_numeric != undefined) {
    //   val = text.display_numeric.expression.__cdata;
    //   //val = val.split("(");
    //   // //console.log(val)
    // }

    //Display_on_off-----------------------------------------------
    // else if (text.display_on_off != undefined) {
    //   var cdataValue = text.display_on_off.__cdata;
    //   //this.timer = setInterval(() => this.displayOutput(),1000)  
    // }


    return <Text fontFamily={text.font_family}
    align={"center"}
      fontSize={text.font_size}
      fill={hextoRGBA(text.color)}
      // text={text.display_on_off != undefined ?
      //   this.state.display_on_off_value == true ? text.display_on_off.text_on : text.display_on_off.text_off :
      //   val}
      //draggable={true}
      text={text.static_text}

      x={parseFloat(obj.x1 ?? 0) -5+ parseFloat(text.box.axis_offset_left) + parseFloat(text.box.axis_anchor) + (parseFloat(text.box.left)) + parseFloat(10)}
      y={parseFloat(obj.y1 ?? 0) + 5  + parseFloat(text.box.axis_offset_top) + parseFloat(text.box.axis_anchor) + ((parseFloat(text.box.top)) + parseFloat(20))}
    //  x={ parseFloat(obj.x1)+ parseFloat(text.box.axis_anchor)+parseFloat(text.box.axis_offset_left)+((parseFloat(text.box.left))/2)}
    //  y={ parseFloat(obj.y1)+parseFloat(text.box.axis_anchor)+parseFloat(text.box.axis_offset_top)+((parseFloat(text.box.top))/2)}
    />
  }

  //Labels Text ------------------------------------------------------------------
  renderLabels(text, obj) {

    return <UNCLabel text={text} />;

  }

  //Render--------------------------------------------------------------------------------------------------------------------------------------------
  render() {
    const { shapes, lables } = this.state;
   
    return (

      <div id="stageContainer" width={this.state.windowwidth}
      height={this.state.windowheight} style={{ backgroundColor: this.state.windowColor }} >
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">
          <img
            src="assets/ecs.png"
            width="80"
            height="40"
            className="d-inline-block align-top"
          /></Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#" onClick={() => this.handleSubmit("Home_Page")}>Home</Nav.Link>

          {/* Dynamic Retriving of Xmls from the Folder -----------------------------------------------------------   */}
          <NavDropdown title="Xml's" style={{ backgroundolor: 'white' }} >
            {
              this.state.xmlsList.map((xml, i) => {
                var name = xml.default.replace("/static/media/", "");
                name = name.replace(".pagex", "");
                name = name.split(".");

                return <NavDropdown.Item className={i + 1} href="#" onClick={() => this.handleSubmit(name[0])}>{name[0]}</NavDropdown.Item>
              }
              )
            }
          </NavDropdown>
          {/* <Button variant="primary">{this.state.ProjectId}</Button>{' '} */}
        </Nav>
        <Form inline>
          {/* <Button variant="outline-info">LatestAlarms</Button>{' '}
          <Button variant="outline-info">LatestEvents</Button>{' '}
          <Button variant="outline-info">Login</Button> */}
        </Form>
      </Navbar>
      <center><div style={{ display: this.state.loading ? "block" : "none" }}>
        <label>Loading...</label>
      </div></center>
      
      {this.state.currentXml === "Home_Page" ?

  //Home Page----------------------------------
    <div className="page" style={{width:this.state.windowwidth, height:window.height,  background:"#004C99" }}>
    <br/>
    
  
    <div >
        <center><h3 style={{color:'white'}}>Welcome To ECSCADA Design Studio</h3></center>
    </div>
    <br/>   
    <br/>   
    <br/>   

  
    <div class="container">
            <div class="row">
                
      {this.state.xmlsList.map((page)=>{
      var pageName = page.default.split("/")
      pageName = pageName[3].split(".")
      pageName = pageName[0]

      
      return   <div  class="col-md-3 text-center"  style={{
        paddingBottom: '30px',
      
      }}> 
      
      
      
      <Button style={{width: "100%"}} onClick={()=> this.handleSubmit(pageName)} variant="btn btn-secondary btn-lg">
    <p  style={{fontSize: "15px"}}>
  {pageName}
  </p>

        </Button>
        
        </div>

    })}
    
  </div></div>
    </div>
    : 

      <Stage
        id="konvaStage"
        ref={this.myRef}
        width={this.state.windowwidth}
        height={this.state.windowheight}
        containerId={"stageContainer"}
        //  style={{marginLeft:"250px", backgroundColor:"Grey"}}

        style={{ display: this.state.loading ? "none" : "block", backgroundColor:this.state.windowColor }}
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
                    ) : this.renderShapes(obj.shape, obj.x1, obj.y1)
                )}


                {/* obj.shapes--------------------------------------------------------- */}
                {obj.shapes === undefined ? (
                  <Group />
                ) : (
                  obj.shapes.map((shape) =>
                    this.renderShapes(shape, obj.x1, obj.y1)
                  )
                )}

                {/* {obj.params === undefined ? (
                  <Group />
                ) : (
                  // obj.params.length != undefined ?
                  // obj.params.map((shape) =>
                //   this.renderparams(shape)
                // ): 
                  this.renderparams(obj)
                )} */}



                {/* Obj.text----------------------------------------------------------- */}

                {/* {obj.text === undefined ?(
                <Group />
              ):
              obj.text.length != undefined ? 
              obj.text.map((value) => {

                //console.log("*****************************************************************************")
                return  <UNCDynamicText shape={value} parentX={obj.x1} parentY={obj.y1} />
              }
                ):   <UNCDynamicText shape={obj.text} parentX={obj.x1} parentY={obj.y1} />
              } */}

                {obj.text === undefined ? (
                  <Group />
                ) :
                  obj.text.length != undefined ?
                    obj.text.map((value) => this.rendertext(value, obj.x1, obj.y1)
                    ) : this.rendertext(obj.text, obj.x1, obj.y1)
                }
                

                {/* //Obj.Labels---------------------------------------------------- */}
                {obj.labels === undefined ? (
                  <Group />
                ) : (
                  //MainLabels length Validation
                  obj.labels.length != undefined ?
                    //if
                    obj.labels.map((text, i) =>

                      text.text.length != undefined ?

                        text.text.map((text) =>

                          this.renderLabels(text, obj))

                        : this.renderLabels(text.text, obj))
                    //else
                    : obj.labels.text.length != undefined ?

                      obj.labels.text.map((text, i) =>
                        this.renderLabels(text, obj)
                      )
                      : this.renderLabels(obj.labels.text, obj)
                )}

                {/* //obj.groups-------------------------------------------------------- */}

                {

                  obj.group === undefined ? (
                    <Group />
                  ) : (
                    //if--1--------------------

                    obj.group.length != undefined ?
                      obj.group.map((val) => {
                        //console.log("--GroupS in  UNCCanvas")
                        //console.log(obj)
                        if (val.text) {
                          //   //console.log("-0-text")
                          //  //console.log(obj)
                          if (val.text.length != undefined) {
                            return val.text.map((text) =>  this.rendertext(val.text, obj.x1, obj.y1))

                          }
                          else {
                            return this.rendertext(val.text, obj.x1, obj.y1)
                          }
                        }

                        if (val.group) {
                          ////console.log("-0-group")
                          if (val.group.length != undefined) {
                            //  //console.log("Calling");
                            return val.group.map((group) => this.renderGroupsMian(group, obj))
                          }
                          else {
                            return this.renderGroupsMian(val.group, obj)
                          }

                        }
                        if (val.shape) {
                          //console.log("-0-shape")
                          //console.log(obj.group.x1, obj.group.y1)
                          //console.log(val.x1, val.y1)


                          if (val.shape.length != undefined) {
                            return val.shape.map((shape) =>
                              this.renderShapes(shape, obj.x1, obj.y1))
                          }
                          else {
                            return this.renderShapes(val.shape, obj.x1, obj.y1)

                          }
                        }
                      }
                      ) : this.renderGroupsMian(obj.group, obj)
                  )}


                {/* //obj.images-------------------------------------------------------- */}

                {obj.image === undefined ? (
                  <Group />
                ) : (
                  obj.image.length != undefined ?
                    obj.image.map((image) =>
                      this.renderImages(image, obj)
                    ) : this.renderImages(obj.image, obj)
                )}

              </Group>
            ) : null) : null}

        </Layer>
      </Stage>
}
    </div>

    
    );
  }
}

export default UNCCanvas;