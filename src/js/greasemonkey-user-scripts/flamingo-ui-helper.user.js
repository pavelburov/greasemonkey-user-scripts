// ==UserScript==
// @name flamingo-ui-helper
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

const formatLog = function (msg) {
  return `flamingo-ui-helper ::: ${msg}`;
}

console.debug(formatLog('flamingo-ui-helper is active'));

/*
it's very very very dirty hack
we're accessing to props of React component "react-select" through some internal property like
node.__reactProps$2awl3sep0gy.children[0].props
I don't know other ways to set or get value from this control :(

Usage (pass project name for startsWith comparison):
selectProject('Internal')
*/
function selectProject(projectName) {
  const getReactSelectProps = (node) => {
    const ownProperties = Object.getOwnPropertyNames(node);
    const reactInternalProperty = ownProperties.find((property) =>
      property.startsWith('__reactProps')
    );
    return node[reactInternalProperty]?.children?.filter((child) => !!child)?.[0]?.props;
  };

  const projectInput = document.getElementById('projectId');
  const projectControl = projectInput?.closest('.col-md-10')?.firstElementChild;
  const controlProps = getReactSelectProps(projectControl);
  const projectNameToSearch = projectName.toLowerCase();

  const projectToSelect = controlProps?.options.find(
    // "startsWith" can be replaced with "includes(projectNameToSearch)" or with "===" for strict searching
    (option) => option.label.toLowerCase().startsWith(projectNameToSearch)
  );

  if (!projectToSelect) {
    console.warn(formatLog(`Project "${projectName}" is not found to be selected`));
    return;
  }

  console.debug(formatLog(`set selected project to: ${projectToSelect.label}`));
  controlProps.selectOption(projectToSelect);
}

// TODO make configurable
const projectsMappings = [
  {match: '#bm4a', id: 1368, label: 'BMA (SSD-CS)'},
  {match: '#scand-oneruntime', id: 1450, label: 'OneRuntime (SSD-CS)'},
];

const findProjectMapping = function (description, mappings) {
  return mappings.find(m => description.startsWith(m.match))
};

const handleCtrlV = function () {
  const descriptionTextarea = document.querySelector("textarea[id=description]");
  const description = descriptionTextarea.value;
  const projectIdInput = document.querySelector("input[id=projectId]");

  if (descriptionTextarea && projectIdInput) {
    const projectMapping = findProjectMapping(description, projectsMappings);
    if (projectMapping) selectProject(projectMapping.label);
  }
};

const handleCtrlC = function () {
  handleCtrlV();
};

document.body.addEventListener("keydown", function (e) {
  if (e.code === 'KeyV' && e.ctrlKey) {
    handleCtrlV();
  } else if (e.code === 'KeyC' && e.ctrlKey) {
    handleCtrlC();
  }
});
