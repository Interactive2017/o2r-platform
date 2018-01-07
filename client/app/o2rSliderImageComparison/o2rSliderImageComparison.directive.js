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
                    scope.imagesInv = {
                        image1: scope.o2rImagePathOverlay,
                        image2: scope.o2rImagePathOriginal
                    }

                    scope.cancel = cancel;

                    /////

                    function cancel () {
                        $mdDialog.cancel();
                    };
                }
            })
        }
    }
})(window.angular)
