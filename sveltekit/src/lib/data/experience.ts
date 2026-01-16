export interface Experience {
	id: string;
	company: string;
	position: string;
	location: string;
	startDate: string;
	endDate: string;
	highlights: string[];
	skills: string[];
	achievements?: string[];
}

export const experiences: Experience[] = [
	{
		id: 'rise-backend',
		company: 'Research Industrial Systems Engineering (RISE)',
		position: 'Backend Developer',
		location: 'Leipzig, Germany',
		startDate: '2025-06',
		endDate: 'present',
		highlights: [
			'Manage infrastructure, IAM, and backend development using Terragrunt, Java, Terraform, and Docker',
			'Build proof of concepts for new initiatives',
			'Work on infrastructure automation and deployment pipelines'
		],
		skills: ['Java', 'Terragrunt', 'Terraform', 'Docker', 'Keycloak', 'IAM', 'CI/CD'],
		achievements: [
			'Led infrastructure automation initiatives',
			'Implemented IAM solutions using Keycloak'
		]
	},
	{
		id: 'idnow-tse',
		company: 'IDnow',
		position: 'Technical Services Engineer',
		location: 'Munich, Germany',
		startDate: '2022-08',
		endDate: '2025-06',
		highlights: [
			'Managed Jira boards for technical issues within SLA-based priority system',
			'Performed Level 3 engineering tasks and provided pre- and post-sales technical support',
			'Maintained and developed OCR engines, delivered RCA statements for stakeholders',
			'Supported clients with SDK installations for Android and iOS platforms',
			'Wrote lambda functions for internal configuration system and fixed HOCON (Java) syntax errors',
			'Monitored and investigated errors using Graylog, Docker logs, and Grafana',
			'Developed internal scripts in Bash, Python, and PowerShell',
			'Created MySQL query templates and managed multiple Jira boards',
			'Coordinated technical feature requests and participated in customer escalation meetings'
		],
		skills: ['Java', 'Python', 'Bash', 'PowerShell', 'MySQL', 'Graylog', 'Grafana', 'Docker', 'OCR', 'HOCON', 'Lambda Functions'],
		achievements: [
			'Reduced SLA breach rate through proactive monitoring',
			'Developed OCR engine improvements increasing accuracy',
			'Created automation scripts reducing manual work'
		]
	},
	{
		id: 'idnow-fraud',
		company: 'IDnow',
		position: 'Fraud Prevention Specialist',
		location: 'Leipzig, Germany',
		startDate: '2021-10',
		endDate: '2022-08',
		highlights: [
			'Created real-time dashboard for fraud cases with data from multiple sources',
			'Set up OCR Tesseract for big data analysis',
			'Trained new members during onboarding phase',
			'Worked with security print experts from Interpol and Gemalto',
			'Prepared training materials for Fraud Prevention Specialists',
			'Participated in team that introduced internal AML system',
			'Served as technical contact point and conducted quarterly fraud analyses'
		],
		skills: ['OCR', 'Tesseract', 'Data Analysis', 'AML', 'Fraud Detection', 'Dashboard Development'],
		achievements: [
			'Built real-time fraud monitoring dashboard',
			'Collaborated with Interpol security experts',
			'Helped implement AML compliance system'
		]
	},
	{
		id: 'idnow-ident',
		company: 'IDnow',
		position: 'Ident Specialist',
		location: 'Leipzig, Germany',
		startDate: '2021-03',
		endDate: '2021-09',
		highlights: [
			'Handled inbound requests and guided customers through identification process',
			'Performed manual reviews and managed night shifts with on-duty calls',
			'Reviewed and analyzed customer data to ensure compliance with requirements',
			'Collaborated with technical support team to resolve issues promptly',
			'Handled sensitive information with high level of discretion and professionalism'
		],
		skills: ['Customer Service', 'Identity Verification', 'Compliance', 'Data Analysis'],
		achievements: [
			'Maintained high customer satisfaction ratings',
			'Progressed to Fraud Prevention role within 6 months'
		]
	},
	{
		id: 'invoice-ceo',
		company: 'In Voice d.o.o.',
		position: 'CEO & Founder',
		location: 'Mostar, Bosnia and Herzegovina',
		startDate: '2019-03',
		endDate: '2020-06',
		highlights: [
			'Founded IT and marketing solutions company with initial capital of \u20AC500',
			'Registered company in Mostar under MBS number 58-01-0029-19',
			'Established employee-owned company structure outlined in internal statute',
			'Cultivated exceptional talent from within rather than external hiring',
			'Built teams that continue to thrive and make impact'
		],
		skills: ['Entrepreneurship', 'Business Development', 'Team Leadership', 'Strategic Planning'],
		achievements: [
			'Successfully founded and registered company',
			'Built sustainable employee-owned structure',
			'Developed teams that continue to thrive'
		]
	},
	{
		id: 'mediaone-consultant',
		company: 'Media One',
		position: 'IT Consultant',
		location: 'Mostar, Bosnia and Herzegovina',
		startDate: '2018-08',
		endDate: '2019-03',
		highlights: [
			'Provided consulting and maintenance for VoIP systems',
			'Optimized hardware costs by leveraging optical fiber networks',
			'Built sales CRM using Google Apps with JSON, JavaScript, Python, C++, SQL',
			'Developed scalable invoice factoring system and automation scripts',
			'Secured investments from Berlin and Zagreb',
			'Built custom OCR endpoint with Beowulf cluster for invoice processing',
			'Developed custom dictionary for OCR engine and assembled distributed system from multiple machines'
		],
		skills: ['VoIP', 'CRM Development', 'Python', 'C++', 'SQL', 'JavaScript', 'OCR', 'Distributed Systems', 'Beowulf Cluster'],
		achievements: [
			'Secured international investments',
			'Built distributed OCR system with Beowulf cluster',
			'Developed custom CRM solution'
		]
	}
];

