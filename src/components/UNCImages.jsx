import { Stage, Layer, Image } from 'react-konva';
import { getPloyPoints } from "./JSONUtil.js";


const UNCImage = (shapeProps) => {
  const { image } = shapeProps;
  
  
  return (
       
     <Image
    x={200}
    y={300}
    
    height ={150}
    width = {150}

    ref={node => {
      this.imageNode = node;
    }

}
  />
  );
};

export default UNCImage;
