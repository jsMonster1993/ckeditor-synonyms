    "use strict";

    angular.module('myApp.version.ck-editor', [])
        .directive('ngCkeditor', function ($http) {

            let syn_res = [];
            let dialogdefinition  = '';

            CKEDITOR.plugins.add( 'abbr', {
                icons: 'abbr',
                init: function( editor ) {
                    // Plugin logic goes here...
                }
            });

            CKEDITOR.on('instanceCreated', function (event) {
                var editor = event.editor,
                    element = editor.element;

                editor.ui.addButton( 'Abbr', {
                    label: 'Insert Abbreviation',
                    command: 'abbr',
                    toolbar: 'insert'
                });

                editor.addCommand( 'abbr', new CKEDITOR.dialogCommand( 'abbrDialog' ) );
                editor.addCommand( 'foo', new CKEDITOR.dialogCommand( 'fooDialog' ) );


                CKEDITOR.dialog.add( 'abbrDialog', function( editor ) {
                    let inp = "";
                    return {
                        title: 'Abbreviation Properties',
                        minWidth: 400,
                        minHeight: 200,

                        contents: [
                            {
                                id: 'tab-basic',
                                label: 'Basic Settings',
                                elements: [
                                    // UI elements of the first tab    will be defined here.
                                    {
                                        type: 'html',
                                        html: '<p> Please enter the word for which you are looking for synnonyms </p>'
                                    },
                                    {
                                        type: 'text',
                                        id: 'name',
                                        'default': '',
                                        setup : function() {

                                            // get the id that ckeditor generated for this element and store as an object property
                                            this.elemId = this.getInputElement().getAttribute('id');
                                            console.log("setup is ",this.elemId)
                                            // now we can reference the element by the id we stored above. Hacky? Yeah probably
                                            inp = document.getElementById(this.elemId);

                                        }
                                    },
                                    {
                                        type: 'button',
                                        id: 'buttonId',
                                        label: 'search synonym',
                                        title: 'search',
                                        onClick: function() {
                                            // this = CKEDITOR.ui.dialog.button


                                        }
                                    },
                                ]
                            }
                        ],
                        buttons: [ CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton ],
                        onOk: function(event) {

                            var elem = this.getContentElement('tab-basic','name');
                            console.log("the value is ",elem.getValue())
                            $http.get("http://api.datamuse.com/words?rel_syn="+elem.getValue()+"&max=10").then(result=>{
                                syn_res=result.data;
                                console.log("data is abbr",dialogdefinition)
                                if(dialogdefinition){
                                    dialogdefinition.removeContents("words");
                                }
                                setTimeout(()=>{
                                    editor.execCommand("foo");
                                },2000)
                            }).catch(error=>{

                            })



                        }
                    };
                });

                CKEDITOR.on( 'dialogDefinition', function( ev ) {
                    // Take the dialog name and its definition from the event data.
                    var dialogName = ev.data.name;
                    console.log("dialog name ",dialogName)
                    if(dialogName === "fooDialog"){
                        dialogdefinition = ev.data.definition;
                        console.log("the definition is ",dialogdefinition)
                    }
                });

                CKEDITOR.dialog.add( 'fooDialog', function( editor ) {

                    console.log("data is foo",syn_res);
                    let obj = {
                            type: 'radio',
                            id: 'country',
                            label: 'Which country is bigger',
                            items: syn_res.map(ele=>{
                                return [ele.word,ele.word];
                            }),
                            style: 'color: green',
                            'default': 'DE',
                            onClick: function() {
                                // this = CKEDITOR.ui.dialog.radio
                                alert( 'Current value: ' + this.getValue() );
                            }
                        };
                    return {
                        title: 'Synonyms',
                        minWidth: 400,
                        minHeight: 200,

                        contents: [
                            {
                                id: 'words',
                                label: 'Basic Settings',
                                elements: [obj]
                            }
                        ],
                        buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton],
                        onOk: function (event) {
                            syn_res = [];
                            // this.definition.removeContents("words")
                            // console.log("this.definition",this.definition)
                            // this.updateStyle();
                            // this.destroy();
                        }
                    }
                });



                if (element.getAttribute('class') == 'simpleEditor') {
                    editor.on('configLoaded', function () {
                        editor.config.removePlugins = 'colorbutton,find,flash,font, forms,iframe,image,newpage,removeformat, smiley,specialchar,stylescombo,templates';
                        editor.removeButtons = 'About';
                        editor.config.toolbarGroups = [{
                            name: 'editing',
                            groups: ['basicstyles', 'links']
                        }, {
                            name: 'undo'
                        }, {
                            name: 'clipboard',
                            groups: ['selection', 'clipboard']
                        }];
                    });
                }
            });



            return {
                restrict: 'E',
                scope: {
                    ngModel: '=ngModel',
                    ngChange: '=ngChange',
                    ngDisabled: '=ngDisabled',
                    ngConfig: '=ngConfig'
                },
                link: function (scope, elem, attrs) {
                    elem[0].innerHTML = '<div class="ng-ckeditor"></div> <div class="totalTypedCharacters"></div>';

                    var elemEditor = elem[0].querySelectorAll('.ng-ckeditor');
                    var config = {
                        removeButtons: (attrs.removeButtons != undefined) ? 'About,' + attrs.removeButtons : 'About',
                        readOnly: scope.ngDisabled ? scope.ngDisabled : false
                    };
                    if (attrs.removePlugins != undefined) {
                        config.removePlugins = attrs.removePlugins;
                    }
                    if (attrs.skin != undefined) {
                        config.skin = attrs.skin;
                    }
                    if (attrs.width != undefined) {
                        config.width = attrs.width;
                    }
                    if (attrs.height != undefined) {
                        config.height = attrs.height;
                    }
                    if (attrs.resizeEnabled != undefined) {
                        config.resize_enabled = (attrs.resizeEnabled == "false") ? false : true;
                    }

                    config.extraPlugins = 'abbr';
                    var editor = CKEDITOR.appendTo(elemEditor[0], (scope.ngConfig ? scope.ngConfig : config), '');

                    var addEventListener = function (editor) {
                        (editor).on('change', function (evt) {
                            scope.$apply(function () {
                                scope.ngModel = evt.editor.getData();
                            });
                            if (attrs.msnCount != undefined) {
                                element[0].querySelector('.totalTypedCharacters').innerHTML = attrs.msnCount + " " + evt.editor.getData().length;
                            }
                            if(scope.ngChange && typeof scope.ngChange === 'function'){
                                scope.ngChange(evt.editor.getData());
                            }
                        });
                        (editor).on('focus', function (evt) {
                            editor.setData(scope.ngModel);
                        });
                    };

                    var interval = undefined;
                    var setValue = function (value, editor) {
                        if (interval) {
                            clearTimeout(interval);
                        }
                        interval = setTimeout(function () {
                            if (value && editor) {
                                editor.setData(value);
                            } else if (editor) {
                                editor.setData('');
                            }
                        }, 1000);
                    };

                    addEventListener(editor);

                    scope.$watch('ngModel', function (value) {
                        if(value !== editor.getData()){
                            setValue(value, editor);
                        }
                    });

                    scope.$watch('ngDisabled', function (value) {
                        if (value) {
                            config.readOnly = true;
                        } else {
                            config.readOnly = false;
                        }

                        //editor = CKEDITOR.replace(elemEditor[0], (scope.ngConfig ? scope.ngConfig : config), '');
                        editor.destroy();
                        editor = CKEDITOR.appendTo(elemEditor[0], (scope.ngConfig ? scope.ngConfig : config), '');
                        addEventListener(editor);
                        editor.setData(scope.ngModel);

                    });

                }
            };
        });
