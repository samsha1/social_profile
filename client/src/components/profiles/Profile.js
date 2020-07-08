import React, { Component } from "react";
import { Link } from "react-router-dom";
import ProfileHeader from "./ProfileHeader";
import ProfileAbout from "./ProfileAbout";
import ProfileCreds from "./ProfileCreds";
import ProfileGithub from "./ProfileGithub";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { getProfileByHandle } from "../../actions/profileActions";

class Profile extends Component {
  componentDidMount() {
    if (this.props.match.params.handle) {
      this.props.getProfileByHandle(this.props.match.params.handle);
    }
  }

  componentWillReceiveProps(nextProps){
      if(nextProps.profile.profile === null && this.props.profile.loading){
          this.props.history.push('/not-found');
      }

  }
  render() {
    const { profile, loading } = this.props.profile;
    let contentToDisplay;

    if (profile == null || loading) {
      contentToDisplay = <Spinner />;
    } else {
      contentToDisplay = (
        <div>
          <div className="row">
            <div className="col-6">
              <Link to="/profiles" className="btn btn-light mb-3 float-left">
                Back To Profiles
              </Link>
            </div>
          </div>
          <div className="col-6"></div>
          <ProfileHeader profile={profile}/>
          <ProfileAbout profile={profile}/>
          <ProfileCreds profile={profile}/>
          {profile.githubusername ? <ProfileGithub username={profile.githubusername}/> : ''}
        </div>
      );
    }
    return (
      <div className="profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12">{contentToDisplay}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfileByHandle })(Profile);
