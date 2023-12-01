// ==UserScript==
// @name flamingo-ui helper
// @namespace pavelburov
// @version 0.0.1
// @description Helps to fill in reports
// @author Pavel Burov <burovpavel@gmail.com>
// @match https://reports.scand.by/flamingo-ui/*
// @require https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// ==/UserScript==

console.debug('flamingo-ui helper');

const handleCtrlV = function () {
  const descriptionTextarea = document.querySelector("textarea[id=description]");
  const projectIdInput = document.querySelector("input[id=projectId]");

  console.debug('descriptionTextarea', descriptionTextarea);
  console.debug('projectIdInput', projectIdInput);
};

document.body.addEventListener("keydown", function (ev) {
  if (ev.code === 'KeyV' && ev.ctrlKey) {
    console.debug("Ctrl+V is pressed.");
    handleCtrlV();
  } else if (ev.code === 'KeyC' && ev.ctrlKey) {
    console.debug("Ctrl+C is pressed.");
  }
});

(function () {
  'use strict';

})();
