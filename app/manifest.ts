import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pakkam — Community Directory',
    short_name: 'Pakkam',
    description: 'Your apartment community directory, classifieds & noticeboard.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf7f2',
    theme_color: '#ff5a1f',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
