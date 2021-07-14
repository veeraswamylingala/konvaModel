import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import BarChart from "./components/BarChart";
import Circle from "./components/Circle";
import SvgLayer from "./components/Layer";

import ShapesKonva from "./components/ShapsKonva";
import KonvaShaps from "./components/KonvaShape";
import UNCCanvas from "./components/UNCCanvas";
import FileUpload from "./components/FileUpload";
import Sidebar from "./components/Sidebar";

ReactDOM.render(
  <React.StrictMode>
   <App/>
 
    {/* <SvgLayer height="1000" width="600" >
      <Circle ></Circle>
    </SvgLayer> */}

    {/* <KonvaShaps/> */}
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
