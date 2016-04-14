
/*globals angular */

var watchForms = {
        '1': 'Watcher',
        'other': 'Watchers'
    },
    forkForms = {
        '1': 'Fork',
        'other': 'Forks'
    };

function SearchCtrl($scope, $location) {
    'use strict';

    $scope.user = 'angular';

    $scope.userSearch = function () {
        $location.path(['', 'github', $scope.user, ''].join('/'));
    };
}
SearchCtrl.$inject = ['$scope', '$location'];

function RepoListCtrl($scope, $routeParams, githubResource) {
    'use strict';

    $scope.repos = githubResource.get({user: $routeParams.user});
    $scope.user = $routeParams.user;
    $scope.watchForms = watchForms;
    $scope.forkForms = forkForms;
}
RepoListCtrl.$inject = ['$scope', '$routeParams', 'githubResource'];

function UserCtrl($scope, $routeParams, githubResource) {
    'use strict';

    $scope.user_info = githubResource.get({user: $routeParams.user, repo: ''});

    $scope.publicRepoForms = {
        '1': 'Public repo',
        'other': 'Public repos'
    };
    $scope.followerForms = {
        '1': 'Follower',
        'other': 'Followers'
    };
}
UserCtrl.$inject = ['$scope', '$routeParams', 'githubResource'];

function RepoCtrl($scope, $routeParams, githubResource) {
    'use strict';

    $scope.repoInfo = githubResource.get({
        'query': 'repos',
        'user': $routeParams.user,
        'repo': $routeParams.repo
    });

    $scope.watchForms = watchForms;
    $scope.forkForms = forkForms;
}
RepoCtrl.$inject = ['$scope', '$routeParams', 'githubResource'];

function ContribListCtrl($scope, $routeParams, $http, $timeout, githubResource) {
    $scope.realContribs = [];
    $scope.error = false;

    $scope.contributors = githubResource.get({
        'query': 'repos',
        'user': $routeParams.user,
        'repo': $routeParams.repo,
        'spec': 'contributors'
    }, function(response){
        var contributors = response.data;
        
        if(typeof contributors === 'object'){
            $scope.error = contributors.message;
            $timeout(function(){
                $scope.error = $scope.error;
                console.log($scope.error)
            });
            return;
        }
        contributors.forEach(function(c, i){
            // request users profile (has their email address)
            $http.jsonp('https://api.github.com/users/'+ c.login + '?callback=JSON_CALLBACK').then(function(res){
                var user = res.data.data;
                $scope.realContribs.push(user);
                $timeout(function(){
                    console.log($scope.realContribs);
                    $scope.realContribs = $scope.realContribs;
                });
            });
            
        });
    });

    

}
ContribListCtrl.$inject = ['$scope', '$routeParams', '$http', '$timeout', 'githubResource'];
