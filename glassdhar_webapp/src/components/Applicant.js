import React, { useState } from 'react';
import ApplicantEditForm from '../pages/ApplicantEditForm';

const Applicant = (props) => {
  const [showEdit, setShowEdit] = useState(false);
  const toggleShowEdit = () => {
    setShowEdit((prevEdit) => !prevEdit);
  };

  return (
    <div style={{
      border: 'solid 1px black',
      borderRadius: '8px',
      padding: '10px',
      margin: '15px'
    }}
    >
      <div style={{ display: 'flex' }}>
        <h3 style={{ marginBottom: '7px', margin: 'auto', textTransform: 'capitalize' }}>
          {props.applicant.name}
        </h3>
      </div>

      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <p>id: {props.applicant.id}</p>
          <p>name: {props.applicant.name}</p>
          <p>email: {props.applicant.email}</p>
          <p>gpa: {props.applicant.gpa}</p>
          <p>graduation_date: {props.applicant.graduation_date}</p>
        </div>
        <div style={{ flex: 1 }}>
          <p>resume_link: {props.applicant.resume_link}</p>
          <p>github_link: {props.applicant.github_link}</p>
          <p>portfolio_link: {props.applicant.portfolio_link}</p>
          <p>Skills: {props.applicant.skills.map(skill => (skill.name + ', '))}</p>
        </div>
      </div>
      <button type='button' onClick={toggleShowEdit}>Toggle edit form</button>
      {!props.noEdit && showEdit
        ? <ApplicantEditForm applicant={props.applicant} fetchApplicants={props.fetchApplicants} />
        : null}

    </div>
  );
};

export default Applicant;
