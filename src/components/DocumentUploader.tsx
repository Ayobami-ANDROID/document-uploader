"use client"
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { gsap } from 'gsap';

interface DocumentUploaderProps {
  onUpload: (file: File) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length > 0) {
      const file = pdfFiles[0];
      onUpload(file);
      
      // GSAP Animation for upload
      gsap.fromTo(
        '.upload-zone', 
        { scale: 1 }, 
        { 
          scale: 1.05, 
          duration: 0.3, 
          yoyo: true, 
          repeat: 1,
          ease: 'power1.inOut' 
        }
      );
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`
        upload-zone border-2 border-dashed rounded-lg p-12 text-center 
        transition-all duration-300 cursor-pointer
        ${isDragActive 
          ? 'border-indigo-500 bg-indigo-50' 
          : 'border-gray-300 hover:border-indigo-500'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="mx-auto h-16 w-16 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
        <p className="mt-4 text-gray-600">
          {isDragActive 
            ? 'Drop PDF here' 
            : 'Drag & drop a PDF, or click to select'}
        </p>
        <em className="text-xs text-gray-500">
          (Only *.pdf files will be accepted)
        </em>
      </div>
    </div>
  );
};

export default DocumentUploader;