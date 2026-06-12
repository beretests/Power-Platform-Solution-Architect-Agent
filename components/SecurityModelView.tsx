"use client";

import React from "react";
import { SecurityRole as SecurityRoleType } from "@/lib/mockResults";

interface SecurityModelViewProps {
  roles?: SecurityModelRole[];
}

type SecurityModelRole = SecurityRoleType & {
  persona?: string;
  notes?: string[];
};

const privilegeLabels = ["Create", "Read", "Update", "Delete"] as const;

type Privilege = (typeof privilegeLabels)[number];

const getPrivilegeValue = (
  permission: SecurityRoleType["tablePermissions"][number],
  privilege: Privilege,
) => {
  switch (privilege) {
    case "Create":
      return permission.create;
    case "Read":
      return permission.read;
    case "Update":
      return permission.update;
    case "Delete":
      return permission.delete;
  }
};

export const SecurityModelView: React.FC<SecurityModelViewProps> = ({
  roles = [],
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Security Role Model
        </h2>
        <p className="text-gray-600">
          Role-based access control using least privilege access for each user
          persona.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-semibold text-amber-900 text-sm mb-1">
          Production security review required
        </h3>
        <p className="text-sm text-amber-800">
          Treat these roles as a least privilege starting point. Validate table,
          row, column, and environment permissions with security owners before
          production deployment.
        </p>
      </div>

      {roles.length === 0 ? (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500">
          No security roles defined
        </div>
      ) : (
        <div className="space-y-6">
          {roles.map((role) => {
            const notes =
              role.notes && role.notes.length > 0
                ? role.notes
                : role.responsibilities;
            const persona = role.persona ?? role.description;

            return (
              <div
                key={role.name}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="font-bold text-green-900 text-lg">
                        {role.displayName}
                      </h3>
                      <p className="text-xs text-green-700 font-semibold mt-1">
                        Role ID: {role.name}
                      </p>
                    </div>
                    <span className="inline-flex w-fit rounded bg-white px-2.5 py-1 text-xs font-semibold text-green-800 border border-green-200">
                      Least privilege
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                      Persona
                    </h4>
                    <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded px-4 py-3">
                      {persona}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                      Table Privileges
                    </h4>
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                          <tr>
                            <th className="text-left font-semibold px-4 py-3">
                              Table
                            </th>
                            {privilegeLabels.map((privilege) => (
                              <th
                                key={privilege}
                                className="text-center font-semibold px-3 py-3"
                              >
                                {privilege}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {role.tablePermissions.map((permission) => (
                            <tr key={permission.table}>
                              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                                {permission.table}
                              </td>
                              {privilegeLabels.map((privilege) => {
                                const isAllowed = getPrivilegeValue(
                                  permission,
                                  privilege,
                                );

                                return (
                                  <td
                                    key={privilege}
                                    className="px-3 py-3 text-center"
                                  >
                                    <span
                                      className={`inline-flex min-w-20 justify-center rounded px-2 py-1 text-xs font-semibold ${
                                        isAllowed
                                          ? "bg-green-100 text-green-700"
                                          : "bg-gray-100 text-gray-500"
                                      }`}
                                    >
                                      {isAllowed ? "Allowed" : "Restricted"}
                                    </span>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Restricted means the privilege should remain denied unless
                      a reviewed business requirement justifies it.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                      Notes
                    </h4>
                    <ul className="space-y-2">
                      {notes.map((note, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-gray-700">
                          <span className="text-green-600 font-bold flex-shrink-0">
                            ✓
                          </span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-700 bg-blue-50 border border-blue-200 rounded px-4 py-3 mt-4">
                      Apply only the privileges required for this persona and
                      confirm access in UAT before promoting the solution.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
