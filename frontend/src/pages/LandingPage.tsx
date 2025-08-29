import React from 'react';
import { HeroSlider } from '../components/hero/HeroSlider';
import { CategoriesSection } from '../components/sections/CategoriesSection';
import { HowItWorksSection } from '../components/sections/HowItWorksSection';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { CTASection } from '../components/sections/CTASection';

export const LandingPage: React.FC = () => {
  return (
    <>
      <HeroSlider />
      <CategoriesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
};