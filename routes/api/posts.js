const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Get Post Model
const Post = require("../../models/Post");
//Get Profile Model
const Profile = require("../../models/Profile");

//Load Validation
const validatePostInput = require("../../validation/post");

//@route GET api/posts/test
//@desc Test posts route
//@access Public

router.get("/test", (req, res) => res.json({ msg: "Post Works" }));

//@route POST api/posts/
//@desc Add Post route
//@access Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    });

    newPost.save().then((post) => res.json(post));
  }
);

//@route GET api/posts/
//@desc Get All Post
//@access Public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) =>
      res.status(404).json({ nopostfound: "NO Post Found with that ID" })
    );
});

//@route GET api/posts/:post_id
//@desc Get Single Post
//@access Public

router.get("/:post_id", (req, res) => {
  Post.findById(req.params.post_id)
    .then((posts) => res.json(posts))
    .catch((err) =>
      res.status(404).json({ nopostfound: "NO Post Found with that ID" })
    );
});

//@route DELETE api/posts/:post_id
//@desc delete Single Post
//@access Private
router.delete(
  "/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.post_id)
        .then((post) => {
          //Check if post is written by specific user
          console.log(post);

          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notAuthorized: "User not Authorized" });
          }

          //Delete
          post
            .remove()
            .then(() => res.json({ success: "true" }))
            .catch((err) =>
              res.status(404).json({ postnotfound: "Post Not Fund" })
            );
        })
        .catch((err) =>
          res.status(404).json({ error: "Something Went Wrong!" })
        );
    });
  }
);

//@route POST api/posts/like/:post_id
//@desc Like Post
//@access Private
router.post(
  "/like/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.post_id)
        .then((post) => {
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyLiked: "User already liked this post" });
          }

          //add user to like array
          post.likes.unshift({ user: req.user.id });
          post.save().then((post) => res.json(post));
        })
        .catch((err) =>
          res.status(404).json({ error: "Something Went Wrong!" })
        );
    });
  }
);

//@route POST api/posts/unlike/:post_id
//@desc UnLike Post
//@access Private
router.post(
  "/unlike/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.post_id)
        .then((post) => {
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notLiked: "You have not yet liked post" });
          }

          //get remove index
          const removeIndex = post.likes
            .map((item) => item.user.toString())
            .indexOf(req.user.id);

          //splice out of array
          post.likes.splice(removeIndex, 1);

          //save
          post.save().then((post) => res.json(post));
        })
        .catch((err) =>
          res.status(404).json({ error: "Something Went Wrong!" })
        );
    });
  }
);

//@route POST api/posts/comment/:post_id
//@desc Add Comment
//@access Private

router.post(
  "/comment/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.post_id)
      .then((post) => {
        console.log(post);
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id,
        };
        //Add Comment to array
        post.comments.unshift(newComment);

        //save
        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: "No post found" }));
  }
);

//@route DELETE api/posts/comment/:post_id/:comment_id
//@desc Remove Comment from post
//@access Private

router.delete(
  "/comment/:post_id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.post_id)
      .then((post) => {
        //check if comment exists
        if (
          post.comments.filter(
            (comment) => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment Doesnot exists" });
        }

        //Get Remove Index
        const removeIndex = post.comments
          .map((item) => item._id.toString())
          .indexOf(req.params.comment_id);

        post.comments.splice(removeIndex, 1);
        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;
