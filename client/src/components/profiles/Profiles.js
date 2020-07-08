import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getProfiles } from "../../actions/profileActions";
import Spinner from "../common/Spinner";

class Profiles extends Component {
  componentDidMount() {
    this.props.getProfiles();
  }
  render() {
    console.log(this.props.profiles);
    const { profiles, loading } = this.props.profiles;
    let profileItems;
    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      if (profiles.length > 0) {
        profileItems = profiles.map((profile) => (
          <div className="card card-body bg-light mb-3">
            <div className="row">
              <div className="col-2">
                <img
                  className="rounded-circle"
                  src={profile.user.avatar}
                  alt=""
                />
              </div>
              <div className="col-lg-6 col-md-4 col-8">
                <h3>{profile.user.name}</h3>
                <p>{profile.status} at {profile.company}</p>
                <p>Seattle, WA</p>
                <a href="profile.html" className="btn btn-info">
                  View Profile
                </a>
              </div>
              <div className="col-md-4 d-none d-lg-block">
                <h4>Skill Set</h4>
                <ul className="list-group">
                  {profile.skills.map((skill) => (
                    <li className="list-group-item">
                      <i className="fa fa-check pr-1"></i>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ));
      } else {
        profileItems = <h4>No Profile found</h4>;
      }
    }
    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">Developer Profiles</h1>
              <p className="lead text-center">
                Browse and connect with developers
              </p>
              {profileItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profiles: state.profile,
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
