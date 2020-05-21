// ==UserScript==
// @name         projectile_test
// @namespace    test
// @version      1.3.0
// @description  Reports helper
// @author       Pavel Burov (burovpavel@gmail.com)
// @match        https://project.jcatalog.com/projectile/start*
// @match        https://project.opuscapita.com/projectile/start*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
  var module = {};

  var DEFAULT_WORK_START_TIME = "9:30";
  var PROJECTILE_HOST_URL = window.location.href.substring(0, window.location.href.indexOf("/", 8)+1);

  function phsBlinkElement(element, color, duration) {
    color = color ? color : "#88FFFF";
    duration = duration ? duration : 300;
    var oldBgColor = element.style.backgroundColor;
    element.style.backgroundColor = color;
    setTimeout(function() {
      document.getElementById(element.id).style.backgroundColor = oldBgColor;
    }, duration);
  }

  /**
   * set start work time
   */
  document.addEventListener('click', function(event) {
    var sElement = event.target;
    if (sElement.tagName == "INPUT" &&
        sElement.id.indexOf("Field_NewFrom") > -1 &&
        sElement.value === ""
    ) {
      sElement.value = DEFAULT_WORK_START_TIME;
    }
  }, true);

  function findElement(collection, includes, excludes) {
    var result = null;

    for (var i = 0; i < collection.length; ++i) {
      var entry = collection[i];
      var id = entry.id;
      if (id) {
        var match = true;

        includes.forEach(function(entry) {
          if (match) {
            match = match && id.indexOf(entry) > -1;
          }
        });

        excludes.forEach(function(entry) {
          if (match) {
            match = match && id.indexOf(entry) < 0;
          }
        });

        if (match) {
          result = entry;
          break;
        }
      }
    }
    return result;
  }

  function splitToFields(str) {
    var result = [];
    var split = str.split(" ");

    if (split.length >= 3) {
      result.push(split[0]);
      result.push(split[1]);
      result.push(split.slice(2).join(" "));
    }

    return result;
  }

  function fireEvent(element, event) {
    if (document.createEventObject) {
      // dispatch for IE
      return element.fireEvent('on' + event, document.createEventObject());
    } else {
      // dispatch for firefox + others
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent(event, true, true); // event type,bubbling,cancelable
      return !element.dispatchEvent(evt);
    }
  }

  function getProjectValueBox(element) {
    return element ? getWarningTD(element).getElementsByTagName("input")[0] : null;
  }

  function getProjectTextBox(element) {
    return element ? getWarningTD(element).getElementsByTagName("input")[1] : null;
  }

  function getWarningTD(ticketElement) {
    return ticketElement.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("td")[14];
  }

  function phsShowWarning(msg, sElement, color) {
    var element = getWarningTD(sElement);
    color = color ? color : "#FF0000";
    var container = element.appendChild(document.createElement("div"));
    container.style.color = color;
    container.innerHTML = msg;
  }

  function selectProjectInUIByExtProjectId(projectId, sElement, bugTrackerName) {
    if (!bugTrackerName) {
      bugTrackerName = "JIRA";
    }
    if (projectId) {
      var projectTextBox = getProjectTextBox(sElement);
      var projectValueBox = getProjectValueBox(sElement);

      GM_xmlhttpRequest(
          {
            method: 'GET',
            url: PROJECTILE_HOST_URL + "projectile/ajax" +
                "?timestamp=" + Date.now() + "&cmd=list&id=" + projectValueBox.name +
                "&query=" + projectId + "-",
            headers: {
              'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
              'Accept': 'text/plain',
            },
            onload: function(responseDetails) {
              if (responseDetails.status === 200) {
                var searchResults = JSON.parse(responseDetails.responseText);

                if (searchResults.count > 0) {
                  projectValueBox.value = searchResults.rows[0]._value;
                  projectTextBox.value = searchResults.rows[0]._caption;
                  if (searchResults.count > 1) {
                    phsShowWarning("Select manually (found more than one process for project: " + projectId + ")", sElement, "#0000FF");
                  }
                } else {
                  phsBlinkElement(projectTextBox, "#FF0000");
                  phsShowWarning("Specified " + bugTrackerName + " issue require missing project: " + projectId, sElement);
                }

              } else {
                phsShowWarning("Project information is not available", sElement);
              }
            }
          }
      );
    } else {
      phsShowWarning(bugTrackerName + " issue has no Ex.Project ID! Please, report to responsible person.", sElement);
    }
  }


  document.addEventListener('blur', function(event) {
    var noteInput = event.target;

    if (noteInput.tagName == "INPUT" &&
        noteInput.id.indexOf("Field_") > -1 &&
        noteInput.id.indexOf("Note_") > -1 &&
        noteInput.id.indexOf("InternalNote") < 0 &&
        noteInput.value !== ""
    ) {

      var fields = splitToFields(noteInput.value);
      if (fields.length === 3) {
        phsBlinkElement(noteInput);

        // entry row
        var tr = noteInput.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
        var inputs = tr.getElementsByTagName("input");

        var timeInput = findElement(inputs, ["Field_", "Time_"], []);
        var ticketIdInput = findElement(inputs, ["Field_", "InternalNote_"], []);

        timeInput.value = fields[0];
        noteInput.value = fields[2];

        if (fields[1] === 'JCPIM-01.3') {
          selectProjectInUIByExtProjectId('JCPIM-01.3', noteInput, 'GitHub');
        } else {
          ticketIdInput.value = fields[1];
          fireEvent(ticketIdInput, 'blur');
        }
      }
    }
  }, true);

  return module;
}());
