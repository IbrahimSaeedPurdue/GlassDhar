import os
from pickle import FALSE, TRUE

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import sqlite3

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

class Company(db.Model):
  company_id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(80), unique=True, nullable=False)
  company_site = db.Column(db.String(80), nullable=True)
  industry = db.Column(db.String(80), nullable=False)
  num_of_emp = db.Column(db.Integer, nullable=False)
  description = db.Column(db.String(300), nullable=True)
  

@app.route("/init-db", methods=['POST', 'GET'])
def init_db():
  db.drop_all()
  db.create_all()

  db.session.add(
    Company(
      name="Apple",
      company_site="www.apple.com",
      industry='Technology',
      num_of_emp="500000",
      description='blah blah blahblah blah blahblah blah blahblah blah blah blah blah blah')
  )
  db.session.commit()

  return "Database initalized successfully", 200

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

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
