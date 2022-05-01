import Input from '../components/Input.js';
import { insertApplication, getJobPostingsApplicants } from '../api/api.js';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Applicant from './Applicant.js';

const JobPosting = (props) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      applicant_id: 0
    }
  });

  const onSubmit = (data) => {
    // companyInsert(data);
    applicationInsert(data.applicant_id, props.jobPosting.id);
    console.log(data);
  };

  const applicationInsert = async (applicant_id, job_posting_id) => {
    await insertApplication(applicant_id, job_posting_id);
    props.fetchJobPostings({});
  };

  const [showApplicants, setShowApplicants] = useState(false);
  const toggleShowApplicants = () => {
    setShowApplicants(prevShow => !prevShow);
  };

  return (
    <div style={{
      border: 'solid 1px black',
      borderRadius: '8px',
      padding: '10px',
      marginBottom: '15px'
    }}
    >
      <div style={{ display: 'flex' }}>
        <h3 style={{ marginBottom: '7px', margin: 'auto', textTransform: 'capitalize' }}>
          {props.jobPosting.company_name} - {props.jobPosting.position_name}
        </h3>
      </div>

      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <p>id: {props.jobPosting.id}</p>
          <p>job_company_id: {props.jobPosting.job_company_id}</p>
          <p>job_company_name: {props.jobPosting.company_name}</p>
          <p>position_name: {props.jobPosting.position_name}</p>
          <p>location: {props.jobPosting.location}</p>
          <p>salary: {props.jobPosting.salary}</p>
        </div>
        <div style={{ flex: 1 }}>
          <p>job_level: {props.jobPosting.job_level}</p>
          <p>job_description: {props.jobPosting.job_description}</p>
          <p>date_created: {props.jobPosting.date_created}</p>
          <p>Skills: {props.jobPosting.skills.map(skill => (skill.name + ', '))}</p>
        </div>
      </div>

      <p>Applicants for this job postings:</p>
      <div>
        <button type='button' onClick={toggleShowApplicants}>Toggle Applicants</button>
        {showApplicants
          ? props.jobPosting.applicants.map(applicant => {
              return (
                <Applicant key={applicant.id} applicant={applicant} />
              );
            })
          : null}
      </div>
      {/* {postingApplicants.length > 0
        ? postingApplicants.map(app => <Applicant key={app.id} applicant={app} noEdit />)
        : 'No one applied to this job posting'} */}
      <hr />
      <div />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          name='applicant_id'
          type='text'
          label='Applicant ID'
          placeholder='Enter applicant id'
          required
          errors={errors}
          register={register}
        />
        <input type='submit' />
      </form>

    </div>
  );
};

export default JobPosting;
