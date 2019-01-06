// the background script runs all the time and serves as a central message
// hub for each vue devtools (panel + proxy + backend) instance.

function installProxy(tabId) {
  chrome.tabs.executeScript(
    tabId,
    {
      file: '/build/inject.js'
    },
    function(res) {
      console.log('executeScript to tab ', tabId, res);
    }
  );
}
