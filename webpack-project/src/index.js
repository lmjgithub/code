// import 'core-js/stable'
import "regenerator-runtime/runtime";
import react from "react";
import _ from "lodash";
import comp from "./components/component";

var a = 1;

setTimeout(() => {
  const p = import("./async.js");

  p.then(log => {
    log.default();
  });
}, 5000);
