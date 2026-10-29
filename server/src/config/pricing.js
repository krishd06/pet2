// PawMatch India: Central Pricing & Limits Configuration
// Editable parameters for subscription tiers, trial foster fees, featured shelter plans, and advisor limits

export const PRICING_CONFIG = {
  // AI Pet Advisor Daily Free Tier Limits
  advisor: {
    freeDailyMessageLimit: parseInt(process.env.ADVISOR_FREE_DAILY_LIMIT || '5', 10),
    premiumUnlimited: true
  },

  // Paid Trial Foster-to-Adopt Duration Options & Fees (INR)
  trialFoster: {
    durations: [
      {
        days: 7,
        feeInr: 1499,
        title: '7-Day Transition Trial',
        description: 'Ideal for initial compatibility checks and allergy testing.'
      },
      {
        days: 14,
        feeInr: 2499,
        title: '14-Day Deep Bonding Trial',
        description: 'Recommended for working adopters to observe real weekday routines.'
      },
      {
        days: 30,
        feeInr: 4499,
        title: '30-Day Complete 3-3-3 Rule Trial',
        description: 'Full decompression cycle with scheduled vet and behaviorist touchpoints.'
      }
    ],
    includedFeatures: [
      'Tailored matching consultation with shelter team',
      'Scheduled check-ins on Days 3, 7, and 14 with support counselor',
      'Complimentary initial vet wellness voucher (partner clinics)',
      'Dedicated 24x7 emergency foster coordinator hotline',
      'Option to finalize official adoption or return without judgment'
    ]
  },

  // User Premium Tier Pricing (INR)
  premiumPlans: {
    monthly: {
      id: 'plan_premium_monthly',
      name: 'PawMatch Premium Monthly',
      amountInr: 299,
      interval: 'month',
      savingsLabel: ''
    },
    yearly: {
      id: 'plan_premium_yearly',
      name: 'PawMatch Premium Annual',
      amountInr: 2499,
      interval: 'year',
      savingsLabel: 'Save 30%'
    },
    features: {
      free: [
        'Full lifestyle compatibility quiz & scoring',
        'Top 3 pet matches with binary deal-breaker filters',
        'Basic cost-of-ownership overview',
        'Standard breed directory & adoptable animals search',
        '5 AI Pet Advisor questions per day'
      ],
      premium: [
        'Full personalized readiness remediation roadmap',
        'Custom multi-year financial budget plan with city multipliers',
        'Unlimited 24x7 AI Pet Advisor conversations',
        'Post-adoption wellness & vaccination reminders tracker',
        'Priority inquiries for verified shelter pets & trial fosters',
        'Direct download of your AWBI Housing Society Pack'
      ]
    }
  },

  // Shelter Promotion Plans (INR)
  shelterPlans: {
    featured: {
      name: 'Featured Shelter Partner',
      amountInr: 999,
      intervalDays: 30,
      benefits: [
        'High-priority top listing on Adoptable Animals directory',
        'Prominent "Featured Shelter" badge on shelter profile and all pet cards',
        'Verified Partner badge upon admin verification',
        'Adopter inquiry management dashboard with real-time lead alerts',
        'Pet profile view analytics and inquiry conversion metrics'
      ]
    }
  }
};
