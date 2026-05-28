import { supabase } from '../supabase/client';

export interface CareerNode {
  id: string;
  parent_id: string | null;
  title: string;
  slug: string;
  category: 'school' | 'college' | 'graduates' | 'jobseekers' | 'creators' | 'skills' | 'parents' | 'teachers';
  description: string;
  future_scope?: string;
  salary_range?: string;
  skills_required?: string[];
  exam_list?: string[];
  college_list?: string[];
  audio_url?: string;
  coming_soon?: boolean;
  theme_color?: 'cyan' | 'green' | 'purple' | 'orange' | 'warm' | 'blue' | 'indigo' | 'gold' | 'pink' | 'red';
  audio_narration?: string;
  motivation_guidance?: string;
  ai_relevance?: string;
  roadmap_steps?: string[];
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  logo_url?: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  apply_url: string;
}

// Complete, rich, cinematic seed data for the 8 primary categories
export const ROOT_NODES: CareerNode[] = [
  {
    id: 'school-students',
    parent_id: null,
    title: '🎒 School Students',
    slug: 'school-students',
    category: 'school',
    description: 'Find your foundational direction. Chart paths from Class 6 to Class 12, select streams (Science, Commerce, Arts), and discover upcoming tech and creative careers.',
    future_scope: 'Laying deep foundations for critical thinking, AI awareness, and emotional intelligence before higher education.',
    theme_color: 'cyan',
    motivation_guidance: 'School is not a race for marks; it is a canvas to discover what sparks your curiosity. The future belongs to those who learn how to learn!',
    ai_relevance: 'AI is a super-charging assistant. Starting in school, learning computational thinking is your golden key.',
  },
  {
    id: 'college-students',
    parent_id: null,
    title: '🎓 College Students',
    slug: 'college-students',
    category: 'college',
    description: 'Bridge the gap between curriculum and industrial scale. Explore engineering, science, business, design, and multi-disciplinary careers.',
    future_scope: 'High transformation into specialize niches. Multi-disciplinary skills are seeing 200% year-on-year demand increases.',
    theme_color: 'indigo',
    motivation_guidance: 'College is your testing laboratory. Build projects, fail fast, form networks, and go beyond your university syllabus.',
    ai_relevance: 'Traditional degree curricula lag behind. You must actively master AI-assisted workflows and industry tools.',
  },
  {
    id: 'graduates',
    parent_id: null,
    title: '👨‍🎓 Graduates',
    slug: 'graduates',
    category: 'graduates',
    description: 'Navigate the complex post-degree landscape. Higher studies, MBAs, competitive government examinations, private sector transitions, and startups.',
    future_scope: 'Transitioning from structured academic environments into dynamic, fast-evolving global economic markets.',
    theme_color: 'blue',
    motivation_guidance: 'Your degree is just a passport; your adaptability is the engine. Do not fear starting small—focus on exponential learning environments.',
    ai_relevance: 'Generative AI is shifting entry-level tasks. Focus on high-agency roles: product design, systems integration, and human relationships.',
  },
  {
    id: 'job-seekers',
    parent_id: null,
    title: '💼 Job Seekers',
    slug: 'job-seekers',
    category: 'jobseekers',
    description: 'Accelerate your career placement. Optimize resumes, build powerful LinkedIn branding, master high-impact technical and HR interviews, and get hired.',
    future_scope: 'Active alignment with high-paying modern businesses, remote global organizations, and high-impact Indian firms.',
    theme_color: 'cyan',
    motivation_guidance: 'Rejection is not a reflection of your worth, but a redirection to a better-suited environment. Stay consistent, optimize your search daily.',
    ai_relevance: 'ATS (Applicant Tracking Systems) use AI to screen resumes. Learn to tailor your experience keywords dynamically.',
  },
  {
    id: 'creators',
    parent_id: null,
    title: '🎨 Creators',
    slug: 'creators',
    category: 'creators',
    description: 'The Creator Economy is the new corporate sector. Professional guide to becoming a YouTuber, 3D Animator, Music Producer, Game Developer, or AI Content Artist.',
    future_scope: 'The global creator market is valued at $250B+ and growing exponentially in India with deep regional audience expansion.',
    theme_color: 'orange',
    motivation_guidance: 'Consistency beats raw talent every single time. Find your specific niche, tell authentic stories, and build a community, not just a follower count.',
    ai_relevance: 'AI tools like Midjourney, Suno, and ChatGPT are force multipliers. The future creator is a director of multiple AI systems.',
  },
  {
    id: 'skill-learners',
    parent_id: null,
    title: '⚡ Skill Learners',
    slug: 'skill-learners',
    category: 'skills',
    description: 'Acquire high-income digital capabilities in record time. Spoken English, digital marketing, video editing, frontend coding, and AI tools integration.',
    future_scope: 'Micro-credentialing and skills-first hiring are replacing traditional 4-year degree requirements globally.',
    theme_color: 'purple',
    motivation_guidance: 'Skills are modern assets. Commit to 100 hours of deliberate practice on a single skill, and you will outpace 90% of generalists.',
    ai_relevance: 'Prompt engineering, code co-piloting, and automated editing workflows make skill acquisition 10x faster today.',
  },
  {
    id: 'parents',
    parent_id: null,
    title: '👨‍👩‍👧 Parents Guidance',
    slug: 'parents-guidance',
    category: 'parents',
    description: 'Understand the modern student. Actionable models on teen psychology, screen addiction solutions, coping with marks pressure, and fostering emotional intelligence.',
    future_scope: 'Creating emotionally secure home environments that allow children to safely experiment, fail, and build authentic lives.',
    theme_color: 'warm',
    motivation_guidance: 'Your child does not need a manager; they need a secure anchor. Your belief in them is their strongest shield against academic pressure.',
    ai_relevance: 'The future of jobs will look completely different than our past. Support multi-disciplinary experimentation rather than forcing rigid paths.',
  },
  {
    id: 'teachers',
    parent_id: null,
    title: '👨‍🏫 Teachers Academy',
    slug: 'teachers-academy',
    category: 'teachers',
    description: 'Modern pedagogical insights. Handle introverts, motivate distracted hyper-intelligent students, design active learning models, and adopt AI in the classroom.',
    future_scope: 'Transitioning from the "sage on the stage" transmitter of information to the "guide on the side" facilitator of thinking.',
    theme_color: 'blue',
    motivation_guidance: 'A teacher is a spark igniter. One word of authentic encouragement from you can alter a child’s self-belief for a lifetime.',
    ai_relevance: 'AI can grade papers and plan lessons, but it can never offer authentic empathy, mentorship, and emotional inspiration. Double down on human connection.',
  }
];

