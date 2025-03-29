export type AnnotationType = 'highlight' | 'underline' | 'comment' | 'signature';

export interface Annotation {
  id: string;
  type: AnnotationType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: string;
  page: number;
  content?: string;
  pathData?: string; // For storing signature paths
}

export interface DocumentViewerProps {
  file: File;
  annotations: Annotation[];
  addAnnotation: (annotation: Annotation) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  removeAnnotation: (id: string) => void;
  activeTool: AnnotationType | null;
  signatureMode: boolean;
  setSignatureMode: (mode: boolean) => void;
  color: string;
}

export interface ToolbarProps {
  activeTool: AnnotationType | null;
  setActiveTool: (tool: AnnotationType | null) => void;
  signatureMode: boolean;
  setSignatureMode: (mode: boolean) => void;
  onExport: () => void;
  color: string;
  setColor: (color: string) => void;
}