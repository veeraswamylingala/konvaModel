import React, { Component } from "react";
import ShapesData from "../data/shapesData";
import { ShapeComponets, LableComponets } from "./APIUtil";

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.App = React.createRef();
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(event);
    const file = this.App.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = (evt) => {
      const readerData = evt.target.result;
      const parser = new DOMParser();
      const xml = parser.parseFromString(readerData, "text/xml");
      this.ShapesData = this.xmlToJson(xml.documentElement);
      console.log(this.ShapesData);
    };
  }

  xmlToJson(xml) {
    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) {
      // element
      // do attributes
      if (xml.attributes.length > 0) {
        obj[""] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj[attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) {
      // text
      obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof obj[nodeName] == "undefined") {
          obj[nodeName] = this.xmlToJson(item);
        } else {
          if (typeof obj[nodeName].push == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(this.xmlToJson(item));
        }
      }
    }
    return obj;
  }
  render() {
    return (
      <div
        className="App"
        width={200}
        height={300}
        style={{ width: "800px", margin: "auto" }}
      >
        <p className="App-intro">
          Please Upload your XML file at the button below
        </p>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <label>
            Upload file:
            <input
              type="file"
              ref={(input) => {
                this.App = input;
              }}
            />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default FileUpload;
