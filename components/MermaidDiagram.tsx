"use client";

import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  diagram?: string;
  title?: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  diagram = "graph LR\n    A[Start] --> B[Process]\n    B --> C[End]",
  title = "Architecture Diagram",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !diagram) return;

      try {
        // Initialize mermaid
        mermaid.initialize({ startOnLoad: true, theme: "default" });

        // Clear previous content
        containerRef.current.innerHTML = "";

        // Create a unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        // Create a div for the diagram
        const mermaidDiv = document.createElement("div");
        mermaidDiv.className = "mermaid";
        mermaidDiv.id = id;
        mermaidDiv.textContent = diagram;

        containerRef.current.appendChild(mermaidDiv);

        // Render the diagram
        await mermaid.contentLoaded();
      } catch (error) {
        console.error("Error rendering mermaid diagram:", error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="p-4 bg-red-50 border border-red-200 rounded text-red-700">
              <p class="font-semibold mb-2">Failed to render diagram</p>
              <pre class="text-xs overflow-x-auto bg-white p-2 border border-red-100 rounded">${diagram}</pre>
            </div>
          `;
        }
      }
    };

    renderDiagram();
  }, [diagram]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div
        ref={containerRef}
        className="border border-gray-200 rounded-lg bg-white overflow-x-auto p-4 min-h-96"
      />
    </div>
  );
};
