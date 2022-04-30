import json
import os
from pickle import FALSE, TRUE
from unicodedata import name

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.inspection import inspect
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

#sqlalchemy prep statement
from sqlalchemy import Table, Column, Integer, String, MetaData, ForeignKey
from sqlalchemy import engine, inspect
from sqlalchemy.sql import text
from sqlalchemy import create_engine



from getpass import getpass
import sqlalchemy
# from mysql.connector import connect, Error

app = Flask(__name__)
# it's sqlite rn, but will change later
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///glassdhar.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

db = SQLAlchemy(app)

CORS(app)

# Models

# company(companyID: UNIQUE INT, name: UNIQUE STRING, companySite: STRING, industry: STRING, numOfEmp: INT, description: STRING)

# jobPosting(companyID: UNIQUE INT, positionID: UNIQUE INT, location: STRING, salary: INT, skills: STRING, Level: STRING, JobDescription: STRING, levelID: INT) - levelID is a foreign key referencing level(levelID)

# applicant(userEmail: UNIQUE STRING, name: STRING, school: STRING, gpa: INT, graduationDate: DATETIME, resumeLink: STRING, githubLink: STRING, portfolioLink: STRING, universityID: INT, currentCompanyID: INT) - universityID is a foreign key referencing university(universityID), currentCompany is a foreign key referencing company(companyID)
# university(universityID: UNIQUE INT, name: STRING) (we could add location or something if we need to)
# skill(skillID: UNIQUE INT, name: STRING)
# level(levelID: UNIQUE INT, name: STRING)
# application(userEmail: UNIQUE STRING, companyID: UNIQUE INT, positionID: UNIQUE INT)
# applicantSkills(userEmail: UNIQUE STRING, skillID: UNIQUE INT)
# jobPostingSkills(companyID: UNIQUE INT, positionID: UNIQUE INT, skillID: UNIQUE INT)


### TABLES ###
applicant_skills = db.Table('ApplicantSkills',
                            db.Column('applicant_id', db.Integer, db.ForeignKey(
                                'applicant.id'), primary_key=True),
                            db.Column('skill_id', db.Integer, db.ForeignKey(
                                'skill.id'), primary_key=True)
                            )

job_posting_skills = db.Table('JobPostingSkills',
                              db.Column('job_posting_id', db.Integer, db.ForeignKey(
                                  'job_posting.id'), primary_key=True),
                              db.Column('skill_id', db.Integer, db.ForeignKey(
                                  'skill.id'), primary_key=True)
                              )

applications = db.Table('Applications',
                        db.Column('applicant_id', db.Integer, db.ForeignKey(
                            'applicant.id'), primary_key=True),
                        db.Column('job_posting_id', db.Integer, db.ForeignKey(
                            'job_posting.id'), primary_key=True)
                        )

### MODELS ###


class Company(db.Model, SerializerMixin):
    serialize_only = ('company_id', 'name', 'company_site',
                      'industry', 'num_of_emp', 'description')
    serialize_rules = ('-employees', '-job_postings')

    company_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    company_site = db.Column(db.String(80))
    industry = db.Column(db.String(80), nullable=False)
    num_of_emp = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(300))

    employees = db.relationship("Applicant", backref='company', lazy=True)
    job_postings = db.relationship("JobPosting", backref='company')


class Applicant(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), unique=True)
    name = db.Column(db.String(80), nullable=False)
    gpa = db.Column(db.Float)
    graduation_date = db.Column(db.DateTime)
    resume_link = db.Column(db.String(300), nullable=False)
    github_link = db.Column(db.String(300))
    portfolio_link = db.Column(db.String(300))
    # passwordHash = db.Column(db.Integer)

    current_company_id = db.Column(
        db.Integer, db.ForeignKey('company.company_id'))
    university_id = db.Column(db.Integer, db.ForeignKey('university.id'))

    jobs_applications = db.relationship(
        'JobPosting', secondary=applications, backref='applicants')


class University(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(300), nullable=False)

    students = db.relationship("Applicant", backref='university', lazy=True)


class Skill(db.Model, SerializerMixin):

    serialize_only = ('id', 'name')
    serialize_rules = ('-applicants', '-job_postings')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(300), unique=True, nullable=False)

    applicants = db.relationship(
        'Applicant', secondary=applicant_skills, backref='skills', lazy=True)
    job_postings = db.relationship('JobPosting', secondary=job_posting_skills,
                                   backref='skills', lazy=True)


