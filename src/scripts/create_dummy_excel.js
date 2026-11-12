const XLSX = require('xlsx');
const path = require('path');

// Helper to generate a structured sheet
function createStructuredSheet(sheetTitle, items) {
  const headers = [
    'Sr. No.',
    'Topic',
    'Action Description',
    'Status',
    'Priority',
    'Assignee',
    'Department',
    'Start Date',
    'Due Date',
    'Completion %',
    'Remarks'
  ];

  const data = [
    [sheetTitle], // Row 0: Sheet title
    headers,      // Row 1: Columns
  ];

  items.forEach((item, idx) => {
    data.push([
      idx + 1,
      item.topic,
      item.action,
      item.status,
      item.priority,
      item.assignee,
      item.department,
      item.startDate,
      item.dueDate,
      item.completion,
      item.remarks || ''
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  ws['!cols'] = [
    { wch: 8 },  // Sr. No.
    { wch: 25 }, // Topic
    { wch: 55 }, // Action Description
    { wch: 15 }, // Status
    { wch: 12 }, // Priority
    { wch: 18 }, // Assignee
    { wch: 18 }, // Department
    { wch: 14 }, // Start Date
    { wch: 14 }, // Due Date
    { wch: 14 }, // Completion %
    { wch: 30 }, // Remarks
  ];

  return ws;
}

// 1. Shillim Action Plan
const shillimData = [
  {
    topic: 'Workplace Hygiene Pillar',
    action: 'Worker restroom & lunchroom to be identified & ensuring proper seating arrangement and housekeeping',
    status: 'Completed',
    priority: 'High',
    assignee: 'Rajesh Sharma',
    department: 'Civil & Admin',
    startDate: '2026-09-01',
    dueDate: '2026-09-26',
    completion: 100,
    remarks: 'Restroom audited & approved by committee'
  },
  {
    topic: 'Workplace Hygiene Pillar',
    action: 'Drinking water quality to be tested by third party, result to be disclosed and quality to be sustained',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Pooja Verma',
    department: 'Safety & EHS',
    startDate: '2026-09-15',
    dueDate: '2026-10-26',
    completion: 75,
    remarks: 'Sample collection complete, report awaited'
  },
  {
    topic: 'Operational Discipline Pillar',
    action: 'Review of SOP timely and must be updated as per plant requirement',
    status: 'Completed',
    priority: 'Medium',
    assignee: 'Amitabh Roy',
    department: 'Operations',
    startDate: '2026-09-10',
    dueDate: '2026-10-15',
    completion: 100,
    remarks: 'All 14 plant SOPs updated'
  },
  {
    topic: 'Operational Discipline Pillar',
    action: 'Coordination between inter-department to discuss with their pain point/limitations through SLA',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Sunil Mahato',
    department: 'HR & IR',
    startDate: '2026-09-20',
    dueDate: '2026-11-20',
    completion: 60,
    remarks: 'Draft SLA shared with Engg & Maint teams'
  },
  {
    topic: 'Collaboration & Teamwork Pillar',
    action: '‘Pragati Utsav’ & ‘Chai Pe Charcha’ involving cross-functional team',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'Neha Singh',
    department: 'Employee Relations',
    startDate: '2026-10-01',
    dueDate: '2026-11-26',
    completion: 40,
    remarks: '3 sessions successfully organized'
  },
  {
    topic: 'Collaboration & Teamwork Pillar',
    action: 'Quarterly outbound get-together to be cross-functional or with multiple functions',
    status: 'Not Started',
    priority: 'Low',
    assignee: 'Vikram Joshi',
    department: 'HR Operations',
    startDate: '2026-11-01',
    dueDate: '2026-12-26',
    completion: 0,
    remarks: 'Venue booking in progress'
  },
  {
    topic: 'Values & Behavior Pillar',
    action: 'Allow ideas from juniors by giving more responsibilities and key positions in working committee',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Sunil Mahato',
    department: 'HR & IR',
    startDate: '2026-09-15',
    dueDate: '2026-11-15',
    completion: 65,
    remarks: '8 GETs inducted into sub-committees'
  },
  {
    topic: 'Values & Behavior Pillar',
    action: 'Implementation of training, effectiveness and feedback specially for WCM training',
    status: 'Blocked',
    priority: 'Medium',
    assignee: 'Ananya Sen',
    department: 'Learning & Dev',
    startDate: '2026-10-05',
    dueDate: '2026-10-30',
    completion: 30,
    remarks: 'External trainer schedule rescheduled'
  }
];

// 2. Vibes Action Plan
const vibesData = [
  {
    topic: 'Onboarding',
    action: 'Cohort Connect Ritual: Quarterly structured forum with GETs, DETs, and women employees led by Unit Head & HR Head',
    status: 'Completed',
    priority: 'High',
    assignee: 'Priya Prasad',
    department: 'Talent Mgmt',
    startDate: '2026-09-01',
    dueDate: '2026-09-26',
    completion: 100,
    remarks: 'Q1 Cohort connect successfully held'
  },
  {
    topic: 'Onboarding',
    action: 'Digitization of Quarter Allotment System on internal portal',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'Kunal Kishore',
    department: 'IT & Digital',
    startDate: '2026-09-15',
    dueDate: '2026-11-10',
    completion: 70,
    remarks: 'UAT testing underway'
  },
  {
    topic: 'Onboarding',
    action: 'Construction of 24 Nos. of Quarters to Solve Accommodation Problem (Target: May 2027)',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Harish Chandra',
    department: 'Civil Projects',
    startDate: '2026-08-01',
    dueDate: '2026-12-31',
    completion: 25,
    remarks: 'Foundation work started for Block A & B'
  },
  {
    topic: 'Managerial Effectiveness',
    action: 'Bridging Generation Training: 1:1 connects with GenZ, clear expectations, real-time recognition',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Ananya Sen',
    department: 'Learning & Dev',
    startDate: '2026-09-10',
    dueDate: '2026-10-30',
    completion: 55,
    remarks: 'Batch 1 and 2 completed (45 managers trained)'
  },
  {
    topic: 'Managerial Effectiveness',
    action: 'Growth Mindset Training for Gen Z employees',
    status: 'Completed',
    priority: 'Medium',
    assignee: 'Ananya Sen',
    department: 'Learning & Dev',
    startDate: '2026-09-05',
    dueDate: '2026-10-10',
    completion: 100,
    remarks: 'Full cohort participation achieved'
  },
  {
    topic: 'Performance Culture',
    action: 'Bhoomika Recognition Ritual: Thursday weekly unit-wide forum to celebrate contributions & positive reinforcement',
    status: 'Completed',
    priority: 'High',
    assignee: 'Neha Singh',
    department: 'Employee Relations',
    startDate: '2026-09-01',
    dueDate: '2026-10-31',
    completion: 100,
    remarks: 'Conducted every Thursday consistently'
  },
  {
    topic: 'Performance Culture',
    action: 'Utilization of RISE, Shillim Awards, PRAISE & PRIDE Platform with dept-wise tracking in monthly townhall',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'Priya Prasad',
    department: 'HR Operations',
    startDate: '2026-09-15',
    dueDate: '2026-11-15',
    completion: 80,
    remarks: 'Monthly dashboard presented to Unit Head'
  },
  {
    topic: 'Development Career',
    action: 'JD Writing for All TBD Positions: defining and reviewing clear JDs for GenZ in TBD roles followed by manager discussion',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Sunil Mahato',
    department: 'Talent Mgmt',
    startDate: '2026-09-10',
    dueDate: '2026-11-30',
    completion: 60,
    remarks: '22 out of 35 JDs finalized'
  },
  {
    topic: 'Development Career',
    action: 'Defining KRA for all TBD Roles',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Sunil Mahato',
    department: 'Talent Mgmt',
    startDate: '2026-10-01',
    dueDate: '2026-11-30',
    completion: 50,
    remarks: 'KRA draft submitted for review'
  },
  {
    topic: 'Development Career',
    action: 'AankLearn App rollout for all GETs and DETs from 2024 and 2025 batch',
    status: 'Completed',
    priority: 'Medium',
    assignee: 'Ananya Sen',
    department: 'Learning & Dev',
    startDate: '2026-08-15',
    dueDate: '2026-09-30',
    completion: 100,
    remarks: '100% active user login verified'
  },
  {
    topic: 'Engagement Index',
    action: 'MPH Connect Ritual: Weekly structured My People Hour through manager documentation & team connect',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Neha Singh',
    department: 'Employee Relations',
    startDate: '2026-09-01',
    dueDate: '2026-12-15',
    completion: 70,
    remarks: 'Department attendance at 88%'
  },
  {
    topic: 'Engagement Index',
    action: 'Circle of Trust to be conducted for all Managerial Levels across departments',
    status: 'Overdue',
    priority: 'High',
    assignee: 'Sunil Mahato',
    department: 'HR & IR',
    startDate: '2026-09-01',
    dueDate: '2026-10-15',
    completion: 35,
    remarks: 'Delayed due to plant maintenance shutdown'
  },
  {
    topic: 'Leadership',
    action: 'Communication Effectiveness Ritual: drafting clear, outcome-focused communication with defined ownership & mailing hygiene',
    status: 'Completed',
    priority: 'Medium',
    assignee: 'Priya Prasad',
    department: 'Corporate Comms',
    startDate: '2026-09-01',
    dueDate: '2026-10-15',
    completion: 100,
    remarks: 'Mailer guidelines released plant-wide'
  }
];

// 3. LCG Action Plan
const lcgData = [
  {
    topic: 'Labor Committee Meeting',
    action: 'Convene monthly Joint Consultation Committee with union representatives on welfare amenities',
    status: 'Completed',
    priority: 'High',
    assignee: 'Rameshwar Mahto',
    department: 'Industrial Relations',
    startDate: '2026-09-01',
    dueDate: '2026-09-15',
    completion: 100,
    remarks: 'Minutes signed by Union & Mgmt'
  },
  {
    topic: 'Safety & PPE Compliance',
    action: 'Inspection of plant floor PPE standards and issuance of winter protective gear for contractor workers',
    status: 'Completed',
    priority: 'High',
    assignee: 'Pooja Verma',
    department: 'Safety & EHS',
    startDate: '2026-09-15',
    dueDate: '2026-10-05',
    completion: 100,
    remarks: 'Distributed 450 pairs of winter gloves & boots'
  },
  {
    topic: 'Statutory Welfare Audit',
    action: 'Biannual statutory audit of drinking water points, washrooms and creche facilities in plant perimeter',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'Sanjay Gupta',
    department: 'Admin & Welfare',
    startDate: '2026-10-01',
    dueDate: '2026-11-15',
    completion: 60,
    remarks: 'Creche refurbishment work in final stage'
  },
  {
    topic: 'Grievance Redressal',
    action: 'Digitize LCG grievance drop-box tickets with SLA resolution within 7 working days',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Kunal Kishore',
    department: 'IT & Digital',
    startDate: '2026-10-10',
    dueDate: '2026-11-30',
    completion: 45,
    remarks: 'Testing ticketing system with Welfare Committee'
  },
  {
    topic: 'Health & Medical Checkup',
    action: 'Annual occupational health surveillance camp for all workmen above 45 years',
    status: 'Not Started',
    priority: 'Medium',
    assignee: 'Dr. A. K. Banerjee',
    department: 'Occupational Health',
    startDate: '2026-11-15',
    dueDate: '2026-12-20',
    completion: 0,
    remarks: 'Medical tie-up with hospital finalized'
  }
];

// 4. Manthan Action Plan
const manthanData = [
  {
    topic: 'Continuous Improvement',
    action: 'Organize quarterly Manthan Kaizen competition across smelter, refinery, and power plant divisions',
    status: 'Completed',
    priority: 'High',
    assignee: 'Vivek Ranjan',
    department: 'Continuous Imprv (WCM)',
    startDate: '2026-09-05',
    dueDate: '2026-09-30',
    completion: 100,
    remarks: '124 Kaizen ideas submitted, 8 awarded'
  },
  {
    topic: 'Energy Conservation Ideas',
    action: 'Evaluation of employee-driven electrical energy saving suggestions for potline ventilation',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Debashish Mitra',
    department: 'Electrical Maint',
    startDate: '2026-09-15',
    dueDate: '2026-11-15',
    completion: 80,
    remarks: 'Pilot implemented in Substation 3'
  },
  {
    topic: 'Quality Circles',
    action: 'Re-energize 12 Quality Circle teams with external mentor coaching and problem-solving tools',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'Ananya Sen',
    department: 'Learning & Dev',
    startDate: '2026-10-01',
    dueDate: '2026-12-10',
    completion: 50,
    remarks: '6 teams completed intermediate review'
  },
  {
    topic: 'Cost Optimization Drive',
    action: 'Action plan on consumables reduction in bauxite handling area through frontline suggestions',
    status: 'Blocked',
    priority: 'High',
    assignee: 'Manoj Tripathy',
    department: 'Refinery Ops',
    startDate: '2026-10-15',
    dueDate: '2026-11-20',
    completion: 20,
    remarks: 'Waiting for vendor trial samples'
  },
  {
    topic: 'Knowledge Sharing Forum',
    action: 'Monthly cross-learning webinar connecting Muri plant engineers with Renukoot & Aditya smelter units',
    status: 'Completed',
    priority: 'Low',
    assignee: 'Priya Prasad',
    department: 'Knowledge Mgmt',
    startDate: '2026-09-20',
    dueDate: '2026-10-25',
    completion: 100,
    remarks: 'Over 85 engineers attended the session'
  }
];

// 5. Townhall Action Plan
const townhallData = [
  {
    topic: 'Quarterly Unit Townhall',
    action: 'Organize Q2 FY27 Unit Townhall in main auditorium with live stream for shift personnel',
    status: 'Completed',
    priority: 'High',
    assignee: 'Sunil Mahato',
    department: 'HR & Comms',
    startDate: '2026-09-15',
    dueDate: '2026-10-05',
    completion: 100,
    remarks: 'Unit Head presentation & open Q&A held'
  },
  {
    topic: 'Action Tracker Closure',
    action: 'Publish closure report on 15 queries raised by employees during September open house forum',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Neha Singh',
    department: 'Employee Relations',
    startDate: '2026-10-06',
    dueDate: '2026-11-05',
    completion: 85,
    remarks: '12 out of 15 queries closed & displayed on notice boards'
  },
  {
    topic: 'Recognition in Townhall',
    action: 'Department-wise recognition ceremony for zero-accident milestones and top 5 suggestion winners',
    status: 'Completed',
    priority: 'Medium',
    assignee: 'Priya Prasad',
    department: 'HR Operations',
    startDate: '2026-09-20',
    dueDate: '2026-10-05',
    completion: 100,
    remarks: '18 employees recognized with trophies & vouchers'
  },
  {
    topic: 'Shift Employees Connect',
    action: 'Conduct mini-townhall sessions inside control rooms for non-general shift technicians',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'Amitabh Roy',
    department: 'Plant Operations',
    startDate: '2026-10-15',
    dueDate: '2026-11-25',
    completion: 40,
    remarks: 'Shift A & B covered; Shift C pending'
  },
  {
    topic: 'Digital Feedback Kiosk',
    action: 'Set up digital feedback tablet kiosks at time-office exit gate for anonymous townhall feedback',
    status: 'Not Started',
    priority: 'Low',
    assignee: 'Kunal Kishore',
    department: 'IT & Digital',
    startDate: '2026-11-10',
    dueDate: '2026-12-15',
    completion: 0,
    remarks: 'Kiosk hardware procurement initiated'
  }
];

// 6. Canteen Communication
const canteenData = [
  {
    topic: 'Menu & Nutrition Review',
    action: 'Quarterly dietitian audit of daily menu, calorie balance and nutritional value for heavy labour workers',
    status: 'Completed',
    priority: 'Medium',
    assignee: 'Sanjay Gupta',
    department: 'Admin & Canteen',
    startDate: '2026-09-01',
    dueDate: '2026-09-20',
    completion: 100,
    remarks: 'Revised high-protein diet implemented'
  },
  {
    topic: 'Food Safety & Hygiene Audit',
    action: 'Monthly swab testing of kitchen prep tables, cutlery and water purifiers by NABL accredited lab',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Pooja Verma',
    department: 'Safety & EHS',
    startDate: '2026-10-01',
    dueDate: '2026-10-31',
    completion: 90,
    remarks: 'Test results within permissible limits'
  },
  {
    topic: 'Canteen Committee Meeting',
    action: 'Bimonthly meeting with joint union & staff canteen committee members to review quality feedback',
    status: 'Completed',
    priority: 'High',
    assignee: 'Rameshwar Mahto',
    department: 'Industrial Relations',
    startDate: '2026-09-10',
    dueDate: '2026-09-28',
    completion: 100,
    remarks: 'Agreed on snack menu adjustments'
  },
  {
    topic: 'Infrastructure Upgrade',
    action: 'Installation of fly catchers, air curtains and touchless hand wash dispensers in main dining hall',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Harish Chandra',
    department: 'Civil Maintenance',
    startDate: '2026-10-05',
    dueDate: '2026-11-20',
    completion: 60,
    remarks: 'Fly catchers and dispensers installed'
  },
  {
    topic: 'Digital Feedback QR Code',
    action: 'Deploy QR-code based instant meal rating on each dining table with automated alerts for low ratings',
    status: 'Completed',
    priority: 'Low',
    assignee: 'Kunal Kishore',
    department: 'IT & Digital',
    startDate: '2026-09-01',
    dueDate: '2026-09-18',
    completion: 100,
    remarks: 'Receiving ~180 daily responses with 4.3/5 avg'
  }
];

// 7. Contractors Meet
const contractorsData = [
  {
    topic: 'Vendor Safety Conclave',
    action: 'Bi-annual Safety Conclave for all 42 registered contractor agencies and supervisory staff',
    status: 'Completed',
    priority: 'High',
    assignee: 'Pooja Verma',
    department: 'Safety & EHS',
    startDate: '2026-09-05',
    dueDate: '2026-09-25',
    completion: 100,
    remarks: '100% agency participation confirmed'
  },
  {
    topic: 'Wage & Statutory Audit',
    action: 'Verification of monthly PF, ESI and minimum wage credit bank statements for all contract labour',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Rameshwar Mahto',
    department: 'Contract Cell (HR)',
    startDate: '2026-10-01',
    dueDate: '2026-10-31',
    completion: 85,
    remarks: '38 out of 42 agencies audited and cleared'
  },
  {
    topic: 'Safety Induction Tracking',
    action: 'Strict gate pass biometric block for contractor workers with expired safety passport training',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Sunil Mahato',
    department: 'Security & HR',
    startDate: '2026-09-15',
    dueDate: '2026-11-15',
    completion: 75,
    remarks: 'Biometric integration tested at Gate 1 & 2'
  },
  {
    topic: 'Rest Shed & Sanitation Facilities',
    action: 'Construction of dedicated rest shelter with drinking water coolers near contractor gate entry',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'Harish Chandra',
    department: 'Civil Projects',
    startDate: '2026-09-20',
    dueDate: '2026-12-05',
    completion: 50,
    remarks: 'Roof sheeting work currently ongoing'
  },
  {
    topic: 'Contractor Performance Rating',
    action: 'Release Q2 contractor scorecards ranking agencies on Safety, Compliance, and Labour Retention',
    status: 'Overdue',
    priority: 'Medium',
    assignee: 'Vikram Joshi',
    department: 'Procurement & HR',
    startDate: '2026-10-01',
    dueDate: '2026-10-20',
    completion: 30,
    remarks: 'Data compilation pending from maintenance heads'
  }
];

// 8. Township Review
const townshipData = [
  {
    topic: 'Housing Maintenance & Repair',
    action: 'Pre-monsoon roof waterproofing and civil repairs across Sector 1, 2, and 3 residential quarters',
    status: 'Completed',
    priority: 'High',
    assignee: 'Harish Chandra',
    department: 'Township Civil',
    startDate: '2026-08-01',
    dueDate: '2026-09-25',
    completion: 100,
    remarks: '148 residential units serviced'
  },
  {
    topic: 'Drinking Water & Filtration',
    action: 'Annual cleaning and chlorination of township overhead water reservoirs and booster pumps',
    status: 'Completed',
    priority: 'High',
    assignee: 'Sanjay Gupta',
    department: 'Township Admin',
    startDate: '2026-09-05',
    dueDate: '2026-09-30',
    completion: 100,
    remarks: 'Water quality certification displayed at club'
  },
  {
    topic: 'Colony Street Lighting & Solar',
    action: 'Replacement of 80 sodium vapour street lights with smart energy-saving LED fixtures',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'Debashish Mitra',
    department: 'Township Electrical',
    startDate: '2026-10-01',
    dueDate: '2026-11-25',
    completion: 65,
    remarks: '52 fixtures installed on Main Boulevard'
  },
  {
    topic: 'Hospital & Healthcare Facilities',
    action: 'Upgradation of emergency medical equipment and 24/7 ambulance readiness at Muri Plant Hospital',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Dr. A. K. Banerjee',
    department: 'Hospital Admin',
    startDate: '2026-09-10',
    dueDate: '2026-11-15',
    completion: 80,
    remarks: 'New defibrillator & ECG unit commissioned'
  },
  {
    topic: 'Recreation Club & Sports Ground',
    action: 'Revamp of badminton court lighting and children park play equipment at Birla Colony Club',
    status: 'In Progress',
    priority: 'Low',
    assignee: 'Neha Singh',
    department: 'Township Welfare',
    startDate: '2026-10-15',
    dueDate: '2026-12-10',
    completion: 40,
    remarks: 'Equipment vendor delivered swings & slides'
  },
  {
    topic: 'Security & Surveillance',
    action: 'Installation of 24 IP CCTV cameras with central monitoring at township entry-exit gates',
    status: 'Not Started',
    priority: 'Medium',
    assignee: 'Vikram Joshi',
    department: 'Security Services',
    startDate: '2026-11-01',
    dueDate: '2026-12-28',
    completion: 0,
    remarks: 'Tender evaluation under technical review'
  }
];

// Create workbook
const wb = XLSX.utils.book_new();

// Sheet names mapped to match SHEET_CONFIG and excelName
XLSX.utils.book_append_sheet(wb, createStructuredSheet('Shillim Action Plan', shillimData), 'Shillim Action Plan');
XLSX.utils.book_append_sheet(wb, createStructuredSheet('Vibes Action Plan', vibesData), 'Vibes Action Plan');
XLSX.utils.book_append_sheet(wb, createStructuredSheet('LCG Action Plan', lcgData), 'LCG Action Plan');
XLSX.utils.book_append_sheet(wb, createStructuredSheet('Manthan Action Plan', manthanData), 'Manthan Action Plan');
XLSX.utils.book_append_sheet(wb, createStructuredSheet('Townhall Action Plan', townhallData), 'Townhall Action Plan');
XLSX.utils.book_append_sheet(wb, createStructuredSheet('Canteen Communication', canteenData), 'Canteen Communication');
XLSX.utils.book_append_sheet(wb, createStructuredSheet('Contractors Meet', contractorsData), 'Contractors Meet');
XLSX.utils.book_append_sheet(wb, createStructuredSheet('Township Review', townshipData), 'Township Review');

// Save paths
const publicPath = path.join(__dirname, '..', 'public', 'default_action_plan.xlsx');
const desktopDummyPath = 'C:\\Users\\PRIYA PRASAD\\OneDrive\\Desktop\\Action_Plan_Dummy_Data.xlsx';
const desktopOriginalPath = 'C:\\Users\\PRIYA PRASAD\\OneDrive\\Desktop\\Action Plan 2026.xlsx';

XLSX.writeFile(wb, publicPath);
console.log('Saved to web public folder:', publicPath);

XLSX.writeFile(wb, desktopDummyPath);
console.log('Saved sample dummy file to Desktop:', desktopDummyPath);

try {
  XLSX.writeFile(wb, desktopOriginalPath);
  console.log('Updated Desktop Action Plan 2026.xlsx as well');
} catch (e) {
  console.log('Could not update Action Plan 2026.xlsx:', e.message);
}

