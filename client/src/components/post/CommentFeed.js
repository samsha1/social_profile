import React, { Component } from "react";
import CommentItem from "./CommentItem";

class CommentFeed extends Component {
  render() {
    const { comments, postId } = this.props;
    return (
        <div className="comments">
            {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} postId={postId} />
            ))}
        </div>
        
    );
  }
}

export default CommentFeed;
