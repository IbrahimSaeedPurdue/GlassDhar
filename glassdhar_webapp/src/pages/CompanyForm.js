import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { insertCompany, getCompanies, deleteCompany } from '../api/api.js';
import Input from '../components/Input.js';
import Company from '../components/Company.js';

const companyFormSchema = yup.object({
  name: yup.string().max(80).required(),
  companySite: yup.string().max(80).required(),
  industry: yup.string().max(80).required(),
  numOfEmp: yup.number().positive().required(),
  description: yup.string().max(300)
}).required();

const CompanyForm = (props) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(companyFormSchema),
    defaultValues: {
      name: '',
      companySite: '',
      industry: '',
      numOfEmp: 0,
      description: ''
    }
  });

  const onSubmit = (data) => {
    companyInsert(data);
  };

  const [companies, setCompanies] = useState([]);

  const fetchCompanies = async () => {
    const companies = (await getCompanies()).data.companies;
    // console.log(companies);
    setCompanies(companies);
  };

  const companyInsert = async (company) => {
    await insertCompany(company);
    fetchCompanies();
  };

  const companyDelete = async (companyId) => {
    await deleteCompany(companyId);
    fetchCompanies();
  };

  useEffect(() => {
    console.log('getting companies...');
    fetchCompanies();
  }, []);

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    /* Input.js component handles any formating for you... if you want to change style ... change it in Input.js */
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          name='name'
          type='text'
          label='Company Name'
          placeholder='Enter company name'
          required
          errors={errors}
          register={register}
        />

        <Input
          name='companySite'
          type='text'
          label='Company Site'
          placeholder='Enter company site'
          required
          errors={errors}
          register={register}
        />

        <Input
          name='industry'
          type='text'
          label='Industry'
          placeholder='Enter industry'
          required
          errors={errors}
          register={register}
        />

        <Input
          name='numOfEmp'
          type='text'
          label='number of employees (estimate)'
          placeholder='Enter number of employees'
          required
          errors={errors}
          register={register}
        />

        <Input
          name='description'
          type='textarea'
          label='description'
          placeholder='Enter description'
          errors={errors}
          register={register}
        />
        <input type='submit' />
      </form>
      <hr />
      <div>
        {companies.length > 0
          ? companies.map((company, index) => (
            <Company key={index} company={company} onCompanyDelete={companyDelete} fetchCompanies={fetchCompanies} />
            ))
          : 'no companies'}
      </div>
    </>
  );
};

export default CompanyForm;
