(function(){
    'use strict';

    angular
        .module('starter')
        .controller('mainCompareController', mainCompareController);

    mainCompareController.$inject = ['$scope', '$log', 'erc', 'icons'];
    function mainCompareController($scope, $log, erc, icons){
        var logger = $log.getInstance('mainCompare');
        var compare = erc;
        $log.info('hello');
        var vm = this;
        vm.selectedTab = 0;
        vm.figures = compare.metadata.o2r.interaction;


        /** Initial compare type selection */
        $scope.mapCompareTypes = [
            "Side-by-side",
            "Overlay",
            "Peephole"
        ];
        $scope.tsCompareTypes = [
            "Side-by-side",
            "Combined"
        ];
        //todo vm.compareType = compare.metadata.o2r.interaction[0].type;
        vm.compareType = "map";

        /** Initial slider configuration */
        /**
         // auf typ checken bevor ich die in das neue array mit aufnehme
         vm.priceSlider = {
            value: 200,
            options: {
                floor: 0,
                ceil: 500
            }
        };
         */


        $scope.icons = icons;

        //when another tab/figure has been selected by the user
        $scope.$watch('vm.selectedTab', function(newVal, oldVal){
            //logger.info('Tab changed to object: %s', newVal);
            // newVal is the array index of the current figure

            //todo set new comparison type
            $scope.compareType = "map"; 


            //todo build new sliders

            //todo draw new visualization?


        });


        $scope.changeVisualization = function(type){
            // todo show visualization
        };
    }
})()