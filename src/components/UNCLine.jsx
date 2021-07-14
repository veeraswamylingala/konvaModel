import { Line } from "react-konva";
import { getPloyPoints } from "./CanvasUtils.js";

const UNCLine = (shapeProps) => {
  const { shape, parentX, parentY } = shapeProps;

  
  return (
    <Line
      key={"Line_" + shape.object.object_id + shape.object.object_number}
      id={"Line_" + Math.random()}
      points={getPloyPoints(shape, parentX, parentY)}
      fill={shape.fill == undefined ? "" : shape.fill.fill == "#5b5b5b" ? "#c0c0c0"  :shape.fill.fill}
      stroke={shape.line.color}
      strokeWidth={parseInt(shape.line.line_width)}
       
    ></Line>
  );
};

export default UNCLine;
