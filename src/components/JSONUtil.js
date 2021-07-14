import { image } from "d3-fetch";

export function ShapeObjects(shapesData) {

  const { project } = shapesData;
  if (project !== undefined) {
    shapesData = project;
  }
  // const hmipage =
  //   shapesData.hmipage === undefined ? shapesData : shapesData.hmipage;

    var hmipage = [] ;
  
    if(shapesData.hmipage != undefined)
    {
      hmipage = shapesData.hmipage
    }
    else if(shapesData.hmipagetemplate != undefined)
    {
      hmipage = shapesData.hmipagetemplate
    }else if(shapesData.component != undefined)
    {
      hmipage = shapesData.hmipagetemplate
    }
    else{
      hmipage = shapesData;
    }


  const { shapes, component_instances, labels ,images ,groups} = hmipage; // Destructuring
  // console.log(component_instances);

  let emptyCompObj = {
    uuid: "{4c64b6e1-bb25-442a-abf7-6fa6c5694ff5}",
    zIndex: "0",
    objectNumber: "0",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "0",
    objectId: "",
    shape: [],
    description: [],
  };

  let shapeComponetsList = [];



  //------ Shapes--------------------------------------------------------------------------------------------
  if (shapes !== undefined) {
    if (Array.isArray(shapes)) {
      shapes.map((obj, i) => emptyCompObj.shape.push(obj));
      emptyCompObj.shape.sort((a, b) =>
        parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
      );
      shapeComponetsList.push(emptyCompObj);
    } else if (shapes.shape !== undefined) {
      if(Array.isArray(shapes.shape)){
        shapes.shape.map((obj, i) => emptyCompObj.shape.push(obj));
        emptyCompObj.shape.sort((a, b) =>
          parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
        );
        shapeComponetsList.push(emptyCompObj);
      }
      else{
        emptyCompObj.shape.push(shapes.shape);
        shapeComponetsList.push(emptyCompObj);
      }
      // console.log("empty obj ");
    }    
    // console.log("After Adding Shapes--???????????????????????????")
    // console.log(shapeComponetsList)
  }




  //    //groups------------------------------------------------------------------------------------------------------------
  //    if (groups !== undefined) {

  //     // console.log("Images Dtaa---????????????????????????????")
  //     // console.log(groups);
  //     // shapeComponetsList.push(groups);
  
  //    // if we have only groups
  //   if (Array.isArray(groups)) {
  //     groups.map((obj, i) => emptyCompObj.shape.push(obj)
  //     );
  //     // emptyCompObj.shape.sort((a, b) =>
  //     //   parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
  //     // );
  //     shapeComponetsList.push(emptyCompObj);
  
  //   } else if (groups.group !== undefined) {
  //     if(Array.isArray(groups.group)){
  //       groups.group.map((obj, i) => emptyCompObj.shape.push(obj));
  //       // emptyCompObj.shape.sort((a, b) =>
  //       //   parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
  //       // );
  //       shapeComponetsList.push(emptyCompObj);
  //     }
  //     else{
  //       emptyCompObj.shape.push(groups.group);
  //       shapeComponetsList.push(emptyCompObj);
  //     }
  //     console.log("empty obj ");
  //   }else if (groups.group.grup !== undefined) {
  //     if(Array.isArray(groups.group.group)){
  //       groups.group.group.map((obj, i) => emptyCompObj.shape.push(obj));
  //       // emptyCompObj.shape.sort((a, b) =>
  //       //   parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
  //       // );
  //       shapeComponetsList.push(emptyCompObj);
  //     }
  //     else{
  //       emptyCompObj.shape.push(groups.group.group);
  //       shapeComponetsList.push(emptyCompObj);
  //     }
  //     console.log("empty obj ");
  //   }
  //   console.log("After Groups Dtaa---????????????????????????????")
  //   console.log(shapeComponetsList);
  // }
  
  

  //--------component instances-----------------------------------------------------------------------------------------------------
  if (component_instances !== undefined) {
    if (Array.isArray(component_instances))
     {
     
      component_instances.map((obj, i) => {
        if (obj.group === undefined) {
          obj.shape.sort((a, b) =>
            parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
          );
          shapeComponetsList.push(obj);
        } else {
          obj.group.map((x) => {
            x.shape.sort((a, b) =>
              parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
            );
            shapeComponetsList.push(x);
          });
        }
      });
    } 
    else if(Array.isArray(component_instances.componentInstance)){
      let tempAry = component_instances.componentInstance.map(obj => obj)
      tempAry.map((x) => {
   if(Array.isArray(x)){
    console.log("xxxxxxxxxxxxx")
    // console.log(x)
       x.shape.sort((a, b) =>
         parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
       );
   }
      shapeComponetsList.push(x);
      }      
    );
     
    }
    else if (component_instances.componentInstance !== undefined) {
      //declaring group variable if we get composite instances have <Group> node under compositeInstance
      const { group } = component_instances.componentInstance;
      console.log("group")
      console.log("labels-text")
      if (group !== undefined) {
        group.shape.sort((a, b) =>
          parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
        );
        console.log("labels-text")

        shapeComponetsList.push(group);
      } else  {         
       let singleshapearray = []; 
       if(Array.isArray(component_instances.componentInstance.shape))   //if composite instance contains mul 
       {
        component_instances.componentInstance.shape.map((obj, i) => singleshapearray.push(obj));
        //sorting values based on z_index
        singleshapearray.sort((a, b) =>
          parseInt(a.z_index) > parseInt(b.z_index) ? 1 : -1
        );

       }else{  //if composite instance contains only one object 
        singleshapearray.push(component_instances.componentInstance.shape)
       }
       //assigning singleshapearray to shape of composite instance
       component_instances.componentInstance.shape=singleshapearray
       //pushing the shape object values to shapeComponentsList array
       shapeComponetsList.push(component_instances.componentInstance);
      }
      //
    } else {
      console.log("else");
    }
    // console.log("After Adding Component_Instances--???????????????????????????")
    // console.log(shapeComponetsList)
  }
 

    
if(groups != undefined)
{
  // console.log("Images Dtaa---????????????????????????????")
  // console.log(groups);

  shapeComponetsList.push(groups);
}


  //------Labels----------------------------------------------------------------------------------------------------------------
  if (labels !== undefined) {
    let singleshapearray = []; 
    // if(Array.isArray(labels))   //labelcontains mul 
    // {
    //   console.log("???????????????????????????????????????????????")
    //   console.log("Entering into if Statement ")
    //   console.log(labels)
    //  labels.text.map((obj, i) => singleshapearray.push(obj));
    //  console.log(singleshapearray)

    // //  singleshapearray.sort((a, b) =>
    // //    parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
    // //  );

    // }else{  //if label contains only one object 
    //  // console.log(labels)
    //  console.log("???????????????????????????????????????????????")
    //  console.log("Entering into else Statement ")
    //  console.log(labels)
    //  console.log(singleshapearray)
    //   // singleshapearray.push(labels.text)
    //   labels.text.map((obj, i) => singleshapearray.push(obj));
    //   console.log(singleshapearray)
    // }


    // if(labels.length  ==  undefined)
    // {
    //   console.log("Entered If --labels Length is Zero")

    // }else{
    //   console.log("Entered else - labels length is " +labels.length)

    // }

    // console.log("Label Dtaa---????????????????????????????")
    // console.log(labels);
    
    shapeComponetsList.push({"labels":labels});
  
}
  else {         
    let singleshapearray = []; 
    if(Array.isArray(labels))   //labelcontains mul 
    {
      // console.log(labels)
     labels.text.map((obj, i) => singleshapearray.push(obj));
     singleshapearray.sort((a, b) =>
       parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
     );

    }else{  //if label contains only one object 
      // console.log(labels)
      singleshapearray.push(labels) 
    }
    
    // labels.text=singleshapearray
    shapeComponetsList.push(labels);
  
   }





   
  //Images------------------------------------------------------------------------------------------------------
  if(images !==undefined){

    // console.log("Images Dtaa---????????????????????????????")
    // console.log(images);

    shapeComponetsList.push(images);
  }
  return shapeComponetsList;

}


