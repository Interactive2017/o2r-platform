(function(){
    'use strict';

    angular
        .module('starter')
        .controller('mainCompareController', mainCompareController);

    mainCompareController.$inject = ['$scope', '$log', 'erc', 'icons'];
    function mainCompareController($scope, $log, erc, icons){

        var logger = $log.getInstance('mainCompare');
        var vm = this;
        vm.initialTab = 0;
        var compare = erc;
        var first = true;
        $scope.icons = icons;   
        vm.figures = compare.metadata.o2r.interaction;                
        
        
        // compare type selction types
        $scope.mapCompareTypes = [
            "Side-by-side",
            "Overlay",
            "Peephole"
        ];
        $scope.tsCompareTypes = [
            "Side-by-side",
            "Combined"
        ];

        // function to initialize the slider
        $scope.initializeSlider = function(figure){
            vm.widgets = compare.metadata.o2r.interaction[figure].widgets;
            for(var widget in vm.widgets){
                vm.widgets[widget].value = vm.widgets[widget].default_value; // set default value
                vm.widgets[widget].options = {floor: vm.widgets[widget].min_value, ceil: vm.widgets[widget].max_value }; // set min value
            }
        }

        // function to show comparison visulization
        $scope.changeVisualization = function(type){
            // TODO show visualization
        };
        

        // Load figure when tab was changed
        /** another tab/figure has been selected by the user */
        $scope.$watch('vm.selectedTab', function(newVal, oldVal){
            if(first){
                first = false;
            }else if (!first){
                logger.info("Changed Tab");

                // set new comparison type
                vm.compareType = compare.metadata.o2r.interaction[newVal].type;            

                // build new sliders
                $scope.initializeSlider(newVal);

                //TODO draw new visualization?
                //$scope.changeVisualization();
            }
        });

        
    }
})()