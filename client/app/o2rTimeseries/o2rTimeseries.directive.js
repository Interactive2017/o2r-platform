(function(){
    'use strict';

    /**
     * Directive to display a plotly timeseries. 
     * Uses the existing plotly directive and extends it with some further information.
     * 
     * You can use this directive with <o2r-timeseries> </o2r-timeseries>
     * 
     * Insert the scope data and layout. Data contains the data to be displayed, 
     * layout contains the title defined in the metadata for the figure.
     * 
     * Use the following structure:
     * data = 
     * [{
     * x: [2000,2001,2002,2003,2004,.....,2010],
     * y: [4,1,5,17,...,3]
     * }]
     *
     * where x are the x-axis value and the y are the values for the y-axis. 
     * For multiple lines in the plot just insert multiple objects into the array.
     *
     * layout = {title: 'Title of the plot'};
     *  
     * Insert it in the end as vm object: 
     * <o2r-timeseries o2r-data="vm.data" o2r-layout="vm.layout"></o2r-timeseries>
     */

    angular
        .module('starter.o2rTimeseries')
        .directive('o2rTimeseries', o2rTimeseries);

    o2rTimeseries.$inject = [];
    function o2rTimeseries(){
        return{
			restrict: 'E',
            templateUrl: 'app/o2rTimeseries/o2rTimeseries.template.html',
            scope: {
                data: '=o2rData',
                layout: '=o2rLayout'
            },
            link: link
        };

        
        function link(scope, element, attrs){

            scope.options = {showLink: false, displayLogo: false};
        }
    }
})();
