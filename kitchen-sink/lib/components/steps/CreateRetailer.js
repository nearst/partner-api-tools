import React, { useState } from 'react';

import Step from '../Step';
import API from '../../api';
import Spinner from '../Spinner';

const CreateRetailer = ({ retailer, setRetailer }) => {
	const [loading, setLoading] = useState(false);

	const createRetailerAndStores = async() => {
		setLoading(true);
		const data = await API.call('POST', '/retailers', {
			'name': 'The Canalside Bookshop',
			'contactName': 'John Doe',
			'contactEmail': 'john.doe@gmail.com',
			'contactPhone': '555-555-5555',
			stores: [{
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
		});
		setRetailer(data);
		setLoading(false);
	};

	return (
		<Step num={1} completed={!!retailer}>
			<p className="prose mb-5 font-semibold text-gray-600">Create retailer and stores within NearSt</p>
			{retailer ? (
				<div className="prose">
					<strong>Entities created</strong>
					<ul>
						{retailer.stores.map((store) => (
							<li key={store.id}>
								{store.name} <span className="text-gray-500 text-sm">{store.id}</span>
							</li>
						))}
					</ul>
				</div>
			) : (
				loading ? <Spinner/> : (
					<button onClick={createRetailerAndStores} className="bg-black text-white p-3 font-bold">
						Create retailer + stores
					</button>
				)
			)}
		</Step>
	);
};

export default CreateRetailer;
