import {
  NgoKycApplication,
  NotificationItem,
  StandbyRescueTask,
  SurplusListing,
  ThermalSensorCard,
} from '../types';

export const SHAREAMEAL_LOGO_URL =
  'https://lh3.googleusercontent.com/aida/ALJJyrBOmepk9N1B4Rwq9zUUxdmA6rLniyj_uYGsd69kv-sqe50NmhyrJnApeneBb3AqaEMOAgScL6uqWhIcu4kkD9JcligvmkWy9GkuWYZSqpKbLSan-hPXgNw993Ran6tBAQFM5e-_di1LJ-Xb3qLDjGR34KEjHV5drT9qmS26nuffIo91HsnM65Zamb3O6USbPeIJRMH9h9p8oGo4-ccBzd8uM_ZjbjFWfDQgZEkXvno';

export const MAP_IMAGES = {
  dispatchTelemetry:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDEECTJW04OlEhHT0Xsz7Hp_7uK1u_NvDK-LgAj0MQt6m8jbuTiF9xmjotTI1l1YBEHlXCQojVv9dvxxxpS-ZuBVIyE2iWot2PcVXTVpJ7RsYnnfm2qQA5KOIRYXZa3xz_JC6imYt-8WPTUJntmeJOrMkQocBqPRauUr0Lq-5XZIQHDCcvgnyo5dPWpI6qbbukAIZD-KX3o5SbOR-fd0aW5t9adMV5EkEAtWsFOlyY',
  donorCoverage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD1fbSAOAatGt7kl8JbxihTWcECIdjibFncIjaYnjcE4pmAC2z9nbgKLxLzNFoktSvMO8pD57ce-PUl4uWqKdHMjD3A6XPOaqa9DtmePMNE0FgtWnpNBCu3K1NrDe081EAsVE_BrzehANLokI_6UjdgqMr430iXeS-X_UizO3yttXj1On9qpelksygabcHGjqKco02TYlLvmS1rejAXiv2SXDuWGpATpMerT3c4PLs',
  ngoRoute:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCkSiURuUmSDXItLaH8IUsMc5ma82qWw6-1-HDXOGZqNXzvX0RoxrgoqhsHcQ2PnS46SsyiUapnqLGzQeyUkUvpY0R1JiVMgAk0K3KgLVaKhKEHjtHlR0L5QKuEfbYPWyNNLIJGdPaJ2yF2SxHp5CD-ie-nU6si9si8aMhb3VG3kzF-VYE6nEGGR3MYs8IMltC8yAaIdh4PkmLNYphjI1TNJYl7Gww36fEzDx6IhLQ',
  certDocument:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDGXThS8DeZBBhBrYRJLMO0zevTK3n0de0qN8Faf1O3mTKcJ6GV1WbhiRHOyXqmqlP1KC5jM9KPupR4Aq16sFnMrvw-wSvvz1SslQzMkqrSt0H4jC4zjPCbEoKDYdkJj4aDogawCiKGF9Ixjd0P2mKIhrnJz-Cr30LOuHEYOoq1xfcSJHCATrWmGCLQJ3AMwiY4mLuMrzlGqTd1eZzhW1XCD1aqYYHou3ObZzCKmJA',
};

