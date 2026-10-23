/**
 * Synthetic Demo Businesses Seed Data
 * (A) Vidya Stationery & Xerox (College-adjacent, semester demand, bulk institution delay)
 * (B) Scoops & Swirls Cold Treat (Seasonal ice-cream, evening peaks, dairy power spikes & waste)
 * (C) Chai & Chutney All-Day Café (Multi-category bakery & snacks, Swiggy/Zomato delays, refund disputes)
 *
 * All money stored in integer minor units (paise). 100 paise = ₹1.00
 */

import {
  Business,
  Product,
  SalesOrder,
  FinancialRecord,
  Expense,
  MetricSnapshot,
  HealthAssessment,
  AIRecommendation,
  Experiment,
  LocationCandidate,
  PublicProfileSettings,
  FundingOffer,
  LedgerEntry,
  CustomerReview,
  ReviewTheme,
  DataSource,
} from "@/lib/types";

export interface DemoDatabase {
  businesses: Business[];
  products: Record<string, Product[]>;
  orders: Record<string, SalesOrder[]>;
  dataSources: Record<string, DataSource[]>;
  financialRecords: Record<string, FinancialRecord[]>;
  expenses: Record<string, Expense[]>;
  metrics: Record<string, MetricSnapshot[]>;
  healthAssessments: Record<string, HealthAssessment>;
  recommendations: Record<string, AIRecommendation[]>;
  experiments: Record<string, Experiment[]>;
  locations: Record<string, LocationCandidate[]>;
  publicProfiles: Record<string, PublicProfileSettings>;
  fundingOffers: Record<string, FundingOffer[]>;
  ledgerEntries: Record<string, LedgerEntry[]>;
  reviews: Record<string, CustomerReview[]>;
  reviewThemes: Record<string, ReviewTheme[]>;
}

export const DEMO_BUSINESSES: Business[] = [
  {
    id: "biz_stationery",
    name: "Vidya Stationery & Xerox",
    slug: "vidya-stationery",
    category: "stationery",
    categoryLabel: "Stationery & Document Centre",
    tagline: "Serving students and coaching hubs since 2018",
    gstin: "27AABCU9603R1ZM",
    address: "Shop 4, College Road, Near Pune University Campus",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411007",
    phone: "+91 98220 12345",
    email: "contact@vidyastationery.demo",
    foundedYear: 2018,
    description: "High-volume student stationery, spiral binding, thesis printing and competitive exam preparation material hub.",
    isSyntheticDemo: true,
    currency: "INR",
  },
  {
    id: "biz_icecream",
    name: "Scoops & Swirls Cold Treat",
    slug: "scoops-and-swirls",
    category: "ice_cream",
    categoryLabel: "Artisanal Ice Cream & Sundaes",
    tagline: "Handcrafted natural ice creams and evening desserts",
    gstin: "29AADCS8401P1ZN",
    address: "Plot 12, 5th Block, Koramangala",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560095",
    phone: "+91 98450 67890",
    email: "scoops@coldtreat.demo",
    foundedYear: 2021,
    description: "Fresh fruit seasonal gelato, sundaes and waffle cones with heavy evening pedestrian foot traffic and summer surge.",
    isSyntheticDemo: true,
    currency: "INR",
  },
  {
    id: "biz_cafe",
    name: "Chai & Chutney All-Day Café",
    slug: "chai-and-chutney",
    category: "cafe",
    categoryLabel: "Quick-Service Café & Bakery",
    tagline: "Traditional chai, fresh artisanal buns and quick snacks",
    gstin: "07AAECB3302K1ZP",
    address: "M-Block Market, Greater Kailash 2",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110048",
    phone: "+91 98110 54321",
    email: "hello@chaichutney.demo",
    foundedYear: 2020,
    description: "Specialty kadak chai, bun maska, samosa combos, breakfast platters with dine-in and multi-aggregator delivery.",
    isSyntheticDemo: true,
    currency: "INR",
  },
];

