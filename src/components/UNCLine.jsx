import { Line } from "react-konva";
import { getLinePoints } from "./CanvasUtils.js";
import { hextoRGBA, lineStyle ,gradientStartPoints ,gradientEndPoints ,androidToRgba} from './Utils';


const UNCLine = (shapeProps) => {
  const { shape, parentX, parentY } = shapeProps;

  
  return (
  <Line
      key={"Line_" +  shape.object.object_number}
      id={"Line_" + shape.object.object_id}
      points={getLinePoints(shape, parentX, parentY)}
      fill={hextoRGBA(shape.line.color)}
      dashEnabled={true}
      dash={lineStyle(shape.line.style)}
      stroke={hextoRGBA(shape.line.color) ?? "grey"}
      strokeWidth={parseInt(shape.line.line_width) ?? 1}
      draggable={false}
      lineCap={"round"}
      lineJoin={"round"}
       
    ></Line>
  );
};

export default UNCLine;
