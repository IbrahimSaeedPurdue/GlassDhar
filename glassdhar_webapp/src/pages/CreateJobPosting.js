import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Input from "../components/Input.js";
import SkillsDropdown from "../components/SkillsDropdown";
import { insertJobPosting } from "../api/api.js";

const createJobPostingFormSchema = yup
  .object({
    positionName: yup.string().max(300).required(),
    companyId: yup.number().required(),
    location: yup.string().max(300),
    salary: yup.number(),
    jobLevel: yup.string().max(100),
    jobDescription: yup.string().max(1000),
    skills: yup.array(),
  })
  .required();

const CreateJobPosting = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createJobPostingFormSchema),
    defaultValues: {
      positionName: "",
      companyId: 0,
      location: "",
      salary: 0,
      jobLevel: "",
      jobDescription: "",
      skills: [],
    },
  });

  const onSubmit = (data) => {
    jobPostingInsert(data);
  };

  const jobPostingInsert = async (data) => {
    await insertJobPosting(data);
    props.fetchJobPostings({});
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    /* Input.js component handles any formating for you... if you want to change style ... change it in Input.js */
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Create job posting form</h3>

        <Input
          name="positionName"
          type="text"
          label="Postion Name"
          placeholder="Enter position name"
          required
          errors={errors}
          register={register}
        />
        <Input
          name="companyId"
          type="number"
          label="Company Id"
          placeholder="Enter company id"
          required
          errors={errors}
          register={register}
        />

        <Input
          name="location"
          type="text"
          label="Job Location"
          placeholder="Enter job location"
          errors={errors}
          register={register}
        />
        <Input
          name="salary"
          type="number"
          label="Job Salary (Annual)"
          placeholder="Enter position salary"
          errors={errors}
          register={register}
        />
        <Input
          name="jobLevel"
          type="text"
          label="Job Level"
          placeholder="Enter job level"
          errors={errors}
          register={register}
        />
        <Input
          name="jobDescription"
          type="text"
          label="Job Description"
          placeholder="Enter job description"
          errors={errors}
          register={register}
        />

        <SkillsDropdown name="skills" register={register} />

        <input type="submit" />
      </form>
      <hr />
    </>
  );
};

export default CreateJobPosting;
