import React, { Component } from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import PropTypes from "prop-types";
import {deleteEducation} from '../../actions/profileActions';

class Education extends Component {
    onDeleteEducation(id){
        this.props.deleteEducation(id);
    }
  render() {
    const education = this.props.education.map((edu) => (
      <tr key={edu._id}>
        <td>{edu.school}</td>
        <td>{edu.degree}</td>
        <td>{edu.fieldofstudy}</td>
        <td>
          <Moment format="YYYY/MM/DD">{edu.from}</Moment> -
          {edu.to == null ? (
            "Now"
          ) : (
            <Moment format="YYYY/MM/DD">{edu.to}</Moment>
          )}
        </td>
        <button className="btn btn-danger" onClick={this.onDeleteEducation.bind(this,edu._id)}> Delete </button>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-4">Education Credentials</h4>
        <table className="table">
          <thead>
            <tr>
              <th>School</th>
              <th>Degree</th>
              <th>Faculty</th>
              <th>Years</th>
              <th>Actions</th>
            </tr>
            {education}
          </thead>
        </table>
      </div>
    );
  }
}

Education.propType = {
    deleteEducation:PropTypes.func.isRequired
}

export default connect(null,{deleteEducation})(Education);
