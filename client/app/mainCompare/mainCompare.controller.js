(function(){
    'use strict';

    angular
        .module('starter')
        .controller('mainCompareController', mainCompareController);

    mainCompareController.$inject = ['$scope', '$log', 'erc', 'icons', 'httpRequests', '$window', '$mdDialog'];
    function mainCompareController($scope, $log, erc, icons, httpRequests, $window, $mdDialog){

        var logger = $log.getInstance('mainCompare');
        var vm = this;
        vm.initialTab = 0;
        vm.selectedTab = 0;
        vm.type = 'Side-by-side';
        vm.combinedTimeseriesData = [];
        var compare = erc;
        var first = true;
        $scope.icons = icons;   
        vm.figures = compare.metadata.o2r.interaction;  
        
        vm.layout = {title: "Combined plot",
                   xaxis: {
                       rangeslider:{}
                   }
       };
        
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


        vm.data = [{
            x: [2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013],
            y: [4,1,5,17,10,3,10,15,12,11,9,7,1]
           },{
           x: [2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013],
           y: [11,12,15,1,5,10,14,12,18,4,18,15,10]
           }];
     
        vm.data2 = [{
            x: [2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013],
            y: [4,1,5,17,10,11,5,6,4,11,9,7,1]
        },{
            x: [2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013],
            y: [11,12,15,1,5,10,14,12,18,4,18,15,10]
        }];
    
        vm.layout = {title: "Original plot",
                    xaxis: {
                        rangeslider:{}
                    }
        };
        vm.layout2 = {title: "Parameter changed plot",
        xaxis: {
            rangeslider:{}
        }};

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
        vm.changeVisualization = function(type){
            logger.info("Change visualization");
            
            // get visualization type 
            var activeCompareType = vm.compareType;

            var params = '{';

            // get slider value
            for(var i = 0; i < vm.sliders.length; i++){
                // TODO: these values could for exmaple be stored as key value pairs for doing the recalculation
                logger.info(vm.sliders[i].param_name);
                logger.info(vm.sliders[i].value);
                //TODO go on here
                params = params + '"' + vm.sliders[i].param_name + '":' +  vm.sliders[i].value;
                if(i < vm.sliders.length - 1) {
                    params = params + ',';
                }
                else {
                    params = params + '}';
                }
            }
            


            //call ocpu with slider params
            httpRequests.ocpuCalculate(params, vm.figures[vm.selectedTab].endpoint).then(function(linkList){
                //some regex with the response link list
                logger.info(linkList.data);
                var body = linkList.data;

                var splitBody = body.split('/');
                var ocpuID = splitBody[3];

                //call the values from ocpu when the type is "timeseries"
                if(activeCompareType == 'timeseries') {
                    httpRequests.ocpuResultsVal(ocpuID).then(function(compareValues){
                        //call the timeseries directive with the parameters from  overthe response
                        var data =  compareValues.data; //hand this to the directive
                        var originalValues = compare.metadata.o2r.interaction[vm.selectedTab].original.values;
                        if(type == 'Side-by-side') {
                            //call the side by side directive with the values
                            originalValues = compare.metadata.o2r.interaction[vm.selectedTab].original.values;
                        }
                        else {
                            //set the title of the plot to combined Plot
                            vm.layout = {title: "Combined plot",
                                        xaxis: {rangeslider:{}}
                                    };
                            //pass the timeseries itmes into a structure that plotly can handle
                            var original = parseTimeseriesJson(originalValues);
                            var newValues = parseTimeseriesJson(data)
                            var visualization = [];
                            visualization.push(original);
                            visualization.push(newValues);
                            //call the timeseries directive with the original and new values
                            vm.combinedTimeseriesData = visualization;
                        }
                        
                        logger.info(compareValues);
                    })
                }
                //if the type is "map" then the image is requested
                else {
                    httpRequests.ocpuImages(ocpuID).then(function(compareImage){
                        //do something with the image
                        var image = compareImage.data; //hand this over to the image directive
                        logger.info(compareImage);
                        if(type == 'Side-by-side') {
                            //call the side by side directive with the image
                            var originalImage = compare.metadata.o2r.interaction[selectedTab].original.image; //this is just the path to ocpu

                        }
                        else if(type == 'Overlay') {
                            //call the Hans apporach with the image
                        }
                        else {
                            //Peephole image stuff
                        }
                    })
                }
                
            });

            
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

        
        /**
         * Parse the data to a format that the timeseries directive can use it
         * @param {Object} data received from the ocpu
         */
        function parseTimeseriesJson(data) {

            var inner = data[0];
            var x = [];
            var y = [];

            for(var elem in inner) {
                x.push(inner[elem].x);
                y.push(inner[elem].y);
            }
            var xyJson = {x,y}
            return xyJson;

        }

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
