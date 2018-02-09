(function(){
    'use strict';

    angular
        .module('starter')
        .controller('mainCompareController', mainCompareController);

    mainCompareController.$inject = ['$scope', '$log', 'erc', 'icons', 'httpRequests', '$window'];
    function mainCompareController($scope, $log, erc, icons, httpRequests, $window){

        var logger = $log.getInstance('mainCompare');
        logger.info('starting controller');
        var vm = this;
        vm.initialTab = 0;
        vm.selectedTab = 0;
        vm.figures = erc.metadata.o2r.interaction;
        vm.ercId = erc.id;

    }
})();
