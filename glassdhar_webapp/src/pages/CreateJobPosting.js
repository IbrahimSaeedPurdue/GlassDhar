import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Input from '../components/Input.js';
import Company from '../components/Company.js';

const JobPostingForm = (props) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      location: '',
      salary: '',
      level: 0,
      description: ''
    }
  });

  const onSubmit = (data) => {
    //companyInsert(data);
  };

  const [companies, setCompanies] = useState([]);

//   const fetchCompanies = async () => {
//     const companies = (await getCompanies()).data.companies;
//     // console.log(companies);
//     setCompanies(companies);
//   };

//   const jobPostingInsert = async (company) => {
//     await insertJobPosting(company);
//     fetchCompanies();
//   };

//   const postingDelete = async (companyId) => {
//     await deletePosting(companyId);
//     fetchCompanies();
//   };

  useEffect(() => {
    console.log('getting postings...');
    fetchPostings();
  }, []);

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    /* Input.js component handles any formating for you... if you want to change style ... change it in Input.js */
    <>
      <form onSubmit={handleSubmit(onSubmit)}>

        <Input
          name='name'
          type='text'
          label='Postion Name'
          placeholder='Enter position name'
          required
          errors={errors}
          register={register}
        />
        <Input
          name='location'
          type='text'
          label='Company Location'
          placeholder='Enter job location'
          required
          errors={errors}
          register={register}
        />
        <Input
          name='salary'
          type='number'
          label='Company Salary'
          placeholder='Enter position salary'
          required
          errors={errors}
          register={register}
        />
        <Input
          name='level'
          type='text'
          label='Position Name'
          placeholder='Enter position level'
          required
          errors={errors}
          register={register}
        />
        <Input
          name='description'
          type='text'
          label='Job Description'
          placeholder='Enter job description'
          required
          errors={errors}
          register={register}
        />



        <input type='submit' />
      </form>
      <hr />
      <div>
        {companies.length > 0
          ? companies.map((company, index) => (
            <Company key={index} company={company} onCompanyDelete={companyDelete} />
            ))
          : 'no companies'}
      </div>
    </>
  );
};

export default JobPostingForm;
