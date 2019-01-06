// This is the devtools script, which is called when the user opens the
// Chrome devtool on a page. We check to see if we global hook has detected
// Vue presence on the page. If yes, create the Vue panel; otherwise poll
// for 10 seconds.
import { panelCallback } from 'src/utils/devBackground';

chrome.devtools.panels.create(
  'LARY',
  'icons/128.png',
  'panel.html',
  panelCallback
);
