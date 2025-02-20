import '@testing-library/jest-dom/extend-expect';

import { setupIonicReact } from '@ionic/react';

setupIonicReact();

// Mock matchmedia
window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    addListener: function () { },
    removeListener: function () { }
  };
};