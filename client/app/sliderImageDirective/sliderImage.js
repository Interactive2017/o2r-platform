
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

	return {
		restrict: 'E',
		scope: {
			image1:	'=o2rOriginalFigure',
			image2: '=o2rModifiedFigure'
		},
		link: function(scope, elem, attr) {
			
			scope.images = {
				image1: scope.image1,
				image2: scope.image2
			}
			scope.overlayOnTop = "modified left";

			var imageDiv = elem.find("#originalImage");
			
			imageDiv.bind('load', function() {

				var w = angular.element($window);
				var container = angular.element(elem[0].querySelector('.slide-comb'));

				container.css('height', imageDiv[0].height + 'px');

				scope.switchImages = function() {
					scope.images = {
						image1: scope.images.image2,
						image2: scope.images.image1
					};
					if (scope.overlayOnTop == "original left") {
						scope.overlayOnTop = "modified left";
					} else {
						scope.overlayOnTop = "original left";
					}
				}

				console.log($('.slide-comb'));
				console.log(container);

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
			});

			function moveOver(handle, resized, container, clicked) {

				var move = {};
		
				var divideWidth = handle.prop('offsetWidth'),
					containerOffsetTop = container.prop('offsetTop'),
					containerWidth = container.prop('offsetWidth');

				var contOffset = angular.element(elem[0].querySelector('.slide-comb'));
				var containerOffsetLeft = contOffset.offset().left;
		
				var moveSlide = function(e) {		
					var pageX = e.pageX || e.targetTouches[0].pageX;
					var pageY = e.pageY || e.targetTouches[0].pageY;

					if (pageX <= containerOffsetLeft) {
						pageX = containerOffsetLeft;
					}
					if (pageX >= (containerOffsetLeft+containerWidth)) {
						pageX = (containerOffsetLeft+containerWidth);
					}

					move = {
						left: pageX - containerOffsetLeft,
						top: pageY - containerOffsetTop
					};
					moveWidth = ((move.left)*100/containerWidth);
					moveWidth = moveWidth+'%';
		
					handle.css({
						left: moveWidth
					});
					resized.css({
						width: moveWidth
					});
		
				}
		
				handle[0].addEventListener('mousedown', function(e) {
					e.preventDefault();
					container[0].addEventListener('mousemove', moveSlide, false);
				}, false);
				container[0].addEventListener('mouseup', function() {
					container[0].removeEventListener('mousemove', moveSlide, false);
				},  false);
		
			}

		},
		templateUrl: 'app/sliderImageDirective/sliderImage.html'
	};

	
});