export function parseShapeObject(shapeObj) {
  for (var i in shapeObj) {
    if (!shapeObj[i] && typeof shapeObj[i] == "object") {
      var temp = parseShapeAttributes(shapeObj[i]);
      shapeObj[i] = { ...temp };
      parseShapeObject(shapeObj[i]);
    } else {
    }
  }
  return shapeObj;
}

export function parseShapeAttributes(shapeObj) {
  const { _attributes } = shapeObj;
  return _attributes;
}



export function LableComponets(labels) {
  let lableComponetsList = [];

  if (labels !== undefined) {
    if (Array.isArray(labels)) {
      labels.map((obj, i) => lableComponetsList.push(obj));
     
      //positioning 
      labels.sort((a, b) =>
      parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
    );
    } else if (labels.text !== undefined) {
      console.log("labels-text")
      lableComponetsList.push(labels.text);      
    }

    console.log(labels.text)
    console.log("obj:")
    console.log(labels.text.box.z_index)
  }
  return lableComponetsList;
}

export function getStateObject(shapeObj) {
  const shapes = ShapeObjects(shapeObj)
  const { project } = shapeObj;
  if (project !== undefined) {
    shapeObj = project;
  }
  const hmipage =
  shapeObj.hmipage === undefined ? shapeObj : shapeObj.hmipage;

  const { labels } = hmipage; // Destructuring
  
  let shapeObjects = {
    shapes: shapes,
   lables: LableComponets(labels),

  };
  return shapeObjects;
}