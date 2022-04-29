import os
from pickle import FALSE, TRUE
from unicodedata import name

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.inspection import inspect

from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///glassdhar.db' #  it's sqlite rn, but will change later
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

CORS(app)

### Models

# company(companyID: UNIQUE INT, name: UNIQUE STRING, companySite: STRING, industry: STRING, numOfEmp: INT, description: STRING)

# jobPosting(companyID: UNIQUE INT, positionID: UNIQUE INT, location: STRING, salary: INT, skills: STRING, Level: STRING, JobDescription: STRING, levelID: INT) - levelID is a foreign key referencing level(levelID)

# applicant(userEmail: UNIQUE STRING, name: STRING, school: STRING, gpa: INT, graduationDate: DATETIME, resumeLink: STRING, githubLink: STRING, portfolioLink: STRING, universityID: INT, currentCompanyID: INT) - universityID is a foreign key referencing university(universityID), currentCompany is a foreign key referencing company(companyID)
# university(universityID: UNIQUE INT, name: STRING) (we could add location or something if we need to)
# skill(skillID: UNIQUE INT, name: STRING)
# level(levelID: UNIQUE INT, name: STRING)
# application(userEmail: UNIQUE STRING, companyID: UNIQUE INT, positionID: UNIQUE INT)
# applicantSkills(userEmail: UNIQUE STRING, skillID: UNIQUE INT)
# jobPostingSkills(companyID: UNIQUE INT, positionID: UNIQUE INT, skillID: UNIQUE INT)

class Serializer(object):
    def serialize(self):
        return {c: getattr(self, c) for c in inspect(self).attrs.keys()}

    @staticmethod
    def serialize_list(l):
        return [m.serialize() for m in l]


### TABLES ###
applicant_skills = db.Table('ApplicantSkills',
  db.Column('applicant_id', db.Integer, db.ForeignKey('applicant.id'), primary_key=True),
  db.Column('skill_id', db.Integer, db.ForeignKey('skill.id'), primary_key=True)
)

job_posting_skills = db.Table('JobPostingSkills',
  db.Column('position_name', db.String(300), db.ForeignKey('job_posting.position_name'), primary_key=True),
  db.Column('company_id', db.Integer, db.ForeignKey('job_posting.job_company_id'), primary_key=True),
  db.Column('skill_id', db.Integer, db.ForeignKey('skill.id'), primary_key=True)
)

### MODELS ###
class Company(db.Model, Serializer):
  company_id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(80), unique=True, nullable=False)
  company_site = db.Column(db.String(80))
  industry = db.Column(db.String(80), nullable=False)
  num_of_emp = db.Column(db.Integer, nullable=False)
  description = db.Column(db.String(300))

  employees = db.relationship("Applicant", backref='company', lazy=True)
  job_postings = db.relationship("JobPosting", backref='company')

class Applicant(db.Model, Serializer):
  id = db.Column(db.Integer, primary_key=True)
  email = db.Column(db.String(80), unique=True)
  name = db.Column(db.String(80), nullable=False)
  gpa = db.Column(db.Float)
  graduation_date = db.Column(db.DateTime)
  resume_link = db.Column(db.String(300), nullable=False)
  github_link = db.Column(db.String(300))
  portfolio_link = db.Column(db.String(300))
  # passwordHash = db.Column(db.Integer)

  current_company_id = db.Column(db.Integer, db.ForeignKey('company.company_id'))
  university_id = db.Column(db.Integer, db.ForeignKey('university.id'))

class University(db.Model, Serializer):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(300), nullable=False)

  students = db.relationship("Applicant", backref='university', lazy=True)

class Skill(db.Model, Serializer):  
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(300), unique=True, nullable=False)

  applicants = db.relationship('Applicant', secondary=applicant_skills, backref='skills', lazy=True)
  # job_postings = db.relationship('JobPosting', secondary=job_posting_skills, backref='skills', lazy=True)

class JobPosting(db.Model, Serializer):
  position_name = db.Column(db.String(300), primary_key=True)
  job_company_id = db.Column(db.Integer, db.ForeignKey('company.company_id'), primary_key=True)
  location = db.Column(db.String(300))
  salary = db.Column(db.Integer)
  job_description = db.Column(db.String(2000))
  date_created = db.Column(db.DateTime, nullable=False)