export const INITIAL_SURPLUS_LISTINGS: SurplusListing[] = [
  {
    id: 'listing-itc',
    manifestCode: 'MNF-2024-0981',
    donorName: 'ITC Gardenia Banquet Hall',
    donorLocation: 'Residency Road • Corporate Gala Surplus',
    locality: 'Indiranagar',
    category: 'cooked',
    title: 'Dal Makhani, Pulao & Paneer',
    description:
      'High-volume corporate gala surplus packed in sealed GN-1/1 stainless pans with FSSAI hygiene verification.',
    quantity: 85,
    unit: 'meals',
    dietary: 'Pure Veg',
    thermalHolding: 'hot',
    tempLabel: 'Packed at 65°C',
    expiryLabel: 'Urgent < 90m',
    urgent: true,
    distanceKm: 0.6,
    rating: 4.9,
    status: 'awaiting_claim',
    handlingSpec: 'FSSAI Checklist Signed',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD44BK758-luSf2jPI_TNjFhcxd48EkDcoxqPJE4kvwd3XyC1hvsC9cXs0a7Gj1XyzMT-E5q3QL1umJ8WbiEN9LJOBbvEAyTHRVNGZY6529p4jO9xYPlPa0E3QM4rE3OhTJWbLxJHWTU29mW7KxbvlhfaHd5o6Upogdq3qvdzu6yMCpS-D-mLrXkWW4OT4CFRQfM_is6rhxFyaLhAuzJS_J0tOq5qgpXLfyrpvkqTs',
    imageAlt:
      'Freshly prepared South Indian buffet trays with steamed rice, vegetable curries, and rotis inside a commercial Bangalore kitchen',
  },
  {
    id: 'listing-lavonne',
    manifestCode: 'MNF-2024-0985',
    donorName: 'Lavonne Academy Patisserie',
    donorLocation: 'Indiranagar 12th Main • Daily Bake Balance',
    locality: 'Indiranagar',
    category: 'bakery',
    title: 'Multigrain Bread & Buns',
    description:
      'Freshly packed bakery boxes with wholesome artisan grain bread loaves, dry fruit buns, and sealed pastry packages.',
    quantity: 42,
    unit: 'meals',
    dietary: 'Egg / Veg Mix',
    thermalHolding: 'ambient',
    tempLabel: 'Ambient Shelf Stable',
    expiryLabel: 'Ready: 3h Window',
    urgent: false,
    distanceKm: 1.4,
    rating: 5.0,
    status: 'awaiting_claim',
    handlingSpec: 'Individually Sealed',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB82tqC2yWN59eEJiCC_xNWIaWaCme7fQGLsUpp1NB7yM0Fx0r3Xuh2PAYHMoaeJR8nBLIoG0SHG-sAuIJKVC94OWrF8UkF5E78_kakpBLpuFP1-1ZW1IBL49AdzXo8LNrh8X3oHuyxgDmH_HDqlAba8qnnKRTxp1sVOfhjGF6Gw7OIBO2y69XPoE-VqTqRfJ5wZbGVGrbVpFjLYTg1w-FGtHv_tDa-bH7v074LXOw',
    imageAlt:
      'Freshly packed bakery boxes with wholesome artisan grain bread loaves and sealed pastry packages on a wooden prep table',
  },
  {
    id: 'listing-infosys',
    manifestCode: 'MNF-2024-0986',
    donorName: 'Infosys Campus Cafeteria 3',
    donorLocation: 'Electronic City / South Hub • Lunch Leftover',
    locality: 'Koramangala',
    category: 'cooked',
    title: 'Chicken Biryani & Salan',
    description:
      'Insulated catering cambro boxes and stainless steel thermal containers filled with biryani prepared post-lunch service.',
    quantity: 120,
    unit: 'meals',
    dietary: 'Halal',
    thermalHolding: 'hot',
    tempLabel: 'Packed at 72°C',
    expiryLabel: 'Today by 4:00 PM',
    urgent: false,
    distanceKm: 2.1,
    rating: 4.8,
    status: 'awaiting_claim',
    handlingSpec: 'Cold-Chain Ready',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDj7GsWeyVP6vq8t0fuC__GqjdOZ96jFGzmmtkV5RI9nsyJlscjhqhBjwvF3Pslo4Yrj7pS9yfIYwDMCKj5YmRJThnTVYgm0ZXtzjzmtSfJMKtEQvh9-t71yGh-ksn_1zDIr3ZsrjNWbh2V2aEiub6ihAnJefcKB57WRWI9QJhR1ItVPpKkRA6q1MU-Mv5kVSMAPGUqac77QL-ZKKkIEvefz2f7AaSOSpbR8OjUUnA',
    imageAlt:
      'Insulated catering cambro boxes and stainless steel thermal containers filled with biryani in a community kitchen',
  },
  {
    id: 'listing-donor-1',
    manifestCode: 'MNF-2024-0982',
    donorName: 'The Grand Bengaluru Bistro & Banquets',
    donorLocation: 'Indiranagar 100ft Hub • Zone A-4',
    locality: 'Indiranagar',
    category: 'cooked',
    title: '45 x Paneer Pulao & Dal Makhani',
    description: 'Hot-held banquet spread sealed in tamper-proof food-grade steel containers.',
    quantity: 45,
    unit: 'meals',
    dietary: 'Pure Veg',
    thermalHolding: 'hot',
    tempLabel: 'Hot-held at 64°C',
    expiryLabel: 'ETA 12 min (19:25 IST)',
    urgent: true,
    distanceKm: 1.1,
    rating: 4.9,
    status: 'en_route',
    claimedByNgo: 'Asha Sadan Children Home',
    assignedVolunteer: 'Arun V. (EV Fleet #14)',
    etaText: 'ETA 12 min (19:25 IST)',
    handlingSpec: 'Tamper-Proof Insulated Box',
  },
  {
    id: 'listing-donor-2',
    manifestCode: 'MNF-2024-0983',
    donorName: 'The Grand Bengaluru Bistro & Banquets',
    donorLocation: 'Indiranagar 100ft Hub • Zone A-4',
    locality: 'Whitefield',
    category: 'bakery',
    title: '20 kg Assorted Sourdough & Croissants',
    description: 'Artisan bakery surplus lined in moisture-barrier food paper crates.',
    quantity: 20,
    unit: 'kg',
    dietary: 'Pure Veg',
    thermalHolding: 'ambient',
    tempLabel: 'Ambient dry paper lined',
    expiryLabel: 'Pickup 20:15',
    urgent: false,
    distanceKm: 3.8,
    rating: 4.9,
    status: 'claimed',
    claimedByNgo: 'Robin Hood Army Whitefield',
    assignedVolunteer: 'Shelter Van #02',
    etaText: 'Pickup 20:15',
    handlingSpec: 'Ambient dry paper lined',
  },
  {
    id: 'listing-donor-3',
    manifestCode: 'MNF-2024-0984',
    donorName: 'The Grand Bengaluru Bistro & Banquets',
    donorLocation: 'Indiranagar 100ft Hub • Zone A-4',
    locality: 'Jayanagar',
    category: 'cooked',
    title: '30 Portions Chicken Biryani Banquet',
    description: 'Broadcasting to 8 certified NGO nodes in Zone A.',
    quantity: 30,
    unit: 'meals',
    dietary: 'Non-Veg',
    thermalHolding: 'hot',
    tempLabel: 'Hot-held at 64°C',
    expiryLabel: '1h 30m Window',
    urgent: true,
    distanceKm: 2.9,
    rating: 4.8,
    status: 'awaiting_claim',
    handlingSpec: 'Hot-held at 64°C',
    viewersCount: 2,
  },
];

