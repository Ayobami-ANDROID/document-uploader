"use client"
import { useState, useRef, useEffect } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { Annotation, AnnotationType } from '@/types';

export default function PDFAnnotator({
  file,
  annotations,
  addAnnotation,
  updateAnnotation,
  removeAnnotation,
  activeTool,
  setActiveTool,
  signatureMode,
  setSignatureMode,
  color,
  setColor,
  onExport
}: {
  file: File;
  annotations: Annotation[];
  addAnnotation: (annotation: Annotation) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  removeAnnotation: (id: string) => void;
  activeTool: AnnotationType | null;
  setActiveTool: (tool: AnnotationType | null) => void;
  signatureMode: boolean;
  setSignatureMode: (mode: boolean) => void;
  color: string;
  setColor: (color: string) => void;
  onExport: () => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 1000 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [signaturePath, setSignaturePath] = useState<{x: number, y: number}[]>([]);
  const commentInputRef = useRef<HTMLInputElement>(null);

  // Calculate dimensions based on container width
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current && dimensions.width > 0) {
        const containerWidth = containerRef.current.clientWidth - 40;
        const newScale = Math.min(1, containerWidth / dimensions.width);
        setScale(newScale);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [dimensions.width]);

  // Load PDF
  useEffect(() => {
    const loadPdf = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setTotalPages(pdfDoc.getPageCount());

        const page = pdfDoc.getPage(0);
        const { width, height } = page.getSize();
        setDimensions({ width, height });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setPdfUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPdf();
  }, [file]);

  // Draw annotations on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all annotations
    annotations
      .filter(anno => anno.page === currentPage)
      .forEach(annotation => {
        const { x, y } = annotation.position;
        const { width, height } = annotation.size;

        if (annotation.type === 'highlight') {
          ctx.fillStyle = annotation.color;
          ctx.globalAlpha = 0.4;
          ctx.fillRect(x, y, width, height);
          ctx.globalAlpha = 1.0;
        } else if (annotation.type === 'underline') {
          ctx.strokeStyle = annotation.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + width, y);
          ctx.stroke();
        } else if (annotation.type === 'comment') {
          ctx.fillStyle = '#FFFF88';
          ctx.fillRect(x, y, width, height);
          ctx.strokeStyle = '#000000';
          ctx.strokeRect(x, y, width, height);
          ctx.fillStyle = '#000000';
          ctx.font = '12px Arial';
          
          // Split text into lines that fit within the comment box
          const lines = [];
          const maxWidth = width - 10;
          const lineHeight = 15;
          let currentLine = '';
          
          (annotation.content || '').split(' ').forEach(word => {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width <= maxWidth) {
              currentLine = testLine;
            } else {
              lines.push(currentLine);
              currentLine = word;
            }
          });
          if (currentLine) lines.push(currentLine);
          
          // Draw each line
          lines.forEach((line, i) => {
            ctx.fillText(line, x + 5, y + 20 + (i * lineHeight));
          });
        } else if (annotation.type === 'signature' && annotation.pathData) {
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.beginPath();
          
          const path = JSON.parse(annotation.pathData);
          if (path.length > 0) {
            ctx.moveTo(path[0].x, path[0].y);
            for (let i = 1; i < path.length; i++) {
              ctx.lineTo(path[i].x, path[i].y);
            }
            ctx.stroke();
          }
        }
      });

    // Draw current signature in progress
    if (signatureMode && signaturePath.length > 0) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(signaturePath[0].x, signaturePath[0].y);
      for (let i = 1; i < signaturePath.length; i++) {
        ctx.lineTo(signaturePath[i].x, signaturePath[i].y);
      }
      ctx.stroke();
    }
  }, [annotations, currentPage, scale, signatureMode, signaturePath]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeCommentId) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    if (signatureMode) {
      setSignaturePath([{x, y}]);
      setIsDrawing(true);
      return;
    }

    if (activeTool === 'comment' && e.detail === 1) {
      const newAnnotation: Annotation = {
        id: `anno-${Date.now()}`,
        type: 'comment',
        position: { x, y },
        size: { width: 150, height: 50 },
        color: '#FFFF88',
        page: currentPage,
        content: 'Double click to edit'
      };
      addAnnotation(newAnnotation);
      return;
    }

    if (activeTool) {
      setStartPos({ x, y });
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    if (signatureMode) {
      setSignaturePath(prev => [...prev, {x, y}]);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    annotations
      .filter(anno => anno.page === currentPage)
      .forEach(annotation => {
        const { x, y } = annotation.position;
        const { width, height } = annotation.size;

        if (annotation.type === 'highlight') {
          ctx.fillStyle = annotation.color;
          ctx.globalAlpha = 0.4;
          ctx.fillRect(x, y, width, height);
          ctx.globalAlpha = 1.0;
        } else if (annotation.type === 'underline') {
          ctx.strokeStyle = annotation.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + width, y);
          ctx.stroke();
        } else if (annotation.type === 'comment') {
          ctx.fillStyle = '#FFFF88';
          ctx.fillRect(x, y, width, height);
          ctx.strokeStyle = '#000000';
          ctx.strokeRect(x, y, width, height);
          ctx.fillStyle = '#000000';
          ctx.font = '12px Arial';
          ctx.fillText(annotation.content || 'Comment', x + 5, y + 20);
        } else if (annotation.type === 'signature' && annotation.pathData) {
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.beginPath();
          const path = JSON.parse(annotation.pathData);
          if (path.length > 0) {
            ctx.moveTo(path[0].x, path[0].y);
            for (let i = 1; i < path.length; i++) {
              ctx.lineTo(path[i].x, path[i].y);
            }
            ctx.stroke();
          }
        }
      });

    const width = x - startPos.x;
    const height = y - startPos.y;

    if (activeTool === 'highlight') {
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(startPos.x, startPos.y, width, height);
      ctx.globalAlpha = 1.0;
    } else if (activeTool === 'underline') {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(startPos.x + width, startPos.y);
      ctx.stroke();
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (signatureMode) {
      if (signaturePath.length > 5) {
        const minX = Math.min(...signaturePath.map(p => p.x));
        const maxX = Math.max(...signaturePath.map(p => p.x));
        const minY = Math.min(...signaturePath.map(p => p.y));
        const maxY = Math.max(...signaturePath.map(p => p.y));

        const newAnnotation: Annotation = {
          id: `anno-${Date.now()}`,
          type: 'signature',
          position: { x: minX, y: minY },
          size: { 
            width: maxX - minX,
            height: maxY - minY
          },
          color: '#000000',
          page: currentPage,
          pathData: JSON.stringify(signaturePath)
        };
        addAnnotation(newAnnotation);
      }
      setSignaturePath([]);
      setIsDrawing(false);
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const width = x - startPos.x;
    const height = y - startPos.y;

    if (activeTool === 'highlight' || activeTool === 'underline') {
      if (Math.abs(width) > 5 || Math.abs(height) > 5) {
        const newAnnotation: Annotation = {
          id: `anno-${Date.now()}`,
          type: activeTool,
          position: { x: startPos.x, y: startPos.y },
          size: { width, height: activeTool === 'underline' ? 2 : height },
          color,
          page: currentPage,
        };
        addAnnotation(newAnnotation);
      }
    }

    setIsDrawing(false);
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'comment' && !signatureMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const clickedComment = annotations
      .filter(anno => anno.page === currentPage && anno.type === 'comment')
      .find(anno => {
        return x >= anno.position.x && 
               x <= anno.position.x + anno.size.width &&
               y >= anno.position.y && 
               y <= anno.position.y + anno.size.height;
      });

    if (clickedComment) {
      setActiveCommentId(clickedComment.id);
      setCommentText(clickedComment.content || '');
      setTimeout(() => commentInputRef.current?.focus(), 0);
    }
  };

  const saveComment = (id: string) => {
    updateAnnotation(id, { content: commentText });
    setActiveCommentId(null);
  };

  const handleExport = async () => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const page = pdfDoc.getPage(currentPage - 1);

      annotations
        .filter(anno => anno.page === currentPage)
        .forEach(annotation => {
          const { x, y } = annotation.position;
          const { width, height } = annotation.size;

          if (annotation.type === 'highlight') {
            page.drawRectangle({
              x,
              y: dimensions.height - y - height,
              width,
              height,
              color: rgb(1, 1, 0),
              opacity: 0.4,
            });
          } else if (annotation.type === 'underline') {
            page.drawLine({
              start: { x, y: dimensions.height - y },
              end: { x: x + width, y: dimensions.height - y },
              thickness: 2,
              color: rgb(1, 0, 0),
            });
          } else if (annotation.type === 'comment') {
            page.drawRectangle({
              x,
              y: dimensions.height - y - height,
              width,
              height,
              color: rgb(1, 1, 0.53),
              opacity: 0.7,
            });
            page.drawText(annotation.content || '', {
              x: x + 5,
              y: dimensions.height - y - height + 15,
              size: 12,
              color: rgb(0, 0, 0),
            });
          } else if (annotation.type === 'signature' && annotation.pathData) {
            const path = JSON.parse(annotation.pathData);
            if (path.length > 1) {
              for (let i = 1; i < path.length; i++) {
                page.drawLine({
                  start: { 
                    x: path[i-1].x, 
                    y: dimensions.height - path[i-1].y 
                  },
                  end: { 
                    x: path[i].x, 
                    y: dimensions.height - path[i].y 
                  },
                  thickness: 2,
                  color: rgb(0, 0, 0),
                });
              }
            }
          }
        });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'annotated-document.pdf';
      a.click();
      onExport();
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  return (
    <div className="pdf-annotator w-full">
      <div className="toolbar bg-gray-800 text-white p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => { setActiveTool('highlight'); setSignatureMode(false); }}
            className={`px-3 py-1 rounded ${activeTool === 'highlight' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Highlight
          </button>
          <button
            onClick={() => { setActiveTool('underline'); setSignatureMode(false); }}
            className={`px-3 py-1 rounded ${activeTool === 'underline' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Underline
          </button>
          <button
            onClick={() => { setActiveTool('comment'); setSignatureMode(false); }}
            className={`px-3 py-1 rounded ${activeTool === 'comment' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Comment
          </button>
          <button
            onClick={() => { setSignatureMode(!signatureMode); setActiveTool(null); }}
            className={`px-3 py-1 rounded ${signatureMode ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Signature
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {(activeTool === 'highlight' || activeTool === 'underline') && (
            <div className="flex space-x-1">
              {['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#A78BFA'].map((c) => (
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
            onClick={handleExport}
            className="px-4 py-1 bg-green-600 rounded hover:bg-green-700"
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="document-container p-4 w-full">
        <div 
          ref={containerRef}
          className="relative border rounded-lg overflow-hidden w-full flex justify-center bg-gray-100"
          style={{ minHeight: `${dimensions.height * scale}px` }}
        >
          {pdfUrl && (
            <div className="relative" style={{ 
              width: `${dimensions.width * scale}px`,
              height: `${dimensions.height * scale}px`
            }}>
              <iframe 
                src={pdfUrl} 
                className="w-full h-full border-none"
                title="PDF Viewer"
              />
              <canvas
                ref={canvasRef}
                width={dimensions.width}
                height={dimensions.height}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: (activeTool || signatureMode) ? 'auto' : 'none',
                }}
                onMouseDown={handleMouseDown}
                onDoubleClick={handleDoubleClick}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              />
              
              {/* Comment edit overlay */}
              {activeCommentId && (
                <div 
                  className="absolute bg-yellow-100 p-2 border border-gray-300 shadow-lg"
                  style={{
                    left: `${annotations.find(a => a.id === activeCommentId)?.position.x || 0}px`,
                    top: `${annotations.find(a => a.id === activeCommentId)?.position.y || 0}px`,
                    width: `${annotations.find(a => a.id === activeCommentId)?.size.width || 150}px`,
                    height: `${annotations.find(a => a.id === activeCommentId)?.size.height || 50}px`,
                  }}
                >
                  <input
                    ref={commentInputRef}
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onBlur={() => saveComment(activeCommentId)}
                    onKeyDown={(e) => e.key === 'Enter' && saveComment(activeCommentId)}
                    className="w-full h-full bg-transparent outline-none"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}