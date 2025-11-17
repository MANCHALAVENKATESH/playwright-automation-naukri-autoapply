// utils/env.js
import dotenv from 'dotenv';
dotenv.config();
const keywords = [
 "sdet",
 "software-development-engineer-test"

];



export const BASE_URL = "https://www.naukri.com"
export const USERNAME = process.env.NAUKRI_EMAIL;
export const PASSWORD = process.env.NAUKRI_PASSWORD;
export const CV = process.env.CV;

const slug = keywords.join('-');
const query = keywords.join('%2C%20');
const query_re = query.replaceAll("-","%20")
const experience = 2
export const JOB_FILTER = `${BASE_URL}/${slug}-jobs?k=${query_re}&nignbevent_src=jobsearchDeskGNB&experience=1&functionAreaIdGid=5&jobAge=1`;
export const pagination = (number) =>  `${BASE_URL}/${slug}-jobs-${number}?k=${query_re}&nignbevent_src=jobsearchDeskGNB&experience=${experience}&functionAreaIdGid=5&jobAge=15`



export const LINKEDIN_EMAIL = process.env.LINKEDIN_EMAIL;
export const LINKEDIN_PASSWORD = process.env.LINKEDIN_PASSWORD;

export class LinkedinConfig {
  static EMAIL = process.env.LINKEDIN_EMAIL;
  static PASSWORD = process.env.LINKEDIN_PASSWORD;

  static BASE_URL = "https://www.linkedin.com";
  static LOGIN_URL = `${this.BASE_URL}/checkpoint/lg/sign-in-another-account`;
  static JOBS_URL = `${this.BASE_URL}/jobs`;

  // Search filters
  static KEYWORDS = ["software engineer"];
  static LOCATION_ID = "90009650"; // e.g., Hyderabad
  static EXPERIENCE_LEVELS = "2,3"; // Entry + Mid level
  static JOB_TYPES = "F,P,C"; // Full-time, Part-time, Contract
  static FUNCTIONS = "eng,it,qa,cnsl"; // Engineering, IT, QA, Consulting
  static POSTED_WITHIN = "r604800"; // last 7 days
  static SORT_BY = "DD"; 
  static EASY_APPLY = "true";

  // ✅ Build LinkedIn job filter URL dynamically
  static JOB_FILTER_URL(currentJobId) {
    const encodedKeywords = encodeURIComponent(this.KEYWORDS.join(", "));
    const filter = `${this.JOBS_URL}/search/?currentJobId=${currentJobId}&keywords=${encodedKeywords}&f_E=${this.EXPERIENCE_LEVELS}&f_AL=${this.EASY_APPLY}&f_F=${this.FUNCTIONS}&f_JT=${this.JOB_TYPES}&f_TPR=${this.POSTED_WITHIN}&geoId=${this.LOCATION_ID}&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=true&sortBy=${this.SORT_BY}`;
    console.log(filter);
    return filter
  }
  static CURRENT_JOB_URL(currentJobId){
    return `https://www.linkedin.com/jobs/collections/recommended/?currentJobId=${currentJobId}`;
  }

  // ✅ Pagination support
  static pagination(start = 0) {
    return `${this.JOB_FILTER_URL}&start=${start}`;
  }
}

export class ITRConfig {
   static ITR_USER_ID = process.env.ITR_USER_ID;
   static ITR_PASSWORD = process.env.ITR_USER_PASSWORD;
}
export class EnvInstaHyre{
  static INSTAHYRE_EMAIL = process.env.INSTAHYRE_EMAIL
  static INSTAHYRE_PASSWORD= process.env.INSTAHYRE_PASSWORD
  static InstaHyre = "https://www.instahyre.com"
  static LOGIN = `${this.InstaHyre}/login/`
  static JOB_URL = `${this.InstaHyre}/candidate/opportunities/?company_size=0&job_type=0&search=true`
}