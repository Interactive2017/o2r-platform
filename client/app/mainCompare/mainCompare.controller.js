(function(){
    'use strict';

    angular
        .module('starter')
        .controller('mainCompareController', mainCompareController);

    mainCompareController.$inject = ['$scope', '$log', 'erc', 'icons', '$mdDialog'];
    function mainCompareController($scope, $log, erc, icons, $mdDialog){

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

            var params = '{';

            // get slider value
            for(var slider in vm.sliders){
                // TODO: these values could for exmaple be stored as key value pairs for doing the recalculation
                logger.info(vm.sliders[slider].param_name);
                logger.info(vm.sliders[slider].value);
                //TODO go on here
                params = params + vm.sliders[slider].param_name + '":' + '"' + vm.sliders[slider].value + '"';
            }


            //call ocpu with slider params
            //httpRequests.ocpuCalculate(params, vm.figures.endpoint);
            
            
            // ===== TODO calculate and show visualization =============
        };

        vm.sliderImageDirective = function(ev){

            // TODO: to be deleted if below TODO change and TODO implement are finished |------>
            var originalImage = "../../img/deutschland01.png";
            var overlayImage = "../../img/deutschland02.png";
            // to be deleted <------|

            // TODO change: var originalImage = compare.metadata.o2r.interaction.figure. ... // original image for comparison
            // TODO implement: var overlayImage = get/new/processed/image/path // overlay image for comparison

            $mdDialog.show({
                template: '<md-dialog aria-label="slider comparison" flex="100"><o2r-slider-image-comparison o2r-image-path-original="'+originalImage+'" o2r-image-path-overlay="'+overlayImage+'"></o2r-slider-image-comparison></md-dialog>',
                parent: angular.element(document.body),
                targetEvent: ev,
                fullscreen: true,
                clickOutsideToClose: false,
                multiple: true
            });
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
