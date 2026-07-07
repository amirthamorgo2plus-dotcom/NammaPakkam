import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Namma Pakkam — Community Directory',
    short_name: 'Namma Pakkam',
    description: 'Your apartment community directory, classifieds & noticeboard.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbf6f8',
    theme_color: '#c85680',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
