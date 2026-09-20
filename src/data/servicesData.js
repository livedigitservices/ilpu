export const PRICING_INFO = {
  india: {
    base: 499,
    gst: "18%",
    totalStr: "₹499 + 18% GST (Total ₹589)",
    display: "₹499 + 18% GST"
  },
  international: {
    amount: 5,
    currency: "USD",
    totalStr: "$5 USD",
    display: "$5 USD"
  }
};

export const servicesData = [
  {
    id: "international-law-business",
    title: "International Law & Global Business",
    subtitle: "Helping businesses understand the legal side of going global",
    tagline: "Cross-Border Legal Guidance • International Transactions • Dispute Awareness",
    image: "/assets/service-global-trade.jpg",
    badge: "Global Markets",
    iconName: "Globe",
    priceIndia: "₹499 + 18% GST",
    priceInternational: "$5 USD",
    color: "from-blue-600 to-indigo-900",
    description: "Empowering businesses to navigate complex international legal frameworks with confidence. From import-export compliance to cross-border acquisitions and dispute prevention, Dr. Karanam Rajesh Kumar offers end-to-end counsel for global expansion.",
    features: [
      "Cross-Border Legal Guidance & Regulatory Frameworks",
      "Import-Export, Foreign Trade & Maritime Compliance",
      "Foreign Business Transactions & Cross-Border Mergers",
      "International Commercial Dispute Resolution & Arbitration",
      "Regulatory Coordination between India & International Markets"
    ],
    highlights: [
      { title: "Law", desc: "Supreme Court & International Legal Standards" },
      { title: "Global Trade", desc: "Customs, Tariffs & Trade Treaties" },
      { title: "Contracts", desc: "Multijurisdictional Enforceability" },
      { title: "Shipping", desc: "Maritime & International Logistics Law" }
    ],
    deliverables: [
      "Cross-border transaction risk audit",
      "International trade agreement compliance check",
      "Foreign direct investment (FDI) legal structuring",
      "Customs and regulatory filings guidance"
    ]
  },
  {
    id: "nri-property-protection",
    title: "NRI Property Protection & Legal Solutions",
    subtitle: "Protecting Your International Investments, Today and Tomorrow",
    tagline: "Safe Investments • Secure Ownership • Global Support",
    image: "/assets/service-nri-property.jpg",
    badge: "NRI Priority",
    iconName: "ShieldCheck",
    priceIndia: "₹499 + 18% GST",
    priceInternational: "$5 USD",
    color: "from-amber-600 to-yellow-800",
    description: "Comprehensive legal safeguarding for Non-Resident Indians (NRIs) holding or acquiring real estate in India. Protect your land, commercial holdings, and ancestral properties from illegal encroachment, title defects, and fraudulent sales.",
    features: [
      "Property Purchase & Comprehensive Legal Due Diligence",
      "Title Verification & Historical Land Record Risk Assessment",
      "NRI Inheritance, Estate Planning & Succession Certificates",
      "Dispute Resolution, Encroachment Defense & Property Litigation",
      "End-to-End Power of Attorney (POA) & Transactional Legal Support"
    ],
    highlights: [
      { title: "Global Expertise", desc: "Tailored specifically for NRIs living abroad" },
      { title: "Trusted Guidance", desc: "Transparent legal checks before purchase" },
      { title: "Your Rights First", desc: "Proactive defense against unauthorized claims" },
      { title: "POA Assistance", desc: "Manage property transactions without travelling" }
    ],
    deliverables: [
      "30-Year Title Search & Property Due Diligence Report",
      "Drafting & Registration of Power of Attorney (POA)",
      "Inheritance & Partition Deed legal execution",
      "Property litigation filing & court representation"
    ]
  },
  {
    id: "contract-drafting",
    title: "International Contract Drafting & Frameworks",
    subtitle: "Legal Frameworks for a Global Tomorrow",
    tagline: "Plan • Draft • Negotiate • Protect • Succeed",
    image: "/assets/service-contract-drafting.jpg",
    badge: "High Precision",
    iconName: "FileText",
    priceIndia: "₹499 + 18% GST",
    priceInternational: "$5 USD",
    color: "from-cyan-600 to-blue-900",
    description: "Meticulously crafted international contracts designed to lower risk, eliminate ambiguities, and strengthen global partnerships. Ensuring your commercial interests remain bulletproof across foreign courts.",
    features: [
      "Clear, Watertight Cross-Border Commercial Agreements",
      "Proactive Risk Mitigation & Liability Limitation Clauses",
      "International Trade & Distribution Contract Negotiation",
      "Choice of Law, Governing Jurisdiction & Arbitration Provisions",
      "IP Licensing, Joint Venture & Technology Transfer Frameworks"
    ],
    highlights: [
      { title: "Clear Agreements", desc: "Zero ambiguity in terms" },
      { title: "Lower Risks", desc: "Comprehensive indemnity clauses" },
      { title: "Stronger Partnerships", desc: "Win-win legal terms" },
      { title: "Global Reach", desc: "Enforceable in 100+ countries" }
    ],
    deliverables: [
      "Custom International Master Services Agreements (MSA)",
      "SLA & Non-Disclosure / Non-Compete Agreements (NDA)",
      "Joint Venture & Cross-Border Partnership Deeds",
      "Contract Risk Matrix & Arbitration Clause Customization"
    ]
  },
  {
    id: "investment-opportunities",
    title: "International Investment & Wealth Protection",
    subtitle: "Legal & Strategic Perspective for Global Capital",
    tagline: "Global Investment • Legal Protection • Cross-Border Growth",
    image: "/assets/service-global-investment.jpg",
    badge: "Wealth Safeguard",
    iconName: "TrendingUp",
    priceIndia: "₹499 + 18% GST",
    priceInternational: "$5 USD",
    color: "from-emerald-600 to-teal-900",
    description: "Navigating international investment laws, foreign capital repatriations, and tax treaty benefits. Protect your global investments with rigorous legal due diligence and strategic asset structuring.",
    features: [
      "Cross-Border Capital Investment Legal Structuring",
      "Foreign Direct Investment (FDI) & Overseas Direct Investment (ODI)",
      "International Tax Treaty Optimization & Repatriation Legalities",
      "Regulatory Compliance under RBI, FEMA & Global Central Banks",
      "Risk Mitigation for High-Net-Worth & Institutional Investors"
    ],
    highlights: [
      { title: "Global Investment", desc: "Secure cross-border portfolio expansion" },
      { title: "Legal Protection", desc: "Defend foreign assets from legal liabilities" },
      { title: "Cross-Border Growth", desc: "Seamless capital flows & compliance" },
      { title: "FEMA Alignment", desc: "Strict adherence to foreign exchange laws" }
    ],
    deliverables: [
      "Cross-border investment legal feasibility study",
      "FEMA & RBI regulatory compliance advisory",
      "Asset protection trust & offshore holding legal design",
      "Investor Agreement & Term Sheet drafting"
    ]
  },
  {
    id: "immigration-roadmap",
    title: "Immigration & Emigration Roadmap Advisory",
    subtitle: "Build Your Immigration Roadmap — Plan Today. Progress Tomorrow.",
    tagline: "Don't plan only for entry — plan for the full immigration journey.",
    image: "/assets/service-immigration-mobility.jpg",
    badge: "Global Mobility",
    iconName: "Plane",
    priceIndia: "₹499 + 18% GST",
    priceInternational: "$5 USD",
    color: "from-indigo-600 to-cyan-900",
    description: "Comprehensive end-to-end immigration and emigration strategy for students, professionals, business owners, and families. Moving beyond basic visa entry to establish watertight legal status, long-term PR residency, and citizenship pathways worldwide.",
    features: [
      "9-Step Immigration Journey: Goal, Country, Category & Eligibility Mapping",
      "Study, Work, Business, Family Reunion & Investor Visa Legal Advisory",
      "Temporary Status, Visa Repudiation Defense & Compliance Filings",
      "Long-Term Permanent Residency (PR) & Citizenship Execution",
      "Dual-Jurisdiction Legal Alignment: India to USA, Canada, UK, UAE, EU & Australia"
    ],
    highlights: [
      { title: "Study & Work", desc: "Education & Career Growth Pathways" },
      { title: "Business & Investor", desc: "Commercial Expansion & Golden Visas" },
      { title: "Family & Settlement", desc: "Reunion & Permanent Residency" },
      { title: "Full Journey", desc: "Entry to Long-Term Citizenship" }
    ],
    deliverables: [
      "Custom 9-Step Personalised Immigration Strategy Document",
      "Document Due Diligence & Eligibility Audit",
      "Visa Repudiation Legal Defense & Appeal Notice",
      "Long-Term PR & Citizenship Legal Roadmap"
    ]
  },
  {
    id: "life-after-divorce",
    title: "Family Law & Life After Divorce Advisory",
    subtitle: "A New Chapter. A Brighter You. Practical guidance, emotional support & legal clarity.",
    tagline: "Heal • Rebuild • Grow • Thrive",
    image: "/assets/service-family-law.jpg",
    badge: "Compassionate Care",
    iconName: "HeartHandshake",
    priceIndia: "₹499 + 18% GST",
    priceInternational: "$5 USD",
    color: "from-purple-600 to-slate-900",
    description: "Empowering individuals undergoing matrimonial disputes or divorce with complete legal clarity, emotional fortitude, and practical life-planning solutions. Moving forward with strength and confidence.",
    features: [
      "Legal Rights Advisory: Alimony, Maintenance & Financial Settlements",
      "Child Custody, Guardianship & International Visitation Rights",
      "Matrimonial Asset Division & Cross-Border Property Claims",
      "Mutual Consent & Contested Divorce Proceedings in India & Abroad",
      "Holistic Guidance: Legal Strategy, Financial Planning & Rebuilding"
    ],
    highlights: [
      { title: "Legal Clarity", desc: "Understand rights under Indian & International Family Law" },
      { title: "Child Custody", desc: "Securing child welfare and access across borders" },
      { title: "Asset Settlement", desc: "Equitable division of joint holdings" },
      { title: "A Brighter Future", desc: "Step-by-step guidance to rebuild independence" }
    ],
    deliverables: [
      "Pre-divorce legal & asset risk evaluation",
      "Mutual Consent Divorce Petition & Settlement Agreement",
      "Child Custody & Support Agreement drafting",
      "Cross-border marriage legal status resolution"
    ]
  }
];

