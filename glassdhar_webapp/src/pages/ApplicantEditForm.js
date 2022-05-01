import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { updateApplicant } from '../api/api.js';
import Input from '../components/Input.js';

const ApplicantEditForm = (props) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: props.applicant.name,
      email: props.applicant.email,
      gpa: props.applicant.gpa,
      graduationDate: props.applicant.graduation_date,
      resumeLink: props.applicant.resume_link,
      githubLink: props.applicant.github_link,
      portfolioLink: props.applicant.portfolio_link
    }
  });

  const onSubmit = (data) => {
    applicantUpdate(data);
    // console.log(data);
  };

  const applicantUpdate = async (data) => {
    await updateApplicant(data);
    props.fetchApplicants();
  };
  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    /* Input.js component handles any formating for you... if you want to change style ... change it in Input.js */
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          name='name'
          type='text'
          label='Full Name'
          placeholder='Enter applicant name'
          required
          errors={errors}
          register={register}
        />

        <Input
          name='email'
          type='text'
          label='Email'
          placeholder='Enter company site'
          required
          errors={errors}
          register={register}
        />

        <Input
          name='gpa'
          type='number'
          label='gpa'
          placeholder='Enter industry'
          required
          errors={errors}
          register={register}
        />

        <Input
          name='graduationDate'
          type='date'
          label='Graduation Date'
          placeholder='Enter Graduation Date'
          required
          errors={errors}
          register={register}
        />
        <Input
          name='resumeLink'
          type='text'
          label='Resume Link'
          placeholder='Enter Resume Link'
          errors={errors}
          register={register}
        />
        <Input
          name='githubLink'
          type='text'
          label='Github Link'
          placeholder='Enter Github Link'
          errors={errors}
          register={register}
        />

        <Input
          name='portfolioLink'
          type='text'
          label='portfolioLink'
          placeholder='Enter Github Link'
          errors={errors}
          register={register}
        />
        <input type='submit' />
      </form>
      <hr />
    </>
  );
};

export default ApplicantEditForm;