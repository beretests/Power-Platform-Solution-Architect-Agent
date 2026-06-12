"use client";

import React, { useEffect, useId, useState } from "react";
import { Check, Copy } from "lucide-react";

interface MermaidDiagramProps {
  diagram?: string;
  title?: string;
}

const defaultDiagram = "graph LR\n    A[Start] --> B[Process]\n    B --> C[End]";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "The Mermaid source could not be rendered.";
};

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  diagram = defaultDiagram,
  title = "Architecture Diagram",
}) => {
  const reactId = useId();
  const diagramId = `mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const [isRendering, setIsRendering] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  useEffect(() => {
    let isActive = true;

    const renderDiagram = async () => {
      if (!diagram.trim()) {
        setSvg("");
        setError("No Mermaid source provided.");
        return;
      }

      setIsRendering(true);
      setError("");
      setSvg("");

      try {
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;

        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "strict",
        });

        const { svg: renderedSvg } = await mermaid.render(
          `${diagramId}-${Date.now()}`,
          diagram,
        );

        if (isActive) {
          setSvg(renderedSvg);
        }
      } catch (renderError) {
        if (isActive) {
          setError(getErrorMessage(renderError));
        }
      } finally {
        if (isActive) {
          setIsRendering(false);
        }
      }
    };

    renderDiagram();

    return () => {
      isActive = false;
    };
  }, [diagram, diagramId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(diagram);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 1600);
    } catch {
      setCopyStatus("failed");
      window.setTimeout(() => setCopyStatus("idle"), 2200);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex w-fit items-center gap-2 rounded border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {copyStatus === "copied" ? (
            <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
          {copyStatus === "copied" ? "Copied" : "Copy Mermaid"}
        </button>
      </div>

      {copyStatus === "failed" && (
        <p className="text-sm text-red-700">
          Copy failed. Select the Mermaid source below and copy it manually.
        </p>
      )}

      <div className="border border-gray-200 rounded-lg bg-white overflow-x-auto p-4 min-h-96">
        {isRendering && (
          <div className="flex h-80 items-center justify-center text-sm text-gray-500">
            Rendering diagram...
          </div>
        )}

        {!isRendering && error && (
          <div className="space-y-3 rounded border border-red-200 bg-red-50 p-4 text-red-800">
            <div>
              <p className="font-semibold">Failed to render diagram</p>
              <p className="text-sm">{error}</p>
            </div>
            <pre className="max-h-80 overflow-auto rounded border border-red-100 bg-white p-3 text-xs text-gray-800">
              {diagram}
            </pre>
          </div>
        )}

        {!isRendering && !error && svg && (
          <div
            className="flex min-h-80 items-center justify-center [&_svg]:max-w-full [&_svg]:h-auto"
            aria-label={title}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}
      </div>
    </div>
  );
};
