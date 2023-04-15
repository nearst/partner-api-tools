import React, { useState } from 'react';

import Step from '../Step';
import API from '../../api';
import Spinner from '../Spinner';

const ConnectChannels = ({ retailer }) => {
	const [loading, setLoading] = useState(false);
	const [connected, setConnected] = useState(false);

	const connectGoogleChannel = async() => {
		setLoading(true);
		await API.call('POST', '/retailers/630d96be-cb33-499d-ad17-9b93f7df7f3d/stores/74e094b8-1f92-4774-a63a-920989c35fba/channels', {
			type: 'google-mc',
			parameters: {
				storeCode: 'myshop-1',
				merchantId: '123456789'
			}
		});
		await API.call('POST', '/retailers/630d96be-cb33-499d-ad17-9b93f7df7f3d/stores/74e094b8-1f92-4774-a63a-920989c35fba/channels', {
			type: 'google-mc',
			parameters: {
				storeCode: 'myshop-2',
				merchantId: '234567890'
			}
		});
		setLoading(false);
		setConnected(true);
	};

	return (
		<Step num={3} completed={connected}>
			<p className="prose mb-5 font-semibold text-gray-600">Connect channels</p>
			{retailer && (
				(connected ? (
					<div className="prose">
						<p>{'We\'re now starting to send data to Google. It might take up to two days for products to start showing in Merchant Center after adding NearSt as a inventory partner.'}</p>
					</div>
				) : (
					loading ? <Spinner/> : (
						<button onClick={connectGoogleChannel} className="bg-black text-white p-3 font-bold">
							Connect Google Merchant Center
						</button>
					)
				)))}
		</Step>
	);
};

export default ConnectChannels;
