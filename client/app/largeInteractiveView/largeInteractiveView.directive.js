(function(){
    'use strict';

    angular
        .module('starter.largeInteractiveView')
        .directive('largeInteractiveView', largeInteractiveView);
    
    largeInteractiveView.$inject = ['$log', 'icons','$mdDialog'];
    function largeInteractiveView($log, icons, $mdDialog){
        return {
            restrict: 'E',
            template: '<div layout="row">'
                    + '<span flex></span><md-button class="md-icon-button"  ng-click="enlargeInteractiveView($event)">'
                    + '<md-icon md-menu-origin md-svg-icon="{{icons.enlarge}}"></md-icon>'
                    + '</md-button></div> ',
            scope: {
                figure: '=o2rFigure',
                ercId: '@ercid'
            },
            link: link
        };

        ///////

        function link(scope, element, attrs){
            scope.icons = icons;
            scope.enlargeInteractiveView = function(event) {
                $mdDialog.show({
                scope: scope.$new(),
                  templateUrl: 'app/largeInteractiveView/largeInteractiveViewDialog.template.html',
                  parent: angular.element(document.body),
                  targetEvent: event,
                  clickOutsideToClose:true,
                  fullscreen: true// Only for -xs, -sm breakpoints.
                })
              };

              scope.cancel = function() {
                $mdDialog.cancel();
              };
        }
    }
})();