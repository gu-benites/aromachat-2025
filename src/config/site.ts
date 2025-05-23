/**
 * Site-wide configuration and metadata
 * 
 * This file contains site-wide configuration and metadata that is used
 * throughout the application, such as the site name, description, and SEO settings.
 */

/**
 * Site metadata
 */
export const SITE_CONFIG = {
  name: 'AromaChat',
  title: 'AromaChat - Connect with Aromatherapy Enthusiasts',
  description: 'A community for aromatherapy enthusiasts to connect, share, and learn about essential oils and their benefits.',
  keywords: [
    'aromatherapy',
    'essential oils',
    'wellness',
    'natural remedies',
    'holistic health',
    'essential oil blends',
    'aromatherapy chat',
    'essential oil community',
  ],
  author: 'AromaChat Team',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  locale: 'en-US',
  themeColor: '#10B981', // emerald-500
  backgroundColor: '#FFFFFF',
} as const;

/**
 * Default SEO configuration
 */
export const SEO_CONFIG = {
  titleTemplate: `%s | ${SITE_CONFIG.name}`,
  defaultTitle: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.title,
      },
    ],
  },
  twitter: {
    handle: '@aromachat',
    site: '@aromachat',
    cardType: 'summary_large_image',
  },
} as const;

/**
 * Social media links
 */
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/aromachat',
  facebook: 'https://facebook.com/aromachat',
  instagram: 'https://instagram.com/aromachat',
  pinterest: 'https://pinterest.com/aromachat',
  youtube: 'https://youtube.com/aromachat',
} as const;
