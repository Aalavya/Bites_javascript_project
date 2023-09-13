import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';



/* The code is defining two variables: `recipeContainer` and `timeout`. */
const recipeContainer = document.querySelector('.recipe');
const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

// AJAX >> Combination of GetJSON and SendJSON
/**
 * The AJAX function is a helper function that sends an HTTP request to a specified URL and returns the
 * response data.
 * @param url - The `url` parameter is the URL of the API endpoint that you want to make a request to.
 * It can be a relative or absolute URL.
 * @param [uploadData] - The `uploadData` parameter is an optional parameter that represents the data
 * that you want to send to the server. It is used when making a POST request to the specified `url`.
 * If `uploadData` is provided, it will be sent as the request body in JSON format. If `upload
 * @returns the data received from the server as a JSON object.
 */
export const AJAX = async function (url, uploadData = undefined) {
    try {
        const fetchPro = uploadData ? fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(uploadData)
        })
            : fetch(url);
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        if (!res.ok) throw Error(`${data.message} (${res.status})`);
        return data;
    } catch (err) {
        throw err;

    }
};

/*
export const getJSON = async function (url) {
    try {
        const fetchPro = fetch(url);
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        if (!res.ok) throw Error(`${data.message} (${res.status})`);
        return data;
    } catch (err) {
        throw err;

    }
};
// sending our entry to API
export const sendJSON = async function (url, uploadData) {
    try {
        const fetchPro = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(uploadData)
        });
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        if (!res.ok) throw Error(`${data.message} (${res.status})`);
        return data;
    } catch (err) {
        throw err;

    }
}
*/