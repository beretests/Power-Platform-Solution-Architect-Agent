"use client";

import React from "react";
import { DataverseTable } from "@/lib/mockResults";

interface DataverseSchemaViewProps {
  tables?: DataverseTable[];
}

const typeColorMap: Record<string, { bg: string; text: string; icon: string }> =
  {
    Text: { bg: "bg-blue-100", text: "text-blue-700", icon: "📝" },
    "Text Area": { bg: "bg-blue-100", text: "text-blue-700", icon: "📝" },
    Number: { bg: "bg-purple-100", text: "text-purple-700", icon: "🔢" },
    Date: { bg: "bg-green-100", text: "text-green-700", icon: "📅" },
    DateTime: { bg: "bg-green-100", text: "text-green-700", icon: "⏰" },
    "Option Set": { bg: "bg-amber-100", text: "text-amber-700", icon: "📋" },
    "Two Options": { bg: "bg-amber-100", text: "text-amber-700", icon: "✓" },
    Lookup: { bg: "bg-pink-100", text: "text-pink-700", icon: "🔗" },
    Calculated: { bg: "bg-indigo-100", text: "text-indigo-700", icon: "⚙️" },
    Currency: { bg: "bg-green-100", text: "text-green-700", icon: "💰" },
  };

export const DataverseSchemaView: React.FC<DataverseSchemaViewProps> = ({
  tables = [],
}) => {
  if (tables.length === 0) {
    return (
      <div className="p-8 bg-gray-50 rounded-lg border-2 border-gray-200 text-center">
        <p className="text-gray-500 font-medium">No Dataverse tables defined</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {tables.map((table, tableIdx) => {
        const ownershipEmoji =
          {
            User: "👤",
            Team: "👥",
            "Business Unit": "🏢",
            Organization: "🏛️",
          }[table.ownershipType || "User"] || "👤";

        return (
          <div
            key={table.name}
            className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white px-8 py-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {table.displayName}
                  </h3>
                  <p className="text-blue-100 font-medium">
                    {table.description}
                  </p>
                </div>
                <div className="text-4xl">{ownershipEmoji}</div>
              </div>

              {/* Header Badges */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-blue-800">
                {table.ownershipType && (
                  <div className="bg-white/20 border border-white/40 rounded-full px-3 py-1 text-sm font-semibold">
                    <span className="text-white">
                      Ownership: {table.ownershipType}
                    </span>
                  </div>
                )}
                {table.primaryKey && table.primaryKey.length > 0 && (
                  <div className="bg-white/20 border border-white/40 rounded-full px-3 py-1 text-sm font-semibold">
                    <span className="text-white">
                      🔑 {table.primaryKey.length} Key(s)
                    </span>
                  </div>
                )}
                <div className="bg-white/20 border border-white/40 rounded-full px-3 py-1 text-sm font-semibold">
                  <span className="text-white">
                    📊 {table.columns.length} Column(s)
                  </span>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="p-8 space-y-8 bg-white">
              {/* Columns Section */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📋 Column Specifications</span>
                  <span className="text-sm font-normal text-gray-500">
                    ({table.columns.length} columns)
                  </span>
                </h4>

                <div className="grid gap-3">
                  {table.columns.map((col, colIdx) => {
                    const colTypeInfo = typeColorMap[col.type] || {
                      bg: "bg-gray-100",
                      text: "text-gray-700",
                      icon: "?",
                    };

                    return (
                      <div
                        key={colIdx}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50/30 transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 text-base mb-1">
                              {col.displayName}
                            </h5>
                            <p className="text-xs text-gray-500 font-mono mb-2">
                              {col.name}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {col.required && (
                              <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                                REQUIRED
                              </span>
                            )}
                            <span
                              className={`${colTypeInfo.bg} ${colTypeInfo.text} text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1`}
                            >
                              <span>{colTypeInfo.icon}</span>
                              {col.type}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">
                          {col.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Primary Key Section */}
              {table.primaryKey && table.primaryKey.length > 0 && (
                <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-indigo-900 mb-3 flex items-center gap-2">
                    <span>🔑</span>
                    Primary Key
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {table.primaryKey.map((keyCol, idx) => (
                      <span
                        key={idx}
                        className="bg-indigo-100 text-indigo-800 font-medium px-4 py-2 rounded-lg border border-indigo-300"
                      >
                        {keyCol}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Relationships Section */}
              {table.relationships && table.relationships.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>🔗 Relationships</span>
                    <span className="text-sm font-normal text-gray-500">
                      ({table.relationships.length} related table(s))
                    </span>
                  </h4>

                  <div className="grid gap-3">
                    {table.relationships.map((rel, relIdx) => (
                      <div
                        key={relIdx}
                        className="border border-pink-200 bg-pink-50 rounded-lg p-4 hover:border-pink-400 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🔗</span>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {rel.target}
                            </p>
                            <p className="text-sm text-gray-600">
                              {rel.relationship}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Auditing Recommendation Section */}
              {table.auditingRecommendation && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-yellow-900 mb-2 flex items-center gap-2">
                    <span>📏</span>
                    Auditing &amp; Compliance
                  </h4>
                  <p className="text-yellow-800 font-medium leading-relaxed">
                    {table.auditingRecommendation}
                  </p>
                </div>
              )}

              {/* Technical Details Footer */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 pt-3 flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-500 font-mono text-xs">
                    Internal Name:{" "}
                    <span className="text-gray-700 font-semibold">
                      {table.name}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-xs font-medium">
                    Table {tableIdx + 1} of {tables.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