@app.route("/init-db", methods=['POST', 'GET'])
def init_db():
  db.drop_all()
  db.create_all()

  c1 = Company(
      name="Apple",
      company_site="www.apple.com",
      industry='Technology',
      num_of_emp="500000",
      description='blah blah blahblah blah blahblah blah blahblah blah blah blah blah blah'
      )

  db.session.add(c1)

  a1 = Applicant(
      email = "ibrahim.alassad001@gmail.com",
      name = "Ibrahim Saeed",
      gpa = 11.1,
      graduation_date = datetime.now(),
      resume_link = "www.mylittleresume.com",
      github_link = "www.mylittlegithub.com",
      portfolio_link = "www.mylittleportfolio.com",
      # passwordHash = db.Column(db.Integer)
  )

  db.session.add(a1)

  u1 = University(name="Purdue University")

  skill1 = Skill(name="java")
  skill2 = Skill(name="python")
  skill3 = Skill(name="tensorflow")

  db.session.add(skill1)
  db.session.add(skill2)
  db.session.add(skill3)

  c1.employees.append(a1)
  u1.students.append(a1)
  a1.skills.extend((skill1, skill2, skill3))

  posting1 = JobPosting(
    position_name= "Software Engineering Intern",
    location = "Remote",
    salary = 120000,
    job_description = "blah blah blah",
    date_created = datetime.now()
  )
  # print('11111111111111111')
  c1.job_postings.append(posting1)
  # print('22222222222222222')
  # posting1.skills.extend((skill1, skill2, skill3))
  # print('33333333333333333')
  db.session.add(posting1)
  # print('44444444444444444')

  db.session.commit()

  return "Database initalized successfully", 200

@app.route("/company/delete", methods=['POST'])
def deleteCompany():
  try:
    data = request.json['data']
    company_id = data['company_id']

    if bool(Company.query.filter_by(company_id=company_id).first()) == False: #Check if company exists
      return "Company doesn't exists, Silly Goose!"

    Company.query.filter_by(company_id = company_id).delete()
    db.session.commit()

    return jsonify({"success": True}), 200
  except Exception as e:
    return "{e}"
  

@app.route("/company/update", methods=['POST'])
def updateCompany():
  try:
    data = request.json['data']
    company_id = data['company_id']
    company_name = data['name']
    company_site = data['company_site']
    industry = data['industry']
    num_of_emp = data['num_of_emp']
    description = data['description']

    if bool(Company.query.filter_by(company_id=company_id).first()) == False: #Check if company exists
      return "Company doesn't exists, Silly Goose!"

    company = Company.query.filter_by(company_id=company_id)

    company.update(dict(
      name=company_name,
      company_site=company_site,
      industry=industry,
      num_of_emp=num_of_emp,
      description=description
    ))
    db.session.commit()

    return jsonify({"success": True}), 200
  except Exception as e:
    return f"an error occurred {e}"


@app.route("/company/insert", methods=['POST'])
def insertCompany():


  try:
    data = request.json['data']
    companyName = data['name']
    print(companyName)
    if bool(Company.query.filter_by(name=companyName).first()): #Check if company exists
      return "Company already exists, Silly Goose!"

    db.session.add(
      Company(
        name = data['name'],
        company_site = data['company_site'],
        industry = data['industry'],
        num_of_emp = data['num_of_emp'],
        description = data['description']
    ))
    db.session.commit()


    return jsonify({"success": True}), 200
  except Exception as e:
    return "{e}"


@app.route("/")
def hello_world():
  return "<p>Hello, World!</p>"

@app.route("/company/all")
def get_companies():
  try:
    companies = Company.query.all()
    return jsonify({"companies": Company.serialize_list(companies)}), 200
  except Exception as e:
    return f"{e}"


@app.route("/jobposting/update", methods=['POST'])
def updateJobPosting():
  try:
    data = request.json['data']

    # job_level ADDD!

    position_name = data['position_name']
    job_company_id = data['job_company_id']
    location = data['location']
    salary = data['salary']
    job_description = data['job_description']

    if bool(JobPosting.query.filter_by(position_name=position_name, job_company_id=job_company_id).first()) == False: #Check if company exists
      return "Job posting doesn't exists, Silly Goose!"

    jobposting = JobPosting.query.filter_by(position_name=position_name)

    jobposting.update(dict(
      position_name = position_name,
      job_company_id = job_company_id,
      location = location,
      salary = salary,
      job_description = job_description,
    ))
    db.session.commit()

    return jsonify({"success": True}), 200
  except Exception as e:
    return f"an error occurred {e}"



@app.route("/applicant/update", methods=['POST'])
def updateApplicant():
  try:
    data = request.json['data']

    # do we need to update current_company_id, university_id???

    id = data['id']
    email = data['email']
    name = data['name']
    gpa = data['gpa']
    graduation_date = data['graduation_date']
    resume_link = data['resume_link']
    github_link = data['github_link']
    portfolio_link = data['portfolio_link']

    if bool(Applicant.query.filter_by(id=id).first()) == False: #Check if applicant exists
      return "Applicant doesn't exists, Silly Goose!"

    applicant = Applicant.query.filter_by(id=id)

    applicant.update(dict(
      email = email,
      name = name,
      gpa = gpa,
      graduation_date = graduation_date,  #remove for testing purpose
      resume_link = resume_link,
      github_link = github_link,
      portfolio_link = portfolio_link

    ))
    db.session.commit()

    return jsonify({"success": True}), 200
  except Exception as e:
    return f"an error occurred {e}"



if __name__ == '__main__':
  app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
