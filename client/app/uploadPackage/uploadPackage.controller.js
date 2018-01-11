(function(){
    'use strict';

    angular
        .module('starter')
        .controller('UploadPackageController', UploadPackageController);

    UploadPackageController.$inject = ['$scope', '$stateParams', '$log', '$mdDialog', 'icons', '$q', 'publications', 'httpRequests'];
    function UploadPackageController($scope, $stateParams, $log, $mdDialog, icons, $q, publications, httpRequests){
        var logger = $log.getInstance('UploadPackageCtrl');
        var vm = this;

        vm.icons = icons;
        vm.cancel = cancel;
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

        logger.info('UploadPackageCtrl with params:', $stateParams);

        /////

        // bool: true stands for widget, false stands for figure
        function simpleUpdate(attr, val, bool){
          if (bool) {
            vm.required.widgets[attr] = val;
            logger.info('updated ', attr);
          } else {
            vm.required[attr] = val;
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
                vm.packageData.x_axis_label = reqData.x_axis_label;
                vm.packageData.y_axis_label = reqData.y_axis_label;
                vm.packageData.x_axis_parameter = reqData.x_axis_parameter;
                vm.packageData.y_axis_parameter = reqData.y_axis_parameter;

                var addWidgetValue = addWidget();
                // check if widget inputfields are filled
                if (!addWidgetValue.bool) {
                    // check if widget array is at least filled with one object
                    if (vm.packageData.widgets.length <= 0) {
                        logger.info("Save not possible:\nWidget field:"+addWidgetValue.field+" not filled\nand no widgets were added.");
                        alert("Save not possible:\nWidget field:"+addWidgetValue.field+" not filled\nand no widgets were added before.");
                    } else {
                        logger.info(vm.packageData);
                        let passon = {
                            pkg: vm.packageData
                        }
                        savePkgToDB(passon)
                          .then(function(res) {
                              logger.info(res);
                              if (res.error == undefined) {
                                  $mdDialog.cancel();
                              } else {
                                  alert("Save not successfull.\n"+res.error+".");
                              }
                          })
                          .catch(function(err){
                              logger.info(err);
                              return {error: "SAVE metadata of choosen ERC is not possible."};
                          });
                    }
                } else {
                    logger.info(vm.packageData);
                    let passon = {
                        pkg: vm.packageData
                    }
                    savePkgToDB(passon)
                      .then(function(res) {
                          logger.info(res);
                          if (res.error == undefined) {
                              $mdDialog.cancel();
                          } else {
                              alert("Save not successfull.\n"+res.error+".");
                          }
                      })
                      .catch(function(err){
                          logger.info(err);
                          return {error: "SAVE metadata of choosen ERC is not possible."};
                      });
                }
            } else {
                logger.info("Save not possible:\nAt least one required figure inputfield is not filled.");
                alert("Save not possible:\nAt least one required figure inputfield is not filled.");
            }
        };

        function cancel() {
          resetPackage();
          $mdDialog.cancel();
        };

        function savePkgToDB(passon) {
            return getMetadata()
              .then(function(res){
                  logger.info(res);
                  if (res.metadata.o2r.interaction == undefined || res.metadata.o2r.interaction.length == undefined) {
                      res.metadata.o2r.interaction = [];
                  }
                  res.metadata.o2r.interaction.push(passon.pkg);

                  return httpRequests.updateMetadata($stateParams.ercid, res.metadata.o2r)
                    .then(function(res){
                        logger.info(res);
                        return res;
                    })
                    .catch(function(err){
                        logger.info(err);
                        return {error: "UPDATE metadata of choosen ERC is not possible."};
                    });
              })
              .catch(function(err){
                  logger.info(err);
                  return {error: "GET metadata of choosen ERC is not possible."};
              });
        };

        function getMetadata() {
          let ercId = $stateParams.ercid;
          return publications.getRequest(ercId).then(function(result){
              if(result.status == 404){
                  return $q.reject('404 Not Found');
              }
              else {
                  return result;
              }
          });
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
        }
    }
})()
