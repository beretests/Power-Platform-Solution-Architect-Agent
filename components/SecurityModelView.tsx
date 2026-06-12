"use client";

import React from "react";
import { SecurityRole as SecurityRoleType } from "@/lib/mockResults";

interface SecurityModelViewProps {
  roles?: SecurityRoleType[];
}

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
          Role-based access control with specific permissions for each user
          type.
        </p>
      </div>

      {roles.length === 0 ? (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500">
          No security roles defined
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div
              key={role.name}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-green-900 text-lg">
                  {role.displayName}
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  {role.description}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                    Responsibilities
                  </h4>
                  <ul className="space-y-1">
                    {role.responsibilities.map((resp, idx) => (
                      <li
                        key={idx}
                        className="flex gap-2 text-sm text-gray-700"
                      >
                        <span className="text-green-600 font-bold flex-shrink-0">
                          ✓
                        </span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                    Table Permissions
                  </h4>
                  <div className="space-y-2">
                    {role.tablePermissions.map((perm, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded text-sm"
                      >
                        <span className="font-medium text-gray-900">
                          {perm.table}
                        </span>
                        <div className="flex gap-1">
                          {perm.create && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              C
                            </span>
                          )}
                          {perm.read && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                              R
                            </span>
                          )}
                          {perm.update && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                              U
                            </span>
                          )}
                          {perm.delete && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                              D
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    C=Create, R=Read, U=Update, D=Delete
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
