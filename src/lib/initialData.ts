import { Room, Enquiry, GalleryItem, SiteSettings, Booking, BlockedSlot } from '../types';

export const OPERATIONAL_HOURLY_SLOTS = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
  '18:00 - 19:00',
  '19:00 - 20:00'
];

export const initialBookings: Booking[] = [
  {
    id: 'BK-70192',
    customerName: 'Aarav Adhikari',
    phone: '+977 9841 234567',
    email: 'aarav.adhikari@kathmandu-invest.np',
    bookingDate: '2026-11-21',
    timeSlot: '09:00 - 10:00',
    bookingType: 'Sunrise Tea & Yoga Experience',
    guests: 2,
    specialRequests: 'Celebrating wedding anniversary. Requesting private yoga instructor on the terrace.',
    status: 'Confirmed',
    confirmedAt: '2026-11-20T11:00:00Z',
    createdAt: '2026-11-20T08:30:00Z',
    updatedAt: '2026-11-20T11:00:00Z'
  },
  {
    id: 'BK-70193',
    customerName: 'Dr. Evelyn Ward',
    phone: '+44 7911 123456',
    email: 'e.ward@oxford-research.ac.uk',
    bookingDate: '2026-11-21',
    timeSlot: '14:00 - 15:00',
    bookingType: 'Suite Viewing & Stay Consultation',
    guests: 1,
    specialRequests: 'Exploring long-term sabbatical stay in the Panorama Suite.',
    status: 'Pending',
    createdAt: '2026-11-21T07:15:00Z',
    updatedAt: '2026-11-21T07:15:00Z'
  },
  {
    id: 'BK-70194',
    customerName: 'Mateo & Sofia Rossi',
    phone: '+39 02 6978 4512',
    email: 'm.rossi@milano-design.it',
    bookingDate: '2026-11-21',
    timeSlot: '18:00 - 19:00',
    bookingType: 'Culinary Hearth Tasting',
    guests: 2,
    specialRequests: 'Vegetarian tasting menu with organic Himalayan honey tea pairing.',
    status: 'Confirmed',
    confirmedAt: '2026-11-19T14:20:00Z',
    createdAt: '2026-11-19T10:00:00Z',
    updatedAt: '2026-11-19T14:20:00Z'
  },
  {
    id: 'BK-70195',
    customerName: 'Kavita Chhetri',
    phone: '+977 9801 987654',
    email: 'kavita.chhetri@pokhara-arts.org',
    bookingDate: '2026-11-22',
    timeSlot: '10:00 - 11:00',
    bookingType: 'Private Wellness Sanctuary',
    guests: 2,
    specialRequests: 'Sound immersion session with Tibetan singing bowls.',
    status: 'Pending',
    createdAt: '2026-11-21T09:40:00Z',
    updatedAt: '2026-11-21T09:40:00Z'
  },
  {
    id: 'BK-70196',
    customerName: 'James Henderson',
    phone: '+1 415 555 0199',
    email: 'j.henderson@pacific-advisors.com',
    bookingDate: '2026-11-22',
    timeSlot: '16:00 - 17:00',
    bookingType: 'Suite Viewing & Stay Consultation',
    guests: 2,
    status: 'Confirmed',
    confirmedAt: '2026-11-20T16:00:00Z',
    createdAt: '2026-11-20T12:00:00Z',
    updatedAt: '2026-11-20T16:00:00Z'
  }
];

export const initialBlockedSlots: BlockedSlot[] = [
  {
    id: 'block-01',
    date: '2026-11-21',
    timeSlot: '12:00 - 13:00',
    reason: 'Staff Midday Handover & Pavilion Maintenance',
    createdAt: '2026-11-20T00:00:00Z'
  },
  {
    id: 'block-02',
    date: '2026-11-22',
    timeSlot: '08:00 - 09:00',
    reason: 'Private Property Landscaping & Garden Care',
    createdAt: '2026-11-20T00:00:00Z'
  }
];

