/**
 * Directive for displaying figures side by side
 * 
 * Requires two parameters: o2r-original-figure and o2r-modified-figure
 * 
 * Call directive as follows
 * <o2r-side-by-side o2r-original-figure="{{}}" o2r-modified-figure="{{}}"
 * 
 * Where o2r-original-figure MUST be an object as defined in repo metadata/compendium.json
 * and
 * where o2r-modified-figure MUST be an object containing only the timeseries returned by the openCPU endpoint
 */
(function(){
    'use strict';

    angular
        .module('starter.o2rSideBySide')
        .directive('o2rSideBySide', o2rSideBySide);
    
    o2rSideBySide.$inject = ['$log'];
    function o2rSideBySide($log){
        var logger = $log.getInstance('o2rSideBySide');
        return{
            restrict: 'E',
            scope: {
                original: '@o2rOriginalFigure',
                modified: '@o2rModifiedFigure'
            },
            templateUrl: 'app/o2rSideBySide/o2rSideBySide.template.html',
            link: link
        };

        function link(scope, elements, attrs){
            attrs.$observe('original', function(value){
                scope.original = value;
                logger.info('original', scope.original);
                if(scope.original.type == 'timeseries'){
                    scope.originalTime = prepareTimeSeries(scope.original.original.values);
                }
            });
            attrs.$observe('modified', function(value){
                scope.modified = value;
                if(scope.modified.type == 'timeseries'){
                    scope.modifiedTime = prepareTimeSeries(value);
                }
            });

            function prepareTimeSeries(arr){
                var result = {};
                // structure: result{
                //     pointForecast: [],
                //     lo80: []    
                // }
                for(var i in arr[0]){
                    if(arr[0].hasOwnProperty(i)){
                        result[i] = [];
                    }
                }
                for(var i in arr){
                    for(var j in arr[i]){
                        if(arr[i].hasOwnProperty(j)){
                            result[j].push(arr[i][j]);
                        }
                    }
                }
                return result;

            }
        }
    }
})();