// Default Taxonomies & Seed Reference for Fields, Interests, Skills, and Goals

export interface FieldCategoryData {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  order: number;
}

export const DEFAULT_FIELD_CATEGORIES: FieldCategoryData[] = [
  { id: "field-eng", name: "Engineering & Technology", slug: "engineering-technology", icon: "Cpu", description: "Software, Hardware, Mechanical, Electrical, Civil & Robotics", order: 1 },
  { id: "field-cs", name: "Computer Science & IT", slug: "computer-science", icon: "Code", description: "AI/ML, Data Systems, Cybersecurity, Web & Cloud Architecture", order: 2 },
  { id: "field-comm", name: "Commerce & Finance", slug: "commerce-finance", icon: "TrendingUp", description: "Accounting, Banking, Investment, Taxation & Corporate Finance", order: 3 },
  { id: "field-mgmt", name: "Business & Management", slug: "business-management", icon: "Briefcase", description: "Strategy, Operations, Marketing, Product & Human Resources", order: 4 },
  { id: "field-arts", name: "Arts & Humanities", slug: "arts-humanities", icon: "BookOpen", description: "Literature, History, Philosophy, Psychology & Cultural Studies", order: 5 },
  { id: "field-sci", name: "Pure & Applied Science", slug: "science", icon: "Microscope", description: "Physics, Chemistry, Mathematics, Biology & Biotechnology", order: 6 },
  { id: "field-med", name: "Medical & Healthcare", slug: "medical-healthcare", icon: "HeartPulse", description: "Medicine, Nursing, Pharmacy, Public Health & Clinical Research", order: 7 },
  { id: "field-law", name: "Law & Legal Studies", slug: "law", icon: "Scale", description: "Corporate Law, Litigation, IP, Cyber Law & Public Policy", order: 8 },
  { id: "field-des", name: "Design & Creative Arts", slug: "design", icon: "Palette", description: "UI/UX, Graphic Design, Product Design, Animation & Fine Arts", order: 9 },
  { id: "field-arch", name: "Architecture & Planning", slug: "architecture", icon: "Building2", description: "Urban Planning, Interior Design & Sustainable Construction", order: 10 },
  { id: "field-media", name: "Media & Communication", slug: "media-communication", icon: "Radio", description: "Journalism, PR, Film, Digital Media & Advertising", order: 11 },
  { id: "field-edu", name: "Education & Teaching", slug: "education", icon: "GraduationCap", description: "Pedagogy, EdTech, Curriculum Design & Academic Leadership", order: 12 },
  { id: "field-hosp", name: "Hospitality & Tourism", slug: "hospitality-tourism", icon: "UtensilsCrossed", description: "Hotel Management, Event Operations & Culinary Arts", order: 13 },
  { id: "field-fash", name: "Fashion & Lifestyle", slug: "fashion", icon: "Sparkles", description: "Apparel Design, Merchandising & Luxury Brand Management", order: 14 },
  { id: "field-soc", name: "Social Sciences & Policy", slug: "social-sciences", icon: "Globe", description: "Economics, Sociology, Political Science & International Relations", order: 15 },
  { id: "field-explore", name: "Exploring / Undecided", slug: "exploring", icon: "Compass", description: "Discovering career options, interdisciplinary studies & foundational skills", order: 16 },
];

