/**
 * Curated Projects Configuration & Ignored Repositories
 * 
 * Defines ignored repository keys and curated developer showcase projects.
 */

export const IGNORED_REPO_KEYS = [
  'tamizhcode',
  'myportfolio',
  'problemsolving',
  'problemsloving'
];

export const isIgnoredRepo = (repoName) => {
  if (!repoName) return false;
  const cleanKey = repoName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return IGNORED_REPO_KEYS.includes(cleanKey);
};

export const privateProjects = [
  {
    id: 'p-mapleads',
    name: 'MAPLEADS',
    title: 'MAPLEADS',
    body: 'A Lead Generation & Geolocation Mapping Application designed for discovering, filtering, and organizing business leads efficiently.',
    tags: ['JavaScript', 'React.js', 'Maps API', 'REST API'],
    isPrivate: false,
    htmlUrl: 'https://github.com/Tamizh-code/MAPLEADS',
    readmeContent: `
      <h2>MAPLEADS</h2>
      <p>An intelligent web application built for location-based lead discovery, business mapping analytics, and lead capture workflows.</p>
      <h3>Key Features & Architecture</h3>
      <ul>
        <li><strong>Geolocation Mapping:</strong> Interactive map interface for locating target business leads and prospective clients.</li>
        <li><strong>Lead Management Workflow:</strong> Filter, organize, and track lead conversion statuses in real-time.</li>
        <li><strong>API Integration:</strong> Clean integration with mapping services and RESTful data pipelines.</li>
      </ul>
    `
  },
  {
    id: 'p-stms',
    name: 'STMS-Smart-Tourist-Management-System',
    title: 'STMS Smart Tourist Management System',
    body: 'Built a comprehensive Smart Tourism Management System that allows users to explore destinations, plan trips, and manage travel details in a smooth workflow.',
    tags: ['JavaScript', 'Spring Boot', 'React.js', 'MySQL', 'REST API'],
    isPrivate: true,
    htmlUrl: 'https://github.com/Tamizh-code/STMS-Smart-Tourist-Management-System',
    readmeContent: `
      <h2>STMS Smart Tourist Management System</h2>
      <p><strong>Private Repository</strong></p>
      <p>A full-stack enterprise travel and itinerary planning platform designed to handle customer bookings, destination discovery, and dynamic travel package selection.</p>
      <h3>Key Architecture & Features</h3>
      <ul>
        <li><strong>Backend Architecture:</strong> Modular Spring Boot REST APIs with Spring Data JPA & Hibernate ORM.</li>
        <li><strong>Frontend Interface:</strong> Modern React SPA featuring interactive destination cards, search filtering, and user authentication workflows.</li>
        <li><strong>Database Layer:</strong> Relational trip records, payment tracking, and booking logs.</li>
        <li><strong>Security:</strong> Role-based access control (RBAC) separating administrative package management from user bookings.</li>
      </ul>
    `
  },
  {
    id: 'p-hms',
    name: 'Hotel-Management',
    title: 'Hotel Management',
    body: 'Developed a Hotel Management System to streamline room bookings, customer record management, billing, and room availability tracking.',
    tags: ['JavaScript', 'Spring Boot', 'MySQL', 'MVC Architecture'],
    isPrivate: true,
    htmlUrl: 'https://github.com/Tamizh-code/Hotel-Management',
    readmeContent: `
      <h2>Hotel Management</h2>
      <p>A robust application engineered for handling hotel reservations, customer check-in/check-out processing, room inventory, and automated invoice calculation.</p>
      <h3>Key Architecture & Features</h3>
      <ul>
        <li><strong>Layered Architecture:</strong> Controller, Service, Repository design pattern.</li>
        <li><strong>Inventory Engine:</strong> Real-time room availability tracking preventing double-booking race conditions.</li>
        <li><strong>Billing Subsystem:</strong> Automated bill generation calculating daily rates, add-on services, and tax.</li>
      </ul>
    `
  },
  {
    id: 'p-spacyn',
    name: 'Spacyn',
    title: 'Spacyn',
    body: 'A cross-platform mobile & web application designed for dynamic workspace reservation and space management.',
    tags: ['Dart', 'Flutter', 'Firebase'],
    isPrivate: false,
    htmlUrl: 'https://github.com/Tamizh-code/Spacyn',
    readmeContent: `
      <h2>Spacyn</h2>
      <p>A modern Dart & Flutter application for space reservation, desktop management, and interactive room booking.</p>
      <h3>Key Features</h3>
      <ul>
        <li><strong>Cross-Platform UI:</strong> Built with Dart & Flutter for smooth mobile and desktop rendering.</li>
        <li><strong>Interactive Booking:</strong> Real-time desk and room availability checking.</li>
      </ul>
    `
  },
  {
    id: 'p-banking',
    name: 'Banking-System',
    title: 'Banking System',
    body: 'Developed a secure Banking System application for managing user accounts, money transfers, transaction history, and account authentication.',
    tags: ['Java', 'Spring Boot', 'MySQL', 'Security'],
    isPrivate: true,
    htmlUrl: 'https://github.com/Tamizh-code/Banking-System',
    readmeContent: `
      <h2>Banking System</h2>
      <p>A secure Java backend application simulating online banking operations including deposit, withdrawal, fund transfer, and transaction history audit logs.</p>
      <h3>Key Features</h3>
      <ul>
        <li><strong>Account Management:</strong> Create and manage checking, savings, and credit accounts.</li>
        <li><strong>Secure Transactions:</strong> ACID compliant database transfers ensuring zero data loss.</li>
        <li><strong>Audit Logging:</strong> Timestamped record of every transaction attempt.</li>
      </ul>
    `
  },
  {
    id: 'p-processflow',
    name: 'Process-Flow-App',
    title: 'Process Flow App',
    body: 'Developed an application workflow system enabling users to submit requests, track approval status through process stages, and receive notifications.',
    tags: ['JavaScript', 'React.js', 'REST APIs'],
    isPrivate: true,
    htmlUrl: 'https://github.com/Tamizh-code/Process-Flow-App',
    readmeContent: `
      <h2>Process Flow App</h2>
      <p>An enterprise workflow application designed for managing multi-stage approval processes, request tracking, and task delegation.</p>
      <h3>Key Features</h3>
      <ul>
        <li><strong>Workflow Engine:</strong> Step-by-step state machine tracking process progression.</li>
        <li><strong>Dashboard UI:</strong> Graphical view of pending and approved requests.</li>
      </ul>
    `
  },
  {
    id: 'p-hospital',
    name: 'Hospital-Web',
    title: 'Hospital Web',
    body: 'A responsive hospital portal website providing doctor appointment booking, department navigation, and emergency contact services.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    isPrivate: false,
    htmlUrl: 'https://github.com/Tamizh-code/Hospital-Web',
    readmeContent: `
      <h2>Hospital Web</h2>
      <p>A clean, accessible web portal designed for healthcare facilities, patient information, and doctor scheduling.</p>
      <h3>Key Features</h3>
      <ul>
        <li><strong>Appointment Booking:</strong> Patient booking form with department selection.</li>
        <li><strong>Responsive Design:</strong> Mobile-friendly layout optimized for fast patient emergency lookup.</li>
      </ul>
    `
  },
  {
    id: 'p-aws-3tier-terraform',
    name: 'aws-3tier-terraform-deployment',
    title: 'AWS 3-Tier Terraform Deployment',
    body: 'Infrastructure as Code (IaC) deployment for a highly available, multi-tier AWS architecture using Terraform.',
    tags: ['HCL', 'Terraform', 'AWS', 'DevOps', 'Cloud'],
    isPrivate: true,
    htmlUrl: 'https://github.com/Tamizh-code/aws-3tier-terraform-deployment',
    readmeContent: `
      <h2>AWS 3-Tier Terraform Deployment</h2>
      <p><strong>Private Repository</strong></p>
      <p>An automated Infrastructure as Code (IaC) project deploying a secure, multi-tier cloud infrastructure on Amazon Web Services (AWS) using HashiCorp Terraform.</p>
      <h3>Key Features & Architecture</h3>
      <ul>
        <li><strong>VPC & Networking:</strong> Configures multi-AZ VPC, public/private subnets, Internet Gateway, and NAT Gateways.</li>
        <li><strong>3-Tier Isolation:</strong> Web tier (ALB/EC2), Application tier (Internal ALB/EC2), and Database tier (RDS Multi-AZ).</li>
        <li><strong>Security & IAM:</strong> Least-privilege IAM roles and granular Security Groups for intra-tier communication.</li>
      </ul>
    `
  },
  {
    id: 'p-doctor-appointment-assistant',
    name: 'Doctor-Appointment-Assistant',
    title: 'Doctor Appointment Assistant',
    body: 'An intelligent healthcare assistant application for managing doctor appointments, patient schedules, and medical consultations.',
    tags: ['Python', 'Healthcare', 'REST API'],
    isPrivate: true,
    htmlUrl: 'https://github.com/Tamizh-code/Doctor-Appointment-Assistant',
    readmeContent: `
      <h2>Doctor Appointment Assistant</h2>
      <p><strong>Private Repository</strong></p>
      <p>A smart medical scheduling assistant application designed to streamline doctor-patient appointments, automated reminders, and consultation management.</p>
      <h3>Key Features & Architecture</h3>
      <ul>
        <li><strong>Smart Scheduling:</strong> Intelligent appointment booking algorithm preventing overlapping schedule slots.</li>
        <li><strong>Patient Assistant:</strong> Interactive consultation workflows and patient medical history tracking.</li>
        <li><strong>Backend Pipeline:</strong> Clean modular Python architecture with RESTful endpoints.</li>
      </ul>
    `
  }
];
