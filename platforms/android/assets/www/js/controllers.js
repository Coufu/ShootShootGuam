angular.module('your_app_name.controllers', [])

.controller('AuthCtrl', function($scope, $ionicConfig) {

})

// APP
.controller('AppCtrl', function($scope, $ionicConfig, SSDaysService) {
	$scope.menuDay3 = SSDaysService.getDayOfWeekStr(2);
	$scope.menuDay4 = SSDaysService.getDayOfWeekStr(3);
	$scope.menuDay5 = SSDaysService.getDayOfWeekStr(4);
	$scope.menuDay6 = SSDaysService.getDayOfWeekStr(5);
	$scope.menuDay7 = SSDaysService.getDayOfWeekStr(6);
})

// EVENTS
.controller('EventsCtrl', function($scope, $http, BASE_URL, SSDaysService) {
	$scope.eventsLoaded = false;
	$scope.eventsDay1 = [];
	$scope.eventsDay2 = [];
	$scope.eventsDay3 = [];
	$scope.eventsDay4 = [];
	$scope.eventsDay5 = [];
	$scope.eventsDay6 = [];
	$scope.eventsDay7 = [];

	$scope.daysOfTheWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

	// Finding out what days of the week are the following days
	$scope.titleDay3 = $scope.daysOfTheWeek[(SSDaysService.getDayOfWeekInt() + 2)%7];
	$scope.titleDay4 = $scope.daysOfTheWeek[(SSDaysService.getDayOfWeekInt() + 3)%7];
	$scope.titleDay5 = $scope.daysOfTheWeek[(SSDaysService.getDayOfWeekInt() + 4)%7];
	$scope.titleDay6 = $scope.daysOfTheWeek[(SSDaysService.getDayOfWeekInt() + 5)%7];
	$scope.titleDay7 = $scope.daysOfTheWeek[(SSDaysService.getDayOfWeekInt() + 6)%7];

	$scope.eventsLoad = function(callback) {

		// Load the first event first
		$http.get(BASE_URL + 'api/events.json').success(function(response){
			$scope.eventsDay1 = response.nodes;

			// Get other events
			$http.get(BASE_URL + 'api/events.json?daystoadd=1').success(function(response){
				$scope.eventsDay2 = response.nodes;
			});
			$http.get(BASE_URL + 'api/events.json?daystoadd=2').success(function(response){
				$scope.eventsDay3 = response.nodes;
			});
			$http.get(BASE_URL + 'api/events.json?daystoadd=3').success(function(response){
				$scope.eventsDay4 = response.nodes;
			});
			$http.get(BASE_URL + 'api/events.json?daystoadd=4').success(function(response){
				$scope.eventsDay5 = response.nodes;
			});
			$http.get(BASE_URL + 'api/events.json?daystoadd=5').success(function(response){
				$scope.eventsDay6 = response.nodes;
			});
			$http.get(BASE_URL + 'api/events.json?daystoadd=6').success(function(response){
				$scope.eventsDay7 = response.nodes;
			});

			$scope.eventsLoaded = true;
		})
		.finally(callback);
	};

	if(!$scope.eventsLoaded) {
		$scope.eventsLoad();
	}

	$scope.doRefresh = function () {
		$scope.eventsLoad(function() {
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

})

.controller('EventEntryCtrl', function($scope, $http, $stateParams, BASE_URL) {
	$scope.eventId = $stateParams.eventId;
	$scope.event = [];
	$scope.multipleArtists = false;
	$scope.loaded = false;

	// Used for events witih multiple artists
	$scope.artists = []; 
	$scope.artistsData = [];

	console.log($scope.eventId);

	$http.get(BASE_URL + 'api/event.json/' + $scope.eventId)
		.success(function(response){
			$scope.event = response.nodes[0];
			console.log($scope.event);

			// Check if there's multiple artists (Drupal is set to separate them with ,,,,,)
			if($scope.event.node.artists.includes(',,,,,')) {
				$scope.multipleArtists = true;

				$scope.artists = $scope.event.node.artists.split(',,,,,');
				console.log($scope.artists);

				var artistContextString = '';
				for($i=0;$i<$scope.artists.length;$i++){
					// add a comma after the first one
					if($i>0){
						artistContextString += ',';
					}
					artistContextString += $scope.artists[$i];
				}

				$http.get(BASE_URL + 'api/artist-by-name.json/' + artistContextString)
					.success(function(response) {
						$scope.artistsData = response.nodes;
            console.log($scope.artistsData);
					});
			}

			$scope.loaded = true;
		});


})

.controller('ProfileCtrl', function($scope) {
	$scope.image = 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg';
})

//LOGIN
.controller('LoginCtrl', function($scope, $state, $templateCache, $q, $rootScope) {
	$scope.doLogIn = function(){
		$state.go('app.feeds-categories');
	};

	$scope.user = {};

	$scope.user.email = "john@doe.com";
	$scope.user.pin = "12345";

	// We need this for the form validation
	$scope.selected_tab = "";

	$scope.$on('my-tabs-changed', function (event, data) {
		$scope.selected_tab = data.title;
	});

})

.controller('SignupCtrl', function($scope, $state) {
	$scope.user = {};

	$scope.user.email = "john@doe.com";

	$scope.doSignUp = function(){
		$state.go('app.feeds-categories');
	};
})

.controller('ForgotPasswordCtrl', function($scope, $state) {
	$scope.recoverPassword = function(){
		$state.go('app.feeds-categories');
	};

	$scope.user = {};
})

.controller('RateApp', function($scope) {
	$scope.rateApp = function(){
		if(ionic.Platform.isIOS()){
			//you need to set your own ios app id
			AppRate.preferences.storeAppURL.ios = '1234555553>';
			AppRate.promptForRating(true);
		}else if(ionic.Platform.isAndroid()){
			//you need to set your own android app id
			AppRate.preferences.storeAppURL.android = 'market://details?id=ionFB';
			AppRate.promptForRating(true);
		}
	};
})


.controller('SendMailCtrl', function($scope, $cordovaEmailComposer, $ionicPlatform) {
  //we use email composer cordova plugin, see the documentation for mor options: http://ngcordova.com/docs/plugins/emailComposer/
  $scope.sendMail = function(){
    $ionicPlatform.ready(function() {
      $cordovaEmailComposer.isAvailable().then(function() {
        // is available
        console.log("Is available");
        $cordovaEmailComposer.open({
          to: 'hi@startapplabs.com',
          subject: 'Nice Theme!',
  				body:    'How are you? Nice greetings from IonFullApp'
        }).then(null, function () {
          // user cancelled email
        });
      }, function () {
        // not available
        console.log("Not available");
      });
    });
  };
})

.controller('MapsCtrl', function($scope, $ionicLoading) {

	$scope.info_position = {
		lat: 43.07493,
		lng: -89.381388
	};

	$scope.center_position = {
		lat: 43.07493,
		lng: -89.381388
	};

	$scope.my_location = "";

	$scope.$on('mapInitialized', function(event, map) {
		$scope.map = map;
	});

	$scope.centerOnMe= function(){

		$scope.positions = [];

		$ionicLoading.show({
			template: 'Loading...'
		});

		// with this function you can get the user’s current position
		// we use this plugin: https://github.com/apache/cordova-plugin-geolocation/
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			$scope.current_position = {lat: position.coords.latitude, lng: position.coords.longitude};
			$scope.my_location = position.coords.latitude + ", " + position.coords.longitude;
			$scope.map.setCenter(pos);
			$ionicLoading.hide();
		}, function(err) {
				 // error
				$ionicLoading.hide();
		});
	};
})

.controller('AdsCtrl', function($scope, $ionicActionSheet, AdMob, iAd) {

	$scope.manageAdMob = function() {

		// Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			//Here you can add some more buttons
			buttons: [
				{ text: 'Show Banner' },
				{ text: 'Show Interstitial' }
			],
			destructiveText: 'Remove Ads',
			titleText: 'Choose the ad to show',
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			destructiveButtonClicked: function() {
				console.log("removing ads");
				AdMob.removeAds();
				return true;
			},
			buttonClicked: function(index, button) {
				if(button.text == 'Show Banner')
				{
					console.log("show banner");
					AdMob.showBanner();
				}

				if(button.text == 'Show Interstitial')
				{
					console.log("show interstitial");
					AdMob.showInterstitial();
				}

				return true;
			}
		});
	};

	$scope.manageiAd = function() {

		// Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			//Here you can add some more buttons
			buttons: [
			{ text: 'Show iAd Banner' },
			{ text: 'Show iAd Interstitial' }
			],
			destructiveText: 'Remove Ads',
			titleText: 'Choose the ad to show - Interstitial only works in iPad',
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			destructiveButtonClicked: function() {
				console.log("removing ads");
				iAd.removeAds();
				return true;
			},
			buttonClicked: function(index, button) {
				if(button.text == 'Show iAd Banner')
				{
					console.log("show iAd banner");
					iAd.showBanner();
				}
				if(button.text == 'Show iAd Interstitial')
				{
					console.log("show iAd interstitial");
					iAd.showInterstitial();
				}
				return true;
			}
		});
	};
})

