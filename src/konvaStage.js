import React from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';
export default class ShapesKonva extends  Component{
    constructor(props) {
      super(props);
      this.state = {};
    }
    render() { 
        <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                </Layer>
      </Stage>
    }
}