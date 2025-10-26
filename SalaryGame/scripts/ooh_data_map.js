/**
 * OOH Data Mapping
 * Maps SOC codes to career-specific OOH data extracted from the original CareerSkills data
 */

const OOH_DATA_MAP = {
  '29-1141': { // Registered Nurse
    description: 'Provide and coordinate patient care, educate patients and the public about various health conditions, and provide advice and emotional support to patients and their families.',
    workEnvironment: 'Hospitals, clinics, nursing homes',
    education: "Bachelor's degree (BSN) or Associate's degree (ADN)",
    jobOutlookText: 'Faster than average'
  },
  '15-1252': { // Software Developer
    description: 'Design, develop, and test computer applications and systems. Create programs that allow users to perform specific tasks on computers and other devices.',
    workEnvironment: 'Tech companies, remote work, offices',
    education: "Bachelor's degree in Computer Science or related field",
    jobOutlookText: 'Much faster than average'
  },
  '25-2021': { // Elementary School Teacher
    description: 'Teach students basic subjects such as math, reading, science, and social studies. Create lesson plans and assess student progress.',
    workEnvironment: 'Public and private schools',
    education: "Bachelor's degree and state teaching license",
    jobOutlookText: 'As fast as average'
  },
  '47-2111': { // Electrician
    description: 'Install, maintain, and repair electrical power, communications, lighting, and control systems in homes, businesses, and factories.',
    workEnvironment: 'Construction sites, homes, businesses',
    education: 'High school diploma and apprenticeship',
    jobOutlookText: 'Faster than average'
  },
  '17-2141': { // Mechanical Engineer
    description: 'Design, develop, build, and test mechanical and thermal sensors and devices. Work on power-producing machines and power-using machines.',
    workEnvironment: 'Manufacturing, engineering firms, offices',
    education: "Bachelor's degree in Mechanical Engineering",
    jobOutlookText: 'Faster than average'
  },
  '29-1292': { // Dental Hygienist
    description: 'Clean teeth, examine patients for signs of oral diseases, provide preventive dental care, and educate patients on ways to improve and maintain good oral health.',
    workEnvironment: 'Dental offices',
    education: "Associate's degree and state license",
    jobOutlookText: 'Faster than average'
  },
  '11-2021': { // Marketing Manager
    description: 'Plan programs to generate interest in products or services. Work with art directors, advertising sales agents, and financial staff members.',
    workEnvironment: 'Offices, remote work possible',
    education: "Bachelor's degree in Marketing or Business",
    jobOutlookText: 'Faster than average'
  },
  '47-2152': { // Plumber
    description: 'Install and repair pipes that carry liquids or gases to, from, and within businesses, homes, and factories. Install plumbing fixtures and appliances.',
    workEnvironment: 'Construction sites, homes, businesses',
    education: 'High school diploma and apprenticeship',
    jobOutlookText: 'As fast as average'
  },
  '29-1123': { // Physical Therapist
    description: 'Help injured or ill people improve movement and manage pain. Work with patients to develop treatment plans and monitor progress.',
    workEnvironment: 'Hospitals, clinics, private practices',
    education: 'Doctoral degree (DPT) and state license',
    jobOutlookText: 'Much faster than average'
  },
  '27-1024': { // Graphic Designer
    description: 'Create visual concepts using computer software or by hand to communicate ideas that inspire, inform, and captivate consumers.',
    workEnvironment: 'Advertising firms, design studios, remote',
    education: "Bachelor's degree in Graphic Design or related field",
    jobOutlookText: 'As fast as average'
  },
  '15-2051': { // Data Scientist
    description: 'Use analytical tools and techniques to extract meaningful insights from data. Develop algorithms and predictive models to solve business problems.',
    workEnvironment: 'Tech companies, corporations, remote',
    education: "Bachelor's or Master's degree in Data Science, Statistics, or Computer Science",
    jobOutlookText: 'Much faster than average'
  },
  '23-2011': { // Paralegal
    description: 'Assist lawyers by investigating facts, preparing legal documents, and researching legal precedent. Help prepare cases for trial.',
    workEnvironment: 'Law firms, corporate legal departments',
    education: "Associate's degree or certificate in Paralegal Studies",
    jobOutlookText: 'Faster than average'
  },
  '29-1131': { // Veterinarian
    description: 'Care for the health of animals and work to protect public health. Diagnose, treat, and research medical conditions and diseases of pets, livestock, and other animals.',
    workEnvironment: 'Animal hospitals, clinics, farms',
    education: 'Doctoral degree (DVM) and state license',
    jobOutlookText: 'Much faster than average'
  },
  '15-1254': { // Web Developer
    description: 'Design and create websites. Responsible for the look of the site, technical aspects like performance and capacity, and content management.',
    workEnvironment: 'Tech companies, agencies, freelance',
    education: "Associate's or Bachelor's degree in Web Development or related field",
    jobOutlookText: 'Much faster than average'
  },
  '33-3051': { // Police Officer
    description: 'Protect lives and property. Patrol areas, respond to emergency calls, enforce laws, conduct traffic stops, and write detailed reports.',
    workEnvironment: 'Police departments, patrol areas',
    education: 'High school diploma and police academy training',
    jobOutlookText: 'As fast as average'
  },
  '13-2011': { // Accountant
    description: 'Prepare and examine financial records. Ensure records are accurate and that taxes are paid properly and on time.',
    workEnvironment: 'Accounting firms, corporations, government',
    education: "Bachelor's degree in Accounting",
    jobOutlookText: 'Faster than average'
  },
  '49-9021': { // HVAC Technician
    description: 'Install, maintain, and repair heating, ventilation, air conditioning, and refrigeration systems that control temperature and air quality.',
    workEnvironment: 'Homes, businesses, outdoors',
    education: 'Postsecondary certificate or apprenticeship',
    jobOutlookText: 'Faster than average'
  },
  '29-1122': { // Occupational Therapist
    description: 'Help people with injuries, illnesses, or disabilities develop, recover, and improve skills needed for daily living and working.',
    workEnvironment: 'Hospitals, schools, rehab centers',
    education: "Master's degree in Occupational Therapy and state license",
    jobOutlookText: 'Much faster than average'
  },
  '17-2051': { // Civil Engineer
    description: 'Design, build, supervise, operate, and maintain construction projects and systems such as roads, buildings, airports, tunnels, and water supply systems.',
    workEnvironment: 'Offices, construction sites',
    education: "Bachelor's degree in Civil Engineering",
    jobOutlookText: 'Faster than average'
  },
  '35-1011': { // Chef
    description: 'Direct the preparation, seasoning, and cooking of food. Plan menus, order supplies, and oversee kitchen operations.',
    workEnvironment: 'Restaurants, hotels, catering companies',
    education: 'High school diploma or culinary arts degree',
    jobOutlookText: 'Much faster than average'
  },
  '29-1071': { // Physician Assistant
    description: 'Practice medicine on healthcare teams with physicians, surgeons, and other healthcare workers. Examine patients, diagnose injuries and illnesses, and provide treatment.',
    workEnvironment: 'Hospitals, clinics, doctor\'s offices',
    education: "Master's degree from an accredited PA program and state license",
    jobOutlookText: 'Much faster than average'
  },
  '41-9021': { // Real Estate Agent
    description: 'Help clients buy, sell, and rent properties. Advise clients on market conditions, conduct walkthroughs, and handle negotiations.',
    workEnvironment: 'Real estate offices, homes, remote',
    education: 'High school diploma and state license',
    jobOutlookText: 'Faster than average'
  },
  '29-1051': { // Pharmacist
    description: 'Dispense prescription medications to patients and offer expertise in the safe use of prescriptions. Advise patients and healthcare providers on proper medication usage.',
    workEnvironment: 'Pharmacies, hospitals, clinics',
    education: 'Doctoral degree (PharmD) and state license',
    jobOutlookText: 'As fast as average'
  },
  '15-1212': { // Cybersecurity Analyst
    description: 'Plan and carry out security measures to protect an organization\'s computer networks and systems. Monitor networks for security breaches and investigate violations.',
    workEnvironment: 'Tech companies, government, remote',
    education: "Bachelor's degree in Computer Science or Cybersecurity",
    jobOutlookText: 'Much faster than average'
  },
  '21-1029': { // Social Worker
    description: 'Help people prevent and cope with problems in their everyday lives. Clinical social workers diagnose and treat mental, behavioral, and emotional issues.',
    workEnvironment: 'Healthcare facilities, schools, government agencies',
    education: "Bachelor's or Master's degree in Social Work",
    jobOutlookText: 'Faster than average'
  },
  '17-2011': { // Aerospace Engineer
    description: 'Design aircraft, spacecraft, satellites, and missiles. Test prototypes to make sure they function according to design specifications.',
    workEnvironment: 'Aerospace companies, government agencies',
    education: "Bachelor's degree in Aerospace Engineering",
    jobOutlookText: 'Faster than average'
  },
  '31-9091': { // Dental Assistant
    description: 'Provide chairside assistance to dentists. Prepare patients for treatment, sterilize instruments, and take X-rays.',
    workEnvironment: 'Dental offices',
    education: 'Certificate or diploma from a dental assisting program',
    jobOutlookText: 'Faster than average'
  },
  '13-2051': { // Financial Analyst
    description: 'Provide guidance to businesses and individuals making investment decisions. Assess the performance of stocks, bonds, and other investments.',
    workEnvironment: 'Banks, insurance companies, investment firms',
    education: "Bachelor's degree in Finance or related field",
    jobOutlookText: 'Faster than average'
  },
  '11-9021': { // Construction Manager
    description: 'Plan, coordinate, budget, and supervise construction projects from start to finish. Ensure projects are completed on time and within budget.',
    workEnvironment: 'Construction sites, offices',
    education: "Bachelor's degree in Construction Management or related field",
    jobOutlookText: 'Faster than average'
  },
  '31-9092': { // Medical Assistant
    description: 'Complete administrative and clinical tasks in hospitals, offices of physicians, and other healthcare facilities. Take patient history and vital signs.',
    workEnvironment: 'Hospitals, clinics, doctor\'s offices',
    education: 'Postsecondary certificate',
    jobOutlookText: 'Much faster than average'
  },
  '17-1011': { // Architect
    description: 'Plan and design houses, office buildings, and other structures. Meet with clients, develop initial proposals, and prepare drawings and specifications.',
    workEnvironment: 'Architecture firms, self-employed',
    education: "Bachelor's or Master's degree in Architecture and state license",
    jobOutlookText: 'Faster than average'
  },
  '33-2011': { // Firefighter
    description: 'Respond to fires and other emergencies. Rescue victims, provide medical attention, and prevent fires through inspections and education.',
    workEnvironment: 'Fire stations, emergency scenes',
    education: 'High school diploma and firefighter academy training',
    jobOutlookText: 'Faster than average'
  },
  '11-3121': { // Human Resources Manager
    description: 'Plan, coordinate, and direct the administrative functions of an organization. Oversee recruiting, interviewing, and hiring of new staff.',
    workEnvironment: 'Offices, various organizations',
    education: "Bachelor's degree in Human Resources or Business",
    jobOutlookText: 'Faster than average'
  },
  '29-1124': { // Radiation Therapist
    description: 'Treat cancer and other diseases using radiation therapy. Operate machines to deliver concentrated radiation therapy to targeted areas.',
    workEnvironment: 'Hospitals, cancer treatment centers',
    education: "Associate's or Bachelor's degree and state license",
    jobOutlookText: 'Faster than average'
  },
  '13-2072': { // Loan Officer
    description: 'Evaluate, authorize, or recommend approval of loan applications. Help customers choose the right loan product and guide them through the application process.',
    workEnvironment: 'Banks, credit unions, mortgage companies',
    education: "Bachelor's degree and state license",
    jobOutlookText: 'Slower than average'
  },
  '17-2199': { // Robotics Engineer
    description: 'Design, build, and test robots and robotic systems. Work on automation solutions for manufacturing, healthcare, and other industries.',
    workEnvironment: 'Manufacturing, tech companies, research labs',
    education: "Bachelor's degree in Robotics Engineering or related field",
    jobOutlookText: 'Faster than average'
  },
  '29-2032': { // Medical Sonographer
    description: 'Use special imaging equipment to create images or conduct tests. Use sonography to help physicians assess and diagnose various medical conditions.',
    workEnvironment: 'Hospitals, diagnostic labs, doctor\'s offices',
    education: "Associate's degree",
    jobOutlookText: 'Faster than average'
  },
  '13-1121': { // Event Planner
    description: 'Coordinate all aspects of professional meetings and events. Choose locations, arrange transportation, and coordinate other details for successful events.',
    workEnvironment: 'Hotels, convention centers, offices',
    education: "Bachelor's degree",
    jobOutlookText: 'Much faster than average'
  },
  '29-1211': { // Anesthesiologist
    description: 'Administer anesthetics during surgery and other medical procedures. Monitor patients before, during, and after anesthesia administration.',
    workEnvironment: 'Hospitals, surgical centers',
    education: 'Medical degree (MD/DO), residency, and state license',
    jobOutlookText: 'As fast as average'
  },
  '29-1021': { // Dentist
    description: 'Diagnose and treat problems with patients\' teeth, gums, and related parts of the mouth. Provide advice and instruction on taking care of teeth and gums.',
    workEnvironment: 'Dental offices, private practice',
    education: 'Doctoral degree (DDS/DMD) and state license',
    jobOutlookText: 'Faster than average'
  },
  '51-4121': { // Welder
    description: 'Use hand-held or remotely controlled equipment to join or cut metal parts. Work with various metals and alloys in manufacturing and construction.',
    workEnvironment: 'Manufacturing plants, construction sites',
    education: 'High school diploma and technical training',
    jobOutlookText: 'Slower than average'
  },
  '27-1025': { // Interior Designer
    description: 'Make interior spaces functional, safe, and beautiful by determining space requirements and selecting decorative items. Read blueprints and must be aware of building codes.',
    workEnvironment: 'Design firms, self-employed, retail',
    education: "Bachelor's degree",
    jobOutlookText: 'Faster than average'
  },
  '27-1022': { // Fashion Designer
    description: 'Create original clothing, accessories, and footwear. Sketch designs, select fabrics and patterns, and give instructions on how to make products they design.',
    workEnvironment: 'Design studios, apparel companies, self-employed',
    education: "Bachelor's degree in Fashion Design",
    jobOutlookText: 'As fast as average'
  },
  '53-2021': { // Air Traffic Controller
    description: 'Coordinate the movement of aircraft to maintain safe distances between them. Direct pilots during takeoff and landing, and monitor aircraft in flight.',
    workEnvironment: 'Control towers, approach control facilities',
    education: "Associate's or Bachelor's degree and FAA training",
    jobOutlookText: 'As fast as average'
  },
  '29-2042': { // Paramedic
    description: 'Respond to emergency calls, perform medical services and transport patients to medical facilities. Assess injuries, administer emergency medical care, and use medical equipment.',
    workEnvironment: 'Ambulances, emergency scenes',
    education: 'Postsecondary certificate and state license',
    jobOutlookText: 'Faster than average'
  },
  '17-2041': { // Chemical Engineer
    description: 'Apply chemistry, biology, physics, and math principles to solve problems involving the production or use of chemicals, fuel, drugs, food, and many other products.',
    workEnvironment: 'Laboratories, manufacturing plants, offices',
    education: "Bachelor's degree in Chemical Engineering",
    jobOutlookText: 'Much faster than average'
  },
  '19-2031': { // Chemist
    description: 'Research and develop processes, products, and materials. Study substances at the atomic and molecular levels and analyze the interactions between them.',
    workEnvironment: 'Laboratories, pharmaceutical companies',
    education: "Bachelor's degree in Chemistry",
    jobOutlookText: 'Faster than average'
  },
  '23-1011': { // Lawyer
    description: 'Advise and represent individuals, businesses, and government agencies on legal issues and disputes. Research and interpret laws, present facts and evidence.',
    workEnvironment: 'Law firms, corporate offices, courts',
    education: 'Doctoral degree (JD) and state bar license',
    jobOutlookText: 'Faster than average'
  },
  '17-2171': { // Petroleum Engineer
    description: 'Design and develop methods for extracting oil and gas from deposits below the Earth\'s surface. Devise ways to improve production and find new oil and gas reserves.',
    workEnvironment: 'Oil fields, offices, laboratories',
    education: "Bachelor's degree in Petroleum Engineering",
    jobOutlookText: 'Faster than average'
  },
  '51-8013': { // Power Plant Operator
    description: 'Control, operate, and maintain machinery to generate electric power. Monitor instruments, start or stop generators and turbines, and record data.',
    workEnvironment: 'Power plants, control rooms',
    education: 'High school diploma and long-term on-the-job training',
    jobOutlookText: 'Decline'
  },
  '19-1023': { // Wildlife Biologist / Zoologist
    description: 'Study animals and other wildlife and how they interact with their ecosystems. Study characteristics, behaviors, and habitats of wildlife species.',
    workEnvironment: 'Outdoors, laboratories, offices',
    education: "Bachelor's degree in Biology or Wildlife Biology",
    jobOutlookText: 'Faster than average'
  },
  '25-2031': { // High School Teacher
    description: 'Teach biology and life science courses to high school students. Prepare lesson plans, assess student learning, and maintain classroom discipline.',
    workEnvironment: 'High schools, classrooms',
    education: "Bachelor's degree and state teaching license",
    jobOutlookText: 'As fast as average'
  },
  '31-9097': { // Phlebotomist
    description: 'Draw blood from patients and donors for tests, transfusions, research, or blood donations. Verify patient identity and label blood samples.',
    workEnvironment: 'Hospitals, laboratories, blood donation centers',
    education: 'Postsecondary certificate and state certification',
    jobOutlookText: 'Faster than average'
  },
  '39-5012': { // Hair Stylist
    description: 'Shampoo, cut, color, and style hair. May also provide scalp treatments and consultations on hair care and styling.',
    workEnvironment: 'Salons, spas, self-employed',
    education: 'Postsecondary certificate and state license',
    jobOutlookText: 'Faster than average'
  },
  '41-2011': { // Retail Sales Worker
    description: 'Process customer transactions, accept payments, and give change. Scan items, bag purchases, and provide customer service.',
    workEnvironment: 'Retail stores, restaurants, gas stations',
    education: 'High school diploma or less',
    jobOutlookText: 'Decline'
  },
  '15-1251': { // Computer Programmer
    description: 'Write and test code that allows computer applications and software programs to function. Update and expand existing programs.',
    workEnvironment: 'Tech companies, offices, remote',
    education: "Bachelor's degree in Computer Science",
    jobOutlookText: 'Decline'
  },
  '27-2021': { // Professional Athlete
    description: 'Compete in athletic events and sports competitions. Practice and train to maintain peak physical condition and athletic performance.',
    workEnvironment: 'Sports facilities, training centers, travel',
    education: 'Varies - Exceptional athletic ability required',
    jobOutlookText: 'As fast as average'
  },
  '43-3071': { // Bank Teller
    description: 'Conduct financial transactions for customers. Process deposits and withdrawals, cash checks, and handle customer service inquiries.',
    workEnvironment: 'Banks, credit unions',
    education: 'High school diploma',
    jobOutlookText: 'Decline'
  },
  '49-3023': { // Automotive Mechanic
    description: 'Inspect, maintain, and repair cars and light trucks. Identify problems, often by using computerized diagnostic equipment.',
    workEnvironment: 'Repair shops, dealerships',
    education: 'High school diploma and technical training',
    jobOutlookText: 'Slower than average'
  },
  '27-4021': { // Photographer
    description: 'Capture subjects in commercial-quality photographs. Use technical expertise, creativity, and composition skills to produce images.',
    workEnvironment: 'Studios, events, outdoors, self-employed',
    education: 'High school diploma to Bachelor\'s degree',
    jobOutlookText: 'Faster than average'
  },
  '27-2012': { // Producers and Directors
    description: 'Interpret scripts, direct actors and crew, and oversee all aspects of film and television production. Make creative decisions about artistic elements.',
    workEnvironment: 'Film sets, studios, location shoots',
    education: "Bachelor's degree in Film or related field",
    jobOutlookText: 'Faster than average'
  },
  '27-2011': { // Actor
    description: 'Portray characters in performances. Work from scripts and interpret the writer\'s words to entertain, inform, or instruct audiences.',
    workEnvironment: 'Film sets, theaters, studios',
    education: 'Varies - Some have Bachelor\'s degrees in Drama',
    jobOutlookText: 'Faster than average'
  },
  '25-4021': { // Librarian
    description: 'Help people find information and conduct research. Organize library materials and teach patrons how to find and use resources.',
    workEnvironment: 'Public libraries, schools, universities',
    education: "Master's degree in Library Science",
    jobOutlookText: 'As fast as average'
  },
  '27-3043': { // Writer
    description: 'Develop original written content for books, magazines, websites, scripts, and other publications. Research topics and interview sources.',
    workEnvironment: 'Offices, remote, self-employed',
    education: "Bachelor's degree in English or Journalism",
    jobOutlookText: 'Faster than average'
  },
  '15-2021': { // Mathematician
    description: 'Use advanced mathematics to develop and understand mathematical principles, analyze data, and solve real-world problems.',
    workEnvironment: 'Government, research institutions, universities',
    education: "Master's or Doctoral degree in Mathematics",
    jobOutlookText: 'As fast as average'
  },
  '11-3031': { // Financial Manager
    description: 'Create financial reports, direct investment activities, and develop strategies and plans for the long-term financial goals of organizations.',
    workEnvironment: 'Offices, corporations, financial firms',
    education: "Bachelor's degree in Finance or related field",
    jobOutlookText: 'Much faster than average'
  }
};

module.exports = { OOH_DATA_MAP };
