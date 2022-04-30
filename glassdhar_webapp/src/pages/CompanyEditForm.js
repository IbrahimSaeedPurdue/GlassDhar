import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {updateCompany} from '../api/api.js';
import Input from '../components/Input.js';
import Company from '../components/Company.js';

const CompanyEditForm = (props) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      companyId: props.company.company_id,
      name: props.company.name,
      companySite: props.company.company_site,
      industry: props.company.industry,
      numOfEmp: props.company.num_of_emp,
      description: props.company.description
    }
  });

  const onSubmit = (data) => {
    companyUpdate(data);
    //console.log(data);
  };

  const companyUpdate = async (data) => {
    await updateCompany(data);
    props.fetchCompanies();
  };

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
    </>
  );
};

export default CompanyEditForm;
