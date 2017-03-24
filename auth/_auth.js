/**
 * Fernando Franco
 * Angular Module
 */
(function (angular) {
    'use strict';
    angular.module('auth.jwt', ['ngStorage', 'angular-jwt']);

    angular.module('auth.jwt').run(authJwt);

    authJwt.$inject = ['$rootScope', 'authManager', 'authJwtService'];

    function authJwt($rootScope, authManager, authService) {

        _init();

        $rootScope.$on('tokenHasExpired', _tokenHasExpired);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        function _init() {
            authManager.checkAuthOnRefresh();
            authManager.redirectWhenUnauthenticated();
        }

        function _tokenHasExpired() {
            authService.singOut();
            $rootScope.$broadcast('auth.jwt.expired');
        }
    }
})(angular);