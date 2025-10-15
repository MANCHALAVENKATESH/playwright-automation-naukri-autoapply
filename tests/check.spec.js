import { test } from '@playwright/test';
import { BASE_URL } from '../utils/env';


test('test', async ({ browser }) => {
    console.log("Success CI CD");
    console.log(BASE_URL)
})