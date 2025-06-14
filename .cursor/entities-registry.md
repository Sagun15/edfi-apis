CREATE SEQUENCE descriptor_descriptorid_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- DROP SEQUENCE parent_parentusi_seq;
CREATE SEQUENCE parent_parentusi_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- DROP SEQUENCE staff_staffusi_seq;
CREATE SEQUENCE staff_staffusi_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- DROP SEQUENCE student_studentusi_seq;
CREATE SEQUENCE student_studentusi_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- balancesheetdimension definition
CREATE TYPE STATUS AS ENUM('active', 'deleted');

-- Base Table
CREATE TABLE base (
  id uuid DEFAULT gen_random_uuid () NOT NULL,
  status STATUS NOT NULL,
  createdate timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  lastmodifieddate timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deletedate timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX ux_status ON base USING btree (status);

-- Descriptors
CREATE TABLE "descriptor" (
  "namespace" varchar(255) NOT NULL,
  codevalue varchar(50) NOT NULL,
  shortdescription varchar(75) NOT NULL,
  description varchar(1024) NULL,
  priordescriptorid int4 NULL,
  effectivebegindate date NULL,
  effectiveenddate date NULL,
  id uuid DEFAULT gen_random_uuid () NOT NULL,
  CONSTRAINT descriptor_ak UNIQUE (codevalue, namespace)
) INHERITS (base);


CREATE UNIQUE INDEX ux_219915_id ON descriptor USING btree (id);

CREATE TABLE attendanceeventcategorydescriptor (
  attendanceeventcategorydescriptorid int4 NOT NULL,
  CONSTRAINT attendanceeventcategorydescriptor_pk PRIMARY KEY (attendanceeventcategorydescriptorid)
) INHERITS (descriptor);

CREATE TABLE educationalenvironmentdescriptor (
  educationalenvironmentdescriptorid int4 NOT NULL,
  CONSTRAINT educationalenvironmentdescriptor_pk PRIMARY KEY (educationalenvironmentdescriptorid)
) INHERITS (descriptor);

CREATE TABLE calendartypedescriptor (
  calendartypedescriptorid int4 NOT NULL,
  CONSTRAINT calendartypedescriptor_pk PRIMARY KEY (calendartypedescriptorid)
) INHERITS (descriptor);

CREATE TABLE termdescriptor (
  termdescriptorid int4 NOT NULL,
  CONSTRAINT termdescriptor_pk PRIMARY KEY (termdescriptorid)
) INHERITS (descriptor);

CREATE TABLE gradingperioddescriptor (
  gradingperioddescriptorid int4 NOT NULL,
  CONSTRAINT gradingperioddescriptor_pk PRIMARY KEY (gradingperioddescriptorid)
) INHERITS (descriptor);

CREATE TABLE assessmentcategorydescriptor (
  assessmentcategorydescriptorid int4 NOT NULL,
  CONSTRAINT assessmentcategorydescriptor_pk PRIMARY KEY (assessmentcategorydescriptorid)
) INHERITS (descriptor);

CREATE TABLE administrationenvironmentdescriptor (
  administrationenvironmentdescriptorid int4 NOT NULL,
  CONSTRAINT administrationenvironmentdescriptor_pk PRIMARY KEY (administrationenvironmentdescriptorid)
) INHERITS (descriptor);

CREATE TABLE eventcircumstancedescriptor (
  eventcircumstancedescriptorid int4 NOT NULL,
  CONSTRAINT eventcircumstancedescriptor_pk PRIMARY KEY (eventcircumstancedescriptorid)
) INHERITS (descriptor);

CREATE TABLE gradeleveldescriptor (
  gradeleveldescriptorid int4 NOT NULL,
  CONSTRAINT gradeleveldescriptor_pk PRIMARY KEY (gradeleveldescriptorid)
) INHERITS (descriptor);

CREATE TABLE languagedescriptor (
  languagedescriptorid int4 NOT NULL,
  CONSTRAINT languagedescriptor_pk PRIMARY KEY (languagedescriptorid)
) INHERITS (descriptor);

CREATE TABLE platformtypedescriptor (
  platformtypedescriptorid int4 NOT NULL,
  CONSTRAINT platformtypedescriptor_pk PRIMARY KEY (platformtypedescriptorid)
) INHERITS (descriptor);

CREATE TABLE reasonnottesteddescriptor (
  reasonnottesteddescriptorid int4 NOT NULL,
  CONSTRAINT reasonnottesteddescriptor_pk PRIMARY KEY (reasonnottesteddescriptorid)
) INHERITS (descriptor);

CREATE TABLE retestindicatordescriptor (
  retestindicatordescriptorid int4 NOT NULL,
  CONSTRAINT retestindicatordescriptor_pk PRIMARY KEY (retestindicatordescriptorid)
) INHERITS (descriptor);

CREATE TABLE assessmentitemcategorydescriptor (
  assessmentitemcategorydescriptorid int4 NOT NULL,
  CONSTRAINT assessmentitemcategorydescriptor_pk PRIMARY KEY (assessmentitemcategorydescriptorid)
) INHERITS (descriptor);

CREATE TABLE attemptstatusdescriptor (
  attemptstatusdescriptorid int4 NOT NULL,
  CONSTRAINT attemptstatusdescriptor_pk PRIMARY KEY (attemptstatusdescriptorid)
) INHERITS (descriptor);

CREATE TABLE repeatidentifierdescriptor (
  repeatidentifierdescriptorid int4 NOT NULL,
  CONSTRAINT repeatidentifierdescriptor_pk PRIMARY KEY (repeatidentifierdescriptorid)
) INHERITS (descriptor);

CREATE TABLE entrygradelevelreasondescriptor (
  entrygradelevelreasondescriptorid int4 NOT NULL,
  CONSTRAINT entrygradelevelreasondescriptor_pk PRIMARY KEY (entrygradelevelreasondescriptorid)
) INHERITS (descriptor);

CREATE TABLE entrytypedescriptor (
  entrytypedescriptorid int4 NOT NULL,
  CONSTRAINT entrytypedescriptor_pk PRIMARY KEY (entrytypedescriptorid)
) INHERITS (descriptor);

CREATE TABLE exitwithdrawtypedescriptor (
  exitwithdrawtypedescriptorid int4 NOT NULL,
  CONSTRAINT exitwithdrawtypedescriptor_pk PRIMARY KEY (exitwithdrawtypedescriptorid)
) INHERITS (descriptor);

CREATE TABLE residencystatusdescriptor (
  residencystatusdescriptorid int4 NOT NULL,
  CONSTRAINT residencystatusdescriptor_pk PRIMARY KEY (residencystatusdescriptorid)
) INHERITS (descriptor);

CREATE TABLE citizenshipstatusdescriptor (
  citizenshipstatusdescriptorid int4 NOT NULL,
  CONSTRAINT citizenshipstatusdescriptor_pk PRIMARY KEY (citizenshipstatusdescriptorid)
) INHERITS (descriptor);

CREATE TABLE countrydescriptor (
  countrydescriptorid int4 NOT NULL,
  CONSTRAINT countrydescriptor_pk PRIMARY KEY (countrydescriptorid)
) INHERITS (descriptor);

CREATE TABLE sexdescriptor (
  sexdescriptorid int4 NOT NULL,
  CONSTRAINT sexdescriptor_pk PRIMARY KEY (sexdescriptorid)
) INHERITS (descriptor);

CREATE TABLE stateabbreviationdescriptor (
  stateabbreviationdescriptorid int4 NOT NULL,
  CONSTRAINT stateabbreviationdescriptor_pk PRIMARY KEY (stateabbreviationdescriptorid)
) INHERITS (descriptor);

CREATE TABLE levelofeducationdescriptor (
  levelofeducationdescriptorid int4 NOT NULL,
  CONSTRAINT levelofeducationdescriptor_pk PRIMARY KEY (levelofeducationdescriptorid)
) INHERITS (descriptor);

CREATE TABLE oldethnicitydescriptor (
  oldethnicitydescriptorid int4 NOT NULL,
  CONSTRAINT oldethnicitydescriptor_pk PRIMARY KEY (oldethnicitydescriptorid)
) INHERITS (descriptor);

CREATE TABLE credentialtypedescriptor (
  credentialtypedescriptorid int4 NOT NULL,
  CONSTRAINT credentialtypedescriptor_pk PRIMARY KEY (credentialtypedescriptorid)
) INHERITS (descriptor);

CREATE TABLE credentialfielddescriptor (
  credentialfielddescriptorid int4 NOT NULL,
  CONSTRAINT credentialfielddescriptor_pk PRIMARY KEY (credentialfielddescriptorid)
) INHERITS (descriptor);

CREATE TABLE teachingcredentialdescriptor (
  teachingcredentialdescriptorid int4 NOT NULL,
  CONSTRAINT teachingcredentialdescriptor_pk PRIMARY KEY (teachingcredentialdescriptorid)
) INHERITS (descriptor);

CREATE TABLE teachingcredentialbasisdescriptor (
  teachingcredentialbasisdescriptorid int4 NOT NULL,
  CONSTRAINT teachingcredentialbasisdescriptor_pk PRIMARY KEY (teachingcredentialbasisdescriptorid)
) INHERITS (descriptor);

CREATE TABLE nonmedicalimmunizationexemptiondescriptor (
  nonmedicalimmunizationexemptiondescriptorid int4 NOT NULL,
  CONSTRAINT nonmedicalimmunizationexemptiondescriptor_pk PRIMARY KEY (nonmedicalimmunizationexemptiondescriptorid)
) INHERITS (descriptor);

CREATE TABLE administrativefundingcontroldescriptor (
  administrativefundingcontroldescriptorid int4 NOT NULL,
  CONSTRAINT administrativefundingcontroldescriptor_pk PRIMARY KEY (administrativefundingcontroldescriptorid)
) INHERITS (descriptor);

CREATE TABLE charterapprovalagencytypedescriptor (
  charterapprovalagencytypedescriptorid int4 NOT NULL,
  CONSTRAINT charterapprovalagencytypedescriptor_pk PRIMARY KEY (charterapprovalagencytypedescriptorid)
) INHERITS (descriptor);

CREATE TABLE charterstatusdescriptor (
  charterstatusdescriptorid int4 NOT NULL,
  CONSTRAINT charterstatusdescriptor_pk PRIMARY KEY (charterstatusdescriptorid)
) INHERITS (descriptor);

CREATE TABLE internetaccessdescriptor (
  internetaccessdescriptorid int4 NOT NULL,
  CONSTRAINT internetaccessdescriptor_pk PRIMARY KEY (internetaccessdescriptorid)
) INHERITS (descriptor);

CREATE TABLE magnetspecialprogramemphasisschooldescriptor (
  magnetspecialprogramemphasisschooldescriptorid int4 NOT NULL,
  CONSTRAINT magnetspecialprogramemphasisschooldescriptor_pk PRIMARY KEY (magnetspecialprogramemphasisschooldescriptorid)
) INHERITS (descriptor);

CREATE TABLE schooltypedescriptor (
  schooltypedescriptorid int4 NOT NULL,
  CONSTRAINT schooltypedescriptor_pk PRIMARY KEY (schooltypedescriptorid)
) INHERITS (descriptor);

CREATE TABLE titleipartaschooldesignationdescriptor (
  titleipartaschooldesignationdescriptorid int4 NOT NULL,
  CONSTRAINT titleipartaschooldesignationdescriptor_pk PRIMARY KEY (titleipartaschooldesignationdescriptorid)
) INHERITS (descriptor);

CREATE TABLE academicsubjectdescriptor (
  academicsubjectdescriptorid int4 NOT NULL,
  CONSTRAINT academicsubjectdescriptor_pk PRIMARY KEY (academicsubjectdescriptorid)
) INHERITS (descriptor);

CREATE TABLE careerpathwaydescriptor (
  careerpathwaydescriptorid int4 NOT NULL,
  CONSTRAINT careerpathwaydescriptor_pk PRIMARY KEY (careerpathwaydescriptorid)
) INHERITS (descriptor);

CREATE TABLE coursedefinedbydescriptor (
  coursedefinedbydescriptorid int4 NOT NULL,
  CONSTRAINT coursedefinedbydescriptor_pk PRIMARY KEY (coursedefinedbydescriptorid)
) INHERITS (descriptor);

CREATE TABLE coursegpaapplicabilitydescriptor (
  coursegpaapplicabilitydescriptorid int4 NOT NULL,
  CONSTRAINT coursegpaapplicabilitydescriptor_pk PRIMARY KEY (coursegpaapplicabilitydescriptorid)
) INHERITS (descriptor);

CREATE TABLE credittypedescriptor (
  credittypedescriptorid int4 NOT NULL,
  CONSTRAINT credittypedescriptor_pk PRIMARY KEY (credittypedescriptorid)
) INHERITS (descriptor);

CREATE TABLE programassignmentdescriptor (
  programassignmentdescriptorid int4 NOT NULL,
  CONSTRAINT programassignmentdescriptor_pk PRIMARY KEY (programassignmentdescriptorid)
) INHERITS (descriptor);

CREATE TABLE classroompositiondescriptor (
  classroompositiondescriptorid int4 NOT NULL,
  CONSTRAINT classroompositiondescriptor_pk PRIMARY KEY (classroompositiondescriptorid)
) INHERITS (descriptor);

CREATE TABLE mediumofinstructiondescriptor (
  mediumofinstructiondescriptorid int4 NOT NULL,
  CONSTRAINT mediumofinstructiondescriptor_pk PRIMARY KEY (mediumofinstructiondescriptorid)
) INHERITS (descriptor);

CREATE TABLE populationserveddescriptor (
  populationserveddescriptorid int4 NOT NULL,
  CONSTRAINT populationserveddescriptor_pk PRIMARY KEY (populationserveddescriptorid)
) INHERITS (descriptor);

CREATE TABLE sourcesystemdescriptor (
  sourcesystemdescriptorid int4 NOT NULL,
  CONSTRAINT sourcesystemdescriptor_pk PRIMARY KEY (sourcesystemdescriptorid)
) INHERITS (descriptor);

CREATE TABLE relationdescriptor (
  relationdescriptorid int4 NOT NULL,
  CONSTRAINT relationdescriptor_pk PRIMARY KEY (relationdescriptorid)
) INHERITS (descriptor);

CREATE TABLE courseattemptresultdescriptor (
  courseattemptresultdescriptorid int4 NOT NULL,
  CONSTRAINT courseattemptresultdescriptor_pk PRIMARY KEY (courseattemptresultdescriptorid)
) INHERITS (descriptor);

CREATE TABLE courserepeatcodedescriptor (
  courserepeatcodedescriptorid int4 NOT NULL,
  CONSTRAINT courserepeatcodedescriptor_pk PRIMARY KEY (courserepeatcodedescriptorid)
) INHERITS (descriptor);

CREATE TABLE methodcreditearneddescriptor (
  methodcreditearneddescriptorid int4 NOT NULL,
  CONSTRAINT methodcreditearneddescriptor_pk PRIMARY KEY (methodcreditearneddescriptorid)
) INHERITS (descriptor);

CREATE TABLE gradetypedescriptor (
  gradetypedescriptorid int4 NOT NULL,
  CONSTRAINT gradetypedescriptor_pk PRIMARY KEY (gradetypedescriptorid)
) INHERITS (descriptor);

CREATE TABLE performancebaseconversiondescriptor (
  performancebaseconversiondescriptorid int4 NOT NULL,
  CONSTRAINT performancebaseconversiondescriptor_pk PRIMARY KEY (performancebaseconversiondescriptorid)
) INHERITS (descriptor);

CREATE TABLE gradebookentrytypedescriptor (
  gradebookentrytypedescriptorid int4 NOT NULL,
  CONSTRAINT gradebookentrytypedescriptor_pk PRIMARY KEY (gradebookentrytypedescriptorid)
) INHERITS (descriptor);

CREATE TABLE assignmentlatestatusdescriptor (
  assignmentlatestatusdescriptorid int4 NOT NULL,
  CONSTRAINT assignmentlatestatusdescriptor_pk PRIMARY KEY (assignmentlatestatusdescriptorid)
) INHERITS (descriptor);

CREATE TABLE competencyleveldescriptor (
  competencyleveldescriptorid int4 NOT NULL,
  CONSTRAINT competencyleveldescriptor_pk PRIMARY KEY (competencyleveldescriptorid)
) INHERITS (descriptor);

CREATE TABLE submissionstatusdescriptor (
  submissionstatusdescriptorid int4 NOT NULL,
  CONSTRAINT submissionstatusdescriptor_pk PRIMARY KEY (submissionstatusdescriptorid)
) INHERITS (descriptor);

CREATE TABLE operationalstatusdescriptor (
    operationalstatusdescriptorid int4 NOT NULL,
    CONSTRAINT operationalstatusdescriptor_pk PRIMARY KEY (operationalstatusdescriptorid)
) INHERITS (descriptor);

-- Core Entity Tables

CREATE TABLE educationorganization (
	educationorganizationid int4 NOT NULL,
	nameofinstitution varchar(75) NOT NULL,
	shortnameofinstitution varchar(75) NULL,
	website varchar(255) NULL,
	operationalstatusdescriptorid int4 NULL,
	CONSTRAINT educationorganization_pk PRIMARY KEY (educationorganizationid),
	CONSTRAINT fk_4525e6_operationalstatusdescriptor FOREIGN KEY (operationalstatusdescriptorid) REFERENCES operationalstatusdescriptor(operationalstatusdescriptorid)
) INHERITS (base);
CREATE INDEX fk_4525e6_operationalstatusdescriptor ON educationorganization USING btree (operationalstatusdescriptorid);
CREATE UNIQUE INDEX ux_4525e6_id ON educationorganization USING btree (id);


CREATE TABLE school (
  schoolid int4 NOT NULL,
  schooltypedescriptorid int4 NULL,
  charterstatusdescriptorid int4 NULL,
  titleipartaschooldesignationdescriptorid int4 NULL,
  magnetspecialprogramemphasisschooldescriptorid int4 NULL,
  administrativefundingcontroldescriptorid int4 NULL,
  internetaccessdescriptorid int4 NULL,
  localeducationagencyid int4 NULL,
  charterapprovalagencytypedescriptorid int4 NULL,
  charterapprovalschoolyear int2 NULL,
  CONSTRAINT school_pk PRIMARY KEY (schoolid),
  CONSTRAINT fk_6cd2e3_administrativefundingcontroldescriptor FOREIGN KEY (administrativefundingcontroldescriptorid) REFERENCES administrativefundingcontroldescriptor (administrativefundingcontroldescriptorid),
  CONSTRAINT fk_6cd2e3_charterapprovalagencytypedescriptor FOREIGN KEY (charterapprovalagencytypedescriptorid) REFERENCES charterapprovalagencytypedescriptor (charterapprovalagencytypedescriptorid),
  CONSTRAINT fk_6cd2e3_charterstatusdescriptor FOREIGN KEY (charterstatusdescriptorid) REFERENCES charterstatusdescriptor (charterstatusdescriptorid),
  CONSTRAINT fk_6cd2e3_educationorganization FOREIGN KEY (schoolid) REFERENCES educationorganization (educationorganizationid) ON DELETE CASCADE,
  CONSTRAINT fk_6cd2e3_internetaccessdescriptor FOREIGN KEY (internetaccessdescriptorid) REFERENCES internetaccessdescriptor (internetaccessdescriptorid),
--  CONSTRAINT fk_6cd2e3_localeducationagency FOREIGN KEY (localeducationagencyid) REFERENCES localeducationagency (localeducationagencyid),
  CONSTRAINT fk_6cd2e3_magnetspecialprogramemphasisschooldescriptor FOREIGN KEY (magnetspecialprogramemphasisschooldescriptorid) REFERENCES magnetspecialprogramemphasisschooldescriptor (magnetspecialprogramemphasisschooldescriptorid),
  CONSTRAINT fk_6cd2e3_schooltypedescriptor FOREIGN KEY (schooltypedescriptorid) REFERENCES schooltypedescriptor (schooltypedescriptorid),
--   CONSTRAINT fk_6cd2e3_schoolyeartype FOREIGN KEY (charterapprovalschoolyear) REFERENCES schoolyeartype (schoolyear),
  CONSTRAINT fk_6cd2e3_titleipartaschooldesignationdescriptor FOREIGN KEY (titleipartaschooldesignationdescriptorid) REFERENCES titleipartaschooldesignationdescriptor (titleipartaschooldesignationdescriptorid)
) INHERITS (educationorganization);

CREATE INDEX fk_6cd2e3_administrativefundingcontroldescriptor ON school USING btree (administrativefundingcontroldescriptorid);

CREATE INDEX fk_6cd2e3_charterapprovalagencytypedescriptor ON school USING btree (charterapprovalagencytypedescriptorid);

CREATE INDEX fk_6cd2e3_charterstatusdescriptor ON school USING btree (charterstatusdescriptorid);

CREATE INDEX fk_6cd2e3_internetaccessdescriptor ON school USING btree (internetaccessdescriptorid);

-- CREATE INDEX fk_6cd2e3_localeducationagency ON school USING btree (localeducationagencyid);

CREATE INDEX fk_6cd2e3_magnetspecialprogramemphasisschooldescriptor ON school USING btree (magnetspecialprogramemphasisschooldescriptorid);

CREATE INDEX fk_6cd2e3_schooltypedescriptor ON school USING btree (schooltypedescriptorid);

CREATE INDEX fk_6cd2e3_schoolyeartype ON school USING btree (charterapprovalschoolyear);

CREATE INDEX fk_6cd2e3_titleipartaschooldesignationdescriptor ON school USING btree (titleipartaschooldesignationdescriptorid);


CREATE TABLE student (
  studentusi serial4 NOT NULL,
  personaltitleprefix varchar(30) NULL,
  firstname varchar(75) NOT NULL,
  middlename varchar(75) NULL,
  lastsurname varchar(75) NOT NULL,
  preferredfirstname varchar(75) NULL,
  preferredlastsurname varchar(75) NULL,
  generationcodesuffix varchar(10) NULL,
  maidenname varchar(75) NULL,
  birthdate date NOT NULL,
  birthcity varchar(30) NULL,
  birthstateabbreviationdescriptorid int4 NULL,
  birthinternationalprovince varchar(150) NULL,
  birthcountrydescriptorid int4 NULL,
  dateenteredus date NULL,
  multiplebirthstatus bool NULL,
  birthsexdescriptorid int4 NULL,
  citizenshipstatusdescriptorid int4 NULL,
  personid varchar(32) NULL,
  sourcesystemdescriptorid int4 NULL,
  studentuniqueid varchar(32) NOT NULL,
  CONSTRAINT student_pk PRIMARY KEY (studentusi),
  CONSTRAINT fk_2a164d_citizenshipstatusdescriptor FOREIGN KEY (citizenshipstatusdescriptorid) REFERENCES citizenshipstatusdescriptor (citizenshipstatusdescriptorid),
  CONSTRAINT fk_2a164d_countrydescriptor FOREIGN KEY (birthcountrydescriptorid) REFERENCES countrydescriptor (countrydescriptorid),
--   CONSTRAINT fk_2a164d_person FOREIGN KEY (personid, sourcesystemdescriptorid) REFERENCES person (personid, sourcesystemdescriptorid),
  CONSTRAINT fk_2a164d_sexdescriptor FOREIGN KEY (birthsexdescriptorid) REFERENCES sexdescriptor (sexdescriptorid),
  CONSTRAINT fk_2a164d_stateabbreviationdescriptor FOREIGN KEY (birthstateabbreviationdescriptorid) REFERENCES stateabbreviationdescriptor (stateabbreviationdescriptorid)
) INHERITS (base);

CREATE INDEX fk_2a164d_citizenshipstatusdescriptor ON student USING btree (citizenshipstatusdescriptorid);

CREATE INDEX fk_2a164d_countrydescriptor ON student USING btree (birthcountrydescriptorid);

CREATE INDEX fk_2a164d_person ON student USING btree (personid, sourcesystemdescriptorid);

CREATE INDEX fk_2a164d_sexdescriptor ON student USING btree (birthsexdescriptorid);

CREATE INDEX fk_2a164d_stateabbreviationdescriptor ON student USING btree (birthstateabbreviationdescriptorid);

CREATE UNIQUE INDEX student_ui_studentuniqueid ON student USING btree (studentuniqueid);

CREATE UNIQUE INDEX ux_2a164d_id ON student USING btree (id);



CREATE TABLE staff (
  staffusi serial4 NOT NULL,
  personaltitleprefix varchar(30) NULL,
  firstname varchar(75) NOT NULL,
  middlename varchar(75) NULL,
  lastsurname varchar(75) NOT NULL,
  preferredfirstname varchar(75) NULL,
  preferredlastsurname varchar(75) NULL,
  generationcodesuffix varchar(10) NULL,
  maidenname varchar(75) NULL,
  sexdescriptorid int4 NULL,
  birthdate date NULL,
  hispaniclatinoethnicity bool NULL,
  oldethnicitydescriptorid int4 NULL,
  citizenshipstatusdescriptorid int4 NULL,
  highestcompletedlevelofeducationdescriptorid int4 NULL,
  yearsofpriorprofessionalexperience numeric(5, 2) NULL,
  yearsofpriorteachingexperience numeric(5, 2) NULL,
  loginid varchar(60) NULL,
  highlyqualifiedteacher bool NULL,
  personid varchar(32) NULL,
  sourcesystemdescriptorid int4 NULL,
  staffuniqueid varchar(32) NOT NULL,
  CONSTRAINT staff_pk PRIMARY KEY (staffusi),
  CONSTRAINT fk_681927_citizenshipstatusdescriptor FOREIGN KEY (citizenshipstatusdescriptorid) REFERENCES citizenshipstatusdescriptor (citizenshipstatusdescriptorid),
  CONSTRAINT fk_681927_levelofeducationdescriptor FOREIGN KEY (highestcompletedlevelofeducationdescriptorid) REFERENCES levelofeducationdescriptor (levelofeducationdescriptorid),
  CONSTRAINT fk_681927_oldethnicitydescriptor FOREIGN KEY (oldethnicitydescriptorid) REFERENCES oldethnicitydescriptor (oldethnicitydescriptorid),
--   CONSTRAINT fk_681927_person FOREIGN KEY (personid, sourcesystemdescriptorid) REFERENCES person (personid, sourcesystemdescriptorid),
  CONSTRAINT fk_681927_sexdescriptor FOREIGN KEY (sexdescriptorid) REFERENCES sexdescriptor (sexdescriptorid)
) INHERITS (base);

CREATE INDEX fk_681927_citizenshipstatusdescriptor ON staff USING btree (citizenshipstatusdescriptorid);

CREATE INDEX fk_681927_levelofeducationdescriptor ON staff USING btree (highestcompletedlevelofeducationdescriptorid);

CREATE INDEX fk_681927_oldethnicitydescriptor ON staff USING btree (oldethnicitydescriptorid);

CREATE INDEX fk_681927_person ON staff USING btree (personid, sourcesystemdescriptorid);

CREATE INDEX fk_681927_sexdescriptor ON staff USING btree (sexdescriptorid);

CREATE UNIQUE INDEX staff_ui_staffuniqueid ON staff USING btree (staffuniqueid);

CREATE UNIQUE INDEX ux_681927_id ON staff USING btree (id);



CREATE TABLE contact (
  contactusi SERIAL,
  contactuniqueid VARCHAR(32) NOT NULL,
  firstname VARCHAR(75) NOT NULL,
  genderidentity VARCHAR(60),
  generationcodesuffix VARCHAR(10),
  highestcompletedlevelofeducationdescriptorid INT,
  lastsurname VARCHAR(75) NOT NULL,
  loginid VARCHAR(60),
  maidenname VARCHAR(75),
  middlename VARCHAR(75),
  personaltitleprefix VARCHAR(30),
  personid VARCHAR(32),
  preferredfirstname VARCHAR(75),
  preferredlastsurname VARCHAR(75),
  sexdescriptorid INT,
  sourcesystemdescriptorid INT,
  CONSTRAINT contact_pk PRIMARY KEY (contactusi),
  -- Foreign Key Constraints (assuming referenced tables exist)
--   CONSTRAINT fk_contact_person FOREIGN KEY (personid, sourcesystemdescriptorid) REFERENCES person (personid, sourcesystemdescriptorid),
  CONSTRAINT fk_contact_sexdescriptor FOREIGN KEY (sexdescriptorid) REFERENCES sexdescriptor (sexdescriptorid),
  CONSTRAINT fk_contact_educationdescriptor FOREIGN KEY (highestcompletedlevelofeducationdescriptorid) REFERENCES levelofeducationdescriptor (levelofeducationdescriptorid)
) INHERITS (base);

-- Indexes
CREATE UNIQUE INDEX contact_ui_contactuniqueid ON contact (contactuniqueid);

CREATE UNIQUE INDEX contact_ui_id ON contact (id);

CREATE INDEX contact_idx_sexdescriptor ON contact (sexdescriptorid);

CREATE INDEX contact_idx_educationdescriptor ON contact (highestcompletedlevelofeducationdescriptorid);

CREATE INDEX contact_idx_person ON contact (personid, sourcesystemdescriptorid);


CREATE TABLE credential (
  credentialidentifier varchar(60) NOT NULL,
  stateofissuestateabbreviationdescriptorid int4 NOT NULL,
  effectivedate date NULL,
  expirationdate date NULL,
  credentialfielddescriptorid int4 NULL,
  issuancedate date NOT NULL,
  credentialtypedescriptorid int4 NOT NULL,
  teachingcredentialdescriptorid int4 NULL,
  teachingcredentialbasisdescriptorid int4 NULL,
  "namespace" varchar(255) NOT NULL,
  CONSTRAINT credential_pk PRIMARY KEY (
    credentialidentifier,
    stateofissuestateabbreviationdescriptorid
  ),
  CONSTRAINT fk_b1c42b_credentialfielddescriptor FOREIGN KEY (credentialfielddescriptorid) REFERENCES credentialfielddescriptor (credentialfielddescriptorid),
  CONSTRAINT fk_b1c42b_credentialtypedescriptor FOREIGN KEY (credentialtypedescriptorid) REFERENCES credentialtypedescriptor (credentialtypedescriptorid),
  CONSTRAINT fk_b1c42b_stateabbreviationdescriptor FOREIGN KEY (stateofissuestateabbreviationdescriptorid) REFERENCES stateabbreviationdescriptor (stateabbreviationdescriptorid),
  CONSTRAINT fk_b1c42b_teachingcredentialbasisdescriptor FOREIGN KEY (teachingcredentialbasisdescriptorid) REFERENCES teachingcredentialbasisdescriptor (teachingcredentialbasisdescriptorid),
  CONSTRAINT fk_b1c42b_teachingcredentialdescriptor FOREIGN KEY (teachingcredentialdescriptorid) REFERENCES teachingcredentialdescriptor (teachingcredentialdescriptorid)
) INHERITS (base);

CREATE INDEX fk_b1c42b_credentialfielddescriptor ON credential USING btree (credentialfielddescriptorid);

CREATE INDEX fk_b1c42b_credentialtypedescriptor ON credential USING btree (credentialtypedescriptorid);

CREATE INDEX fk_b1c42b_stateabbreviationdescriptor ON credential USING btree (stateofissuestateabbreviationdescriptorid);

CREATE INDEX fk_b1c42b_teachingcredentialbasisdescriptor ON credential USING btree (teachingcredentialbasisdescriptorid);

CREATE INDEX fk_b1c42b_teachingcredentialdescriptor ON credential USING btree (teachingcredentialdescriptorid);

CREATE UNIQUE INDEX ux_b1c42b_id ON credential USING btree (id);



-- Academic Structure Tables

CREATE TABLE calendar (
  calendarcode varchar(60) NOT NULL,
  schoolid int4 NOT NULL,
  schoolyear int2 NOT NULL,
  calendartypedescriptorid int4 NOT NULL,
  CONSTRAINT calendar_pk PRIMARY KEY (calendarcode, schoolid, schoolyear),
  CONSTRAINT fk_d5d0a3_calendartypedescriptor FOREIGN KEY (calendartypedescriptorid) REFERENCES calendartypedescriptor (calendartypedescriptorid),
  CONSTRAINT fk_d5d0a3_school FOREIGN KEY (schoolid) REFERENCES school (schoolid)
--   CONSTRAINT fk_d5d0a3_schoolyeartype FOREIGN KEY (schoolyear) REFERENCES schoolyeartype (schoolyear)
) INHERITS (base);

CREATE INDEX fk_d5d0a3_calendartypedescriptor ON calendar USING btree (calendartypedescriptorid);

CREATE INDEX fk_d5d0a3_school ON calendar USING btree (schoolid);

CREATE INDEX fk_d5d0a3_schoolyeartype ON calendar USING btree (schoolyear);

CREATE UNIQUE INDEX ux_d5d0a3_id ON calendar USING btree (id);


CREATE TABLE calendardate (
  calendarcode varchar(60) NOT NULL,
  "date" date NOT NULL,
  schoolid int4 NOT NULL,
  schoolyear int2 NOT NULL,
  CONSTRAINT calendardate_pk PRIMARY KEY (calendarcode, date, schoolid, schoolyear),
  CONSTRAINT fk_8a9a67_calendar FOREIGN KEY (calendarcode, schoolid, schoolyear) REFERENCES calendar (calendarcode, schoolid, schoolyear)
) INHERITS (base);

CREATE INDEX fk_8a9a67_calendar ON calendardate USING btree (calendarcode, schoolid, schoolyear);

CREATE UNIQUE INDEX ux_8a9a67_id ON calendardate USING btree (id);



CREATE TABLE "session" (
  schoolid int4 NOT NULL,
  schoolyear int2 NOT NULL,
  sessionname varchar(60) NOT NULL,
  begindate date NOT NULL,
  enddate date NOT NULL,
  termdescriptorid int4 NOT NULL,
  totalinstructionaldays int4 NOT NULL,
  CONSTRAINT session_pk PRIMARY KEY (schoolid, schoolyear, sessionname),
  CONSTRAINT fk_6959b4_school FOREIGN KEY (schoolid) REFERENCES school (schoolid),
--   CONSTRAINT fk_6959b4_schoolyeartype FOREIGN KEY (schoolyear) REFERENCES schoolyeartype (schoolyear),
  CONSTRAINT fk_6959b4_termdescriptor FOREIGN KEY (termdescriptorid) REFERENCES termdescriptor (termdescriptorid)
) INHERITS (base);

CREATE INDEX fk_6959b4_school ON session USING btree (schoolid);

CREATE INDEX fk_6959b4_schoolyeartype ON session USING btree (schoolyear);

CREATE INDEX fk_6959b4_termdescriptor ON session USING btree (termdescriptorid);

CREATE UNIQUE INDEX ux_6959b4_id ON session USING btree (id);


CREATE TABLE gradingperiod (
  gradingperioddescriptorid int4 NOT NULL,
  periodsequence int4 NOT NULL,
  schoolid int4 NOT NULL,
  schoolyear int2 NOT NULL,
  begindate date NOT NULL,
  enddate date NOT NULL,
  totalinstructionaldays int4 NOT NULL,
  CONSTRAINT gradingperiod_pk PRIMARY KEY (
    gradingperioddescriptorid,
    periodsequence,
    schoolid,
    schoolyear
  ),
  CONSTRAINT fk_5a18f9_gradingperioddescriptor FOREIGN KEY (gradingperioddescriptorid) REFERENCES gradingperioddescriptor (gradingperioddescriptorid),
  CONSTRAINT fk_5a18f9_school FOREIGN KEY (schoolid) REFERENCES school (schoolid)
--   CONSTRAINT fk_5a18f9_schoolyeartype FOREIGN KEY (schoolyear) REFERENCES schoolyeartype (schoolyear)
) INHERITS (base);

CREATE INDEX fk_5a18f9_gradingperioddescriptor ON gradingperiod USING btree (gradingperioddescriptorid);

CREATE INDEX fk_5a18f9_school ON gradingperiod USING btree (schoolid);

CREATE INDEX fk_5a18f9_schoolyeartype ON gradingperiod USING btree (schoolyear);

CREATE UNIQUE INDEX ux_5a18f9_id ON gradingperiod USING btree (id);


CREATE TABLE academicweek (
  schoolid int4 NOT NULL,
  weekidentifier varchar(80) NOT NULL,
  begindate date NOT NULL,
  enddate date NOT NULL,
  totalinstructionaldays int4 NOT NULL,
  CONSTRAINT academicweek_pk PRIMARY KEY (schoolid, weekidentifier),
  CONSTRAINT fk_a97956_school FOREIGN KEY (schoolid) REFERENCES school (schoolid)
) INHERITS (base);

CREATE INDEX fk_a97956_school ON academicweek USING btree (schoolid);

CREATE UNIQUE INDEX ux_a97956_id ON academicweek USING btree (id);


CREATE TABLE classperiod (
  classperiodname varchar(60) NOT NULL,
  schoolid int4 NOT NULL,
  officialattendanceperiod bool NULL,
  CONSTRAINT classperiod_pk PRIMARY KEY (classperiodname, schoolid),
  CONSTRAINT fk_01fe80_school FOREIGN KEY (schoolid) REFERENCES school (schoolid)
) INHERITS (base);

CREATE INDEX fk_01fe80_school ON classperiod USING btree (schoolid);

CREATE UNIQUE INDEX ux_01fe80_id ON classperiod USING btree (id);


CREATE TABLE bellschedule (
  bellschedulename varchar(60) NOT NULL,
  schoolid int4 NOT NULL,
  alternatedayname varchar(20) NULL,
  starttime time NULL,
  endtime time NULL,
  totalinstructionaltime int4 NULL,
  discriminator varchar(128) NULL,
  CONSTRAINT bellschedule_pk PRIMARY KEY (bellschedulename, schoolid),
  CONSTRAINT fk_9bbaf5_school FOREIGN KEY (schoolid) REFERENCES school (schoolid)
) INHERITS (base);

CREATE INDEX fk_9bbaf5_school ON bellschedule USING btree (schoolid);

CREATE UNIQUE INDEX ux_9bbaf5_id ON bellschedule USING btree (id);


-- Course and Section Tables

CREATE TABLE course (
  coursecode varchar(60) NOT NULL,
  educationorganizationid int4 NOT NULL,
  coursetitle varchar(60) NOT NULL,
  numberofparts int4 NOT NULL,
  academicsubjectdescriptorid int4 NULL,
  coursedescription varchar(1024) NULL,
  timerequiredforcompletion int4 NULL,
  datecourseadopted date NULL,
  highschoolcourserequirement bool NULL,
  coursegpaapplicabilitydescriptorid int4 NULL,
  coursedefinedbydescriptorid int4 NULL,
  minimumavailablecredits numeric(9, 3) NULL,
  minimumavailablecredittypedescriptorid int4 NULL,
  minimumavailablecreditconversion numeric(9, 2) NULL,
  maximumavailablecredits numeric(9, 3) NULL,
  maximumavailablecredittypedescriptorid int4 NULL,
  maximumavailablecreditconversion numeric(9, 2) NULL,
  careerpathwaydescriptorid int4 NULL,
  maxcompletionsforcredit int4 NULL,
  CONSTRAINT course_pk PRIMARY KEY (coursecode, educationorganizationid),
  CONSTRAINT fk_2096ce_academicsubjectdescriptor FOREIGN KEY (academicsubjectdescriptorid) REFERENCES academicsubjectdescriptor (academicsubjectdescriptorid),
  CONSTRAINT fk_2096ce_careerpathwaydescriptor FOREIGN KEY (careerpathwaydescriptorid) REFERENCES careerpathwaydescriptor (careerpathwaydescriptorid),
  CONSTRAINT fk_2096ce_coursedefinedbydescriptor FOREIGN KEY (coursedefinedbydescriptorid) REFERENCES coursedefinedbydescriptor (coursedefinedbydescriptorid),
  CONSTRAINT fk_2096ce_coursegpaapplicabilitydescriptor FOREIGN KEY (coursegpaapplicabilitydescriptorid) REFERENCES coursegpaapplicabilitydescriptor (coursegpaapplicabilitydescriptorid),
  CONSTRAINT fk_2096ce_credittypedescriptor FOREIGN KEY (minimumavailablecredittypedescriptorid) REFERENCES credittypedescriptor (credittypedescriptorid),
  CONSTRAINT fk_2096ce_credittypedescriptor1 FOREIGN KEY (maximumavailablecredittypedescriptorid) REFERENCES credittypedescriptor (credittypedescriptorid),
  CONSTRAINT fk_2096ce_educationorganization FOREIGN KEY (educationorganizationid) REFERENCES educationorganization (educationorganizationid)
) INHERITS (base);

CREATE INDEX fk_2096ce_academicsubjectdescriptor ON course USING btree (academicsubjectdescriptorid);

CREATE INDEX fk_2096ce_careerpathwaydescriptor ON course USING btree (careerpathwaydescriptorid);

CREATE INDEX fk_2096ce_coursedefinedbydescriptor ON course USING btree (coursedefinedbydescriptorid);

CREATE INDEX fk_2096ce_coursegpaapplicabilitydescriptor ON course USING btree (coursegpaapplicabilitydescriptorid);

CREATE INDEX fk_2096ce_credittypedescriptor ON course USING btree (minimumavailablecredittypedescriptorid);

CREATE INDEX fk_2096ce_credittypedescriptor1 ON course USING btree (maximumavailablecredittypedescriptorid);

CREATE INDEX fk_2096ce_educationorganization ON course USING btree (educationorganizationid);

CREATE UNIQUE INDEX ux_2096ce_id ON course USING btree (id);


CREATE TABLE courseoffering (
  localcoursecode varchar(60) NOT NULL,
  schoolid int4 NOT NULL,
  schoolyear int2 NOT NULL,
  sessionname varchar(60) NOT NULL,
  localcoursetitle varchar(60) NULL,
  instructionaltimeplanned int4 NULL,
  coursecode varchar(60) NOT NULL,
  educationorganizationid int4 NOT NULL,
  CONSTRAINT courseoffering_pk PRIMARY KEY (
    localcoursecode,
    schoolid,
    schoolyear,
    sessionname
  ),
  CONSTRAINT fk_0325c5_course FOREIGN KEY (coursecode, educationorganizationid) REFERENCES course (coursecode, educationorganizationid),
  CONSTRAINT fk_0325c5_school FOREIGN KEY (schoolid) REFERENCES school (schoolid),
  CONSTRAINT fk_0325c5_session FOREIGN KEY (schoolid, schoolyear, sessionname) REFERENCES "session" (schoolid, schoolyear, sessionname) ON UPDATE CASCADE
) INHERITS (base);

CREATE INDEX fk_0325c5_course ON courseoffering USING btree (coursecode, educationorganizationid);

CREATE INDEX fk_0325c5_school ON courseoffering USING btree (schoolid);

CREATE INDEX fk_0325c5_session ON courseoffering USING btree (schoolid, schoolyear, sessionname);

CREATE UNIQUE INDEX ux_0325c5_id ON courseoffering USING btree (id);


CREATE TABLE "section" (
  localcoursecode varchar(60) NOT NULL,
  schoolid int4 NOT NULL,
  schoolyear int2 NOT NULL,
  sectionidentifier varchar(255) NOT NULL,
  sessionname varchar(60) NOT NULL,
  sequenceofcourse int4 NULL,
  educationalenvironmentdescriptorid int4 NULL,
  mediumofinstructiondescriptorid int4 NULL,
  populationserveddescriptorid int4 NULL,
  availablecredits numeric(9, 3) NULL,
  availablecredittypedescriptorid int4 NULL,
  availablecreditconversion numeric(9, 2) NULL,
  instructionlanguagedescriptorid int4 NULL,
  locationschoolid int4 NULL,
  locationclassroomidentificationcode varchar(60) NULL,
  officialattendanceperiod bool NULL,
  sectionname varchar(100) NULL,
  CONSTRAINT section_pk PRIMARY KEY (
    localcoursecode,
    schoolid,
    schoolyear,
    sectionidentifier,
    sessionname
  ),
  CONSTRAINT fk_dfca5d_credittypedescriptor FOREIGN KEY (availablecredittypedescriptorid) REFERENCES credittypedescriptor (credittypedescriptorid),
  CONSTRAINT fk_dfca5d_educationalenvironmentdescriptor FOREIGN KEY (educationalenvironmentdescriptorid) REFERENCES educationalenvironmentdescriptor (educationalenvironmentdescriptorid),
  CONSTRAINT fk_dfca5d_languagedescriptor FOREIGN KEY (instructionlanguagedescriptorid) REFERENCES languagedescriptor (languagedescriptorid),
--   CONSTRAINT fk_dfca5d_location FOREIGN KEY (
--     locationclassroomidentificationcode,
--     locationschoolid
--   ) REFERENCES "location" (classroomidentificationcode, schoolid) ON UPDATE CASCADE,
  CONSTRAINT fk_dfca5d_mediumofinstructiondescriptor FOREIGN KEY (mediumofinstructiondescriptorid) REFERENCES mediumofinstructiondescriptor (mediumofinstructiondescriptorid),
  CONSTRAINT fk_dfca5d_populationserveddescriptor FOREIGN KEY (populationserveddescriptorid) REFERENCES populationserveddescriptor (populationserveddescriptorid),
  CONSTRAINT fk_dfca5d_school FOREIGN KEY (locationschoolid) REFERENCES school (schoolid),
  CONSTRAINT fk_section_courseoffering FOREIGN KEY (
    localcoursecode,
    schoolid,
    schoolyear,
    sessionname
  ) REFERENCES courseoffering (
    localcoursecode,
    schoolid,
    schoolyear,
    sessionname
  ) ON UPDATE CASCADE
) INHERITS (base);

CREATE INDEX fk_dfca5d_courseoffering ON section USING btree (
  localcoursecode,
  schoolid,
  schoolyear,
  sessionname
);

CREATE INDEX fk_dfca5d_credittypedescriptor ON section USING btree (availablecredittypedescriptorid);

CREATE INDEX fk_dfca5d_educationalenvironmentdescriptor ON section USING btree (educationalenvironmentdescriptorid);

CREATE INDEX fk_dfca5d_languagedescriptor ON section USING btree (instructionlanguagedescriptorid);

CREATE INDEX fk_dfca5d_location ON section USING btree (
  locationclassroomidentificationcode,
  locationschoolid
);

CREATE INDEX fk_dfca5d_mediumofinstructiondescriptor ON section USING btree (mediumofinstructiondescriptorid);

CREATE INDEX fk_dfca5d_populationserveddescriptor ON section USING btree (populationserveddescriptorid);

CREATE INDEX fk_dfca5d_school ON section USING btree (locationschoolid);

CREATE UNIQUE INDEX ux_dfca5d_id ON section USING btree (id);



-- Assessment Tables


CREATE TABLE assessment (
  assessmentidentifier varchar(60) NOT NULL,
  "namespace" varchar(255) NOT NULL,
  assessmenttitle varchar(255) NOT NULL,
  assessmentcategorydescriptorid int4 NULL,
  assessmentform varchar(60) NULL,
  assessmentversion int4 NULL,
  revisiondate date NULL,
  maxrawscore numeric(15, 5) NULL,
  nomenclature varchar(100) NULL,
  assessmentfamily varchar(60) NULL,
  educationorganizationid int4 NULL,
  adaptiveassessment bool NULL,
  discriminator varchar(128) NULL,
  CONSTRAINT assessment_pk PRIMARY KEY (assessmentidentifier, namespace),
  CONSTRAINT fk_7808ee_assessmentcategorydescriptor FOREIGN KEY (assessmentcategorydescriptorid) REFERENCES assessmentcategorydescriptor (assessmentcategorydescriptorid),
  CONSTRAINT fk_7808ee_educationorganization FOREIGN KEY (educationorganizationid) REFERENCES educationorganization (educationorganizationid)
) INHERITS (base);

CREATE INDEX fk_7808ee_assessmentcategorydescriptor ON assessment USING btree (assessmentcategorydescriptorid);

CREATE INDEX fk_7808ee_educationorganization ON assessment USING btree (educationorganizationid);

CREATE UNIQUE INDEX ux_7808ee_id ON assessment USING btree (id);


CREATE TABLE assessmentitem (
  assessmentidentifier varchar(60) NOT NULL,
  identificationcode varchar(60) NOT NULL,
  "namespace" varchar(255) NOT NULL,
  assessmentitemcategorydescriptorid int4 NULL,
  maxrawscore numeric(15, 5) NULL,
  itemtext varchar(1024) NULL,
  expectedtimeassessed varchar(30) NULL,
  nomenclature varchar(100) NULL,
  assessmentitemuri varchar(255) NULL,
  CONSTRAINT assessmentitem_pk PRIMARY KEY (
    assessmentidentifier,
    identificationcode,
    namespace
  ),
  CONSTRAINT fk_dc3dcf_assessment FOREIGN KEY (assessmentidentifier, "namespace") REFERENCES assessment (assessmentidentifier, "namespace"),
  CONSTRAINT fk_dc3dcf_assessmentitemcategorydescriptor FOREIGN KEY (assessmentitemcategorydescriptorid) REFERENCES assessmentitemcategorydescriptor (assessmentitemcategorydescriptorid)
) INHERITS (base);

CREATE INDEX fk_dc3dcf_assessment ON assessmentitem USING btree (assessmentidentifier, namespace);

CREATE INDEX fk_dc3dcf_assessmentitemcategorydescriptor ON assessmentitem USING btree (assessmentitemcategorydescriptorid);

CREATE UNIQUE INDEX ux_dc3dcf_id ON assessmentitem USING btree (id);




CREATE TABLE studentassessment (
  assessmentidentifier varchar(60) NOT NULL,
  "namespace" varchar(255) NOT NULL,
  studentassessmentidentifier varchar(60) NOT NULL,
  studentusi int4 NOT NULL,
  administrationdate timestamp NULL,
  administrationenddate timestamp NULL,
  serialnumber varchar(60) NULL,
  administrationlanguagedescriptorid int4 NULL,
  administrationenvironmentdescriptorid int4 NULL,
  retestindicatordescriptorid int4 NULL,
  reasonnottesteddescriptorid int4 NULL,
  whenassessedgradeleveldescriptorid int4 NULL,
  eventcircumstancedescriptorid int4 NULL,
  eventdescription varchar(1024) NULL,
  schoolyear int2 NULL,
  platformtypedescriptorid int4 NULL,
  assessedminutes int4 NULL,
  CONSTRAINT studentassessment_pk PRIMARY KEY (
    assessmentidentifier,
    namespace,
    studentassessmentidentifier,
    studentusi
  ),
  CONSTRAINT fk_ee3b2a_administrationenvironmentdescriptor FOREIGN KEY (administrationenvironmentdescriptorid) REFERENCES administrationenvironmentdescriptor (administrationenvironmentdescriptorid),
  CONSTRAINT fk_ee3b2a_assessment FOREIGN KEY (assessmentidentifier, "namespace") REFERENCES assessment (assessmentidentifier, "namespace"),
  CONSTRAINT fk_ee3b2a_eventcircumstancedescriptor FOREIGN KEY (eventcircumstancedescriptorid) REFERENCES eventcircumstancedescriptor (eventcircumstancedescriptorid),
  CONSTRAINT fk_ee3b2a_gradeleveldescriptor FOREIGN KEY (whenassessedgradeleveldescriptorid) REFERENCES gradeleveldescriptor (gradeleveldescriptorid),
  CONSTRAINT fk_ee3b2a_languagedescriptor FOREIGN KEY (administrationlanguagedescriptorid) REFERENCES languagedescriptor (languagedescriptorid),
  CONSTRAINT fk_ee3b2a_platformtypedescriptor FOREIGN KEY (platformtypedescriptorid) REFERENCES platformtypedescriptor (platformtypedescriptorid),
  CONSTRAINT fk_ee3b2a_reasonnottesteddescriptor FOREIGN KEY (reasonnottesteddescriptorid) REFERENCES reasonnottesteddescriptor (reasonnottesteddescriptorid),
  CONSTRAINT fk_ee3b2a_retestindicatordescriptor FOREIGN KEY (retestindicatordescriptorid) REFERENCES retestindicatordescriptor (retestindicatordescriptorid),
--   CONSTRAINT fk_ee3b2a_schoolyeartype FOREIGN KEY (schoolyear) REFERENCES schoolyeartype (schoolyear),
  CONSTRAINT fk_ee3b2a_student FOREIGN KEY (studentusi) REFERENCES student (studentusi)
) INHERITS (base);

CREATE INDEX fk_ee3b2a_administrationenvironmentdescriptor ON studentassessment USING btree (administrationenvironmentdescriptorid);

CREATE INDEX fk_ee3b2a_assessment ON studentassessment USING btree (assessmentidentifier, namespace);

CREATE INDEX fk_ee3b2a_eventcircumstancedescriptor ON studentassessment USING btree (eventcircumstancedescriptorid);

CREATE INDEX fk_ee3b2a_gradeleveldescriptor ON studentassessment USING btree (whenassessedgradeleveldescriptorid);

CREATE INDEX fk_ee3b2a_languagedescriptor ON studentassessment USING btree (administrationlanguagedescriptorid);

CREATE INDEX fk_ee3b2a_platformtypedescriptor ON studentassessment USING btree (platformtypedescriptorid);

CREATE INDEX fk_ee3b2a_reasonnottesteddescriptor ON studentassessment USING btree (reasonnottesteddescriptorid);

CREATE INDEX fk_ee3b2a_retestindicatordescriptor ON studentassessment USING btree (retestindicatordescriptorid);

CREATE INDEX fk_ee3b2a_schoolyeartype ON studentassessment USING btree (schoolyear);

CREATE INDEX fk_ee3b2a_student ON studentassessment USING btree (studentusi);

CREATE UNIQUE INDEX ux_ee3b2a_id ON studentassessment USING btree (id);



-- Association Tables


CREATE TABLE staffschoolassociation (
  programassignmentdescriptorid int4 NOT NULL,
  schoolid int4 NOT NULL,
  staffusi int4 NOT NULL,
  calendarcode varchar(60) NULL,
  schoolyear int2 NULL,
  CONSTRAINT staffschoolassociation_pk PRIMARY KEY (programassignmentdescriptorid, schoolid, staffusi),
  CONSTRAINT fk_ce2080_calendar FOREIGN KEY (calendarcode, schoolid, schoolyear) REFERENCES calendar (calendarcode, schoolid, schoolyear),
  CONSTRAINT fk_ce2080_programassignmentdescriptor FOREIGN KEY (programassignmentdescriptorid) REFERENCES programassignmentdescriptor (programassignmentdescriptorid),
  CONSTRAINT fk_ce2080_school FOREIGN KEY (schoolid) REFERENCES school (schoolid),
--   CONSTRAINT fk_ce2080_schoolyeartype FOREIGN KEY (schoolyear) REFERENCES schoolyeartype (schoolyear),
  CONSTRAINT fk_ce2080_staff FOREIGN KEY (staffusi) REFERENCES staff (staffusi)
) INHERITS (base);

CREATE INDEX fk_ce2080_calendar ON staffschoolassociation USING btree (calendarcode, schoolid, schoolyear);

CREATE INDEX fk_ce2080_programassignmentdescriptor ON staffschoolassociation USING btree (programassignmentdescriptorid);

CREATE INDEX fk_ce2080_school ON staffschoolassociation USING btree (schoolid);

CREATE INDEX fk_ce2080_schoolyeartype ON staffschoolassociation USING btree (schoolyear);

CREATE INDEX fk_ce2080_staff ON staffschoolassociation USING btree (staffusi);

CREATE UNIQUE INDEX ux_ce2080_id ON staffschoolassociation USING btree (id);

CREATE TABLE staffsectionassociation (
  localcoursecode varchar(60) NOT NULL,
  schoolid int4 NOT NULL,
  schoolyear int2 NOT NULL,
  sectionidentifier varchar(255) NOT NULL,
  sessionname varchar(60) NOT NULL,
  staffusi int4 NOT NULL,
  classroompositiondescriptorid int4 NOT NULL,
  begindate date NULL,
  enddate date NULL,
  highlyqualifiedteacher bool NULL,
  teacherstudentdatalinkexclusion bool NULL,
  percentagecontribution numeric(5, 4) NULL,
  CONSTRAINT staffsectionassociation_pk PRIMARY KEY (
    localcoursecode,
    schoolid,
    schoolyear,
    sectionidentifier,
    sessionname,
    staffusi
  ),
  CONSTRAINT fk_515cb5_classroompositiondescriptor FOREIGN KEY (classroompositiondescriptorid) REFERENCES classroompositiondescriptor (classroompositiondescriptorid),
  CONSTRAINT fk_515cb5_section FOREIGN KEY (
    localcoursecode,
    schoolid,
    schoolyear,
    sectionidentifier,
    sessionname
  ) REFERENCES "section" (
    localcoursecode,
    schoolid,
    schoolyear,
    sectionidentifier,
    sessionname
  ) ON UPDATE CASCADE,
  CONSTRAINT fk_515cb5_staff FOREIGN KEY (staffusi) REFERENCES staff (staffusi)
) INHERITS (base);

CREATE INDEX fk_515cb5_classroompositiondescriptor ON staffsectionassociation USING btree (classroompositiondescriptorid);

CREATE INDEX fk_515cb5_section ON staffsectionassociation USING btree (
  localcoursecode,
  schoolid,
  schoolyear,
  sectionidentifier,
  sessionname
);

CREATE INDEX fk_515cb5_staff ON staffsectionassociation USING btree (staffusi);

CREATE UNIQUE INDEX ux_515cb5_id ON staffsectionassociation USING btree (id);





CREATE TABLE studentcontactassociation (
  contactusi int NOT NULL,
  studentusi int NOT NULL,
  contactpriority int NULL,
  contactrestrictions varchar(250) NULL,
  emergencycontactstatus boolean NULL,
  legalguardian boolean NULL,
  liveswith boolean NULL,
  primarycontactstatus boolean NULL,
  relationdescriptorid int NULL,
  CONSTRAINT studentcontactassociation_pk PRIMARY KEY (contactusi, studentusi),
  CONSTRAINT fk_studentcontactassociation_student FOREIGN KEY (studentusi) REFERENCES student (studentusi),
  CONSTRAINT fk_studentcontactassociation_contact FOREIGN KEY (contactusi) REFERENCES contact (contactusi),
  CONSTRAINT fk_studentcontactassociation_relationdescriptor FOREIGN KEY (relationdescriptorid) REFERENCES relationdescriptor (relationdescriptorid)
) INHERITS (base);

-- Indexes
CREATE INDEX fk_studentcontactassociation_student ON studentcontactassociation USING btree (studentusi);

CREATE INDEX fk_studentcontactassociation_contact ON studentcontactassociation USING btree (contactusi);

CREATE INDEX fk_studentcontactassociation_relationdescriptor ON studentcontactassociation USING btree (relationdescriptorid);

CREATE UNIQUE INDEX ux_studentcontactassociation_id ON studentcontactassociation USING btree (id);




CREATE TABLE studentsectionassociation (
  begindate date NOT NULL,
  localcoursecode varchar(60) NOT NULL,
  schoolid int4 NOT NULL,
  schoolyear int2 NOT NULL,
  sectionidentifier varchar(255) NOT NULL,
  sessionname varchar(60) NOT NULL,
  studentusi int4 NOT NULL,
  enddate date NULL,
  homeroomindicator bool NULL,
  repeatidentifierdescriptorid int4 NULL,
  teacherstudentdatalinkexclusion bool NULL,
  attemptstatusdescriptorid int4 NULL,
  CONSTRAINT studentsectionassociation_pk PRIMARY KEY (
    begindate,
    localcoursecode,
    schoolid,
    schoolyear,
    sectionidentifier,
    sessionname,
    studentusi
  ),
  CONSTRAINT fk_39aa3c_attemptstatusdescriptor FOREIGN KEY (attemptstatusdescriptorid) REFERENCES attemptstatusdescriptor (attemptstatusdescriptorid),
  CONSTRAINT fk_39aa3c_repeatidentifierdescriptor FOREIGN KEY (repeatidentifierdescriptorid) REFERENCES repeatidentifierdescriptor (repeatidentifierdescriptorid),
  CONSTRAINT fk_39aa3c_section FOREIGN KEY (
    localcoursecode,
    schoolid,
    schoolyear,
    sectionidentifier,
    sessionname
  ) REFERENCES "section" (
    localcoursecode,
    schoolid,
    schoolyear,
    sectionidentifier,
    sessionname
  ) ON UPDATE CASCADE,
  CONSTRAINT fk_39aa3c_student FOREIGN KEY (studentusi) REFERENCES student (studentusi)
) INHERITS (base);

CREATE INDEX fk_39aa3c_attemptstatusdescriptor ON studentsectionassociation USING btree (attemptstatusdescriptorid);

CREATE INDEX fk_39aa3c_repeatidentifierdescriptor ON studentsectionassociation USING btree (repeatidentifierdescriptorid);

CREATE INDEX fk_39aa3c_section ON studentsectionassociation USING btree (
  localcoursecode,
  schoolid,
  schoolyear,
  sectionidentifier,
  sessionname
);

CREATE INDEX fk_39aa3c_student ON studentsectionassociation USING btree (studentusi);

CREATE UNIQUE INDEX ux_39aa3c_id ON studentsectionassociation USING btree (id);

CREATE TABLE studentschoolassociation (
  entrydate date NOT NULL,
  schoolid int4 NOT NULL,
  studentusi int4 NOT NULL,
  primaryschool bool NULL,
  entrygradeleveldescriptorid int4 NOT NULL,
  entrygradelevelreasondescriptorid int4 NULL,
  entrytypedescriptorid int4 NULL,
  repeatgradeindicator bool NULL,
  classofschoolyear int2 NULL,
  schoolchoicetransfer bool NULL,
  exitwithdrawdate date NULL,
  exitwithdrawtypedescriptorid int4 NULL,
  residencystatusdescriptorid int4 NULL,
  graduationplantypedescriptorid int4 NULL,
  educationorganizationid int4 NULL,
  graduationschoolyear int2 NULL,
  employedwhileenrolled bool NULL,
  calendarcode varchar(60) NULL,
  schoolyear int2 NULL,
  fulltimeequivalency numeric(5, 4) NULL,
  termcompletionindicator bool NULL,
  CONSTRAINT studentschoolassociation_pk PRIMARY KEY (entrydate, schoolid, studentusi),
  CONSTRAINT fk_857b52_calendar FOREIGN KEY (calendarcode, schoolid, schoolyear) REFERENCES calendar (calendarcode, schoolid, schoolyear),
  CONSTRAINT fk_857b52_entrygradelevelreasondescriptor FOREIGN KEY (entrygradelevelreasondescriptorid) REFERENCES entrygradelevelreasondescriptor (entrygradelevelreasondescriptorid),
  CONSTRAINT fk_857b52_entrytypedescriptor FOREIGN KEY (entrytypedescriptorid) REFERENCES entrytypedescriptor (entrytypedescriptorid),
  CONSTRAINT fk_857b52_exitwithdrawtypedescriptor FOREIGN KEY (exitwithdrawtypedescriptorid) REFERENCES exitwithdrawtypedescriptor (exitwithdrawtypedescriptorid),
  CONSTRAINT fk_857b52_gradeleveldescriptor FOREIGN KEY (entrygradeleveldescriptorid) REFERENCES gradeleveldescriptor (gradeleveldescriptorid),
--   CONSTRAINT fk_857b52_graduationplan FOREIGN KEY (
--     educationorganizationid,
--     graduationplantypedescriptorid,
--     graduationschoolyear
--   ) REFERENCES graduationplan (
--     educationorganizationid,
--     graduationplantypedescriptorid,
--     graduationschoolyear
--   ),
  CONSTRAINT fk_857b52_residencystatusdescriptor FOREIGN KEY (residencystatusdescriptorid) REFERENCES residencystatusdescriptor (residencystatusdescriptorid),
  CONSTRAINT fk_857b52_school FOREIGN KEY (schoolid) REFERENCES school (schoolid),
--   CONSTRAINT fk_857b52_schoolyeartype FOREIGN KEY (schoolyear) REFERENCES schoolyeartype (schoolyear),
--   CONSTRAINT fk_857b52_schoolyeartype1 FOREIGN KEY (classofschoolyear) REFERENCES schoolyeartype (schoolyear),
  CONSTRAINT fk_857b52_student FOREIGN KEY (studentusi) REFERENCES student (studentusi)
) INHERITS (base);

CREATE INDEX fk_857b52_calendar ON studentschoolassociation USING btree (calendarcode, schoolid, schoolyear);

CREATE INDEX fk_857b52_entrygradelevelreasondescriptor ON studentschoolassociation USING btree (entrygradelevelreasondescriptorid);

CREATE INDEX fk_857b52_entrytypedescriptor ON studentschoolassociation USING btree (entrytypedescriptorid);

CREATE INDEX fk_857b52_exitwithdrawtypedescriptor ON studentschoolassociation USING btree (exitwithdrawtypedescriptorid);

CREATE INDEX fk_857b52_gradeleveldescriptor ON studentschoolassociation USING btree (entrygradeleveldescriptorid);

CREATE INDEX fk_857b52_graduationplan ON studentschoolassociation USING btree (
  educationorganizationid,
  graduationplantypedescriptorid,
  graduationschoolyear
);

CREATE INDEX fk_857b52_residencystatusdescriptor ON studentschoolassociation USING btree (residencystatusdescriptorid);

CREATE INDEX fk_857b52_school ON studentschoolassociation USING btree (schoolid);

CREATE INDEX fk_857b52_schoolyeartype ON studentschoolassociation USING btree (schoolyear);

CREATE INDEX fk_857b52_schoolyeartype1 ON studentschoolassociation USING btree (classofschoolyear);

CREATE INDEX fk_857b52_student ON studentschoolassociation USING btree (studentusi);

CREATE UNIQUE INDEX ux_857b52_id ON studentschoolassociation USING btree (id);


-- Academic Record Tables


CREATE TABLE studentacademicrecord (
  educationorganizationid int4 NOT NULL,
  schoolyear int2 NOT NULL,
  studentusi int4 NOT NULL,
  termdescriptorid int4 NOT NULL,
  cumulativeearnedcredits numeric(9, 3) NULL,
  cumulativeearnedcredittypedescriptorid int4 NULL,
  cumulativeearnedcreditconversion numeric(9, 2) NULL,
  cumulativeattemptedcredits numeric(9, 3) NULL,
  cumulativeattemptedcredittypedescriptorid int4 NULL,
  cumulativeattemptedcreditconversion numeric(9, 2) NULL,
  cumulativegradepointsearned numeric(18, 4) NULL,
  cumulativegradepointaverage numeric(18, 4) NULL,
  gradevaluequalifier varchar(80) NULL,
  projectedgraduationdate date NULL,
  sessionearnedcredits numeric(9, 3) NULL,
  sessionearnedcredittypedescriptorid int4 NULL,
  sessionearnedcreditconversion numeric(9, 2) NULL,
  sessionattemptedcredits numeric(9, 3) NULL,
  sessionattemptedcredittypedescriptorid int4 NULL,
  sessionattemptedcreditconversion numeric(9, 2) NULL,
  sessiongradepointsearned numeric(18, 4) NULL,
  sessiongradepointaverage numeric(18, 4) NULL,
  CONSTRAINT studentacademicrecord_pk PRIMARY KEY (
    educationorganizationid,
    schoolyear,
    studentusi,
    termdescriptorid
  ),
  CONSTRAINT fk_0ff8d6_credittypedescriptor FOREIGN KEY (cumulativeearnedcredittypedescriptorid) REFERENCES credittypedescriptor (credittypedescriptorid),
  CONSTRAINT fk_0ff8d6_credittypedescriptor1 FOREIGN KEY (cumulativeattemptedcredittypedescriptorid) REFERENCES credittypedescriptor (credittypedescriptorid),
  CONSTRAINT fk_0ff8d6_credittypedescriptor2 FOREIGN KEY (sessionearnedcredittypedescriptorid) REFERENCES credittypedescriptor (credittypedescriptorid),
  CONSTRAINT fk_0ff8d6_credittypedescriptor3 FOREIGN KEY (sessionattemptedcredittypedescriptorid) REFERENCES credittypedescriptor (credittypedescriptorid),
  CONSTRAINT fk_0ff8d6_educationorganization FOREIGN KEY (educationorganizationid) REFERENCES educationorganization (educationorganizationid),
--   CONSTRAINT fk_0ff8d6_schoolyeartype FOREIGN KEY (schoolyear) REFERENCES schoolyeartype (schoolyear),
  CONSTRAINT fk_0ff8d6_student FOREIGN KEY (studentusi) REFERENCES student (studentusi),
  CONSTRAINT fk_0ff8d6_termdescriptor FOREIGN KEY (termdescriptorid) REFERENCES termdescriptor (termdescriptorid)
) INHERITS (base);

CREATE INDEX fk_0ff8d6_credittypedescriptor ON studentacademicrecord USING btree (cumulativeearnedcredittypedescriptorid);

CREATE INDEX fk_0ff8d6_credittypedescriptor1 ON studentacademicrecord USING btree (cumulativeattemptedcredittypedescriptorid);

CREATE INDEX fk_0ff8d6_credittypedescriptor2 ON studentacademicrecord USING btree (sessionearnedcredittypedescriptorid);

CREATE INDEX fk_0ff8d6_credittypedescriptor3 ON studentacademicrecord USING btree (sessionattemptedcredittypedescriptorid);

CREATE INDEX fk_0ff8d6_educationorganization ON studentacademicrecord USING btree (educationorganizationid);

CREATE INDEX fk_0ff8d6_schoolyeartype ON studentacademicrecord USING btree (schoolyear);

CREATE INDEX fk_0ff8d6_student ON studentacademicrecord USING btree (studentusi);

CREATE INDEX fk_0ff8d6_termdescriptor ON studentacademicrecord USING btree (termdescriptorid);

CREATE UNIQUE INDEX ux_0ff8d6_id ON studentacademicrecord USING btree (id);

CREATE TABLE coursetranscript (
  courseattemptresultdescriptorid int4 NOT NULL,
  coursecode varchar(60) NOT NULL,
  courseeducationorganizationid int4 NOT NULL,
  educationorganizationid int4 NOT NULL,
  schoolyear int2 NOT NULL,
  studentusi int4 NOT NULL,
  termdescriptorid int4 NOT NULL,
  attemptedcredits numeric(9, 3) NULL,
  attemptedcredittypedescriptorid int4 NULL,
  attemptedcreditconversion numeric(9, 2) NULL,
  earnedcredits numeric(9, 3) NOT NULL,
  earnedcredittypedescriptorid int4 NULL,
  earnedcreditconversion numeric(9, 2) NULL,
  whentakengradeleveldescriptorid int4 NULL,
  methodcreditearneddescriptorid int4 NULL,
  finallettergradeearned varchar(20) NULL,
  finalnumericgradeearned numeric(9, 2) NULL,
  courserepeatcodedescriptorid int4 NULL,
  coursetitle varchar(60) NULL,
  alternativecoursetitle varchar(60) NULL,
  alternativecoursecode varchar(60) NULL,
  externaleducationorganizationid int4 NULL,
  externaleducationorganizationnameofinstitution varchar(75) NULL,
  assigningorganizationidentificationcode varchar(60) NULL,
  coursecatalogurl varchar(255) NULL,
  CONSTRAINT coursetranscript_pk PRIMARY KEY (
    courseattemptresultdescriptorid,
    coursecode,
    courseeducationorganizationid,
    educationorganizationid,
    schoolyear,
    studentusi,
    termdescriptorid
  ),
  CONSTRAINT fk_6acf2b_course FOREIGN KEY (coursecode, courseeducationorganizationid) REFERENCES course (coursecode, educationorganizationid),
  CONSTRAINT fk_6acf2b_courseattemptresultdescriptor FOREIGN KEY (courseattemptresultdescriptorid) REFERENCES courseattemptresultdescriptor (courseattemptresultdescriptorid),
  CONSTRAINT fk_6acf2b_courserepeatcodedescriptor FOREIGN KEY (courserepeatcodedescriptorid) REFERENCES courserepeatcodedescriptor (courserepeatcodedescriptorid),
  CONSTRAINT fk_6acf2b_credittypedescriptor FOREIGN KEY (attemptedcredittypedescriptorid) REFERENCES credittypedescriptor (credittypedescriptorid),
  CONSTRAINT fk_6acf2b_credittypedescriptor1 FOREIGN KEY (earnedcredittypedescriptorid) REFERENCES credittypedescriptor (credittypedescriptorid),
  CONSTRAINT fk_6acf2b_educationorganization FOREIGN KEY (externaleducationorganizationid) REFERENCES educationorganization (educationorganizationid),
  CONSTRAINT fk_6acf2b_gradeleveldescriptor FOREIGN KEY (whentakengradeleveldescriptorid) REFERENCES gradeleveldescriptor (gradeleveldescriptorid),
  CONSTRAINT fk_6acf2b_methodcreditearneddescriptor FOREIGN KEY (methodcreditearneddescriptorid) REFERENCES methodcreditearneddescriptor (methodcreditearneddescriptorid),
  CONSTRAINT fk_6acf2b_studentacademicrecord FOREIGN KEY (
    educationorganizationid,
    schoolyear,
    studentusi,
    termdescriptorid
  ) REFERENCES studentacademicrecord (
    educationorganizationid,
    schoolyear,
    studentusi,
    termdescriptorid
  )
) INHERITS (base);

CREATE INDEX fk_6acf2b_course ON coursetranscript USING btree (coursecode, courseeducationorganizationid);

CREATE INDEX fk_6acf2b_courseattemptresultdescriptor ON coursetranscript USING btree (courseattemptresultdescriptorid);

CREATE INDEX fk_6acf2b_courserepeatcodedescriptor ON coursetranscript USING btree (courserepeatcodedescriptorid);

CREATE INDEX fk_6acf2b_credittypedescriptor ON coursetranscript USING btree (attemptedcredittypedescriptorid);

CREATE INDEX fk_6acf2b_credittypedescriptor1 ON coursetranscript USING btree (earnedcredittypedescriptorid);

CREATE INDEX fk_6acf2b_educationorganization ON coursetranscript USING btree (externaleducationorganizationid);

CREATE INDEX fk_6acf2b_gradeleveldescriptor ON coursetranscript USING btree (whentakengradeleveldescriptorid);

CREATE INDEX fk_6acf2b_methodcreditearneddescriptor ON coursetranscript USING btree (methodcreditearneddescriptorid);

CREATE INDEX fk_6acf2b_studentacademicrecord ON coursetranscript USING btree (
  educationorganizationid,
  schoolyear,
  studentusi,
  termdescriptorid
);

CREATE UNIQUE INDEX ux_6acf2b_id ON coursetranscript USING btree (id);



-- Attendance Tables


CREATE TABLE studentschoolattendanceevent (
  attendanceeventcategorydescriptorid int4 NOT NULL,
  eventdate date NOT NULL,
  schoolid int4 NOT NULL,
  schoolyear int2 NOT NULL,
  sessionname varchar(60) NOT NULL,
  studentusi int4 NOT NULL,
  attendanceeventreason varchar(255) NULL,
  educationalenvironmentdescriptorid int4 NULL,
  eventduration numeric(3, 2) NULL,
  schoolattendanceduration int4 NULL,
  arrivaltime time NULL,
  departuretime time NULL,
  CONSTRAINT studentschoolattendanceevent_pk PRIMARY KEY (
    attendanceeventcategorydescriptorid,
    eventdate,
    schoolid,
    schoolyear,
    sessionname,
    studentusi
  ),
  CONSTRAINT fk_78fd7f_attendanceeventcategorydescriptor FOREIGN KEY (attendanceeventcategorydescriptorid) REFERENCES attendanceeventcategorydescriptor (attendanceeventcategorydescriptorid),
  CONSTRAINT fk_78fd7f_educationalenvironmentdescriptor FOREIGN KEY (educationalenvironmentdescriptorid) REFERENCES educationalenvironmentdescriptor (educationalenvironmentdescriptorid),
  CONSTRAINT fk_78fd7f_school FOREIGN KEY (schoolid) REFERENCES school (schoolid),
  CONSTRAINT fk_78fd7f_session FOREIGN KEY (schoolid, schoolyear, sessionname) REFERENCES "session" (schoolid, schoolyear, sessionname) ON UPDATE CASCADE,
  CONSTRAINT fk_78fd7f_student FOREIGN KEY (studentusi) REFERENCES student (studentusi)
) INHERITS (base);

CREATE INDEX fk_78fd7f_attendanceeventcategorydescriptor ON studentschoolattendanceevent USING btree (attendanceeventcategorydescriptorid);

CREATE INDEX fk_78fd7f_educationalenvironmentdescriptor ON studentschoolattendanceevent USING btree (educationalenvironmentdescriptorid);

CREATE INDEX fk_78fd7f_school ON studentschoolattendanceevent USING btree (schoolid);

CREATE INDEX fk_78fd7f_session ON studentschoolattendanceevent USING btree (schoolid, schoolyear, sessionname);

CREATE INDEX fk_78fd7f_student ON studentschoolattendanceevent USING btree (studentusi);

CREATE UNIQUE INDEX ux_78fd7f_id ON studentschoolattendanceevent USING btree (id);

CREATE TABLE studentsectionattendanceevent (
  attendanceeventcategorydescriptorid int4 NOT NULL,
  eventdate date NOT NULL,
  localcoursecode varchar(60) NOT NULL,
  schoolid int4 NOT NULL,
  schoolyear int2 NOT NULL,
  sectionidentifier varchar(255) NOT NULL,
  sessionname varchar(60) NOT NULL,
  studentusi int4 NOT NULL,
  attendanceeventreason varchar(255) NULL,
  educationalenvironmentdescriptorid int4 NULL,
  eventduration numeric(3, 2) NULL,
  sectionattendanceduration int4 NULL,
  arrivaltime time NULL,
  departuretime time NULL,
  CONSTRAINT studentsectionattendanceevent_pk PRIMARY KEY (
    attendanceeventcategorydescriptorid,
    eventdate,
    localcoursecode,
    schoolid,
    schoolyear,
    sectionidentifier,
    sessionname,
    studentusi
  ),
  CONSTRAINT fk_61b087_attendanceeventcategorydescriptor FOREIGN KEY (attendanceeventcategorydescriptorid) REFERENCES attendanceeventcategorydescriptor (attendanceeventcategorydescriptorid),
  CONSTRAINT fk_61b087_educationalenvironmentdescriptor FOREIGN KEY (educationalenvironmentdescriptorid) REFERENCES educationalenvironmentdescriptor (educationalenvironmentdescriptorid),
  CONSTRAINT fk_61b087_section FOREIGN KEY (
    localcoursecode,
    schoolid,
    schoolyear,
    sectionidentifier,
    sessionname
  ) REFERENCES "section" (
    localcoursecode,
    schoolid,
    schoolyear,
    sectionidentifier,
    sessionname
  ) ON UPDATE CASCADE,
  CONSTRAINT fk_61b087_student FOREIGN KEY (studentusi) REFERENCES student (studentusi)
) INHERITS (base);

CREATE INDEX fk_61b087_attendanceeventcategorydescriptor ON studentsectionattendanceevent USING btree (attendanceeventcategorydescriptorid);

CREATE INDEX fk_61b087_educationalenvironmentdescriptor ON studentsectionattendanceevent USING btree (educationalenvironmentdescriptorid);

CREATE INDEX fk_61b087_section ON studentsectionattendanceevent USING btree (
  localcoursecode,
  schoolid,
  schoolyear,
  sectionidentifier,
  sessionname
);

CREATE INDEX fk_61b087_student ON studentsectionattendanceevent USING btree (studentusi);

CREATE UNIQUE INDEX ux_61b087_id ON studentsectionattendanceevent USING btree (id);


-- Grading Tables


CREATE TABLE gradebookentry (
  gradebookentryidentifier varchar(60) NOT NULL,
  "namespace" varchar(255) NOT NULL,
  sourcesectionidentifier varchar(255) NOT NULL,
  sectionidentifier varchar(255) NULL,
  localcoursecode varchar(60) NULL,
  sessionname varchar(60) NULL,
  schoolid int4 NULL,
  dateassigned date NOT NULL,
  title varchar(100) NOT NULL,
  description varchar(1024) NULL,
  duedate date NULL,
  duetime time NULL,
  gradebookentrytypedescriptorid int4 NULL,
  maxpoints numeric(9, 2) NULL,
  gradingperioddescriptorid int4 NULL,
  periodsequence int4 NULL,
  schoolyear int2 NULL,
  CONSTRAINT gradebookentry_pk PRIMARY KEY (gradebookentryidentifier, namespace),
  CONSTRAINT fk_466cfa_gradebookentrytypedescriptor FOREIGN KEY (gradebookentrytypedescriptorid) REFERENCES gradebookentrytypedescriptor (gradebookentrytypedescriptorid),
  CONSTRAINT fk_466cfa_gradingperiod FOREIGN KEY (
    gradingperioddescriptorid,
    periodsequence,
    schoolid,
    schoolyear
  ) REFERENCES gradingperiod (
    gradingperioddescriptorid,
    periodsequence,
    schoolid,
    schoolyear
  ),
  CONSTRAINT fk_466cfa_section FOREIGN KEY (
    localcoursecode,
    schoolid,
    schoolyear,
    sectionidentifier,
    sessionname
  ) REFERENCES "section" (
    localcoursecode,
    schoolid,
    schoolyear,
    sectionidentifier,
    sessionname
  ) ON UPDATE CASCADE
) INHERITS (base);

CREATE INDEX fk_466cfa_gradebookentrytypedescriptor ON gradebookentry USING btree (gradebookentrytypedescriptorid);

CREATE INDEX fk_466cfa_gradingperiod ON gradebookentry USING btree (
  gradingperioddescriptorid,
  periodsequence,
  schoolid,
  schoolyear
);

CREATE INDEX fk_466cfa_section ON gradebookentry USING btree (
  localcoursecode,
  schoolid,
  schoolyear,
  sectionidentifier,
  sessionname
);

CREATE UNIQUE INDEX ux_466cfa_id ON gradebookentry USING btree (id);

CREATE TABLE studentgradebookentry (
  gradebookentryidentifier varchar(60) NOT NULL,
  "namespace" varchar(255) NOT NULL,
  studentusi int4 NOT NULL,
  competencyleveldescriptorid int4 NULL,
  datefulfilled date NULL,
  timefulfilled time NULL,
  diagnosticstatement varchar(1024) NULL,
  pointsearned numeric(9, 2) NULL,
  lettergradeearned varchar(20) NULL,
  numericgradeearned numeric(9, 2) NULL,
  submissionstatusdescriptorid int4 NULL,
  assignmentlatestatusdescriptorid int4 NULL,
  CONSTRAINT studentgradebookentry_pk PRIMARY KEY (gradebookentryidentifier, namespace, studentusi),
  CONSTRAINT fk_c2efaa_assignmentlatestatusdescriptor FOREIGN KEY (assignmentlatestatusdescriptorid) REFERENCES assignmentlatestatusdescriptor (assignmentlatestatusdescriptorid),
  CONSTRAINT fk_c2efaa_competencyleveldescriptor FOREIGN KEY (competencyleveldescriptorid) REFERENCES competencyleveldescriptor (competencyleveldescriptorid),
  CONSTRAINT fk_c2efaa_gradebookentry FOREIGN KEY (gradebookentryidentifier, "namespace") REFERENCES gradebookentry (gradebookentryidentifier, "namespace") ON UPDATE CASCADE,
  CONSTRAINT fk_c2efaa_student FOREIGN KEY (studentusi) REFERENCES student (studentusi),
  CONSTRAINT fk_c2efaa_submissionstatusdescriptor FOREIGN KEY (submissionstatusdescriptorid) REFERENCES submissionstatusdescriptor (submissionstatusdescriptorid)
) INHERITS (base);

CREATE INDEX fk_c2efaa_assignmentlatestatusdescriptor ON studentgradebookentry USING btree (assignmentlatestatusdescriptorid);

CREATE INDEX fk_c2efaa_competencyleveldescriptor ON studentgradebookentry USING btree (competencyleveldescriptorid);

CREATE INDEX fk_c2efaa_gradebookentry ON studentgradebookentry USING btree (gradebookentryidentifier, namespace);

CREATE INDEX fk_c2efaa_student ON studentgradebookentry USING btree (studentusi);

CREATE INDEX fk_c2efaa_submissionstatusdescriptor ON studentgradebookentry USING btree (submissionstatusdescriptorid);

CREATE UNIQUE INDEX ux_c2efaa_id ON studentgradebookentry USING btree (id);



CREATE TABLE grade (
  begindate date NOT NULL,
  gradetypedescriptorid int4 NOT NULL,
  gradingperioddescriptorid int4 NOT NULL,
  gradingperiodname VARCHAR(60) NOT NULL,
  gradeearneddescription VARCHAR(64) NULL,
  gradingperiodschoolyear int2 NOT NULL,
  gradingperiodsequence int4 NOT NULL,
  localcoursecode varchar(60) NOT NULL,
  schoolid int4 NOT NULL,
  schoolyear int2 NOT NULL,
  sectionidentifier varchar(255) NOT NULL,
  sessionname varchar(60) NOT NULL,
  studentusi int4 NOT NULL,
  lettergradeearned varchar(20) NULL,
  numericgradeearned numeric(9, 2) NULL,
  diagnosticstatement varchar(1024) NULL,
  performancebaseconversiondescriptorid int4 NULL,
  currentgradeindicator bool NULL,
  currentgradeasofdate date NULL,
  CONSTRAINT grade_pk PRIMARY KEY (
    begindate,
    gradetypedescriptorid,
    gradingperioddescriptorid,
    gradingperiodschoolyear,
    gradingperiodsequence,
    localcoursecode,
    schoolid,
    schoolyear,
    sectionidentifier,
    sessionname,
    studentusi
  ),
  CONSTRAINT fk_839e20_gradetypedescriptor FOREIGN KEY (gradetypedescriptorid) REFERENCES gradetypedescriptor (gradetypedescriptorid),
  CONSTRAINT fk_839e20_gradingperiod FOREIGN KEY (
    gradingperioddescriptorid,
    gradingperiodsequence,
    schoolid,
    gradingperiodschoolyear
  ) REFERENCES gradingperiod (
    gradingperioddescriptorid,
    periodsequence,
    schoolid,
    schoolyear
  ),
  CONSTRAINT fk_839e20_performancebaseconversiondescriptor FOREIGN KEY (performancebaseconversiondescriptorid) REFERENCES performancebaseconversiondescriptor (performancebaseconversiondescriptorid),
  CONSTRAINT fk_839e20_studentsectionassociation FOREIGN KEY (
    begindate,
    localcoursecode,
    schoolid,
    schoolyear,
    sectionidentifier,
    sessionname,
    studentusi
  ) REFERENCES studentsectionassociation (
    begindate,
    localcoursecode,
    schoolid,
    schoolyear,
    sectionidentifier,
    sessionname,
    studentusi
  ) ON UPDATE CASCADE
) INHERITS (base);

CREATE INDEX fk_839e20_gradetypedescriptor ON grade USING btree (gradetypedescriptorid);

CREATE INDEX fk_839e20_gradingperiod ON grade USING btree (
  gradingperioddescriptorid,
  gradingperiodsequence,
  schoolid,
  gradingperiodschoolyear
);

CREATE INDEX fk_839e20_performancebaseconversiondescriptor ON grade USING btree (performancebaseconversiondescriptorid);

CREATE INDEX fk_839e20_studentsectionassociation ON grade USING btree (
  begindate,
  localcoursecode,
  schoolid,
  schoolyear,
  sectionidentifier,
  sessionname,
  studentusi
);

CREATE UNIQUE INDEX ux_839e20_id ON grade USING btree (id);

CREATE TABLE reportcard (
  educationorganizationid int4 NOT NULL,
  gradingperioddescriptorid int4 NOT NULL,
  gradingperiodschoolid int4 NOT NULL,
  gradingperiodschoolyear int2 NOT NULL,
  gradingperiodsequence int4 NOT NULL,
  studentusi int4 NOT NULL,
  gpagivengradingperiod numeric(18, 4) NULL,
  gpacumulative numeric(18, 4) NULL,
  numberofdaysabsent numeric(18, 4) NULL,
  numberofdaysinattendance numeric(18, 4) NULL,
  numberofdaystardy int4 NULL,
  CONSTRAINT reportcard_pk PRIMARY KEY (
    educationorganizationid,
    gradingperioddescriptorid,
    gradingperiodschoolid,
    gradingperiodschoolyear,
    gradingperiodsequence,
    studentusi
  ),
  CONSTRAINT fk_ec1992_educationorganization FOREIGN KEY (educationorganizationid) REFERENCES educationorganization (educationorganizationid),
  CONSTRAINT fk_ec1992_gradingperiod FOREIGN KEY (
    gradingperioddescriptorid,
    gradingperiodsequence,
    gradingperiodschoolid,
    gradingperiodschoolyear
  ) REFERENCES gradingperiod (
    gradingperioddescriptorid,
    periodsequence,
    schoolid,
    schoolyear
  ),
  CONSTRAINT fk_ec1992_student FOREIGN KEY (studentusi) REFERENCES student (studentusi)
) INHERITS (base);

CREATE INDEX fk_ec1992_educationorganization ON reportcard USING btree (educationorganizationid);

CREATE INDEX fk_ec1992_gradingperiod ON reportcard USING btree (
  gradingperioddescriptorid,
  gradingperiodsequence,
  gradingperiodschoolid,
  gradingperiodschoolyear
);

CREATE INDEX fk_ec1992_student ON reportcard USING btree (studentusi);

CREATE UNIQUE INDEX ux_ec1992_id ON reportcard USING btree (id);




-- Health Table


CREATE TABLE studenthealth (
  educationorganizationid int4 NOT NULL,
  studentusi int4 NOT NULL,
  asofdate date NOT NULL,
  nonmedicalimmunizationexemptiondate date NULL,
  nonmedicalimmunizationexemptiondescriptorid int4 NULL,
  CONSTRAINT studenthealth_pk PRIMARY KEY (educationorganizationid, studentusi),
  CONSTRAINT fk_studenthealth_student FOREIGN KEY (studentusi) REFERENCES student (studentusi),
  CONSTRAINT fk_studenthealth_educationorganization FOREIGN KEY (educationorganizationid) REFERENCES educationorganization (educationorganizationid),
  CONSTRAINT fk_studenthealth_nonmedicalimmunizationexemptiondescriptor FOREIGN KEY (nonmedicalimmunizationexemptiondescriptorid) REFERENCES nonmedicalimmunizationexemptiondescriptor (nonmedicalimmunizationexemptiondescriptorid)
) INHERITS (base);

CREATE INDEX fk_studenthealth_studentusi ON studenthealth USING btree (studentusi);

CREATE INDEX fk_studenthealth_educationorganizationid ON studenthealth USING btree (educationorganizationid);

CREATE INDEX fk_studenthealth_asofdate ON studenthealth USING btree (asofdate);

CREATE UNIQUE INDEX ux_studenthealth_id ON studenthealth USING btree (id);