class JobPosting(db.Model, SerializerMixin):
    serialize_only = ('id', 'position_name', 'job_company_id',
                      'location', 'salary', 'job_level', 'job_description', 'date_created')
    serialize_rules = ()

    id = db.Column(db.Integer, primary_key=True)
    position_name = db.Column(db.String(300))
    job_company_id = db.Column(db.Integer, db.ForeignKey(
        'company.company_id'))
    location = db.Column(db.String(300))
    salary = db.Column(db.Integer)
    job_level = db.Column(db.String(100))
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
        email="ibrahim.alassad001@gmail.com",
        name="Ibrahim Saeed",
        gpa=11.1,
        graduation_date=datetime.now(),
        resume_link="www.mylittleresume.com",
        github_link="www.mylittlegithub.com",
        portfolio_link="www.mylittleportfolio.com"
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
        position_name="software engineering intern",
        location="remote",
        salary=120000,
        job_level='internship',
        job_description="blah blah blah",
        date_created=datetime.now()
    )

    posting2 = JobPosting(
        position_name="STEP Intern",
        location="mountain view",
        salary=1000,
        job_level='internship',
        job_description="blah blah blah",
        date_created=datetime.now()
    )
    # print('11111111111111111')
    c1.job_postings.append(posting1)
    c1.job_postings.append(posting2)
    # print('22222222222222222')
    posting1.skills.extend((skill1, skill2, skill3))
    # print('33333333333333333')
    db.session.add(posting1)
    db.session.add(posting2)

    posting1.applicants.append(a1)
    # print('44444444444444444')

    db.session.commit()

    return "Database initalized successfully", 200



### ----- APPLICANT ROUTES ----- ###

@app.route("/applicant/insert", methods=['POST'])
def insertApplicant():
    try:
        data = request.json['data']
        # companyName = data['name']
        # print(companyName)
        # if bool(Company.query.filter_by(name=companyName).first()):  # Check if company exists
        #     return "Company already exists, Silly Goose!"

        # db.session.add(
        #     Applicant(
        #       email =data["email"],
        #       name=data["name"],
        #       gpa=data["gpa"],
        #       graduation_date= datetime.now(),
        #       resume_link=data["resume_link"],
        #       github_link=data["github_link"],
        #       portfolio_link=data["portfolio_link"]
        #     ))


        email =data["email"]
        name=data["name"]
        # gpa=data["gpa"]
        # graduation_date= datetime.now()
        resume_link=data["resume_link"]
        # github_link=data["github_link"]
        # portfolio_link=data["portfolio_link"]
        insert_applicant_query = f'INSERT INTO Applicant(email, name, resume_link) VALUES({email}, {name}, {resume_link})'


        db.session.execute(
          '''
          INSERT INTO Applicant(email, name, resume_link) VALUES(neel001, shmurda, www.mylittleresume.com)
          '''
        )

        
        
        
        db.session.commit()

        return jsonify({"success": True}), 200
    except Exception as e:
        return f"{e}"

  # data = request.json['data']
  # today = datetime.today()

  # email =data["email"]
  # name=data["name"]
  # gpa=data["gpa"]
  # graduation_date=data["graduation_date"]
  # resume_link=data["resume_link"]
  # github_link=data["github_link"]
  # portfolio_link=data["portfolio_link"]
  # current_company_id = 1234
  # university_id = 3456



  #insert_applicant_query = f'INSERT INTO Applicant (email, name, gpa, graduation_date, resume_link, github_link, portfolio_link, current_company_id, university_id) VALUES ({email}, {name}, {gpa}, {graduation_date}, {resume_link}, {github_link}, {portfolio_link}, {current_company_id}, {university_id})'

  # db.session.execute(insert_applicant_query)

  # try:
  #   data = request.json['data']
  #   today = datetime.today()
    # db.session.add (
    #   Applicant(
    #     email="ibrahim.alassad001@gmail.com",
    #     name="Ibrahim Saeed",
    #     gpa=11.1,
    #     graduation_date="1/1/2000",
    #     resume_link="www.mylittleresume.com",
    #     github_link="www.mylittlegithub.com",
    #     portfolio_link="www.mylittleportfolio.com",
    #     current_company_id =3456,
    #     university_id = 1234
    #     # passwordHash = db.Column(db.Integer)
    #   )
    # )
  #   db.session.add(
  #     Applicant(
  #       email=data["email"],
  #       name=data["name"],
  #       gpa=data["gpa"],
  #       graduation_date=data["graduation_date"],
  #       resume_link=data["resume_link"],
  #       github_link=data["github_link"],
  #       portfolio_link=data["portfolio_link"],
  #       current_company_id =3456,
  #       university_id = 1234
  #       # passwordHash = db.Column(db.Integer)
  #   ))
  #   db.session.commit()

  #   return jsonify({"success": True}), 200
  # except Exception as e:
  #   return "user creation failed"