export const initialSettings: SiteSettings = {
  id: 'havenora-main-settings',
  hotelName: 'HAVENORA',
  tagline: 'Where Every Stay Finds Its Calm.',
  brandDescription: 'A sanctuary situated above the tranquil waters of Phewa Lake and beneath the Annapurna range. Havenora is designed for slow travel, architectural stillness, and deeply personal hospitality.',
  fullStory: 'Conceived as an antidote to frantic modern living, Havenora weaves traditional Nepalese stone masonry, warm cedarwood, and minimalist Japanese-Scandinavian sensibilities. Here, time is marked not by clocks, but by the shifting light across Machapuchare and the quiet ritual of morning tea.',
  email: 'stay@havenora-retreat.com',
  phone: '+977 61 460 882',
  whatsapp: '+977 980 123 4567',
  address: 'Sarangkot Ridge Rd, Ward 18, Pokhara 33700, Nepal',
  city: 'Pokhara',
  country: 'Nepal',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14059.885834863583!2d83.9458925!3d28.2435422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399594be412f7ef3%3A0x6b4ef8d6139eef71!2sSarangkot%2C%20Pokhara!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp',
  socialLinks: {
    instagram: 'https://instagram.com/havenoraretreat',
    facebook: 'https://facebook.com/havenoraretreat',
    tripadvisor: 'https://tripadvisor.com',
    pinterest: 'https://pinterest.com'
  },
  homepage: {
    heroSubheading: 'POKHARA, NEPAL',
    heroHeading: 'Where Every Stay Finds Its Calm.',
    heroTagline: 'A Boutique Retreat',
    heroDescription: 'Discover a thoughtfully designed retreat where beautiful spaces, warm hospitality and the natural beauty of Pokhara come together.',
    heroImage: '/images/hero.jpg',
    primaryCtaText: 'EXPLORE OUR ROOMS',
    primaryCtaLink: '/rooms',
    secondaryCtaText: 'RESERVE HOURLY SLOT',
    secondaryCtaLink: '/book',
    introHeading: 'Escape the ordinary. Embrace the extraordinary.',
    introSubheading: 'THE HAVENORA EXPERIENCE',
    introDescription: 'A place to slow down, reconnect and experience hospitality shaped around comfort, thoughtful design and meaningful moments.'
  },
  updatedAt: new Date().toISOString()
};

export const initialRooms: Room[] = [
  {
    id: 'room-1',
    name: 'Garden Retreat',
    slug: 'garden-retreat',
    tagline: 'Quiet sanctuary with private flora terrace',
    description: 'A calm and comfortable room inspired by natural textures, warm wood craft and soothing garden vistas.',
    longDescription: 'Tucked into the lush terraced gardens of Havenora, the Garden Retreat offers an intimate sanctuary of peace. Hand-hewn local river stone, custom untreated cedar furnishings, and pure organic linen curate an earthy, grounding atmosphere. Step onto your private shaded stone terrace for morning meditation or evening reading as birds settle into the subtropical canopy.',
    price: 185,
    currency: 'USD',
    capacity: 2,
    bedConfiguration: '1 King Bed',
    roomSize: '42 m² (452 sq ft)',
    view: 'Private Zen Garden & Valley Flora',
    amenities: [
      'Private garden terrace',
      'Handcrafted King-size bed with organic linen',
      'Rainfall walk-in stone shower',
      'Artisanal Himalayan botanical bath amenities',
      'Complimentary loose-leaf Ilam tea bar',
      'French press organic Nepalese Arabica coffee',
      'High-speed optical WiFi',
      'Cast-iron heating stove for crisp evenings',
      'Bespoke yukata robes and woven slippers',
      'Twice-daily housekeeping with herbal turn-down'
    ],
    features: ['Ground Floor Access', 'Garden View', 'Terrace', 'Walk-in Shower'],
    mainImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=85'
    ],
    published: true,
    featured: true,
    displayOrder: 1,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-02-14T11:20:00Z'
  },
  {
    id: 'room-2',
    name: 'Signature Suite',
    slug: 'signature-suite',
    tagline: 'Refined elevation with tailored living lounge',
    description: 'An elevated stay with generous space, dedicated lounge pavilion, and thoughtful details throughout.',
    longDescription: 'The Signature Suite blends generous proportions with refined architectural minimalism. Featuring an airy integrated sitting area with low-slung custom lounge seating, artisanal brass accents, and sweeping glass doors opening onto an expansive balcony. Unwind as afternoon light pours across handwoven Tibetan wool rugs and watch clouds dance over Phewa Lake.',
    price: 275,
    currency: 'USD',
    capacity: 2,
    bedConfiguration: '1 King Bed',
    roomSize: '58 m² (624 sq ft)',
    view: 'Phewa Lake & Valley Sunset View',
    amenities: [
      'Panoramic sunset balcony with daybed',
      'Integrated lounge area with custom day sofa',
      'Deep freestanding soaking tub with mountain view',
      'Walk-in stone rain shower',
      'Artisanal Himalayan bath salts and oils',
      'In-suite pour-over coffee bar with single-origin beans',
      'Marshall Bluetooth acoustic sound system',
      'High-speed optical WiFi',
      'Pillow menu with 5 ergonomic natural options',
      'Evening fireplace concierge service'
    ],
    features: ['Upper Level', 'Balcony', 'Lake View', 'Freestanding Bathtub', 'Sitting Area'],
    mainImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'
    ],
    published: true,
    featured: true,
    displayOrder: 2,
    createdAt: '2026-01-12T10:00:00Z',
    updatedAt: '2026-02-14T11:20:00Z'
  },
  {
    id: 'room-3',
    name: 'Panorama Suite',
    slug: 'panorama-suite',
    tagline: 'The pinnacle of Himalayan stillness',
    description: 'A spacious retreat designed around open views, separate lounge area, and relaxed living.',
    longDescription: 'Positioned on the highest crest of the property, the Panorama Suite offers unobstructed 270-degree perspectives of the Annapurna massif and Machapuchare (Fishtail Peak). With a separate cedar-clad lounge, private wrap-around cantilevered deck, and double-sided wood-burning hearth, this suite represents the pinnacle of tranquil Himalayan hospitality.',
    price: 360,
    currency: 'USD',
    capacity: 2,
    bedConfiguration: '1 King Bed',
    roomSize: '76 m² (818 sq ft)',
    view: '270° Annapurna Mountain & Lake Panorama',
    amenities: [
      'Private wrap-around panoramic viewing deck',
      'Separate cedar-paneled living room with hearth',
      'Dual stone vanity and open-sky skylight',
      'Floor-to-ceiling glass panoramic shower',
      'Deep Japanese soaking tub overlooking peaks',
      'Curated vinyl listening station with vintage collection',
      'Private in-suite breakfast service included',
      'Complimentary telescope for Himalayan stargazing',
      'Bespoke cashmere throws and organic robes',
      'Dedicated personal retreat host'
    ],
    features: ['Top Floor', 'Separate Lounge', 'Wrap-around Deck', 'Wood Fireplace', 'Annapurna Views'],
    mainImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85'
    ],
    published: true,
    featured: true,
    displayOrder: 3,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-02-14T11:20:00Z'
  }
];

