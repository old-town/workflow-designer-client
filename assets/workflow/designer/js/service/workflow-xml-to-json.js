define(['underscore', 'jquery','jquery-xpath'], function(_, $) {
    var Parser = function(attributes, options) {

        this.initialize.apply(this, arguments);
    };
    _.extend(Parser.prototype, {
        /**
         * Инициализация парсера
         */
        initialize: function(){},
        /**
         * Парсинг xml workflow
         *
         * @param data
         * @returns {{steps: Array}}
         */
        parse: function(data){
            var parsed = {
                'steps': [],
                'initial-actions': []
            };
            var steps = this.parseSteps(data);
            if (!steps) {
                throw new Error('steps not exists');

            }
            parsed['steps'] = steps;


            var actions = this.parseInitialActions(data);
            if (!actions) {
                throw new Error('initial actions not exists');
            }
            parsed['initial-actions'] = actions;

            console.group('workflow-json');
            console.log(parsed);
            console.groupEnd();
            return parsed;
        },
        /**
         *
         * @param stepEl
         * @returns {Array}
         */
        parseInitialActions: function(stepEl) {
            var actions = [];
            $(stepEl).xpath('.//initial-actions/action').each(_.bind(function(actionIndex, actionEl){
                var action = this.parseDefaultAction(actionEl);
                actions.push(action);
            }, this));
            if (0 === actions.length) {
                actions = false;
            }

            return actions;
        },
        /**
         * Парсинг шагов workflow
         *
         * @param data
         * @returns {Array}
         */
        parseSteps: function(data) {
            var steps = [];
            $(data).xpath('//steps/step').each(_.bind(function(stepIndex, stepEl){
                var step = {
                    'id': undefined,
                    'name': undefined,
                    'actions': {

                    }

                };
                var id = $(stepEl).attr('id');
                if (!id) {
                    throw new Error('attribute id not exists');
                }
                step['id'] = id;

                var name = $(stepEl).attr('name');
                if (!name) {
                    throw new Error('attribute name not exists');
                }
                step['name'] = name;

                var actions = this.parseActionsFromStep(stepEl);
                if (actions) {
                    step['actions'] = actions;
                }

                steps.push(step);
            }, this));
            if (0 === steps.length) {
                steps = false;
            }
            return steps;
        },
        /**
         * Парсинг перехода между шагами
         *
         * @param actionEl
         * @returns {{unconditional-result: null, results: Array}}
         */
        parseDefaultAction: function(actionEl){
            var action = {
                'unconditional-result': null,
                'results': []
            };
            var id = $(actionEl).attr('id');
            if (!id) {
                throw new Error('attribute id not exists');

            }
            action['id'] = id;

            var name = $(actionEl).attr('name');
            if (!name) {
                throw new Error('attribute name not exists');

            }
            var unconditionalResult = this.parseUnconditionalResults(actionEl);
            if (!unconditionalResult) {
                throw new Error('unconditional result not exists');

            }
            action['unconditional-result'] = unconditionalResult;


            var results = this.parseResult(actionEl);
            if (results) {
                action['results'] = results;
            }

            action['name'] = name;

            return action;
        },
        /**
         * Парсинг переходов между шагами
         *
         * @param stepEl
         * @returns {{}}
         */
        parseActionsFromStep: function(stepEl) {
            var results = {};
            var actions = [];
            $(stepEl).xpath('.//actions/action').each(_.bind(function(actionIndex, actionEl){
                var action = this.parseDefaultAction(actionEl);
                actions.push(action);
            }, this));
            var commonActions = [];
            $(stepEl).xpath('.//actions/common-action').each(_.bind(function(actionIndex, actionEl){
                var action = {
                    'id': null
                };
                var id = $(actionEl).attr('id');
                if (!id) {
                    throw new Error('attribute id not exists');

                }
                action['id'] = id;
                commonActions.push(action);
            }, this));

            if (actions.length > 0) {
                results['actions'] = actions;
            }
            if (commonActions.length > 0) {
                results['common-actions'] = commonActions;
            }

            return results;
        },
        /**
         * Парсинг блока с безусловным переходом
         *
         * @param actionEl
         * @returns {*}
         */
        parseUnconditionalResults: function(actionEl)
        {
            var unconditionalResult = null;
            var unconditionalResultElCollections = $(actionEl).xpath('.//unconditional-result');
            if (1 === unconditionalResultElCollections.length) {
                var unconditionalResultEl = $(unconditionalResultElCollections[0]);
                var oldStatus = unconditionalResultEl.attr('old-status');
                if (!oldStatus) {
                    throw new Error('old-status  not exists');

                }
                unconditionalResult = {
                    'old-status': oldStatus,
                    'status': unconditionalResultEl.attr('status'),
                    'step': unconditionalResultEl.attr('step'),
                    'owner': unconditionalResultEl.attr('owner'),
                    'split': unconditionalResultEl.attr('split'),
                    'join': unconditionalResultEl.attr('join'),
                    'due-date': unconditionalResultEl.attr('due-date'),
                    'id': unconditionalResultEl.attr('id'),
                    'display-name': unconditionalResultEl.attr('display-name')
                };
            }
            return unconditionalResult;
        },
        /**
         * Парсинг блока с условным переходом
         *
         * @param actionEl
         * @returns {Array}
         */
        parseResult: function(actionEl)
        {
            var results = [];
            $(actionEl).xpath('.//result').each(function(index, el){
                var resultEl = $(el);

                var oldStatus = resultEl.attr('old-status');
                if (!oldStatus) {
                    throw new Error('old-status  not exists');

                }
                var result = {
                    'old-status': oldStatus,
                    'status': resultEl.attr('status'),
                    'step': resultEl.attr('step'),
                    'owner': resultEl.attr('owner'),
                    'split': resultEl.attr('split'),
                    'join': resultEl.attr('join'),
                    'due-date': resultEl.attr('due-date'),
                    'id': resultEl.attr('id'),
                    'display-name': resultEl.attr('display-name')
                };
                results.push(result);
            });


            if (0 === results.length) {
                results = false;
            }
            return results;
        }
    });

    return Parser;
});