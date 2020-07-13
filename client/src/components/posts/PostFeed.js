import React, { Component } from "react";
import PostsItems from "./PostsItems";

class PostFeed extends Component {
  render() {
    const { posts } = this.props;

    let postsFeeds = posts.map((post) => (
      <PostsItems key={post._id} post={post} showActions={true} />
    ));
    return <div className="posts">{postsFeeds}</div>;
  }
}

export default PostFeed;
