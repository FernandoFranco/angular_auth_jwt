/**
 * Fernando Franco
 * Config Module
 */
(function (angular) {
    'use strict';
    angular.module('auth.jwt').config(sharedConfig);

    sharedConfig.$inject = ['$inject', '$httpProvider', 'jwtOptionsProvider', 'authJwtProvider'];

    function sharedConfig($inject, $httpProvider, jwtOptionsProvider, authJwtProvider) {
        var config = {
            tokenGetter: authJwtProvider.tokenGetter,
            unauthenticatedRedirector: authJwtProvider.unauthenticatedRedirector
        };

        var whiteList = $inject.get('auth.jwt.whiteList');
        if (whiteList) config.whiteListedDomains = whiteList;

        jwtOptionsProvider.config(config);

        $httpProvider.interceptors.push('jwtInterceptor');
    }
})(angular);