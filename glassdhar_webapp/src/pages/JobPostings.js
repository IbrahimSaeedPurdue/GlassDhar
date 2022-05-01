import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Input from '../components/Input.js';
import SkillsDropdown from '../components/SkillsDropdown.js';
import CompanyDropdown from '../components/CompanyDropdown.js';
import JobPosting from '../components/JobPosting.js';
import { jobPostingFilterByDetails } from '../api/api.js';
import CreateJobPosting from '../pages/CreateJobPosting';

const companyFormSchema = yup
  .object({
    name: yup.string().max(300),
    companyId: yup.number(),
    minSalary: yup.number(),
    location: yup.string().max(300),
    jobLevel: yup.string().max(100)
  })
  .required();

const JobPostings = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(companyFormSchema),
    defaultValues: {
      name: '',
      companyId: -1,
      location: '',
      jobLevel: '',
      minSalary: 0,
      skills: []
    }
  });

  const onSubmit = (data) => {
    console.log(data);
    fetchJobPostings(data);
  };

  useEffect(() => {
    fetchJobPostings({}); // gets all job postings
  }, []);

  const [postings, setPostings] = useState([]);

  const fetchJobPostings = async (filtersParams) => {
    const postings = (await jobPostingFilterByDetails(filtersParams)).data
      .job_postings;

    setPostings(postings);
  };

  const [showCreate, setShowCreate] = useState(false);
  const toggleShowCreate = () => {
    setShowCreate((showCreate) => !showCreate);
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    /* Input.js component handles any formating for you... if you want to change style ... change it in Input.js */
    <>
      <h2>Job Postings</h2>
      <button type='button' onClick={toggleShowCreate}>
        Toggle Create Form
      </button>
      {showCreate
        ? <CreateJobPosting fetchJobPostings={fetchJobPostings} />
        : null}

      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Filtering Menu:</h3>
        <Input
          name='name'
          type='text'
          label='Job Title'
          placeholder='filter by job title'
          errors={errors}
          register={register}
        />

        <CompanyDropdown name='companyId' register={register} />

        <Input
          name='location'
          type='text'
          label='Job Location'
          placeholder='filter by location'
          errors={errors}
          register={register}
        />

        <Input
          name='jobLevel'
          type='text'
          label='Job Level'
          placeholder='filter by job level'
          errors={errors}
          register={register}
        />

        <Input
          name='minSalary'
          type='text'
          label='Minimum Salary'
          placeholder='filter by minSalary'
          errors={errors}
          register={register}
        />

        <SkillsDropdown name='skills' register={register} />

        <input type='submit' />
      </form>
      <hr />
      <h4>Job Postings: </h4>
      <div />
      {postings.length > 0 ? (
        postings.map((posting) => (
          <JobPosting
            key={posting.id}
            jobPosting={posting}
            fetchJobPostings={fetchJobPostings}
          />
        ))
      ) : (
        <p>;-;)/ No job postings </p>
      )}
    </>
  );
};

export default JobPostings;
