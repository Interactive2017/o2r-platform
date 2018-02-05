(function(){
    'use strict';

    angular
        .module('starter')
        .controller('mainCompareController', mainCompareController);

    mainCompareController.$inject = ['$scope', '$log', 'erc', 'icons', 'httpRequests', '$window'];
    function mainCompareController($scope, $log, erc, icons, httpRequests, $window){

        var logger = $log.getInstance('mainCompare');
        logger.info('starting controller');
        var vm = this;
        vm.initialTab = 0;
        vm.selectedTab = 0;
        vm.maptype = 'Side-by-side';
        vm.timeseriestype = 'Side-by-side';
        var compare = angular.copy(erc);
        var first = true;

        $scope.icons = icons;
        vm.figures = compare.metadata.o2r.interaction;
        // prepare all timeseries values to fit to required structure
        for(var i in vm.figures){
            if(vm.figures[i].type == 'timeseries') {
                vm.figures[i].original.values = [parseTimeseriesJson(vm.figures[i].original.values)];
            };
        };
        vm.modifiedFigure = vm.figures[vm.selectedTab].original.values;
        vm.combinedTimeseriesData = vm.figures[vm.selectedTab].original.values;
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

        vm.overlayOnTop = "overlay on top";
        vm.switchImages = function() {
            vm.images = {
                image1: vm.images.image2,
                image2: vm.images.image1
            }
            if (vm.overlayOnTop == "original on top") {
                vm.overlayOnTop = "overlay on top";
            } else {
                vm.overlayOnTop = "original on top";
            }
        }

        // function to show comparison visulization
        vm.changeVisualization = function(type){
            logger.info("Change visualization");
            vm.overlayImage = 'unloaded';
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
                        //call the timeseries directive with the parameters from the response
                        vm.modifiedFigure =  [parseTimeseriesJson(compareValues.data)]; //hand this over to the directive
                        var originalValues = vm.figures[vm.selectedTab].original.values;
                        //set the title of the plot to combined Plot
                        vm.layout = {title: "Combined plot",
                                    xaxis: {rangeslider:{}}
                                };
                        //pass the timeseries itmes into a structure that plotly can handle
                        var visualization = [originalValues[0], vm.modifiedFigure[0]];
                        //call the timeseries directive with the original and new values
                        vm.combinedTimeseriesData = visualization;
                    })
                }
                //if the type is "map" then the image is requested
                else {
                    httpRequests.ocpuImages(ocpuID).then(function(compareImage){
                        //do something with the image
                        var img = new Image();
                        img.src = compareImage.config.url;    // compareImage.data
                        vm.modifiedFigure = img.src;
                        img.onload = function() {
                            var canvas, ctx, dataURL, base64;
                            canvas = document.createElement("canvas");
                            ctx = canvas.getContext("2d");
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0);
                            dataURL = canvas.toDataURL("image/png");
                            vm.modifiedFigure = dataURL;

                            logger.info(compareImage);
                            if(type == 'Side-by-side') {
                                //call the side by side directive with the image
                                var originalImage = compare.metadata.o2r.interaction[vm.selectedTab].original.image; //this is just the path to ocpu

                            }
                            else if(type == 'Overlay') {
                                //call the Hans apporach with the image
                                 var originalImage = vm.figures[vm.selectedTab].original.image // original image for comparison // "data:image/png;base64, " +
                                 var overlayImage = vm.modifiedFigure // overlay image for comparison

                                vm.images = {
                                		image1: originalImage,
                                		image2: overlayImage
                                }

                                console.log(vm.overlayImage);

                                vm.overlayImage = 'loaded';
                                console.log(vm.overlayImage);
                            }
                            else {
                                //Peephole image stuff
                            }
                          }
                    })
                }

            });


            // ===== TODO calculate and show visualization =============
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

                logger.info("Changed Tab", newVal);
                vm.selectedTab = newVal;

                // set new comparison type
                vm.compareType = compare.metadata.o2r.interaction[vm.selectedTab].type;
                if (vm.compareType == 'timeseries') {
                    vm.modifiedFigure = vm.figures[vm.selectedTab].original.values;
                } else {
                    vm.modifiedFigure = vm.figures[vm.selectedTab].original.image;
                }

                // build new sliders
                vm.initializeSlider(vm.selectedTab);

                //TODO draw new visualization?
                //vm.changeVisualization();

        });


    }
})()
