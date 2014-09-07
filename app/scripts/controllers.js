(function() {
	'use strict';
	angular.module('blog.controllers', ['blog.services']);


	function PostListCtrl(Post) {
		this.posts = Post.query();
		console.log(Post.query());
		console.log('ejecutado');
	}

	function PostDetailCtrl ($routeParams, Post, Comment, User) {
		this.post = {};
		this.comments = {};
		this.user = {};

		var self = this;

		Post.query({ id: $routeParams.postId })
			.$promise.then(
				//success
				function(data) {
					self.post = data[0];
					self.user = User.query({ id: self.user.userId });
				},
				function(error) {
					console.log(error);
				}
			);
		this.comments = Comment.query({ postId: $routeParams.postId });
	
		console.log(this);
	}

	function PostCreateCtrl(Post) {
		var self = this;

		this.create = function() {
			Post.save(self.post);
			console.log('Grabar', self.post);
		};
	}



	angular.module('blog.controllers')
	.controller('PostListCtrl', PostListCtrl)
	.controller('PostCreateCtrl', PostCreateCtrl)
	.controller('PostDetailCtrl', PostDetailCtrl);
})();

