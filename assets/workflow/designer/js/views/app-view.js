define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'text!templates/app-layout.html'
], function($, _, Backbone, joint, appLayout){
    return Backbone.View.extend({

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        el: null,

        'umlLayoutSelector': '.uml-layout',

        // Our template for the line of statistics at the bottom of the app.
        appLayout: _.template(appLayout),

        // Delegated events for creating new items, and clearing completed ones.
        events: {

        },

        /**
         * Инициализация отображения приложения
         */
        initialize: function() {
            //WorkflowDescriptor.prototype.bind('sync', this.renderWorkflowDescriptor);


            this.renderAppLayout();

            //var model = new WorkflowDescriptor();
            //model.fetch();
        },

        /**
         * Рендер layout приложения
         */
        renderAppLayout: function()
        {
            $(this.el).html(this.appLayout());

        }
    });

});