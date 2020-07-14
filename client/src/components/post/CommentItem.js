import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {deleteComment} from "../../actions/postActions";

class CommentItem extends Component {
  onDeleteComment(postId, commentId) {
    this.props.deleteComment(postId, commentId);
  }
  render() {
    const { postId, comment, auth } = this.props;
    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <Link to={`profile/${comment.name}`}>
              <img
                className="rounded-circle d-none d-md-block"
                src={comment.avatar}
                alt=""
              />
            </Link>
            <br />
            <p className="text-center">{comment.name}</p>
          </div>
          <div className="col-md-10">
            <p className="lead">{comment.text}</p>
            {auth.user.id === comment.user ? (
              <button
                type="button"
                className="btn btn-danger mr-1"
                onClick={this.onDeleteComment.bind(this, postId, comment._id)}
              >
                <i className="fas fa-times" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
