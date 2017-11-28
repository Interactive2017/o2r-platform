(function(){
    'use strict';

    angular
        .module('starter')
        .controller('mainCompareController', mainCompareController);

    mainCompareController.$inject = ['$scope', '$log', 'erc', 'icons'];
    function mainCompareController($scope, $log, erc, icons){
        var compare = erc;
        $log.info('hello');
        var vm = this;
        vm.selectedTab = 0;

        //vm.compareType = compare.metadata.o2r.interaction[0].type;
        vm.compareType = "map";

        vm.icons = icons;

        $scope.$watch('vm.selectedTab', function(newVal, oldVal){
            $log.debug('Tab changed to object: %s', newVal);

            var newObj = {};
            newObj.code = [compare.metadata.o2r.interaction.ui_binding[newVal].underlyingCode];
            newObj.data = [compare.metadata.o2r.interaction.ui_binding[newVal].underlyingData];

            $scope.$parent.vm.mSetCodeData(newObj);
        });

        vm.figures = compare.metadata.o2r.interaction.ui_binding;

        $scope.changeVisualization = function(type){

        }
    }

})();