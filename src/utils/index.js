export async function getTabId() {
  return await new Promise((r, j) => {
    chrome.tabs.query({ active: true }, ([tab]) => {
      if (tab) {
        r(tab.id);
      } else {
        j('none tab');
      }
    });
  });
}

export async function getOrigin() {
  return await new Promise((r, j) => {
    chrome.devtools.inspectedWindow.eval('location.origin', result => {
      if (result) {
        r(result);
      } else {
        j('getOrigin fail');
      }
    });
  });
}

export async function getHAREntries() {
  return await new Promise(r => {
    chrome.devtools.network.getHAR(({ entries }) => {
      r(entries);
    });
  });
}
