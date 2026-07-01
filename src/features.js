import { coreFeatureMethods } from './features/core.js';
import { ttsMethods } from './features/tts.js';
import { axeReportMethods } from './features/axe-report.js';
import { annotationMethods } from './features/annotations.js';
import { visualFilterMethods } from './features/visual-filters.js';
import { pageToolMethods } from './features/page-tools.js';

/** @typedef {import('./index.js').default} AccessibleWebWidget */

/** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
export const featureMethods = {
  ...coreFeatureMethods,
  ...ttsMethods,
  ...axeReportMethods,
  ...annotationMethods,
  ...visualFilterMethods,
  ...pageToolMethods
};
