// ==UserScript==
// @name         github tools
// @namespace    pavelburov
// @version      0.2.3
// @description  github tools
// @author       Pavel Burov <burovpavel@gmail.com>
// @match https://github.com/*/issues/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js
// @grant        none
// ==/UserScript==

var overlayElementId = "fixedOverlay";

(function(overlayElementId) {
  $("body").append('<div id="' + overlayElementId + '" style="position:fixed;cursor:move;top:70px;left:10px;border:1px solid black;z-index:999999">Overlay</div>');

  var overlaySelector = "#" + overlayElementId;

  $(overlaySelector).append("<button onclick='$(\"" + overlaySelector + "\").hide();'>x</button>");
  $(overlaySelector).draggable();
})(overlayElementId);

(function(overlayElementId) {
  'use strict';

  var resolveRepoName = function() {
    return window.location.pathname.split('/')[2];
  };

  var resolveIssueNumber = function() {
    return window.location.pathname.split('/').slice(-1).pop();
  };

  var createIssueNumber = function(repoName, issueNumber) {
    return repoName + "#" + issueNumber;
  };

  var createDevBranchName = function(repoName, issueNumber) {
    return "fdd." + repoName + "-" + issueNumber;
  };

  var createGitNewBranchCommand = function(repoName, issueNumber) {
    var branchName = createDevBranchName(repoName, issueNumber);
    return "git co -b " + branchName;
  };

  var createDevVersion = function(repoName, issueNumber) {
    return "0.0.1-" + repoName + "-" + issueNumber + "-SNAPSHOT";
  };

  var wrapWithClipboardCopy = function(content) {
    return '<clipboard-copy className="js-clipboard-copy zeroclipboard-link text-gray link-hover-blue" value="' + content + '" aria-label="Copied!">' + content + '</clipboard-copy>';
  };

  var overlaySelector = "#" + overlayElementId;

  var repoName = resolveRepoName();
  var issueNumber = resolveIssueNumber();

  if (issueNumber && issueNumber.length < 5) {
    $(overlaySelector).append("<div style='cursor:pointer;'>" + wrapWithClipboardCopy(createIssueNumber(repoName, issueNumber)) + "</div>");
    $(overlaySelector).append("<div style='cursor:pointer;'>" + wrapWithClipboardCopy(createDevBranchName(repoName, issueNumber)) + "</div>");
    $(overlaySelector).append("<div style='cursor:pointer;'>" + wrapWithClipboardCopy(createDevVersion(repoName, issueNumber)) + "</div>");
    $(overlaySelector).append("<div style='cursor:pointer;'>" + wrapWithClipboardCopy(createGitNewBranchCommand(repoName, issueNumber)) + "</div>");
  }

})(overlayElementId);