export const clientStats = [
  { value: "20+", label: "Years of Experience", desc: "In International & Corporate Law" },
  { value: "5000+", label: "Cases Handled", desc: "Across India & International Courts" },
  { value: "50+", label: "Global Markets", desc: "Jurisdictional Network & Partners" },
  { value: "99.4%", label: "Success Rate", desc: "In NRI Property & Contract Advisory" }
];

export const FAQs = [
  {
    category: "Immigration",
    question: "What is the 9-Step Immigration Roadmap and how does it differ from regular visa agents?",
    answer: "Unlike basic visa consultancies that only focus on initial entry visas, Dr. Karanam Rajesh Kumar's 9-Step Roadmap covers the full legal arc: Goal Definition, Country Selection, Visa Category Fitting, Document Due Diligence, Compliance, Extensions, Long-Term Permanent Residency (PR), and Dual Citizenship legalities under international law."
  },
  {
    category: "NRI Property",
    question: "Can an NRI buy or inherit property in India without visiting the country?",
    answer: "Yes. An NRI can execute property purchases, inheritances, and legal partition deeds by issuing a legally valid Special Power of Attorney (POA) attested at the Indian Embassy/Consulate in their country of residence. Dr. Karanam Rajesh Kumar provides end-to-end POA drafting, Embassy attestation guidance, and local legal registration."
  },
  {
    category: "International Contracts",
    question: "What makes an international commercial contract legally binding across multiple countries?",
    answer: "A bulletproof international contract requires clear choice-of-law provisions, defined arbitration seats (such as SIAC, LCIA, or ICC), precise governing jurisdiction clauses, and compliance with treaties like the UN Convention on Contracts for the International Sale of Goods (CISG) or New York Convention."
  },
  {
    category: "Global Business",
    question: "How does ILPU help Indian businesses expand into foreign markets?",
    answer: "ILPU (International Legal Processing Unit) assists businesses with foreign market entry structuring, local entity incorporation, cross-border regulatory compliance, international tax treaty benefits, custom distribution contracts, and FEMA compliance."
  },
  {
    category: "Family Law",
    question: "How are international divorces and child custody cases handled when spouses live in different countries?",
    answer: "Cross-border matrimonial law involves navigating dual jurisdictional rules, Hague Convention principles on child abduction (where applicable), international anti-suit injunctions, and foreign divorce decree recognition under Section 13 of the Indian Civil Procedure Code."
  },
  {
    category: "Investments",
    question: "What legal due diligence is required for cross-border investments under FEMA?",
    answer: "Under the Foreign Exchange Management Act (FEMA) in India, foreign direct investment (FDI) and overseas direct investment (ODI) require strict adherence to sector caps, pricing guidelines, RBI reporting (FC-GPR / FC-TRS forms), and anti-money laundering compliance."
  }
];