export const INITIAL_KYC_QUEUE: NgoKycApplication[] = [
  {
    id: 'kyc-krupa',
    initials: 'KS',
    name: 'Krupa Seva Society',
    trustReg: 'Registered Trust #BLR-IV/4401-2018',
    beneficiaryTarget: '350 Meals / Day',
    locationFacility: 'Shivajinagar, Hub #4',
    statusBadge: 'Action Req.',
    statusTone: 'warning',
    facilityPhotoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAd2hUtxp7B-1TstEI4CgKKy92Z-q2_MJg6zHL111RAyV4xFkv6UOd-I4Yqh4sak9pvOOiR5tKd7jLirg6a_3CUIajYw9pzfPeBjQRsrrmZIOb90vsb4A5yaWl3etkGlkRHStJ9vhCwMAIqElxGowYkWL__TNsRdfzPXvUK0XOD07T2pwPweUgCThAC4W3T3cSKgVPfTCJ98IZKVJ-4W9qLz_dGgrnd5xY6J9gmB3E',
    facilityCoords: 'Field Inspector geotagged: 12.9833° N, 77.5997° E',
    docs: [
      {
        id: 'doc-80g',
        icon: 'description',
        title: '80G Income Tax Exemption',
        subtitle: 'Valid thru Mar 2027 • Approved',
        previewLabel: '80G Certification: Krupa Seva',
      },
      {
        id: 'doc-fssai',
        icon: 'health_and_safety',
        title: 'FSSAI State Reg #1122033400091',
        subtitle: 'Category: Charitable Food Service',
        previewLabel: 'FSSAI Food License #1122033400091',
      },
      {
        id: 'doc-cold',
        icon: 'ac_unit',
        title: 'Cold Storage Facility Audit',
        subtitle: 'Commercial Deep Freezer 200L • Validated',
        previewLabel: 'Cold Chain Infrastructure Report',
      },
    ],
  },
  {
    id: 'kyc-ashraya',
    initials: 'AB',
    name: 'Ashraya Bal Bhavan',
    trustReg: 'Registered Trust #BLR-II/1920-2020',
    beneficiaryTarget: '120 Children Shelter',
    locationFacility: 'Kengeri, West Node',
    statusBadge: 'Needs FSSAI Renewal',
    statusTone: 'review',
    facilityPhotoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAd2hUtxp7B-1TstEI4CgKKy92Z-q2_MJg6zHL111RAyV4xFkv6UOd-I4Yqh4sak9pvOOiR5tKd7jLirg6a_3CUIajYw9pzfPeBjQRsrrmZIOb90vsb4A5yaWl3etkGlkRHStJ9vhCwMAIqElxGowYkWL__TNsRdfzPXvUK0XOD07T2pwPweUgCThAC4W3T3cSKgVPfTCJ98IZKVJ-4W9qLz_dGgrnd5xY6J9gmB3E',
    facilityCoords: 'Field Inspector geotagged: 12.9177° N, 77.4833° E',
    docs: [
      {
        id: 'doc-80g-ab',
        icon: 'description',
        title: '80G Income Tax Exemption',
        subtitle: 'Valid thru Dec 2027 • Approved',
        previewLabel: '80G Certification: Ashraya Bal Bhavan',
      },
      {
        id: 'doc-fssai-ab',
        icon: 'health_and_safety',
        title: 'FSSAI Renewal Filing #1122033400148',
        subtitle: 'Renewal Receipt Uploaded • Review',
        previewLabel: 'FSSAI Renewal Application #1122033400148',
      },
    ],
  },
  {
    id: 'kyc-grace',
    initials: 'GE',
    name: 'Grace Elders Home',
    trustReg: 'Registered Society #BLR-I/0892-2016',
    beneficiaryTarget: '45 Senior Citizens',
    locationFacility: 'Ulsoor, Central East',
    statusBadge: 'Audit Ready',
    statusTone: 'ready',
    facilityPhotoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAd2hUtxp7B-1TstEI4CgKKy92Z-q2_MJg6zHL111RAyV4xFkv6UOd-I4Yqh4sak9pvOOiR5tKd7jLirg6a_3CUIajYw9pzfPeBjQRsrrmZIOb90vsb4A5yaWl3etkGlkRHStJ9vhCwMAIqElxGowYkWL__TNsRdfzPXvUK0XOD07T2pwPweUgCThAC4W3T3cSKgVPfTCJ98IZKVJ-4W9qLz_dGgrnd5xY6J9gmB3E',
    facilityCoords: 'Field Inspector geotagged: 12.9817° N, 77.6285° E',
    docs: [
      {
        id: 'doc-80g-ge',
        icon: 'description',
        title: '80G Income Tax Exemption',
        subtitle: 'Valid thru Jun 2028 • Approved',
        previewLabel: '80G Certification: Grace Elders Home',
      },
      {
        id: 'doc-fssai-ge',
        icon: 'health_and_safety',
        title: 'FSSAI State Reg #1122033400205',
        subtitle: 'Category: Senior Care Kitchen',
        previewLabel: 'FSSAI Food License #1122033400205',
      },
    ],
  },
];

