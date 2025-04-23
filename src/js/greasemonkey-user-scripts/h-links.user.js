// ==UserScript==
// @name         h-links
// @namespace    pavelburov
// @version      0.0.3
// @description  Adds links for headers
// @author       Pavel Burov <burovpavel@gmail.com>
// @match        http*://*/*
// @grant        GM_addStyle
// ==/UserScript==

/* Set the icon's location and fading transition */
GM_addStyle('.glfh_linkContainer {\n' +
  '  display: inline;\n' +
  '  font-size: 75%;\n' +
  '  opacity: 0.0;\n' +
  '  padding-left: 10px;\n' +
  '  transition: all 200ms ease-out;\n' +
  '  vertical-align: middle;\n' +
  '}\n');

/* Prevent the icon from showing underlining, etc */
GM_addStyle('.glfh_linkContainer > a, .glfh_linkContainer > a:hover {\n' +
  '    border: 0px !important;\n' +
  '    color: inherit;\n' +
  '    text-decoration: none !important;\n' +
  '}');

/* Hovering over the header makes the icon visible */
GM_addStyle('.glfh_headerContainer:hover .glfh_linkContainer {\n' +
  '    opacity: 1.0;\n' +
  '}');

/**
 * Loop recursively through the header and its child elements, in search of an ID to link to
 * Return the ID if found, otherwise undefined
 */
function getFirstId(element) {
  if (element.hasAttribute('id')) {
    return element.getAttribute('id');
  } else if (element.hasAttribute('name')) {
    return element.getAttribute('name');
  } else if (element.hasChildNodes()) {
    for (let i = 0; i < element.children.length; i++) {
      let id = getFirstId(element.children[i]);
      if (id) {
        return id;
      }
    }
  }
  return undefined;
}

function isNeedToProcess(element) {
  if (element.firstElementChild) {
    // contains only text
    return false;
  }
  return true;
}


/**
 * Check the element's immediate parent, in search of an appropriate ID to link to
 * Return the ID if found, otherwise undefined
 */
function getParentId(element) {
  let pNode = element.parentNode;
  if (pNode !== undefined && (pNode.tagName === 'A' || pNode.tagName === 'DIV')) {
    if (pNode.hasAttribute('id')) {
      return pNode.getAttribute('id');
    } else if (pNode.hasAttribute('name')) {
      return pNode.getAttribute('name');
    }
  }
  return undefined;
}

(function () {
  'use strict';

  document
    .querySelectorAll('h1, h2, h3, h4, h5, h6')
    .forEach(function (header) {
      if (isNeedToProcess(header)) {
        let id = getFirstId(header) || getParentId(header);
        if (id) {
          let anchorUrl = `${location.protocol}//${location.host}${location.pathname}${location.search}#${id}`;

          let copyLink = document.createElement('a');
          copyLink.href = anchorUrl;
          copyLink.title = 'Copy link to clipboard';
          copyLink.textContent = '#';
          copyLink.addEventListener('click', function () {
            navigator.clipboard.writeText(anchorUrl)
          })

          let innerDiv = document.createElement('div');
          innerDiv.className = 'glfh_linkContainer';
          innerDiv.appendChild(copyLink);

          header.appendChild(innerDiv);
          header.classList.add('glfh_headerContainer');
        }
      }
    });
})();
