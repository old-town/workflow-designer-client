define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'service/state-machine-graph-builder',
    'views/uml-state-machine-config',

    'models/descriptor/workflow',

    'text!templates/uml-state-machine-view.html'
], function ($, _, Backbone, joint, StateMachineGraphBuilder, conf, WorkflowDescriptor, umlStateMachineView) {
    return Backbone.View.extend({

        viewGraph: null,
        paper: null,
        tagName: 'div',
        model: null,

        template: _.template(umlStateMachineView),
        paperElSelector: '.paper',
        className: 'graph-viewport',

        initialize: function() {

            WorkflowDescriptor.prototype.bind('sync', this.drawUml);
            var model = new WorkflowDescriptor();
            model.fetch();
        },

        //renderWorkflowDescriptor: function(model) {
        //    var view = new UmlStateMachineView({
        //        'model': model
        //    });
        //    $(this.el).empty();
        //    $('.uml-layout', this.el).append(view.render().el);
        //    view.drawUml();
        //},

        drawUml: function () {


            var stateMachineGraphBuilder = new StateMachineGraphBuilder({
                model: this.model
            });

            var graph = stateMachineGraphBuilder.buildGraph();

            this.renderGraph(graph);

        },


        renderGraph: function(graph) {
            graph.nodes().forEach(_.bind(this.renderGraphNode, this, graph));

            graph.edges().forEach(_.bind(this.renderEdge, this, graph));
        },



        getViewGraph: function () {
            if (this.viewGraph) {
                return this.viewGraph;
            }

            var elRender = $(this.paperElSelector, $(this.el));

            this.viewGraph = new joint.dia.Graph();

            this.paper = new joint.dia.Paper({
                el: elRender,
                width: elRender.width(),
                //height: elRender.height(),
                height: 2000,
                gridSize: 1,
                model: this.viewGraph
            });

            return this.viewGraph;

        },

        getPaper: function() {
            if (this.paper) {
                return this.paper;
            }
            this.getViewGraph();

            return this.paper;
        },


        renderGraphNode: function(graph, v) {



            var vData = graph.node(v);
            //console.log("Node " + v + ": " + JSON.stringify(this.getGraph().node(v)));

            console.log(vData.type);

            switch (vData.type) {
                case conf.initStateNodeType:
                {
                    this.redrawInitState(graph, v);
                    break;
                }
                case conf.stepNodeType:
                {
                    this.redrawState(graph, v);
                    break;
                }
                case conf.conditionNodeType:
                {
                    this.redrawCondition(graph, v);
                    break;
                }
                case conf.splitNodeType:
                {
                    this.redrawSplit(graph, v);
                    break;
                }
                case conf.joinNodeType:
                {
                    this.redrawJoin(graph, v);
                    break;
                }
            }
        },

        renderEdge: function(graph, e) {
            //console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(this.getGraph().edge(e)));

            var eData = graph.edge(e);

            var sourceNode = this.getViewGraph().getCell(e.v);
            var targetNode = this.getViewGraph().getCell(e.w);

            var transitionName = this.buildTransitionName(e.v, e.w);

            var transitionConfig = _.clone(conf.defaultTransitionConfig);
            _.extend(transitionConfig, {
                id: transitionName,
                source: {
                    id: sourceNode.id
                },
                target: {
                    id: targetNode.id
                }
            });

            var transition;
            if (transitionConfig.source.id === transitionConfig.target.id) {

                var box = this.getPaper().findViewByModel(sourceNode).getBBox();

                transitionConfig['vertices'] = [
                    {
                        x: box.x + box.width+30,
                        y: box.y - 10
                    },
                    {
                        x: box.x + box.width+30,
                        y: box.y + 10
                    }
                ];

                transition = new joint.shapes.fsa.Arrow(transitionConfig);

            } else {
                if (eData.points.length > 2) {
                    transitionConfig['vertices'] = [];
                    for (var i = 1, maxI = eData.points.length - 1; i < maxI; i++) {
                        var currentPoint = eData.points[i];
                        transitionConfig['vertices'].push(currentPoint);

                    }
                }

                transition = new joint.shapes.fsa.Arrow(transitionConfig);
            }


            this.getViewGraph().addCell(transition);

        },

        redrawInitState: function(graph, v) {
            var vData = graph.node(v);

            if (!this.getViewGraph().getCell(v)) {

                var uml = joint.shapes.uml;
                var startStateConfig = _.clone(conf.defaultStartStateConfig);
                _.extend(startStateConfig, {
                    id: v,
                    position: {x: vData.x, y: vData.y}
                });
                this.getViewGraph().addCell(new uml.StartState(startStateConfig));
            }
            this.getViewGraph().getCell(v).position({x: vData.x, y: vData.y});

        },

        redrawState: function(graph, v) {
            var vData = graph.node(v);
            if (!this.getViewGraph().getCell(v)) {
                var uml = joint.shapes.uml;
                var stateConfig = _.clone(conf.defaultStateConfig);
                _.extend(stateConfig, {
                    id: v,
                    position: {x: vData.x, y: vData.y},
                    name: vData.metadata.model.get('name')
                });
                this.getViewGraph().addCell(new uml.State(stateConfig));
            }
            this.getViewGraph().getCell(v).position({x: vData.x, y: vData.y});
        },

        redrawCondition: function(graph, v) {

            var vData = graph.node(v);

            if (!this.getViewGraph().getCell(v)) {
                var erd = joint.shapes.erd;

                var conditionConfig = _.clone(conf.defaultConditionConfig);
                _.extend(conditionConfig, {
                    id: v,
                    position: {x: vData.x, y: vData.y}
                });

                this.getViewGraph().addCell(new erd.Relationship(conditionConfig));
            }
            this.getViewGraph().getCell(v).position({x: vData.x, y: vData.y});
        },

        redrawSplit: function(graph, v) {
            var vData = graph.node(v);

            if (!this.getViewGraph().getCell(v)) {
                var devs = joint.shapes.pn;

                var splitConfig = _.clone(conf.defaultSplitConfig);
                _.extend(splitConfig, {
                    id: v,
                    position: {x: vData.x, y: vData.y}
                });
                //splitConfig['attrs']['.label']['text'] =  'split_id:' + vData.metadata.model.get('id');


                this.getViewGraph().addCell(new devs.Place(splitConfig));
            }
            this.getViewGraph().getCell(v).position({x: vData.x, y: vData.y});

        },

        redrawJoin: function(graph, v) {
            var vData = graph.node(v);

            if (!this.getViewGraph().getCell(v)) {
                var devs = joint.shapes.pn;

                var joinConfig = _.clone(conf.defaultJoinConfig);
                _.extend(joinConfig, {
                    id: v,
                    position: {x: vData.x, y: vData.y}
                });
                //splitConfig['attrs']['.label']['text'] =  'split_id:' + vData.metadata.model.get('id');

                this.getViewGraph().addCell(new devs.Place(joinConfig));
            }
            this.getViewGraph().getCell(v).position({x: vData.x, y: vData.y});
        },

        buildTransitionName: function(sourceNodeName, targetNodeName) {
            return sourceNodeName + '-' + targetNodeName;
        },


        render: function () {
            $(this.el).html(this.template());

            return this;
        }
    });
});