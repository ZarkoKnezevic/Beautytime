/**
 * Storyblok component registry.
 * Register each Storyblok block here. Content blocks are added one at a time.
 */

import Page from '@/components/storyblok/Page';
import Header from '@/components/storyblok/Header';
import Footer from '@/components/storyblok/Footer';
import Hero from '@/components/storyblok/Hero';
import Services from '@/components/storyblok/Services';
import TextImage from '@/components/storyblok/TextImage';
import Statement from '@/components/storyblok/Statement';
import TeamPreview from '@/components/storyblok/TeamPreview';
import Gallery from '@/components/storyblok/Gallery';
import Reviews from '@/components/storyblok/Reviews';
import AppointmentCta from '@/components/storyblok/AppointmentCta';
import PageHero from '@/components/storyblok/PageHero';
import ServiceCategory from '@/components/storyblok/ServiceCategory';
import CancellationTerms from '@/components/storyblok/CancellationTerms';
import TeamMember from '@/components/storyblok/TeamMember';
import Philosophy from '@/components/storyblok/Philosophy';
import LegalPage from '@/components/storyblok/LegalPage';

export const COMPONENTS = {
  page: Page,
  Page: Page,
  header: Header,
  Header: Header,
  footer: Footer,
  Footer: Footer,
  hero: Hero,
  Hero: Hero,
  services: Services,
  Services: Services,
  text_image: TextImage,
  TextImage: TextImage,
  statement: Statement,
  Statement: Statement,
  team_preview: TeamPreview,
  TeamPreview: TeamPreview,
  image_gallery: Gallery,
  Gallery: Gallery,
  reviews: Reviews,
  Reviews: Reviews,
  appointment_cta: AppointmentCta,
  AppointmentCta: AppointmentCta,
  page_hero: PageHero,
  PageHero: PageHero,
  service_category: ServiceCategory,
  ServiceCategory: ServiceCategory,
  cancellation_terms: CancellationTerms,
  CancellationTerms: CancellationTerms,
  team_person: TeamMember,
  TeamMember: TeamMember,
  philosophy: Philosophy,
  Philosophy: Philosophy,
  legal_page: LegalPage,
  LegalPage: LegalPage,
} as const;
