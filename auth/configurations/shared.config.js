/**
 * Fernando Franco
 * Config Module
 */
(function (angular) {
    'use strict';
    angular.module('auth.jwt').config(sharedConfig);

    sharedConfig.$inject = ['$injector', '$httpProvider', 'jwtOptionsProvider', 'authJwtProvider'];

    function sharedConfig($injector, $httpProvider, jwtOptionsProvider, authJwtProvider) {
        var config = {
            tokenGetter: authJwtProvider.tokenGetter,
            unauthenticatedRedirector: authJwtProvider.unauthenticatedRedirector
        };

        var whiteList = $injector.get('auth.jwt.whiteList');
        if (whiteList) config.whiteListedDomains = whiteList;

        jwtOptionsProvider.config(config);

        $httpProvider.interceptors.push('jwtInterceptor');
    }
})(angular);