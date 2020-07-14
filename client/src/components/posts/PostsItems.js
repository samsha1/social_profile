import React, { Component } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deletePost, addLike, removeLike } from "../../actions/postActions";

class PostsItems extends Component {
  onDeletePost(id) {
    this.props.deletePost(id);
  }

  onLikeClick(id) {
    this.props.addLike(id);
  }

  onRemoveLikeClick(id) {
    this.props.removeLike(id);
  }

  render() {
    const { auth, post, showActions } = this.props;
    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <Link to={`/profile/${post.name}`}>
              <img
                className="rounded-circle d-none d-md-block"
                src={post.avatar}
                alt=""
              />
            </Link>
            <br />
            <p className="text-center">{post.name}</p>
          </div>
          <div className="col-md-10">
            <p className="lead">{post.text}</p>
            {showActions ? (
              <div>
                <button
                  type="button"
                  className="btn btn-light mr-1"
                  onClick={this.onLikeClick.bind(this, post._id)}
                >
                  <i
                    className={classnames("fas fa-thumbs-up", {
                      "text-info": post.likes.find(
                        (like) => like.user === auth.user.id
                      ),
                    })}
                  ></i>
                  <span className="badge badge-light">{post.likes.length}</span>
                </button>
                <button
                  type="button"
                  className="btn btn-light mr-1"
                  onClick={this.onRemoveLikeClick.bind(this, post._id)}
                >
                  <i className="text-secondary fas fa-thumbs-down"></i>
                </button>
                <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
                  Comments
                </Link>
                {auth.user.id === post.user ? (
                  <button
                    type="button"
                    className="btn btn-danger mr-1"
                    onClick={this.onDeletePost.bind(this, post._id)}
                  >
                    <i className="fas fa-times" />
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

PostsItems.propTypes = {
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deletePost, addLike, removeLike })(
  PostsItems
);