export const initialEnquiries: Enquiry[] = [
  {
    id: 'enq-101',
    guestName: 'Eleanor Vance',
    email: 'eleanor.vance@archdesign.co.uk',
    phone: '+44 7700 900341',
    roomId: 'room-3',
    roomName: 'Panorama Suite',
    checkIn: '2026-11-28',
    checkOut: '2026-12-04',
    guests: 2,
    message: 'We are celebrating our 10th anniversary. Hoping for a calm retreat with mountain views and would love to arrange private morning yoga on the terrace.',
    status: 'New',
    internalNotes: 'VIP inquiry. High probability. Mention complimentary herbal tea welcome and anniversary greeting.',
    createdAt: '2026-11-21T08:15:00Z',
    updatedAt: '2026-11-21T08:15:00Z'
  },
  {
    id: 'enq-102',
    guestName: 'Dr. Hiroshi Tanaka',
    email: 'hiroshi.tanaka@tokyo-biomed.jp',
    phone: '+81 90 1234 5678',
    roomId: 'room-2',
    roomName: 'Signature Suite',
    checkIn: '2026-12-10',
    checkOut: '2026-12-16',
    guests: 1,
    message: 'Seeking a quiet environment for writing and reflection. Requires reliable optical WiFi and vegetarian dining options.',
    status: 'Contacted',
    internalNotes: 'Contacted via email with our seasonal retreat brochure and culinary menu. Awaiting confirmation.',
    createdAt: '2026-11-20T14:30:00Z',
    updatedAt: '2026-11-20T16:00:00Z'
  },
  {
    id: 'enq-103',
    guestName: 'Camille & Julien Laurent',
    email: 'camille.laurent@paris-studio.fr',
    phone: '+33 6 12 34 56 78',
    roomId: 'room-1',
    roomName: 'Garden Retreat',
    checkIn: '2026-12-22',
    checkOut: '2026-12-29',
    guests: 2,
    message: 'Looking for a peaceful winter escape away from crowds. Inquiring about airport transfer from Pokhara domestic terminal.',
    status: 'Pending',
    internalNotes: 'Offered complimentary airport pickup in our hybrid electric SUV. Guest is checking flight connections.',
    createdAt: '2026-11-19T10:45:00Z',
    updatedAt: '2026-11-20T09:20:00Z'
  },
  {
    id: 'enq-104',
    guestName: 'Marcus Sterling',
    email: 'm.sterling@advisory-capital.com',
    phone: '+1 (415) 890-2134',
    roomId: 'room-3',
    roomName: 'Panorama Suite',
    checkIn: '2027-01-05',
    checkOut: '2027-01-12',
    guests: 2,
    message: 'Interested in private guided dawn walks in the valley and early morning Annapurna photography.',
    status: 'Confirmed',
    internalNotes: 'Confirmed reservation details sent. Assigned senior guide Pasang for 2 morning photography treks.',
    createdAt: '2026-11-18T16:20:00Z',
    updatedAt: '2026-11-19T11:00:00Z'
  },
  {
    id: 'enq-105',
    guestName: 'Siddharth & Ananya Sharma',
    email: 'siddharth.sharma@gurgaon-tech.in',
    phone: '+91 98111 23456',
    roomId: 'room-2',
    roomName: 'Signature Suite',
    checkIn: '2026-12-02',
    checkOut: '2026-12-05',
    guests: 2,
    message: 'Weekend getaway from Kathmandu. Need late check-in around 8 PM due to flight.',
    status: 'Cancelled',
    internalNotes: 'Guest had to reschedule corporate meetings in Delhi. Invited to rebook in spring with preserved discount credit.',
    createdAt: '2026-11-17T09:10:00Z',
    updatedAt: '2026-11-18T08:30:00Z'
  }
];

