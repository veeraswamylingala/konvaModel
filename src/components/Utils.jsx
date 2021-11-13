

var ip = "192.168.0.45";

export const getTagValueApi ="http://"+ip+"/ScadaClient/api/ExpressionEval/GetExprVal";

//Function-1
//Hexa(#fafafafa) to RGBA Convertion-----------------------------------
export function hextoRGBA(color) {
  // //console.log(color)

  if (color.length == 9) {
    var r;
    var g;
    var b;
    var a;

    ////console.log(color)
    var hex = color;
    hex = hex.replace('#', '');

    r = hex.substring(2, 4);
    g = hex.substring(4, 6);
    b = hex.substring(6, 8);
    a = hex.substring(0, 2);

    r = parseInt(r, 16);
    g = parseInt(g, 16);
    b = parseInt(b, 16);
    a = parseInt(a, 16) / 255;

    //   //console.log( "rgba("+r+","+g+","+b+","+a+")");

    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  } else {
    return color;
  }
}

//Function-1
//AndroidColor(10Digit) to RGBA Convertion-----------------------------------
export function androidToRgba(color) {
  const colorArray = []
  for (let i = 0; i < 4; i++) {
    colorArray.push(color % 256)
    color >>>= 8
  }
  const alpha = colorArray.pop() / 255
  return `rgba(${colorArray.reverse()},${alpha})`
}


//Function-1
//Line Styles ----------------------------------------
export function lineStyle(value) {
  switch (parseInt(value)) {
    //-0---None
    case 0:
      return [0, 5];
    //-1--Solid
    case 1:
      return [10, 0];
    //-2--Dash
    case 2:
      return [25, 5];
    //-3--Dot
    case 3:
      return [10, 5];
    //-4--DashDot
    case 4:
      return [25, 5, 10, 5];
    //-5-DashDotDot
    case 5:
      return [25, 5, 10, 5, 10, 5];

    default: return [10, 0];
  }

}


    //gradient-----------------------------------------------
 // -0---GRADIENT_LEFT_TO_RIGHT-------------------------------
 //startPoint:   {x1:x2/2 - x2/4 , y1:y2}
 //endPoint:     {x2:x2 - x4/4,y2:y2 }

 //-1--GRADIENT_RIGHT_TO_LEFT----------------------------------
 //startPoint:  {x1: x2 - x2/4   , y1:y2   }
 //endPoint:    {x2: x2/2 - x2/4 , y2:    y2  }

 //--2---GRADIENT_TOP_TO_BOTTOM -----------------------------
 //startPoint:  {x2: x2 , y2:y2/2 - y2/4  } 
 //endPoint:   {x1: x2    , y1:y2 - y2/4  }

  //--3---GRADIENT_BOTTOM_TO_TOP  -----------------------------
 //startPoint:  {x2: x2 , y2:y2 - y2/4  }
 //endPoint:    {x1: x2    , y1:y2/2 - y2/4  }

 //--4--GRADIENT_HORIZONTAL_TO_MIDDLE -------------------------
  //startPoint:  {x1: x2    , y1:y2/2 }
 //endPoint:    {x2: x2 , y2:y2/2 + 1  }

 //---
 //---5---GRADIENT_HORIZONTAL_FROM_MIDDLE ---------------------
   //startPoint:  {x1: x2    , y1:y2/2 }
 //endPoint:    {x2: x2 , y2:y2 - 1  }

 //--6---GRADIENT_VERTICAL_TO_MIDDLE----------------------------
 //startPoint:  {x1: x2/2   , y1:y2 }
 //endPoint:    {x2: x2/2 -1 , y2:y2 }

 //---
 //--7--GRADIENT_VERTICAL_FROM_MIDDLE----------------------------
 //startPoint:  {x1: x2/2   , y1:y2 }
 //endPoint:    {x2: x2 -1 , y2:y2 }


 //Rectangle Gradient StartPoints-------------------------------------------
 export function gradientStartPoints(shape,x1,x2,y1,y2) {
  ////console.log(shape.gradient.gradient_direction)

  switch (parseInt(shape.gradient.gradient_direction)) {
    //-0---GRADIENT_LEFT_TO_RIGHT     
    case 0:
      return { x: x2 / 2 - x2 / 4, y: y2 };
    //-1--GRADIENT_RIGHT_TO_LEFT
    case 1:
      return { x: x2 - x2 / 4, y: y2 };
    //-2--GRADIENT_TOP_TO_BOTTOM
    case 2:
      return { x: x2, y: y2 / 2 - y2 / 4 };
    //-3--GRADIENT_BOTTOM_TO_TOP 
    case 3:
      return { x: x2, y: y2 - y2 / 4 };
    //-4--GRADIENT_HORIZONTAL_TO_MIDDLE 
    case 4:
      return { x: x2 / 2 - x2 / 3, y: y2 };
    //-5---GRADIENT_HORIZONTAL_FROM_MIDDLE 
    case 5:
      return { x: x2 / 2 - x2 / 3, y: y2 };
    //-6--GRADIENT_HORIZONTAL_TO_MIDDLE 
    case 6:
      return   { x: x2, y: y2 / 2 - y2 / 3 };
    // //--7--GRADIENT_VERTICAL_FROM_MIDDLE
    case 7:
      return   { x: x2, y: y2 / 2 - y2 / 3 };
    default: return { x: 0, y: 0 };
  }
}

//Rectangle Gradient End POints-------------------------------------
export function gradientEndPoints(shape,x1,x2,y1,y2) {
  switch (parseInt(shape.gradient.gradient_direction)) {
    //-0---GRADIENT_LEFT_TO_RIGHT     
    case 0:
      return { x: x2 - x2 / 4, y: y2 };
    //-1--GRADIENT_RIGHT_TO_LEFT
    case 1:
      return { x: x2 / 2 - x2 / 4, y: y2 };
    //-2--GRADIENT_TOP_TO_BOTTOM
    case 2:
      return { x: x2, y: y2 - y2 / 4 };
    //-3--GRADIENT_BOTTOM_TO_TOP 
    case 3:
      return { x: x2, y: y2 / 2 - y2 / 4 };
    //-4--GRADIENT_HORIZONTAL_TO_MIDDLE 
    case 4:
      return { x: x2 - x2 / 8, y: y2 };
    //-5---GRADIENT_HORIZONTAL_FROM_MIDDLE
    case 5:
      return { x: x2 - x2 / 8, y: y2 };
    //-6--GRADIENT_VERTICAL_TO_MIDDLE 
    case 6:
      return { x: x2, y: y2 - y2 / 10 };
    // //--7--GRADIENT_VERTICAL_FROM_MIDDLE
    case 7:
      return { x: x2, y: y2 - y2 / 10 };
    default: return { x: 0, y: 0 };
  }

}












//  fillLinearGradientStartPoint={shape.gradient != undefined ? startPoints() : {}}
//  fillLinearGradientEndPoint={shape.gradient != undefined ? endPoint() : {}}
//  fillLinearGradientColorStops={shape.gradient === undefined ? [] :
//    [0, shape.dynamic_fill != undefined ? dynamcifill ?? "black" : shape.fill != undefined ? hextoRGBA(shape.fill.fill) : "grey" ?? "black",
//    0.5,shape.gradient != undefined ? hextoRGBA(shape?.gradient?.gradient_color) : "grey" ?? "black"

//    , 1,shape.dynamic_fill != undefined ? dynamcifill ?? "black" : shape.fill != undefined ? hextoRGBA(shape.fill.fill) : "grey" ?? "black"]}









