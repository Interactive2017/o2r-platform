(function(){
    'use strict';

    /**
     * Directive to display a plotly timeseries. Uses the existing plotly directive and extends it with some further information.
     * 
     * You can use the directive with <o2r-timeseries> </o2r-timeseries>
     * 
     * Insert the scope data and title. Data contains the data to be displayed, title is the title defined in the metadata for the figure.
     * 
     * Use the following structure:
     * values = 
     * [{
     * x: [2000,2001,2002,2003,2004,.....,2010],
     * y: [4,1,5,17,...,3]
     * }]
     * 
     * where x are the x-axis value and the y are the values for the y-axis. For multiple lines in the plot just insert multiple objects into the array.
     * 
     * Insert it in the end as vm object or directly like: <o2r-timeseries o2r-data={{vm.values}} o2r-title={"A new title"}></o2r-timeseries>
     */

    angular
        .module('starter.o2rTimeseries')
        .directive('o2rTimeseries', o2rTimeseries);

    o2rTimeseries.$inject = [];
    function o2rTimeseries(){
        return{
			restrict: 'E',
            templateUrl: 'app/o2rTimeseries/o2rTimeseries.template.html',
            link: link,
            scope: {
                data: '@o2rData',
                title: '@o2rTitle'
            }
        }

    }

    function link(scope, element, attrs){
        scope.data = [];
        attrs.$observe('data', function(value){
            console.info("value");
            scope.data.push(angular.fromJson(value));   
        });

        attrs.$observe('title', function(value) {
            scope.title = value;
        })

        scope.options = {showLink: false, displayLogo: false};
    }
})();