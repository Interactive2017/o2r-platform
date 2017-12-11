(function(){
    'use strict';

    angular
        .module('starter.o2rTimeseries')
        .directive('o2rTimeseries', o2rTimeseries);

    o2rTimeseries.$inject = [];
    function o2rTimeseries(){
        return{
			restrict: 'E',
            templateUrl: 'app/o2rTimeseries/o2rTimeseries.template.html',
            link: link  
            // scope: {
            //     data: '=o2rData',
            //     layout = '=o2rTitle'
        }

    }

    function link(scope, element, attrs){
        var title;
        // attrs.$observe('data', function(value){
        //     scope.data = angular.fromJson(value);   
        // });

        // attrs.$oberve('title', function(value) {
        //     title = angular.fromJson(value);
        // })

        scope.data = [{
            x: [1, 2, 3, 4, 5],
            y: [1, 2, 4, 8, 16]
        }]
        scope.layout = {title: title};
        scope.options = {showLink: false, displayLogo: false};
    }
})();