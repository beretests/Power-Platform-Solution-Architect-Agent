"use client";

import React from "react";
import { DataverseTable } from "@/lib/mockResults";

interface DataverseSchemaViewProps {
  tables?: DataverseTable[];
}

export const DataverseSchemaView: React.FC<DataverseSchemaViewProps> = ({
  tables = [],
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Dataverse Table Design
        </h2>
        <p className="text-gray-600">
          Recommended table structure with columns, data types, and
          relationships.
        </p>
      </div>

      {tables.length === 0 ? (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500">
          No Dataverse tables defined
        </div>
      ) : (
        <div className="space-y-6">
          {tables.map((table) => (
            <div
              key={table.name}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-blue-900 text-lg mb-1">
                  {table.displayName}
                </h3>
                <p className="text-sm text-blue-700">{table.description}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Column Name
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Required
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns.map((col, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {col.displayName}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                            {col.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {col.required ? (
                            <span className="text-red-600 font-semibold">
                              Yes
                            </span>
                          ) : (
                            <span className="text-gray-500">No</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                          {col.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
