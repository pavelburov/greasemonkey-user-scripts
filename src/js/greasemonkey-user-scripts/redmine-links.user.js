// ==UserScript==
// @name         redmine-links
// @namespace    pavelburov
// @version      1.0.0
// @description  Replace RM-1234 with redmine link https://rm.<some.organization.here>/issues/1234
// @author Pavel Burov <burovpavel@gmail.com>
// @match        http://reports.scand/ureports.php
// @match        http://reports.scand/pdetails.php
// @match        https://reports.scand.by/ureports.php
// @match        https://reports.scand.by/pdetails.php
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
    'use strict';

    console.log("redmine-links");

    GM_registerMenuCommand('Set redmine baseUrl', setRedmineBaseUrl, 'u');

    const configHelper = new function () {
        this.NAMESPACE = "redmine-links.config";
        this.BASEURL = "redmine.baseUrl";

        this.getBaseUrl = function () {
            return GM_getValue(this.NAMESPACE + "." + this.BASEURL, "");
        }

        this.setBaseUrl = function (value) {
            GM_setValue(this.NAMESPACE + "." + this.BASEURL, value);
        }

        this.promptConfig = function (advBaseUrl) {
            return {
                baseUrl: prompt("Enter Base URL", advBaseUrl)
            }
        }

    }

    function setRedmineBaseUrl() {
        const {baseUrl} = configHelper.promptConfig("https://rm.<some.organization.here>/issues/");
        configHelper.setBaseUrl(baseUrl);
    }

    function getRSReportFromTR(reportTR) {
        // Could depend on project/user tab, user/teamlead/PM/admin role:
        // {id, date, startTime, durationInHours, durationInSeconds, description, dateTD, startTimeTD, durationTD, descriptionTD}.
        let report = {};
        let cells = reportTR.getElementsByTagName("td");
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].width == "15") {
                report.id = cells[i].getElementsByTagName("input")[0].value;
            } else if (cells[i].width == "75") {
                report.dateTD = cells[i];
                report.date = cells[i].innerText;
            } else if (cells[i].width == "60") {
                report.startTimeTD = cells[i];
                report.startTime = cells[i].innerText;
            } else if (cells[i].width == "40") {
                report.durationTD = cells[i];
                report.durationInHours = +cells[i].innerText;
                report.durationInSeconds = report.durationInHours * 3600;
            } else if (cells[i].width == "") {
                report.descriptionTD = cells[i];
                report.description = cells[i].innerText;
            }
        }

        return report;
    }

    const containerTables = document.getElementsByClassName("table-layout-fixed");
    const reportsTable = (containerTables.length > 0 ? containerTables[0].getElementsByTagName("table")[0] : null);
    const rows = (reportsTable ? reportsTable.rows : []);
    const idRegExp = /^RM-(\d+)\s/;
    const baseUrl = configHelper.getBaseUrl();

    for (let i = 0; i < rows.length - 1; i++) {
        let reportTR = rows[i];
        let rsReport = getRSReportFromTR(reportTR);

        let matches = idRegExp.exec(rsReport.description);
        if (matches) {
            let ticketId = matches[matches.length - 1];

            // Add link to ticket to ID part
            rsReport.descriptionTD.innerHTML = rsReport.descriptionTD.innerHTML.replace(
                ticketId, '<a href="' + baseUrl + ticketId + '" target="_blank">' + ticketId + '</a>');
        }
    }

})();
