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
                figure: '=o2rFigure',
                ercId: '@ercid'
            },
            link: link
        };

        ///////

        function link(scope, element, attrs){
            var logger = $log.getInstance('o2rInteractiveFigure');
            logger.info('running directive');
            var downloadData;
            scope.compareType = scope.figure.type;
            scope.initializeSlider = initializeSlider;
            scope.initializeSlider();
            scope.modifiedFigure = scope.figure.modifiedFigure;

            scope.maptype = 'Side-by-side';
            scope.timeseriestype = 'Side-by-side';
            scope.changeMapType = changeMapType;
            scope.changeTsType = changeTsType;
            scope.download = download;
            var first = true;
            //define variable for the loading animation
            scope.loading = false;

            scope.images = {
                image1: scope.figure.original.image,
                image2: scope.figure.original.image
            }

            scope.icons = icons;
            // prepare all timeseries values to fit to required structure
            if(scope.figure.type == 'timeseries' 
            && Array.isArray(scope.figure.original.values[0])) {
                logger.info('parseTimeSeries');
                scope.figure.original.values = [parseTimeseriesJson(scope.figure.original.values)];
            }
            scope.combinedTimeseriesData = scope.figure.original.values;
            scope.layout = {
                xaxis: {
                    title: scope.figure.x_axis_label
                },
                yaxis: {
                    title: scope.figure.y_axis_label
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

            scope.overlayOnTop = "overlay left";
            scope.switchImages = function() {
                scope.images = {
                    image1: scope.images.image2,
                    image2: scope.images.image1
                };
                if (scope.overlayOnTop == "original left") {
                    scope.overlayOnTop = "overlay left";
                } else {
                    scope.overlayOnTop = "original left";
                }
            }

            // function to show comparison visulization
            scope.changeVisualization = function(type){
                logger.info("Change visualization");
                // get visualization type
                var activeCompareType = scope.compareType;

                //set the variable for the loading animation
                scope.loading = true;

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

                downloadData = JSON.parse(params);


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
                            scope.figure.modifiedFigure =  [parseTimeseriesJson(compareValues.data)]; //hand this over to the directive
                            scope.modifiedFigure = scope.figure.modifiedFigure;
                            var originalValues = scope.figure.original.values;
                            //set the title of the plot to combined Plot
                            // scope.layout = {
                            //     title: "Combined plot",
                            //     xaxis: {rangeslider:{}}
                            // };
                            //pass the timeseries itmes into a structure that plotly can handle
                            var visualization = [originalValues[0], scope.modifiedFigure[0]];
                            //call the timeseries directive with the original and new values
                            scope.combinedTimeseriesData = visualization;
                            //stop loading animation                            
                            scope.loading = false;
                        })
                    }
                    //if the type is "map" then the image is requested
                    else {
                        httpRequests.ocpuImages(ocpuID).then(function(compareImage){
                            var img = new Image();
                            img.src = compareImage.config.url;    // compareImage.data
                            scope.figure.modifiedFigure = img.src;
                            scope.modifiedFigure = scope.figure.modifiedFigure;
                            scope.images = {
                                image1: scope.figure.original.image,
                                image2: scope.modifiedFigure
                            };
                            //stop loading animation
                            scope.loading = false;                            
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

            function download(){
                var paramText = "";
                paramText += "figure data:";

                for (var slider in scope.sliders) {
                    paramText += " \n \nparameter : " + scope.sliders[slider].param_name;
                    paramText += " \n \noriginal value:" + scope.sliders[slider].default_value;
                    paramText += " \ndescription : " + scope.sliders[slider].description;
                    paramText += " \nminimum value : " + scope.sliders[slider].min_value;
                    paramText += " \nmaximum value : " + scope.sliders[slider].max_value;
                    paramText += " \nstep size : " + scope.sliders[slider].steps_size;
                }

                if (downloadData == undefined) {
                    paramText += " \n \nno modified figure calculated";
                } else {
                    paramText += " \nmodified value:";
                    var downloadParams = downloadData;
                    for (var k in downloadParams) {
                        paramText += " \n" + k + " : " + downloadParams[k]; 
                    }
                }
    
                if(scope.compareType == "timeseries"){
                    // Downlaod timeseries
                    Plotly.toImage(document.getElementsByClassName("js-plotly-plot").item(0), {format: 'png', width: 800, height: 600})
                    .then(function(dataUrl01) {
                        var zip = new JSZip();
                        zip.file("parameters.txt", paramText);
                        var img = zip.folder("images");
                        var base64_original = dataUrl01.replace(/^data:image\/(png|jpg);base64,/, "");
                        img.file("original.png", base64_original, {base64: true});
                        // if parameter was changed add modified figure to zip file
                        if(angular.isDefined(scope.modifiedFigure)){
                            Plotly.toImage(document.getElementsByClassName("js-plotly-plot").item(1), {format: 'png', width: 800, height: 600})
                            .then(function(dataUrl02) {
                                
                                var base64_modified = dataUrl02.replace(/^data:image\/(png|jpg);base64,/, "");
                                img.file("modified.png", base64_modified, {base64: true});
                                
                                zip.generateAsync({type:"blob"})
                                .then(function(content) {
                                    var figureName = scope.figure.figure_id;
                                    // see FileSaver.js
                                    saveAs(content, scope.ercId+"_" + figureName + "_figure.zip");
                                });
                            });
                        } else {
                            zip.generateAsync({type:"blob"})
                                .then(function(content) {
                                    var figureName = scope.figure.figure_id;
                                    // see FileSaver.js
                                    saveAs(content, scope.ercId+"_" + figureName + "_figure.zip");
                                });
                        }
                        // download functionality (maybe need to use https://github.com/jimmywarting/StreamSaver.js for big files)
                    })
                } else {
                    //create zip containing a text file (parameter values) and images
                    var zip = new JSZip();
                    zip.file("parameters.txt", paramText);
                    var img = zip.folder("images");
    
                    var base64_original = scope.figure.original.image.replace(/^data:image\/(png|jpg);base64,/, "");
                    img.file("original.png", base64_original, {base64: true});
                    // if a parameter was changed, add the modified map to zip file
                    if(scope.modifiedFigure){
                        var base64_manipulated = scope.modifiedFigure.replace(/^data:image\/(png|jpg);base64,/, "");
                        img.file("manipulated.png", base64_manipulated, {base64: true});
                        zip.generateAsync({type:"blob"})
                        .then(function(content) {
                            var figureName = scope.figure.figure_id;
                            // see FileSaver.js
                            saveAs(content, scope.ercId+"_" + figureName + "_figure.zip");
                        });
                    } else {
                        // download functionality (maybe need to use https://github.com/jimmywarting/StreamSaver.js for big files)
                        zip.generateAsync({type:"blob"})
                        .then(function(content) {
                            var figureName = scope.figure.figure_id;
                            // see FileSaver.js
                            saveAs(content, scope.ercId+"_" + figureName + "_figure.zip");
                        });
                    }
                    
    
                }
            }
        }
    }
})();