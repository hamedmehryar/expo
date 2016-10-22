/**
 * JS for the home view page.
 *
 * Wait until page is ready, by jQuery, and make things happen!
 *
 * @author     hamedmehryar
 *
 * @module EventListView
 * @name eventsView
 * @type {Backbone.View|Object}
 */
$(function(){

    var
        /**
         * Points the server params sent by server-side in the bottom of the page.
         *
         * @type {jQuery}
         */
        serverParams = jsFooterParams,
        /**
         * The wrapper of exposition events.
         *
         * @type {jQuery}
         */
        $eventsCircle = $(".circle-container");

    var
        $events,
        $middle   = $eventsCircle.find(".middle-elem"),
        divTop,
        divLeft,
        numEvents,
        // the angle to put the first image at. a number between 0 and 2pi
        start = 0.25,
        step;

    /**
     * Basic model of an exposition event.
     */
    var Event = Backbone.Model.extend({
        defaults: {
            code: '',
            name: '',
            location: '',
            start_at: null,
            end_at: null,
            description: null
        }
    });

    /**
     * Defines the View to handle an exposition event.
     *
     * @type {Backbone.View}
     */
    var EventView = Backbone.View.extend({

    });

    /**
     * Defines a collection of Event, in order to facilitate mass operations against the list, including the ability
     * to remove attached events if needed.
     */
    var EventList = Backbone.Collection.extend({
        model: Event
    });

    /**
     * Defines the View that manages the list of exposition events.
     *
     * @type {Backbone.View}
     */
    var EventListView = Backbone.View.extend({
        /**
         * All events managed by/for this view.
         */
        events: {
            'click article.event': 'showExpoDetails'
        },
        /**
         * List of exposition events.
         */
        eventViews: [],
        /**
         * The current exposition event selected by user.
         */
        $eventSelected: null,
        /**
         * Start up the view, binding events and calling initial rendering of elements.
         */
        initialize: function(){

            var self = this;

            // every function that uses 'this' as the current object should be in here
            base.bindAll(
                this, 'render', 'appendEvent', 'addEvent', 'showExpoDetails', 'checkToFold', 'arrangeEvents'
            );

            $('body').on({
                click: function(evt){

                    self.checkToFold(evt);

                }
            });

            this.collection = new EventList();

            // collection event binder
            this.collection.bind('add', this.appendEvent);

            this.render();

        },
        /**
         * Perform initial rendering of the View by adding elements and defining event handlers.
         *
         * @returns {HTMLElement}
         */
        render: function(){

            var self = this;

            $events = $eventsCircle.find('article');

            numEvents = $events.length;

            // Now loop through the items and position them in a circle
            $events.each(function( index ){

                self.addEvent($(this));

            });

            self.alignEvents(this);

            $(window).on('resize', function(e){

                self.alignEvents();

            }, 250); // waits 250ms to trigger the event

        },
        /**
         * Adds a an existing View from already rendered in the first load of the page.
         * 
         * @param {jQuery} $element
         */
        addEvent: function($element){

            var item = new Event();

            item.set({
                code:        $element.prop('id'),
                image_type:  $element.prop('data-itype'),
                name:        $element.find('.title h3').html(),
                location:    $element.find('.body .location').html(),
                start_at:    $element.find('.body .start_at span').html(),
                end_at:      $element.find('.body .end_at span').html(),
                description: $element.find('.body .desc p').html()
            });

            this.eventViews.push($element);

            // add item to collection; view is updated via event 'appendEvent', since it is bound above
            this.collection.add(item);
        },
        /**
         * Creates {@link Event} View based for new models coming in.
         *
         * @todo this method needs to be implemented when Async refresh requests starts happening in the home page.
         *
         * @param {Event} event
         */
        appendEvent: function(event){

            this.alignEvents();
        },
        /**
         * Expand the clicked exposition event and re-align all nodes in the circle of exposition events.
         *
         * @param {jQuery.Event} clickEvt
         */
        showExpoDetails: function(clickEvt){

            var
                $target     = $(clickEvt.target),
                $event  = $target.closest('.event'),
                goToReservation = $target.is('button.book')
            ;

            if (!$event.hasClass('surrogate')){

                if (goToReservation){

                    clickEvt.preventDefault();

                    // Open respective
                    window.location.href = serverParams.event_detail_path + $event.prop('id');

                }else{

                    if (this.$eventSelected && this.$eventSelected[0] != $event[0])
                        this.switchEventBoxState(this.$eventSelected, true);

                    this.switchEventBoxState($event);

                    this.arrangeEvents();

                }

            }

        },
        /**
         * Close the current selected exposition event, if the click is performed out of any expo event box, for
         * instance in any "empty" part of the page.
         *
         * @param {jQuery.Event} clickEvent
         */
        checkToFold: function(clickEvent){

            if (this.$eventSelected){

                var $target = $(clickEvent.target);

                if (!$target.closest('.event').length){

                    this.switchEventBoxState(this.$eventSelected);

                    this.arrangeEvents();

                }


            }

        },
        /**
         * Updates the state of the target exposition event, which causes the element to be expanded
         *
         * @param {jQuery} $event
         *
         * @param {Boolean} [fromAnother] Specifies whether the $event is being switched off due to the click in
         *                  another exposition event than itself.
         */
        switchEventBoxState: function ($event, fromAnother){

            if ($event.is('.selected')){

                $('#su-'+ $event.prop('id')).remove();

                $event
                    .addClass('unselecting')
                    .removeClass('selected');

                setTimeout(function(){

                    $event.removeClass('unselecting');

                }, 300);

                $event
                    .find('button.book')
                    .css('visibility', 'hidden');

                if (!fromAnother)
                    this.$eventSelected = null;

                this.eventViews.forEach(function($eventX){

                    $eventX.removeClass('behind');

                });

            }else{

                this.$eventSelected = $event;

                $event.before(
                    $('<article/>')
                        .addClass('event surrogate')
                        .prop('id', 'su-'+ $event.prop('id'))
                );


                $event
                    .addClass('selected')
                    .find('.body')
                    .css('display', 'block');

                $event
                    .find('button.book')
                    .css('visibility', 'visible');

                $event.center();

                setTimeout(function(){

                    $event.center();

                }, 300);

                this.eventViews.forEach(function($eventX){

                    if ($eventX[0] !== $event[0])
                        $eventX.addClass('behind');

                });

            }

        },
        /**
         * Align and re-align event boxes. The second alignment is performed after few milliseconds. Since the boxes
         * will be re-sized upon click within 0.3 milliseconds, which is defined by CSS styles, the second re-align
         * ensure items will be organized in the circle accordingly.
         */
        arrangeEvents: function(){

            this.alignEvents();

            // Re-align since after $event will have its width re-sized based on CSS selector ".selected".
            setTimeout(this.alignEvents, 300);

        },
        /*
         * This method do nothing for now..., but may be needed down the road, therefore it has been kept here.
         *
         * @param {Boolean} [initialLoad] If assigned specifies that is a call for the initial rendering.
         */
        alignEvents: function (initialLoad){

            if (this.$eventSelected)
                this.$eventSelected.center();

        }
    });

    var eventsView = new EventListView({el: $eventsCircle[0], $el: $eventsCircle});

});