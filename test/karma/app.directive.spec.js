/*global describe,beforeEach,module,inject,it,expect */

describe('Directives', function () {
  'use strict';

  var $compile, $rootScope;

  beforeEach(function () {
    module('tf2stadium.directives');

    inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    });
  });

  describe('<whitelist>', function () {
    function render(id) {
      var el = $compile('<whitelist id="' + id + '" />')($rootScope);
      $rootScope.$digest();

      return el;
    }

    it('should start with "whitelist"', function () {
      var el = render(123);
      var html = el.html();

      expect(html.indexOf('whitelist ')).to.equal(0);
    });

    it('should contain a single link', function () {
      var el = render(123);
      var links = el.find('a');

      expect(links.length).to.equal(1);
    });

    it('should have a link targeted to _blank', function () {
      var el = render(123);
      var target = el.find('a').attr('target');

      expect(target).to.equal('_blank');
    });

    it('should link to whitelist.tf correctly', function () {
      var el = render(123);
      var href = el.find('a').attr('href');

      expect(href).to.equal('http://whitelist.tf/123');
    });

    it('should only have a "#" if the whielist id is numeric', function () {
      var el = render(123);
      var html = el.html();

      expect(html).to.have.string('#');

      el = render('etf2l');
      html = el.html();

      expect(html).to.not.have.string('#');
    });
  });
});
