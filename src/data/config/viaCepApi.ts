import axios from 'axios';

export const viaCepApi = axios.create({
	baseURL: 'https://viacep.com.br/ws',
	timeout: 5000
});
