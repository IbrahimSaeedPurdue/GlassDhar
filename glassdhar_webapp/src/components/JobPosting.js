import Input from '../components/Input.js';
import { insertApplication } from '../api/api.js';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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
      <p>Skills: {props.jobPosting.skills.map(skill => (skill.name + ', '))}</p>
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
