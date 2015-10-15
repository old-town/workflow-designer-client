<?php
/**
 * @link https://github.com/old-town/workflow-designer-client
 * @author  Malofeykin Andrey  <and-rey2@yandex.ru>
 */
namespace OldTown\Workflow\Designer\Client;

use OldTown\Workflow\Designer\Client\Controller\WorkflowDesignerController;
use OldTown\Workflow\Designer\Client\Module;

return [
    'assetic_configuration' => [
        'modules' => [
            /*
             * Application moodule - assets configuration
             */
            Module::class => [
                # module root path for yout css and js files
                'root_path' => __DIR__ . '/../assets',
                # collection od assets
                'collections' => [
                    'workflow_designer_js' => [
                        'assets' => [
                            'workflow/designer/js/libs/require/*',
                            'workflow/designer/js/libs/backbone/*',
                            'workflow/designer/js/libs/jquery/*',
                            'workflow/designer/js/libs/jsPlumb/*',
                            'workflow/designer/js/libs/underscore/*',




                            'workflow/designer/js/*',
                            'workflow/designer/js/views/*',

                            'workflow/designer/js/templates/*',
                        ],
                        'options' => [
                            'move_raw' => true,
                        ]
                    ],
                ],
            ],
        ],
    ],
];