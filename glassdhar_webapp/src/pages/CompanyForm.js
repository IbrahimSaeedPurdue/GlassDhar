import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { insertCompany } from '../api/api.js';
import Input from '../components/Input.js';

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
    console.log(data);
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
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

export default CompanyForm;
