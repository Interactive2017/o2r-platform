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
        vm.selectedTab = 0;
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
        vm.initializeSlider = function(figure){
            vm.widgets = compare.metadata.o2r.interaction[figure].widgets;
            for(var widget in vm.widgets){
                vm.widgets[widget].value = vm.widgets[widget].default_value; // set default value
                vm.widgets[widget].options = {floor: vm.widgets[widget].min_value, ceil: vm.widgets[widget].max_value, step: vm.widgets[widget].steps_size, precision: 10 }; // set min value
            }
        }

        // function to show comparison visulization
        vm.changeVisualization = function(){
            logger.info("Change visualization");

            // get visualization type 
            var activeCompareType = vm.compareType;

            // TODO: how to get slider values??????
            
            
            // ===== TODO calculate and show visualization =============
        };
        

        // Load figure when tab was changed
        $scope.$watch('vm.selectedTab', function(newVal, oldVal){  /** another tab/figure has been selected by the user */
            
                logger.info("Changed Tab");
                vm.selectedTab = newVal;

                // set new comparison type
                vm.compareType = compare.metadata.o2r.interaction[vm.selectedTab].type;            

                // build new sliders
                vm.initializeSlider(vm.selectedTab);

                //TODO draw new visualization?
                //vm.changeVisualization();
            
        });

        
    }
})()