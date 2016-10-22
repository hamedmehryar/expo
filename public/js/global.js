/**
 * JS for the global scope used by all pages.
 * Wait until page is ready, by jQuery, and make things happen!
 *
 * @author     hamedmehryar
 *
 * @module JSGlobal
 * @type {Object}
 */

/**
 * Points underscore to base, to make it more readable.
 *
 * @type {Object}
 * @name base
 */
var base = _;

$(function(){

    /**
     * Returns a Bootstrap configured markup element, which represents an alert(success/danger/etc) message.
     *
     * @name alertBox
     * @methodOf base
     *
     * @param {String} msg
     * @param {jQuery} [$target] Specifies an element that should have any previous alert message removed.
     * @param {Boolean} [closeButton] Specifies whether to include the Close button. The default is TRUE.
     * @param {String} [type] The type such as success/danger/info.
     *
     * @return {String} Bootstrap configured markup element.
     */
    base.alertBox = function(msg, $target, closeButton, type){

        if (!type) type = 'danger';

        if ($.type(closeButton) == 'undefined')
            closeButton = true;

        var msgBox = '<div class="alert alert-'+ type +' fade in">'+

            (closeButton
                ? '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>'
                :''
            ) +

            msg +
        '</div>';

        if ($target){

            $target.parent().find('.alert.alert-success').remove();
            $target.parent().find('.alert.alert-warning').remove();
            $target.parent().find('.alert.alert-danger').remove();

        }

        return msgBox;

    };

    /**
     * Append an alert message box after the target element.
     *
     * @param {jQuery} $target
     * @param {String} msg
     * @param {Boolean} [closeButton]
     */
    base.alertAfter = function($target, msg, closeButton){

        $target.after(base.alertBox(msg, $target, closeButton));

    };

    /**
     * Append an info message box after the target element.
     *
     * @param {jQuery} $target
     * @param {String} msg
     * @param {Boolean} [closeButton]
     */
    base.infoAfter = function($target, msg, closeButton){

        $target.after(base.alertBox(msg, $target, closeButton, 'info'));

    };

    /**
     * Append an alert message box before the target element.
     *
     * @param {jQuery} $target
     * @param {String} msg
     * @param {Boolean} [closeButton]
     */
    base.alertBefore = function($target, msg, closeButton){

        $target.before(base.alertBox(msg, $target, closeButton));

    };

    /**
     * Returns a Bootstrap configured markup element, which represents an success message.
     *
     * @name successBox
     * @methodOf base
     *
     * @param {String} msg
     * @param {jQuery} [$target] Specify an element that should have any previous alert message removed.
     * @param {Boolean} [closeButton]
     *
     * @return {String} Bootstrap configured markup element.
     */
    base.successBox = function(msg, $target, closeButton){

        return base.alertBox(msg, $target, closeButton, 'success');

    };

    /**
     * Append an alert message box after the target element.
     *
     * @param {jQuery} $target
     * @param {String} msg
     * @param {Boolean} [closeButton]
     */
    base.successAfter = function($target, msg, closeButton){

        $target.after(base.successBox(msg, $target, closeButton));

    };

    /**
     * Append an alert message box before the target element.
     *
     * @param {jQuery} $target
     * @param {String} msg
     * @param {Boolean} [closeButton]
     */
    base.successBefore = function($target, msg, closeButton){

        $target.before(base.successBox(msg, $target, closeButton));

    };

    /**
     * Returns a Bootstrap configured markup element, which represents an success message.
     *
     * @name successBox
     * @methodOf base
     *
     * @param {String} msg
     * @param {jQuery} [$target] Specify an element that should have any previous alert message removed.
     * @param {Boolean} [closeButton]
     *
     * @return {String} Bootstrap configured markup element.
     */
    base.warningBox = function(msg, $target, closeButton){

        return base.alertBox(msg, $target, closeButton, 'warning');

    };

    /**
     * Append an alert message box after the target element.
     *
     * @param {jQuery} $target
     * @param {String} msg
     * @param {Boolean} [closeButton]
     */
    base.warningAfter = function($target, msg, closeButton){

        $target.after(base.warningBox(msg, $target, closeButton));

    };

    /**
     * Append an alert message box before the target element.
     *
     * @param {jQuery} $target
     * @param {String} msg
     * @param {Boolean} [closeButton]
     */
    base.warningBefore = function($target, msg, closeButton){

        $target.before(base.warningBox(msg, $target, closeButton));

    };

    var
        W_OBJECT = 'object',
        /*
         * The object to be exposed by this module.
         */
        supports,
        /*
         * Used only at the operation that set support.ownLastFirst
         */
        propertyX = ['a', 'y'];

    /*
     * ******************************************************************
     * Helps to define the Boolean assigned to support.ownLastFirst.
     * ******************************************************************
     */
    function InheretedFn(number2){
        this[propertyX[0]] = number2;
    }
    function IterationTest(){
        this[propertyX[1]] = 1;
    }

    IterationTest.prototype = {
        constructor: new InheretedFn(2)
    };

    for (var propN in (new IterationTest())) break;

    // ******************************************************************

    supports = {
        /**
         * If propN is different from 'y', that means when JS core is using iteration case, it is handling
         * iteration over inherited properties before this[own properties]. So... InheretedFn['a'] is being
         * reached before IterationTest['y']. For instance, these is the way how IE8 works.
         *
         * @name ownLastFirst
         * @type {Boolean}
         * @memberOf support
         */
        'ownLastFirst': propN !== propertyX[1]
    };

    /**
     * Returns TRUE if v is the global window object.
     * @param v
     * @returns {boolean}
     */
    base.is_win = function (v){

        return !!v && (v === window || v === v.window);

    };

    /**
     * Returns TRUE if is an object.
     *
     * @param {*} v
     * @param {Boolean} checkPlain Constraint to check only if is plain object, i.e. {}
     *
     * @returns {boolean}
     */
    base.is_obj = function(v, checkPlain){

        if (checkPlain){

            var howp = Object.prototype.hasOwnProperty;

            if (!v || $.type(v) !== W_OBJECT || v.nodeType || base.is_win(v)) return false;

            try{

                // Not own constructor property must be Object
                if (
                    v.constructor &&
                    !howp.call(v, "constructor") && !howp.call(v.constructor.prototype, "isPrototypeOf")
                )
                    return false

            }catch(n){
                // IE8,9 Will throw exceptions on certain host objects #9897
                return false;
            }

            var key;

            // Support: IE<9
            // Handle iteration over inherited properties before own properties.
            if (supports.ownLastFirst){
                for (key in v) return howp.call(v, key);
            }

            for (key in v){ }

            return !!key || howp.call(v, key);

        }else

            return (
                /*
                 * this not undefined test must exist, because in IE 7 Object.prototype.toString.call of undefined
                 * values returns [object Object]
                 */
                !!v && ($.type(v) == 'object' || Object.prototype.toString.call(v) == '[object Object]')
            );
    };

    base.is_plain_obj = function(v){

        return base.is_obj(v, 1);

    };

    base.is_str = function(v){

        return ($.type(v) == 'string' || v instanceof String);

    };

    base.is_arr = function (v){
        return ($.type(v) == 'array' || v instanceof Array)
    };

    /**
     * Process xhrDataOrMessage response sent by server-side seeking for error messages within param _sts_msg. If not
     * found attempt to return string.
     *
     * @param {Object|String|Array} xhrDataOrMessage
     * @param {jQuery} $context Target context where inputs/help-block elements should be seek, which is normally a form.
     * @param {String} defaultMessage
     *
     * @return undefined|String If at least one field in found the
     */
    base.setTipsOrGetMessage = function(xhrDataOrMessage, $context, defaultMessage){

        if (xhrDataOrMessage){

            if (base.is_plain_obj(xhrDataOrMessage)){

                if ('_sts_msg' in xhrDataOrMessage)
                    xhrDataOrMessage = xhrDataOrMessage._sts_msg;

                else if ('responseJSON' in xhrDataOrMessage && '_sts_msg' in xhrDataOrMessage.responseJSON)
                    xhrDataOrMessage = xhrDataOrMessage.responseJSON._sts_msg;

                var
                    $field, $helpBlock, found = 0, possibleFieldName;

                if (base.is_plain_obj(xhrDataOrMessage)){

                    for (possibleFieldName in xhrDataOrMessage){

                        /*
                         * It might happen that the possibleFieldName being validated is part of field set, such as
                         * multiple files that is part of a single input, therefore the server might return the name of
                         * it with a "." like file_xpto.0
                         */
                        if (possibleFieldName && possibleFieldName.indexOf('.') !== -1)
                            possibleFieldName = possibleFieldName.split('.')[0] + '[]';

                        $field = $('[name="' + possibleFieldName + '"]', $context);

                        if ($field.length){

                            //if ($form === undefined)
                            //$form = $field.closest('form').addClass();

                            $helpBlock = $field
                                .closest('.form-group')
                                .addClass('has-error')
                                .find('.help-block.hidden')
                                .addClass('hidden-type');

                            if ($helpBlock.length){

                                found++;

                                $helpBlock.html(xhrDataOrMessage[possibleFieldName]).removeClass('hidden').show();

                            }
                        }

                    }

                    return !found ? defaultMessage : 'See warnings in the form.';

                }else

                    return (base.is_str(xhrDataOrMessage) && xhrDataOrMessage != '') ||
                        (base.is_arr(xhrDataOrMessage) && xhrDataOrMessage.length)
                        ? xhrDataOrMessage
                        : defaultMessage;

            }else if (base.is_arr(xhrDataOrMessage) && xhrDataOrMessage.length){

                return xhrDataOrMessage.join(' ');

            }else if (base.is_str(xhrDataOrMessage) && xhrDataOrMessage != ''){

                return xhrDataOrMessage;

            }else
                return defaultMessage;

        }

    };

    /**
     * Setup alerts before the target and attempt to find input help-block elements according to the possible fields
     * specified in the xhr.
     *
     * @param {jQuery} $target
     * @param {Object} xhr
     * @param {jQuery} $view
     * @param {String} [primaryMsg]
     * @param {String} [secondaryMsg]
     * @param {Boolean} [closeButton]
     */
    base.setAlertBefore = function($target, xhr, $view, primaryMsg, secondaryMsg, closeButton){

        var msg = base.setTipsOrGetMessage(
            xhr,
            $view,
            secondaryMsg
        );

        base.alertBefore(
            $target,
            primaryMsg + (!msg || msg == '' ? '' : (primaryMsg != '' ? '<br><br>' : '')+ msg),
            closeButton
        );

    };

    /**
     * Setup alerts before the target and attempt to find input help-block elements according to the possible fields
     * specified in the xhr.
     *
     * @param {jQuery} $target
     * @param {Object} xhr
     * @param {jQuery} $view
     * @param {String} [primaryMsg]
     * @param {String} [secondaryMsg]
     * @param {Boolean} [closeButton]
     */
    base.setWarningBefore = function($target, xhr, $view, primaryMsg, secondaryMsg, closeButton){

        var msg = base.setTipsOrGetMessage(
            xhr,
            $view,
            secondaryMsg
        );

        base.warningBefore(
            $target,
            primaryMsg + (!msg || msg == '' ? '' : (primaryMsg != '' ? '<br><br>' : '') + msg),
            closeButton
        );

    };

    /**
     * Reset form group to the hidden state.
     *
     * @param $formGroup
     */
    function resetFormGroup($formGroup){

        $formGroup
            .removeClass('has-error')
            .find('.help-block.hidden-type')
            .slideUp(
                300,
                function(){

                    $(this)
                        .addClass('hidden')
                        .html('');

                }
            );
    }

    /**
     * Add default event handlers for elements within the target context.
     */
    base.incorporate = function($context){

        $('.form-group, .form-group :file', $context).on({
            /*
             * form group itself
             */
            keyup: function(){

                var $formGroup = $(this);

                if ($formGroup.hasClass('has-error') && !$formGroup.is('file')){

                    resetFormGroup($formGroup);

                }
            },
            /*
             * file input, since it might be hidden
             * or
             * change upon auto-complete based value selection
             */
            change: function(){

                if ($(this).closest('.form-group').hasClass('has-error'))
                    resetFormGroup($(this).closest('.form-group'));

            }
        });

    };

    /**
     * Initial event handler set.
     */
    base.incorporate(document);

    /**
     * Returns a default "unable to load" message.
     *
     * @name unableToLoad
     * @param targetName
     *
     * @return {String}
     */
    base.unableToLoad = function(targetName){

        return 'Unable to load'+ (!targetName ? '' : ' '+ targetName) +', try again after few seconds.';

    };

    /*
     * -----------------------------------------------------------------------------------------------------------------
     * Bootstrap hooks
     * -----------------------------------------------------------------------------------------------------------------
     */

    /*
     * Support scrolling modal dialogs when opened in iOS devices (iPhone)
     */
    $('body')
        .on('touchmove', function(e){
            if($('.scroll-disable').has($(e.target)).length) e.preventDefault();
        })
        .on('shown.bs.modal', function(){
            $(this).addClass('scroll-disable');
        })
        .on('hidden.bs.modal', function(){
            $(this).removeClass('scroll-disable');
        })
    ;

    /*
     * -----------------------------------------------------------------------------------------------------------------
     * jQuery hooks
     * -----------------------------------------------------------------------------------------------------------------
     */

    var currCrfToken = $('meta[name="csrf-token"]').attr('content');

    /**
     * Register a handler to be called when Ajax requests are sent.
     */
    $(document).ajaxSend(function( event, jqxhr, settings ) {

        /**
         * Attempt to update headers with the value from _token, which might exists in the current page.
         *
         * This is required to support server-side Laravel's API, which will seek for the token in the HEADERS, in case
         * the token from the page/document is not properly transported. For example, when a file with size larger than
         * the accepted by PHP directives is attempted to be uploaded, the _token won't be available within Laravel's
         * method VerifyCsrfToken::tokensMatch(), therefore it will try to reach X-CSRF-TOKEN from headers.
         */
        if (currCrfToken)
            jqxhr.setRequestHeader("X-CSRF-TOKEN", currCrfToken);

        jqxhr.valid = function(){

            if (jqxhr.status >= 200 && jqxhr.status < 300){

                if ('_sts' in jqxhr)
                    return jqxhr._sts > 0;

                else if ('responseJSON' in jqxhr && '_sts' in jqxhr.responseJSON)
                    return jqxhr.responseJSON._sts > 0;

                return true;

            }

            return false;

        };

        jqxhr.stsMessage = function(){

            if ('_sts_msg' in jqxhr)
                return jqxhr._sts_msg;

            else if ('responseJSON' in jqxhr && '_sts_msg' in jqxhr.responseJSON)
                return jqxhr.responseJSON._sts_msg;

        }

    });

    /**
     * Register a handler to be called when Ajax requests complete with an error.
     */
    $( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {

        var
            dialogId = '_mustLogin',

            status = ('_sts' in jqxhr
                ? jqxhr._sts

                : 'responseJSON' in jqxhr && '_sts' in jqxhr.responseJSON && jqxhr.responseJSON._sts
            );

        /**
         * User session or token has expired.
         */
        if (status === -1 && !$('#'+ dialogId).length){

            var
                statusMsg = (
                    '_sts_msg' in jqxhr
                        ? jqxhr._sts_msg
                        : 'responseJSON' in jqxhr && '_sts_msg' in jqxhr.responseJSON && jqxhr.responseJSON._sts_msg
                ),

                dialogExpired ='<div id="'+ dialogId +'" class="modal fade" role="dialog">'+
                '  <div class="modal-dialog">'+
                '    <div class="modal-content" style="text-align: center">'+
                '      <div class="modal-header">'+
                '        <h4 class="modal-title">Session Expired</h4>'+
                '      </div>'+
                '      <div class="modal-body alert" style="font-size: 18px">'+
                '        '+ (statusMsg || 'You need to reload the page.') +
                '      </div>'+
                '      <div class="modal-footer">'+
                '      </div>'+
                '    </div>'+
                '  </div>'+
                '</div>';

            $('body').append(dialogExpired);

            $('#'+ dialogId)
                .modal({
                    show: true,
                    keyboard: false,
                    backdrop: 'static'
                })
                .find('.modal-backdrop')
                .on({
                    click: function(evt){

                        evt.preventDefault();
                        evt.stopPropagation();
                        evt.stopImmediatePropagation();

                    },
                    keydown: function(evt){
                        evt.preventDefault();
                        evt.stopPropagation();
                        evt.stopImmediatePropagation();
                    }
                });

        }

    });

    /**
     * Checks whether the form has any file input.
     *
     * @augments jQuery
     * @name hasFile
     *
     * @returns {boolean}
     */
    $.fn.hasFile = function() {

        if ($.type(this) === "undefined")
            return false;

        var hasFile = false;

        $.each($(this).find(":file"), function(key, input) {

            if ($(input).val().length > 0){
                hasFile = true;
            }

        });

        return hasFile;

    };
    /**
     * Convert your form data to into JSON (JavaScript Object Notation) format, so you can manipulate them easily.
     * See Github project page for information.
     *
     * @augments jQuery
     * @name serializeObject
     *
     * @author https://github.com/hongymagic
     *
     * @returns {Object}
     */
    $.fn.serializeObject = function () {
        "use strict";

        var result = {};
        var extend = function (i, element) {
            var node = result[element.name];

            // If node with same name exists already, need to convert it to an array as it
            // is a multi-value field (i.e., checkboxes)

            if ($.type(node) !== 'undefined' && node !== null) {
                if ($.isArray(node)) {
                    node.push(element.value);
                } else {
                    result[element.name] = [node, element.value];
                }
            } else {
                result[element.name] = element.value;
            }
        };

        $.each(this.serializeArray(), extend);
        return result;
    };


    /**
     * Distribute a set of elements randomly in the target context.
     *
     * @augments jQuery
     * @name distribute
     *
     * @param {Number} [fadeIn] Specify the speed for the fade in effect.
     * @param {HTMLElement} [context] Specify the boundaries for the distribution. Default is the current document.
     */
    $.fn.distribute = function(fadeIn, context){

        var $context = $(!context ? document :  context);

        this.each(function(i){

            var $elem = $(this);

            var posx = (Math.random() * ($context.width() - $elem.width())).toFixed();
            var posy = (Math.random() * ($context.height() - $elem.height())).toFixed();

            $elem.css({
                'position':'absolute',
                'left':posx +'px',
                'top': (posy < 50 ? 50 : posy) +'px',
                'display':'none'
            }).fadeIn(!fadeIn ? 500 : fadeIn);

        });

    };

    /**
     * Extend the default jQuery on() method, to attach an event handler function for one or more events to the
     * selected elements if the event was not triggered for a given interval.
     *
     * This is useful if is required to fire a callback only after a delay, like the resize event, scroll, or any
     * similar event.
     *
     // VERY IMPORTANT:
     //
     // THE OPTION OF THIS PLUGIN DOES NOT ALLOW MORE THAN ONE EVENT HANDLER BINDING PER ELEMENT/EVENT CONSTRUCTION,
     // THIS MEANS THAT THE ATTACHING OF A SECOND EVENT HANDLER WOULD REPLACE REPLACE A PREVIOUS EVENT HANDLER.
     //
     // THIS IS A PECULIAR BEHAVIOR OF THE PLUGIN yckart THAT IS CURRENTLY EXTENDING THE METHOD $.on().
     // @todo see if there's safe way to correct such peculiar behavior of the plugin.
     //
     *
     * @augments jQuery
     * @memberOf jQuery.on
     *
     * Usage example:
     *
     * $(window).on('resize', function(e){
     *   console.log(e.type + '-event was 250ms not triggered');
     * }, 250);
     *
     * @author     http://yckart.com (https://github.com/yckart/jquery.unevent.js)
     */
    var
        jqueryDefaultOn = $.fn.on,
        timer;

    $.fn.on = function(){

        var args = Array.apply(null, arguments);
        var last = args[args.length - 1];

        if (isNaN(last) || (last === 1 && args.pop())) return jqueryDefaultOn.apply(this, args);

        var delay = args.pop();
        var fn = args.pop();

        args.push(function(){
            var self = this, params = arguments;
            clearTimeout(timer);

            timer = setTimeout(
                function (){
                    fn.apply(self, params);
                }, delay
            );

        });

        return jqueryDefaultOn.apply(this, args);
    };

    /**
     * Centralize an element on the window or under a specific context.
     *
     * @augments jQuery
     * @name center
     *
     * @param {Object} [opts] An object which may have the folowing attributes:
     *
     *                  - shiftTop: a float value to indicate vertically adjustment in percentage
     *
     *                  - against: what object must be used as parent reference: 'window', 'parent' or the object
     *                             itself.
     *
     *                  - top: a boolean to indicate whether the top position must be consider as zero.
     *
     * @param {Boolean} returnOnly Specifies to not centralize the element, but return what would be its position
     *                  once centralized in the page.
     *
     * @return {Object|null|Boolean} If returnOnly is assigned as TRUE, returns an object {x: offsetX, y: offsetY}.
     */
    $.fn.center = function(opts, returnOnly){

        var
            $w        = $(window),
            scrollTop = $w.scrollTop();

        if (!opts) opts = {};


        if (this.length){

            var
                $this = $(this[0]), configs, centerize, finalPosition;

            var op, defOpts = {against:'window', top:false, shiftTop:0.5};

            /*
             * Check whether some option was redefined via opts parameter.
             */
            for (op in defOpts) if (op in opts) defOpts[op] = opts[op];

            configs = $.extend(defOpts);

            centerize = function(){

                var
                    $against , x, y;

                if (configs.against === 'window'){
                    $against = $w;
                }else if (configs.against === 'parent'){
                    $against = $this.parent();
                    scrollTop = 0;
                }else{
                    $against = configs.against instanceof $ ? configs.against : $this.closest(configs.against);
                    scrollTop = 0;
                }

                x = ($against.width() - $this.outerWidth()) * 0.5;
                y = (($against.height() - $this.outerHeight())) * configs.shiftTop + scrollTop;

                if (configs.top) y = configs.top + scrollTop;

                finalPosition = {'x': x, 'y': y};

                if (!returnOnly) $this.css({'left':x, 'top':y});

                return finalPosition;

            };

            return centerize();

        }else
            return null;

    };

    /*
     * -----------------------------------------------------------------------------------------------------------------
     * Global event handler setup.
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * Prevent clicks mainly in the top navigation bar title.
     */
    $('a.non-click').on({
        click: function(e){
            e.preventDefault();

        }
    });
});