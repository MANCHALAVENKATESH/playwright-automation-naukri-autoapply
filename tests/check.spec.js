import { test } from '@playwright/test';
import { BASE_URL } from '../utils/env';
import dotenv from 'dotenv';
dotenv.config();

test('test', async ({ browser }) => {
    console.log("Success CI CD");
    console.log(BASE_URL)
})