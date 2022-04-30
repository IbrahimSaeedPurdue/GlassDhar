import React from 'react';
import CompanyEditForm from '../pages/CompanyEditForm';

const Company = (props) => {
  return (
    <div>
      <p>company_id: {props.company.company_id}</p>
      <p>name: {props.company.name}</p>
      <p>company site: {props.company.company_site}</p>
      <p>industry: {props.company.industry}</p>
      <p>num_of_emp: {props.company.num_of_emp}</p>
      <p>description: {props.company.description}</p>
      {props.onCompanyDelete
        ? <button onClick={() => { props.onCompanyDelete(props.company.company_id) ;}}>delete</button>
        : null}
      <CompanyEditForm company={props.company} fetchCompanies={props.fetchCompanies}/> 
    </div>
  );
};

export default Company;
