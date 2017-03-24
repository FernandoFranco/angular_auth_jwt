/**
 * Fernando Franco
 * Provider Auth
 */
(function (angular) {
    'use strict';
    angular.module('auth.jwt').provider('authJwt', authProvider);

    authProvider.$inject = ['$localStorageProvider'];

    function authProvider($localStorageProvider) {
        var provider = {};

        return {
            tokenGetter: _tokenGetterProvider($localStorageProvider),
            unauthenticatedRedirector: _unauthenticatedRedirector,
            $get: function () {
                return provider;
            }
        };
    }

    function _tokenGetterProvider($localStorageProvider) {
        return function _tokenGetter(options) {
            if (options && options.url && options.url.substr(options.url.length - 5) === '.html') {
                return null;
            }
            return $localStorageProvider && $localStorageProvider.get('jwt');
        }
    }

    _unauthenticatedRedirector.$inject = ['$rootScope'];

    function _unauthenticatedRedirector($rootScope) {
        $rootScope.$broadcast('auth.jwt.unauthenticated');
    }
})(angular);