console.profile('cause of reload');

window.addEventListener('beforeunload', function() {
  console.profileEnd('cause of reload');
  console.error('TEST FAILEDDDD SOMETHING TRIGGERED UNLOAD');
});