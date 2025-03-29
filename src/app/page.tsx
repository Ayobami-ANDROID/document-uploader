"use client"
import { useRef, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PDFAnnotator from '@/components/PDFAnnotator';
import { Annotation, AnnotationType } from '../types';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeTool, setActiveTool] = useState<AnnotationType | null>(null);
  const [signatureMode, setSignatureMode] = useState(false);
  const [color, setColor] = useState('#FFD700');
  const [isLoading, setIsLoading] = useState(false);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setIsLoading(true);
        setTimeout(() => {
          setPdfFile(acceptedFiles[0]);
          setIsLoading(false);
          gsap.fromTo('.document-container', 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5 }
          );
        }, 1500); // Simulate processing delay
      }
    },
  });

  const addAnnotation = (annotation: Annotation) => {
    setAnnotations(prev => [...prev, annotation]);
  };

  const updateAnnotation = (id: string, updates: Partial<Annotation>) => {
    setAnnotations(prev => 
      prev.map(ann => ann.id === id ? {...ann, ...updates} : ann)
    );
  };

  const removeAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
  };

  const handleExport = () => {
    // Animation for export button
    gsap.to('.export-btn', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        console.log('Exporting document with annotations:', {
          file: pdfFile,
          annotations
        });
      }
    });
  };

  // Create floating particles
  useEffect(() => {
    if (!particlesRef.current) return;

    const particles = particlesRef.current;
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full bg-blue-200 opacity-30';
      
      // Random size between 2px and 6px
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      particles.appendChild(particle);
      
      // Animate each particle
      gsap.to(particle, {
        x: `${(Math.random() - 0.5) * 40}px`,
        y: `${(Math.random() - 0.5) * 40}px`,
        duration: Math.random() * 10 + 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  }, []);

  // GSAP animations on component mount
  // useEffect(() => {
  //   // Hero section animations
  //   if (heroRef.current) {
  //     gsap.from(heroRef.current.querySelector('h1'), {
  //       y: 40,
  //       opacity: 0,
  //       duration: 1,
  //       ease: 'power3.out'
  //     });
      
  //     gsap.from(heroRef.current.querySelector('p'), {
  //       y: 30,
  //       opacity: 0,
  //       duration: 0.8,
  //       delay: 0.2,
  //       ease: 'power2.out'
  //     });
      
  //     gsap.from(heroRef.current.querySelector('.dropzone-container'), {
  //       y: 20,
  //       opacity: 0,
  //       duration: 0.6,
  //       delay: 0.4,
  //       ease: 'back.out(1.7)'
  //     });
  //   }
    
  //   // Features section animations
  //   if (featuresRef.current) {
  //     gsap.from(featuresRef.current.querySelector('h2'), {
  //       scrollTrigger: {
  //         trigger: featuresRef.current,
  //         start: 'top 80%'
  //       },
  //       y: 30,
  //       opacity: 0,
  //       duration: 0.8
  //     });
      
  //     gsap.from(featuresRef.current.querySelectorAll('.feature-card'), {
  //       scrollTrigger: {
  //         trigger: featuresRef.current,
  //         start: 'top 70%'
  //       },
  //       y: 50,
  //       opacity: 0,
  //       stagger: 0.15,
  //       duration: 0.6,
  //       ease: 'back.out(1.2)'
  //     });
  //   }
    
  //   // Testimonial section animations
  //   if (testimonialRef.current) {
  //     gsap.from(testimonialRef.current.querySelector('.testimonial-card'), {
  //       scrollTrigger: {
  //         trigger: testimonialRef.current,
  //         start: 'top 70%'
  //       },
  //       scale: 0.9,
  //       opacity: 0,
  //       duration: 0.8,
  //       ease: 'power2.out'
  //     });
      
  //     gsap.from(testimonialRef.current.querySelectorAll('.testimonial-item'), {
  //       scrollTrigger: {
  //         trigger: testimonialRef.current,
  //         start: 'top 60%'
  //       },
  //       x: -30,
  //       opacity: 0,
  //       stagger: 0.2,
  //       duration: 0.6
  //     });
  //   }
    
  //   // CTA section animations
  //   if (ctaRef.current) {
  //     gsap.from(ctaRef.current.querySelector('.cta-card'), {
  //       scrollTrigger: {
  //         trigger: ctaRef.current,
  //         start: 'top 70%'
  //       },
  //       y: 40,
  //       opacity: 0,
  //       duration: 0.8,
  //       ease: 'bounce.out'
  //     });
  //   }
  // }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-x-hidden">
      {/* Floating particles background */}
      <div ref={particlesRef} className="fixed inset-0 pointer-events-none z-0" />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-28 px-4 text-center z-10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-800 mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-400">
              Document Signer & Annotation Tool
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your PDF workflow with our intuitive annotation, signing, and collaboration platform.
          </p>
          
          {!pdfFile && (
            <div 
              {...getRootProps()} 
              className={`dropzone-container mt-10 p-8 border-2 border-dashed rounded-xl max-w-2xl mx-auto cursor-pointer transition-all backdrop-blur-sm bg-white/70 ${
                isDragActive ? 'border-blue-500 bg-blue-50/80 shadow-lg' : 'border-gray-300 hover:border-blue-400 hover:shadow-md'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-4">
                {isLoading ? (
                  <>
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-lg font-medium text-gray-700">Processing your document...</p>
                  </>
                ) : (
                  <>
                    <svg className="w-14 h-14 text-blue-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-lg font-medium text-gray-700">
                      {isDragActive ? 'Drop your PDF here' : 'Drag & drop a PDF file, or click to select'}
                    </p>
                    <p className="text-sm text-gray-500">Supports all standard PDF documents</p>
                    <div className="flex space-x-2 mt-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Secure</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Fast</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">No Ads</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-16">
            Powerful Features for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Seamless Workflow</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
                title: "Rich Annotations",
                description: "Highlight, underline, strikeout, and add comments to your documents with pixel-perfect precision.",
                color: "text-blue-500"
              },
              {
                icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                title: "Digital Signatures",
                description: "Draw, upload, or type your signature with multiple style options for professional-looking documents.",
                color: "text-green-500"
              },
              {
                icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
                title: "Export Options",
                description: "Save annotated documents in multiple formats including PDF, PNG, and shareable links.",
                color: "text-purple-500"
              },
              {
                icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
                title: "Real-time Collaboration",
                description: "Work simultaneously with team members and see changes as they happen.",
                color: "text-yellow-500"
              },
              {
                icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
                title: "Version Control",
                description: "Track changes, revert to previous versions, and compare document states.",
                color: "text-red-500"
              },
              {
                icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                title: "Secure Storage",
                description: "Documents are encrypted in transit and at rest with enterprise-grade security.",
                color: "text-teal-500"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="feature-card bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                <div className={`${feature.color} mb-6 text-4xl`}>
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Documents Processed" },
              { number: "95%", label: "User Satisfaction" },
              { number: "24/7", label: "Availability" },
              { number: "99.9%", label: "Uptime" }
            ].map((stat, index) => (
              <div key={index} className="opacity-0 stat-item">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-sm md:text-base opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialRef} className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">Trusted by Professionals</h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their document workflow
          </p>
          
          <div className="testimonial-card bg-blue-50 rounded-2xl p-8 md:p-12 mb-16 shadow-inner">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <div className="text-5xl font-bold text-blue-800 mb-4">"</div>
                <p className="text-xl text-gray-700 mb-6">
                  This tool has completely changed how our legal team handles document reviews. The annotation features save us hours each week, and the signature workflow is incredibly smooth.
                </p>
                <div className="font-semibold text-blue-800">Sarah Johnson</div>
                <div className="text-sm text-gray-500">Legal Director, TechCorp</div>
              </div>
              <div className="md:w-1/2 bg-white p-6 rounded-xl shadow-md">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "The perfect balance of simplicity and powerful features. Our sales team can now sign contracts on the go!",
                author: "Michael Chen",
                role: "Sales Manager",
                avatar: "MC"
              },
              {
                quote: "As an educator, I appreciate how easy it is to provide feedback on student papers. The highlight tools are fantastic.",
                author: "Dr. Emily Wilson",
                role: "University Professor",
                avatar: "EW"
              },
              {
                quote: "Implementation was seamless and our accounting department adopted it immediately for invoice approvals.",
                author: "Robert Garcia",
                role: "CFO",
                avatar: "RG"
              }
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-item opacity-0 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="cta-card bg-white p-8 md:p-12 rounded-2xl shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6">Ready to Transform Your Document Workflow?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who save time and collaborate better with our platform.
            </p>
            {!pdfFile ? (
              <button 
                {...getRootProps()} 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <input {...getInputProps()} />
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Your First Document
              </button>
            ) : (
              <button 
                onClick={handleExport}
                className="export-btn inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-teal-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Your Document
              </button>
            )}
            <p className="mt-4 text-sm text-gray-500">No credit card required. Get started in seconds.</p>
          </div>
        </div>
      </section>

      {/* Document Workspace */}
      {pdfFile && (
        <section className="py-12 px-4 max-w-7xl mx-auto relative z-20">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
            <PDFAnnotator 
              file={pdfFile}
              annotations={annotations}
              addAnnotation={addAnnotation}
              updateAnnotation={updateAnnotation}
              removeAnnotation={removeAnnotation}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              signatureMode={signatureMode}
              setSignatureMode={setSignatureMode}
              color={color}
              setColor={setColor}
              onExport={handleExport}
            />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-300">DocSign</h3>
              <p className="text-gray-400">The ultimate document annotation and signing platform for modern teams.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-300">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-300">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-300">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} DocSign. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}