// FEED
//brings all feed categories
.controller('FeedsCategoriesCtrl', function($scope, $http) {
	$scope.feeds_categories = [];

	$http.get('feeds-categories.json').success(function(response) {
		$scope.feeds_categories = response;
	});
})

//bring specific category providers
.controller('CategoryFeedsCtrl', function($scope, $http, $stateParams) {
	$scope.category_sources = [];

	$scope.categoryId = $stateParams.categoryId;

	$http.get('feeds-categories.json').success(function(response) {
		var category = _.find(response, {id: $scope.categoryId});
		$scope.categoryTitle = category.title;
		$scope.category_sources = category.feed_sources;
	});
})

//this method brings posts for a source provider
.controller('FeedEntriesCtrl', function($scope, $stateParams, $http, FeedList, $q, $ionicLoading, BookMarkService) {
	$scope.feed = [];

	var categoryId = $stateParams.categoryId,
			sourceId = $stateParams.sourceId;

	$scope.doRefresh = function() {

		$http.get('feeds-categories.json').success(function(response) {

			$ionicLoading.show({
				template: 'Loading entries...'
			});

			var category = _.find(response, {id: categoryId }),
					source = _.find(category.feed_sources, {id: sourceId });

			$scope.sourceTitle = source.title;

			FeedList.get(source.url)
			.then(function (result) {
				$scope.feed = result.feed;
				$ionicLoading.hide();
				$scope.$broadcast('scroll.refreshComplete');
			}, function (reason) {
				$ionicLoading.hide();
				$scope.$broadcast('scroll.refreshComplete');
			});
		});
	};

	$scope.doRefresh();

	$scope.bookmarkPost = function(post){
		$ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
		BookMarkService.bookmarkFeedPost(post);
	};
})

