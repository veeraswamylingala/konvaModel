import React, { Component } from 'react'
import ReactDOM from "react-dom";
import { render } from 'react-dom';
import { Stage, Shape,Layer, Rect,Ellipse, Text, Circle, Line,Group,Arc } from 'react-konva';
import ShapesData from "../data/shapesData"

export default class ShapesKonva extends  Component{
    constructor(props) {
      super(props);
      this.state = {};
    }

    render() { 
        let rectOjects = {};
        let eleObjects = {};
        //console.log(ShapesData.hmipage.component_instances.map); 
        return ( 
            <Stage width={parseFloat(ShapesData.hmipage.width)} height={parseFloat(ShapesData.hmipage.height)}>
            <Layer>
            
                {/* <Line
                stroke="red"
                strokeWidth={10}
                lineJoin= 'round'
                points= {
                    [272,239,362,238,364,302,366,451]
                }
                fill="red"
                >
                </Line> */}


            {ShapesData.hmipage.component_instances.map((obj,i) => ( 

                  <Group
                  key={obj+"_Group_"+i}
                  x={parseFloat(obj.x1)}
                  x={parseFloat(obj.y1)}
                  width={parseFloat(obj.x2)}
                  height={parseFloat(obj.y2)}
                  z_index={i}
                  draggable={true}
                  >
                {/* {obj.shape.filter(x=>x.type==="Rectangle").map((gio)=>(
                <Rect
                id={gio.object.object_id+i}
                x={parseFloat(gio.rectangle.x1)+parseFloat(obj.x1)}
                y={parseFloat(gio.rectangle.y1)+parseFloat(obj.y1)}
                width={parseFloat(gio.rectangle.x2)}
                height={parseFloat(gio.rectangle.y2)}
                fill={gio.fill.fill}
                strokeWidth={parseFloat(gio.line.line_width)}
                stroke={gio.line.color}
                shadowBlur={10}
                draggable={true}
                offset={20,6}
              
          

          zindex={parseFloat(gio.box.z_index)}
      
              />


              
                ))} */}
                  {obj.shape.filter(x=>x.type==="Ellipse").map((gio,j)=>(
                <Ellipse
                key={gio.object.object_id+"_Ellipse_"+j}
                id={gio.object.object_id+"_"+gio.ellipse.x2+"c"+j}
                x={parseFloat(gio.ellipse.x1)+parseFloat(obj.x1)}
                y={parseFloat(gio.ellipse.y1)+parseFloat(obj.y1)}
                width={parseFloat(gio.ellipse.x2)}
                height={parseFloat(gio.ellipse.y2)}
                fill={gio.fill.fill}
                shadowBlur={10}
                strokeWidth={parseFloat(gio.line.line_width)}
                zindex={parseFloat(gio.box.z_index)}
                offsetX={parseFloat(gio.box.axis_offset_left)}  //*-1-parseFloat(gio.box.left)+parseFloat(gio.box.right)-parseFloat(gio.box.axis_offset_right)}
                offsety={parseFloat(gio.box.axis_offset_top)}
              />
                )
                )
                }

{obj.shape.filter(x=>x.type==="Polygon").map((gio,p)=>(
                  <Shape
                  key={gio.object.object_id+"_Shape"+p}
                  stroke="red"
                  strokeWidth={10}
                  lineJoin= 'round'
                  points={
                    gio.polyline.points.map((pt)=> ((parseFloat(pt.x)+parseFloat(obj.x1)),(parseFloat(pt.y)+parseFloat(obj.y1))))
                  } 
                                   
                  fill="red"
                  >
                  </Shape>
                ))}
                </Group>
            ))}

            </Layer>
          </Stage>
         );
    }
}
 



