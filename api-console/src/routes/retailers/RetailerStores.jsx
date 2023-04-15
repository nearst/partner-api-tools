import React from "react";

import PaginatedResource from "../../components/PaginatedResource.jsx";
import { Link, useParams } from "react-router-dom";
import { useAPI } from "../../lib/API.js";
import { formatRelative, subDays } from "date-fns";

const Tooltipped = ({ children, tooltip }) => {
  if (!tooltip) {
    return children;
  }

  return (
    <div className="relative group cursor-help">
      <div
        className="group-hover:opacity-90 opacity-0 pointer-events-none group-hover:pointer-events-auto absolute z-10 bg-gray-900 top-full mt-1 text-white p-3 text-xs max-w-[14rem] w-screen">
        {tooltip}
      </div>
      {children}
    </div>
  );
};

const Badge = ({ variant, title, tooltip }) => {
  let classes = "text-gray-600 bg-gray-100";
  switch (variant) {
  case "red":
    classes = `text-red-600 bg-red-100`;
    break;
  case "yellow":
  case "amber":
    classes = `text-amber-600 bg-amber-100`;
    break;
  case "green":
  case "connected":
    classes = `text-green-600 bg-green-100`;
    break;
  }

  return (
    <Tooltipped tooltip={tooltip}>
      <div
        className={`inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium ${classes}`}>
        <svg className="-ml-1 mr-1.5 h-2.5 w-2.5" fill="currentColor" viewBox="0 0 8 8">
          <circle cx={4} cy={4} r={3} />
        </svg>
        {title}
      </div>
    </Tooltipped>
  );
};

const ChannelStatus = ({ retailerId, storeId }) => {
  const [data] = useAPI(`retailers/${retailerId}/stores/${storeId}/channels`);
  if (!data) {
    return null;
  }

  return data.map(({ status, channel }) => (
    <Badge
      key={channel.id}
      variant={status}
      title={channel.label.split(" ")[0]}
      tooltip={<>
        <p className="font-semibold mb-1">{channel.label}</p>
        <p>{status}</p>
      </>}
    />
  ));
};

const InventoryStatus = ({ retailerId, storeId }) => {
  const [data] = useAPI(`retailers/${retailerId}/stores/${storeId}/inventory`);
  if (!data) {
    return null;
  }

  if (!data.provider) {
    return <span className="text-gray-500">No provider</span>;
  }

  const latestIngest = data?.latestIngest;

  if (!data.provider || !latestIngest) {
    return (
      <Badge
        tooltip={
          <>
            {data.provider ? (<div className="font-semibold mb-1">{data.provider.label}</div>) : null}
            <p>No upload received yet.</p>
          </>
        }
        title="Pending"
      />
    );
  }

  const tooltip = <>
    <div className="font-semibold mb-1">{data.provider.label}</div>
    <p>Last upload {formatRelative(new Date(latestIngest.createdAt), new Date())}</p>
    <p>{latestIngest.numberOfLines} lines, {latestIngest.inStockValidLines} in stock</p>
  </>;

  if (new Date(latestIngest.createdAt) < subDays(new Date(), 2)) {
    return (
      <Badge tooltip={tooltip} variant="amber" title="Disconnected" />
    );
  }

  if (latestIngest.inStockValidLines < 12) {
    return (
      <Badge
        tooltip={<>
          {tooltip}
          <p className="mt-2">Needs at least 50 in-stock products to go live in Google.</p>
        </>}
        variant="amber"
        title="Invalid" />
    );
  }

  return (<Badge tooltip={tooltip} variant="green" title="OK" />);
};

InventoryStatus.propTypes = {};
const RetailerStores = () => {
  const { id } = useParams();
  const [retailers] = useAPI("retailers", { "page[size]": 100 });
  const retailer = retailers?.data.find((retailer) => retailer.id === id);

  if (!retailer) {
    return <p>Loading...</p>; // TODO: loading
  }

  return (
    <div key="stores">
      <Link to="/" className="text-blue-600 hover:text-blue-900 font-medium mb-2 inline-block">
        &larr; All retailers
      </Link>
      <h1 className="text-4xl font-medium mb-10">{retailer.name}</h1>
      <PaginatedResource path={`retailers/${id}/stores`}>
        {({ data }) => (
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
            <tr>
              <th
                scope="col"
                colSpan={2}
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
              >
                Name
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
              >
                Address
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
              >
                Inventory
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
              >
                Channels
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {data.map((store) => (
              <tr key={store.id}>
                <td className=" py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                  {store.name}
                </td>
                <td className=" py-4 pr-3 text-xs font-mono text-gray-500 ">
                  {store.id}
                </td>
                <td className=" py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6 md:pl-0">
                  {store.city}, {store.country}
                </td>
                <td className=" py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
                  <InventoryStatus retailerId={retailer.id} storeId={store.id} />
                </td>
                <td className=" py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6 md:pl-0">
                  <ChannelStatus retailerId={retailer.id} storeId={store.id} />
                </td>
                <td
                  className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0">
                  <Link to={`/retailers/${retailer.id}`} className="text-blue-600 hover:text-blue-900">
                    Edit<span className="sr-only"> {store.name}</span>
                  </Link>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        )}
      </PaginatedResource>
    </div>
  );
};

export default RetailerStores;
