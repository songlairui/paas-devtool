// This is the devtools script, which is called when the user opens the
// Chrome devtool on a page. We check to see if we global hook has detected
// Vue presence on the page. If yes, create the Vue panel; otherwise poll
// for 10 seconds.

chrome.devtools.panels.create(
  'Vue',
  'icons/128.png',
  'devtools.html',
  panel => {
    // panel loaded
    panel.onShown.addListener(onPanelShown);
    panel.onHidden.addListener(onPanelHidden);
  }
);

// Action that may execute immediatly
// or later when the Vue panel is ready

function panelAction(cb, message = null) {
  if (created && panelLoaded && panelShown) {
    cb();
  } else {
    pendingAction = cb;
    message && toast(message);
  }
}

function executePendingAction() {
  pendingAction && pendingAction();
  pendingAction = null;
}

// Execute pending action when Vue panel is ready

function onPanelLoad() {
  executePendingAction();
  panelLoaded = true;
}

// Manage panel visibility

function onPanelShown() {
  chrome.runtime.sendMessage('vue-panel-shown');
  panelShown = true;
  panelLoaded && executePendingAction();
}

function onPanelHidden() {
  chrome.runtime.sendMessage('vue-panel-hidden');
  panelShown = false;
}

// Toasts

function toast(message, type = 'normal') {
  const src = `(function() {
    __VUE_DEVTOOLS_TOAST__(\`${message}\`, '${type}');
  })()`;

  chrome.devtools.inspectedWindow.eval(src, function(res, err) {
    if (err) {
      console.log(err);
    }
  });
}
