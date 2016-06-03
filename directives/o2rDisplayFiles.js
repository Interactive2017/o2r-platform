"use strict";

/*
	Directive for displaying different file types.
	This directive checks the mime type attribute of a publication.content.<element> to handle it differently considering its mime type.
	Directive can only be used as Html-Element and expects an attribute o2rid.
	Example: 
	<o2r-display-files o2rid="7"></o2r-display-files>
*/
app.directive('o2rDisplayFiles', ['publications', '$http', 'fileContents', function(publications, $http, fileContents){
	return{
		restrict: 'E',
		link: function(scope, iElement, attrs){

			//checks if o2rid-attribute changes
			attrs.$observe('o2rid', function(value){
				
				var file = publications.getContentById(value);


				/*
					IMPORTANT
					#####################################################
					#####################################################
					If <div hljs hljs-include> works, _getFileContent can be deleted
					#####################################################
					#####################################################
				*/
				// Ajax call for retrieving data content
				var _getFileContent = function(path){
					var _filecontent;

					_filecontent = fileContents.getContent(path);
					/*
					var _filecontent;
					$http(·{
						method: 'GET',
						url: path
					}).then(function successCallback(repsonse){
						_filecontent = response.data;
					}, function errorCallback(response){
						console.log(response.status, response.statusText);
					});
					*/
					return _filecontent;
				};

				//check if found element is a file
				if(typeof file.type !== "undefined"){

					//remove existing content
					$('o2r-display-files').empty();

					//prepare mime type
					var _mime = file.type.split('/');
					_mime = _mime[0];

					//create html-tags depending on mime type
					var _sizeError = '<div class="jumbotron"><center><h2>Filesize is too big to display</h2><p><a href="">Download</a> file to see its content</p></center></div>';
					var _addContent = function(type){
						if(file.size < 1000){
							switch(type){
								case 1:
									var object = angular.element('<object class="pdf" type="application/pdf" data="' + file.path +  '"</object>');
									break;
								case 2:
									var object = angular.element('<img src="' + file.path + '">');
									break;
								case 3:
									var object = angular.element('<audio controls><source src="' + file.path + '" type="' + file.type + '"></source>Your browser does not support audio element.</audio>');
									break;
								case 4:
									var object = angular.element('<video controls><source src="' + file.path + '"></source>Your browser does not support the video tag.</video>');
									break;
								default:
									var object = angular.element('<div hljs>' + _getFileContent(file.path) + '</div>');
									//var object = angular.element('<div hljs hljs-include=\"\'' + file.path + '\'\"></div>');
									break;
							}
						} else {
							var object = angular.element(_sizeError);
						}
						iElement.append(object);
					}


					// check mime type
					if(file.type == 'application/pdf'){
						_addContent(1);
					} else if(_mime == 'image'){
						_addContent(2);
					} else if(_mime == 'audio'){
						_addContent(3);
					} else if(_mime == 'video'){
						_addContent(4);
					} else {
						_addContent();
					}
				}
			});
		}
	}
}]);