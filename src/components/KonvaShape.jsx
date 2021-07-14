import Konva from 'konva';
import React, { Component } from 'react'
import ReactDOM from "react-dom";
import { render } from 'react-dom';
import { Stage, Polyline, Shape,Layer, Rect,Ellipse, Text, Circle, Line,Group,Arc } from 'react-konva';
import ShapesData from "../data/shapesData"
 

export default class KonvaShaps extends  Component{
    
    constructor(props) {
      super(props);
      this.myRef = React.createRef();
      this.state = {color:1};
      this.shapesObjData=[]
      
    }

      
    componentDidMount() {
        this.LoadShapes();
      }

      LoadShapes()
      {
        var shapeData=ShapesData.hmipage.shapes.shape
        this.shapesObjData.push(shapeData)
        let ciData= ShapesData.hmipage.component_instances.map((ci=> ci))
        this.shapesObjData.push(ciData.map(xx=>xx.shap))
        console.log(this.myRef.current.find("#4293782504"))
        this.setAnimation(this.myRef.current.find("#4293782504"))

      }


      setAnimation(shape)
      {
         this.setState((x)=>x.id=2) 
        shape.to({
            fi: shape.x,
            fillLinearGradientStartPointY: shape.y,
            duration: 0.5
          });
          this.setState.color++;
         }

   


      getXPoint(shape)
      {
        switch(shape.type)
        {
            case "Rectangle":
            return (parseFloat(shape.rectangle.x1)+parseFloat(shape.box.axis_offset_left));
            case "Ellipse":
                return (parseFloat(shape.ellipse.x1)+parseFloat(shape.box.axis_offset_left)+((parseFloat(shape.box.left)+parseFloat(shape.box.right))/2));
        }

      }

      getYPoint(shape)
      {
        switch(shape.type)
        {
            case "Rectangle":
            return (parseFloat(shape.rectangle.y1)+parseFloat(shape.box.axis_offset_top));
            case "Ellipse":
            return (parseFloat(shape.ellipse.y1)+parseFloat(shape.box.axis_offset_top)+((parseFloat(shape.box.top)+parseFloat(shape.box.bottom))/2));

        }
      }

      getPloyPoints(shape,parentX,parentY)
      {
        var ptx=[]
        console.log(shape.type);
        switch(shape.type)
        {
            case "Pipe":
            ptx=shape.pipe.points.map(o => ({x: o.x, y: o.y}))
            break;
            case "Polygon":
            ptx=shape.polyline.points.map(o => ({x: o.x, y: o.y}))
            break;

        }
        let ptArray=[]
        ptx.forEach(element => {
            ptArray.push(parseFloat(element.x)+parseFloat(parentX)+parseFloat(shape.box.axis_offset_left)+((parseFloat(shape.box.left))/2))
            ptArray.push(parseFloat(element.y)+parseFloat(parentY)+parseFloat(shape.box.axis_offset_top)+((parseFloat(shape.box.top))/2))
        });
      
       return ptArray;
      }



      renderLables(text,obj)
      {
        if(obj===null)
        {
            console.log(text)
            obj={ "zIndex": "0",
            "objectNumber": "0",
            "x1": "0",
            "y1": "0",
            "x2": "0",
            "y2": "0",
            "objectId": ""}
        }

        return  <Text fontFamily={text.font_family} 
            fontSize={text.font_size}
            fill={text.color}
            text={text.static_text}
            x={parseFloat(text.box.axis_offset_left)+((parseFloat(text.box.left))/2)}
            y={parseFloat(text.box.axis_offset_top)+((parseFloat(text.box.top))/2)}
        />
      }

