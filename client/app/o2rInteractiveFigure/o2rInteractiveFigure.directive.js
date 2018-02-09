(function(){
    'use strict';

    angular
        .module('starter.o2rInteractiveFigure')
        .directive('o2rInteractiveFigure', o2rInteractiveFigure);
    
    o2rInteractiveFigure.$inject = ['$log', 'httpRequests', 'icons'];
    function o2rInteractiveFigure($log, httpRequests, icons){
        return {
            restrict: 'E',
            templateUrl: 'app/o2rInteractiveFigure/o2rInteractiveFigure.template.html',
            scope: {
                figure: '=o2rFigure'
            },
            link: link
        };

        ///////

        function link(scope, element, attrs){
            var logger = $log.getInstance('o2rInteractiveFigure');
            logger.info('running directive');

            scope.compareType = scope.figure.type;
            scope.initializeSlider = initializeSlider;
            scope.initializeSlider();

            scope.maptype = 'Side-by-side';
            scope.timeseriestype = 'Side-by-side';
            scope.changeMapType = changeMapType;
            scope.changeTsType = changeTsType;
            var first = true;

            scope.icons = icons;
            // prepare all timeseries values to fit to required structure
            if(scope.figure.type == 'timeseries') {
                scope.figure.original.values = [parseTimeseriesJson(scope.figure.original.values)];
            }
            scope.combinedTimeseriesData = scope.figure.original.values;
            scope.layout = {
                title: "Combined plot",
                xaxis: {
                    rangeslider:{}
                }
            };

            // compare type selction types
            scope.mapCompareTypes = [
                "Side-by-side",
                "Overlay",
                "Peephole"
            ];
            scope.tsCompareTypes = [
                "Side-by-side",
                "Combined"
            ];

            // function to initialize the slider; create metatdata needed for slider
            function initializeSlider(){
                scope.sliders = scope.figure.widgets;
                var notSlider = [];
                for(var slider in scope.sliders){
                    if(scope.sliders[slider].type == "slider"){
                        scope.sliders[slider].value = scope.sliders[slider].default_value; // set default value
                        scope.sliders[slider].options = {
                            floor: scope.sliders[slider].min_value, 
                            ceil: scope.sliders[slider].max_value, 
                            step: scope.sliders[slider].steps_size, 
                            precision: 10 
                        }; // set min value
                    } else {
                        notSlider.unshift(slider);
                    }
                }
                for(var del in notSlider){
                    scope.sliders.splice(notSlider[del], 1);
                }
            }

            function changeTsType(type){
                scope.timeseriestype = type;
            }

            function changeMapType(type){
                scope.maptype = type;
            }

            scope.overlayOnTop = "overlay on top";
            scope.switchImages = function() {
                scope.images = {
                    image1: scope.images.image2,
                    image2: scope.images.image1
                };
                if (scope.overlayOnTop == "original on top") {
                    scope.overlayOnTop = "overlay on top";
                } else {
                    scope.overlayOnTop = "original on top";
                }
            }

            // function to show comparison visulization
            scope.changeVisualization = function(type){
                logger.info("Change visualization");
                scope.overlayImage = 'unloaded';
                // get visualization type
                var activeCompareType = scope.compareType;

                var params = '{';

                // get slider value
                for(var i = 0; i < scope.sliders.length; i++){
                    // TODO: these values could for exmaple be stored as key value pairs for doing the recalculation
                    logger.info(scope.sliders[i].param_name);
                    logger.info(scope.sliders[i].value);
                    //TODO go on here
                    params = params + '"' + scope.sliders[i].param_name + '":' +  scope.sliders[i].value;
                    if(i < scope.sliders.length - 1) {
                        params = params + ',';
                    }
                    else {
                        params = params + '}';
                    }
                }


                //call ocpu with slider params
                httpRequests.ocpuCalculate(params, scope.figure.endpoint).then(function(linkList){
                    //some regex with the response link list
                    // logger.info(linkList.data);
                    var body = linkList.data;

                    var splitBody = body.split('/');
                    var ocpuID = splitBody[3];

                    //call the values from ocpu when the type is "timeseries"
                    if(activeCompareType == 'timeseries') {
                        httpRequests.ocpuResultsVal(ocpuID).then(function(compareValues){
                            //call the timeseries directive with the parameters from the response
                            scope.modifiedFigure =  [parseTimeseriesJson(compareValues.data)]; //hand this over to the directive
                            var originalValues = scope.figure.original.values;
                            //set the title of the plot to combined Plot
                            scope.layout = {
                                title: "Combined plot",
                                xaxis: {rangeslider:{}}
                            };
                            //pass the timeseries itmes into a structure that plotly can handle
                            var visualization = [originalValues[0], scope.modifiedFigure[0]];
                            //call the timeseries directive with the original and new values
                            scope.combinedTimeseriesData = visualization;
                        })
                    }
                    //if the type is "map" then the image is requested
                    else {
                        httpRequests.ocpuImages(ocpuID).then(function(compareImage){
                            //do something with the image
                            var img = new Image();
                            img.src = compareImage.config.url;    // compareImage.data
                            scope.modifiedFigure = img.src;
                            img.onload = function() {
                                var canvas, ctx, dataURL, base64;
                                canvas = document.createElement("canvas");
                                ctx = canvas.getContext("2d");
                                canvas.width = img.width;
                                canvas.height = img.height;
                                ctx.drawImage(img, 0, 0);
                                dataURL = canvas.toDataURL("image/png");
                                scope.modifiedFigure = dataURL;

                                // logger.info(compareImage);
                                if(type == 'Side-by-side') {
                                    //call the side by side directive with the image
                                    var originalImage = scope.figure.original.image; //this is just the path to ocpu

                                }
                                else if(type == 'Overlay') {
                                    //call the Hans apporach with the image
                                    var originalImage = scope.figure.original.image // original image for comparison // "data:image/png;base64, " +
                                    var overlayImage = scope.modifiedFigure // overlay image for comparison

                                    scope.images = {
                                            image1: originalImage,
                                            image2: overlayImage
                                    }

                                    // console.log(scope.overlayImage);

                                    scope.overlayImage = 'loaded';
                                    // console.log(scope.overlayImage);
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
            // scope.$watch('selectedTab', function(newVal, oldVal){  /** another tab/figure has been selected by the user */

            //         logger.info("Changed Tab", newVal);
            //         scope.selectedTab = newVal;

            //         // set new comparison type
            //         scope.compareType = compare.metadata.o2r.interaction[scope.selectedTab].type;
            //         if (scope.compareType == 'timeseries') {
            //             scope.modifiedFigure = scope.figures[scope.selectedTab].original.values;
            //         } else {
            //             scope.modifiedFigure = scope.figures[scope.selectedTab].original.image;
            //         }

            //         // build new sliders
            //         scope.initializeSlider(scope.selectedTab);

            //         //TODO draw new visualization?
            //         //scope.changeVisualization();

            // });
        }
    }
})();