export const INITIAL_DEMO_DATA: DemoDatabase = {
  businesses: DEMO_BUSINESSES,

  // ═════════════════════════════════════════════════════════════════
  // 1. PRODUCTS (with paise values & hero product rankings)
  // ═════════════════════════════════════════════════════════════════
  products: {
    biz_stationery: [
      {
        id: "prod_stat_1",
        businessId: "biz_stationery",
        name: "Thesis Printing & Hard Spiral Binding",
        category: "Printing",
        sku: "PRN-THS-01",
        sellingPricePaise: 45000, // ₹450
        costPricePaise: 18000,    // ₹180
        marginPercent: 60.0,
        stockUnits: 850,
        reorderPoint: 200,
        isHero: true,
        unitsSold30d: 320,
        revenue30dPaise: 14400000, // ₹1,44,000
      },
      {
        id: "prod_stat_2",
        businessId: "biz_stationery",
        name: "Classmate Notebooks 6-Pack (300 pgs)",
        category: "Paper",
        sku: "PAP-NTB-06",
        sellingPricePaise: 36000, // ₹360
        costPricePaise: 26000,    // ₹260
        marginPercent: 27.8,
        stockUnits: 180,
        reorderPoint: 150,
        isHero: true,
        unitsSold30d: 410,
        revenue30dPaise: 14760000, // ₹1,47,600
      },
      {
        id: "prod_stat_3",
        businessId: "biz_stationery",
        name: "Engineering Drawing Sheet Pack & Folder",
        category: "Art & Tech",
        sku: "ART-ENG-02",
        sellingPricePaise: 28000, // ₹280
        costPricePaise: 15000,    // ₹150
        marginPercent: 46.4,
        stockUnits: 65,
        reorderPoint: 100, // Stockout risk!
        isHero: false,
        unitsSold30d: 140,
        revenue30dPaise: 3920000,
      },
      {
        id: "prod_stat_4",
        businessId: "biz_stationery",
        name: "Pilot V7 Hi-Tecpoint Pen (Black/Blue)",
        category: "Pens",
        sku: "PEN-PLT-07",
        sellingPricePaise: 8000, // ₹80
        costPricePaise: 5800,    // ₹58
        marginPercent: 27.5,
        stockUnits: 420,
        reorderPoint: 100,
        isHero: false,
        unitsSold30d: 650,
        revenue30dPaise: 5200000,
      },
      {
        id: "prod_stat_5",
        businessId: "biz_stationery",
        name: "High-Speed B&W Xerox (per 100 pages)",
        category: "Printing",
        sku: "PRN-XRX-100",
        sellingPricePaise: 15000, // ₹150
        costPricePaise: 4500,     // ₹45
        marginPercent: 70.0,
        stockUnits: 5000,
        reorderPoint: 1000,
        isHero: true,
        unitsSold30d: 890,
        revenue30dPaise: 13350000,
      },
    ],

    biz_icecream: [
      {
        id: "prod_ice_1",
        businessId: "biz_icecream",
        name: "Alphonso Mango Double Scoop Sundae",
        category: "Seasonal Gelato",
        sku: "ICE-MNG-02",
        sellingPricePaise: 24000, // ₹240
        costPricePaise: 9500,     // ₹95
        marginPercent: 60.4,
        stockUnits: 140,
        reorderPoint: 50,
        isHero: true,
        unitsSold30d: 740,
        revenue30dPaise: 17760000, // ₹1,77,600
      },
      {
        id: "prod_ice_2",
        businessId: "biz_icecream",
        name: "Belgian Dark Chocolate Waffle Cone",
        category: "Classic Cones",
        sku: "ICE-WFL-DK",
        sellingPricePaise: 18000, // ₹180
        costPricePaise: 7200,     // ₹72
        marginPercent: 60.0,
        stockUnits: 210,
        reorderPoint: 60,
        isHero: true,
        unitsSold30d: 980,
        revenue30dPaise: 17640000, // ₹1,76,400
      },
      {
        id: "prod_ice_3",
        businessId: "biz_icecream",
        name: "Tender Coconut Tub (500ml Takeaway)",
        category: "Takeaway Tubs",
        sku: "ICE-TUB-TCT",
        sellingPricePaise: 38000, // ₹380
        costPricePaise: 17000,    // ₹170
        marginPercent: 55.3,
        stockUnits: 35,
        reorderPoint: 40,
        isHero: false,
        unitsSold30d: 220,
        revenue30dPaise: 8360000,
      },
      {
        id: "prod_ice_4",
        businessId: "biz_icecream",
        name: "Nutty Roasted Almond Scoop",
        category: "Cups",
        sku: "ICE-ALM-01",
        sellingPricePaise: 14000, // ₹140
        costPricePaise: 6500,     // ₹65
        marginPercent: 53.6,
        stockUnits: 90,
        reorderPoint: 40,
        isHero: false,
        unitsSold30d: 530,
        revenue30dPaise: 7420000,
      },
    ],

    biz_cafe: [
      {
        id: "prod_cafe_1",
        businessId: "biz_cafe",
        name: "Signature Adrak Masala Chai (Pot for 2)",
        category: "Hot Beverages",
        sku: "BEV-CHAI-02",
        sellingPricePaise: 16000, // ₹160
        costPricePaise: 3500,     // ₹35
        marginPercent: 78.1,
        stockUnits: 999,
        reorderPoint: 200,
        isHero: true,
        unitsSold30d: 1420,
        revenue30dPaise: 22720000, // ₹2,27,200
      },
      {
        id: "prod_cafe_2",
        businessId: "biz_cafe",
        name: "Bun Maska & Crispy Irani Samosa Combo",
        category: "Combos",
        sku: "FOD-CMB-01",
        sellingPricePaise: 22000, // ₹220
        costPricePaise: 8800,     // ₹88
        marginPercent: 60.0,
        stockUnits: 450,
        reorderPoint: 100,
        isHero: true,
        unitsSold30d: 890,
        revenue30dPaise: 19580000, // ₹1,95,800
      },
      {
        id: "prod_cafe_3",
        businessId: "biz_cafe",
        name: "Paneer Tikka Grilled Sandwich",
        category: "Food",
        sku: "FOD-SND-PT",
        sellingPricePaise: 26000, // ₹260
        costPricePaise: 11500,    // ₹115
        marginPercent: 55.8,
        stockUnits: 120,
        reorderPoint: 50,
        isHero: false,
        unitsSold30d: 610,
        revenue30dPaise: 15860000,
      },
      {
        id: "prod_cafe_4",
        businessId: "biz_cafe",
        name: "Cold Coffee with Dark Chocolate Drizzle",
        category: "Cold Beverages",
        sku: "BEV-COF-CLD",
        sellingPricePaise: 19000, // ₹190
        costPricePaise: 6500,     // ₹65
        marginPercent: 65.8,
        stockUnits: 300,
        reorderPoint: 80,
        isHero: false,
        unitsSold30d: 730,
        revenue30dPaise: 13870000,
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════
  // 2. DATA SOURCES & UPLOADS
  // ═════════════════════════════════════════════════════════════════
  dataSources: {
    biz_stationery: [
      {
        id: "ds_stat_pos",
        businessId: "biz_stationery",
        name: "POS Terminal Sales Export (Sept-Oct 2026)",
        type: "csv",
        status: "ready",
        confidence: 98,
        periodStart: "2026-09-01",
        periodEnd: "2026-10-20",
        recordCount: 2410,
        fileName: "pos_export_sep_oct_2026.csv",
        fileSizeKb: 342,
        uploadedAt: "2026-10-21T09:15:00Z",
      },
      {
        id: "ds_stat_upi",
        businessId: "biz_stationery",
        name: "ICICI Merchant UPI Statement",
        type: "xlsx",
        status: "needs_review",
        confidence: 88,
        periodStart: "2026-09-01",
        periodEnd: "2026-10-20",
        recordCount: 1845,
        fileName: "icici_upi_settlements_oct.xlsx",
        fileSizeKb: 512,
        uploadedAt: "2026-10-21T09:20:00Z",
        uncertainCount: 3,
        validationErrors: ["Row #412: Unmatched settlement reference format", "Row #891: Potential duplicate credit ₹4,500"],
      },
      {
        id: "ds_stat_ocr",
        businessId: "biz_stationery",
        name: "Vendor Paper Stock Bills (Paper Corp)",
        type: "pdf",
        status: "needs_review",
        confidence: 76,
        periodStart: "2026-10-05",
        periodEnd: "2026-10-15",
        recordCount: 14,
        fileName: "scanned_paper_supplier_invoices.pdf",
        fileSizeKb: 4820,
        uploadedAt: "2026-10-22T14:10:00Z",
        uncertainCount: 2,
        validationErrors: ["Invoice #204: Smudged GSTIN digits (Beta OCR extraction)"],
      },
    ],
    biz_icecream: [
      {
        id: "ds_ice_pos",
        businessId: "biz_icecream",
        name: "Petpooja POS Shift Reports",
        type: "csv",
        status: "ready",
        confidence: 96,
        periodStart: "2026-09-01",
        periodEnd: "2026-10-20",
        recordCount: 3120,
        fileName: "petpooja_pos_shifts.csv",
        fileSizeKb: 490,
        uploadedAt: "2026-10-21T11:00:00Z",
      },
    ],
    biz_cafe: [
      {
        id: "ds_cafe_pos",
        businessId: "biz_cafe",
        name: "UrbanPiper Unified POS & Swiggy/Zomato",
        type: "csv",
        status: "ready",
        confidence: 94,
        periodStart: "2026-09-01",
        periodEnd: "2026-10-20",
        recordCount: 4280,
        fileName: "urbanpiper_oct_unified.csv",
        fileSizeKb: 680,
        uploadedAt: "2026-10-21T10:45:00Z",
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════
  // 3. FINANCIAL RECORDS (with duplicates & unmatched for exception queue)
  // ═════════════════════════════════════════════════════════════════
  financialRecords: {
    biz_stationery: [
      {
        id: "rec_stat_01",
        businessId: "biz_stationery",
        dataSourceId: "ds_stat_upi",
        type: "settlement",
        amountPaise: 45000, // ₹450
        rawAmount: 450.0,
        date: "2026-10-18",
        referenceNumber: "UPI-ICICI-994812",
        counterparty: "ICICI Merchant Settlement",
        channel: "upi",
        status: "verified",
        confidence: 100,
      },
      {
        id: "rec_stat_02_dupe",
        businessId: "biz_stationery",
        dataSourceId: "ds_stat_upi",
        type: "settlement",
        amountPaise: 45000, // ₹450 (Duplicate submission in batch)
        rawAmount: 450.0,
        date: "2026-10-18",
        referenceNumber: "UPI-ICICI-994812", // Same reference
        counterparty: "ICICI Merchant Settlement",
        channel: "upi",
        status: "duplicate",
        confidence: 100,
        isDuplicate: true,
        note: "Conservative duplicate detection flagged identical reference UPI-ICICI-994812.",
      },
      {
        id: "rec_stat_03_unmatched",
        businessId: "biz_stationery",
        dataSourceId: "ds_stat_upi",
        type: "settlement",
        amountPaise: 1250000, // ₹12,500 bulk payment
        rawAmount: 12500.0,
        date: "2026-10-19",
        referenceNumber: "NEFT-UNIV-ENG-4412",
        counterparty: "Modern Engineering College Pune",
        channel: "bank_transfer",
        status: "unmatched",
        confidence: 72,
        note: "Bulk university semester examination booklet printing payment. Pending matching to 3 invoice batches.",
      },
      {
        id: "rec_stat_04_unmatched",
        businessId: "biz_stationery",
        dataSourceId: "ds_stat_upi",
        type: "settlement",
        amountPaise: 185000, // ₹1,850
        rawAmount: 1850.0,
        date: "2026-10-20",
        referenceNumber: "UPI-PAYTM-33104",
        counterparty: "Direct UPI Scanner",
        channel: "upi",
        status: "unmatched",
        confidence: 68,
        note: "Amount discrepancy: customer scanned QR code with ₹150 manual tip/fee difference.",
      },
      {
        id: "rec_stat_05_uncertain",
        businessId: "biz_stationery",
        dataSourceId: "ds_stat_ocr",
        type: "expense",
        amountPaise: 4850000, // ₹48,500
        rawAmount: 48500.0,
        date: "2026-10-12",
        referenceNumber: "INV-BALAJI-449",
        counterparty: "Balaji Paper Mills",
        channel: "bank_transfer",
        status: "uncertain",
        confidence: 62,
        uncertainFields: ["vendorGstin", "taxRatePercent"],
        note: "OCR extraction low-confidence on handwritten GST rate field (needs owner check).",
      },
    ],
    biz_icecream: [],
    biz_cafe: [],
  },

  // ═════════════════════════════════════════════════════════════════
  // 4. SALES ORDERS
  // ═════════════════════════════════════════════════════════════════
  orders: {
    biz_stationery: [
      {
        id: "ord_stat_101",
        businessId: "biz_stationery",
        orderNumber: "ORD-2026-101",
        date: "2026-10-18",
        time: "10:15",
        channel: "upi",
        totalPaise: 45000,
        taxPaise: 2250,
        status: "completed",
        customerType: "student",
        linesCount: 1,
      },
      {
        id: "ord_stat_102",
        businessId: "biz_stationery",
        orderNumber: "ORD-2026-102",
        date: "2026-10-19",
        time: "11:30",
        channel: "bank_transfer",
        totalPaise: 650000,
        taxPaise: 32500,
        status: "completed",
        customerType: "corporate",
        linesCount: 3,
      },
      {
        id: "ord_stat_103",
        businessId: "biz_stationery",
        orderNumber: "ORD-2026-103",
        date: "2026-10-19",
        time: "12:00",
        channel: "bank_transfer",
        totalPaise: 600000,
        taxPaise: 30000,
        status: "completed",
        customerType: "corporate",
        linesCount: 2,
      },
      {
        id: "ord_stat_104",
        businessId: "biz_stationery",
        orderNumber: "ORD-2026-104",
        date: "2026-10-20",
        time: "14:20",
        channel: "upi",
        totalPaise: 170000,
        taxPaise: 8500,
        status: "completed",
        customerType: "student",
        linesCount: 2,
      },
    ],
    biz_icecream: [],
    biz_cafe: [],
  },

  // ═════════════════════════════════════════════════════════════════
  // 5. EXPENSES
  // ═════════════════════════════════════════════════════════════════
  expenses: {
    biz_stationery: [
      {
        id: "exp_stat_1",
        businessId: "biz_stationery",
        category: "rent",
        description: "Shop 4 ground floor rent (College Rd)",
        amountPaise: 3500000, // ₹35,000
        date: "2026-10-01",
        isRecurring: true,
        vendor: "Kulkarni Properties",
      },
      {
        id: "exp_stat_2",
        businessId: "biz_stationery",
        category: "electricity",
        description: "MSEDCL High-load commercial power bill (heavy xerox)",
        amountPaise: 1850000, // ₹18,500
        date: "2026-10-05",
        isRecurring: true,
        vendor: "MSEDCL Maharashtra",
      },
      {
        id: "exp_stat_3",
        businessId: "biz_stationery",
        category: "raw_materials",
        description: "JK Copier 75GSM A4 paper reams (120 boxes)",
        amountPaise: 8400000, // ₹84,000
        date: "2026-10-08",
        isRecurring: false,
        vendor: "Balaji Paper Traders",
      },
      {
        id: "exp_stat_4",
        businessId: "biz_stationery",
        category: "staff",
        description: "2 full-time Xerox operators & counter staff stipend",
        amountPaise: 3200000, // ₹32,000
        date: "2026-10-05",
        isRecurring: true,
        vendor: "Staff Payroll",
      },
    ],
    biz_icecream: [
      {
        id: "exp_ice_1",
        businessId: "biz_icecream",
        category: "rent",
        description: "Koramangala 5th Block prime retail lease",
        amountPaise: 6500000, // ₹65,000
        date: "2026-10-01",
        isRecurring: true,
        vendor: "Reddy Estates",
      },
      {
        id: "exp_ice_2",
        businessId: "biz_icecream",
        category: "electricity",
        description: "BESCOM Commercial 3-Phase Deep Freezers & Chiller Bill",
        amountPaise: 2950000, // ₹29,500 (Electricity spike!)
        date: "2026-10-06",
        isRecurring: true,
        vendor: "BESCOM Bengaluru",
      },
      {
        id: "exp_ice_3",
        businessId: "biz_icecream",
        category: "raw_materials",
        description: "Nandini Premium Dairy Cream, Milk & Fresh Fruit Puree",
        amountPaise: 9200000, // ₹92,000
        date: "2026-10-10",
        isRecurring: false,
        vendor: "KMF Nandini Dairy",
      },
    ],
    biz_cafe: [
      {
        id: "exp_cafe_1",
        businessId: "biz_cafe",
        category: "rent",
        description: "GK-2 M-Block Market Ground Floor lease",
        amountPaise: 7500000, // ₹75,000
        date: "2026-10-01",
        isRecurring: true,
        vendor: "Malhotra Holdings",
      },
      {
        id: "exp_cafe_2",
        businessId: "biz_cafe",
        category: "staff",
        description: "Head chef, barista, kitchen helpers & steward (4 staff)",
        amountPaise: 6800000, // ₹68,000
        date: "2026-10-05",
        isRecurring: true,
        vendor: "Café Team Salaries",
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════
  // 6. METRIC SNAPSHOTS (with exact formula, period, coverage, confidence)
  // ═════════════════════════════════════════════════════════════════
  metrics: {
    biz_stationery: [
      {
        id: "m_stat_sales",
        businessId: "biz_stationery",
        period: "Last 30 Days (21 Sep - 20 Oct 2026)",
        metricCode: "M-201",
        name: "Gross Verified Sales",
        value: 51630000, // ₹5,16,300
        unit: "paise",
        previousValue: 46500000,
        changePercent: 11.0,
        formula: "SUM(Verified Sales Orders totalPaise)",
        sourceCoveragePercent: 96,
        confidence: "high",
        tagType: "fact",
        dataSourceIds: ["ds_stat_pos", "ds_stat_upi"],
        definition: "Reconciled total of all confirmed student and institutional sales bills generated at the counter and digital QR.",
        sparklineData: [42, 45, 48, 47, 52, 56, 51],
      },
      {
        id: "m_stat_orders",
        businessId: "biz_stationery",
        period: "Last 30 Days",
        metricCode: "M-202",
        name: "Total Orders Count",
        value: 2410,
        unit: "count",
        previousValue: 2210,
        changePercent: 9.0,
        formula: "COUNT(DISTINCT SalesOrder.id)",
        sourceCoveragePercent: 100,
        confidence: "high",
        tagType: "fact",
        dataSourceIds: ["ds_stat_pos"],
        definition: "Total unique printed bills and counter invoices. Note: bills do not necessarily equal unique footfall.",
        sparklineData: [65, 72, 70, 78, 85, 92, 80],
      },
      {
        id: "m_stat_aov",
        businessId: "biz_stationery",
        period: "Last 30 Days",
        metricCode: "M-203",
        name: "Average Order Value (AOV)",
        value: 21423, // ₹214.23
        unit: "paise",
        previousValue: 21040,
        changePercent: 1.8,
        formula: "Gross Verified Sales / Total Orders Count",
        sourceCoveragePercent: 96,
        confidence: "high",
        tagType: "fact",
        dataSourceIds: ["ds_stat_pos"],
        definition: "Average revenue generated per completed billing transaction across student purchases and xerox jobs.",
        sparklineData: [210, 212, 215, 211, 214, 218, 214],
      },
      {
        id: "m_stat_cashflow",
        businessId: "biz_stationery",
        period: "Last 30 Days",
        metricCode: "M-204",
        name: "Net Operating Cash Flow",
        value: 17230000, // ₹1,72,300
        unit: "paise",
        previousValue: 14800000,
        changePercent: 16.4,
        formula: "Reconciled Bank Inflows - Documented Operating Expenses",
        sourceCoveragePercent: 91,
        confidence: "high",
        tagType: "fact",
        dataSourceIds: ["ds_stat_upi", "ds_stat_pos"],
        definition: "Actual surplus cash after paying rent, paper inventory, power tariffs and counter operator stipends.",
        sparklineData: [20, 22, 25, 24, 28, 30, 29],
      },
    ],

    biz_icecream: [
      {
        id: "m_ice_sales",
        businessId: "biz_icecream",
        period: "Last 30 Days",
        metricCode: "M-301",
        name: "Gross Verified Sales",
        value: 51180000, // ₹5,11,800
        unit: "paise",
        previousValue: 56800000,
        changePercent: -9.9, // Post-summer dip
        formula: "SUM(Verified Sales Orders totalPaise)",
        sourceCoveragePercent: 94,
        confidence: "high",
        tagType: "fact",
        dataSourceIds: ["ds_ice_pos"],
        definition: "Reconciled ice cream parlor counter and dessert takeaway sales.",
        sparklineData: [62, 59, 58, 55, 53, 50, 51],
      },
      {
        id: "m_ice_orders",
        businessId: "biz_icecream",
        period: "Last 30 Days",
        metricCode: "M-302",
        name: "Total Orders Count",
        value: 2470,
        unit: "count",
        previousValue: 2700,
        changePercent: -8.5,
        formula: "COUNT(DISTINCT SalesOrder.id)",
        sourceCoveragePercent: 98,
        confidence: "high",
        tagType: "fact",
        dataSourceIds: ["ds_ice_pos"],
        definition: "Completed customer dessert tickets.",
        sparklineData: [85, 82, 80, 77, 75, 72, 73],
      },
      {
        id: "m_ice_aov",
        businessId: "biz_icecream",
        period: "Last 30 Days",
        metricCode: "M-303",
        name: "Average Order Value (AOV)",
        value: 20720, // ₹207.20
        unit: "paise",
        previousValue: 21037,
        changePercent: -1.5,
        formula: "Gross Sales / Total Orders",
        sourceCoveragePercent: 94,
        confidence: "high",
        tagType: "fact",
        dataSourceIds: ["ds_ice_pos"],
        definition: "Average basket size per evening customer.",
        sparklineData: [210, 209, 208, 206, 207, 208, 207],
      },
      {
        id: "m_ice_cashflow",
        businessId: "biz_icecream",
        period: "Last 30 Days",
        metricCode: "M-304",
        name: "Net Operating Cash Flow",
        value: 12530000, // ₹1,25,300
        unit: "paise",
        previousValue: 18200000,
        changePercent: -31.1,
        formula: "Reconciled Inflows - Documented Expenses (Electricity + Dairy)",
        sourceCoveragePercent: 90,
        confidence: "medium",
        tagType: "fact",
        dataSourceIds: ["ds_ice_pos"],
        definition: "Net cash impacted by compressor maintenance and BESCOM tariff increases.",
        sparklineData: [28, 25, 23, 20, 18, 16, 17],
      },
    ],

    biz_cafe: [
      {
        id: "m_cafe_sales",
        businessId: "biz_cafe",
        period: "Last 30 Days",
        metricCode: "M-401",
        name: "Gross Verified Sales",
        value: 72030000, // ₹7,20,300
        unit: "paise",
        previousValue: 68900000,
        changePercent: 4.5,
        formula: "SUM(UrbanPiper POS + Swiggy + Zomato)",
        sourceCoveragePercent: 93,
        confidence: "high",
        tagType: "fact",
        dataSourceIds: ["ds_cafe_pos"],
        definition: "Total dine-in, takeaway, and food aggregator orders.",
        sparklineData: [68, 70, 69, 72, 71, 74, 72],
      },
      {
        id: "m_cafe_orders",
        businessId: "biz_cafe",
        period: "Last 30 Days",
        metricCode: "M-402",
        name: "Total Orders Count",
        value: 3650,
        unit: "count",
        previousValue: 3520,
        changePercent: 3.7,
        formula: "COUNT(Orders across all channels)",
        sourceCoveragePercent: 95,
        confidence: "high",
        tagType: "fact",
        dataSourceIds: ["ds_cafe_pos"],
        definition: "Combined customer tickets.",
        sparklineData: [110, 114, 112, 118, 115, 122, 119],
      },
      {
        id: "m_cafe_aov",
        businessId: "biz_cafe",
        period: "Last 30 Days",
        metricCode: "M-403",
        name: "Average Order Value (AOV)",
        value: 19734, // ₹197.34
        unit: "paise",
        previousValue: 19573,
        changePercent: 0.8,
        formula: "Gross Sales / Total Orders",
        sourceCoveragePercent: 93,
        confidence: "high",
        tagType: "fact",
        dataSourceIds: ["ds_cafe_pos"],
        definition: "Average ticket across chai counters and table dining.",
        sparklineData: [195, 196, 195, 197, 198, 197, 197],
      },
      {
        id: "m_cafe_cashflow",
        businessId: "biz_cafe",
        period: "Last 30 Days",
        metricCode: "M-404",
        name: "Net Operating Cash Flow",
        value: 23200000, // ₹2,32,000
        unit: "paise",
        previousValue: 21900000,
        changePercent: 5.9,
        formula: "Net Bank Receipts - Food Costs & Payroll",
        sourceCoveragePercent: 89,
        confidence: "high",
        tagType: "fact",
        dataSourceIds: ["ds_cafe_pos"],
        definition: "Cash balance after GK-2 lease payments and ingredient supplies.",
        sparklineData: [32, 34, 33, 36, 35, 38, 37],
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════
  // 7. BUSINESS HEALTH PROFILES (0-100 explainable indicators)
  // ═════════════════════════════════════════════════════════════════
  healthAssessments: {
    biz_stationery: {
      id: "bhp_stat_1",
      businessId: "biz_stationery",
      evaluatedAt: "2026-10-21T18:00:00Z",
      overallScore: 84,
      revenueConsistencyScore: 18, // 18/20
      cashFlowHealthScore: 17,     // 17/20
      dataReliabilityScore: 14,    // 14/15
      profitabilityScore: 13,      // 13/15
      operatingStabilityScore: 13, // 13/15
      repaymentHistoryScore: 5,    // 5/10 (new simulated repayment history)
      growthReadinessScore: 4,     // 4/5
      confidence: "high",
      coveragePercent: 94,
      formulaVersion: "BHP-v2.0-deterministic",
      disclaimer: "Platform-generated indicator. Not a credit-bureau score and not a guarantee of funding or returns.",
    },
    biz_icecream: {
      id: "bhp_ice_1",
      businessId: "biz_icecream",
      evaluatedAt: "2026-10-21T18:00:00Z",
      overallScore: 71,
      revenueConsistencyScore: 12, // Seasonality dip
      cashFlowHealthScore: 14,
      dataReliabilityScore: 13,
      profitabilityScore: 14,
      operatingStabilityScore: 10, // Electricity overhead pressure
      repaymentHistoryScore: 4,
      growthReadinessScore: 4,
      confidence: "medium",
      coveragePercent: 88,
      formulaVersion: "BHP-v2.0-deterministic",
      disclaimer: "Platform-generated indicator. Not a credit-bureau score and not a guarantee of funding or returns.",
    },
    biz_cafe: {
      id: "bhp_cafe_1",
      businessId: "biz_cafe",
      evaluatedAt: "2026-10-21T18:00:00Z",
      overallScore: 88,
      revenueConsistencyScore: 19,
      cashFlowHealthScore: 18,
      dataReliabilityScore: 14,
      profitabilityScore: 14,
      operatingStabilityScore: 14,
      repaymentHistoryScore: 5,
      growthReadinessScore: 4,
      confidence: "high",
      coveragePercent: 93,
      formulaVersion: "BHP-v2.0-deterministic",
      disclaimer: "Platform-generated indicator. Not a credit-bureau score and not a guarantee of funding or returns.",
    },
  },

  // ═════════════════════════════════════════════════════════════════
  // 8. AI RECOMMENDATIONS & GROWTH ACTIONS (ApprovalCard format)
  // ═════════════════════════════════════════════════════════════════
  recommendations: {
    biz_stationery: [
      {
        id: "rec_stat_g1",
        businessId: "biz_stationery",
        title: "Launch Engineering Drawing Kit Bundle before Mid-Term Submission Week",
        finding: "High Xerox volume (890 units) has a 70% gross margin, but Engineering Drawing Kits are at reorder risk (65 units remaining) right before university mid-terms.",
        evidenceIds: ["M-201", "M-203", "prod_stat_3"],
        period: "15 Oct - 20 Oct 2026",
        explanation: "Combining spiral-bound assignment sheets with draft folders at ₹480 (saving students ₹80) will drive early bulk cash flow before semester deadlines.",
        action: "Create 'Semester Mid-Term Submission Bundle' combining 1x Folder, 2x Notebooks, and 50 Xerox vouchers.",
        estimatedCostPaise: 450000, // ₹4,500 promotional flyers & packaging
        expectedImpact: "+₹28,000 net revenue in 14 days with zero extra labor overhead.",
        confidence: "high",
        risks: "Supplier paper price volatility; requires restock of drawing sheets within 4 days.",
        successMetric: "Sell 60 bundles and lift notebook sales by >15% over baseline.",
        reviewDate: "2026-11-04",
        status: "pending",
      },
      {
        id: "rec_stat_g2",
        businessId: "biz_stationery",
        title: "Reconcile Delayed Pune University Exam Booklet Settlement",
        finding: "Unmatched bank transfer of ₹12,500 from Modern Engineering College (Ref NEFT-UNIV-ENG-4412) has been sitting in exception queue for 4 days.",
        evidenceIds: ["rec_stat_03_unmatched", "M-204"],
        period: "19 Oct 2026",
        explanation: "Applying this payment against the 3 pending department invoices will immediately boost reconciled revenue and lift Data Reliability score by +2 points.",
        action: "Approve 3-way split match in Reconciliation Workspace.",
        estimatedCostPaise: 0,
        expectedImpact: "Reconciles ₹12,500 in pending receivables and clears aged exception queue.",
        confidence: "high",
        risks: "None; matches department invoice PO-448 and signed delivery challan.",
        successMetric: "Zero aged unmatched items > 3 days in Reconciliation Workspace.",
        reviewDate: "2026-10-25",
        status: "approved",
        approvedAt: "2026-10-22T10:00:00Z",
        experimentId: "exp_stat_run1",
      },
    ],
    biz_icecream: [
      {
        id: "rec_ice_g1",
        businessId: "biz_icecream",
        title: "Introduce Late-Evening Dessert Combo (9:30 PM - 11:30 PM)",
        finding: "Sales dip by 28% on weekday evenings after 9 PM, yet Koramangala restaurant pedestrian footfall remains active until midnight.",
        evidenceIds: ["M-301", "prod_ice_1", "prod_ice_2"],
        period: "01 Oct - 20 Oct 2026",
        explanation: "A discounted post-dinner sundae pair (Alphonso Mango + Belgian Waffle) priced at ₹380 attracts couples leaving nearby restaurants.",
        action: "Display neon counter chalkboard 'Midnight Sweet Tooth Pairing' from 9:30 PM.",
        estimatedCostPaise: 200000, // ₹2,000 board signage
        expectedImpact: "+₹35,000 monthly incremental revenue using existing store staff hours.",
        confidence: "high",
        risks: "Slight margin dilution if opted by solo dine-in customers.",
        successMetric: "Increase post-9 PM ticket count from 18 to 35 per evening.",
        reviewDate: "2026-11-10",
        status: "pending",
      },
    ],
    biz_cafe: [
      {
        id: "rec_cafe_g1",
        businessId: "biz_cafe",
        title: "Optimize Bun Maska & Adrak Chai Breakfast Window",
        finding: "Chai margins are 78.1%, while Bun Maska combos peak between 8:30 AM and 11:00 AM with 890 units sold monthly.",
        evidenceIds: ["prod_cafe_1", "prod_cafe_2", "M-401"],
        period: "Last 30 Days",
        explanation: "Fast-track morning counter service with pre-portioned maska buns to shave 3 minutes off queue times.",
        action: "Implement dedicated Express Morning Pickup counter from 8 AM to 11 AM.",
        estimatedCostPaise: 150000,
        expectedImpact: "+12% morning ticket throughput during peak office commute.",
        confidence: "high",
        risks: "Requires kitchen prep to start 30 minutes earlier.",
        successMetric: "Serve 25 additional morning breakfast tickets daily.",
        reviewDate: "2026-11-05",
        status: "approved",
        approvedAt: "2026-10-21T08:30:00Z",
        experimentId: "exp_cafe_run1",
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════
  // 9. EXPERIMENTS KANBAN BOARD (Baseline -> Running -> Result -> Decision)
  // ═════════════════════════════════════════════════════════════════
  experiments: {
    biz_stationery: [
      {
        id: "exp_stat_run1",
        businessId: "biz_stationery",
        recommendationId: "rec_stat_g2",
        title: "Reconcile Institutional University Credit & Streamline Invoicing",
        hypothesis: "Splitting bulk college exam payments into pre-matched departmental challans eliminates settlement delays and frees up ₹12,500 working capital.",
        stage: "running",
        baselineMetric: "Unmatched Settlement Age",
        baselineValue: 6.2, // days
        targetValue: 1.0,
        currentValue: 2.1,
        unit: "days",
        budgetCapPaise: 0,
        spentPaise: 0,
        startDate: "2026-10-22",
        timeline: [
          { date: "2026-10-18", value: 6.2 },
          { date: "2026-10-20", value: 4.5 },
          { date: "2026-10-22", value: 2.1 },
        ],
      },
      {
        id: "exp_stat_done1",
        businessId: "biz_stationery",
        title: "Express Spiral Binding Counter for Student Thesis",
        hypothesis: "Guaranteed 15-minute binding during submission weeks increases volume by 20% despite ₹30 express premium.",
        stage: "result",
        decision: "keep",
        baselineMetric: "Weekly Binding Jobs",
        baselineValue: 120,
        targetValue: 145,
        currentValue: 168,
        unit: "jobs",
        budgetCapPaise: 500000, // ₹5,000
        spentPaise: 380000,
        startDate: "2026-09-25",
        endDate: "2026-10-15",
        timeline: [
          { date: "2026-09-25", value: 120 },
          { date: "2026-10-02", value: 138 },
          { date: "2026-10-09", value: 155 },
          { date: "2026-10-15", value: 168 },
        ],
      },
    ],
    biz_icecream: [
      {
        id: "exp_ice_run1",
        businessId: "biz_icecream",
        title: "Compressor Night Timer Schedule Optimization",
        hypothesis: "Programming freezer defrost cycles to off-peak night electricity tariff hours lowers monthly power bill by >₹6,000 without temperature risk.",
        stage: "running",
        baselineMetric: "Daily Power Draw",
        baselineValue: 98,
        targetValue: 80,
        currentValue: 84,
        unit: "kWh",
        budgetCapPaise: 350000,
        spentPaise: 280000,
        startDate: "2026-10-10",
        timeline: [
          { date: "2026-10-10", value: 98 },
          { date: "2026-10-15", value: 89 },
          { date: "2026-10-20", value: 84 },
        ],
      },
    ],
    biz_cafe: [
      {
        id: "exp_cafe_run1",
        businessId: "biz_cafe",
        recommendationId: "rec_cafe_g1",
        title: "Express Morning Bun Maska Pickup Counter",
        hypothesis: "Pre-packaging bun maska portions between 8:30 and 10:30 AM increases commuter ticket volume by 15%.",
        stage: "running",
        baselineMetric: "Morning Tickets (8-11 AM)",
        baselineValue: 65,
        targetValue: 80,
        currentValue: 78,
        unit: "tickets",
        budgetCapPaise: 150000,
        spentPaise: 120000,
        startDate: "2026-10-21",
        timeline: [
          { date: "2026-10-21", value: 65 },
          { date: "2026-10-22", value: 72 },
          { date: "2026-10-23", value: 78 },
        ],
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════
  // 10. LOCATION CANDIDATES (Conservative, Base, Optimistic scenarios)
  // ═════════════════════════════════════════════════════════════════
  locations: {
    biz_stationery: [
      {
        id: "loc_stat_1",
        businessId: "biz_stationery",
        areaName: "FC Road (Near Fergusson College & Symbiosis Law)",
        city: "Pune",
        distanceKm: 3.4,
        monthlyRentPaise: 4200000, // ₹42,000
        estimatedCapexPaise: 25000000, // ₹2,50,000 setup & xerox lease
        nearbyCollegesOffices: "Fergusson College (8,500 students), BMCC, Symbiosis Law Campus",
        competitorDensity: "high",
        accessibilityRating: 4.8,
        conservativeRevenuePaise: 38000000, // ₹3.8 L/mo
        baseRevenuePaise: 49000000,         // ₹4.9 L/mo
        optimisticRevenuePaise: 62000000,   // ₹6.2 L/mo
        conservativeNetPaise: 4200000,      // ₹42,000/mo net
        baseNetPaise: 12500000,             // ₹1,25,000/mo net
        optimisticNetPaise: 21000000,       // ₹2,10,000/mo net
        breakEvenMonths: 7,
        footfallLabel: "Footfall: not measured",
        confidence: "high",
        fieldVisitChecklist: [
          { id: "chk_1", task: "Verify 3-phase commercial electricity meter capacity for xerox load", done: true },
          { id: "chk_2", task: "Inspect sidewalk setback and bike parking space for student crowds", done: true },
          { id: "chk_3", task: "Review copy shop competitor pricing within 200m radius", done: false },
          { id: "chk_4", task: "Confirm delivery truck access for monthly pallet paper reams", done: false },
        ],
      },
      {
        id: "loc_stat_2",
        businessId: "biz_stationery",
        areaName: "Viman Nagar (Near Symbiosis International & Tech Park)",
        city: "Pune",
        distanceKm: 9.8,
        monthlyRentPaise: 5500000, // ₹55,000
        estimatedCapexPaise: 32000000,
        nearbyCollegesOffices: "Symbiosis Institute of Design, Weikfield IT Park",
        competitorDensity: "medium",
        accessibilityRating: 4.2,
        conservativeRevenuePaise: 41000000,
        baseRevenuePaise: 54000000,
        optimisticRevenuePaise: 70000000,
        conservativeNetPaise: 2500000,
        baseNetPaise: 11000000,
        optimisticNetPaise: 22000000,
        breakEvenMonths: 9,
        footfallLabel: "Footfall: not measured",
        confidence: "medium",
        fieldVisitChecklist: [
          { id: "chk_v1", task: "Verify landlord willingness for long-term commercial lease", done: false },
          { id: "chk_v2", task: "Evaluate monsoon waterlogging risk on ground floor entrance", done: true },
          { id: "chk_v3", task: "Check courier delivery locker proximity for student projects", done: false },
        ],
      },
    ],
    biz_icecream: [
      {
        id: "loc_ice_1",
        businessId: "biz_icecream",
        areaName: "Indiranagar 12th Main Road",
        city: "Bengaluru",
        distanceKm: 4.8,
        monthlyRentPaise: 9500000, // ₹95,000
        estimatedCapexPaise: 45000000,
        nearbyCollegesOffices: "Pubs, boutiques, high evening pedestrian crowds",
        competitorDensity: "high",
        accessibilityRating: 4.6,
        conservativeRevenuePaise: 58000000,
        baseRevenuePaise: 75000000,
        optimisticRevenuePaise: 98000000,
        conservativeNetPaise: 3500000,
        baseNetPaise: 16500000,
        optimisticNetPaise: 31000000,
        breakEvenMonths: 11,
        footfallLabel: "Footfall: not measured",
        confidence: "medium",
        fieldVisitChecklist: [
          { id: "chk_i1", task: "Check dedicated backup generator for ice cream freezers", done: true },
          { id: "chk_i2", task: "Measure outdoor seating permit options with BBMP", done: false },
        ],
      },
    ],
    biz_cafe: [],
  },

  // ═════════════════════════════════════════════════════════════════
  // 11. PUBLIC PROFILE SETTINGS (Owner-controlled field visibility)
  // ═════════════════════════════════════════════════════════════════
  publicProfiles: {
    biz_stationery: {
      id: "pub_stat_1",
      businessId: "biz_stationery",
      storyApproved: true,
      storyText: "Vidya Stationery & Xerox has been the trusted print, thesis binding and study materials partner for Pune students and researchers since 2018.",
      categoryApproved: true,
      locationAreaApproved: true,
      areaLabel: "College Road, Pune University Area",
      servicesApproved: true,
      servicesList: ["Thesis Hard Binding", "Bulk B&W Xerox", "Engineering Printouts", "Student Project Stationery"],
      metricsApproved: true,
      allowedMetricCodes: ["M-201", "M-202"], // Only gross sales and order volume; private cashflow HIDDEN!
      reviewsApproved: true,
      demoOfferApproved: true,
      demoOfferTitle: "Student Thesis Print Pass",
      demoOfferDetail: "Show student ID for 10% discount on 100+ page dissertation printing and complimentary ribbon bookmark.",
    },
    biz_icecream: {
      id: "pub_ice_1",
      businessId: "biz_icecream",
      storyApproved: true,
      storyText: "Handcrafted natural ice creams prepared fresh daily with Alphonso mangoes, tender coconut and pure dairy cream in Koramangala.",
      categoryApproved: true,
      locationAreaApproved: true,
      areaLabel: "5th Block, Koramangala, Bengaluru",
      servicesApproved: true,
      servicesList: ["Fresh Fruit Gelato", "Fresh Baked Waffle Cones", "Late-Night Sundaes", "500ml Takeaway Tubs"],
      metricsApproved: false, // Owner opted out of public metric display
      allowedMetricCodes: [],
      reviewsApproved: true,
      demoOfferApproved: true,
      demoOfferTitle: "Evening Sweet Tooth Cone Upgrade",
      demoOfferDetail: "Buy any Double Scoop Sundae after 9 PM and get a complimentary waffle upgrade.",
    },
    biz_cafe: {
      id: "pub_cafe_1",
      businessId: "biz_cafe",
      storyApproved: true,
      storyText: "Traditional spiced kadak chai, Mumbai-style bun maska and all-day Indian comfort food in Greater Kailash.",
      categoryApproved: true,
      locationAreaApproved: true,
      areaLabel: "M-Block Market, Greater Kailash 2, New Delhi",
      servicesApproved: true,
      servicesList: ["Pot of Masala Chai", "Irani Samosa Combos", "Grilled Sandwiches", "Specialty Cold Coffee"],
      metricsApproved: true,
      allowedMetricCodes: ["M-402"],
      reviewsApproved: true,
      demoOfferApproved: true,
      demoOfferTitle: "Morning Commuter Chai & Maska",
      demoOfferDetail: "Order between 8 AM and 10:30 AM for express pickup and special breakfast pairing price.",
    },
  },

  // ═════════════════════════════════════════════════════════════════
  // 12. SIMULATED FUNDING OFFERS & REPAYMENT LEDGER
  // ═════════════════════════════════════════════════════════════════
  fundingOffers: {
    biz_stationery: [
      {
        id: "off_stat_sim1",
        businessId: "biz_stationery",
        funderName: "Maharashtra Micro Growth Syndicate (SIMULATED)",
        offerAmountPaise: 10000000, // ₹1,00,000 simulated advance
        revenueSharePercent: 6.5,   // 6.5% of verified daily sales
        repaymentCapMultiplier: 1.15, // 1.15x cap
        totalCapPaise: 11500000,    // ₹1,15,000 absolute repayment ceiling
        estimatedTermMonths: 6,
        eligibleRevenueDefinition: "Reconciled gross sales from verified POS & UPI QR credits, minus documented refunds.",
        feePaise: 0,
        status: "simulated_active",
        acceptedAt: "2026-10-01T10:00:00Z",
      },
    ],
    biz_icecream: [
      {
        id: "off_ice_sim1",
        businessId: "biz_icecream",
        funderName: "Bengaluru Retail Advance Circle (SIMULATED)",
        offerAmountPaise: 15000000, // ₹1,50,000 advance
        revenueSharePercent: 8.0,
        repaymentCapMultiplier: 1.18,
        totalCapPaise: 17700000,    // ₹1,77,000 cap
        estimatedTermMonths: 5,
        eligibleRevenueDefinition: "Verified retail dessert counter sales receipts.",
        feePaise: 0,
        status: "simulated_available",
      },
    ],
    biz_cafe: [],
  },

  ledgerEntries: {
    biz_stationery: [
      {
        id: "led_stat_1",
        businessId: "biz_stationery",
        offerId: "off_stat_sim1",
        date: "2026-10-15",
        grossSalesPaise: 1820000, // ₹18,200
        eligibleRevenuePaise: 1820000,
        sharePercent: 6.5,
        repaymentDuePaise: 118300, // ₹1,183.00
        cumulativeRepaidPaise: 3845000, // ₹38,450
        remainingCapPaise: 7655000, // ₹76,550 left of ₹1,15,000 cap
        status: "reconciled",
      },
      {
        id: "led_stat_2",
        businessId: "biz_stationery",
        offerId: "off_stat_sim1",
        date: "2026-10-16",
        grossSalesPaise: 1940000, // ₹19,400
        eligibleRevenuePaise: 1940000,
        sharePercent: 6.5,
        repaymentDuePaise: 126100, // ₹1,261.00
        cumulativeRepaidPaise: 3971100,
        remainingCapPaise: 7528900,
        status: "reconciled",
      },
      {
        id: "led_stat_3",
        businessId: "biz_stationery",
        offerId: "off_stat_sim1",
        date: "2026-10-17",
        grossSalesPaise: 2150000, // ₹21,500
        eligibleRevenuePaise: 2150000,
        sharePercent: 6.5,
        repaymentDuePaise: 139750, // ₹1,397.50
        cumulativeRepaidPaise: 4110850,
        remainingCapPaise: 7389150,
        status: "reconciled",
      },
      {
        id: "led_stat_4",
        businessId: "biz_stationery",
        offerId: "off_stat_sim1",
        date: "2026-10-18",
        grossSalesPaise: 2280000, // ₹22,800
        eligibleRevenuePaise: 2280000,
        sharePercent: 6.5,
        repaymentDuePaise: 148200, // ₹1,482.00
        cumulativeRepaidPaise: 4259050,
        remainingCapPaise: 7240950,
        status: "reconciled",
      },
      {
        id: "led_stat_5",
        businessId: "biz_stationery",
        offerId: "off_stat_sim1",
        date: "2026-10-19",
        grossSalesPaise: 1790000, // ₹17,900
        eligibleRevenuePaise: 1790000,
        sharePercent: 6.5,
        repaymentDuePaise: 116350, // ₹1,163.50
        cumulativeRepaidPaise: 4375400,
        remainingCapPaise: 7124600,
        status: "reconciled",
      },
      {
        id: "led_stat_6",
        businessId: "biz_stationery",
        offerId: "off_stat_sim1",
        date: "2026-10-20",
        grossSalesPaise: 2010000, // ₹20,100
        eligibleRevenuePaise: 2010000,
        sharePercent: 6.5,
        repaymentDuePaise: 130650, // ₹1,306.50
        cumulativeRepaidPaise: 4506050,
        remainingCapPaise: 6993950,
        status: "reconciled",
      },
    ],
    biz_icecream: [],
    biz_cafe: [],
  },

  // ═════════════════════════════════════════════════════════════════
  // 13. REVIEWS & THEMES (Genuine non-incentivized reputation coaching)
  // ═════════════════════════════════════════════════════════════════
  reviewThemes: {
    biz_stationery: [
      {
        id: "thm_stat_1",
        theme: "Fast Thesis Printing & Clear Spiral Binding",
        sentiment: "positive",
        count: 48,
        sampleQuotes: ["Saved my Pune University project submission with 15-min binding!", "High print clarity on graph sheets."],
        actionRecommendation: "Keep express thesis binding equipment serviced ahead of semester finals.",
      },
      {
        id: "thm_stat_2",
        theme: "Afternoon Counter Queue & Billing Delays",
        sentiment: "negative",
        count: 14,
        sampleQuotes: ["Long line between 1 PM and 2 PM when lunch rush hits.", "Only one scanner working for student UPI payments."],
        actionRecommendation: "Add a secondary dedicated UPI QR stand at counter 2 during 1-3 PM.",
      },
    ],
    biz_icecream: [
      {
        id: "thm_ice_1",
        theme: "Authentic Alphonso Mango & Fresh Waffle Cones",
        sentiment: "positive",
        count: 62,
        sampleQuotes: ["Real mango pulp taste, not synthetic essence!", "Waffles are crisp and warm."],
        actionRecommendation: "Highlight natural ingredients in menu board.",
      },
      {
        id: "thm_ice_2",
        theme: "Limited Seating Space on Weekend Evenings",
        sentiment: "negative",
        count: 19,
        sampleQuotes: ["Nowhere to sit outside after dinner.", "Tables were cluttered with used cups."],
        actionRecommendation: "Add 2 outdoor standing bar-ledges and schedule 15-minute table clears.",
      },
    ],
    biz_cafe: [],
  },

  reviews: {
    biz_stationery: [
      {
        id: "rev_stat_1",
        businessId: "biz_stationery",
        authorName: "Ananya Deshmukh",
        rating: 5,
        date: "2026-10-18",
        text: "The best xerox and project binding shop near university circle. They printed my 180-page master's thesis in 20 minutes with golden embossing on the cover. Very polite uncle and staff!",
        responseStatus: "replied",
        ownerResponse: "Thank you Ananya! Wishing you all the very best with your thesis defense.",
      },
      {
        id: "rev_stat_2",
        businessId: "biz_stationery",
        authorName: "Rohan Kulkarni",
        rating: 2,
        date: "2026-10-19",
        text: "Went for drawing sheets on Tuesday afternoon. The queue was almost out the door and only one counter was taking UPI payments. Took 25 minutes just to buy two pens and a folder.",
        responseStatus: "drafted",
        aiSuggestedResponse: "Hi Rohan, thank you for sharing this honest feedback. We are truly sorry for the long wait during the Tuesday peak. We have now added a secondary dedicated UPI payment terminal at counter 2 to speed up checkout. We hope to serve you much faster on your next visit!",
      },
      {
        id: "rev_stat_3",
        businessId: "biz_stationery",
        authorName: "Dr. Arvind Joshi",
        rating: 5,
        date: "2026-10-16",
        text: "Reliable institutional support. They handled our college symposium brochure printing with accurate color proofs and delivered on schedule.",
        responseStatus: "needs_reply",
        aiSuggestedResponse: "Dear Dr. Joshi, thank you for your patronage and trust. It was our pleasure to support the college symposium!",
      },
    ],
    biz_icecream: [
      {
        id: "rev_ice_1",
        businessId: "biz_icecream",
        authorName: "Priya Nair",
        rating: 5,
        date: "2026-10-17",
        text: "The seasonal Alphonso sundae is unmatched in Koramangala. Fresh taste and very generous scoop sizes.",
        responseStatus: "replied",
        ownerResponse: "Thanks Priya! So glad you enjoyed the fresh mango swirl.",
      },
    ],
    biz_cafe: [],
  },
};
