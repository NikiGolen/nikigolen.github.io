export const programs = {

  search: {
    executive: {
      title: "AI Search Platform",
      subtitle: "Modernizing ecommerce search using AI-powered relevance and product discovery.",
      budget: "$850K",
      duration: "28 Weeks",
      timeline: "7 Months",
      complexity: "High",
      status: "Planning",
      statusDescription: "Discovery & Planning"
    },

    summary: {
      problem:
        "Customers struggle to find products because traditional keyword search cannot interpret intent, synonyms, or natural language queries.",

      businessValue:
        "Increase product discoverability, improve conversion rates, reduce support requests, and create a scalable search platform.",

      objectives: [
        "Increase search conversion rate",
        "Reduce zero-result searches",
        "Improve search relevance",
        "Support AI-assisted product discovery"
      ],

      technicalScope: [
        "Search API",
        "Relevance engine",
        "Synonym management",
        "Analytics",
        "Search telemetry"
      ],

      expectedOutcomes: [
        "Higher conversion",
        "Better customer satisfaction",
        "Lower bounce rate",
        "Reduced support volume"
      ]
    },

    stakeholders: [
      { team: "Engineering", owner: "Backend Team", role: "Search APIs & indexing" },
      { team: "Product", owner: "Product Manager", role: "Feature prioritization" },
      { team: "Analytics", owner: "Data Team", role: "Search reporting" },
      { team: "Marketing", owner: "Digital Marketing", role: "SEO alignment" },
      { team: "Customer Support", owner: "Support Manager", role: "Customer feedback" }
    ],

    architecture: [
      { title: "Customer", type: "frontend", description: "Website & Mobile" },
      { title: "Frontend", type: "frontend", description: "Search UI" },
      { title: "API Gateway", type: "service", description: "Routing" },
      { title: "AI Search", type: "service", description: "Ranking Engine" },
      { title: "Catalog", type: "data", description: "Products" },
      { title: "Analytics", type: "data", description: "Telemetry" }
    ],

    dependencies: [
      { name: "Catalog Cleanup", status: "Complete" },
      { name: "Search API", status: "In Progress" },
      { name: "Analytics Integration", status: "Complete" },
      { name: "Feature Flags", status: "Blocked" }
    ],

    roadmap: [
      "Discovery",
      "Architecture",
      "Development",
      "Testing",
      "Pilot",
      "General Availability"
    ],

    risks: [
      {
        risk: "Poor search relevance",
        probability: "High",
        impact: "High",
        owner: "Engineering",
        mitigation: "Continuous relevance tuning"
      },
      {
        risk: "Vendor API latency",
        probability: "Medium",
        impact: "High",
        owner: "Infrastructure",
        mitigation: "Caching and monitoring"
      }
    ],

    kpis: [
      { name: "Search Conversion", target: "+18%" },
      { name: "Zero Result Searches", target: "-35%" },
      { name: "Average Response Time", target: "<250 ms" },
      { name: "CTR", target: "+15%" }
    ]
  },

  global: {
    executive: {
      title: "Global Ecommerce Expansion",
      subtitle: "Launch localized storefronts supporting multiple regions.",
      budget: "$2.4M",
      duration: "46 Weeks",
      timeline: "11 Months",
      complexity: "Very High",
      status: "Architecture",
      statusDescription: "Architecture Review"
    },

    summary: {
      problem:
        "Current platform supports only one region, limiting international growth.",

      businessValue:
        "Enable international sales while supporting regional tax, pricing, shipping, and compliance.",

      objectives: [
        "Launch regional storefronts",
        "Localized pricing",
        "Tax compliance",
        "Language support"
      ],

      technicalScope: [
        "ERP integration",
        "Regional catalog",
        "Localization",
        "Tax engine",
        "Payment gateways"
      ],

      expectedOutcomes: [
        "International revenue growth",
        "Regional compliance",
        "Improved customer experience"
      ]
    },

    stakeholders: [
      { team: "Engineering", owner: "Platform Team", role: "Regional architecture" },
      { team: "Finance", owner: "Finance Lead", role: "Currency & tax" },
      { team: "Legal", owner: "Legal Team", role: "Compliance" },
      { team: "Operations", owner: "Supply Chain", role: "Shipping" }
    ],

    architecture: [
      { title: "ERP", type: "data", description: "Master Catalog" },
      { title: "Catalog Service", type: "service", description: "Localization" },
      { title: "Regional APIs", type: "service", description: "Storefront Services" },
      { title: "Regional Stores", type: "frontend", description: "Customer Experience" }
    ],

    dependencies: [
      { name: "Translations", status: "In Progress" },
      { name: "Tax Engine", status: "Blocked" },
      { name: "Shipping Integration", status: "In Progress" },
      { name: "ERP", status: "Complete" }
    ],

    roadmap: [
      "Planning",
      "Platform",
      "Localization",
      "Regional Testing",
      "Launch"
    ],

    risks: [
      {
        risk: "Localization delays",
        probability: "Medium",
        impact: "High",
        owner: "Operations",
        mitigation: "Regional rollout"
      },
      {
        risk: "Tax compliance",
        probability: "High",
        impact: "High",
        owner: "Finance",
        mitigation: "Legal review"
      }
    ],

    kpis: [
      { name: "Countries Launched", target: "4" },
      { name: "Regional Revenue", target: "+20%" },
      { name: "Localization Accuracy", target: "99%" }
    ]
  },

  recommendation: {
    executive: {
      title: "Recommendation Engine",
      subtitle: "Personalized product recommendations using behavioral analytics.",
      budget: "$1.1M",
      duration: "34 Weeks",
      timeline: "8 Months",
      complexity: "High",
      status: "Planning",
      statusDescription: "Requirements Gathering"
    },

    summary: {
      problem:
        "Customers discover only a small percentage of available products.",

      businessValue:
        "Increase average order value through intelligent recommendations.",

      objectives: [
        "Increase AOV",
        "Improve engagement",
        "Cross-sell products",
        "Personalize shopping"
      ],

      technicalScope: [
        "ML Model",
        "Behavior Tracking",
        "Recommendation API",
        "Analytics"
      ],

      expectedOutcomes: [
        "Higher AOV",
        "More product discovery",
        "Improved retention"
      ]
    },

    stakeholders: [
      { team: "Engineering", owner: "ML Team", role: "Recommendation model" },
      { team: "Analytics", owner: "Data Science", role: "Training data" },
      { team: "Marketing", owner: "Digital Team", role: "Campaign personalization" }
    ],

    architecture: [
      { title: "Customer", type: "frontend", description: "Shopping Experience" },
      { title: "Recommendation API", type: "service", description: "Inference" },
      { title: "ML Model", type: "service", description: "Predictions" },
      { title: "Behavior Data", type: "data", description: "Customer Events" }
    ],

    dependencies: [
      { name: "Behavior Tracking", status: "Complete" },
      { name: "ML Pipeline", status: "In Progress" },
      { name: "Analytics", status: "Complete" }
    ],

    roadmap: [
      "Discovery",
      "Data Collection",
      "Model Training",
      "Testing",
      "Production"
    ],

    risks: [
      {
        risk: "Poor recommendations",
        probability: "Medium",
        impact: "Medium",
        owner: "ML Team",
        mitigation: "Model retraining"
      }
    ],

    kpis: [
      { name: "Average Order Value", target: "+12%" },
      { name: "Recommendation CTR", target: "+25%" },
      { name: "Revenue from Recommendations", target: "15%" }
    ]
  },

  identity: {
    executive: {
      title: "Identity & Authentication",
      subtitle: "Modern identity platform supporting SSO and MFA.",
      budget: "$900K",
      duration: "24 Weeks",
      timeline: "6 Months",
      complexity: "Medium",
      status: "Planning",
      statusDescription: "Security Review"
    },

    summary: {
      problem:
        "Legacy authentication creates inconsistent user experiences and security risks.",

      businessValue:
        "Improve security while simplifying authentication across platforms.",

      objectives: [
        "Implement SSO",
        "Deploy MFA",
        "Centralize identity",
        "Improve compliance"
      ],

      technicalScope: [
        "Identity Provider",
        "Authentication APIs",
        "Directory Services",
        "Monitoring"
      ],

      expectedOutcomes: [
        "Improved security",
        "Faster login",
        "Reduced support requests"
      ]
    },

    stakeholders: [
      { team: "Security", owner: "Security Team", role: "Identity standards" },
      { team: "Engineering", owner: "Platform Team", role: "Authentication APIs" },
      { team: "IT", owner: "Infrastructure", role: "Directory integration" }
    ],

    architecture: [
      { title: "Users", type: "frontend", description: "Employees & Customers" },
      { title: "Identity Provider", type: "service", description: "SSO" },
      { title: "Authentication API", type: "service", description: "OAuth/OIDC" },
      { title: "Directory", type: "data", description: "User Accounts" }
    ],

    dependencies: [
      { name: "Directory Cleanup", status: "In Progress" },
      { name: "SSO Provider", status: "Complete" },
      { name: "MFA Rollout", status: "Blocked" }
    ],

    roadmap: [
      "Assessment",
      "Migration",
      "Testing",
      "Pilot",
      "Enterprise Rollout"
    ],

    risks: [
      {
        risk: "User migration issues",
        probability: "Medium",
        impact: "High",
        owner: "IT",
        mitigation: "Pilot rollout"
      }
    ],

    kpis: [
      { name: "Authentication Success", target: "99.9%" },
      { name: "Support Tickets", target: "-40%" },
      { name: "MFA Adoption", target: "95%" }
    ]
  },
    privacy: {
    executive: {
      title: "Privacy Compliance Framework",
      subtitle: "Modern consent management and privacy controls across digital platforms.",
      budget: "$650K",
      duration: "22 Weeks",
      timeline: "5 Months",
      complexity: "High",
      status: "Planning",
      statusDescription: "Compliance Assessment"
    },

    summary: {
      problem:
        "Privacy regulations continue to evolve, requiring centralized consent management and data governance.",

      businessValue:
        "Reduce regulatory risk while maintaining accurate analytics and customer trust.",

      objectives: [
        "Centralize consent management",
        "Support GDPR & CCPA",
        "Improve analytics quality",
        "Standardize tag governance"
      ],

      technicalScope: [
        "Consent Platform",
        "Tag Manager",
        "Analytics",
        "Cookie Management",
        "Audit Logging"
      ],

      expectedOutcomes: [
        "Improved compliance",
        "Consistent consent experience",
        "Reduced legal risk",
        "Reliable analytics"
      ]
    },

    stakeholders: [
      {
        team: "Security",
        owner: "Security Team",
        role: "Privacy controls"
      },
      {
        team: "Legal",
        owner: "Legal Counsel",
        role: "Regulatory review"
      },
      {
        team: "Marketing",
        owner: "Marketing Operations",
        role: "Consent experience"
      },
      {
        team: "Engineering",
        owner: "Platform Team",
        role: "Implementation"
      }
    ],

    architecture: [
      {
        title: "Customer",
        type: "frontend",
        description: "Website"
      },
      {
        title: "Consent Banner",
        type: "frontend",
        description: "Preferences"
      },
      {
        title: "Consent API",
        type: "service",
        description: "Permissions"
      },
      {
        title: "Analytics",
        type: "service",
        description: "Measurement"
      },
      {
        title: "Audit Logs",
        type: "data",
        description: "Compliance"
      }
    ],

    dependencies: [
      { name: "Legal Approval", status: "In Progress" },
      { name: "Consent Platform", status: "Complete" },
      { name: "Analytics Validation", status: "Blocked" },
      { name: "Cookie Audit", status: "Complete" }
    ],

    roadmap: [
      "Assessment",
      "Implementation",
      "Validation",
      "Regional Rollout",
      "Compliance Audit"
    ],

    risks: [
      {
        risk: "Regulatory changes",
        probability: "Medium",
        impact: "High",
        owner: "Legal",
        mitigation: "Quarterly compliance reviews"
      },
      {
        risk: "Tracking data loss",
        probability: "Medium",
        impact: "Medium",
        owner: "Analytics",
        mitigation: "Continuous validation"
      }
    ],

    kpis: [
      { name: "Consent Rate", target: "85%" },
      { name: "Compliance Score", target: "100%" },
      { name: "Analytics Accuracy", target: "99%" }
    ]
  },

  payments: {
    executive: {
      title: "Payment Modernization",
      subtitle: "Upgrade payment infrastructure to improve reliability and flexibility.",
      budget: "$1.3M",
      duration: "32 Weeks",
      timeline: "8 Months",
      complexity: "High",
      status: "Architecture",
      statusDescription: "Vendor Evaluation"
    },

    summary: {
      problem:
        "Current payment platform limits expansion, introduces operational risk, and lacks modern payment options.",

      businessValue:
        "Improve payment reliability while supporting future commerce capabilities.",

      objectives: [
        "Modernize payment gateway",
        "Increase authorization rates",
        "Support digital wallets",
        "Improve resiliency"
      ],

      technicalScope: [
        "Gateway Integration",
        "Fraud Detection",
        "Payment APIs",
        "Monitoring"
      ],

      expectedOutcomes: [
        "Higher payment success",
        "Lower checkout abandonment",
        "Improved scalability"
      ]
    },

    stakeholders: [
      {
        team: "Engineering",
        owner: "Commerce Platform",
        role: "Gateway integration"
      },
      {
        team: "Finance",
        owner: "Finance Team",
        role: "Settlement"
      },
      {
        team: "Security",
        owner: "Security Team",
        role: "PCI compliance"
      },
      {
        team: "Customer Support",
        owner: "Support Operations",
        role: "Payment issues"
      }
    ],

    architecture: [
      {
        title: "Customer",
        type: "frontend",
        description: "Checkout"
      },
      {
        title: "Commerce Platform",
        type: "service",
        description: "Orders"
      },
      {
        title: "Payment Gateway",
        type: "service",
        description: "Processing"
      },
      {
        title: "Fraud Engine",
        type: "service",
        description: "Risk"
      },
      {
        title: "Payment Database",
        type: "data",
        description: "Transactions"
      }
    ],

    dependencies: [
      { name: "Gateway Selection", status: "In Progress" },
      { name: "PCI Review", status: "Blocked" },
      { name: "Fraud Platform", status: "Complete" }
    ],

    roadmap: [
      "Vendor Selection",
      "Integration",
      "Testing",
      "Pilot",
      "Production"
    ],

    risks: [
      {
        risk: "Payment downtime",
        probability: "Low",
        impact: "High",
        owner: "Engineering",
        mitigation: "Failover gateway"
      },
      {
        risk: "PCI compliance delays",
        probability: "Medium",
        impact: "High",
        owner: "Security",
        mitigation: "Early audit"
      }
    ],

    kpis: [
      { name: "Authorization Rate", target: "98%" },
      { name: "Checkout Conversion", target: "+10%" },
      { name: "Payment Latency", target: "<2 sec" }
    ]
  },

  inventory: {
    executive: {
      title: "Inventory Synchronization",
      subtitle: "Real-time inventory visibility across ERP, warehouses, and ecommerce.",
      budget: "$975K",
      duration: "30 Weeks",
      timeline: "7 Months",
      complexity: "High",
      status: "Planning",
      statusDescription: "Integration Design"
    },

    summary: {
      problem:
        "Inventory updates are delayed between systems, resulting in overselling and poor customer experiences.",

      businessValue:
        "Provide accurate inventory availability while improving fulfillment efficiency.",

      objectives: [
        "Real-time inventory",
        "Reduce overselling",
        "Improve warehouse visibility",
        "Increase fulfillment accuracy"
      ],

      technicalScope: [
        "ERP Integration",
        "Inventory APIs",
        "Warehouse Systems",
        "Monitoring"
      ],

      expectedOutcomes: [
        "Inventory accuracy",
        "Lower fulfillment errors",
        "Faster updates"
      ]
    },

    stakeholders: [
      {
        team: "Operations",
        owner: "Warehouse Team",
        role: "Inventory management"
      },
      {
        team: "Engineering",
        owner: "Integration Team",
        role: "API development"
      },
      {
        team: "Supply Chain",
        owner: "Supply Chain Manager",
        role: "Planning"
      }
    ],

    architecture: [
      {
        title: "ERP",
        type: "data",
        description: "Inventory"
      },
      {
        title: "Integration Service",
        type: "service",
        description: "Synchronization"
      },
      {
        title: "Warehouse",
        type: "service",
        description: "Execution"
      },
      {
        title: "Storefront",
        type: "frontend",
        description: "Availability"
      }
    ],

    dependencies: [
      { name: "ERP APIs", status: "Complete" },
      { name: "Warehouse Integration", status: "In Progress" },
      { name: "Monitoring", status: "Blocked" }
    ],

    roadmap: [
      "Architecture",
      "Development",
      "Testing",
      "Warehouse Pilot",
      "Production"
    ],

    risks: [
      {
        risk: "Data synchronization failures",
        probability: "Medium",
        impact: "High",
        owner: "Engineering",
        mitigation: "Retry queues"
      }
    ],

    kpis: [
      { name: "Inventory Accuracy", target: "99.8%" },
      { name: "Oversell Reduction", target: "-90%" },
      { name: "Sync Time", target: "<60 sec" }
    ]
  },

  warehouse: {
    executive: {
      title: "Data Warehouse Migration",
      subtitle: "Modern analytics platform supporting scalable enterprise reporting.",
      budget: "$1.8M",
      duration: "40 Weeks",
      timeline: "10 Months",
      complexity: "Very High",
      status: "Discovery",
      statusDescription: "Current State Assessment"
    },

    summary: {
      problem:
        "Legacy reporting systems cannot scale with growing data volumes or modern analytics requirements.",

      businessValue:
        "Create a centralized analytics platform that supports executive reporting and self-service BI.",

      objectives: [
        "Centralize enterprise reporting",
        "Improve query performance",
        "Support self-service analytics",
        "Standardize data governance"
      ],

      technicalScope: [
        "ETL Pipelines",
        "Cloud Warehouse",
        "BI Platform",
        "Monitoring",
        "Data Governance"
      ],

      expectedOutcomes: [
        "Faster reporting",
        "Improved data quality",
        "Scalable analytics"
      ]
    },

    stakeholders: [
      {
        team: "Data Engineering",
        owner: "Data Platform Team",
        role: "Migration"
      },
      {
        team: "Business Intelligence",
        owner: "Analytics Team",
        role: "Reporting"
      },
      {
        team: "Executive Leadership",
        owner: "Business Sponsors",
        role: "Program sponsorship"
      }
    ],

    architecture: [
      {
        title: "Source Systems",
        type: "data",
        description: "ERP / CRM"
      },
      {
        title: "ETL",
        type: "service",
        description: "Data Pipelines"
      },
      {
        title: "Cloud Warehouse",
        type: "data",
        description: "Enterprise Data"
      },
      {
        title: "BI Platform",
        type: "frontend",
        description: "Dashboards"
      }
    ],

    dependencies: [
      { name: "Cloud Platform", status: "Complete" },
      { name: "Data Mapping", status: "In Progress" },
      { name: "Business Validation", status: "Blocked" }
    ],

    roadmap: [
      "Assessment",
      "Migration",
      "Validation",
      "Parallel Run",
      "Cutover"
    ],

    risks: [
      {
        risk: "Data quality issues",
        probability: "Medium",
        impact: "High",
        owner: "Data Engineering",
        mitigation: "Automated validation"
      },
      {
        risk: "Migration delays",
        probability: "Medium",
        impact: "Medium",
        owner: "Program Manager",
        mitigation: "Phased migration"
      }
    ],

    kpis: [
      { name: "Report Performance", target: "<5 sec" },
      { name: "Data Accuracy", target: "99.9%" },
      { name: "Dashboard Adoption", target: "85%" }
    ]
  },
  mobile: {
    executive: {
      title: "Mobile Commerce App",
      subtitle: "Native mobile shopping experience with personalized engagement.",
      budget: "$1.5M",
      duration: "36 Weeks",
      timeline: "9 Months",
      complexity: "High",
      status: "Planning",
      statusDescription: "Product Discovery"
    },

    summary: {
      problem:
        "Customers increasingly shop on mobile devices, but the current web experience limits engagement and conversion.",

      businessValue:
        "Increase mobile revenue through a native application with personalized experiences and improved performance.",

      objectives: [
        "Launch iOS & Android applications",
        "Increase mobile conversion",
        "Enable push notifications",
        "Improve customer retention"
      ],

      technicalScope: [
        "Native Applications",
        "Commerce APIs",
        "Authentication",
        "Push Notifications",
        "Analytics"
      ],

      expectedOutcomes: [
        "Higher mobile engagement",
        "Improved conversion",
        "Greater customer retention"
      ]
    },

    stakeholders: [
      {
        team: "Mobile Engineering",
        owner: "App Development Team",
        role: "Application development"
      },
      {
        team: "Platform Engineering",
        owner: "API Team",
        role: "Backend services"
      },
      {
        team: "Marketing",
        owner: "CRM Team",
        role: "Push campaigns"
      },
      {
        team: "UX Design",
        owner: "Design Team",
        role: "User experience"
      }
    ],

    architecture: [
      {
        title: "iOS / Android",
        type: "frontend",
        description: "Native Apps"
      },
      {
        title: "API Gateway",
        type: "service",
        description: "Backend APIs"
      },
      {
        title: "Commerce Platform",
        type: "service",
        description: "Orders"
      },
      {
        title: "Analytics",
        type: "data",
        description: "Customer Events"
      }
    ],

    dependencies: [
      { name: "Authentication APIs", status: "Complete" },
      { name: "Push Notification Service", status: "In Progress" },
      { name: "App Store Approval", status: "Blocked" }
    ],

    roadmap: [
      "Discovery",
      "Design",
      "Development",
      "Beta",
      "Launch"
    ],

    risks: [
      {
        risk: "App store approval delays",
        probability: "Medium",
        impact: "Medium",
        owner: "Mobile Team",
        mitigation: "Early submission"
      },
      {
        risk: "API performance",
        probability: "Low",
        impact: "High",
        owner: "Platform Team",
        mitigation: "Performance testing"
      }
    ],

    kpis: [
      { name: "App Downloads", target: "100K" },
      { name: "Mobile Conversion", target: "+20%" },
      { name: "App Rating", target: "4.7+" }
    ]
  },

  support: {
    executive: {
      title: "AI Customer Support",
      subtitle: "Conversational AI platform providing intelligent customer assistance.",
      budget: "$950K",
      duration: "30 Weeks",
      timeline: "7 Months",
      complexity: "High",
      status: "Planning",
      statusDescription: "Solution Design"
    },

    summary: {
      problem:
        "Support teams spend significant time answering repetitive questions, increasing operational costs and response times.",

      businessValue:
        "Improve customer satisfaction while reducing support costs through AI-assisted conversations.",

      objectives: [
        "Reduce support tickets",
        "Decrease response times",
        "Increase self-service",
        "Improve customer satisfaction"
      ],

      technicalScope: [
        "LLM Integration",
        "Knowledge Base",
        "CRM Integration",
        "Analytics",
        "Escalation Workflows"
      ],

      expectedOutcomes: [
        "Higher CSAT",
        "Lower operational cost",
        "24/7 customer support"
      ]
    },

    stakeholders: [
      {
        team: "Customer Support",
        owner: "Support Operations",
        role: "Knowledge management"
      },
      {
        team: "Engineering",
        owner: "AI Platform Team",
        role: "LLM integration"
      },
      {
        team: "Product",
        owner: "Product Manager",
        role: "Feature prioritization"
      }
    ],

    architecture: [
      {
        title: "Customer",
        type: "frontend",
        description: "Chat Experience"
      },
      {
        title: "AI Assistant",
        type: "service",
        description: "Conversation Engine"
      },
      {
        title: "Knowledge Base",
        type: "data",
        description: "Documentation"
      },
      {
        title: "CRM",
        type: "service",
        description: "Case Management"
      }
    ],

    dependencies: [
      { name: "Knowledge Base", status: "Complete" },
      { name: "CRM Integration", status: "In Progress" },
      { name: "Security Review", status: "Blocked" }
    ],

    roadmap: [
      "Discovery",
      "Prototype",
      "Training",
      "Pilot",
      "Production"
    ],

    risks: [
      {
        risk: "Hallucinated responses",
        probability: "Medium",
        impact: "High",
        owner: "AI Engineering",
        mitigation: "Retrieval augmented generation"
      },
      {
        risk: "Low customer adoption",
        probability: "Low",
        impact: "Medium",
        owner: "Support",
        mitigation: "Gradual rollout"
      }
    ],

    kpis: [
      { name: "Containment Rate", target: "70%" },
      { name: "Average Response Time", target: "<15 sec" },
      { name: "CSAT", target: "4.8/5" }
    ]
  },

  personalization: {
    executive: {
      title: "Personalization Platform",
      subtitle: "Deliver individualized digital experiences using customer behavior and preferences.",
      budget: "$1.25M",
      duration: "34 Weeks",
      timeline: "8 Months",
      complexity: "High",
      status: "Planning",
      statusDescription: "Requirements Definition"
    },

    summary: {
      problem:
        "All customers receive the same experience regardless of interests, history, or purchasing behavior.",

      businessValue:
        "Increase engagement and revenue by delivering personalized content and recommendations.",

      objectives: [
        "Personalized homepage",
        "Behavior-based merchandising",
        "Audience segmentation",
        "Targeted promotions"
      ],

      technicalScope: [
        "Customer Profiles",
        "Segmentation Engine",
        "Recommendation APIs",
        "Analytics"
      ],

      expectedOutcomes: [
        "Higher engagement",
        "Improved conversion",
        "Greater customer loyalty"
      ]
    },

    stakeholders: [
      {
        team: "Marketing",
        owner: "Digital Marketing",
        role: "Campaign strategy"
      },
      {
        team: "Engineering",
        owner: "Platform Team",
        role: "Platform development"
      },
      {
        team: "Analytics",
        owner: "Data Science",
        role: "Customer insights"
      }
    ],

    architecture: [
      {
        title: "Customer",
        type: "frontend",
        description: "Website"
      },
      {
        title: "Personalization API",
        type: "service",
        description: "Experience Engine"
      },
      {
        title: "Customer Profiles",
        type: "data",
        description: "Behavior"
      },
      {
        title: "Recommendation Model",
        type: "service",
        description: "Predictions"
      }
    ],

    dependencies: [
      { name: "Customer Profiles", status: "Complete" },
      { name: "Segmentation Engine", status: "In Progress" },
      { name: "Marketing Approval", status: "Blocked" }
    ],

    roadmap: [
      "Planning",
      "Platform",
      "Testing",
      "Pilot",
      "Launch"
    ],

    risks: [
      {
        risk: "Poor recommendation quality",
        probability: "Medium",
        impact: "Medium",
        owner: "Data Science",
        mitigation: "Continuous model training"
      }
    ],

    kpis: [
      { name: "Engagement", target: "+18%" },
      { name: "Conversion", target: "+12%" },
      { name: "Repeat Purchases", target: "+15%" }
    ]
  },

  api: {
    executive: {
      title: "API Platform",
      subtitle: "Standardized API ecosystem enabling secure and scalable integrations.",
      budget: "$1.7M",
      duration: "42 Weeks",
      timeline: "10 Months",
      complexity: "Very High",
      status: "Architecture",
      statusDescription: "Platform Design"
    },

    summary: {
      problem:
        "Independent APIs have inconsistent standards, making integrations difficult and increasing maintenance costs.",

      businessValue:
        "Create a centralized API platform that accelerates development while improving security and governance.",

      objectives: [
        "Standardize APIs",
        "Implement API Gateway",
        "Improve developer experience",
        "Strengthen governance"
      ],

      technicalScope: [
        "API Gateway",
        "Authentication",
        "Developer Portal",
        "Monitoring",
        "Rate Limiting"
      ],

      expectedOutcomes: [
        "Faster integrations",
        "Improved reliability",
        "Consistent developer experience"
      ]
    },

    stakeholders: [
      {
        team: "Platform Engineering",
        owner: "API Team",
        role: "Platform ownership"
      },
      {
        team: "Security",
        owner: "Security Engineering",
        role: "Authentication & authorization"
      },
      {
        team: "Developer Experience",
        owner: "Developer Relations",
        role: "Documentation"
      }
    ],

    architecture: [
      {
        title: "Clients",
        type: "frontend",
        description: "Applications"
      },
      {
        title: "API Gateway",
        type: "service",
        description: "Routing"
      },
      {
        title: "Microservices",
        type: "service",
        description: "Business Logic"
      },
      {
        title: "Databases",
        type: "data",
        description: "Persistent Storage"
      }
    ],

    dependencies: [
      { name: "Gateway Platform", status: "Complete" },
      { name: "Identity Service", status: "In Progress" },
      { name: "Developer Portal", status: "Blocked" }
    ],

    roadmap: [
      "Architecture",
      "Foundation",
      "Migration",
      "Governance",
      "General Availability"
    ],

    risks: [
      {
        risk: "Migration complexity",
        probability: "High",
        impact: "High",
        owner: "Platform Engineering",
        mitigation: "Phased migration"
      },
      {
        risk: "Breaking existing integrations",
        probability: "Medium",
        impact: "High",
        owner: "API Team",
        mitigation: "Versioned APIs"
      }
    ],

    kpis: [
      { name: "API Availability", target: "99.99%" },
      { name: "Average Latency", target: "<150 ms" },
      { name: "Developer Satisfaction", target: "90%" }
    ]
  }

};
