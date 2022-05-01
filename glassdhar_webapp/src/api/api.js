import flaskApp from './axiosSetup';

// ------- COMPANIES -------
export const getCompanies = () => {
  return flaskApp.get('/company/all');
};

export const insertCompany = ({ name, companySite, industry, numOfEmp, description }) => {
  return flaskApp.post('/company/insert', {
    data: {
      name: name,
      company_site: companySite,
      industry: industry,
      num_of_emp: numOfEmp,
      description: description
    }
  });
};

export const updateCompany = ({companyId, name, companySite, industry, numOfEmp, description }) => {
  return flaskApp.post('/company/update', {
    data: {
      company_id: companyId,
      name: name,
      company_site: companySite,
      industry: industry,
      num_of_emp: numOfEmp,
      description: description
    }
  });
};

export const deleteCompany = (companyId) => {
  return flaskApp.post('/company/delete', {
    data: {
      company_id: companyId
    }
  });
};
// ------- Applicants -------
export const insertApplicant = ({ name, email, gpa, graduationDate, resumeLink, githubLink, portfolioLink, companyId, universityId, skills }) => {
  let gradDate = new Date(graduationDate)
  let grad_date = gradDate.getDate() + "/" + (gradDate.getMonth() + 1) + "/" + gradDate.getFullYear() 
  return flaskApp.post('applicant/insert', {
    data: {
      name: name,
      email: email,
      gpa: gpa,
      graduation_date: grad_date,
      resume_link: resumeLink,
      github_link: githubLink,
      portfolio_link: portfolioLink,
      current_company_id: companyId,
      skills: skills,
      university_id: universityId
    }
  });
};

export const updateApplicant = ({ name, email, gpa, graduationDate, resumeLink, githubLink, portfolioLink, companyId, universityId, skills }) => {
  const gradDate = new Date(graduationDate);
  const grad_date = gradDate.getDate() + '/' + (gradDate.getMonth() + 1) + '/' + gradDate.getFullYear();

  return flaskApp.post('applicant/update', {
    data: {
      name: name,
      email: email,
      gpa: gpa,
      graduation_date: grad_date,
      resume_link: resumeLink,
      github_link: githubLink,
      portfolio_link: portfolioLink
    }
  });
};

export const getApplicants = () => {
  return flaskApp.get('/applicant/all')};

// ------- JOB POSTINGS -------
export const jobPostingFilterByDetails = ({ name, companyId, location, jobLevel, minSalary, skills }) => {
  return flaskApp.post('job-postings/filter', {
    data: {
      name: name,
      company_id: companyId,
      location: location,
      job_level: jobLevel,
      min_salary: minSalary,
      skills: skills
    }
  });
};

export const insertApplication = ( applicant_id, job_posting_id ) => {
  return flaskApp.post('/application/insert', {
    data: {
      applicant_id: applicant_id,
      job_posting_id: job_posting_id
    }
  });
};


// ------- SKILLS -------
export const getSkills = () => {
  return flaskApp.get('/skills/all');
};

// ------- UNIVERSITIES -------
export const getUniversities = () => {
  return flaskApp.get('/uni/all');
};