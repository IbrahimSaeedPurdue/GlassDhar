import React from 'react';

const JobPosting = (props) => {
  return (
    <div>
      <p>id: {props.jobPosting.id}</p>
      <p>job_company_id: {props.jobPosting.job_company_id}</p>
      <p>position_name: {props.jobPosting.position_name}</p>
      <p>location: {props.jobPosting.location}</p>
      <p>salary: {props.jobPosting.salary}</p>
      <p>job_level: {props.jobPosting.job_level}</p>
      <p>job_description: {props.jobPosting.job_description}</p>
      <p>date_created: {props.jobPosting.date_created}</p>
    </div>
  );
};

export default JobPosting;
