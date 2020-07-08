import React, { Component } from "react";
import Moment from "react-moment";

class ProfileCreds extends Component {
  render() {
    const profile = this.props.profile;
    let getExperience;
    let getEducation;
    if (profile.experience.length > 0) {
      getExperience = profile.experience.map((exp) => (
        <li className="list-group-item" key={exp._id}>
          <h4>{exp.company}</h4>
          <p>
            <Moment format="MMM DD">{exp.from}</Moment> -{" "}
            {exp.to == null ? (
              "Current"
            ) : (
              <Moment format="MMM DD">{exp.to}</Moment>
            )}{" "}
          </p>
          <p>
            <strong>Position:</strong> {exp.title}
          </p>
          <p>
            <strong>Description:</strong> {exp.description}
          </p>
        </li>
      ));
    }
    if (profile.education.length > 0) {
      getEducation = (
        profile.education.map(edu => (
          <li className="list-group-item" key={edu._id}>
          <h4>{edu.school}</h4>
          <p><Moment format="MMM DD">{edu.from}</Moment> -{" "}
            {edu.to == null ? (
              "Current"
            ) : (
              <Moment format="MMM DD">{edu.to}</Moment>
            )}{" "}</p>
          <p>
            <strong>Degree: </strong>{edu.degree}
          </p>
          <p>
            <strong>Field Of Study: </strong>{edu.fieldofstudy}
          </p>

          <p>
            <strong>Description:</strong> {edu.description}
          </p>
        </li>
        ))
        
      );
    }
    return (
      <div className="row">
        <div className="col-md-6">
          <h3 className="text-center text-info">Experience</h3>
          <ul className="list-group">{getExperience}</ul>
        </div>
        <div className="col-md-6">
          <h3 className="text-center text-info">Education</h3>
          <ul className="list-group">{getEducation}</ul>
        </div>
      </div>
    );
  }
}

export default ProfileCreds;
