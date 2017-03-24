/**
 * Fernando Franco
 * Config Module
 */
(function (angular) {
    'use strict';
    angular.module('auth.jwt').config(sharedConfig);

    sharedConfig.$inject = ['$httpProvider', 'jwtOptionsProvider', 'authJwtProvider'];

    function sharedConfig($httpProvider, jwtOptionsProvider, authJwtProvider) {
        jwtOptionsProvider.config({
            tokenGetter: authJwtProvider.tokenGetter,
            unauthenticatedRedirector: authJwtProvider.unauthenticatedRedirector
        });

        $httpProvider.interceptors.push('jwtInterceptor');
    }
})(angular);