"use client"
import { AnnotationType } from '../types';

interface ToolbarProps {
  activeTool: AnnotationType | null;
  setActiveTool: (tool: AnnotationType | null) => void;
  signatureMode: boolean;
  setSignatureMode: (mode: boolean) => void;
  onExport: () => void;
  color: string;
  setColor: (color: string) => void;
}

export default function Toolbar({
  activeTool,
  setActiveTool,
  signatureMode,
  setSignatureMode,
  onExport,
  color,
  setColor
}: ToolbarProps) {
  const colors = [
    '#FFD700', // Yellow
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#A78BFA', // Purple
  ];

  const handleToolClick = (tool: AnnotationType) => {
    if (activeTool === tool) {
      setActiveTool(null);
    } else {
      setActiveTool(tool);
      setSignatureMode(false);
    }
  };

  const handleSignatureClick = () => {
    setSignatureMode(!signatureMode);
    setActiveTool(null);
  };

  return (
    <div className="toolbar bg-gray-800 text-white p-3 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleToolClick('highlight')}
          className={`px-3 py-1 rounded ${activeTool === 'highlight' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          Highlight
        </button>
        <button
          onClick={() => handleToolClick('underline')}
          className={`px-3 py-1 rounded ${activeTool === 'underline' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          Underline
        </button>
        <button
          onClick={() => handleToolClick('comment')}
          className={`px-3 py-1 rounded ${activeTool === 'comment' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          Comment
        </button>
        <button
          onClick={handleSignatureClick}
          className={`px-3 py-1 rounded ${signatureMode ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          Signature
        </button>
      </div>
      
      <div className="flex items-center space-x-2">
        {(activeTool === 'highlight' || activeTool === 'underline') && (
          <div className="flex space-x-1">
            {colors.map((c) => (
              <button
                key={c}
                className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        )}
        <button
          onClick={onExport}
          className="px-4 py-1 bg-green-600 rounded hover:bg-green-700"
        >
          Export PDF
        </button>
      </div>
    </div>
  );
}