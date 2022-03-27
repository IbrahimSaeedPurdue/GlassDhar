import flaskApp from './axiosSetup';

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

export const deleteCompany = (companyId) => {
  return flaskApp.post('/company/delete', {
    data: {
      company_id: companyId
    }
  });
};
