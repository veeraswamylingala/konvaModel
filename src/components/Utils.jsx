
export var intervalUpdate = 1000;
export var ip = "192.168.0.45";
//export const getTagValueApi ="http://"+ip+"/ScadaClient/api/ExpressionEval/GetExprVal";
export const getTagValueApi ="https://demo3412.herokuapp.com/tagExpr";
//export const getTagValueApi = "http://localhost:8080/tagExpr";

export const fileDirectory= "C:/ECWEBSERVER";

export var paramsList = [];

 export function addParam(map) {
  paramsList.push(map)
 }
 
 export function emptyParamList() {
  paramsList = [];
 }
//Function-1
//Hexa(#fafafafa) to RGBA Convertion-----------------------------------
export function hextoRGBA(color) {
 //   console.log(color)
  if(color != undefined)
  {
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
  }//AndroidColor(2325262421) to RGBA Convertion----------------------------------- 
  else if(color.length == 10){
    const colorArray = []
    for (let i = 0; i < 4; i++) {
      colorArray.push(color % 256)
      color >>>= 8
    }
    const alpha = colorArray.pop() / 255
    return `rgba(${colorArray.reverse()},${alpha})`

  } {
    return color;
  }
}else{
  return color;
}
  
}

//Function-1
//AndroidColor(2325262421) to RGBA Convertion-----------------------------------
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








//  fillLinearGradientStartPoint={shape.gradient != undefined ? startPoints() : {}}
//  fillLinearGradientEndPoint={shape.gradient != undefined ? endPoint() : {}}
//  fillLinearGradientColorStops={shape.gradient === undefined ? [] :
//    [0, shape.dynamic_fill != undefined ? dynamcifill ?? "black" : shape.fill != undefined ? hextoRGBA(shape.fill.fill) : "grey" ?? "black",
//    0.5,shape.gradient != undefined ? hextoRGBA(shape?.gradient?.gradient_color) : "grey" ?? "black"

//    , 1,shape.dynamic_fill != undefined ? dynamcifill ?? "black" : shape.fill != undefined ? hextoRGBA(shape.fill.fill) : "grey" ?? "black"]}









