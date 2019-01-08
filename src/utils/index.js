export async function getTab() {
  return await new Promise((r, j) => {
    chrome.tabs.query({ active: true }, ([tab]) => {
      if (tab) {
        r(tab);
      } else {
        j('none tab');
      }
    });
  });
}

export async function getTabId() {
  const tab = await getTab();
  return tab.id;
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

export async function getResContent(res) {
  if (!res) return 'waiting';
  return await new Promise(r => {
    res.getContent(content => {
      r(content);
    });
  });
}
