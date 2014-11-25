/*!
 * jQuery placeholer support for older browser
 * Original author: Simon Schärer
 * Further changes, comments: Simon Schärer
 * Licensed under the MIT license
 */


// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "placeholder",
        defaults = {
            label2placeholder:false,
            placeholderClass:"isplaceholder"
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        
        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).
            
            var self=this,$inp = $(this.element), txt = $inp.attr("placeholder");
            
            // return if placeholder attribute is already set and browser supports placeholder natively 
            if( txt && txt!=="" && this.supportPlaceholder() ){
                return;
            }
             
            if( this.options.label2placeholder ){
                var $l = this.findlabel($inp);

                if ($l.length > 0 ){

                    txt = $l.text().trim().replace(/\s{2,}/g, ' ');

                    $l.hide();

                }
            }
            
            if( this.supportPlaceholder() ){
                $inp.attr("placeholder",txt);
                return;
            }else{
                
                // support for older browsers
                
                $inp.focus(function() {
                    $inp.removeClass(self.options.placeholderClass);
                    if (txt === $inp.val().trim()) {
                        $inp.val("");

                    }
                }).blur(function() {
                    if ("" === $inp.val().trim()) {
                        $inp.val(txt);
                        $inp.addClass(self.options.placeholderClass);
                        if ($inp.attr("type") === "password") {
                            self.clonePwField($inp);
                        }
                    }
                }).change(function() {
                    if ("" === $inp.val().trim()) {
                        $inp.val(txt);
                        if (!$inp.hasClass(self.options.placeholderClass)) {
                            $inp.addClass(self.options.placeholderClass);
                        }
                        if ($inp.attr("type") === "password") {
                            self.clonePwField($inp);
                        }
                    }
                });
                
            }
            
            
            
        },
        findlabel: function($inp) {
            var $l = $("label[for='"+$inp.attr("name")+"']");
            
            if( $l.length === 0){
                $l = $inp.parents("label").first();
            }
            
            return $l;
        },
        clonePwField: function($inp){
             var $inp2 = $("<input type='text' data-ispass='true' class='"+$inp.attr("class")+"' id='"+$inp.attr("id")+"' value='"+$inp.val()+"' />");

            $inp2.focus(function(){
                    $inp.show().focus();
                    $(this).remove();
            });


            $inp.after($inp2);
            $inp.hide();
        },
        supportPlaceholder: function(){
            var i = document.createElement('input');
            return 'placeholder' in i;
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );
