define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/app-layout.html'
], function($, _, Backbone, appLayout){


    var AppView = Backbone.View.extend({

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        el: null,

        // Our template for the line of statistics at the bottom of the app.
        appLayout: _.template(appLayout),

        // Delegated events for creating new items, and clearing completed ones.
        events: {

        },

        /**
         * Инициализация отображения приложения
         */
        initialize: function() {
            this.renderAppLayout();

        },

        /**
         * Рендер layout приложения
         */
        renderAppLayout: function()
        {
            $(this.el).html(this.appLayout());
        }




    });
    return AppView;
});