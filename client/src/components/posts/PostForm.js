import React, { Component } from "react";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { addPost } from "../../actions/postActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class PostForm extends Component {
  constructor(state) {
    super(state);

    this.state = {
      text: "",
      errors: {},
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentWillReceiveProps(newProps){
      if(newProps.errors){
          this.setState({errors:newProps.errors});
      }
  }

  onSubmit(e) {
    e.preventDefault(e);
    const {user} = this.props.auth;

    const feedData = {
      text: this.state.text,
      name:user.name,
      avatar:user.avatar
    };

    this.props.addPost(feedData);
    this.setState({text:''});
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">Say Somthing...</div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Create a post"
                  onChange={this.onChange}
                  value={this.state.text}
                  name="text"
                  error={errors.text}
                />
              </div>
              <button type="submit" className="btn btn-dark">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { addPost })(PostForm);
