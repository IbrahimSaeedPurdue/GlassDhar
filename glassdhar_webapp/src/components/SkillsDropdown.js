import React, { useEffect, useState } from 'react';
import { getSkills } from '../api/api';

const SkillsDropdown = (props) => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const skills = (await getSkills()).data.skills;

    setSkills(skills);
  };

  return (
    <select class='select' multiple {...props.register(props.name)}>
      {skills.map(skill => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
    </select>
  );
};

export default SkillsDropdown;
