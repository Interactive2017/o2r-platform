(function(){
    'use strict';

    angular
        .module('starter')
        .controller('SliderDirectiveController', SliderDirectiveController);

    SliderDirectiveController.$inject = ['$scope', '$stateParams', '$log', '$mdDialog', 'icons'];
    function SliderDirectiveController($scope, $stateParams, $log, $mdDialog, icons){
        var logger = $log.getInstance('SliderDirectiveCtrl');
        var vm = this;

        vm.icons = icons;
        vm.cancel = cancel;

        $scope.original = "original_before_activate_scope";
        vm.original = "original_before_activate";
        $scope.overlay = "overlay_before_activate_scope";
        vm.overlay = "overlay_before_activate";

        logger.info('SliderDirectiveCtrl with params:', $stateParams);

        activate();

        ////////
        function activate() {
            console.log("activate");

            vm.original = "../../img/mammoth.png";
            vm.overlay = "../../img/penguin.png";

            // right image
            $scope.images = {
                image1: vm.original,
                image2: vm.overlay
          	}

            // left image
            $scope.imagesInv = {
                image1: vm.overlay,
                image2: vm.original
          	}

       }

        function cancel() {
          $mdDialog.cancel();
        };

    }
})()