export interface Education {
	institution: string;
	area: string;
	degree: string;
	startDate: string;
	endDate: string;
	highlights: string[];
}

export const education: Education[] = [
	{
		institution: 'University of Mostar',
		area: 'Information Technology',
		degree: "Bachelor's degree (In Progress)",
		startDate: '2018',
		endDate: 'present',
		highlights: ['Focus on databases, data science, and financial analysis']
	}
];

export interface Certification {
	name: string;
	issuer: string;
}

export const certifications: Certification[] = [
	{ name: 'Python Essential Training', issuer: 'LinkedIn Learning' },
	{ name: 'Reactive Architecture - Introduction to Reactive Systems', issuer: 'Lightbend Academy' },
	{ name: 'OpenEDG Python Institute - Programming with Python', issuer: 'Professional Certificate' },
	{ name: 'Java Foundations by JetBrains', issuer: 'Professional Certificate' },
	{ name: 'Jira Fundamentals Badge', issuer: 'Atlassian' }
];

export interface Project {
	name: string;
	description: string;
	url?: string;
	technologies?: string[];
}

export const projects: Project[] = [
	{
		name: 'LabanCompiler',
		description: 'Computer vision tool converting video to Labanotation dance notation',
		url: 'https://github.com/koke1997/LaBanCompiler',
		technologies: ['Python', 'Computer Vision', 'Pose Detection']
	},
	{
		name: 'ScalaCast',
		description: 'Distributed video streaming server with peer discovery and fault tolerance',
		url: 'https://github.com/koke1997/ScalaCast',
		technologies: ['Scala', 'Distributed Systems', 'P2P']
	},
	{
		name: 'Terraform MCP Server',
		description: 'Model Context Protocol server for Terraform/IaC automation',
		url: 'https://github.com/koke1997/terraform-mcp-server',
		technologies: ['Go', 'Terraform', 'MCP']
	},
	{
		name: 'Plane MCP Server',
		description: 'MCP server for Plane project management integration',
		url: 'https://github.com/koke1997/plane-mcp-server',
		technologies: ['TypeScript', 'MCP', 'API Integration']
	},
	{
		name: 'Keycloak Terragrunt Forge',
		description: 'Keycloak CI/CD automation toolkit with React frontend',
		url: 'https://github.com/koke1997/keycloak-terragrunt-forge',
		technologies: ['TypeScript', 'React', 'Terragrunt', 'Keycloak']
	},
	{
		name: 'Guska',
		description: 'Extensible AI agent built with Rust',
		url: 'https://github.com/koke1997/guska',
		technologies: ['Rust', 'AI', 'Agent']
	}
];

export function getExperienceById(id: string): Experience | undefined {
	return experiences.find((exp) => exp.id === id);
}

export function formatDateRange(startDate: string, endDate: string): string {
	const formatDate = (date: string) => {
		if (date === 'present') return 'Present';
		const [year, month] = date.split('-');
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		return month ? `${months[parseInt(month) - 1]} ${year}` : year;
	};
	return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}
