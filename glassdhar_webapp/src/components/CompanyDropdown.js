import React, { useEffect, useState } from 'react';
import { getCompanies } from '../api/api';

const CompanyDropdown = (props) => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const companies = (await getCompanies()).data.companies;

    setCompanies(companies);
  };

  return (
    <select class='select' {...props.register(props.name)}>
      {companies.map(company => <option key={company.company_id} value={company.company_id}>{company.name}</option>)}
    </select>
  );
};

export default CompanyDropdown;
