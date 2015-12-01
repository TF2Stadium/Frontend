describe('Unit: CommentBoxController', function () {
  beforeEach(module('tf2stadium'));

  var ctrl, scope;
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function ($controller, $rootScope) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    // Create the controller
    ctrl = $controller('CommentBoxController', {
      $scope: scope
    });
  }));

  describe('Array', function () {
    describe('#indexOf()', function () {
      it('should return -1 when the value is not present', function () {
        expect([1,2,3].indexOf(5)).to.equal(-1);
        expect([1,2,3].indexOf(0)).to.equal(-1);
        expect([1,2,3].indexOf(3)).to.not.equal(-1);
      });
    });
  });
});
