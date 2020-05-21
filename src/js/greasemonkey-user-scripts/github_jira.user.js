// ==UserScript==
// @name github.com + jira overlay
// @namespace burig
// @version 0.0.3
// @include https://github.com/OpusCapita*
// @description github enhancement
// @author burovpavel@gmail.com
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js
// @grant none
// ==/UserScript==

var overlayElementId = "fixedOverlay";

(function(overlayElementId) {
  $("body").append('<div id="fixedOverlay" style="position:fixed;top:100px;left:20px;border:1px solid black;z-index:999999">Overlay</div>');

  $("#" + overlayElementId).draggable();
})(overlayElementId);

// replace tickets numbers with links to jira
(function() {
  var pageBody = document.body;
  var regexp = /(PIM|DAM|CMP)(-\d*)/g;
  var result = pageBody.innerHTML.match(regexp);

  var createLinkToJiraIssue = function(id) {
    return "<a href='http://support.jcatalog.com/browse/" + id + "'>" + id + "</a>";
  };

  var tickets = new Set();
  result.forEach(function(currentValue) {
    tickets.add(currentValue);
  });

  tickets.forEach(function(currentValue) {
    $("#" + overlayElementId).append("<div>" + createLinkToJiraIssue(currentValue) + "</div>");
  });
})();