// Flat list of child nodes representing the expandable branches
export const CHILD_NODES: CareerNode[] = [
  // 🎒 SCHOOL STUDENTS BRANCHES
  {
    id: 'school-6-8',
    parent_id: 'school-students',
    title: 'Class 6 - 8 (Foundation)',
    slug: 'school-6-8',
    category: 'school',
    description: 'Build mathematical foundation, read extensively, and explore coding/basic robotics through interactive play.',
    theme_color: 'cyan',
    skills_required: ['Logical Reasoning', 'Creative Writing', 'Scratch Coding', 'Public Speaking'],
    motivation_guidance: 'This is the age of raw curiosity. Ask "Why" to every machine, every book, and every event you witness.',
    ai_relevance: 'Learn computational thinking using block-based coding like Scratch or introductory robotics kits.',
    roadmap_steps: ['Read 15 mins daily', 'Try Scratch game building', 'Perform basic science experiments at home', 'Participate in school debate clubs'],
    exam_list: ['Olympiads (NSO, IMO)', 'NSTSE'],
    college_list: ['Focus on secondary school foundations before colleges']
  },
  {
    id: 'school-9-10',
    parent_id: 'school-students',
    title: 'Class 9 - 10 (Orientation)',
    slug: 'school-9-10',
    category: 'school',
    description: 'Identify your key interests. Understand the practical differences between Science, Commerce, and Humanities. Start micro-learning.',
    theme_color: 'cyan',
    skills_required: ['Time Management', 'Analytical Thinking', 'Problem Solving', 'General Knowledge'],
    motivation_guidance: 'Do not choose a stream because of peer pressure or parent expectations. Choose the subjects whose problems you enjoy solving.',
    ai_relevance: 'Learn basic spreadsheet automation, structured searching, and introductory Python programming.',
    roadmap_steps: ['Take aptitude interest tests', 'Master advanced algebra & scientific models', 'Learn basic Python', 'Speak with seniors in different streams'],
    exam_list: ['NTSE (National Talent Search Exam)', 'Board Exams preparation'],
    college_list: ['Identify leading integrated junior colleges/schools']
  },
  {
    id: 'school-11-12',
    parent_id: 'school-students',
    title: 'Class 11 - 12 (Specialization)',
    slug: 'school-11-12',
    category: 'school',
    description: 'Intense specialization. Pick your streams and begin preparation for national entrance examinations.',
    theme_color: 'cyan',
    roadmap_steps: ['Science Stream (PCM/PCB)', 'Commerce Stream', 'Humanities/Arts Stream', 'Vocational & Sports Streams']
  },

  // 🎒 SCHOOL 11-12 SUB-BRANCHES
  {
    id: 'school-science',
    parent_id: 'school-11-12',
    title: '🧪 Science Stream',
    slug: 'school-science',
    category: 'school',
    description: 'Deep dive into Physics, Chemistry, Mathematics, and Biology. Opens up technical, medical, and advanced scientific research fields.',
    theme_color: 'cyan',
    roadmap_steps: ['PCM (Physics, Chemistry, Math)', 'PCB (Physics, Chemistry, Biology)', 'PCMB (Integrated Science)']
  },
  {
    id: 'school-commerce',
    parent_id: 'school-11-12',
    title: '📈 Commerce Stream',
    slug: 'school-commerce',
    category: 'school',
    description: 'Understand the flow of money, business, and assets. Accounts, Business Studies, Economics, and Financial Markets.',
    theme_color: 'green',
    roadmap_steps: ['Chartered Accountancy (CA)', 'Company Secretary (CS)', 'Financial Analyst & Investment Banking', 'E-Commerce & Digital Banking'],
    exam_list: ['CA Foundation', 'CUET (Commerce)', 'SET', 'IPMAT'],
    college_list: ['SRCC - Delhi', 'LSR - Delhi', 'Christ University - Bangalore', 'St. Xavier\'s - Mumbai'],
    salary_range: '₹6,00,000 - ₹25,00,000 per annum',
    skills_required: ['Financial Modeling', 'Excel Automation', 'Taxation Laws', 'Corporate Economics']
  },
  {
    id: 'school-arts',
    parent_id: 'school-11-12',
    title: '🎨 Arts & Humanities',
    slug: 'school-arts',
    category: 'school',
    description: 'Explore human culture, behavioral science, design, and communication. History, Psychology, Political Science, and Sociology.',
    theme_color: 'purple',
    roadmap_steps: ['Clinical Psychology', 'Journalism & Mass Media', 'Product Design (NID/UCEED)', 'Digital Humanities & Sociology'],
    exam_list: ['CUET (Humanities)', 'UCEED', 'NID DAT', 'CLAT (Law)'],
    college_list: ['LSR - Delhi', 'St. Stephen\'s - Delhi', 'NID - Ahmedabad', 'NALSAR - Hyderabad'],
    salary_range: '₹5,00,000 - ₹18,00,000 per annum',
    skills_required: ['Creative Writing', 'Qualitative Research', 'UI/UX Design', 'Public Communication']
  },

  // 🎒 SCIENCE SUB-BRANCHES
  {
    id: 'pcm-careers',
    parent_id: 'school-science',
    title: '📐 PCM (Math Path)',
    slug: 'pcm-careers',
    category: 'school',
    description: 'The mathematical and engineering engine. Focuses on systems, structural logic, and computing.',
    theme_color: 'cyan',
    roadmap_steps: ['AI & Machine Learning Engineer', 'Robotics & Mechatronics', 'Cybersecurity Architect', 'Aeronautical & Space Sciences', 'Civil & Green Architecture']
  },
  {
    id: 'pcb-careers',
    parent_id: 'school-science',
    title: '🧬 PCB (Biology Path)',
    slug: 'pcb-careers',
    category: 'school',
    description: 'The biological and medical frontier. Focuses on life, health, organisms, and molecular discovery.',
    theme_color: 'cyan',
    roadmap_steps: ['Cardiologist / Neurosurgeon', 'Bioinformatics & Genetics Researcher', 'Biotechnology Product Developer', 'Neuropsychologist']
  },

  // 📐 PCM DETAIL LEAF NODES
  {
    id: 'ai-ml-engineer',
    parent_id: 'pcm-careers',
    title: '🧠 AI & ML Engineer',
    slug: 'ai-ml-engineer',
    category: 'school',
    description: 'Build neural networks, train large language models, and architect automated intelligent systems powering the future global economy.',
    future_scope: 'AI is the fastest growing domain in human history. 100% of modern tech applications are integrating deep learning models.',
    salary_range: '₹12,00,000 - ₹45,00,000+ per annum (High Growth)',
    skills_required: ['Python & PyTorch', 'Linear Algebra & Calculus', 'Data Engineering', 'Machine Learning Models', 'Deep Learning'],
    exam_list: ['JEE Main & Advanced', 'BITSAT', 'VITEEE', 'MHTCET'],
    college_list: ['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIIT Hyderabad', 'BITS Pilani'],
    ai_relevance: 'You are the architect of AI, not just a user. Learning GPU-accelerated computing and model alignment is crucial.',
    motivation_guidance: 'Do not just import libraries. Understand the core math—linear algebra, vectors, and optimization is where the magic happens.',
    audio_narration: 'Hello and welcome! In the AI engineering branch, you will learn the core foundations of machine learning, training neural networks, and deploying high-scale AI products. Start with Python and Linear Algebra in school!',
    roadmap_steps: ['Master Python & Data Libraries (NumPy, Pandas)', 'Learn Calculus & Linear Algebra thoroughly', 'Take standard ML certifications (Andrew Ng)', 'Build and train your first neural network on PyTorch', 'Participate in Kaggle competitions']
  },
  {
    id: 'cybersecurity-architect',
    parent_id: 'pcm-careers',
    title: '🛡️ Cybersecurity Architect',
    slug: 'cybersecurity-architect',
    category: 'school',
    description: 'Defend nation-state digital assets, global cloud infrastructure, and financial systems against hostile AI hacks and cyber attacks.',
    future_scope: 'As global assets move to cloud environments, securing databases and API end-points is seeing infinite demand with critical talent shortages.',
    salary_range: '₹8,00,000 - ₹35,00,000 per annum',
    skills_required: ['Ethical Hacking', 'Penetration Testing', 'Network Security', 'Linux Systems', 'Cryptography'],
    exam_list: ['JEE Main', 'CUET', 'ComedK'],
    college_list: ['IIT Kharagpur (Advanced Security)', 'IIIT Bangalore', 'DTU - Delhi', 'LPU'],
    ai_relevance: 'Hackers are using AI to build automated exploits. You must use defensive AI tools to detect anomalies in real-time.',
    motivation_guidance: 'Ethical hacking requires intense discipline and curiosity. Start by understanding how operating systems work at their deepest kernel level.',
    audio_narration: 'Welcome to the cybersecurity pathway. You will learn network administration, digital forensics, ethical hacking, and secure coding. Set up a local virtual lab and practice Linux commands!',
    roadmap_steps: ['Learn Linux & Bash Scripting', 'Study Network Protocols (TCP/IP, DNS)', 'Acquire CompTIA Security+ certification', 'Practice on TryHackMe or HackTheBox', 'Learn defensive AI automation tools']
  },

  // 🎨 CREATORS BRANCHES
  {
    id: 'youtuber',
    parent_id: 'creators',
    title: '🎥 YouTuber & Content Creator',
    slug: 'youtuber',
    category: 'creators',
    description: 'Master storytelling, thumbnail psychology, video pacing, SEO optimization, and audience retention modeling.',
    future_scope: 'The brand equity of an independent digital content creator matches corporate TV channels. Infinite monetization through ads, sponsorships, and direct D2C brands.',
    salary_range: '₹5,00,000 - ₹1,00,00,000+ per annum (High Variance)',
    skills_required: ['Scriptwriting', 'Video Editing (Premiere Pro)', 'Audience Analytics', 'Lighting & Audio Production', 'Negotiation & Monetization'],
    exam_list: ['No exam required. Portfolio is your degree.'],
    college_list: ['Self-Taught', 'Whistling Woods (Media)', 'FTII Pune (Direction)'],
    theme_color: 'orange',
    ai_relevance: 'AI tools accelerate production. Use AI for captioning, content research, image assets generation, and scripting.',
    motivation_guidance: 'Your first 50 videos will likely be poor, and that is absolutely fine. Focus on improving exactly one metric (hook, lighting, scripting) in every single upload.',
    audio_narration: 'Welcome to the creator academy. Consistency and narrative hook are your best friends. Master video editing, study successful hooks, and build an authentic brand.',
    roadmap_steps: ['Identify a highly specific interest/niche', 'Learn Premiere Pro or DaVinci Resolve', 'Write scripts with high retention structures', 'Record with optimal audio (mics matter most)', 'Upload consistently once a week for 6 months']
  },
  {
    id: 'game-developer',
    parent_id: 'creators',
    title: '🎮 Game Developer',
    slug: 'game-developer',
    category: 'creators',
    description: 'Combine code, interactive storytelling, and 3D graphics. Program game physics, build immersive soundscapes, and design levels.',
    future_scope: 'The gaming industry exceeds the film and music industries combined globally. Huge studios opening in India.',
    salary_range: '₹6,00,000 - ₹28,00,000 per annum',
    skills_required: ['C# & Unity Engine', 'C++ & Unreal Engine', '3D Modeling (Blender)', 'Game Physics', 'Level Design'],
    exam_list: ['JEE Main', 'NID DAT', 'UCEED'],
    college_list: ['ICAT Design & Media College', 'IIT Bombay (Interaction Design)', 'IIIT Hyderabad (Game Tech)'],
    theme_color: 'orange',
    ai_relevance: 'AI is generating textures, 3D meshes, and dialogue trees. Learn to integrate generative AI assets into Unity or Unreal engines.',
    motivation_guidance: 'Start small. Do not try to make GTA 6 on your first day. Build an exceptionally polished 2D game first, publish it, and iterate.',
    audio_narration: 'Game development is the ultimate fusion of math, physics, code, and art. Master Unity or Unreal, build small demo levels, and release them on itch.io!',
    roadmap_steps: ['Learn C# coding fundamentals', 'Download Unity Engine and complete absolute beginner guides', 'Create three simple cloned arcade games (Pong, Flappy Bird)', 'Learn Blender for basic 3D asset modeling', 'Publish your games on itch.io for feedback']
  },

  // 👨‍👩‍👧 PARENTS BRANCHES
  {
    id: 'child-psychology',
    parent_id: 'parents-guidance',
    title: '🧠 Child Psychology & Connection',
    slug: 'child-psychology',
    category: 'parents',
    description: 'Understand the neurological changes happening in teens. Switch from high-pressure policing to empathetic coaching.',
    theme_color: 'warm',
    skills_required: ['Active Listening', 'Non-violent Communication', 'Patience', 'Emotional Regulation'],
    motivation_guidance: 'Children do not listen to what you say; they watch what you do. Model healthy screen limits and emotional regulation at home.',
    ai_relevance: 'The academic landscape is changing. Traditional rote learning is obsolete because AI solves it. Fostering creative thinking is the parental gold standard.',
    audio_narration: 'Dear parents, understanding teen brain development is vital. Their emotional center is highly active while logic is still forming. Listen twice as much as you lecture.',
    roadmap_steps: ['Have 15 minutes of non-judgmental talk daily', 'Praise effort and consistency, not just test scores', 'Understand modern digital careers without immediate dismissal', 'Create a screen-free family zone at home']
  },
  {
    id: 'mobile-addiction',
    parent_id: 'parents-guidance',
    title: '📱 Managing Mobile & Gaming Addiction',
    slug: 'mobile-addiction',
    category: 'parents',
    description: 'Help your child build a conscious relationship with digital devices. Replace screen time with high-quality physical alternatives.',
    theme_color: 'warm',
    skills_required: ['Digital Hygiene Setting', 'Boundary Management', 'Empathetic Negotiation'],
    motivation_guidance: 'Dopamine feedback loops in social media are designed by world-class engineers. Do not blame your child for struggling; help them co-design system solutions.',
    ai_relevance: 'Use modern screen-time lock apps and co-create digital contracts with your child rather than stealthy surveillance.',
    audio_narration: 'Mobile addiction is a modern systemic challenge. Do not lock devices aggressively; instead, foster outdoor activities and co-design a screen-time schedule with clear boundaries.',
    roadmap_steps: ['Draft a written family "Device Usage Agreement"', 'Introduce active offline hobbies (sports, music)', 'Avoid using screens as emotional pacifiers', 'Use systemic router-level filters for safety']
  },

  // 👨‍🏫 TEACHERS BRANCHES
  {
    id: 'handling-introverts',
    parent_id: 'teachers-academy',
    title: '🤫 Fostering Introverted Students',
    slug: 'handling-introverts',
    category: 'teachers',
    description: 'Create safe learning spaces for quiet, deeply reflective students. Do not equate silence with lack of knowledge.',
    theme_color: 'blue',
    skills_required: ['Differentiated Assessment', 'Introvert Empathy', 'Quiet Grouping methods'],
    motivation_guidance: 'Quiet students possess deep internal processing powers. Encourage written thoughts, structured pair sharing, and quiet confidence.',
    ai_relevance: 'Use online response channels (slido, digital chat walls) so introverts can ask high-quality questions without public speaking anxiety.',
    audio_narration: 'Hello Educators. Quiet students often hold the most creative ideas. Design written exit slips and low-stakes small-group discussions to let them shine.',
    roadmap_steps: ['Stop using public cold-calling for grading', 'Implement "Think-Pair-Share" classroom discussions', 'Value written reflections as highly as public debates', 'Provide quiet workspaces during group work sessions']
  },
  {
    id: 'ai-in-classroom',
    parent_id: 'teachers-academy',
    title: '🤖 Integrating AI in Education',
    slug: 'ai-in-classroom',
    category: 'teachers',
    description: 'Leverage AI to create personalized study plans, draft lesson worksheets in seconds, and teach students ethical tool usage.',
    theme_color: 'blue',
    skills_required: ['AI Prompting', 'Custom GPT Lesson Planners', 'Ethical AI policy design'],
    motivation_guidance: 'AI is not a threat to teaching; it is the ultimate administrative assistant. Let AI handle the standard paperwork so you can handle the human heart.',
    ai_relevance: 'Use AI tools like ChatGPT or Canva to curate hyper-specific visual projects tailored to individual student interests.',
    audio_narration: 'Integrating AI inside your classroom saves you hundreds of hours of lesson planning. Learn how to draft personalized quizzes and encourage students to use AI for deep, custom research.',
    roadmap_steps: ['Use AI to generate 5 distinct difficulty levels of the same worksheet', 'Teach students how to spot AI hallucinations and verify facts', 'Create a custom GPT assistant for grading rubrics guidance', 'Shift assignments from standard essays to interactive classroom explanations']
  },

  // ⚡ SKILL LEARNERS BRANCHES
  {
    id: 'spoken-english',
    parent_id: 'skill-learners',
    title: '🗣️ Spoken English & Impactful Speaking',
    slug: 'spoken-english',
    category: 'skills',
    description: 'Master global communication. Break pronunciation barriers, speak with absolute clarity, and control stage anxiety in professional situations.',
    theme_color: 'purple',
    skills_required: ['Active Listening', 'Voice Modulation', 'Impression Management', 'Vocabulary Enrichment'],
    salary_range: 'Elevates base hiring packages by 50% to 150%',
    motivation_guidance: 'Flawless English is not a metric of intelligence, but it is an incredibly powerful career catalyst. Focus on clear, paced communication over fancy words.',
    ai_relevance: 'Use AI conversational apps to practice live speech, track grammar patterns, and receive immediate pronunciation grading.',
    audio_narration: 'Welcome to the Spoken English masterclass. To speak clearly, slow down your pace, record your voice reading articles daily, and practice active, daily conversations.',
    roadmap_steps: ['Speak and record a 2-minute daily speech outline', 'Practice active pacing: target 130 words per minute', 'Watch international news and shadow their speech patterns', 'Speak with AI voice models to practice business scenarios']
  },
  {
    id: 'nocode-ai-tools',
    parent_id: 'skill-learners',
    title: '⚙️ AI Tools & Automation Prompting',
    slug: 'nocode-ai-tools',
    category: 'skills',
    description: 'Become a 10x operator. Leverage ChatGPT, Midjourney, Make.com, and Zapier to build complete automations and digital assets without coding.',
    theme_color: 'purple',
    skills_required: ['Advanced Prompting', 'API Integration', 'Workflow Automation (Make/Zapier)', 'AI Visuals curation'],
    salary_range: '₹5,00,000 - ₹18,00,000 per annum (High Freelance Potential)',
    motivation_guidance: 'AI will not replace humans, but humans using AI will replace those who do not. Learn how to connect systems to perform work while you sleep.',
    ai_relevance: 'This is pure AI force multiplication. Mastery here makes you a highly sought-after digital transformation architect.',
    audio_narration: 'Welcome to AI automation. Learn how to construct multi-step prompts, connect APIs using Make.com, and build autonomous systems that parse, translate, and publish contents.',
    roadmap_steps: ['Master the Role-Context-Task-Constraint prompting structure', 'Build a automated email parser on Zapier', 'Generate commercial-grade visuals on Midjourney using style parameters', 'Build and host a custom AI chatbot using local knowledge bases']
  },

  // 👨‍🎓 GRADUATES BRANCHES
  {
    id: 'government-jobs',
    parent_id: 'graduates',
    title: '🏛️ Government Examinations (UPSC, SSC, Banking)',
    slug: 'government-jobs',
    category: 'graduates',
    description: 'Strategic roadmap for cracking major competitive civil services and state examinations. Includes systematic mental health management.',
    theme_color: 'indigo',
    skills_required: ['Extreme Discipline', 'Static GK & Current Affairs', 'Structured Essay Writing', 'Mental Resilience'],
    exam_list: ['UPSC CSE', 'SSC CGL', 'RBI Grade B', 'IBPS PO'],
    college_list: ['Open to all degree graduates'],
    salary_range: 'Government Pay Scales (High job security, power, and prestige)',
    motivation_guidance: 'Competitive exams are as much about mental stamina as they are about knowledge. Maintain an absolute "Plan B" skill set starting Year 3 of preparation to secure your mental health.',
    ai_relevance: 'Use AI to synthesize massive PDF notes, draft comparative analytical summaries of history/policies, and create infinite practice mock tests.',
    audio_narration: 'Entering the government exam pathway requires massive stamina. Plan your daily schedule, double down on active testing, and write standard answer templates weekly.',
    roadmap_steps: ['Thoroughly read and parse the exam syllabus', 'Limit resource lists (one source per subject, multiple revisions)', 'Solve 10 years of previous year papers', 'Write 2 mains exam practice answers daily and self-grade']
  },
  {
    id: 'freelancing-portfolio',
    parent_id: 'graduates',
    title: '💼 Global Freelancing & Resume Architect',
    slug: 'freelancing-portfolio',
    category: 'graduates',
    description: 'Acquire international clients on Upwork, Fiverr, and LinkedIn. Build high-converting single-page portfolios and clean resume layouts.',
    theme_color: 'indigo',
    skills_required: ['Cold Emailing', 'Proposal Writing', 'Project Management', 'Client Communication', 'SEO Portfolio creation'],
    salary_range: '₹4,00,000 - ₹30,00,000+ per annum (USD Earning potential)',
    motivation_guidance: 'Do not sell "design" or "code"—sell solutions. Tell the client exactly how your work will increase their revenue or save their operational time.',
    ai_relevance: 'Use AI to generate professional proposals, proofread contract documents, and write clean SEO landing page copy.',
    audio_narration: 'Welcome to global freelancing. Optimize your profiles, show high-fidelity case studies showing before-and-after results, and send highly customized, short proposals.',
    roadmap_steps: ['Identify one marketable skill and build 3 spec projects', 'Create a clean, one-page portfolio site showing visual case studies', 'Build a professional LinkedIn profile with weekly educational posts', 'Send 5 high-converting cold pitches daily targeting specific business weaknesses']
  }
];

