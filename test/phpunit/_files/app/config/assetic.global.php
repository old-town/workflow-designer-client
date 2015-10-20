<?php


return [
    'assetic_configuration' => [ //настройки модуля assetic (загрузка клиентских файлов)
        'debug' => true,
        'cacheEnabled' => false,
        'writeIfChanged' => false,
        'webPath' => include __DIR__ . '/../../../../../data/test/assets'
    ]
];
