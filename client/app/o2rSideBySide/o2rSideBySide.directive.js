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
                orig: '=o2rOriginalFigure',
                modi: '=o2rModifiedFigure',
                layout: '=plotlyLayout'
            },
            templateUrl: 'app/o2rSideBySide/o2rSideBySide.template.html'
        };
    }
})();