(function(){
    'use strict';

    angular
        .module('starter')
        .controller('UIBindingsController', UIBindingsController);

    UIBindingsController.$inject = ['$scope', '$log', '$stateParams', 'creationObject', 'icons', '$mdDialog'];

    function UIBindingsController($scope, $log, $stateParams, creationObject, icons, $mdDialog){
        var logger = $log.getInstance('UiBindings');

        var vm = this;
        vm.icons = icons;
        vm.bindings = creationObject.getUibindings();
        vm.erc = creationObject.get();
        vm.addBinding = creationObject.addBinding;
        vm.simpleUpdate = simpleUpdate;
        vm.showError = showError;
        vm.savePackage = savePackage;
        vm.addWidget = addWidget;
        vm.required = {};
        vm.required.widgets = {};
        vm.packageData = {};
        vm.packageData.widgets = [];
        $scope.widgetModel = {};
        $scope.widgetModel.type = "slider";

        vm.tsType;

        logger.info('UploadPackageCtrl with params:', $stateParams);

        /////

        // bool: true stands for widget, false stands for figure
        function simpleUpdate(attr, val, bool){
          if (bool) {
            vm.required.widgets[attr] = val;
            logger.info('updated ', attr);
          } else {
            vm.required[attr] = val;
            if (attr == "figure_type" && val == "timeseries") {
                vm.tsType = true;
            }
            if (attr == "figure_type" && val == "map") {
                vm.tsType = false;
            }
            logger.info('updated ', attr);
          }
        };

        function showError(fieldname){
            var field = $scope.requiredForm[fieldname];

            // if tab was switched and form is invalid OR input was touched and is invalid show error message in input
            if((field.$invalid) || (field.$touched && field.$invalid)) return true;
            else return false;
        };

        function savePackage() {
            if (checkForFigureValidation()) {
                var reqData = vm.required;
                vm.packageData.figure_id = reqData.figure_id;
                vm.packageData.type = reqData.figure_type;
                vm.packageData.endpoint = reqData.figure_endpoint;
                if (vm.tsType == true) {
                    vm.packageData.x_axis_label = reqData.x_axis_label;
                    vm.packageData.y_axis_label = reqData.y_axis_label;
                    vm.packageData.x_axis_parameter = reqData.x_axis_parameter;
                    vm.packageData.y_axis_parameter = reqData.y_axis_parameter;
                }

                var addWidgetValue = addWidget();
                // check if widget inputfields are filled
                if (!addWidgetValue.bool) {
                    // check if widget array is at least filled with one object
                    if (vm.packageData.widgets.length <= 0) {
                        logger.info("Save not possible:\nWidget field:"+addWidgetValue.field+" not filled\nand no widgets were added.");
                        alert("Save not possible:\nWidget field:"+addWidgetValue.field+" not filled\nand no widgets were added before.");
                    } else {
                        logger.info(vm.packageData);
                         vm.addBinding(vm.packageData);
                         resetPackage();
                    }
                } else {
                    logger.info(vm.packageData);
                     vm.addBinding(vm.packageData);
                     resetPackage();
                }
            } else {
                logger.info("Save not possible:\nAt least one required figure inputfield is not filled.");
                alert("Save not possible:\nAt least one required figure inputfield is not filled.");
            }
        };

        function cancel() {
          resetPackage();
        };

        function addWidget() {
            var checkWidgetInput = checkForWidgetInputValues();
            if (!checkWidgetInput.bool) {
                logger.info("please fill in every widget field. At least:\n -> " + checkWidgetInput.field);
                return {bool: false, field: checkWidgetInput.field};
            } else {
              var reqData = vm.required.widgets;
              reqData.type = 'slider';
              vm.packageData.widgets.push(reqData);
              vm.required.widgets = {};
              return {bool: true};
            }
        };

        function checkForWidgetInputValues() {
            var arrayOfWidgetModels = ['default_value', 'min_value', 'max_value', 'steps_size', 'param_name', 'description']; // without 'type', because it is always = 'slider'

            for (let i=0; i< arrayOfWidgetModels.length; i++) {
                if (vm.required.widgets[arrayOfWidgetModels[i]] == undefined) {
                    return {bool: false, field: arrayOfWidgetModels[i]};
                }
            }
            return {bool: true};
        };

        function checkForFigureValidation() {
            if ($scope.requiredForm.$valid) {
                return true;
            } else {
                return false;
            }
        }

        function resetPackage() {
            vm.required = {};
            vm.packageData = {};
            vm.packageData.widgets = [];
        }

    }

})();
