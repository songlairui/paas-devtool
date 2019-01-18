import cache from './dataCache';

export const panelCallback = (panel) => {
  cache.panel = panel;
  panel.onShown.addListener(onPanelShown);
  panel.onHidden.addListener(onPanelHidden);
};

// Manage panel visibility
function onPanelShown() {
  chrome.runtime.sendMessage('paas-panel-shown');
}

function onPanelHidden() {
  chrome.runtime.sendMessage('paas-panel-hidden');
}
