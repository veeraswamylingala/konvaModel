import { Text } from "react-konva";
import { getPloyPoints } from "./JSONUtil.js";

const UNCText = (shapeProps) => {
  const {text} = shapeProps;
  console.log("-------Entered Text---------------------------------------------------------------------")
  console.log(text)



  return (
    <Text fontFamily={text.font_family} 
    fontSize={text.font_size}
    fill={text.color}
    text={text.static_text}
    x=  {parseFloat(text.box.axis_offset_left)+((parseFloat(text.box.left))/2)}
    y= {parseFloat(text.box.axis_offset_top)+((parseFloat(text.box.top))/2)}
    ref={(node) => {
        this.text = node;}}
/>
  );
};

export default UNCText;
