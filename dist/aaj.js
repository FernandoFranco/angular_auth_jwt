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
/**
 * Fernando Franco
 * Service Auth
 */
(function (angular) {
    'use strict';
    angular.module('auth.jwt').service('authJwtService', authService);

    authService.$inject = ['$q', '$http', '$timeout', '$localStorage', 'jwtHelper'];

    function authService($q, $http, $timeout, $localStorage, jwtHelper) {
        var service = this;

        service.data = _getData();

        service.singIn = _singIn;
        service.singOut = _singOut;
        service.getRole = _getRole;

        return service;

        ////////////////////////////////////////////////////////////////////////////////////////////////////

        function _getData() {
            try {
                return jwtHelper.decodeToken($localStorage.jwt);
            } catch (error) {
                return null;
            }
        }

        function _getRole(attribute) {
            if (!service.data) {
                return null;
            }

            if (!service.data.role) {
                return null;
            }

            if (attribute) {
                return service.data.role[attribute];
            }

            return service.data.role;
        }

        function _singIn(email, secret, authRoute) {
            var deferred = $q.defer();

            $http.post(authRoute, {
                email: email,
                secret: secret
            }).then(function (response) {
                if (response && response.data && response.data.token) {
                    $localStorage.jwt = response.data.token;
                    service.data = _getData();

                    return $timeout(function () {
                        deferred.resolve();
                    }, 300);
                }

                deferred.reject(new Error('Token not Found'));
            }).catch(function (error) {
                deferred.reject(error.data || error);
            });

            return deferred.promise;
        }

        function _singOut() {
            delete $localStorage.jwt;
        }
    }
})(angular);
//# sourceMappingURL=aaj.js.map