export const INITIAL_STANDBY_TASKS: StandbyRescueTask[] = [
  {
    id: 'st-1',
    routeTitle: "ITC Gardenia Banquet Hall → Hope Children's Home",
    payloadSummary: '140 Pax Continental & Bread • Koramangala (4.2 km)',
    statusLabel: 'Auto-Assigning',
    tone: 'secondary',
    donorPin: '560025',
    ngoContact: 'Matron Priya D.',
    distanceKm: '4.2 km',
  },
  {
    id: 'st-2',
    routeTitle: 'Tesco Campus Cafeteria → Snehadhara Foundation',
    payloadSummary: '65 kg Dry Groceries & Fruit Baskets • Whitefield (6.8 km)',
    statusLabel: 'Courier En Route',
    tone: 'tertiary',
    donorPin: '560066',
    ngoContact: 'Coordinator Vikram S.',
    distanceKm: '6.8 km',
  },
];

export const THERMAL_SENSORS: ThermalSensorCard[] = [
  {
    id: 'sensor-t12',
    title: 'Chilled Dairy & Desserts Carrier #T-12',
    statusLabel: 'Optimal',
    reading: '3.8°C',
    targetLabel: 'FSSAI Target: 0°C - 5°C',
    deviceLabel: 'Sensor S-44 (Whitefield Van)',
    subStatus: '✓ No spike detected in 180 min',
    footerLabel: 'Container Seal Status',
    footerValue: 'Tamper-Proof Locked',
    progressPct: 100,
    kind: 'cold',
  },
  {
    id: 'sensor-h09',
    title: 'Hot Transit Pod #H-09 (Rice & Curry)',
    statusLabel: 'Safe Zone',
    reading: '63.2°C',
    targetLabel: 'FSSAI Min Limit: > 60°C',
    deviceLabel: 'Insulated Thermal Cask',
    subStatus: 'ETA to distribution: 8 min',
    footerLabel: 'Thermal Retention Efficiency',
    footerValue: '94%',
    progressPct: 94,
    kind: 'hot',
  },
];