// Combine all nodes for easy lookup
export const ALL_NODES = [...ROOT_NODES, ...CHILD_NODES];

/**
 * Fetch a specific node by its ID or slug. Supports mock fallback out of the box.
 */
export async function getCareerNode(idOrSlug: string): Promise<CareerNode | null> {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('career_nodes')
        .select('*')
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .single();
      
      if (data && !error) {
        return {
          ...data,
          skills_required: data.skills_required || [],
          exam_list: data.exam_list || [],
          college_list: data.college_list || [],
          roadmap_steps: data.roadmap_steps || []
        };
      }
    }
  } catch (err) {
    console.error('Supabase query failed, falling back to mock data', err);
  }

  // Fallback to high-fidelity mock data
  const node = ALL_NODES.find(n => n.id === idOrSlug || n.slug === idOrSlug);
  return node || null;
}

/**
 * Get children nodes for a given parent ID.
 */
export async function getChildrenNodes(parentId: string): Promise<CareerNode[]> {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('career_nodes')
        .select('*')
        .eq('parent_id', parentId);
      
      if (data && !error) {
        return data;
      }
    }
  } catch (err) {
    console.error('Supabase children query failed, falling back to mock data', err);
  }

  return ALL_NODES.filter(n => n.parent_id === parentId);
}

