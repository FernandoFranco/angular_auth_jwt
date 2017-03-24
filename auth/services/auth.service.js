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