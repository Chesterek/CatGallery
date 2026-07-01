import axios from "axios";

const CAT_API_BASE_URL = 'https://api.thecatapi.com/v1';
const CAT_API_KEY = 'live_r97MdDwabm9Ckdb7lvTrzJ7D7Z5ruf5c3ttj84rBPNDV4bVBnYc6etqNOMtP6iwR';

export const PAGE_SIZE = 30;
export const REQUEST_STATE_TIME = 1000 * 60 * 5;

export const catApiClient = axios.create({
	baseURL: CAT_API_BASE_URL,
	headers: {
		'x-api-key': CAT_API_KEY,
	},
});