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
        vm.changedTimeseries = [
            {
              "Point Forecast": 4.7615,
              "Lo 80": 5.4562,
              "Hi 80": 5.0668,
              "Lo 95": 4.2946,
              "Hi 95": 5.2284,
              "_row": "Jun 2004"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 5.2554,
              "Hi 80": 5.2675,
              "Lo 95": 3.9875,
              "Hi 95": 5.5354,
              "_row": "Jul 2004"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 5.1142,
              "Hi 80": 5.4088,
              "Lo 95": 3.7715,
              "Hi 95": 5.7514,
              "_row": "Aug 2004"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 4.9987,
              "Hi 80": 5.5243,
              "Lo 95": 3.5949,
              "Hi 95": 5.9281,
              "_row": "Sep 2004"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 4.8985,
              "Hi 80": 5.6245,
              "Lo 95": 3.4416,
              "Hi 95": 6.0813,
              "_row": "Oct 2004"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 4.8088,
              "Hi 80": 5.7142,
              "Lo 95": 3.3044,
              "Hi 95": 6.2185,
              "_row": "Nov 2004"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 4.7268,
              "Hi 80": 5.7961,
              "Lo 95": 3.1791,
              "Hi 95": 6.3439,
              "_row": "Dec 2004"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 4.6509,
              "Hi 80": 5.8721,
              "Lo 95": 3.0629,
              "Hi 95": 6.46,
              "_row": "Jan 2005"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 4.5798,
              "Hi 80": 5.9431,
              "Lo 95": 2.9543,
              "Hi 95": 6.5687,
              "_row": "Feb 2005"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 4.5128,
              "Hi 80": 6.0102,
              "Lo 95": 2.8518,
              "Hi 95": 6.6712,
              "_row": "Mar 2005"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 4.4492,
              "Hi 80": 6.0738,
              "Lo 95": 2.7545,
              "Hi 95": 6.7685,
              "_row": "Apr 2005"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 4.3885,
              "Hi 80": 6.1344,
              "Lo 95": 2.6617,
              "Hi 95": 6.8612,
              "_row": "May 2005"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 4.3304,
              "Hi 80": 6.1925,
              "Lo 95": 2.5729,
              "Hi 95": 6.9501,
              "_row": "Jun 2005"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 4.2746,
              "Hi 80": 6.2483,
              "Lo 95": 2.4875,
              "Hi 95": 7.0355,
              "_row": "Jul 2005"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 4.2208,
              "Hi 80": 6.3022,
              "Lo 95": 2.4052,
              "Hi 95": 7.1177,
              "_row": "Aug 2005"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 4.1688,
              "Hi 80": 6.3541,
              "Lo 95": 2.3257,
              "Hi 95": 7.1972,
              "_row": "Sep 2005"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 4.1185,
              "Hi 80": 6.4045,
              "Lo 95": 2.2487,
              "Hi 95": 7.2742,
              "_row": "Oct 2005"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 4.0696,
              "Hi 80": 6.4533,
              "Lo 95": 2.174,
              "Hi 95": 7.3489,
              "_row": "Nov 2005"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 4.0221,
              "Hi 80": 6.5008,
              "Lo 95": 2.1014,
              "Hi 95": 7.4215,
              "_row": "Dec 2005"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 3.9759,
              "Hi 80": 6.547,
              "Lo 95": 2.0307,
              "Hi 95": 7.4922,
              "_row": "Jan 2006"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 3.9309,
              "Hi 80": 6.5921,
              "Lo 95": 1.9618,
              "Hi 95": 7.5611,
              "_row": "Feb 2006"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 3.8869,
              "Hi 80": 6.636,
              "Lo 95": 1.8946,
              "Hi 95": 7.6284,
              "_row": "Mar 2006"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 3.844,
              "Hi 80": 6.679,
              "Lo 95": 1.8289,
              "Hi 95": 7.694,
              "_row": "Apr 2006"
            },
            {
              "Point Forecast": 4.7615,
              "Lo 80": 3.8019,
              "Hi 80": 6.721,
              "Lo 95": 1.7646,
              "Hi 95": 7.7583,
              "_row": "May 2006"
            }
          ];
        vm.changedMap = 'http://tikalon.com/blog/O18_isotope.jpg';
        
        
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

            // get slider value
            for(var slider in vm.sliders){
                // TODO: these values could for exmaple be stored as key value pairs for doing the recalculation
                logger.info(vm.sliders[slider].param_name);
                logger.info(vm.sliders[slider].value);
            }
            
            
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