// This file is a bit of a hack to make our build more convenient. We
// want to specify angular as noParse and with by linking to a
// pre-minified file (for better build-dev output size, which isn't
// hugely important, but we want it for various reasons).
//
// If you check the normal node_modules/angular/index.js, it is
// exactly like this file: it requires the normal angular code, and
// then adapts the global object it creates our module system.
//
// This file is the exact same, but we rename angular->angular-min,
// which we then webpack resolve to the pre-min file.
require('angular-min');
module.exports = angular;
