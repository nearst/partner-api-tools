import React from "react";

import PaginatedResource from "../../components/PaginatedResource.jsx";
import { Link } from "react-router-dom";

const RetailersList = ({}) => {
  return (
    <div key="list">
      <h1 className="text-4xl font-medium mb-10">Retailers</h1>
      <PaginatedResource path="retailers">
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
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {data.map((retailer) => (
              <tr key={retailer.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                {retailer.name}
                </td>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-mono text-gray-500 sm:pl-6 md:pl-0">
                  {retailer.id}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0">
                  <Link to={`/retailers/${retailer.id}`} className="text-blue-600 hover:text-blue-900">
                    View stores<span className="sr-only">{retailer.name}</span>
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

export default RetailersList;