      renderShapes(shape,obj)
      {
       
        if(obj===null)
        {
            console.log(shape)
            obj={ "zIndex": "0",
            "objectNumber": "0",
            "x1": "0",
            "y1": "0",
            "x2": "0",
            "y2": "0",
            "objectId": ""}
        }
            switch(shape.type)
            {
                case "Rectangle":
                   return <Rect
                    key={shape.object.object_id+Math.random()+"_"+obj.id}
                    id={shape.object.object_id+Math.random()+"_"+obj.id}
                    x={this.getXPoint(shape)+parseFloat(obj.x1)}
                    y={this.getYPoint(shape)+parseFloat(obj.y1)}
                    width={parseFloat(shape.rectangle.x2)}
                    height={parseFloat(shape.rectangle.y2)}
                    fill={shape.fill.fill}
                    strokeWidth={parseFloat(shape.line.line_width)}
                    shadowBlur={10}
                    zIndex={parseFloat(shape.box.z_index)}
                    fillLinearGradientStartPointX={this.getXPoint(shape)+parseFloat(obj.x1)}
                    fillLinearGradientStartPointY={this.getYPoint(shape)+parseFloat(obj.y1)}
                    fillLinearGradientColorStops={1,shape.gradient===undefined?"nofill":shape.gradient.gradient_color}
                    cornerRadius= {parseFloat(shape.rectangle.corner_radius)}
                    />
                    


                    break;

                    case "Ellipse":
                      return  <Ellipse
                        key={shape.object.object_id+"_Ellipse_"+obj.key}
                        id={shape.object.object_id+"_"+shape.ellipse.x2+"c"+obj.key}
                        x={this.getXPoint(shape)+parseFloat(obj.x1)}
                        y={this.getYPoint(shape)+parseFloat(obj.y1)}
                        width={parseFloat(shape.ellipse.x2)}
                        height={parseFloat(shape.ellipse.y2)}
                        fill={shape.fill.fill}
                        shadowBlur={10}
                        strokeWidth={parseFloat(shape.line.line_width)}
                        zIndex={parseFloat(shape.box.z_index)}
                        //fillLinearGradientStartPointX={this.getXPoint(shape)+parseFloat(obj.x1)}
                        //fillLinearGradientStartPointY={this.getYPoint(shape)+parseFloat(obj.y1)}
                       // fillLinearGradientColorStops={1,shape.gradient===undefined?"nofill":shape.gradient.gradient_color}
                        />
                        break;

                        case "Polygon":
                       
                        return    <Line key={"Polygon_"+obj.key}
                    points={this.getPloyPoints(shape,obj.x1,obj.y1)} 
                    fill={shape.fill==undefined?"nofill":shape.fill.fill}
                    stroke={shape.line.color}
                    strokeWidth={shape.line.line_width}
                    closed={parseInt(shape.polyline.closed)}
                    // fillLinearGradientStartPointX={this.getXPoint(shape)+parseFloat(obj.x1)}
                    // fillLinearGradientStartPointY={this.getYPoint(shape)+parseFloat(obj.y1)}
                    // fillLinearGradientColorStops={1,shape.gradient===undefined?"nofill":shape.gradient.gradient_color}
                    ></Line>


                    case "Pipe":
                       
                        return    <Line id={"Pipe_"+Math.random()}
                    points={this.getPloyPoints(shape,obj.x1,obj.y1)} 
                    fill={shape.fill==undefined?"nofill":shape.fill.fill}
                    stroke={shape.line.color}
                    strokeWidth={shape.line.line_width}
                    draggable={true}
                    closed={false}
                    // fillLinearGradientStartPointX={this.getXPoint(shape)+parseFloat(obj.x1)}
                    // fillLinearGradientStartPointY={this.getYPoint(shape)+parseFloat(obj.y1)}
                    fillLinearGradientColorStops={1,shape.gradient===undefined?"nofill":shape.gradient.gradient_color}
                    ></Line>

                    case "Line":
                       
                        return    <Line id={"Line_"+Math.random()}
                    points={this.getPloyPoints(shape,obj.x1,obj.y1)} 
                    fill={shape.fill==undefined?"nofill":shape.fill.fill}
                    stroke={shape.line.color}
                    strokeWidth={shape.line.line_width}
                    draggable={true}
                    ></Line>
                    break;

                    case "text":
                        return <Text text="hello" />
                        break;

            }
      }

    render() { 

        return(
            <div id="stageContainer">
        <Stage id="konvaStage_11" ref={this.myRef} width={1024} height={800}
            containerId={"stageContainer"}>
            <Layer>
               
                {ShapesData.hmipage.shapes.map((obj,i) => ( 
                    
                     this.renderShapes(obj,null)   
                  
                ))
                }
                {
                    ShapesData.hmipage.labels.map((obj,i) => ( 
                    
                        this.renderLables(obj,null)  
                 
               ))  
                }

              
            
                {ShapesData.hmipage.component_instances.map((obj,i) => ( 
                 <Group
                 id={obj.objectNumber}
                key={obj+"_Group_"+i}
                x={0}
                x={0}
                width={parseFloat(obj.x2)}
                height={parseFloat(obj.y2)}
                zIndex={i}
                fill={"#00D2FF"} 
                draggable={true}
                >
                    {
                        obj.shape.sort((a, b) => parseInt(a.z_index) > parseInt(b.z_index) ? 1 : -1).map((shape)=>(
                                this.renderShapes(shape,obj)
                        ))
                    }
                    </Group>
                ))
                }
            </Layer>
      </Stage>  
      </div>
        )
    }
}
 



