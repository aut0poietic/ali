/*
 * --------------------------------------------------------------------------
 * Ali: dialog.js
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
(function ($) {
    "use strict";

    var DIALOG_CONTENT = '.dialog-content';

    /**
     * Template local
     */
    var _t = window.htmlTemplates;

    /** 
     * Reusable Dialog object
     * @type {{_instance: jQuery, show: ali.Dialog.show, hide: ali.Dialog.hide}}
     */
    window.ali.Dialog = {

        _instance : undefined,

        /**
         * Returns a jQuery set of dialog content elements.
         * @param $el
         * @returns {jQuery}
         */
        getDialogElements : function ($el) {
            return $(DIALOG_CONTENT, $el);
        },

        /**
         * Returns true if the current interaction has dialog content.
         * @param $el
         * @returns {boolean}
         */
        hasDialog : function ($el) {
            return this.getDialogElements($el).length > 0;
        },

        /**
         * Returns the correct dialog content corresponding to the provided className.
         * @param $el
         * @param className
         * @returns {*|HTMLElement}
         */
        getDialogContent : function ($el, className) {
            var $dialogContent = this.getDialogElements($el);
            if (className === undefined || $dialogContent.length === 1) {
                return $($dialogContent[0]);
            } else {
                for( var i = 0; i < $dialogContent.length; i++){
                    var $fc = $( $dialogContent.get(i));
                    if ($fc.is(className)) {
                        return $fc;
                    }
                }
            }
        },

        /**
         * Opens a dialog if dialog content exists.
         * @param $el
         * @param className
         * @returns {boolean}
         */
        showDialog : function ($el, className) {
            if (this.hasDialog($el)) {
                var $dialogContent = this.getDialogContent($el, className);
                if ($dialogContent.length > 0) {
                    this.show($dialogContent);
                    return true;
                }
            }
            return false ;
        },

        /**
         * Displays a dialog window, moving the content contained in `$el` into the primary content of the dialog.
         * This method will also copy any classes on `$el` over to the dialog itself.
         * @param $el content for the dialog.
         * @param title Accessible title of this dialog.
         */
        show : function ($el, title) {
            if ('undefined' === $.type(_t.dialog)) {
                Mustache.parse(_t.dialog);
            }
            this._instance = $(Mustache.render(_t.dialog, { label : title, content : $el.html() }));
            var cl = $el[0].classList;
            for (var i = 0; i < cl.length; i++) {
                if (cl.item(i).indexOf('dialog') < 0) {
                    this._instance.addClass(cl.item(i));
                }
            }
            $('body').append(this._instance).addClass('dialog-open');
            $(document).off('focusin.ali').on('focusin.ali', this._handleFocus.bind(this));
            $('.dialog-window-actions-close', this._instance).off('click.ali').on('click.ali', this.hide.bind(this));
            this._instance.trigger('focus');
        },

        /**
         * Hides the current dialog. Primarily intended as a callback method for the close button.
         * @param e {Event}
         */
        hide : function (e) {
            if ('object' === $.type(e)) {
                e.preventDefault();
                e.stopPropagation();
            }

            if ($.type(this._instance) !== 'undefined') {
                $('.dialog-window-actions-close', this._instance).off('click.ali');
                this._instance.remove();
                this._instance = undefined;
            }
            $(document).off('focusin.ali');
            $('body').removeClass('dialog-open');
        },
        /**
         * Callback method used to keep focus on the dialog while it's open.
         * @param e
         * @private
         */
        _handleFocus : function (e) {
            if (document !== e.target && this._instance[0] !== e.target && !this._instance.has(e.target).length) {
                this._instance.trigger('focus');
            }
        }

    };

})(jQuery);