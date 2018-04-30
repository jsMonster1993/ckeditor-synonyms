'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', function($scope) {
    /*$scope.config = {};
    $scope.config.toolbarGroups = [
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
        { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
        { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
        { name: 'forms', groups: [ 'forms' ] },
        { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
        { name: 'links', groups: [ 'links' ] },
        { name: 'insert', groups: [ 'insert' ] },
        { name: 'styles', groups: [ 'styles' ] },
        { name: 'colors', groups: [ 'colors' ] },
        { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
        { name: 'tools', groups: [ 'tools' ] },
        { name: 'others', groups: [ 'others' ] },
        { name: 'about', groups: [ 'about' ] }
    ];*/
    CKEDITOR.plugins.add( 'timestamp', {
        icons: 'timestamp',
        init: function( editor ) {
            //Plugin logic goes here.
        }
    });

    /*CKEDITOR.addCommand( 'insertTimestamp', {
        exec: function( editor ) {
            var now = new Date();
            editor.insertHtml( 'The current date and time is: <em>' + now.toString() + '</em>' );
        }
    });

    CKEDITOR.ui.addButton( 'Timestamp', {
        label: 'Insert Timestamp',
        command: 'insertTimestamp',
        toolbar: 'insert'
    });*/


    $scope.htmlEditor = 'start typing ...';
}]);