### ----- COMPANY ROUTES ----- ###


@app.route("/company/delete", methods=['POST'])
def deleteCompany():
    try:
        data = request.json['data']
        company_id = data['company_id']

        if bool(Company.query.filter_by(company_id=company_id).first()) == False:  # Check if company exists
            return "Company doesn't exists, Silly Goose!"

        Company.query.filter_by(company_id=company_id).delete()
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

        if bool(Company.query.filter_by(company_id=company_id).first()) == False:  # Check if company exists
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
        return "{e}"


@app.route("/company/insert", methods=['POST'])
def insertCompany():

    try:
        data = request.json['data']
        companyName = data['name']
        print(companyName)
        if bool(Company.query.filter_by(name=companyName).first()):  # Check if company exists
            return "Company already exists, Silly Goose!"

        db.session.add(
            Company(
                name=data['name'],
                company_site=data['company_site'],
                industry=data['industry'],
                num_of_emp=data['num_of_emp'],
                description=data['description']
            ))
        db.session.commit()

        return jsonify({"success": True}), 200
    except Exception as e:
        return "{e}"


@app.route("/company/<company_id>")
def getCompany(company_id):
    try:
        # db.session.connection(execution_options={'isolation_level': 'SERIALIZABLE'})
        company = Company.query.get(company_id)
        if company is None:
          return f'company id ={company_id} does not exist', 404

        company_dict = company.to_dict()
        return jsonify({'company': company_dict}), 200
    except Exception as e:
        return f"{e}"


@app.route("/company/all")
def getCompanies():
    try:
        companies = Company.query.all()
        companies_dict = [c.to_dict() for c in companies]

        return jsonify({"companies": companies_dict}), 200
    except Exception as e:
        return f"{e}"

### JOB POSTING ROUTES ###

@app.route("/jobposting/insert", methods=['POST'])
def insertJobPosting():
  try:
    data = request.json['data']
    today = datetime.today()
    db.session.add(
      JobPosting(
        position_name = data['position_name'],
        location = data['location'],
        salary = data['salary'],
        job_level = data['job_level'],
        job_description = data['job_description'],
        date_created = today
    ))
    db.session.commit()

    return jsonify({"success": True}), 200
  except Exception as e:
    return "job posting failed"

@app.route("/job-postings/filter", methods=['POST'])
def jobPostingFilterByDetails():
    data = request.json['data']
    name = data.get('name')
    min_salary = data.get('min_salary')
    company_id = data.get('company_id')
    location = data.get('location')
    job_level = data.get('job_level')
    min_date = data.get('min_date')
    skills = data.get('skills')
  
    if min_salary is None:
      min_salary = 0
    
    postings = JobPosting.query.filter(
        JobPosting.salary >= min_salary,
    )

    if name is not None and name != '':
      search_name = "%{}%".format(name.lower())
      postings = postings.filter(JobPosting.position_name.like(search_name))

    if company_id is not None and company_id != -1:
      postings = postings.filter(JobPosting.job_company_id == company_id)  

    if job_level is not None and job_level != '':
      postings = postings.filter(JobPosting.job_level == job_level)

    if location is not None and location != '':
        search_location = "%{}%".format(location.lower())
        postings = postings.filter(JobPosting.location.like(search_location))
 
    if skills is not None and len(skills) > 0:
      postings = postings.join(Skill).filter(Skill.id.in_(set(skills)))

    # if min_date is None or min_date != '':
    #   postings = postings.filter(JobPosting.date_created >= min_date)
    
    postings = [p.to_dict() for p in postings]
    return jsonify({'job_postings': postings}), 200

### SKILLS ROUTES ###

@app.route('/skills/all')
def getSkills():
  skills = Skill.query.all()
  skills = [s.to_dict() for s in skills]

  return jsonify({'skills': skills}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
