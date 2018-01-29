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
                //check if there are two lines in the timeseries
                if(scope.data.length > 1) {
                    scope.two = true;
                    //calculat the statistics for the modified data
                    calcStats(1);
                }
                else {
                    scope.two = false;
                    //calculate the statistics for the original data
                    calcStats(0);
                }

                scope.$watch('data', function(newvalue, oldvalue){
                    scope.data = newvalue;
                    if(scope.data.length > 1) {
                        console.info('in observe true');
                        scope.two = true;
                        calcStats(1);
                    }
                    else {
                        scope.two = false;
                    }
                    calcStats(0);
                });
                //the original statistics are calculated every time
                function calcStats(index){

                    scope.meanOriginal = mean(scope.data, index);
                    scope.minOriginal = min(scope.data, index);
                    scope.maxOriginal = max(scope.data, index);
                    scope.sdOriginal = standardDeviation(scope.data, index);
                    scope.varianceOriginal = variance(scope.data, index);
                    scope.numOriginal = numberOfValues(scope.data, index);
                }
        }
    
        //calculate the mean of a timeseries / do we need that for both or only the maipulated TS? Right now working for the manipulated only
        function mean(data, index) {
            var mean;
            var sum = 0;
    
            //iterate over the outer array and calculate the mean for each contained array
            sum = data[index].y.reduce(function(sum, value){
                return sum + value;
                }, 0);
            mean = sum / data[index].y.length;

            return mean;
        }

        //helper for the standrad deviation method
        function average(data){
            var sum = data.reduce(function(sum, value){
              return sum + value;
            }, 0);
          
            var avg = sum / data.length;
            return avg;
        }

        //calculate the standard deviation for the timeseries
        function standardDeviation(data, index) {
            var sd;
            var tsValues;

            tsValues = data[index].y;
            var avg = average(tsValues);

            var squareDiffs = tsValues.map(function (val) {
                var diff = val - avg;
                var sqrDiff = diff * diff;
                return sqrDiff;
            });

            var avgSquareDiff = average(squareDiffs);

            sd = Math.sqrt(avgSquareDiff);
            return sd;
        }



        function variance(data, index) {
            var variance;
            var yvals;

            yvals = data[index].y;
            var avg = average(yvals);
            
            var sq_diff = yvals.map(function(values)
            {
                var squared_diff = (values - avg) * (values - avg);
                return squared_diff;
            });
            
            variance = average(sq_diff);
            return variance;
        }

        //calculate the minimum of the timeseries
        function min(data, index) {
            var min;

            min = data[index].y.reduce(function(a,b) {
                return Math.min(a,b)
            })
            return min;
        }

        //calculate the maximum of the timeseries
        function max(data, index) {
            var max;

            max = data[index].y.reduce(function(a,b) {
                return Math.max(a,b)
            })
            return max;
        }

        function numberOfValues(data, index) {
            var count;
            //Using x in case y values are absent or missing
            count = data[index].x.length

            return count;
        }
    }

})();
