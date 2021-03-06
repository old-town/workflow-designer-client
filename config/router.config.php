<?php
/**
 * @link https://github.com/old-town/workflow-designer-client
 * @author  Malofeykin Andrey  <and-rey2@yandex.ru>
 */
namespace OldTown\Workflow\Designer\Client;

use OldTown\Workflow\Designer\Client\Controller\WorkflowDesignerController;

return [
    'router' => [
        'routes' => [
            'workflow' => [
                'child_routes' => [
                    'designer' => [
                        'child_routes' => [
                            'view' => [
                                'type' => 'Literal',
                                'options' => [
                                    'route' => 'app',
                                    'defaults' => [
                                        'controller' => WorkflowDesignerController::class,
                                        'action' => 'app'
                                    ],
                                    'may_terminate' => true
                                ],
                            ]
                        ]
                    ]
                ]
            ],

            'assets-workflow-designer' => [
                'type' => 'Literal',
                'options' => [
                    'route' => '/assets/workflow/designer/',
                ],
            ]
        ]
    ]
];