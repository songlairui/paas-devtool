import { panelCallback } from 'src/utils/devBackground';
import { getOrigin } from 'src/utils';

async function addPanel() {
  const origin = await getOrigin();
  if (
    origin.indexOf('mypaas') === -1 &&
    origin.indexOf('localhost') === -1 &&
    !/^https?:\/\/[\d\.]{7,15}/.test(origin)
  ) {
    return;
  }
  chrome.devtools.panels.create(
    'PaaS',
    'icons/128.png',
    'panel.html',
    panelCallback
  );
}

addPanel();
