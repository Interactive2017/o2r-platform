(function(){
    'use strict';

    angular
        .module('starter')
        .directive('mainCompare', mainCompare);

    mainCompare.$inject = ['$log', 'icons'];
    function mainCompare($log, icons){
        return{
            restrict: 'E',
            templateUrl: 'app/mainCompare/mainCompare.template.html',
            scope: {
                compare: '&'
            },
            link: link
        };

        function link(scope, iElement, attrs){

        }
    }

})();