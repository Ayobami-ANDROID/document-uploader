import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useRouter } from 'next/navigation';

const LandingPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (heroRef.current && featuresRef.current) {
      const heroElements = Array.from(heroRef.current.children);
      const featureElements = Array.from(featuresRef.current.children);

      gsap.fromTo(
        heroElements, 
        { opacity: 0, y: 50 }, 
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.2, 
          duration: 1, 
          ease: 'power3.out' 
        }
      );

      gsap.fromTo(
        featureElements, 
        { opacity: 0, scale: 0.8 }, 
        { 
          opacity: 1, 
          scale: 1, 
          stagger: 0.3, 
          duration: 0.8, 
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%'
          }
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div ref={heroRef} className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            Document Signer & Annotator
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Effortlessly annotate, sign, and manage your PDFs with precision and ease.
          </p>
          <button 
            onClick={() => router.push('/annotate')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition-all"
          >
            Get Started
          </button>
        </div>

        {/* Features Section */}
        <div 
          ref={featuresRef} 
          className="grid md:grid-cols-3 gap-8 mt-24"
        >
          {[
            {
              title: 'Easy Upload',
              description: 'Drag and drop or select PDFs seamlessly',
              icon: '📤'
            },
            {
              title: 'Rich Annotations',
              description: 'Highlight, underline, and comment with ease',
              icon: '✍️'
            },
            {
              title: 'Secure Export',
              description: 'Export annotated documents with high fidelity',
              icon: '🔒'
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-lg text-center"
            >
              <div className="text-6xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;