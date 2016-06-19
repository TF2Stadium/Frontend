/* @flow */
/* global module */
/* angularjs Scroll Glue
 * version 2.0.6
 * https://github.com/Luegg/angularjs-scroll-glue
 * An AngularJs directive that automatically scrolls to the bottom of an element on changes in it's scope.
 */

/**
 * Copyright (C) 2013 Luegg
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *
 * This code served with modifications by the TF2Stadium team.
 */

function createActivationState($parse, attr, scope) {
  function unboundState(initValue) {
    var activated = initValue;
    return {
      getValue: function () {
        return activated;
      },
      setValue: function (value) {
        activated = value;
      },
    };
  }

  function oneWayBindingState(getter, scope_) {
    return {
      getValue: function () {
        return getter(scope_);
      },
      setValue: function () {},
    };
  }

  function twoWayBindingState(getter, setter, scope_) {
    return {
      getValue: function () {
        return getter(scope_);
      },
      setValue: function (value) {
        if (value !== getter(scope_)) {
          scope.$apply(function () {
            setter(scope_, value);
          });
        }
      },
    };
  }

  if (attr !== '') {
    var getter = $parse(attr);
    if (getter.assign !== undefined) {
      return twoWayBindingState(getter, getter.assign, scope);
    } else {
      return oneWayBindingState(getter, scope);
    }
  } else {
    return unboundState(true);
  }
}

function createDirective(scrollglue, attrName, direction) {
  scrollglue.directive(attrName, ['$parse', '$window', '$timeout', function ($parse, $window, $timeout) {
    return {
      priority: 1,
      restrict: 'A',
      link: function (scope, $el, attrs) {
        var el = $el[0],
          activationState = createActivationState($parse, attrs[attrName], scope);

        function scrollIfGlued() {
          if (activationState.getValue() && !direction.isAttached(el)) {
            direction.scroll(el);
          }
        }

        function onScroll() {
          activationState.setValue(direction.isAttached(el));
        }

        scope.$watch(scrollIfGlued);

        $timeout(scrollIfGlued, 0, false);

        $window.addEventListener('resize', scrollIfGlued, false);

        $el.bind('scroll', onScroll);


        // Remove listeners on directive destroy
        $el.on('$destroy', function () {
          $el.unbind('scroll', onScroll);
        });

        scope.$on('$destroy', function () {
          $window.removeEventListener('resize',scrollIfGlued, false);
        });
      },
    };
  }]);
}

var bottom = {
  isAttached: function (el) {
    // + 1 catches off by one errors in chrome
    return el.scrollTop + el.clientHeight + 1 >= el.scrollHeight;
  },
  scroll: function (el) {
    el.scrollTop = el.scrollHeight;
  },
};

var top = {
  isAttached: function (el) {
    return el.scrollTop <= 1;
  },
  scroll: function (el) {
    el.scrollTop = 0;
  },
};

var right = {
  isAttached: function (el) {
    return el.scrollLeft + el.clientWidth + 1 >= el.scrollWidth;
  },
  scroll: function (el) {
    el.scrollLeft = el.scrollWidth;
  },
};

var left = {
  isAttached: function (el) {
    return el.scrollLeft <= 1;
  },
  scroll: function (el) {
    el.scrollLeft = 0;
  },
};

var scrollglue = angular.module('luegg.directives', []);

createDirective(scrollglue, 'scrollGlue', bottom);
createDirective(scrollglue, 'scrollGlueTop', top);
createDirective(scrollglue, 'scrollGlueBottom', bottom);
createDirective(scrollglue, 'scrollGlueLeft', left);
createDirective(scrollglue, 'scrollGlueRight', right);

module.exports = scrollglue;
