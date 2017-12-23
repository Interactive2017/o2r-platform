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

        // function to initialize the slider; create metatdata needed for slider
        vm.initializeSlider = function(figure){
            vm.sliders = compare.metadata.o2r.interaction[figure].widgets;
            var notSlider = [];         
            for(var slider in vm.sliders){
                if(vm.sliders[slider].type == "slider"){
                    vm.sliders[slider].value = vm.sliders[slider].default_value; // set default value
                    vm.sliders[slider].options = {floor: vm.sliders[slider].min_value, ceil: vm.sliders[slider].max_value, step: vm.sliders[slider].steps_size, precision: 10 }; // set min value
                } else {
                    notSlider.unshift(slider);
                }
            }
            for(var del in notSlider){
                vm.sliders.splice(notSlider[del], 1);
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