// SETTINGS
.controller('SettingsCtrl', function($scope, $ionicActionSheet, $state) {
	$scope.airplaneMode = true;
	$scope.wifi = false;
	$scope.bluetooth = true;
	$scope.personalHotspot = true;

	$scope.checkOpt1 = true;
	$scope.checkOpt2 = true;
	$scope.checkOpt3 = false;

	$scope.radioChoice = 'B';

	// Triggered on a the logOut button click
	$scope.showLogOutMenu = function() {

		// Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			//Here you can add some more buttons
			// buttons: [
			// { text: '<b>Share</b> This' },
			// { text: 'Move' }
			// ],
			destructiveText: 'Logout',
			titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			buttonClicked: function(index) {
				//Called when one of the non-destructive buttons is clicked,
				//with the index of the button that was clicked and the button object.
				//Return true to close the action sheet, or false to keep it opened.
				return true;
			},
			destructiveButtonClicked: function(){
				//Called when the destructive button is clicked.
				//Return true to close the action sheet, or false to keep it opened.
				$state.go('auth.walkthrough');
			}
		});

	};
})

// TINDER CARDS
.controller('TinderCardsCtrl', function($scope, $http) {

	$scope.cards = [];


	$scope.addCard = function(img, name) {
		var newCard = {image: img, name: name};
		newCard.id = Math.random();
		$scope.cards.unshift(angular.extend({}, newCard));
	};

	$scope.addCards = function(count) {
		$http.get('http://api.randomuser.me/?results=' + count).then(function(value) {
			angular.forEach(value.data.results, function (v) {
				$scope.addCard(v.picture.large, v.name.first + " " + v.name.last);
			});
		});
	};

	$scope.addFirstCards = function() {
		$scope.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/left.png","Nope");
		$scope.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/right.png", "Yes");
	};

	$scope.addFirstCards();
	$scope.addCards(5);

	$scope.cardDestroyed = function(index) {
		$scope.cards.splice(index, 1);
		$scope.addCards(1);
	};

	$scope.transitionOut = function(card) {
		console.log('card transition out');
	};

	$scope.transitionRight = function(card) {
		console.log('card removed to the right');
		console.log(card);
	};

	$scope.transitionLeft = function(card) {
		console.log('card removed to the left');
		console.log(card);
	};
})


