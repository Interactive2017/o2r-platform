(function(){
    'use strict';

  	/*
  		Directive for transporting two images for slider comparison.
  		This directive uses the sliderImageComparison directive to show an image overlayed by another for comparison.
  		o2r-image-path-original, o2r-image-path-overlay must be a String that contains the path to an image file.

  		Example:
  		<o2r-slider-image-comparison o2r-image-path-original="foo/bar" o2r-image-path-overlay="foo/bar"></o2r-substitute-magnify>
  	*/
    angular
        .module('starter.o2rSliderImageComparison', [])
        .directive('o2rSliderImageComparison', o2rSliderImageComparison);

    o2rSliderImageComparison.$inject = ['$stateParams', '$log', '$mdDialog', 'icons'];
    function o2rSliderImageComparison($stateParams, $log, $mdDialog, icons){
        return{
    			restrict: 'E',
    			templateUrl: 'app/o2rSliderImageComparison/o2rSliderImageComparison.template.html',
    			scope: {
    				o2rImagePathOriginal: '@',
    				o2rImagePathOverlay: '@'
    			},
    			link: link
    		};

        function link(scope, iElemtn, attrs) {
            var logger = $log.getInstance('ErcCtrl');

            attrs.$observe('o2rImagePathOriginal', function(val_) {
    				    if(val_ != '') {

                    scope.icons = icons;
                    logger.info('slider image comparison view with images original [%s] and overlay [%s]', scope.o2rImagePathOriginal, scope.o2rImagePathOverlay);

                    scope.images = {
                        image1: scope.o2rImagePathOriginal,
                        image2: scope.o2rImagePathOverlay
                    }

                    scope.switchImages = switchImages;
                    scope.cancel = cancel;

                    /////

                    function switchImages () {
                        scope.images = {
                            image1: scope.images.image2,
                            image2: scope.images.image1
                        }
                    };

                    function cancel () {
                        $mdDialog.cancel();
                    };                    

                    function download() {
                        
                            //create zip containing a text file (parameter values) and images
                            var zip = new JSZip();
                            zip.file("parameters.txt", "Test parameters");
                            var img = zip.folder("images");
                            var image = $.get("/../../img/deutschland01.png");
                            img.file("deutschland.png", image);
                        
                            console.log("test");
                            
                            // download functionality (maybe need to use https://github.com/jimmywarting/StreamSaver.js for big files)
                            zip.generateAsync({type:"blob"})
                            .then(function(content) {
                                // see FileSaver.js
                                saveAs(content, "example.zip");
                            });
                    }
                        scope.download = download;
                }
            })
        }

        
    }
})(window.angular)


