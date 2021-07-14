import React, {Component} from 'react';
import * as d3 from "d3";
import ShapesData from "../data/shapesData"

class BarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {ShapesData};
        this.dataset = [100, 200, 300, 400, 500];
      }
    
    
    componentDidMount() {
      this.drawChart();
    }
      
    drawChart() {
      
        let eccanvas= d3.select("body").attr("style", "border: 2px solid gold");//main body

        let svg = eccanvas
        .append('svg')
        .attr('width', parseFloat(ShapesData.hmipage.width))
        .attr('height', parseFloat(ShapesData.hmipage.height));

        ShapesData.hmipage.component_instances.map((obj,i) =>  {
          
    svg.append('rect')
      .attr('x', parseFloat(obj.x1))
      .attr('y',parseFloat(obj.y1))
      .attr('width', parseFloat(obj.x2))
      .attr('height',parseFloat(obj.y2))
      .attr('fill',"white")
      .attr('stroke',"10")


      obj.shape.filter(x=>x).map((shapeObject)=>{
        switch(shapeObject.type)
        {
            case "Rectangle":
                svg.append('rect')
      .attr('x', parseFloat(shapeObject.rectangle.x1)+parseFloat(obj.x1))
      .attr('y', parseFloat(shapeObject.rectangle.y1)+parseFloat(obj.y1))
      .attr('width', parseFloat(shapeObject.rectangle.x2))
      .attr('height', parseFloat(shapeObject.rectangle.y2))
      .attr('fill', shapeObject.fill.fill)
      .attr('stroke', parseFloat(shapeObject.line.line_width))
        break;
        }
    })

        }
        

        );
        
       
//         let size = 500;
//    let svg = eccanvas
//                .append('svg')
//                .attr('width', size)
//                .attr('height', size);


//                let rect_width = 95;
//    svg.selectAll('rect')
//       .data(this.dataset)
//       .enter()
//       .append('rect')
//       .attr('x', (d, i) => 5 + i*(rect_width + 5))
//       .attr('y', d => size- d)
//       .attr('width', rect_width)
//       .attr('height', d => d)
//       .attr('fill', 'teal');

    }
    
    getShapeObject(shapeObject,parentObj)
    {
        var obj="";

        switch(shapeObject.type)
        {
            case "Rectangle":
                obj.append('rect')
      .attr('x', parseFloat(shapeObject.rectangle.x1)+parseFloat(parentObj.x1))
      .attr('y', parseFloat(shapeObject.rectangle.y1)+parseFloat(parentObj.y1))
      .attr('width', parseFloat(shapeObject.rectangle.x2))
      .attr('height', parseFloat(shapeObject.rectangle.y2))
      .attr('fill', shapeObject.fill.fill)
      .attr('stroke', parseFloat(shapeObject.line.line_width));
                break;
        }


    }

    render(){

        return(
        // <svg id="ecscadaCanvas" viewBox="0 0 100 50" style={{
        //     border: "2px solid gold"
        //   }} />
        <div id="ecscadaCavas"></div>
          )
    }
  }
      
  export default BarChart;