// BOOKMARKS
.controller('BookMarksCtrl', function($scope, $rootScope, BookMarkService, $state) {

	$scope.bookmarks = BookMarkService.getBookmarks();

	// When a new post is bookmarked, we should update bookmarks list
	$rootScope.$on("new-bookmark", function(event){
		$scope.bookmarks = BookMarkService.getBookmarks();
	});

	$scope.goToFeedPost = function(link){
		window.open(link, '_blank', 'location=yes');
	};
	$scope.goToWordpressPost = function(postId){
		$state.go('app.post', {postId: postId});
	};
})

// WORDPRESS
.controller('WordpressCtrl', function($scope, $http, $ionicLoading, PostService, BookMarkService) {
	$scope.posts = [];
	$scope.page = 1;
	$scope.totalPages = 1;

	$scope.doRefresh = function() {
		$ionicLoading.show({
			template: 'Loading posts...'
		});

		//Always bring me the latest posts => page=1
		PostService.getRecentPosts(1)
		.then(function(data){
			$scope.totalPages = data.pages;
			$scope.posts = PostService.shortenPosts(data.posts);

			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.loadMoreData = function(){
		$scope.page += 1;

		PostService.getRecentPosts($scope.page)
		.then(function(data){
			//We will update this value in every request because new posts can be created
			$scope.totalPages = data.pages;
			var new_posts = PostService.shortenPosts(data.posts);
			$scope.posts = $scope.posts.concat(new_posts);

			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};

	$scope.moreDataCanBeLoaded = function(){
		return $scope.totalPages > $scope.page;
	};

	$scope.bookmarkPost = function(post){
		$ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
		BookMarkService.bookmarkWordpressPost(post);
	};

	$scope.doRefresh();
})

// WORDPRESS POST
.controller('WordpressPostCtrl', function($scope, post_data, $ionicLoading) {

	$scope.post = post_data.post;
	$ionicLoading.hide();

	$scope.sharePost = function(link){
		window.plugins.socialsharing.share('Check this post here: ', null, null, link);
	};
})


.controller('ImagePickerCtrl', function($scope, $rootScope, $ionicPlatform, $cordovaImagePicker) {

	$scope.images = [];

	$scope.selImages = function() {

		//We use image picker plugin: http://ngcordova.com/docs/plugins/imagePicker/
    //implemented for iOS and Android 4.0 and above.

    $ionicPlatform.ready(function() {
      $cordovaImagePicker.getPictures()
       .then(function (results) {
          for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
            $scope.status_post.images.push(results[i]);
          }
        }, function(error) {
          // error getting photos
        });
    });
	};

	$scope.removeImage = function(image) {
		$scope.images = _.without($scope.images, image);
	};

	$scope.shareImage = function(image) {
		window.plugins.socialsharing.share(null, null, image);
	};

	$scope.shareAll = function() {
		window.plugins.socialsharing.share(null, null, $scope.images);
	};
})

;
