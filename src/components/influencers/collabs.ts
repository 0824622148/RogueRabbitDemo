// Influencer content for the /influencers page.
// Hardcoded module-level data, matching the rest of the app (see journal/*).
//
// To take a testimonial video live: replace `youtubeId: null` with the
// YouTube video id (the part after `watch?v=`), e.g. youtubeId: 'dQw4w9WgXcQ'.
// While it is null the section shows the "TESTIMONIAL · DROPPING SOON" teaser.
// Drop real poster stills into /public/assets and point `poster` at them.
// `socials` is optional — add handles/links per influencer when available.

export type Social = {
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'X'
  handle: string
  href: string
}

export type Collab = {
  id: string
  name: string
  emoji: string
  bio: string[]
  funFact?: string
  motto: string
  socials?: Social[]
  poster: string
  youtubeId: string | null
}

export const COLLABS: Collab[] = [
  {
    id: 'ghost',
    name: 'GHOST',
    emoji: '🖤',
    bio: [
      "I'm someone who's driven by growth, purpose, and making the most out of every opportunity that comes my way. I enjoy challenging myself, meeting new people, and constantly learning because I believe there's always room to improve.",
      "I believe success comes from consistency, discipline, and staying true to who you are. I love bringing positive energy wherever I go and living life with intention while inspiring others to do the same.",
    ],
    funFact: 'I never back down from a challenge if it means becoming a better version of myself.',
    motto: 'Don’t procrastinate your destination.',
    poster: '/assets/ig-01.png',
    youtubeId: null,
  },
  {
    id: 'billings',
    name: 'BILLINGS',
    emoji: '🫡',
    bio: [
      "I'm a confident, driven individual whose journey from humble beginnings has shaped a deep sense of resilience, ambition, and authenticity. My background taught me strength, discipline, and the importance of carrying yourself with purpose, no matter where life begins.",
      "I'm inspired by growth, style, and the power of transformation—both personally and creatively.",
    ],
    funFact:
      'I bring a mix of street-rooted strength and refined vision into everything I do, which is a big part of my personal style and presence. (My pants are always sagging 🙂‍↔️)',
    motto: 'Turn your story into your power, and your vision into your legacy.',
    poster: '/assets/ig-02.png',
    youtubeId: null,
  },
  {
    id: 'tamryn',
    name: 'TAMRYN',
    emoji: '✨',
    bio: [
      "Just a girl with big dreams, high standards, and an even bigger personality. I'm ambitious, confident, and always chasing the next level while looking good doing it.",
      "I believe in working hard, celebrating every win, and creating a life that's as beautiful as it is meaningful. Whether I'm setting goals, making memories, or turning heads, I bring determination, class, and a little sparkle wherever I go. 💫",
      'Unapologetically myself, endlessly motivated, and always ready for what’s next.',
    ],
    motto: "The goal isn't to be noticed. The goal is to be unforgettable.",
    poster: '/assets/ig-03.png',
    youtubeId: null,
  },
  {
    id: 'josh',
    name: 'JOSH',
    emoji: '😝',
    bio: [
      "I'm outgoing, energetic, and always up for a good time. I enjoy fashion, trying new things, and making the most of every moment with the people around me. Whether it's a new experience or a spontaneous adventure, I'm always ready to jump in.",
      'I believe life is meant to be lived with confidence, good energy, and plenty of laughter.',
    ],
    funFact: 'Despite what everyone says... I can survive without Red Bull. 😜',
    motto: "Life's better when you live it with confidence, laughter, and no fear.",
    poster: '/assets/ig-04.png',
    youtubeId: null,
  },
]
