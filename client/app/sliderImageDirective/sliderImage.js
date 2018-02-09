
/*
This directive is for a slider image comparison. Two images will be loaded, one above the other, and it will be able to view differences by sliding over the images.
use this directive with as follows:
######################################
in the .js-file:

$scope.images = {
		image1: "/url/to/img1",
		image2: "/url/to/img2"
}
######################################
in the .html-file:

<slide-image-comparison info="images"></slide-image-comparison>

*/


angular
.module('starter.slideImageComparison')
.directive('slideImageComparison', function($window) {

	function switchImages(scope) {
			scope.imageInfo = {
					image1: scope.imageInfo.image2,
					image2: scope.imageInfo.image1
			}
	}

	function moveOver(handle, resized, container, clicked) {

		var move = {};

		var divideWidth = handle.prop('offsetWidth'),
			containerOffsetLeft = $('.slide-comb').offset().left, // container.prop('offsetLeft'),
			containerOffsetTop = container.prop('offsetTop'),
			containerWidth = container.prop('offsetWidth');

		var moveSlide = function(e) {

			var pageX = e.pageX || e.targetTouches[0].pageX;
			var pageY = e.pageY || e.targetTouches[0].pageY;

			move = {
				left: pageX - containerOffsetLeft,
				top: pageY - containerOffsetTop
			};

			moveWidth = ((move.left)*100/containerWidth)-100;
			if (moveWidth < 0) {
					moveWidth = ((move.left)*100/containerWidth);
			}
			moveWidth = moveWidth+'%';

			handle.css({
				left: moveWidth
			});
			resized.css({
				width: moveWidth
			});

		}

		// onClick move - second click stop move
		container[0].addEventListener('click', function() {
				if (clicked == true) {
						container[0].removeEventListener('mousemove', moveSlide, false);
						clicked = false;
				} else {
						container[0].addEventListener('mousemove', moveSlide, false);
						clicked = true;
				}
		}, false);
		// container[0].addEventListener('drag', moveSlide, false);

	}

	return {
		restrict: 'E',
		scope: {
			imageInfo: '=info'
		},
		link: function(scope, elem, attr) {
        		var w = angular.element($window);

			   var container = angular.element(elem[0].querySelector('.slide-comb'));

			// Adjust resize image
			var resized = angular.element(elem[0].querySelector('.resized'));
			var resizedImage = elem[0].querySelector('.resized img');
			angular.element(resizedImage).css({
				width: container.prop('offsetWidth')+'px'
			})

			// Change resized image width on window resize
			w.bind('resize', function () {
				angular.element(resizedImage).css({
					width: container.prop('offsetWidth')+'px'
				})
			});

			// Get divider
			var divider = angular.element(elem[0].querySelector('.divider'));
			var clicked = false;

			// Bind move event
			moveOver(divider, resized, container, clicked);

		},
		templateUrl: 'app/sliderImageDirective/sliderImage.html'
	};

	
});