export const DEFAULT_INTERESTS: { name: string; fieldCategory: string }[] = [
  // Finance & Commerce
  { name: "Investment Banking", fieldCategory: "Commerce & Finance" },
  { name: "Financial Modeling", fieldCategory: "Commerce & Finance" },
  { name: "Equity Research", fieldCategory: "Commerce & Finance" },
  { name: "Auditing & Taxation", fieldCategory: "Commerce & Finance" },
  { name: "Corporate Finance", fieldCategory: "Commerce & Finance" },
  { name: "Fintech & Payments", fieldCategory: "Commerce & Finance" },

  // Engineering & CS
  { name: "Distributed Systems", fieldCategory: "Engineering & Technology" },
  { name: "Machine Learning & AI", fieldCategory: "Computer Science & IT" },
  { name: "Full-Stack Web Dev", fieldCategory: "Computer Science & IT" },
  { name: "Cloud Architecture", fieldCategory: "Engineering & Technology" },
  { name: "Cybersecurity", fieldCategory: "Computer Science & IT" },
  { name: "Embedded Systems & IoT", fieldCategory: "Engineering & Technology" },

  // Management & Business
  { name: "Product Management", fieldCategory: "Business & Management" },
  { name: "Brand & Growth Marketing", fieldCategory: "Business & Management" },
  { name: "Operations & Supply Chain", fieldCategory: "Business & Management" },
  { name: "Early-stage Entrepreneurship", fieldCategory: "Business & Management" },
  { name: "Venture Capital", fieldCategory: "Business & Management" },

  // Design
  { name: "UI/UX & Interaction Design", fieldCategory: "Design & Creative Arts" },
  { name: "User Research & Usability", fieldCategory: "Design & Creative Arts" },
  { name: "Visual Identity & Branding", fieldCategory: "Design & Creative Arts" },
  { name: "Motion & 3D Design", fieldCategory: "Design & Creative Arts" },

  // Arts, Law, Science, Healthcare
  { name: "Cognitive Psychology", fieldCategory: "Arts & Humanities" },
  { name: "Content Strategy & Copywriting", fieldCategory: "Media & Communication" },
  { name: "Corporate & M&A Law", fieldCategory: "Law & Legal Studies" },
  { name: "Clinical & Drug Research", fieldCategory: "Medical & Healthcare" },
  { name: "Genomics & Biotech", fieldCategory: "Pure & Applied Science" },
  { name: "Public Policy & Governance", fieldCategory: "Social Sciences & Policy" },
  { name: "Academic Research & Publishing", fieldCategory: "Education & Teaching" },
];

export const DEFAULT_SKILLS: { name: string; category: string }[] = [
  // Technical
  { name: "Python", category: "Technical" },
  { name: "SQL & Relational Databases", category: "Technical" },
  { name: "JavaScript / TypeScript", category: "Technical" },
  { name: "React / Next.js", category: "Technical" },
  { name: "Docker & Linux", category: "Technical" },
  { name: "Data Structures & Algorithms", category: "Technical" },

  // Domain-Specific (Finance / Commerce / Law / Science)
  { name: "Microsoft Excel & Advanced Modeling", category: "Domain-Specific" },
  { name: "Financial Statement Analysis", category: "Domain-Specific" },
  { name: "Accounting Standards (GAAP / IFRS)", category: "Domain-Specific" },
  { name: "Legal Due Diligence", category: "Domain-Specific" },
  { name: "Contract Drafting", category: "Domain-Specific" },
  { name: "Laboratory Techniques & PCR", category: "Domain-Specific" },
  { name: "Statistical Hypothesis Testing", category: "Academic" },

  // Creative & Design
  { name: "Figma & Wireframing", category: "Creative" },
  { name: "User Journey Mapping", category: "Creative" },
  { name: "Visual Typography & Layout", category: "Creative" },
  { name: "Copywriting & Storytelling", category: "Creative" },

  // Professional / Soft Skills
  { name: "Public Speaking & Pitching", category: "Professional" },
  { name: "Negotiation & Persuasion", category: "Professional" },
  { name: "Team Leadership", category: "Professional" },
  { name: "Structured Problem Solving", category: "Professional" },
  { name: "Stakeholder Management", category: "Professional" },
  { name: "Scientific Writing", category: "Academic" },
];

export const EDUCATION_LEVELS = [
  "School",
  "Higher Secondary",
  "Diploma",
  "Undergraduate",
  "Postgraduate",
  "Doctorate",
  "Certification",
  "Vocational",
  "Other",
];

export const GRADE_TYPES = [
  "CGPA",
  "GPA",
  "Percentage",
  "Grade",
  "Marks",
  "Pass/Fail",
  "Not Applicable",
];

export const GOAL_TYPES = [
  "Get an Internship",
  "Get a Job",
  "Prepare for an Entrance Exam",
  "Learn a New Skill",
  "Improve Existing Skills",
  "Build a Portfolio",
  "Start a Business / Venture",
  "Prepare for Interviews",
  "Switch Career Direction",
  "Pursue Higher Education",
  "Conduct Academic Research",
  "Improve Academic Performance",
  "Get Industry Guidance",
  "Explore Career Options",
  "Freelancing & Consulting",
  "Competitive Exams (GATE/CAT/GMAT/UPSC/GRE)",
  "Other",
];
