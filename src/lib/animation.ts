import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initHeroAnimations = () => {
  gsap.fromTo('.hero-title', 
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1 }
  );
  
  gsap.fromTo('.hero-subtitle', 
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, delay: 0.3 }
  );
  
  gsap.fromTo('.hero-cta', 
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, delay: 0.6 }
  );
};

export const initFeatureAnimations = () => {
  gsap.utils.toArray('.feature-card').forEach((card: any) => {
    gsap.fromTo(card, 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
        }
      }
    );
  });
};

export const initToolbarAnimations = () => {
  gsap.fromTo('.toolbar-item', 
    { x: -20, opacity: 0 },
    { 
      x: 0, 
      opacity: 1, 
      stagger: 0.1,
      duration: 0.4,
      scrollTrigger: {
        trigger: '.toolbar-container',
        start: "top 80%",
      }
    }
  );
};