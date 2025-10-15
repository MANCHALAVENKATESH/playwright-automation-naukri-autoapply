import { test } from '@playwright/test';
import { BASE_URL } from '../utils/env';
import dotenv from 'dotenv';
dotenv.config();

test('test', async ({ browser }) => {
    console.log("Success CI CD");
    console.log("BASE_URL length:", process.env.BASE_URL.length);
    console.log("USERNAME first 3 letters:", process.env.NAUKRI_EMAIL.slice(0, 3));

})