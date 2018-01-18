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
            scope.mean = mean(scope);
            scope.min = min(scope);
            scope.max = max(scope);
            scope.sd = standardDeviation(scope);
			scope.variance = variance(scope);
            scope.num = numberOfValues(scope);
            scope.download = download();
        }
    
        //calculate the mean of a timeseries / do we need that for both or only the maipulated TS? Right now working for the manipulated only
        function mean(scope) {
            var mean;
            var sum = 0;
    
            //iterate over the outer array and calculate the mean for each contained array
            for(var i = 0; i < scope.data.length; i++) {
                sum = scope.data[i].y.reduce(function(sum, value){
                    return sum + value;
                  }, 0);
                mean = sum / scope.data[i].y.length;
                //insert the value for the particular graph into the html
                return mean;
            }
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
        function standardDeviation(scope) {
            var sd;
            var tsValues;

            for(var i = 0; i < scope.data.length; i++) {
                tsValues = scope.data[i].y;
                var avg = average(tsValues);
      
                var squareDiffs = tsValues.map(function(val){
                    var diff = val - avg;
                    var sqrDiff = diff * diff;
                    return sqrDiff;
                });
                
                var avgSquareDiff = average(squareDiffs);
                
                sd = Math.sqrt(avgSquareDiff);
                }
                //insert the value for the particular graph into the html
                return sd;
            }

        

        function variance(scope) {
            var variance;
            var yvals;
			for(var i = 0; i < scope.data.length; i++)
			{
				yvals = scope.data[i].y;
				var avg = average(yvals);
				
				var sq_diff = yvals.map(function(values)
				{
					var squared_diff = (values - avg) * (values - avg);
					return squared_diff;
				});
				
				variance = average(sq_diff);
				//Inserting into HTML
				return variance;
			}
        }

        //calculate the minimum of the timeseries
        function min(scope) {
            var min;

            for(var i = 0; i < scope.data.length; i++) {
                min = scope.data[i].y.reduce(function(a,b) {
                    return Math.min(a,b)
                })
                //insert the value for the particular graph into the html
                return min;
            }
        }

        //calculate the maximum of the timeseries
        function max(scope) {
            var max;

            for(var i = 0; i < scope.data.length; i++) {
                max = scope.data[i].y.reduce(function(a,b) {
                    return Math.max(a,b)
                })
                //insert the value for the particular graph into the html
                return max;
            }
        }

        function numberOfValues(scope) {
			var count;
			for(var i = 0; i < scope.data.length; i++)
			{
				//Using x in case y values are absent or missing
				count = scope.data[i].x.length
				
				//Insert into HTML
				return count;
			}
        }

        // TODO download Plotly() is not defined --> irgendiw die funktion importieren??
        function download(){
            console.log("download");
            downloadPlotly();
        }
    }

})();
