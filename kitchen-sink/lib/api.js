import posList from './data.json';

let logger;

const API = {};

API.setLogger = (_logger) => {
	logger = _logger;
};

API.log = (...props) => logger(...props);

API.call = async(httpMethod, endpoint, request) => {
	const method = `${httpMethod} ${endpoint}`;
	await logger(0, ['http', 0, method]);
	await logger(0, ['req', 0, request]);

	const mockResponse = mockResponses[method];

	await logger(mockResponse.timeout, ['res', mockResponse.status, mockResponse.body]);

	if (mockResponse.status >= 400) {
		const err = new Error('Error response returned');
		err.body = mockResponse.body;
		throw err;
	}

	return mockResponse.body;
};

const mockResponses = {
	'POST /retailers': {
		status: 201,
		timeout: 1000,
		body: {
			'id': '630d96be-cb33-499d-ad17-9b93f7df7f3d',
			'name': 'The Canalside Bookshop',
			'contactName': 'John Doe',
			'contactEmail': 'john.doe@gmail.com',
			'contactPhone': '555-555-5555',
			inventoryStatus: 'unknown',
			channelStatus: 'unknown',
			stores: [{
				id: '74e094b8-1f92-4774-a63a-920989c35fba',
				name: 'Canalside London',
				address: '51 Hoxton Square',
				postcode: 'N1 6PB',
				city: 'London',
				country: 'GB',
				currency: 'GBP',
				phone: '+44 20 7123 4567',
				links: [{
					type: 'website',
					value: 'https://canalbooks.co.uk/london',
				}]
			}, {
				id: '5a5e5362-799d-401d-8b0b-76ac7e0720e7',
				name: 'Canalside Manchester',
				address: '23 Lever St',
				postcode: 'M1 1BY',
				city: 'Manchester',
				country: 'GB',
				currency: 'GBP',
				phone: '+44 161 237 4567',
				links: [{
					type: 'website',
					value: 'https://canalbooks.co.uk/manchester',
				}]
			}]
		}
	},
	'GET /inventory/providers': {
		status: 200,
		timeout: 100,
		body: posList
	},
	'POST /retailers/630d96be-cb33-499d-ad17-9b93f7df7f3d/stores/74e094b8-1f92-4774-a63a-920989c35fba/inventory': {
		status: 200,
		timeout: 500,
		body: {
			"status": "pending",
			"provider": {
				"id": "batchline",
				"label": "Batchline",
				"type": "point-of-sale",
				"vendor": "Batch"
			},
			"nextSteps": {
				"id": "plug-play",
				"label": "Finish your inventory integration by clicking the link below.",
				"finishSetupLink": "https://connect.near.st/45522831-4896-4003-a255-026b26095aa4"
			}
		}
	},
	'GET /retailers/630d96be-cb33-499d-ad17-9b93f7df7f3d/stores/74e094b8-1f92-4774-a63a-920989c35fba/inventory': {
		status: 200,
		timeout: 500,
		body: {
			"status": "connected",
			"provider": {
				"id": "batchline",
				"label": "Batchline",
				"type": "point-of-sale",
				"vendor": "Batch"
			},
			"latestIngest": {
				"createdAt": "2022-04-11T14:18:31.729Z",
				"numberOfLines": 283,
				"validLines": 254,
				"inStockValidLines": 175
			}
		}
	},
	'GET /retailers/630d96be-cb33-499d-ad17-9b93f7df7f3d/stores/5a5e5362-799d-401d-8b0b-76ac7e0720e7/inventory': {
		status: 200,
		timeout: 500,
		body: {
			"status": "connected",
			"provider": {
				"id": "batchline",
				"label": "Batchline",
				"type": "point-of-sale",
				"vendor": "Batch"
			},
			"latestIngest": {
				"createdAt": "2022-04-11T14:18:31.729Z",
				"numberOfLines": 584,
				"validLines": 433,
				"inStockValidLines": 102
			}
		}
	},
	'POST /retailers/630d96be-cb33-499d-ad17-9b93f7df7f3d/stores/5a5e5362-799d-401d-8b0b-76ac7e0720e7/channels': {
		status: 200,
		timeout: 500,
		body: {
			status: 'pending',
			channel: {
				id: 'google-mc',
				label: 'Google Local Listings'
			},
			nextSteps: {
				label: "We're now starting to send data to Google. It might take up to two days for products to start showing in Merchant Center after adding NearSt as a inventory partner."
			}
		}
	},
	'POST /retailers/630d96be-cb33-499d-ad17-9b93f7df7f3d/stores/74e094b8-1f92-4774-a63a-920989c35fba/channels': {
		status: 200,
		timeout: 500,
		body: {
			status: 'pending',
			channel: {
				id: 'google-mc',
				label: 'Google Local Listings'
			},
			nextSteps: {
				label: "We're now starting to send data to Google. It might take up to two days for products to start showing in Merchant Center after adding NearSt as a inventory partner."
			}
		}
	}
};

export default API;
