// utils/env.js
import dotenv from 'dotenv';
dotenv.config();

export const BASE_URL = process.env.BASE_URL;
export const USERNAME = process.env.NAUKRI_EMAIL;
export const PASSWORD = process.env.NAUKRI_PASSWORD;


// Create the query param part (comma separated, URL encoded)

const keywords = [
  "software-testing",
  "software-test-engineer",
  "sdet",
  "automation-testing",
  "qa-testing",
  "qa-automation",
  "quality-assurance-engineering"
];

const slug = keywords.join('-');
const query = keywords.join('%2C%20');
const query_re = query.replaceAll("-","%20")
const experience = 1
export const JOB_FILTER = `${BASE_URL}/${slug}-jobs?k=${query_re}&nignbevent_src=jobsearchDeskGNB&experience=1&functionAreaIdGid=5&jobAge=1`;
export const pagination = (number) =>  `${BASE_URL}/${slug}-jobs-${number}?k=${query_re}&nignbevent_src=jobsearchDeskGNB&experience=${experience}&functionAreaIdGid=5&jobAge=15`

