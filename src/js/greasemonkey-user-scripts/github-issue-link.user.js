// ==UserScript==
// @name github.com descriptive text for issue-link
// @namespace burig
// @version 0.0.6
// @include https://github.com/*
// @description Adds descriptive text for github issue-links
// @author burovpavel@gmail.com
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require http://unpkg.com/axios/dist/axios.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

/*

Adds issues title to non informative issue number in link text.

example:
owner/repo#432
==>>
XML export: only 100 attributes exported - owner/repo#432

It uses GitHub API to get issue title.
This means that you'll need to create a API token and setup it using tampermonkey menu item -> "Change GitHub Access Token"

*/

console.log("enabled: github.com descriptive text for issue-link");

function changeAccessToken() {
  GM_setValue("github.accessToken", prompt("Change GitHub Access Token", GM_getValue("github.accessToken", "")));
}

GM_registerMenuCommand("Change GitHub Access Token", changeAccessToken);


function getParamsFromUrl(url) {
  var urlWithoutDomain = url.replace("https://github.com/", "");
  var split = urlWithoutDomain.split("/");

  return {
    owner: split[0],
    repo: split[1],
    type: split[2],
    number: split[3]
  };
}

/*
Notes see:
https://developer.github.com/v3/issues/#get-a-single-issue
*/
function getIssueData(owner, repo, number, type) {
  var accessToken = GM_getValue("github.accessToken", "");
  var headers = {
    'Authorization': 'Bearer ' + accessToken
  };

  return axios.get("https://api.github.com/repos/" + owner + "/" + repo + "/issues/" + number, {
    method: 'get',
    headers: headers
  });
}

$(function() {
  $("a.issue-link").each(function(index) {
    var issueLink = $(this);
    var href = issueLink.attr("href");

    var urlParams = getParamsFromUrl(href);
    getIssueData(urlParams.owner, urlParams.repo, urlParams.number)
        .then(function(response) {
          var title = response.data.title;
          issueLink.prepend(title + " - ");
        })
        .catch(function(error) {
          console.log(error);
        });
  });
});
