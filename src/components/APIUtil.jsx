import ShapesData from "../data/shapesData";

const hmipage =
  ShapesData.hmipage === undefined ? ShapesData : ShapesData.hmipage;

const { shapes, component_instances, labels } = hmipage; // Destructuring

export function ShapeComponets() {
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

  //if we have only Shapes
  if (shapes !== undefined) {
    if (Array.isArray(shapes)) {
      shapes.map((obj, i) => emptyCompObj.shape.push(obj));

      emptyCompObj.shape.sort((a, b) =>
        parseInt(a.z_index) > parseInt(b.z_index) ? 1 : -1
      );
      shapeComponetsList.push(emptyCompObj);
    } else if (shapes.shape !== undefined) {
      emptyCompObj.shape.push(shapes.shape);
      shapeComponetsList.push(emptyCompObj);
    }
  }

  //component instances
  if (component_instances !== undefined) {
    if (Array.isArray(component_instances)) {
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
    } else if (component_instances.componentInstance !== undefined) {
      const { group } = component_instances.componentInstance;
      if (group !== undefined) {
        group.shape.sort((a, b) =>
          parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
        );
        shapeComponetsList.push(group);
      } else {
        component_instances.componentInstance.shape.sort((a, b) =>
          parseInt(a.box.z_index) > parseInt(b.box.z_index) ? 1 : -1
        );
        console.log(component_instances.componentInstance.shape);
        shapeComponetsList.push(component_instances.componentInstance);
      }
      //
    } else {
      console.log("else");
    }
  }

  return shapeComponetsList;
}

export function LableComponets() {
  let lableComponetsList = [];

  if (labels !== undefined) {
    if (Array.isArray(ShapesData.hmipage.labels)) {
      labels.map((obj, i) => lableComponetsList.push(obj));
    } else if (labels.text !== undefined) {
      lableComponetsList.push(labels.text);
    }
  }

  return lableComponetsList;
}
