import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { insertApplicant, getApplicants } from '../api/api.js';
import Input from '../components/Input.js';
import UniversityDropdown from '../components/UniversityDropdown.js';
import CompanyDropdown from '../components/CompanyDropdown.js';
import Applicant from '../components/Applicant.js';
import SkillsDropdown from '../components/SkillsDropdown';

const ApplicantForm = (props) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      gpa: 0.0,
      graduationDate: 0,
      resumeLink: '',
      githubLink: '',
      portfolioLink: '',
      companyId: 0,
      universityId: 0,
      skills: []
    }
  });

  const onSubmit = (data) => {
    applicantInsert(data);
  };

  const [applicants, setApplicants] = useState([]);

  const fetchApplicants = async () => {
    const companies = (await getApplicants({})).data.applicants;
    // console.log(companies);
    setApplicants(companies);
  };

  const applicantInsert = async (company) => {
    await insertApplicant(company);
    fetchApplicants();
  };

  // const companyDelete = async (companyId) => {
  //   await deleteCompany(companyId);
  //   fetchCompanies();
  // };

  useEffect(() => {
    console.log('getting applicants...');
    fetchApplicants();
  }, []);
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
          step='0.1'
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

        <CompanyDropdown
          name='companyId'
          register={register}
        />

        <UniversityDropdown
          name='universityId'
          register={register}
        />

        <SkillsDropdown
          name='skills'
          register={register}
        />
        <input type='submit' />
      </form>
      <hr />
      <div>
        {applicants.length > 0
          ? applicants.map((applicant, index) => (
            <Applicant key={index} applicant={applicant} fetchApplicants={fetchApplicants} />
            ))
          : 'no applicants'}
      </div>
    </>
  );
};

export default ApplicantForm;