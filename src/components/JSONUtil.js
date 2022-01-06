import { xyz } from "color-convert";
import { groupSort } from "d3";
import { image } from "d3-fetch";

export function ShapeObjects(shapesData) {

  const { project } = shapesData;
  //console.log(shapesData)
  if (project !== undefined) {
    shapesData = project;
    console.log(project)
  }
  //console.log(project)
  // const hmipage =
  //   shapesData.hmipage === undefined ? shapesData : shapesData.hmipage;

  var hmipage = [];

  if (shapesData.hmipage != undefined) {
    hmipage = shapesData.hmipage
  }
  else if (shapesData.hmipagetemplate != undefined) {
    hmipage = shapesData.hmipagetemplate
  } else if (shapesData.component != undefined) {
    hmipage = shapesData.hmipagetemplate
  }
  else {
    hmipage = shapesData;
  }

  console.log(hmipage)
  const { shapes, component_instances, labels, images, groups } = hmipage; // Destructuring
  // //console.log(component_instances);

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
  //console.log(shapes)
  if (shapes !== undefined) {
    if (Array.isArray(shapes)) {

      shapes.map((obj, i) =>
        //console.log(obj),
        emptyCompObj.shape.push(obj));
      emptyCompObj.shape.sort((a, b) =>
        parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
      );
      shapeComponetsList.push(emptyCompObj);
      console.log(shapeComponetsList)
    } else if (shapes.shape !== undefined) {
      if (Array.isArray(shapes.shape)) {
        shapes.shape.map((obj, i) => emptyCompObj.shape.push(obj));
        emptyCompObj.shape.sort((a, b) =>
          parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
        );
        shapeComponetsList.push(emptyCompObj);
        console.log(shapeComponetsList)
      }
      else {
        emptyCompObj.shape.push(shapes.shape);
        shapeComponetsList.push(emptyCompObj);
        console.log(shapeComponetsList)
      }
      // //console.log("empty obj ");
    }
    // //console.log("After Adding Shapes--???????????????????????????")
    // //console.log(shapeComponetsList)
  }




  //    //groups------------------------------------------------------------------------------------------------------------
  //    if (groups !== undefined) {

  //     // //console.log("Images Dtaa---????????????????????????????")
  //     // //console.log(groups);
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
  //     //console.log("empty obj ");
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
  //     //console.log("empty obj ");
  //   }
  //   //console.log("After Groups Dtaa---????????????????????????????")
  //   //console.log(shapeComponetsList);
  // }



  //--------component instances-----------------------------------------------------------------------------------------------------
  if (component_instances !== undefined) {
    // console.log("Group")
    renderComponentInstances(component_instances)
  }

  //Render ComponentInstances Function-------------------
  function renderComponentInstances(component_instances) {
    if (Array.isArray(component_instances)) {
      console.log("1")
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
    else if (Array.isArray(component_instances.componentInstance)) {
      //  console.log(component_instances.componentInstance)

      component_instances.componentInstance.sort((a, b) =>
        parseInt(a.zIndex) > parseInt(b.zIndex) ? 1 : -1);

      let tempAry = component_instances.componentInstance.map(obj => obj)
      tempAry.map((x) => {

        const { group, shape, text } = x;
        //If we Have Component.Group-----------
        if (group !== undefined) {
          //Multiple Groups -------
          if (Array.isArray(group)) {
            group.sort((a, b) =>
              parseInt(a.zIndex) > parseInt(b.zIndex) ? 1 : -1
            );

            group.map((obj) => {
              //UncCanvas Groups will handle this
              shapeComponetsList.push(obj);
            })
          } else {
            //Groups.shapes---
            if (group.shape != undefined) {
              if (Array.isArray(group.shape)) {
                group.shape.sort((a, b) =>
                  parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
                );
                shapeComponetsList.push(group);
              } else {
                shapeComponetsList.push(group);
              }
            }
            //Groups--text-----------
            if (group.text != undefined) {
              if (Array.isArray(group.text)) {
                group.text.sort((a, b) =>
                  parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
                );
              }
              shapeComponetsList.push(group.text);
            }
          }

        }

        //If we Have Component.shape-----------
        if (shape != undefined) {
          if (Array.isArray(shape)) {
            shape.sort((a, b) =>
              parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
            );
            shapeComponetsList.push(x);
          } else {
            shapeComponetsList.push(x);
          }
        }

        //If we Have Component.text-----------
        if (text != undefined) {
          if (Array.isArray(text)) {

            text.sort((a, b) =>
              parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
            );
          }
          shapeComponetsList.push(x);
        }
      });
    }
    else if (component_instances.componentInstance !== undefined) {
      console.log("3")
      //declaring group variable if we get composite instances have <Group> node under compositeInstance
      const { group, shape, text } = component_instances.componentInstance;
      //console.log("group in JSONUTILS")
      console.log(group)

      //If we Have Component.Group-----------
      if (group !== undefined) {
        //Multiple Groups -------
        if (Array.isArray(group)) {
          group.sort((a, b) =>
            parseInt(a.zIndex) > parseInt(b.zIndex) ? 1 : -1
          );

          group.map((obj) => {
            //UncCanvas Groups will handle this
            shapeComponetsList.push(obj);
          })
        }
        //Single Group-----------
        else {
          //Groups.shapes---
          if (group.shape != undefined) {
            if (Array.isArray(group.shape)) {
              group.shape.sort((a, b) =>
                parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
              );
              shapeComponetsList.push(group);
            } else {
              shapeComponetsList.push(group);
            }
          }
          //Groups--text-----------
          if (group.text != undefined) {
            if (Array.isArray(group.text)) {
              group.text.sort((a, b) =>
                parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
              );
            }
            shapeComponetsList.push(group.text);
          }
        }
      }

      //If we Have Component.shape-----------
      if (shape != undefined) {
        if (Array.isArray(shape)) {
          shape.sort((a, b) =>
            parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
          );
          shapeComponetsList.push(component_instances.componentInstance);
        } else {
          shapeComponetsList.push(component_instances.componentInstance);
        }
      }

      //If we Have Component.text-----------
      if (text != undefined) {
        if (Array.isArray(text)) {

          text.sort((a, b) =>
            parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
          );
        }
        shapeComponetsList.push(component_instances.componentInstance);
      }
    }
  }


  //--------Group-----------------------------------------------------------------------------------------------------
  if (groups !== undefined) {
    // console.log("Group")
    rendergroup(groups)
  }

  //Rnder Group Function-------------
  function rendergroup(value) {
    var groups = value;
    //If we have Mutiple Groups------ <Groups> ---------
    if (Array.isArray(groups)) {
      console.log("1")
      groups.map((obj, i) => {
        //  //console.log(obj)
        //If <Groups> has Mutiple Group------ <Groups> ---------
        if (Array.isArray(obj.group)) {
          obj.group.map((x) => {
            x.shape.sort((a, b) =>
              parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
            );
            shapeComponetsList.push(x);
          });

        }  //If <Groups> has single Group------ <Groups> ---------
        else {
          //   obj.shape.sort((a, b) =>
          //   parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
          // );
          shapeComponetsList.push(obj);
        }
      });
    }//if Groups has multiple group iniside  -----------------------------
    else if (Array.isArray(groups.group)) {
      console.log("2")
      //Group Level Z-Index Sorting-------
      groups.group.sort((a, b) =>
        parseInt(a.zIndex) > parseInt(b.zIndex) ? 1 : -1
      );
      let tempAry = groups.group.map(obj => obj)
      tempAry.map((x) => {
        
     
      //If groups has  Shapes -------------------------------------------------------------
      if (x.shape !== undefined) {
        //console.log("1.2")
        let singleshapearray = [];

        if (Array.isArray(x.shape))
        //if composite instance contains multple shapes 
        {
          x.shape.map((obj, i) => singleshapearray.push(obj));
          //sorting values based on z_index
          singleshapearray.sort((a, b) =>
            parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
          );
  
          shapeComponetsList.push(x);
        } else {
          console.log("Values")
          //if composite instance contains only one object 
          shapeComponetsList.push(x)
        }
      }
      //If groups has group ----------------------------------------------------------
      if (x.group !== undefined) {
          console.log("1.1")
        if (Array.isArray(x.group)) {
          x.group.sort((a, b) =>
            parseInt(a.zIndex) > parseInt(b.zIndex) ? 1 : -1
          );
          x.group.map((groupObj) => {
            shapeComponetsList.push(groupObj);
          })
        } else {
        shapeComponetsList.push(x.group);
        }
      }
          //if group has Text---------------------------------------------------------
          if (x.text !== undefined) {
            // console.log("text")
            // console.log(groups.group)
            var { text } = x;
            console.log(text);
            if (Array.isArray(text)) {
              console.log("1")
              text.sort((a, b) =>
                parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
              );
              shapeComponetsList.push(x)
            } else {
              console.log("2")
            shapeComponetsList.push(x.group)
           //   console.log(shapeComponetsList)
            }
          }
          
          //If groups has Component Instance -----------------------------------------
      if (x.componentInstance != undefined) {
        //if Group has Multiple Component Instance---------------------
        if (Array.isArray(x.componentInstance)) {
          console.log("Array")
         // console.log(groups.group.componentInstance)
          //Map-------------------------------------
          x.componentInstance.map((ci, i) => {
            var { group, shape, text } = ci;
            //group
            if (group != undefined) {
              if (Array.isArray(group)) {
                group.sort((a, b) =>
                  parseInt(a.zIndex) > parseInt(b.zIndex) ? 1 : -1
                );
                group.map((groupObj) => {
                  shapeComponetsList.push(groupObj);
                })
              } else {
                shapeComponetsList.push(group);
              }
            }
            //If we Have Component.shape-----------
            if (shape != undefined) {
              if (Array.isArray(shape)) {
                shape.sort((a, b) =>
                  parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
                );
                shapeComponetsList.push(ci);
              } else {
                shapeComponetsList.push(ci);
              }
            }
            //If we Have Component.text-----------
            if (text != undefined) {
              if (Array.isArray(text)) {

                text.sort((a, b) =>
                  parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
                );
              }
              shapeComponetsList.push(ci);
            }


          });
        }
        //if Group has Single Component Instance--------------------- 
        else {
          console.log("single")
       //   console.log(groups.group)

          var { group, shape, text } = x.componentInstance;
          //group
          if (group != undefined) {

            if (Array.isArray(group)) {
              group.sort((a, b) =>
                parseInt(a.zIndex) > parseInt(b.zIndex) ? 1 : -1
              );
              group.map((groupObj) => {
                shapeComponetsList.push(groupObj);
              })
            } else {
              shapeComponetsList.push(group);
            }
          }

          //If we Have Component.shape-----------
          if (shape != undefined) {
            if (Array.isArray(shape)) {
              shape.sort((a, b) =>
                parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
              );
              shapeComponetsList.push(x.componentInstance);
            } else {
              shapeComponetsList.push(x.componentInstance);
            }
          }
          //If we Have Component.text-----------
          if (text != undefined) {
            if (Array.isArray(text)) {

              text.sort((a, b) =>
                parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
              );
            }
            shapeComponetsList.push(x.componentInstance);
          }
        }
      }





      }
      );
    }
    //Single Group--------------------------------
    else if (groups.group !== undefined) {
      console.log("3")

      //If groups has Component Instance -----------------------------------------
      if (groups.group.componentInstance != undefined) {

        //if Group has Multiple Component Instance---------------------
        if (Array.isArray(groups.group.componentInstance)) {
          console.log("Array")
          console.log(groups.group.componentInstance)
          //Map-------------------------------------
          groups.group.componentInstance.map((ci, i) => {
            var { group, shape, text } = ci;
            //group
            if (group != undefined) {
              if (Array.isArray(group)) {
                group.sort((a, b) =>
                  parseInt(a.zIndex) > parseInt(b.zIndex) ? 1 : -1
                );
                group.map((groupObj) => {
                  shapeComponetsList.push(groupObj);
                })
              } else {
                shapeComponetsList.push(group);
              }
            }

            //If we Have Component.shape-----------
            if (shape != undefined) {
              if (Array.isArray(shape)) {
                shape.sort((a, b) =>
                  parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
                );
                shapeComponetsList.push(ci);
              } else {
                shapeComponetsList.push(ci);
              }
            }
            //If we Have Component.text-----------
            if (text != undefined) {
              if (Array.isArray(text)) {

                text.sort((a, b) =>
                  parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
                );
              }
              shapeComponetsList.push(ci);
            }


          });
        }
        //if Group has Single Component Instance--------------------- 
        else {
          console.log("single")
          console.log(groups.group)

          var { group, shape, text } = groups.group.componentInstance;
          //group
          if (group != undefined) {

            if (Array.isArray(group)) {
              group.sort((a, b) =>
                parseInt(a.zIndex) > parseInt(b.zIndex) ? 1 : -1
              );
              group.map((groupObj) => {
                shapeComponetsList.push(groupObj);
              })
            } else {
              shapeComponetsList.push(group);
            }
          }

          //If we Have Component.shape-----------
          if (shape != undefined) {
            if (Array.isArray(shape)) {
              shape.sort((a, b) =>
                parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
              );
              shapeComponetsList.push(groups.group.componentInstance);
            } else {
              shapeComponetsList.push(groups.group.componentInstance);
            }
          }
          //If we Have Component.text-----------
          if (text != undefined) {
            if (Array.isArray(text)) {

              text.sort((a, b) =>
                parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
              );
            }
            shapeComponetsList.push(groups.group.componentInstance);
          }
        }
      }

      //if group has Text---------------------------------------------------------
      if (groups.group.text !== undefined) {
        console.log("text")
        console.log(groups.group)
        var { text } = groups.group;
        console.log(text);
        if (Array.isArray(text)) {
          console.log("1")
          text.sort((a, b) =>
            parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
          );
          shapeComponetsList.push(groups.group)
        } else {
          console.log("2")
          shapeComponetsList.push(groups.group)
          console.log(shapeComponetsList)
        }
      }

      //If groups has group ----------------------------------------------------------
      if (groups.group.group !== undefined) {
        console.log("1.1")
        if (Array.isArray(groups.group.group)) {
          groups.group.group.sort((a, b) =>
            parseInt(a.zIndex) > parseInt(b.zIndex) ? 1 : -1
          );
          groups.group.group.map((groupObj) => {
            shapeComponetsList.push(groupObj);
          })
        } else {
          shapeComponetsList.push(groups.group.group);
        }
        // group.shape.sort((a, b) =>
        //   parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
        // );
        //pushing the group object values to shapeComponentsList array-if component instances.component_Instance has single group

      }

      //If groups has  Shapes -------------------------------------------------------------
      if (groups.group.shape !== undefined) {
        console.log("1.2")
        let singleshapearray = [];
        if (Array.isArray(groups.group.shape))
        //if composite instance contains multple shapes 
        {
          groups.group.shape.map((obj, i) => singleshapearray.push(obj));
          //sorting values based on z_index
          singleshapearray.sort((a, b) =>
            parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
          );
        } else {
          //if composite instance contains only one object 
          singleshapearray.push(groups.group.shape)
        }

        //assigning singleshapearray to shape of composite instance
        groups.group.shape = singleshapearray
        console.log(groups.group)
        var ele = {};
        ele = groups.group;
        //to get parentx and parenty values we are removing group from shapes section
        //groups is already added in above condition
        //remove groups here if any
        // ele = ele.pull("group")
        if (ele["group"] != undefined) {
          //deleting group key from shapescondition
          delete ele["group"];
        }
        //pushing the shape object values to shapeComponentsList array
        shapeComponetsList.push(groups.group);
      }
      //
    } 

  }




  //------Labels----------------------------------------------------------------------------------------------------------------
  if (labels !== undefined) {
    let singleshapearray = [];
    // if(Array.isArray(labels))   //labelcontains mul 
    // {
    //   //console.log("???????????????????????????????????????????????")
    //   //console.log("Entering into if Statement ")
    //   //console.log(labels)
    //  labels.text.map((obj, i) => singleshapearray.push(obj));
    //  //console.log(singleshapearray)

    // //  singleshapearray.sort((a, b) =>
    // //    parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
    // //  );

    // }else{  //if label contains only one object 
    //  // //console.log(labels)
    //  //console.log("???????????????????????????????????????????????")
    //  //console.log("Entering into else Statement ")
    //  //console.log(labels)
    //  //console.log(singleshapearray)
    //   // singleshapearray.push(labels.text)
    //   labels.text.map((obj, i) => singleshapearray.push(obj));
    //   //console.log(singleshapearray)
    // }


    // if(labels.length  ==  undefined)
    // {
    //   //console.log("Entered If --labels Length is Zero")

    // }else{
    //   //console.log("Entered else - labels length is " +labels.length)

    // }

    // //console.log("Label Dtaa---????????????????????????????")
    // //console.log(labels);

    shapeComponetsList.push({ "labels": labels });

  }
  else {
    let singleshapearray = [];
    if (Array.isArray(labels))   //labelcontains mul 
    {
      // //console.log(labels)
      labels.text.map((obj, i) => singleshapearray.push(obj));
      singleshapearray.sort((a, b) =>
        parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
      );

    } else {  //if label contains only one object 
      // //console.log(labels)
      singleshapearray.push(labels)
    }

    // labels.text=singleshapearray
    shapeComponetsList.push(labels);

  }







  //Images------------------------------------------------------------------------------------------------------
  if (images !== undefined) {

    // //console.log("Images Dtaa---????????????????????????????")
    // //console.log(images);
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
      //console.log("labels-text")
      lableComponetsList.push(labels.text);
    }

    //console.log(labels.text)
    //console.log("obj:")
    //console.log(labels.text.box.z_index)
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