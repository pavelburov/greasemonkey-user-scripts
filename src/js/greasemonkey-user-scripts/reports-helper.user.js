// ==UserScript==
// @name         reports helper
// @namespace    pavelburov
// @version      1.0.0
// @description  Helps to fill in reports (by pasting string with time spent and description)
// @author Pavel Burov <burovpavel@gmail.com>
// @match        https://reports.scand.by/addreportframe.php*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  console.log("reports helper");

  var iframe = document.querySelector("iframe[name=dataframe]");
  var descriptionTextarea;
  var hoursInput;

  iframe.onload = function() {
    descriptionTextarea =
        iframe.contentWindow.document.querySelector("textarea[name=adesc]");
    hoursInput =
        iframe.contentWindow.document.querySelector("input[name=ahours]");

    console.log(descriptionTextarea);
    console.log(hoursInput);

    descriptionTextarea.addEventListener('blur', onBlurHandler);
  };

  function splitToFields(str) {
    var result = [];
    var split = str.split(" ");

    if (split.length >= 2) {
      result.push(split[0]);
      result.push(split.slice(1).join(" "));
    }

    return result;
  }

  function onBlurHandler(event) {
    var target = event.target;
    var fields = splitToFields(target.value);

    if (fields.length === 2) {
      hoursInput.value = fields[0];
      descriptionTextarea.value = fields[1].replace(/\n/g, '');
    }
  }

})();
