/**
 * Directive for displaying figures side by side
 * 
 * Requires two parameters: o2r-original-figure and o2r-modified-figure
 * 
 * Call directive as follows
 * <o2r-side-by-side o2r-original-figure="{{}}" o2r-modified-figure="{{}}"></o2r-side-by-side>
 * 
 * Where o2r-original-figure MUST be an object as defined in repo metadata/compendium.json
 * and
 * where o2r-modified-figure MUST be an object containing only the timeseries returned by the openCPU endpoint or a link to the map image
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
                orig: '@o2rOriginalFigure',
                modi: '@o2rModifiedFigure'
            },
            templateUrl: 'app/o2rSideBySide/o2rSideBySide.template.html',
            link: link
        };

        function link(scope, elements, attrs){
            logger.info('orig', scope.orig);
            logger.info('modi', scope.modi);
            scope.original = angular.fromJson(scope.orig);
            if(scope.original.type == 'timeseries') scope.modified = angular.fromJson(scope.modi);
            else scope.modified = scope.modi;
            logger.info('scope.modified', scope.modified);
            scope.originalTime = [];
            scope.originalTime.push(prepareTimeSeries(scope.original.original.values));
            if(scope.original.type == 'timeseries'){
                scope.modifiedTime = [];
                scope.modifiedTime.push(prepareTimeSeries(scope.modified));
            }

            attrs.$observe('orig', function(value){
                
                scope.original = value;
                logger.info('original', scope.original);
                if(scope.original.type == 'timeseries'){
                    scope.originalTime = [];
                    scope.originalTime.push(prepareTimeSeries(scope.original.original.values));
                }
            });


            attrs.$observe('modi', function(value){
                scope.modified = value;
                if(scope.original.type == 'timeseries'){
                    scope.modifiedTime = [];
                    scope.modifiedTime.push(prepareTimeSeries(value));
                }
            });

            function prepareTimeSeries(arr){
                var result = {};
                // structure: result{
                //     pointForecast: [],
                //     lo80: []    
                // }
                for(var i in arr[0][0]){
                    if(arr[0][0].hasOwnProperty(i)){
                        result[i] = [];
                    }
                }
                for(var i in arr[0]){
                    for(var j in arr[0][i]){
                        if(arr[0][i].hasOwnProperty(j)){
                            result[j].push(arr[0][i][j]);
                        }
                    }
                }
                return result;

            }
        }
    }
})();