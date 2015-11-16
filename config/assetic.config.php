<?php
/**
 * @link https://github.com/old-town/workflow-designer-client
 * @author  Malofeykin Andrey  <and-rey2@yandex.ru>
 */
namespace OldTown\Workflow\Designer\Client;



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
                            'workflow/designer/js/libs/bootstrap/*',
                            'workflow/designer/js/libs/lodash/*',
                            'workflow/designer/js/libs/joint/*',

                            'workflow/designer/js/libs/dagre/*',












                            'workflow/designer/css/libs/joint/*',
                            'workflow/designer/css/libs/bootstrap/*',
                            'workflow/designer/css/libs/fonts/*',
                            'workflow/designer/css/app/*',

                            'workflow/designer/js/*',
                            'workflow/designer/js/views/*',
                            'workflow/designer/js/models/*',
                            'workflow/designer/js/models/descriptor/*',
                            'workflow/designer/js/service/*',


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