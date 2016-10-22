/**
 * JS for the event/index view page.
 *
 * Wait until page is ready, by jQuery, and make things happen!
 *
 * @author     hamedmehryar
 *
 * @module HallMapView
 * @name hallMapView
 * @type {Backbone.View|Object}
 */
$(function(){

    /**
     * Distribute articles in the page.
     */
    var
        /**
         * Points the server params sent by server-side in the bottom of the page.
         *
         * @type {jQuery}
         */
        serverParams = jsFooterParams,
        /**
         * The wrapper of hall map SVG element/object.
         *
         * @type {jQuery}
         */
        $mapWrapper = $(".map-wrapper"),
        /**
         * Specify that a stand is already booked.
         *
         * @type {string}
         */
        CLS_BOOKED = 'booked';

    /**
     * Defines a Model for an exposition stand space.
     *
     * @type {Backbone.Model}
     */
    var StandModel = Backbone.Model.extend({

        url: serverParams.fetchUrl,

        defaults: {
            id:          null,
            event_id:    null,
            full_id:     null, // event_id + id in the same format it was sent from server
            code:        '',
            status:      null, // 0 = available, 1 = booked
            price:       '',   // price formatted
            m2:          '',
            real_image:  '',   // only path, since URL will be grabbed from serverParams
            description: null,
            rs_id: 0,          // reservation Id
            co_sname: '',      // company short name
            user_dir_key: '',  // user directory key, which is present if stand is booked
            user_logo_ext: '', // user logo extension, which is present if stand is booked
            logo_pos: '',       // logo position adjustment around the stand title, the default is on left
            reservation_url: '',
            file_list: [],
            admin_name: '',
            admin_email: ''
        },

        // Keep the previous status in order to determine some changes
        prevStatus: null,

        // Returns the property from response which holds the model's values.
        parse: function(response){

            var data = '_model' in response ? response._model : response;

            if (data.status) this.prevStatus = this.get('status');

            return data;

        },
        /**
         * Returns TRUE if the stand space is already reserved. If the reservation Id is assigned via reservationId refresh the
         * model.
         *
         *
         * @param {Number} [reservationId] Reservation Id.
         * @param {String} [coShortName] Company short name.
         * @param {String} [userDirKey] User directory key.
         * @param {String} [logoExt] Company logo extension, such as jpg, png.
         *
         * @returns {boolean}
         */
        booked: function booked(reservationId, coShortName, userDirKey, logoExt){

            if (reservationId){

                this.set({
                    status: 1,
                    rs_id: reservationId,
                    co_sname: coShortName,
                    user_dir_key: userDirKey,
                    user_logo_ext: logoExt
                });

                return true;

            }else
                return this.get('status') == 1;

        },
        /**
         * Returns TRUE if the status was updated in the last model change.
         *
         * @returns {boolean}
         */
        statusChanged: function(){

            return this.get('status') != this.prevStatus;

        },
        /**
         * Returns the company logo if the stand is booked.
         *
         * @returns {string} May return empty.
         */
        companyLogoUrl: function(){

            return this.booked()

                ? serverParams.profileLogoUrl
                    .replace('$user_dir', this.get('user_dir_key'))
                    .replace('$user_logo', this.get('user_logo_ext'))

                : ''
            ;
        }
    });

    var
        SVG_NS   = 'http://www.w3.org/2000/svg',
        XLINK_NS = 'http://www.w3.org/1999/xlink';

    /**
     * Defines a View for the {@link StandModel}.
     *
     * @type {Backbone.View}
     */
    var StandView = Backbone.View.extend({
        /**
         * @type {HTMLElement}
         */
        el: null,
        /**
         * @type {jQuery}
         */
        $el: null,
        /**
         * Keep a reference to a <li> element from the list of stands that is displayed above the SVG image.
         *
         * The list of stands as regular HTML element ensures that if the SVG element is not properly loaded by the
         * browser, the user will still be able to book the stand.
         *
         * @type {jQuery}
         */
        $standExtraLink: null,
        /**
         * @type {Object}
         */
        events: {

        },
        /**
         * @type {StandModel}
         */
        model: null,

        /**
         * Holds a reference to the current opened {@link StandDetailsView}.
         *
         * @type {StandDetailsView}
         */
        openedStand: null,
        /**
         * Start up the view, binding events and calling initial rendering of elements.
         */
        initialize: function(){

            // every function that uses 'this' as the current object should be in here
            base.bindAll(this, 'render', 'refresh', 'setup');

            this.listenTo(this.model, 'change', this.refresh);

        },
        /**
         * Perform initial rendering of the View by adding elements and defining event handlers.
         *
         * @returns {jQuery}
         */
        render: function(){

            return this.setup(); // Return this.el, for chainable calls, like ...render().el

        },
        /**
         * Append/remove the company logo from the respective stand.
         */
        setCompanyLogo: function(){

            var
                stand           = this.model,
                $svgStandGElem  = this.$el;

            if (stand.booked()){

                if (!$svgStandGElem.find('image.co-logo').length){

                    var
                        svgCompanyLogo  = document.createElementNS(SVG_NS,'image'),
                        $svgCompanyLogo = $(svgCompanyLogo).addClass('co-logo'),
                        $standTitle     = $svgStandGElem.parent().find('.stand-title'),
                        logoHeight      = 24,
                        logoWidth       = 24;

                    $svgCompanyLogo.attr('height', logoHeight);
                    $svgCompanyLogo.attr('width', logoWidth);

                    svgCompanyLogo.setAttributeNS(XLINK_NS, 'href', stand.companyLogoUrl());

                    /**
                     * Since the coordinates of the element $standTitle is applied with setTimeout() by createTitles(),
                     * and $svgCompanyLogo relies on it, we need also to use setTimeout() here, in order to have the
                     * actual coordinates.
                     */
                    setTimeout(function(){

                        var logoPosition = stand.get('logo_pos') || 'l'; // l = left

                        $svgCompanyLogo.attr(
                            'transform',
                            'translate(' +
                                (
                                    $standTitle.data('svg_x') +

                                    (
                                        // if top or bottom, no changes for x
                                        logoPosition == 't' || logoPosition == 'b'
                                            ? 0

                                            // if left or right
                                            : (logoPosition == 'l' ? (logoWidth + 5) * -1 : $standTitle.width() + 2)
                                    )

                                ) + ' ' +

                                (
                                    $standTitle.data('svg_y') +
                                    (
                                        // if top or bottom
                                        logoPosition == 't' || logoPosition == 'b'

                                            ? (logoPosition == 't' ? logoHeight * -1 : $standTitle.height() + 2)

                                            // if left or right, adjust 5 pixels below the stand title
                                            : 5

                                    )

                                ) +
                            ')'
                        );

                        $svgCompanyLogo.attr('visibility', 'visible');

                        $svgStandGElem.append(svgCompanyLogo);

                    }, 4);

                }

            }else{

                $svgStandGElem.find('image.co-logo').remove();

            }

        },
        /**
         * Updates the titles of the stand indicating that is booked or not, as follows.
         *
         * If booked:
         *
         *   - Append a check symbol(✔) in the title/code of the stand
         *   - Replace the price for the company short name
         *
         * If not booked:
         *
         *   - Remove the check symbol(✔) from the title/code of the stand
         *
         *   - Replace the company short name for the price of the stand
         *
         */
        refreshTitles: function(){

            var
                stand          = this.model,
                $svgStandGElem = this.$el,
                $xlink         = $svgStandGElem.closest('a'),
                $xlinkTitle    = $xlink.find('.stand-code'),
                $mirrorTitle   = this.$standExtraLink.find('.title');

            if (stand.booked()){

                if ($xlink.length){

                    $xlink.addClass(CLS_BOOKED);

                    this.$standExtraLink.addClass(CLS_BOOKED);

                    $xlinkTitle.append(' ' + serverParams.charCodeBooked);

                    $xlink
                        .find('.title-val')
                        .addClass('co-sname')
                        .removeClass('stand-price')
                        .html(stand.get('co_sname'));

                }

                $mirrorTitle.append(
                    '<abbr>'+
                      '<span>'+ serverParams.charCodeBooked +' '+ stand.get('co_sname') +'</span>'+

                      '<i class="co-logo mini" style="background-image:url('+ stand.companyLogoUrl() +')"></i>'+

                    '</abbr>'
                );

            }else{

                if ($xlink.length){

                    $xlink.removeClass(CLS_BOOKED);

                    this.$standExtraLink.removeClass(CLS_BOOKED);

                    $xlinkTitle.html(
                        $xlinkTitle.html()
                            .replace(serverParams.charBooked, '')
                            .replace(serverParams.charCodeBooked, '')
                    );

                    $xlink
                        .find('.title-val')
                        .addClass('stand-price')
                        .removeClass('co-sname')
                        .html(stand.get('price'));

                }

                $mirrorTitle.find('abbr').remove();

            }
        },
        /**
         * Updates the view upon any change in the model.
         */
        refresh: function(){

            if (this.model.statusChanged()){

                this.refreshTitles();

                this.setCompanyLogo();

            }
        },
        /**
         * Creates the {@link StandDetailsView} related to this stand.
         */
        openStandDialog: function(){

            this.openedStand = new StandDetailsView({

                // Provide the same model for the details View.
                model: this.model

            });

            this.openedStand.render();

        },
        /**
         * Creates the stand title with the code and second subtitle with the price.
         *
         * @param {jQuery} $text The respective SVG text element in which the titles will be appended.
         */
        createTitles: function($text){

            var
                $svgStandGElem       = this.$el,
                $tspanTitle          = $(document.createElementNS(SVG_NS, "tspan")),
                $tspanPriceOrCompany = $(document.createElementNS(SVG_NS, "tspan")),
                standBoundingBox     = $svgStandGElem[0].getBBox();


            /**
             * Set attributes to break line
             */
            $tspanTitle
                .attr('x', '0')
                .attr('dy', '1.2em')
                .attr('class', 'stand-code')
                .html(this.model.get('code'));

            $tspanPriceOrCompany
                .attr('x', '0')
                .attr('dy', '1.2em')
                .attr('class', 'title-val '+ (this.model.booked() ? 'co-sname' : 'stand-price'))
                .html(
                    !this.model.booked()
                        ? this.model.get('price')
                        : this.model.get('co_sname')
                );

            $text.append($tspanTitle).append($tspanPriceOrCompany);

            /**
             * Compute the XY of the text only after it's rendered, since only after applying CSS the element will
             * have the desired computable width/height.
             */
            setTimeout(function(){

                // The +5 and -5 below is to adjust a bit the assignment due to the possibility of the check char
                // that is appended upon reservation of the stand, therefore the stand name/code gets a bit larger.

                $text.data(
                    'svg_x',
                    parseFloat(((standBoundingBox.x + standBoundingBox.width/2) - ($text.width() / 2) + 5).toFixed(5))
                );

                $text.data(
                    'svg_y',
                    parseFloat(((standBoundingBox.y + standBoundingBox.height/2) - ($text.height() / 2) - 5).toFixed(5))
                );

                $text.attr('transform', "translate(" + $text.data('svg_x') + " " + $text.data('svg_y') + ")");

            }, 2);

        },
        /**
         * Define event handler for the list(<li>) of stands to open the stand dialog.
         */
        setupExtraLink: function(){

            var self = this;

            this.$standExtraLink = $('#'+ this.model.get('full_id'));

            this.$standExtraLink.on({
                click: function(){

                    self.openStandDialog();

                }
            });

        },
        /**
         * Perform initial setup of the stand according to the data sent by server-side.
         *
         * @returns {jQuery}
         */
        setup: function(){

            if (this.el){

                var
                    self           = this,
                    $text          = $(document.createElementNS(SVG_NS, "text")).attr('class', 'stand-title'),
                    $svgStandGElem = this.$el,
                    $xlink          = $svgStandGElem.closest('a');

                this.createTitles($text);

                $xlink
                    .addClass('stand'+ (this.model.booked() ? ' '+ CLS_BOOKED : ''))
                    .attr('xlink:href', '')
                    .on({
                        click: function(evt){

                            evt.preventDefault();

                            self.openStandDialog();

                        }
                    });

                this.setupExtraLink();

                // append the respective title(code of the stand space) for the path
                $svgStandGElem.after($text[0]);

                this.setCompanyLogo();

            }else{

                this.setupExtraLink();

            }

            return this.$el;

        }
    });
    /**
     * Defines a Model to process reservation of the stand space.
     *
     * @type {Backbone.View|StandReserveModel}
     */
    var StandReserveModel = Backbone.Model.extend({
        /**
         * @memberOf StandReserveModel
         */
        reservation_form: '',

        url: serverParams.reservationUrl,

        defaults: {

        }

    });

    /**
     * Defines a View to show details for an {@link StandView}.
     *
     * @type {Backbone.View}
     */
    var StandDetailsView = Backbone.View.extend({
        /**
         * @type {HTMLElement}
         */
        el: null,
        /**
         * @type {jQuery}
         */
        $el: null,
        /**
         * @type {Object}
         */
        events: {

        },
        /**
         * @type {StandModel}
         */
        model: null,
        /**
         * Start up the view, binding events and calling initial rendering of elements.
         */
        initialize: function(){

            // every function that uses 'this' as the current object should be in here
            base.bindAll(this, 'render', 'close', 'refresh', 'setup');

            // the model for StandDetailsView objects, i.e "this.model" will be pointing to {@link StandModel}.
            this.listenTo(this.model, 'change', this.refresh);

        },
        /**
         * Perform initial rendering of the View by adding elements and defining event handlers.
         *
         * @returns {HTMLElement}
         */
        render: function(){

            var
                stand  = this.model,
                self   = this,
                elemId = 'standDetail'+ stand.get('id'),

                viewContent = ''+

                '<div id="'+ elemId +'" class="modal fade" role="dialog">'+
                '  <div class="modal-dialog">'+
                '    <div class="modal-content">'+
                '      <div class="modal-header">'+
                '        <button type="button" class="close" data-dismiss="modal">&times;</button>'+
                '        <h4 class="modal-title">'+

                         (stand.booked()
                            ? '<span class="co-logo-wrap">' +
                                '<i class="co-logo mini" style="background-image:url('+ stand.companyLogoUrl() +')">'+
                                '</i>'+
                              '</span>' +

                              '<span class="co-sname">'+ stand.get('co_sname') +'</span>' +
                              '<span class="stand-title '+ CLS_BOOKED +'">'+ stand.get('code') +'</span>'

                            : 'Stand Space - <span class="stand-title">'+ stand.get('code') +'</span>'
                         ) +

                '        </h4>'+
                '      </div>'+
                '      <div class="modal-body">'+
                '          <div class="stand-info">'+
                '              <div class="stand-desc"></div>'+
                '              '+
                '          </div>'+
                '          <div class="reservation-wrapper"></div>'+
                '          <figure class="real-image hidden"><img src="" /></figure>'+
                '      </div>'+
                '      <div class="progress-wrap">' +
                    '      <div class="progress-bar"></div>' +
                '      </div>'+
                '      <div class="modal-footer">'+
                (stand.booked()
                    ? '<div class="contact-info">' +
                      '<h4>Administrator</h4>' +
                      '<div class="admin">' +
                      '<span class="admin-name"></span><abbr class="separ">·</abbr>' +
                      '<span class="admin-email"></span>' +
                      '</div>'+
                      '</div>'
                    :
                      '<div class="stand-meters"></div>'+
                      '<div class="stand-price"></div>'+
                      '<button type="button" class="btn submit btn-success" disabled="true" data-dismiss="modal">' +
                        'Reserve' +
                      '</button>'
                ) +

                '      </div>'+
                '    </div>'+
                '  </div>'+
                '</div>';

            $('body').append(viewContent);

            var
                $view = this.$el = $('#'+ elemId).on('hidden.bs.modal', function(){

                    self.close();

                }).modal('show')

            ;

            base.incorporate( $view );

            this.el = $view[0];

            /**
             * Updates the model.
             */
            stand.fetch({

                data: {
                    stand_id: stand.get('id'),
                    event_id: stand.get('event_id')
                },

                success: function(model, response, request){

                    if (request.xhr.valid()){

                        self.setup();

                    }else{

                        $view
                            .find('.modal-body')
                            .html('');

                        base.setAlertBefore(
                            $view.find('.modal-footer'),
                            response,
                            $view,
                            base.unableToLoad('details for this Stand'),
                            'Please try again.',
                            false
                        );

                    }

                },

                error: function(/* model, xhr, options */){

                    base.alertAfter(
                        self.$el.find('.modal-header'),
                        base.unableToLoad('details')
                    );

                    $view
                        .find('.modal-footer .submit')
                        .fadeOut(function(){

                            $(this).remove();

                        });

                }
            });

            return this.$el;

        },
        /**
         * Composes the View upon successful opening of the dialog with details of the Stand.
         */
        setup: function(){

            var
                self     = this,
                stand    = this.model,
                $view    = this.$el,
                $figure  = $view.find('.modal-body .real-image'),

                $reservationWrapper = $view.find('.modal-body .reservation-wrapper'),
                $reservationForm,
                /*
                 * Upon successful response the model should be already updated with the file list, if any.
                 */
                reservationUrl   = stand.get('reservation_url'),
                filenameList = stand.get('file_list'),
                adminName    = stand.get('admin_name'),
                adminEmail   = stand.get('admin_email'),
                $footer      = $view.find('.modal-footer');

            $view
                .find('.modal-body .real-image')
                .removeClass('hidden')
                .find('img')
                .prop('src', serverParams.imageUrl +'/'+ stand.get('real_image'));

            $view
                .find('.modal-body .stand-desc')
                .html(stand.get('description'));


            if (stand.booked()){

                var hasFiles = filenameList && filenameList.length;

                $footer.addClass('file-folder'+ (!hasFiles ? ' empty': ''));

                $footer.find('.admin-name').html(adminName);

                $('<a/>')
                    .prop('href', 'mailto:'+ adminEmail)
                    .html(adminEmail)
                    .appendTo($footer.find('.admin-email'));

                $('<div>').addClass('files-title').appendTo($footer);

                if (hasFiles){

                    $('<h4>').html('Marketing Documents').appendTo($footer.find('.files-title'));

                    $footer.append($('<ul/>').addClass('file-list'));

                    $.each(filenameList, function (i){
                        var $li = $('<li/>')
                            .addClass('file-item')
                            .appendTo($footer.find('.file-list'));

                        $('<a/>')
                            .addClass('file-link')
                            .prop('target', '_blank')
                            .prop('href', reservationUrl + '/' + filenameList[i])
                            .text(filenameList[i])
                            .appendTo($li);
                    });

                }

            }else{

                $footer
                    .find('.stand-meters')
                    .html(stand.get('m2'));

                $footer
                    .find('.stand-price')
                    .html(stand.get('price'));

                $footer
                    .find('.submit')
                    .removeAttr('disabled')
                    .on({
                        click: function(evt){

                            /**
                             * Abort click if any error already displayed.
                             */
                            if ($reservationForm && $reservationForm.hasClass('has-alert')){
                                evt.preventDefault();
                                return false;
                            }

                            var
                                reservationModel = new StandReserveModel(),
                                $reserveBtn      = $(this).prop('disabled', true);

                            // ------------------------------ FETCH RESERVATION FORM -------------------------------

                            if (!$view.find('form').length){

                                reservationModel.fetch({
                                    data: {
                                        get_form: 1 // fetch empty form
                                    },
                                    success: function (model, response, request){

                                        if (request.xhr.valid()){

                                            // StandReserveModel.reservation_form = response.empty_form;

                                            $reservationWrapper.html(response.empty_form);

                                            $reservationForm = $reservationWrapper.find("form");

                                            base.incorporate( $reservationForm );

                                            $reservationWrapper.find('.input-file-t').on({
                                                change: function (){
                                                    var
                                                        $input = $(this),

                                                        numFiles = $input.get(0).files
                                                            ? $input.get(0).files.length
                                                            : 1,

                                                        label = $input.val().replace(/\\/g, '/').replace(/.*\//,'');

                                                    $input
                                                        .closest('.input-group')
                                                        .find(':text')
                                                        .val(numFiles > 1
                                                            ? numFiles + ' files selected'
                                                            : label
                                                        )
                                                    ;

                                                }
                                            });

                                            // collapse the figure
                                            $figure.slideUp(200);

                                            // collapse the description of te stand above the figure
                                            $view.find('.stand-info').slideUp(150);

                                            // slide down the reservation wrapper
                                            $reservationWrapper.css('max-height', 1500);

                                        }else
                                            base.alertBefore(
                                                $view.find('.modal-footer'),
                                                response.stsMessage()
                                            );

                                        $reserveBtn
                                            .removeAttr('disabled')
                                            .removeClass('btn-success')
                                            .addClass('btn-primary')
                                            .html('Confirm Reservation');

                                        $reservationForm.on({
                                            click: function(e){

                                                if ($(this).hasClass('has-alert')){

                                                    $(this).removeClass('has-alert');

                                                    $view
                                                        .find('.alert.alert-danger')
                                                        .slideUp(function(){

                                                            $(this).remove();

                                                        });

                                                }

                                            }
                                        });

                                        $reservationWrapper.find('form :text').first().focus();

                                    },
                                    error: function (/* model, xhr, options */){

                                        base.alertBefore(
                                            $view.find('.modal-footer'),
                                            base.unableToLoad('reservation form')
                                        );

                                        $reserveBtn
                                            .removeAttr('disabled');

                                    }
                                });

                            }
                            // -------------------------------- SUBMIT RESERVATION ---------------------------------
                            else{

                                var
                                    myData         = null,
                                    ajaxOptions    = {},
                                    processingMark = '<span class="processing"> ...<span>',
                                    totalFileSize  = getTotalFileSize($reservationForm),
                                    $progressBar   = $view.find('.progress-bar');

                                $reserveBtn.append(processingMark);

                                function uploadProgress(ev){

                                    var totalToUpload = ev.lengthComputable ? ev.total : totalFileSize;

                                    var percentUploaded = Math.floor(ev.loaded * 100 / totalToUpload);

                                    if ($progressBar.length) $progressBar.css('width', percentUploaded +'%');

                                    /*
                                     if (ev.lengthComputable){
                                     var percentUploaded = Math.floor(ev.loaded * 100 / ev.total);
                                     console.info('Uploaded '+percentUploaded+'%');
                                     }else{
                                     console.info('Uploaded '+ev.loaded+' bytes');
                                     }
                                     */

                                }

                                if ($reservationForm.hasFile()){

                                    myData = new FormData($reservationForm[0]);

                                    myData.append('stand_id', stand.get('id'));
                                    myData.append('event_id', stand.get('event_id'));

                                    ajaxOptions = {
                                        type: "POST",
                                        data: myData,
                                        processData: false,
                                        cache: false,
                                        contentType: false,
                                        xhr: function(){

                                            var xhrObj = $.ajaxSettings.xhr();

                                            if (xhrObj.upload)
                                                xhrObj.upload.addEventListener('progress', uploadProgress, false);

                                            return xhrObj;

                                        }
                                    };



                                }else{

                                    myData = $reservationForm.serializeObject();

                                    $.extend(
                                        myData,
                                        {
                                            stand_id: stand.get('id'),
                                            event_id: stand.get('event_id')
                                        }
                                    );

                                }

                                var unableToProcess = 'Unable to process the reservation.';

                                reservationModel.save(
                                    myData,

                                    $.extend(
                                        {},

                                        ajaxOptions,

                                        {
                                            success: function(model, response, request){

                                                stand
                                                    .booked(
                                                        response.rs_id,
                                                        response.co_sname,
                                                        response.user_dir_key,
                                                        response.user_logo_ext
                                                    );

                                                $progressBar.addClass('done');

                                                setTimeout(function(){

                                                    $progressBar.css('width', 0);

                                                    $progressBar.removeClass('done');

                                                    if (request.xhr.valid())
                                                        $progressBar.remove();

                                                }, 100);

                                                if (request.xhr.valid()){

                                                    $reservationWrapper
                                                        // add this class to remove CSS transition effects
                                                        // to not mess up with the slideUp().
                                                        .addClass('booked')
                                                        .slideUp(
                                                            1200,
                                                            function(){

                                                                $reservationWrapper.html(
                                                                    base.successBox(

                                                                        '<span class="booked">' +
                                                                        'Congratulations, you reservation number is:'+
                                                                        '<strong>#'+ response.rs_id +'</strong>' +
                                                                        '</span>',

                                                                        $reservationWrapper,

                                                                        false
                                                                    )
                                                                );

                                                                $reservationWrapper
                                                                    .removeClass('booked')
                                                                    .show();

                                                            }
                                                        );

                                                    $reserveBtn.replaceWith(
                                                        '<span class="booked-label">Booked!</span>'
                                                    );

                                                }else{

                                                    var alreadyTaken = response.rs_id && response.rs_id == -1;

                                                    if (alreadyTaken)

                                                        base.warningBefore(
                                                            $view.find('.modal-footer'),

                                                            unableToProcess +'<br><br>'+

                                                            response.stsMessage()
                                                        );

                                                    else{

                                                        base.setAlertBefore(
                                                            $view.find('.modal-footer'),
                                                            response,
                                                            $view,
                                                            unableToProcess,
                                                            'Please try again.'
                                                        );

                                                        $reservationForm.addClass('has-alert');
                                                        /*
                                                         base.alertBefore(
                                                         $view.find('.modal-footer'),

                                                         unableToProcess +'<br><br>'+

                                                         response.stsMessage()
                                                         );
                                                         */
                                                    }

                                                    if (alreadyTaken){

                                                        $reserveBtn.replaceWith(
                                                            '<span class="booked-label">Already Booked.</span>'
                                                        );

                                                        $reservationWrapper
                                                            // add this class to remove CSS transition effects
                                                            // to not mess up with the slideUp().
                                                            .addClass('booked')
                                                            .slideUp(
                                                                1200,
                                                                function(){

                                                                    $(this).remove();

                                                                }
                                                            );

                                                    }


                                                }

                                                $reserveBtn
                                                    .removeAttr('disabled')
                                                    .find('.processing').remove();

                                            },
                                            error: function(model, xhr, options) {

                                                base.setAlertBefore(
                                                    $view.find('.modal-footer'),
                                                    xhr,
                                                    $view,
                                                    unableToProcess,
                                                    'Please try again.'
                                                );
                                                /*
                                                 var msg = base.setTipsOrGetMessage(
                                                 xhr,
                                                 $view,
                                                 'Please try again.'
                                                 );

                                                 base.alertBefore(
                                                 $view.find('.modal-footer'),

                                                 unableToProcess + (!msg ? '' : '<br><br>'+ msg)

                                                 );
                                                 */

                                                $reservationForm.addClass('has-alert');

                                                $reserveBtn
                                                    .removeAttr('disabled')
                                                    .find('.processing').remove();

                                            }
                                        }
                                    )
                                );

                            }

                            evt.preventDefault();

                            return false;

                        }
                    });
            }
        },
        /**
         * Removes the element from the page.
         */
        close: function(){

            this.$el.remove();

        },
        refresh: function(){

        }
    });

    /**
     * Returns total size in bytes of selected files in a form.
     *
     * @param {Element|jQuery} $form
     *
     * @return {Number}
     */
    function getTotalFileSize($form){

        if (!($form instanceof $)) $form = $($form);

        var $fileInputs = $('[type=file]', $form), files, total = 0;

        $fileInputs.each(function(i, elemX){
            files = $(elemX).prop('files');

            for (i = 0; i < files.length; i++){
                //fileItem = files.item ? files.item(i) : files[i];
                total += files.item(i).size || files.item(i).fileSize;
            }
        });

        return total;
    }

    /**
     * Defines a collection of {@link StandModel}, in order to facilitate mass operations against a list.
     *
     * @type {Backbone.Collection}
     */
    var StandList = Backbone.Collection.extend({
        model: StandModel
    });

    /**
     * Defines the view that manages the list of {@link StandView}.
     *
     * @type {Backbone.View}
     */
    var HallMapView = Backbone.View.extend({

        el: $mapWrapper,

        events: {

        },
        /**
         * Start up the view, binding events and calling initial rendering of elements.
         */
        initialize: function(){

            // every function that uses 'this' as the current object should be in here
            base.bindAll(this, 'render');

            this.collection = new StandList();

            //this.model.bind('change', this.update);

            this.render();

        },
        /**
         * Perform initial rendering of the View by adding elements and defining event handlers.
         *
         * Important: this method runs asynchronously, since it might need to wait few milliseconds until SVG element
         *            is fully loaded in the page.
         */
        render: function(){

            var attempts = 0;

            function attemptToSetup(){

                var
                    $stand,
                    setupDone = true,
                    $svgDoc = $('.map-wrapper svg'),
                    fullStandId;

                /*
                 * Select the respective SVG document.
                 *
                 * It has been disabled since the whole SVG element is being loaded in the page, in order to apply
                 * CSS.
                 */
                //$svgDocument = $('#event_map');
                //if ($svgDocument[0].contentDocument){

                //if ($svgDoc.length){
                    /**
                     * Loop through the list of stands defined by server-side, which should match the info in the
                     * current SVG element/object loaded.
                     */
                    for (var standId in serverParams.stands){

                        /*
                         * Query the respective stand SVG path element.
                         *
                         * Disabled as explained above.
                         */
                        //$stand = $('#path_' + standId, $svgDocument[0].contentDocument);

                        fullStandId = serverParams.eventId +'_'+ standId;

                        $stand = $('#path_' + fullStandId);

                        /**
                         * If the SVG doc is not present for any reason create the view anyways, to bind event handler
                         * for the alternative basic list of stands.
                         */
                        if (!$svgDoc.length || $stand.length){

                            var standView = new StandView({
                                model: new StandModel({

                                    id:            standId,
                                    event_id:      serverParams.eventId,
                                    full_id:       fullStandId,
                                    code:          serverParams.stands[standId][0],
                                    status:        serverParams.stands[standId][2],
                                    price:         serverParams.stands[standId][1],
                                    rs_id:         serverParams.stands[standId][3],
                                    co_sname:      serverParams.stands[standId][4],
                                    user_dir_key:  serverParams.stands[standId][5],
                                    user_logo_ext: serverParams.stands[standId][6],
                                    logo_pos:      serverParams.stands[standId][7]

                                }),
                                el: $stand
                            });

                            standView.render();

                        }
                        /**
                         * If any of the stands path has not been found in the SVG, try again.
                         */
                        else{

                            setupDone = false;
                            break;

                        }

                    }
                //}else
                    // setupDone = false;

                if (!setupDone && attempts < 10){

                    setTimeout(attemptToSetup, 500);
                    attempts++;
                }

            }

            setTimeout(attemptToSetup, 200);

        }
    });

    var hallMapView = new HallMapView();

    /**
     * Defines a Model for the admin routines.
     *
     * @type {Backbone.Model}
     */
    var AdminModel = Backbone.Model.extend({

        url: serverParams.adminUrl,

        event_id: serverParams.eventId

    });

    /**
     * Defines a View to the Admin menu, in order to provide access to routines such as Email Report.
     *
     * @type {Backbone.View}
     */
    var AdminView = Backbone.View.extend({
        /**
         * @type {HTMLElement}
         */
        el: null,
        /**
         * @type {jQuery}
         */
        $el: null,
        /**
         * @type {Object}
         */
        events: {

        },
        /**
         * @type {StandModel}
         */
        model: null,
        /**
         * Start up the view, binding events and calling initial rendering of elements.
         */
        initialize: function(){

            // every function that uses 'this' as the current object should be in here
            base.bindAll(this, 'render', 'showDialog');

            var self = this;

            $('#menu-send-rep-email').on({
                click: function(){

                    self.showDialog();

                }
            });

        },
        render: function(){


            this.showDialog();


        },
        /**
         * Perform initial rendering of the View by adding elements and defining event handlers.
         *
         * @returns {HTMLElement}
         */
        showDialog: function(){

            var
                admin  = this.model,
                self   = this,
                elemId = 'email-rep-dialog',

                viewContent = ''+

                    '<div id="'+ elemId +'" class="modal fade" role="dialog">'+
                    '  <div class="modal-dialog">'+
                    '    <div class="modal-content">'+
                    '      <div class="modal-header">'+
                    '        <button type="button" class="close" data-dismiss="modal">&times;</button>'+
                    '        <h4 class="modal-title">'+
                    '           Email Report'+
                    '        </h4>'+
                    '      </div>'+
                    '      <div class="modal-body">'+
                    '      </div>'+
                    '      <div class="progress-wrap">' +
                    '      <div class="progress-bar"></div>' +
                    '      </div>'+
                    '      <div class="modal-footer">'+
                    '<button type="button" class="btn submit btn-primary" disabled="true" data-dismiss="modal">' +
                    'Ok' +
                    '</button>'+
                    '      </div>'+
                    '    </div>'+
                    '  </div>'+
                    '</div>';

            $('body').append(viewContent);

            var
                $view = this.$el = $('#'+ elemId).on('hidden.bs.modal', function(){

                    self.close();

                }).modal('show');

            base.incorporate( $view );

            this.el = $view[0];

            /**
             * Updates the model.
             */
            admin.fetch({

                data:{
                    event_id: admin.event_id,
                    e_report: 1,
                    can_do: 1
                },

                success: function(model, response, request){

                    if (request.xhr.valid()){

                        if (response.yes){

                            var
                                $form,
                                $submit      = $view.find('.modal-footer .submit'),
                                $viewContent = $view.find('.modal-body');

                            $viewContent
                                .html(
                                    '<p class="lead">Receives a list with all users of stand spaces.</p>' +
                                    '<div class="report-admin">' +
                                    '<form method="POST">' +
                                    '<div class="form-group">' +
                                    '  <input class="form-control" placeholder="Email" autocomplete="off"' +
                                    ' name="admin_email" type="text">' +
                                    '  <span class="help-block hidden"></span>' +
                                    '  </div>' +
                                    '</div>'+
                                    '</form>'
                                );

                            $form = $view.find('form');

                            base.incorporate(
                                $form.on({
                                    submit: function(evt){

                                        evt.preventDefault();

                                        return false;

                                    }
                                })
                            );

                            $submit
                                .removeAttr('disabled')
                                .html('Send')
                                .on({
                                    click: function(evt){

                                        var myData = $view.find('form').serializeObject();

                                        $submit
                                            .prop('disabled', true);

                                        admin.save(

                                            $.extend(
                                                myData,
                                                {
                                                    event_id: admin.event_id
                                                }
                                            ),

                                            $.extend(
                                                {},

                                                {
                                                    success: function(model, response, request){

                                                        if (request.xhr.valid()){

                                                            $viewContent.html(

                                                                base.successBox(
                                                                    'Report has been sent!',
                                                                    $viewContent,
                                                                    false
                                                                )
                                                            );

                                                            $submit.fadeOut(200, function(){

                                                                $(this).replaceWith(serverParams.charBooked);

                                                            });

                                                        }else{

                                                            base.setWarningBefore(
                                                                $view.find('.modal-footer'),
                                                                response,
                                                                $view,
                                                                'Unable to send report.',
                                                                'Please try again.'
                                                            );

                                                            $submit
                                                                .removeAttr('disabled');

                                                        }
                                                    },
                                                    error: function (model, xhr, options){

                                                        base.setAlertBefore(
                                                            $view.find('.modal-footer'),
                                                            xhr,
                                                            $view,
                                                            '',
                                                            'Please try again.',
                                                            false
                                                        );

                                                        $submit
                                                            .removeAttr('disabled');

                                                    }
                                                }
                                            )
                                        );

                                        evt.preventDefault();
                                        return false;

                                    }
                                });

                        }else{

                            base.infoAfter(
                                self.$el.find('.modal-header'),
                                response.msg,
                                false
                            );

                            $view
                                .find('.modal-footer .submit')
                                .removeAttr('disabled');

                        }

                    }else{

                        $view
                            .find('.modal-footer btn')
                            .removeAttr('disabled');

                        base.setAlertBefore(
                            $view.find('.modal-footer'),
                            response,
                            $view,
                            base.unableToLoad('dialog.'),
                            'Please try again.',
                            false
                        );

                    }

                },

                error: function(/* model, xhr, options */){

                    base.alertAfter(
                        self.$el.find('.modal-header'),
                        base.unableToLoad('dialog')
                    );

                }
            });

            return this.$el;

        },
        /**
         * Removes the element from the page.
         */
        close: function(){

            this.$el.remove();

        }
    });

    var reportEmailMenuView = new AdminView({
        model: new AdminModel()
    });

});