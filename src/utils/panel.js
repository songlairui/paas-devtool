import cache from './dataCache';

function resCallback(res) {
  console.info('deal with', cache, cache.dealWithRes);
  cache.dealWithRes && cache.dealWithRes(res);
}

// Manage panel visibility
function onPanelShown() {
  console.warn('add listener', Object.keys(chrome));
  chrome.devtools.network.onRequestFinished.addListener(resCallback);
}

function onPanelHidden() {
  chrome.devtools.network.onRequestFinished.removeListener(resCallback);
}

export const panelCallback = panel => {
  cache.panel = panel;
  // panel loaded
  panel.onShown.addListener(onPanelShown);
  panel.onHidden.addListener(onPanelHidden);
};
