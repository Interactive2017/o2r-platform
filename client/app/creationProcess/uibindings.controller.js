(function(){
    'use strict';

    angular
        .module('starter')
        .controller('UIBindingsController', UIBindingsController);

    UIBindingsController.$inject = ['$scope', '$log', 'creationObject', 'icons', '$mdDialog'];

    function UIBindingsController($scope, $log, creationObject, icons, $mdDialog){
        var logger = $log.getInstance('UiBindings');

        var vm = this;
        vm.icons = icons;

        // ------------------------------------------------------------

        vm.uploadPackage = uploadPackage;
        function uploadPackage(ev, data){
              $mdDialog.show({
                  controller: 'UploadPackageController',
                  controllerAs: 'vm',
                  templateUrl: 'app/uploadPackage/uploadPackage.html',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  fullscreen: true,
                  clickOutsideToClose: false,
                  multiple: true
              });
          }

        // ------------------------------------------------------------

    }

})();
