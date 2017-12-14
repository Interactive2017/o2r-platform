(function(){
    'use strict';

    angular
        .module('starter')
        .controller('mainCompareController', mainCompareController);

    mainCompareController.$inject = ['$scope', '$log', 'erc', 'icons'];
    function mainCompareController($scope, $log, erc, icons){

        // TODO: make sure that page is loaded completely

        var logger = $log.getInstance('mainCompare');
        var compare = erc;
        var vm = this;
        vm.selectedTab = 0;
        vm.figures = compare.metadata.o2r.interaction;
        logger.info(vm.figures);
        
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

        // At the beginning the first figure is loaded
        vm.compareType = compare.metadata.o2r.interaction[0].type;
        vm.widgets = compare.metadata.o2r.interaction[0].widgets;
        logger.info(vm.widgits);

        // TODO:
        /** Initial slider configuration */
         // auf typ checken bevor ich die in das neue array mit aufnehme
         vm.slider = {
            value: 200,
            options: {
                floor: 0,
                ceil: 500
            }
        };


        $scope.icons = icons;

        //when another tab/figure has been selected by the user
        $scope.$watch('vm.selectedTab', function(newVal, oldVal){
            //logger.info('Tab changed to object: %s', newVal);
            // newVal is the array index of the current figure

            //TODO set new comparison type
            $scope.compareType = "map"; 


            //TODO build new sliders

            //TODO draw new visualization?


        });


        $scope.changeVisualization = function(type){
            // todo show visualization
        };
    }
})()