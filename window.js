console.profile('cause of reload');

window.addEventListener('beforeunload', function() {
  console.profileEnd('cause of reload');
  console.error('TEST FAILEDDDD SOMETHING TRIGGERED UNLOAD');
  console.trace('beforeunload');
  throw new Error('beforeunload happened');
});
