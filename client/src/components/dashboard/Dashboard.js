import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import { Link } from "react-router-dom";
import { getCurrentProfile, deleteAccount } from "../../actions/profileActions";
import ProfileActions from "./ProfileActions";

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  onDeleteClick(e) {
    e.preventDefault();
    this.props.deleteAccount();
  }
  render() {
    const { profile, loading } = this.props.profile;
    const { user } = this.props.auth;
    let contentToDashboard;

    if (profile === null || loading) {
      contentToDashboard = <Spinner />;
    } else {
      //check if login user has profile data
      if (Object.keys(profile).length > 0) {
        //user has profile
        contentToDashboard = (
          <div>
            <p className="lead text-muted">
              {" "}
              Welcome <Link to={`/profile/${profile.handle}`}>{user.name}</Link>
            </p>

            <ProfileActions />
            <div style={{ marginBottom: "60px" }}>
              <button
                className="btn btn-danger"
                onClick={this.onDeleteClick.bind(this)}
              >
                Delete My Account
              </button>
            </div>
          </div>
        );
      } else {
        //user is logged in but no profile
        contentToDashboard = (
          <div>
            <p className="lead text-muted"> Welcome {user.name}</p>
            <p> Please setup profile</p>
            <Link to="create-profile" className="btn btn-lg btn-info">
              {" "}
              Create Profile
            </Link>
          </div>
        );
      }
    }
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {contentToDashboard}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propType = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