export const initialGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85',
    caption: 'Havenora main pavilion surrounded by Pokhara subtropical greenery and morning mist',
    category: 'Architecture',
    displayOrder: 1,
    published: true,
    aspect: 'landscape',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'gal-2',
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85',
    caption: 'Natural cedar craft and organic linen in the Garden Retreat',
    category: 'Rooms',
    displayOrder: 2,
    published: true,
    aspect: 'portrait',
    createdAt: '2026-01-10T10:05:00Z'
  },
  {
    id: 'gal-3',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85',
    caption: 'Signature Suite elevated lounge overlooking the southern ridges',
    category: 'Rooms',
    displayOrder: 3,
    published: true,
    aspect: 'landscape',
    createdAt: '2026-01-10T10:10:00Z'
  },
  {
    id: 'gal-4',
    imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85',
    caption: 'Panorama Suite waking up to early morning mountain light',
    category: 'Rooms',
    displayOrder: 4,
    published: true,
    aspect: 'portrait',
    createdAt: '2026-01-10T10:15:00Z'
  },
  {
    id: 'gal-5',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85',
    caption: 'Stone courtyard and reflection pond reflecting the open sky',
    category: 'Architecture',
    displayOrder: 5,
    published: true,
    aspect: 'landscape',
    createdAt: '2026-01-10T10:20:00Z'
  },
  {
    id: 'gal-6',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
    caption: 'The Hearth dining hall serving farm-to-table seasonal gastronomy',
    category: 'Dining',
    displayOrder: 6,
    published: true,
    aspect: 'landscape',
    createdAt: '2026-01-10T10:25:00Z'
  },
  {
    id: 'gal-7',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85',
    caption: 'Handpicked organic Ilam tea ceremony served on the sunrise terrace',
    category: 'Dining',
    displayOrder: 7,
    published: true,
    aspect: 'portrait',
    createdAt: '2026-01-10T10:30:00Z'
  },
  {
    id: 'gal-8',
    imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=85',
    caption: 'Handcrafted ceramic washbasins and natural river stone bathroom details',
    category: 'Interiors',
    displayOrder: 8,
    published: true,
    aspect: 'square',
    createdAt: '2026-01-10T10:35:00Z'
  },
  {
    id: 'gal-9',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
    caption: 'Phewa Lake tranquility and the distant snowy silhouettes of Annapurna',
    category: 'Nature',
    displayOrder: 9,
    published: true,
    aspect: 'landscape',
    createdAt: '2026-01-10T10:40:00Z'
  },
  {
    id: 'gal-10',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
    caption: 'Mindful reading nook with curated Himalayan literature and handwoven wool cushions',
    category: 'Interiors',
    displayOrder: 10,
    published: true,
    aspect: 'portrait',
    createdAt: '2026-01-10T10:45:00Z'
  },
  {
    id: 'gal-11',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    caption: 'Sarangkot misty valley at daybreak with tranquil alpine air',
    category: 'Nature',
    displayOrder: 11,
    published: true,
    aspect: 'landscape',
    createdAt: '2026-01-10T10:50:00Z'
  },
  {
    id: 'gal-12',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85',
    caption: 'Artisanal roasted coffee ritual poured in handcrafted Nepalese pottery',
    category: 'Details',
    displayOrder: 12,
    published: true,
    aspect: 'square',
    createdAt: '2026-01-10T10:55:00Z'
  }
];
