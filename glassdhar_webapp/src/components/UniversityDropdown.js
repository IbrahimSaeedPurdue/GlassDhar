import React, { useEffect, useState } from 'react';
import { getUniversities } from '../api/api';

const UniversityDropdown = (props) => {
  const [unis, setUnis] = useState([]);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    const unis_arr = (await getUniversities()).data.universities;

    setUnis(unis_arr);
  };

  return (
    <select class='select' {...props.register(props.name)}>
      {unis.map(uni => <option key={uni.id} value={uni.id}>{uni.name}</option>)}
    </select>
  );
};

export default UniversityDropdown;