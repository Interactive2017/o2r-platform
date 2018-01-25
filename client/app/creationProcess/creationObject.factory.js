(function(){
    'use strict';

    angular
        .module('starter')
        .factory('creationObject', creationObject);

    creationObject.$inject = ['$log', 'httpRequests', '$mdToast', '$document'];
    function creationObject($log, httpRequests, $mdToast, $document){
        var logger = $log.getInstance('creationObject');

        var erc = {};
        var service = {
            get: get,
            set: set,
            getFiles: getFiles,
            getFilesArray: getFilesArray,
            destroy: destroy,
            getRequired: getRequired,
            getOptional: getOptional,
            getSpacetime: getSpacetime,
            getUibindings: getUibindings,
            getInputFiles: getInputFiles,
            simpleUpdate: simpleUpdate,
            updateTemporal: updateTemporal,
            updateLicense: updateLicense,
            updateAuthor: updateAuthor,
            addAuthor: addAuthor,
            addBinding: addBinding,
            removeAuthor: removeAuthor,
            updateTemporalBegin: updateTemporalBegin,
            updateTemporalEnd: updateTemporalEnd,
            updateSpatialFiles: updateSpatialFiles,
            removeArtifacts: removeArtifacts
        };

        return service;

        /////////

        function get(){
            return angular.copy(erc);
        }

        function set(obj){
            erc = obj;
            logger.info('Successfully set');
        }

        function getFiles(){
            var files = erc.files;
            return angular.copy(erc.files);
        }

        function getFilesArray(){
            var files = [];
            _iterateOverFiles(erc.files.children);
            return angular.copy(files);

            function _iterateOverFiles(obj){
                for(var i in obj){
                    if(obj[i].children) _iterateOverFiles(obj[i].children);
                    else files.push(obj[i].path);
                }
            }
        }

        function destroy(){
            erc = {};
            logger.info('Successfully destroyed');
        }

        function getOptional(){
            var optional = {
                keywords: erc.metadata.o2r.keywords, //array
                paperLanguage: erc.metadata.o2r.paperLanguage, //array
                researchQuestions: erc.metadata.o2r.researchQuestions, //array
                researchHypotheses: erc.metadata.o2r.researchHypotheses //array
            };
            return angular.copy(optional);
        }

        function getRequired(){
            var required = {
                title: erc.metadata.o2r.title,
                description: erc.metadata.o2r.description,
                publicationDate: erc.metadata.o2r.publicationDate,
                softwarePaperCitation: erc.metadata.o2r.softwarePaperCitation,
                license: erc.metadata.o2r.license,
                author: erc.metadata.o2r.author,
                displayfile_candidates: erc.metadata.o2r.displayfile_candidates,
                displayfile: erc.metadata.o2r.displayfile,
                mainfile: erc.metadata.o2r.mainfile,
                mainfile_candidates: erc.metadata.o2r.mainfile_candidates
            };
            return angular.copy(required);
        }

        function getSpacetime(){
            var required = {
                temporal: erc.metadata.o2r.temporal,
                spatial: erc.metadata.o2r.spatial
            };
            return angular.copy(required);
        }

        function getUibindings(){
            if(erc.metadata.o2r.interaction.length==undefined){
                erc.metadata.o2r.interaction = [];
            }
            return angular.copy(erc.metadata.o2r.interaction);
        }

        function getInputFiles(){
            var inputFiles = {
                codefiles: erc.metadata.o2r.codefiles,
                inputfiles: erc.metadata.o2r.inputfiles
            };
            return angular.copy(inputFiles);
        }

        function updateAuthor(index, name, aff, orcid){
            //if(angular.isUndefined(erc.metadata.o2r.author[index])) erc.metadata.o2r.author[index] = {affiliation: ""};
            if(name) erc.metadata.o2r.author[index].name = name;
            if(aff) erc.metadata.o2r.author[index].affiliation = aff;
            if(orcid) erc.metadata.o2r.author[index].orcid = orcid;
        }

        function addAuthor(auth){
            erc.metadata.o2r.author.push(auth);
        }

        function addBinding(binding){
            var text = 'Start adding figure ...';
            var toastClass = 'creationProcess-running-toast';
            showNotificationToast(text, toastClass);
            var params = '{';
            // get slider value
            for(var i = 0; i < binding.widgets.length; i++){
                params = params + '"' + binding.widgets[i].param_name + '":' +  binding.widgets[i].default_value;
                if(i < binding.widgets.length - 1) {
                    params = params + ',';
                }
                else {
                    params = params + '}';
                }
            }
            let endpoint = binding.endpoint;
            binding.original = {};
            httpRequests
              .ocpuCalculate(params, endpoint)
              .then(function(linkList) {
                  var body = linkList.data
                  var splitBody = body.split('/');
                  var ocpuID = splitBody[3];

                  //call the values from ocpu when the type is "timeseries"
                  if(binding.type == 'timeseries') {
                      httpRequests.ocpuResultsVal(ocpuID)
                          .then(function(compareValues){
                              binding.original.values = compareValues.data;

                              erc.metadata.o2r.interaction.push(binding);

                              var text = 'Figure added! (timeseries)';
                              var toastClass = 'creationProcess-success-toast';
                              showNotificationToast(text, toastClass);
                          },function(err) {
                              var text = 'Failed adding figure! (timeseries)';
                              var toastClass = 'creationProcess-failure-toast';
                              showNotificationToast(text, toastClass);
                              console.log("error with timeseries");
                              console.log(err);
                          })
                  }
                  //if the type is "map" then the image is requested
                  else {
                      httpRequests.ocpuImages(ocpuID)
                          .then(function(compareImage){

                              var img = new Image();
                              img.src = compareImage.config.url;

                              img.onload = function() {
                                  var canvas, ctx, dataURL, base64;
                                  canvas = document.createElement("canvas");
                                  ctx = canvas.getContext("2d");
                                  canvas.width = img.width;
                                  canvas.height = img.height;
                                  ctx.drawImage(img, 0, 0);
                                  dataURL = canvas.toDataURL("image/png");
                                  base64 = dataURL.replace(/^data:image\/png;base64,/, "");
                                  binding.original.image = base64;

                                  erc.metadata.o2r.interaction.push(binding);
                                  var text = 'Figure added! (map)';
                                  var toastClass = 'creationProcess-success-toast';
                                  showNotificationToast(text, toastClass);
                              }

                          },function(err) {
                              var text = 'Failed adding figure! (map)';
                              var toastClass = 'creationProcess-failure-toast';
                              showNotificationToast(text, toastClass);
                              console.log("error with map");
                              console.log(err);
                          })
                  }
              },function(err) {
                  var text = 'Failed adding figure! (ocpu calculation)';
                  var toastClass = 'creationProcess-failure-toast';
                  showNotificationToast(text, toastClass);
                  console.log("error with ocpu calculation");
                  console.log(err);
              })
        }

        function showNotificationToast(text, toastClass) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(text)
                .toastClass(toastClass)
                .position('top right')
                .parent($document[0].body.children.main.children["ui-view"])
            );
        }

        function removeAuthor(index){
            erc.metadata.o2r.author.splice(index, 1);
        }

        //allowed values for lic: 'text', 'code', 'data', 'uibindings'
        function updateLicense(lic, val){
            // if(index || index == 0) erc.metadata.o2r.license[index] = lic;
            // else erc.metadata.o2r.license = lic;
            logger.info('updating license.', lic);
            erc.metadata.o2r.license[lic] = val;
        }

        function simpleUpdate(attr, val){
            erc.metadata.o2r[attr] = val;
            logger.info('updated ', attr);
            logger.info('updated ', attr);
        }

        function updateTemporal(attr, val){
            erc.metadata.o2r.temporal[attr] = val;
            logger.info('updated temporal.', attr);
        }

        function updateTemporalBegin(dat){
            erc.metadata.o2r.temporal.begin = dat;
        }

        function updateTemporalEnd(dat){
            erc.metadata.o2r.temporal.end = dat;
        }

        function updateSpatialFiles(spat){
            //check if spatial attribute exists, if not, create it
            if(angular.isUndefined(erc.metadata.o2r.spatial)){
                erc.metadata.o2r.spatial = {files: {}};
            }
            erc.metadata.o2r.spatial.files = spat;
        }

        function removeArtifacts(attr){
            var obj = erc.metadata.o2r[attr];
            if(obj) {
                for(var i=obj.length-1; i>=0; i--){
                    //if array at index contains empty string or is undefined, delete index
                    if(angular.isUndefined(obj[i]) || (obj[i].length == 0)){
                        obj.splice(i, 1);
                    }
                }
            }
        }
    }
})();
