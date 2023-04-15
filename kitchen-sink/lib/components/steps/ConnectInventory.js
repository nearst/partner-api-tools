import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';

import Step from '../Step';
import Spinner from '../Spinner';
import API from '../../api';
import { normalize } from '../../utils';

const ConnectInventory = ({ retailer, setInventoryConnected }) => {
	const [loading, setLoading] = useState(false);
	const [inventory, setInventory] = useState({});
	const [selectedPos, setSelectedPos] = useState(null);
	const [showPopup, setShowPopup] = useState(null);
	const [inventoryProviders, setInventoryProviders] = useState([]);

	// Load list of inventory providers
	useEffect(() => {
		if (!retailer || inventoryProviders.length) {
			return;
		}
		;(async() => {
			setLoading(true);
			const data = await API.call('GET', `/inventory/providers`);
			setInventoryProviders(data);
			console.log(data);
			setLoading(false);
		})();
	}, [retailer, inventoryProviders]);

	// Set inventory provider
	useEffect(() => {
		if (selectedPos) {
			(async() => {
				setLoading(true);
				if (selectedPos.id !== 'batchline') {
					API.log(0, ['debug', 0, '(in the demo, we always default to "batchline" as the inventory provider)']);
				}
				const data = await API.call('POST', '/retailers/630d96be-cb33-499d-ad17-9b93f7df7f3d/stores/74e094b8-1f92-4774-a63a-920989c35fba/inventory', {
					provider: 'batchline'
				});
				setInventory((inv) => ({ ...inv, '74e094b8-1f92-4774-a63a-920989c35fba': data }));
				setLoading(false);
			})();
		}
	}, [selectedPos]);

	const getInventoryStatus = async () => {
		const data = await API.call('GET', '/retailers/630d96be-cb33-499d-ad17-9b93f7df7f3d/stores/74e094b8-1f92-4774-a63a-920989c35fba/inventory');
		setInventory((inv) => ({ ...inv, '74e094b8-1f92-4774-a63a-920989c35fba': data }));
		const data2 = await API.call('GET', '/retailers/630d96be-cb33-499d-ad17-9b93f7df7f3d/stores/5a5e5362-799d-401d-8b0b-76ac7e0720e7/inventory');
		setInventory((inv) => ({ ...inv, '5a5e5362-799d-401d-8b0b-76ac7e0720e7': data2 }));
		setInventoryConnected(true);
	}

	const promiseOptions = async(inputValue) => {
		// Filter the options based on the search input
		const normalizedInput = normalize(inputValue);
		let finalOptions = normalizedInput.length ? inventoryProviders.filter((provider) =>
			normalize(provider.label).includes(normalizedInput)
		) : inventoryProviders;

		return [
			{
				label: 'Point-of-sale systems',
				options: finalOptions.filter(({ type }) => type !== 'generic').map((provider) => ({
					...provider,
					label: `${provider.label}${provider.vendor && provider.vendor !== provider.label ? ` (${provider.vendor})` : ''}`,
					value: provider.id,
				}))
			},
			{
				label: '',
				options: inventoryProviders.filter(({ type }) => type === 'generic').map((provider) => ({
					...provider,
					value: provider.id,
				}))
			}
		];
	};

	return (
		<Step num={2} completed={Object.values(inventory).length >= 2}>
			{showPopup && (
				<div key="popup"
				     className="flex items-center justify-center h-screen w-screen bg-gray-500 bg-opacity-75 z-50 absolute inset-0">
					<div className="w-1/2 h-full py-40 flex items-center justify-center">
						<div className="bg-white h-full flex-1 overflow-auto">
							<div className="p-10">
								<h2 className="text-xl font-semibold">Connect Batchline to ExamplePartner</h2>
								<p className="text-gray-400 text-sm mb-10">Powered by NearSt</p>

								<div className="prose prose-lg">
									<ol>
										<li>
											Download the Batchline connector app<br/>
											<button className="bg-blue-600 text-white p-1 px-4 mt-3 font-bold">Download</button>
										</li>
										<li className="my-7">
											Enter your <strong>Upload Key</strong>
											<pre className="mt-1 rounded-none">95a969c4e03d4addb892eaf26ef51d34</pre>
										</li>
									</ol>

								</div>
								<div className="flex text-gray-500 mt-24">
									<Spinner className="mr-3"/>
									<p>Waiting for first inventory upload...</p>
								</div>
								<div className="text-right">
									<button className="text-xs text-gray-400" onClick={() => {
										setShowPopup(false);
										return getInventoryStatus();
									}}>
										(skip)
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
			<p className="prose mb-5 font-semibold text-gray-600">Select your inventory provider</p>
			{Object.values(inventory).length >= 2 ? (
				<div className="prose">
					<strong>First inventory upload received</strong>
					<ul>
						{retailer.stores.map((store) => (
							<li key={store.id}>
								{store.name} <span className="text-gray-500 text-sm">{inventory[store.id].latestIngest?.inStockValidLines} / {inventory[store.id].latestIngest?.numberOfLines} lines of stock</span>
							</li>
						))}
					</ul>
				</div>
			) : (
			!retailer ? null : (loading ? <Spinner/> : (
				<div>
					{Object.values(inventory).length ? (
						<div className="mt-4">
							<p className="prose mb-2">Finish your inventory integration by clicking the link below.</p>
							<button onClick={() => setShowPopup(true)} className="text-blue-500 font-bold">
								Finish inventory connection &rarr;
							</button>
						</div>
					) : (
						<AsyncSelect
							placeholder="Select your point-of-sale..."
							isLoading={!inventoryProviders.length}
							defaultOptions
							cacheOptions
							loadOptions={promiseOptions}
							components={{
								ClearIndicator: () => null,
								IndicatorSeparator: () => null,
							}}
							onChange={(value) => setSelectedPos(value)}
							value={selectedPos || []}
						/>
					)}
				</div>
			)))}
		</Step>
	);
};

export default ConnectInventory;