/**
 * High fidelity mock job listings for the Job Portal
 */
export const MOCK_JOBS: JobPosting[] = [
  {
    id: 'job-1',
    title: 'Junior AI Engineer (Generative Systems)',
    company: 'Sir Ganguly Academics & AI Lab',
    location: 'Bangalore, India (Hybrid)',
    salary: '₹12,00,000 - ₹18,00,000 per annum',
    type: 'Full-time',
    description: 'We are seeking an enthusiastic AI engineer passionate about building large language model pipelines, fine-tuning lightweight neural networks, and deploying high-agency autonomous agents. You will work closely with Sir Ganguly to build revolutionary educational tech.',
    requirements: [
      'Strong proficiency in Python, PyTorch, and Hugging Face Transformers.',
      'Experience with LangChain, LlamaIndex, or semantic vector search databases (Pinecone, PGVector).',
      'Solid foundations in Calculus, Linear Algebra, and Deep Learning mechanics.',
      'Ability to build clean API endpoints using FastAPI or Node.js.'
    ],
    apply_url: 'https://career.sirganguly.com/apply/ai-engineer'
  },
  {
    id: 'job-2',
    title: 'Senior Frontend Engineer (Creative Web)',
    company: 'GrowthVerse Digital Ecosystem',
    location: 'Remote (India)',
    salary: '₹16,00,000 - ₹24,00,000 per annum',
    type: 'Full-time',
    description: 'Join us to build state-of-the-art interactive digital experiences. You will design fluid, premium React Flow architectures, complex Framer Motion transitions, and high-performance canvas systems that make education look like a sci-fi universe.',
    requirements: [
      '3+ years of experience with Next.js, React, and TypeScript.',
      'Expert level mastery in Framer Motion, GSAP, and Tailwind CSS.',
      'Familiarity with visual engines like React Flow, D3, or Three.js.',
      'Obsessive attention to detail regarding fluid FPS transitions, layout shifts, and mobile touch zones.'
    ],
    apply_url: 'https://career.sirganguly.com/apply/frontend'
  },
  {
    id: 'job-3',
    title: 'Social Media Storyteller & Creator',
    company: 'Sir Ganguly Media House',
    location: 'Kolkata, India (On-site)',
    salary: '₹6,00,000 - ₹9,50,000 per annum',
    type: 'Full-time',
    description: 'We want a high-creative video editor, scripting architect, and YouTube visual designer. You will script and direct educational reels, long-form guides, and manage digital brand narratives reaching millions of Indian students.',
    requirements: [
      'Flawless mastery of Premiere Pro, DaVinci Resolve, or After Effects.',
      'Proven expertise in pacing, visual hooks, and digital storytelling.',
      'Ability to translate complex career information into highly emotional, engaging vertical videos.',
      'Strong portfolio showing successful reels, shorts, or long-form videos.'
    ],
    apply_url: 'https://career.sirganguly.com/apply/storyteller'
  },
  {
    id: 'job-4',
    title: 'AI Automation & No-Code Intern',
    company: 'Sir Ganguly Ventures',
    location: 'Remote',
    salary: '₹25,00,000 - ₹35,00,000 per month (Internship Stipend)',
    type: 'Contract',
    description: 'Looking for a fast learner to build automated data parsers, connect APIs via Make.com, build custom GPTs, and support operations using generative tools.',
    requirements: [
      'Intermediate experience with Zapier, Make.com, or active automated workflows.',
      'Strong logical writing and prompt engineering capabilities.',
      'Curiosity for AI developments and zero-code builders.',
      'Excellent self-management skills in remote settings.'
    ],
    apply_url: 'https://career.sirganguly.com/apply/nocode'
  }
];

/**
 * Fetch job listings.
 */
export async function getJobListings(): Promise<JobPosting[]> {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data && !error && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.error('Supabase jobs query failed, falling back to mock data', err);
  }
  
  return MOCK_JOBS;
}
