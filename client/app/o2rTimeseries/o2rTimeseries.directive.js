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
        }
    function link(scope, element, attrs){
         scope.data = [{
             x: [1, 2, 3, 4, 5],
             y: [1, 2, 4, 8, 16]
          }]  
    }
    
    //     

    }  
})();
    