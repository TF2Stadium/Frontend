/*global describe,beforeEach,inject,it,expect */

describe('Filters', function () {
  var $filter;

  beforeEach(function () {
    angular.mock.module('tf2stadium.filters');

    inject(function (_$filter_) {
      $filter = _$filter_;
    });
  });

  describe('capitalize()', function () {
    var capitalize;

    beforeEach(function () {
      capitalize = $filter('capitalize');
    });

    it('should capitalize the first letter of a string', function () {
      var word = 'abcdef ghijklm nopqrs';
      var wordCapital = 'Abcdef ghijklm nopqrs';

      expect(capitalize(word)).to.equal(wordCapital);
    });
  });

  describe('reverse()', function () {
    var reverse;

    beforeEach(function () {
      reverse = $filter('reverse');
    });

    it('should reverse the elmeents of the array', function () {
      var arr = [1,2,3,4,5];
      var arrReverse = [5,4,3,2,1];

      expect(reverse(arr)).to.deep.equal(arrReverse);
    });

    it('should not mutate the input array', function () {
      var arr = [1,2,3,4,5];
      var arr2 = [1,2,3,4,5];
      var arrReverse = [5,4,3,2,1];

      expect(reverse(arr)).to.deep.equal(arrReverse);
      expect(arr).to.deep.equal(arr2);
    });
  });

  describe('stripSlotNameNumber()', function () {
    var stripSlotNameNumber;

    beforeEach(function () {
      stripSlotNameNumber = $filter('stripSlotNameNumber');
    });

    it('should remove trailing numerals', function () {
      var slotName = 'scout';
      var numberedSlot = slotName + '1';

      expect(stripSlotNameNumber(numberedSlot)).to.equal(slotName);
    });
  });

  describe('slotNameToClassName()', function () {
    var slotNameToClassName;

    beforeEach(function () {
      slotNameToClassName = $filter('slotNameToClassName');
    });

    it('should remove trailing numerals', function () {
      var slotName = 'scout';
      var numberedSlot = slotName + '1';

      expect(slotNameToClassName(numberedSlot)).to.equal(slotName);
    });

    it('should convert roamer/pocket to soldier', function () {
      expect(slotNameToClassName('roamer')).to.equal('soldier');
      expect(slotNameToClassName('pocket')).to.equal('soldier');
    });
  });

  describe('secondsToMinutes()', function () {
    var secondsToMinutes;

    beforeEach(function () {
      secondsToMinutes = $filter('secondsToMinutes');
    });

    [
      [60, '1:00', 'convert seconds to minutes and 0-pad only the seconds'],
      [600, '10:00', 'only 0-pad 2 digits'],
      [6000, '100:00', 'handle >99 minutes 99 seconds'],
      [12, '0:12', 'handle less than 1 minute']
    ].forEach(function (description) {
      var input = description[0];
      var expectedOutput = description[1];
      var reason = description[2];

      it('should ' + reason, function () {
        expect(secondsToMinutes(input)).to.equal(expectedOutput);
      });
    });
  });

  describe('unique()', function () {
    var unique;

    beforeEach(function () {
      unique = $filter('unique');
    });

    [
      [[{a: 1}, {a: 2}, {a: 1}], 'a', [{a: 1}, {a: 2}],
       'remove duplicate elements and leave the rest in order'],

      [[{a: 1}, {a: 2}, {a: 3}], 'a', [{a: 1}, {a: 2}, {a: 3}],
       'do nothing if no elements are duplicate']
    ].forEach(function (description) {
      var input = description[0];
      var inputKey = description[1];
      var expectedOutput = description[2];
      var reason = description[3];

      it('should ' + reason, function () {
        expect(unique(input, inputKey)).to.deep.equal(expectedOutput);
      });
    });
  });
});
