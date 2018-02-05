(function(){
    'use strict';

    angular
        .module('starter')
        .controller('mainCompareController', mainCompareController);

    mainCompareController.$inject = ['$scope', '$log', 'erc', 'icons', 'httpRequests', '$window'];
    function mainCompareController($scope, $log, erc, icons, httpRequests, $window){

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
        // if (vm.compareType == 'timeseries') {
        //     vm.modifiedFigure = vm.figures[vm.selectedTab].original.values;
        // } else {
        //     vm.modifiedFigure = vm.figures[vm.selectedTab].original.image;
        // }

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

            vm.downloadData = params;


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
                        vm.modifiedFigure =  compareValues.data; //hand this over to the directive
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
                            var newValues = parseTimeseriesJson(vm.modifiedFigure);
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
                        var img = new Image();
                        img.src = compareImage.config.url;    // compareImage.data

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

        vm.download = function(){
            // todo check if timeseries or map


            console.log("download");
            if(vm.compareType == "timeseries"){

                // Downlaod timeseries
                console.log(document.getElementsByClassName("js-plotly-plot").item(0));
                Plotly.toImage(document.getElementsByClassName("js-plotly-plot").item(0), {format: 'png', width: 800, height: 600})
                .then(function(dataUrl) {
                    console.log(dataUrl);

                    //create zip containing a text file (parameter values) and images
                    var zip = new JSZip();
                    zip.file("parameters.txt", JSON.stringify(vm.downloadData));
                    var img = zip.folder("images");

                    var base64 = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");

                    img.file("image.png", base64, {base64: true});

                    // download functionality (maybe need to use https://github.com/jimmywarting/StreamSaver.js for big files)
                    zip.generateAsync({type:"blob"})
                    .then(function(content) {
                        // see FileSaver.js
                        saveAs(content, "example.zip");
                    });
                })
            } else {
                // Download map

                var modifiedMap = vm.modifiedFigure;

                //create zip containing a text file (parameter values) and images
                var zip = new JSZip();
                zip.file("parameters.txt", JSON.stringify(vm.downloadData));
                var img = zip.folder("images");

                // todo
                var base64 = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");

                img.file("image.png", base64, {base64: true});

                // download functionality (maybe need to use https://github.com/jimmywarting/StreamSaver.js for big files)
                zip.generateAsync({type:"blob"})
                .then(function(content) {
                    // see FileSaver.js
                    saveAs(content, "example.zip");
                });
            }


        }

    }
})()