export const ZONE_CHART_DATASETS: Record<
  'today' | '7day' | 'predictive',
  {
    label: string;
    corridorText: string;
    co2Saved: string;
    zones: { name: string; surplus: number; deficit: number }[];
  }
> = {
  today: {
    label: 'Today Live Grid',
    corridorText:
      'Automated dispatch routing 240kg surplus from Indiranagar restaurants to Wilson Garden shelters via MG Road arterial corridor.',
    co2Saved: '840 kg',
    zones: [
      { name: 'Indiranagar', surplus: 420, deficit: 80 },
      { name: 'Koramangala', surplus: 380, deficit: 120 },
      { name: 'Wilson Garden', surplus: 50, deficit: 350 },
      { name: 'Whitefield', surplus: 490, deficit: 60 },
      { name: 'Shivajinagar', surplus: 90, deficit: 280 },
    ],
  },
  '7day': {
    label: '7-Day Moving Average',
    corridorText:
      'Weekly balancing routed 1,420 kg across Whitefield Tech Park and Shivajinagar community hubs with 99.1% zero-spoilage fulfillment.',
    co2Saved: '2,940 kg',
    zones: [
      { name: 'Indiranagar', surplus: 440, deficit: 95 },
      { name: 'Koramangala', surplus: 360, deficit: 140 },
      { name: 'Wilson Garden', surplus: 75, deficit: 330 },
      { name: 'Whitefield', surplus: 470, deficit: 85 },
      { name: 'Shivajinagar', surplus: 110, deficit: 260 },
    ],
  },
  predictive: {
    label: 'Predictive 48h Horizon',
    corridorText:
      'Weekend banquet surge (+1,200 meals) forecasted at Palace Grounds; pre-allocating 18 EV mopeds to North-Central shelters.',
    co2Saved: '1,620 kg',
    zones: [
      { name: 'Indiranagar', surplus: 480, deficit: 70 },
      { name: 'Koramangala', surplus: 410, deficit: 110 },
      { name: 'Wilson Garden', surplus: 40, deficit: 420 },
      { name: 'Whitefield', surplus: 500, deficit: 50 },
      { name: 'Shivajinagar', surplus: 65, deficit: 390 },
    ],
  },
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Task #BFR-8891 Ready for Acceptance',
    detail: 'Empire Restaurant Church St. sealed 80 hot Biryani & Dal trays (64°C).',
    timeAgo: '2m ago',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Perishable Confectionery Alert #C-21',
    detail: "Lavelle Road Cafe cream pastries auto-matched to St. John's Youth Shelter.",
    timeAgo: '8m ago',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'NGO KYC Document Uploaded',
    detail: 'Krupa Seva Society submitted FSSAI State Reg #1122033400091 for sign-off.',
    timeAgo: '21m ago',
    read: true,
  },
];
