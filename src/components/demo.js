import React, { Component } from "react"; 
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
} from "react-konva";
import UNCRectangle from "./UNCRectangle";
import UNCEllipse from "./UNCEllipse";
import UNCPipe from "./UNCPipe";
import UNCLine from "./UNCLine";
import UNCPolygon from "./UNCPolygon";
import UNCLabel from "./UNCLabel";
import { getStateObject, ShapeObjects } from "./JSONUtil";
class demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shapes: [],
      lables: [],
    };
    this.myRef = React.createRef();
    this.App = React.createRef();
  }

  componentDidMount() {
    
    //call API and process the results from API utils then assigne it to State
    let shapeObjects = {
     // shapes: ShapeObjects(ShapesData),
     //lables: LableComponets(),
    };
  console.log(  this.setState(shapeObjects));
  }

  renderShapes(shape, parentX, parentY) {
    //console.log("renderShapes");
// if (shape.type=undefined){
//  
       
       //}

    switch (shape.type) {
     
      case "Rectangle":
        //console.log(shape.type)
        return (
          <UNCRectangle shape={shape} parentX={parentX} parentY={parentY} />
        );
      case "Ellipse":
        return <UNCEllipse shape={shape} parentX={parentX} parentY={parentY} />;
      case "Pipe":      
        return <UNCPipe shape={shape} parentX={parentX} parentY={parentY} />;
      case "Line":        
        return <UNCLine shape={shape} parentX={parentX} parentY={parentY} />;
      case "Polygon":
        return <UNCPolygon shape={shape} parentX={parentX} parentY={parentY} />;
       case "Label": 
        return <UNCLabel shape={shape} parentX={parentX} parentY={parentY} />
      
      }
        
          
    
  }
  renderLabels(text,obj)
      {
        if(obj===null)
        {
            //console.log(text)
            obj={ "zIndex": "0",
            "objectNumber": "0",
            "x1": "0",
            "y1": "0",
            "x2": "0",
            "y2": "0",
            "objectId": ""}

          }
        else  {
          //console.log("obj is not null")
          //console.log(text)
        }
        console.log(text.box.axis_offset_left)
        return  <Text fontFamily={text.font_family} 
            fontSize={text.font_size}
            fill={text.color}
            text={text.static_text}
            x={parseFloat(text.box.axis_offset_left)+((parseFloat(text.box.left))/2)}
            

            y={parseFloat(text.box.axis_offset_top)+((parseFloat(text.box.top))/2)}
        />
      }

      renderText(text,obj)
      {
        if(obj===null)
        {
            //console.log(text)
            obj={ "zIndex": "0",
            "objectNumber": "0",
            "x1": "0",
            "y1": "0",
            "x2": "0",
            "y2": "0",
            "objectId": ""}
        }
        else  {
          //console.log("obj is not null")
          //console.log(text)
        }

        return  <Text fontFamily={text.font_family} 
            fontSize={text.font_size}
            fill={text.color}
            text={text.static_text}
            x={parseFloat(text.box.axis_offset_left)+((parseFloat(text.box.left))/2)}
            y={parseFloat(text.box.axis_offset_top)+((parseFloat(text.box.top))/2)}
        />
      }
 
 

  render() {
    const { shapes, lables } = this.state;
    //console.log(shapes);
    return (

      <div id="stageContainer">
        <Stage
          id="konvaStage"
          ref={this.myRef}
          width={2200}
          height={1024}
          containerId={"stageContainer"} style={{marginLeft:"250px"}}
        >
          <Layer>
            {shapes.map((obj, i) => (
              <Group
                key={"Grp_" + obj.objectNumber + i}
                id={obj.objectNumber}
                x={0}
                x={0}
                width={parseFloat(obj.x2 == undefined ? 0 : obj.x2)}
                height={parseFloat(obj.y2 == undefined ? 0 : obj.y2)}
                fill={"blue"}
                //draggable={true}
              >
                {obj.shape === undefined ? (
                  <Group />
                ) : (
                  obj.shape.map((shape) =>
                    this.renderShapes(shape, obj.x1, obj.y1)
                  )
                )}
                {obj.text === undefined ? (
                  <Group />
                ) : (
                  obj.text.map((text) =>
                    this.renderLabels(text, obj)
                  )
                )}
              </Group>
            ))}
            
          </Layer>
        </Stage>
        <h1>helloo</h1>
      </div>
    );
  }
}

export default demo;