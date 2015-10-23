define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'text!templates/uml-state-machine-view.html'
], function($, _, Backbone, joint, umlStateMachineView){
    var UmlStateMachineView = Backbone.View.extend({
        tagName: 'div',
        model: null,
        graph: null,
        width: 1024,
        height: 800,
        levels: [],

        template: _.template(umlStateMachineView),

        getWidth: function() {
            return this.width;
        },
        getHeight: function() {
            return this.height;
        },
        getGraph: function() {
            if (this.graph) {
                return this.graph;
            }

            var paperEl = $('.paper', $(this.el));

            var graph = new joint.dia.Graph();

            var paper = new joint.dia.Paper({
                el: paperEl,
                width: this.getWidth(),
                height: this.getHeight(),
                gridSize: 1,
                model: graph
            });

            this.graph = graph;
            return this.graph;

        },
        renderStep: function(stepId) {
            var step = this.model.get('steps').get(stepId)

            var uml = joint.shapes.uml;
            var graph = this.getGraph();


            var state = new uml.State({
                position: { x:100  , y: 100 },
                size: { width: 200, height: 100 },
                name: step.get('name'),
                attrs: {
                    '.uml-state-body': {
                        fill: 'rgba(48, 208, 198, 0.1)',
                        stroke: 'rgba(48, 208, 198, 0.5)',
                        'stroke-width': 1.5
                    },
                    '.uml-state-separator': {
                        stroke: 'rgba(48, 208, 198, 0.4)'
                    }
                }
            });


            graph.addCell(state);

            var linkAttrs =  {
                'fill': 'none',
                'stroke-linejoin': 'round',
                'stroke-width': '2',
                'stroke': '#4b4a67'
            };

            var transitons = [
                new uml.Transition({
                    source: { id: state.id },
                    target: { id: state.id },
                    attrs: {'.connection': linkAttrs },
                    vertices: [{x: 485,y: 140}, {x: 620, y: 90}]
                })
            ];

            graph.addCells(transitons);






            console.log(step);

        },
        renderStartState: function() {

            var graph = this.getGraph();


            var uml = joint.shapes.uml;


            graph.addCells({
                'start': new uml.StartState({
                    position: { x:(this.getWidth() / 2)  , y: 20 },
                    size: { width: 30, height: 30 },
                    attrs: {
                        'circle': {
                            fill: '#4b4a67',
                            stroke: 'none'
                        }
                    }
                })
            });
        },
        buildLevel0: function() {

        },
        drawUml: function(){
            this.levels = [];

            this.renderStartState();


            var initialActions = this.model.get('initial-actions');
            initialActions.each(function(action){
                if (action.get('results').length > 0) {

                }
                var unconditionalResult = action.get('unconditional-result');
                var stepId = unconditionalResult.get('step');
                if (stepId) {
                    this.renderStep(stepId);

                }
            }, this);



            //
            //var states = {
            //
            //    s0: new uml.StartState({
            //        position: { x:20  , y: 20 },
            //        size: { width: 30, height: 30 },
            //        attrs: {
            //            'circle': {
            //                fill: '#4b4a67',
            //                stroke: 'none'
            //            }
            //        }
            //    }),
            //
            //    s1: new uml.State({
            //        position: { x:100  , y: 100 },
            //        size: { width: 200, height: 100 },
            //        name: "state 1",
            //        events: ["entry / init()","exit / destroy()"],
            //        attrs: {
            //            '.uml-state-body': {
            //                fill: 'rgba(48, 208, 198, 0.1)',
            //                stroke: 'rgba(48, 208, 198, 0.5)',
            //                'stroke-width': 1.5
            //            },
            //            '.uml-state-separator': {
            //                stroke: 'rgba(48, 208, 198, 0.4)'
            //            }
            //        }
            //    }),
            //
            //    s2: new uml.State({
            //        position: { x:400  , y: 200 },
            //        size: { width: 300, height: 300 },
            //        name: "state 2",
            //        events: ["entry / create()","exit / kill()","A / foo()","B / bar()"],
            //        attrs: {
            //            '.uml-state-body': {
            //                fill: 'rgba(48, 208, 198, 0.1)',
            //                stroke: 'rgba(48, 208, 198, 0.5)',
            //                'stroke-width': 1.5
            //            },
            //            '.uml-state-separator': {
            //                stroke: 'rgba(48, 208, 198, 0.4)'
            //            }
            //        }
            //    }),
            //
            //    s3: new uml.State({
            //        position: { x:130  , y: 400 },
            //        size: { width: 160, height: 60 },
            //        name: "state 3",
            //        events: ["entry / create()","exit / kill()"],
            //        attrs: {
            //            '.uml-state-body': {
            //                fill: 'rgba(48, 208, 198, 0.1)',
            //                stroke: 'rgba(48, 208, 198, 0.5)',
            //                'stroke-width': 1.5
            //            },
            //            '.uml-state-separator': {
            //                stroke: 'rgba(48, 208, 198, 0.4)'
            //            }
            //        }
            //    }),
            //
            //    s4: new uml.State({
            //        position: { x:530  , y: 400 },
            //        size: { width: 160, height: 50 },
            //        name: "sub state 4",
            //        events: ["entry / create()"],
            //        attrs: {
            //            '.uml-state-body': {
            //                fill: 'rgba(48, 208, 198, 0.1)',
            //                stroke: 'rgba(48, 208, 198, 0.5)',
            //                'stroke-width': 1.5
            //            },
            //            '.uml-state-separator': {
            //                stroke: 'rgba(48, 208, 198, 0.4)'
            //            }
            //        }
            //    }),
            //
            //    se: new uml.EndState({
            //        position: { x:750  , y: 550 },
            //        size: { width: 30, height: 30 },
            //        attrs: {
            //            '.outer': {
            //                stroke: "#4b4a67",
            //                'stroke-width': 2
            //            },
            //            '.inner': {
            //                fill: '#4b4a67'
            //            }
            //        }
            //    })
            //
            //};
            //
            //graph.addCells(states);
            //
            //states.s2.embed(states.s4);
            //
            //var linkAttrs =  {
            //    'fill': 'none',
            //    'stroke-linejoin': 'round',
            //    'stroke-width': '2',
            //    'stroke': '#4b4a67'
            //};
            //
            //var transitons = [
            //    new uml.Transition({
            //        source: { id: states.s0.id },
            //        target: { id: states.s1.id },
            //        attrs: {'.connection': linkAttrs }
            //    }),
            //    new uml.Transition({
            //        source: { id: states.s1.id },
            //        target: { id: states.s1.id },
            //        attrs: {'.connection': linkAttrs }
            //    }),
            //    new uml.Transition({
            //        source: { id: states.s1.id },
            //        target: { id: states.s2.id },
            //        attrs: {'.connection': linkAttrs }
            //    }),
            //    new uml.Transition({
            //        source: { id: states.s1.id },
            //        target: { id: states.s3.id },
            //        attrs: {'.connection': linkAttrs }
            //    }),
            //    new uml.Transition({
            //        source: { id: states.s3.id },
            //        target: { id: states.s4.id },
            //        attrs: {'.connection': linkAttrs }
            //    }),
            //    new uml.Transition({
            //        source: { id: states.s2.id },
            //        target: { id: states.se.id },
            //        attrs: {'.connection': linkAttrs }
            //    })
            //];
            //
            //graph.addCells(transitons);
            return this;
        },
        render: function() {
            $(this.el).html(this.template());

            return this;
        }
    });
    return UmlStateMachineView;
});