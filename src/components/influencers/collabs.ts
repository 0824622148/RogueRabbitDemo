// Influencer collab content.
// Hardcoded module-level data, matching the rest of the app (see journal/*).
//
// To take a testimonial video live: replace `youtubeId: null` with the
// YouTube video id (the part after `watch?v=`), e.g. youtubeId: 'dQw4w9WgXcQ'.
// While it is null the section shows the "TESTIMONIAL · DROPPING SOON" teaser.
// Drop real poster stills into /public/assets and point `poster` at them.

export type Social = {
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'X'
  handle: string
  href: string
}

export type Collab = {
  id: string
  name: string
  handle: string
  location: string
  collabTitle: string
  collabDescription: string
  bio: string
  socials: Social[]
  poster: string
  youtubeId: string | null
}

export const COLLABS: Collab[] = [
  {
    id: 'khanya',
    name: 'KHANYA',
    handle: '@khanya',
    location: 'CAPE TOWN',
    collabTitle: 'THE CAPE TOWN CAPSULE',
    collabDescription:
      'Shot between the city bowl and the Atlantic, this collab pairs Khanya’s eye for clean, monochrome fits with the Rouge silhouette. A capsule built for the ones who move first and explain later.',
    bio: 'Khanya is a Cape Town creative and stylist whose feed reads like a mood board for modern South African streetwear. She has been repping the rabbit since day one.',
    socials: [
      { platform: 'Instagram', handle: '@khanya', href: 'https://www.instagram.com/rougerabbit.za' },
      { platform: 'TikTok', handle: '@khanya', href: 'https://www.tiktok.com/@rouge_rabbitza' },
    ],
    poster: '/assets/ig-01.png',
    youtubeId: null,
  },
  {
    id: 'sipho',
    name: 'SIPHO',
    handle: '@sipho',
    location: 'SOWETO',
    collabTitle: 'KASI TO THE WORLD',
    collabDescription:
      'Sipho brings the energy of the streets he grew up on. This collab is a love letter to the kasi — loud, honest and unapologetic. Filmed on home turf, worn where it started.',
    bio: 'Dancer, hype man and community builder out of Soweto. Sipho turns every fit into a moment and every corner into a stage.',
    socials: [
      { platform: 'Instagram', handle: '@sipho', href: 'https://www.instagram.com/rougerabbit.za' },
    ],
    poster: '/assets/ig-02.png',
    youtubeId: null,
  },
  {
    id: 'ayanda',
    name: 'AYANDA',
    handle: '@ayanda',
    location: 'DURBAN',
    collabTitle: 'EAST COAST HEAT',
    collabDescription:
      'Warm light, salt air and slow motion — Ayanda’s collab leans into the laid-back confidence of the east coast. Sneakers that keep up whether you’re on the promenade or off the grid.',
    bio: 'Durban-based content creator known for effortless, sun-soaked visuals. Ayanda has a gift for making the everyday look aspirational.',
    socials: [
      { platform: 'Instagram', handle: '@ayanda', href: 'https://www.instagram.com/rougerabbit.za' },
      { platform: 'TikTok', handle: '@ayanda', href: 'https://www.tiktok.com/@rouge_rabbitza' },
    ],
    poster: '/assets/ig-03.png',
    youtubeId: null,
  },
  {
    id: 'thabo',
    name: 'THABO',
    handle: '@thabo',
    location: 'JOHANNESBURG',
    collabTitle: 'AFTER DARK IN JOZI',
    collabDescription:
      'A night-shift collab shot across Joburg after hours. Thabo’s testimonial is about the ones who build while the city sleeps — and the pair that carries them through it.',
    bio: 'Photographer and night-life documentarian capturing Joburg’s underground scene. Thabo shoots what most people miss.',
    socials: [
      { platform: 'Instagram', handle: '@thabo', href: 'https://www.instagram.com/rougerabbit.za' },
    ],
    poster: '/assets/ig-04.png',
    youtubeId: null,
  },
  {
    id: 'lerato',
    name: 'LERATO',
    handle: '@lerato',
    location: 'PRETORIA',
    collabTitle: 'QUIET CONFIDENCE',
    collabDescription:
      'Lerato’s collab is understated on purpose — clean lines, muted tones, zero noise. A testimonial about letting the work speak and the fit follow.',
    bio: 'Model and creative director from Pretoria with a minimalist, editorial approach. Lerato proves restraint is its own kind of loud.',
    socials: [
      { platform: 'Instagram', handle: '@lerato', href: 'https://www.instagram.com/rougerabbit.za' },
      { platform: 'TikTok', handle: '@lerato', href: 'https://www.tiktok.com/@rouge_rabbitza' },
    ],
    poster: '/assets/ig-05.png',
    youtubeId: null,
  },
]
