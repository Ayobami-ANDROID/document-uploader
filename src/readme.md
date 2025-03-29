# Document Signer & Annotation Tool

## Overview

This is a modern PDF annotation and signing tool built with Next.js that allows users to:

- Upload PDF documents via drag-and-drop or file selection
- Annotate documents with highlights, underlines, and comments
- Add digital signatures to documents
- Export annotated documents while preserving all modifications

## Features

### Core Functionality
- **PDF Upload**: Drag-and-drop interface with loading state
- **Annotation Tools**:
  - Highlight text with customizable colors
  - Underline text with customizable colors
  - Add text comments with double-click functionality
  - Draw signatures with mouse/touch
- **Document Export**: Save annotated PDFs with all modifications

### UI/UX Highlights
- Responsive design that works on all screen sizes
- Animated transitions and visual feedback
- Clean, intuitive interface with clear tool selection
- Professional color scheme and typography

## Technologies Used

- **Next.js**: React framework for server-side rendering and static generation
- **React Dropzone**: For drag-and-drop file upload functionality
- **PDF-lib**: For PDF manipulation and annotation embedding
- **GSAP**: For smooth animations and scroll-triggered effects
- **Tailwind CSS**: For utility-first styling and responsive design
- **TypeScript**: For type safety and better developer experience

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/document-annotator.git
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/document-annotator
├── components/            # React components
│   ├── PDFAnnotator.tsx   # Main annotation component
│   └── Toolbar.tsx        # Annotation tools component
├── pages/
│   ├── _app.tsx           # Next.js app wrapper
│   └── index.tsx          # Main page
├── public/                # Static files
├── styles/                # Global styles
├── types/                 # TypeScript type definitions
├── README.md              # This file
└── package.json           # Project dependencies
```

## Challenges & Solutions

1. **PDF Annotation Rendering**:
   - Challenge: Rendering annotations on top of PDF while maintaining positions
   - Solution: Used canvas overlay with precise coordinate mapping

2. **Signature Drawing**:
   - Challenge: Capturing smooth signature paths
   - Solution: Implemented path tracking with mouse events and optimized rendering

3. **PDF Export with Annotations**:
   - Challenge: Embedding annotations into the original PDF
   - Solution: Used pdf-lib to modify the PDF document directly

## Future Improvements

If I had more time, I would:

1. Add multi-page PDF support with pagination controls
2. Implement real-time collaboration features
3. Add user authentication for saving documents
4. Create a version history system
5. Add more annotation types (strikeout, shapes, etc.)
6. Implement touch support for mobile devices
7. Add document preview thumbnails
8. Implement annotation grouping and layers

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.