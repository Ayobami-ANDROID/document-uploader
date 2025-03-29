import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument } from 'pdf-lib';

// Ensure worker is configured
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface Annotation {
  id: string;
  type: 'highlight' | 'underline' | 'comment' | 'signature';
  color: string;
  text?: string;
  pageNumber: number;
  rect: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}

const PDFAnnotator: React.FC<{ file: File }> = ({ file }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentTool, setCurrentTool] = useState<Annotation['type']>('highlight');
  const [color, setColor] = useState<string>('#ffff00');
  const [selectedText, setSelectedText] = useState<{
    pageNumber: number;
    text: string;
    rect: DOMRect;
  } | null>(null);

  // Signature state
  const [signature, setSignature] = useState<string | null>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  // Text selection handling
  const handleTextSelection = (event: React.MouseEvent, pageNumber: number) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setSelectedText({
        pageNumber,
        text: selection.toString().trim(),
        rect
      });
    }
  };

  // Annotation creation
  const createAnnotation = () => {
    if (!selectedText) return;

    const newAnnotation: Annotation = {
      id: `${Date.now()}`,
      type: currentTool,
      color,
      text: selectedText.text,
      pageNumber: selectedText.pageNumber,
      rect: {
        left: selectedText.rect.left,
        top: selectedText.rect.top,
        width: selectedText.rect.width,
        height: selectedText.rect.height
      }
    };

    // Group similar annotations
    const existingAnnotations = annotations.filter(
      a => a.text === newAnnotation.text && a.type === newAnnotation.type
    );

    if (existingAnnotations.length === 0) {
      setAnnotations([...annotations, newAnnotation]);
    }

    // Clear selection
    window.getSelection()?.removeAllRanges();
    setSelectedText(null);
  };

  // Signature upload
  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSignature(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Place signature
  const placeSignature = (pageNumber: number, event: React.MouseEvent) => {
    if (!signature) return;

    const pageElement = event.currentTarget;
    const rect = (pageElement as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newAnnotation: Annotation = {
      id: `${Date.now()}`,
      type: 'signature',
      color: 'transparent',
      pageNumber,
      rect: {
        left: x,
        top: y,
        width: 150,  // Default signature width
        height: 50   // Default signature height
      }
    };

    setAnnotations([...annotations, newAnnotation]);
  };

  return (
    <div className="flex">
      {/* Toolbar */}
      <div className="w-64 p-4 bg-gray-100 space-y-4">
        {/* Annotation Tools */}
        <div className="space-y-2">
          <button 
            onClick={() => setCurrentTool('highlight')}
            className={`w-full p-2 ${currentTool === 'highlight' ? 'bg-yellow-500' : 'bg-white'}`}
          >
            Highlight
          </button>
          <button 
            onClick={() => setCurrentTool('underline')}
            className={`w-full p-2 ${currentTool === 'underline' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            Underline
          </button>
          <input 
            type="color" 
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Signature Upload */}
        <div className="mt-4">
          <input 
            type="file" 
            ref={signatureInputRef}
            onChange={handleSignatureUpload}
            accept="image/*"
            className="hidden"
          />
          <button 
            onClick={() => signatureInputRef.current?.click()}
            className="w-full bg-green-500 text-white p-2"
          >
            Upload Signature
          </button>
        </div>

        {/* Annotation Creation */}
        {selectedText && (
          <button 
            onClick={createAnnotation}
            className="w-full bg-purple-500 text-white p-2 mt-2"
          >
            {`Add ${currentTool}`}
          </button>
        )}
      </div>

      {/* PDF Viewer */}
      <div className="flex-grow">
        <Document file={file} onLoadSuccess={({numPages}) => setNumPages(numPages)}>
          {Array.from(new Array(numPages), (el, index) => (
            <div 
              key={`page_${index + 1}`} 
              className="relative"
              onMouseUp={(e) => handleTextSelection(e, index + 1)}
              onClick={(e) => currentTool === 'signature' && placeSignature(index + 1, e)}
            >
              <Page pageNumber={index + 1} />
              
              {/* Render Annotations */}
              {annotations
                .filter(a => a.pageNumber === index + 1)
                .map((annotation) => (
                  <div 
                    key={annotation.id}
                    style={{
                      position: 'absolute',
                      left: annotation.rect.left,
                      top: annotation.rect.top,
                      width: annotation.rect.width,
                      height: annotation.rect.height,
                      backgroundColor: 
                        annotation.type === 'highlight' ? annotation.color : 'transparent',
                      borderBottom: 
                        annotation.type === 'underline' 
                          ? `3px solid ${annotation.color}` 
                          : 'none',
                      opacity: 0.5,
                      pointerEvents: 'none'
                    }}
                  >
                    {annotation.type === 'signature' && signature && (
                      <img 
                        src={signature} 
                        alt="Signature" 
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%'
                        }}
                      />
                    )}
                  </div>
                ))}
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PDFAnnotator;