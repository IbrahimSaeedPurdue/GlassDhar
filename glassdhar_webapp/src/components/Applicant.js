import React from 'react';
import ApplicantEditForm from '../pages/ApplicantEditForm';

const Applicant = (props) => {
  return (
    <div>
      <p>id: {props.applicant.id}</p>
      <p>name: {props.applicant.name}</p>
      <p>email: {props.applicant.email}</p>
      <p>gpa: {props.applicant.gpa}</p>
      <p>graduation_date: {props.applicant.graduation_date}</p>
      <p>resume_link: {props.applicant.resume_link}</p>
      <p>github_link: {props.applicant.github_link}</p>
      <p>portfolio_link: {props.applicant.portfolio_link}</p>
      <ApplicantEditForm applicant={props.applicant} fetchApplicants={props.fetchApplicants} />
    </div>
  );
};

export default Applicant;