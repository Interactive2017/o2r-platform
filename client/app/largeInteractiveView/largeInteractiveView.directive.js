(function(){
    'use strict';

    angular
        .module('starter.largeInteractiveView')
        .directive('largeInteractiveView', largeInteractiveView);
    
    largeInteractiveView.$inject = ['$log', 'icons','$mdDialog'];
    function largeInteractiveView($log, icons, $mdDialog){
        return {
            restrict: 'E',
            template: ' <span flex></span><md-button class="md-primary"  ng-click="enlargeInteractiveView($event)">Enlarge</md-button> ',
            scope: {
                figure: '=o2rFigure',
                ercId: '@ercid'
            },
            link: link
        };

        ///////

        function link(scope, element, attrs){
            
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