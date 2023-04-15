import { useEffect, useState } from 'react';
import Head from 'next/head';

import CreateRetailer from '../lib/components/steps/CreateRetailer';
import ConnectInventory from '../lib/components/steps/ConnectInventory';
import LogLine from '../lib/components/LogLine';
import ConnectChannels from '../lib/components/steps/ConnectChannels';

import API from '../lib/api';
import { wait } from '../lib/utils';

export default function Home() {
	const [logs, setLogs] = useState([]);
	const [retailer, setRetailer] = useState(null);
	const [inventoryConnected, setInventoryConnected] = useState(false);

	// Logging and scrolling down
	useEffect(() => {
		document.getElementById('bottomID').scrollIntoView();
	}, [logs]);
	const appendLog = async(timeout, log) => {
		await wait(timeout);
		setLogs(logs => ([...logs, log]));
	};

	API.setLogger(appendLog);

	return (
		<>
			<Head>
				<title>Partner API kitchen sink</title>
			</Head>
			<div key="main" className="flex w-screen h-screen">
				<div className="flex-1 w-1/2 h-screen overflow-auto">
					<div className="p-20">
						<h1 className="text-3xl font-semibold mb-6">Partner API kitchen sink</h1>
						<p className="prose">
							This example shows off the functionality of the NearSt Partner API and how to use it to provide a
							whitelabel NearSt integration.
						</p>

						<CreateRetailer retailer={retailer} setRetailer={setRetailer}/>

						<ConnectInventory retailer={retailer} setInventoryConnected={setInventoryConnected}/>

						<ConnectChannels retailer={inventoryConnected ? retailer : null} setRetailer={setRetailer}/>
					</div>
				</div>
				<div className="flex-1 w-1/2 bg-gray-100 h-screen overflow-y-auto">
					<div className="p-10">
						<div className="text-sm text-gray-600 font-bold">API LOGS</div>
						<div className="text-sm whitespace-pre">
							{logs.map(([kind, code, data], index) => (
								<LogLine key={index} data={data} kind={kind} code={code}/>
							))}
							<div id="bottomID"/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
