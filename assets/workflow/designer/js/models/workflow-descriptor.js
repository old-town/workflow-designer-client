define(['underscore', 'backbone', 'conf'], function(_, Backbone, conf) {
    var WorkflowDescriptor = Backbone.Model.extend({
        urlRoot: function(){
            if (this.isNew()){
                return conf.restBaseUrl +  "workflow-descriptor";
            } else {
                return conf.restBaseUrl +  "workflow-descriptor/" + this.id;
            }
        },
        initialize: function() {

        }
    });
    return WorkflowDescriptor;
});