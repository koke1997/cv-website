export interface SkillRepo {
	name: string;
	url: string;
}

export interface Skill {
	name: string;
	category: string;
	repos?: SkillRepo[];
	homepageUrl?: string;
	note?: string;
}

export const skillCategories = [
	'Programming Languages',
	'Infrastructure & DevOps',
	'Databases',
	'Monitoring',
	'Web Technologies',
	'Security & Identity',
	'AI & Computer Vision',
	'Testing & Quality'
] as const;

export const skills: Skill[] = [
	// Programming Languages
	{
		name: 'Python',
		category: 'Programming Languages',
		repos: [
			{ name: 'bankarstvo', url: 'https://github.com/koke1997/bankarstvo' },
			{ name: 'rlm', url: 'https://github.com/koke1997/rlm' },
			{ name: 'LaBanCompiler', url: 'https://github.com/koke1997/LaBanCompiler' }
		]
	},
	{
		name: 'TypeScript',
		category: 'Programming Languages',
		repos: [
			{ name: 'plane-mcp-server', url: 'https://github.com/koke1997/plane-mcp-server' },
			{ name: 'keycloak-terragrunt-forge', url: 'https://github.com/koke1997/keycloak-terragrunt-forge' }
		]
	},
	{
		name: 'Go',
		category: 'Programming Languages',
		repos: [
			{ name: 'terraform-mcp-server', url: 'https://github.com/koke1997/terraform-mcp-server' }
		]
	},
	{
		name: 'Scala',
		category: 'Programming Languages',
		repos: [
			{ name: 'ScalaCast', url: 'https://github.com/koke1997/ScalaCast' }
		]
	},
	{
		name: 'Java',
		category: 'Programming Languages',
		repos: [
			{ name: 'java-design-patterns-practice', url: 'https://github.com/koke1997/java-design-patterns-practice' }
		]
	},
	{
		name: 'Rust',
		category: 'Programming Languages',
		repos: [
			{ name: 'guska', url: 'https://github.com/koke1997/guska' }
		]
	},
	{
		name: 'Dart',
		category: 'Programming Languages',
		repos: [
			{ name: 'ipquery-dart', url: 'https://github.com/koke1997/ipquery-dart' }
		]
	},
	{
		name: 'JavaScript',
		category: 'Programming Languages',
		homepageUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
	},
	{
		name: 'C++',
		category: 'Programming Languages',
		homepageUrl: 'https://isocpp.org/'
	},
	{
		name: 'Vue.js',
		category: 'Programming Languages',
		homepageUrl: 'https://vuejs.org/',
		note: 'Vue 3 Composition API'
	},

	// Infrastructure & DevOps
	{
		name: 'Terraform',
		category: 'Infrastructure & DevOps',
		repos: [
			{ name: 'terraform-mcp-server', url: 'https://github.com/koke1997/terraform-mcp-server' }
		],
		homepageUrl: 'https://www.terraform.io/'
	},
	{
		name: 'Terragrunt',
		category: 'Infrastructure & DevOps',
		repos: [
			{ name: 'keycloak-terragrunt-forge', url: 'https://github.com/koke1997/keycloak-terragrunt-forge' }
		],
		homepageUrl: 'https://terragrunt.gruntwork.io/'
	},
	{
		name: 'Ansible',
		category: 'Infrastructure & DevOps',
		homepageUrl: 'https://www.ansible.com/'
	},
	{
		name: 'Docker',
		category: 'Infrastructure & DevOps',
		homepageUrl: 'https://www.docker.com/'
	},
	{
		name: 'Linux',
		category: 'Infrastructure & DevOps',
		homepageUrl: 'https://www.linux.org/'
	},
	{
		name: 'Git',
		category: 'Infrastructure & DevOps',
		homepageUrl: 'https://git-scm.com/'
	},
	{
		name: 'GitHub Actions',
		category: 'Infrastructure & DevOps',
		homepageUrl: 'https://github.com/features/actions',
		note: 'CI/CD pipelines'
	},
	{
		name: 'AWS',
		category: 'Infrastructure & DevOps',
		homepageUrl: 'https://aws.amazon.com/',
		note: 'Lambda, S3, EC2'
	},
	{
		name: 'Kubernetes',
		category: 'Infrastructure & DevOps',
		homepageUrl: 'https://kubernetes.io/'
	},

	// Databases
	{
		name: 'MySQL',
		category: 'Databases',
		homepageUrl: 'https://www.mysql.com/'
	},
	{
		name: 'PostgreSQL',
		category: 'Databases',
		homepageUrl: 'https://www.postgresql.org/'
	},
	{
		name: 'MongoDB',
		category: 'Databases',
		homepageUrl: 'https://www.mongodb.com/'
	},
	{
		name: 'MariaDB',
		category: 'Databases',
		homepageUrl: 'https://mariadb.org/'
	},

	// Monitoring
	{
		name: 'Grafana',
		category: 'Monitoring',
		homepageUrl: 'https://grafana.com/'
	},
	{
		name: 'Prometheus',
		category: 'Monitoring',
		homepageUrl: 'https://prometheus.io/'
	},
	{
		name: 'Graylog',
		category: 'Monitoring',
		homepageUrl: 'https://www.graylog.org/'
	},
	{
		name: 'ELK Stack',
		category: 'Monitoring',
		homepageUrl: 'https://www.elastic.co/elastic-stack'
	},

	// Web Technologies
	{
		name: 'REST APIs',
		category: 'Web Technologies',
		homepageUrl: 'https://restfulapi.net/'
	},
	{
		name: 'WebSocket',
		category: 'Web Technologies',
		homepageUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API'
	},
	{
		name: 'React',
		category: 'Web Technologies',
		repos: [
			{ name: 'keycloak-terragrunt-forge', url: 'https://github.com/koke1997/keycloak-terragrunt-forge' }
		],
		note: 'with shadcn/ui'
	},
	{
		name: 'SvelteKit',
		category: 'Web Technologies',
		homepageUrl: 'https://kit.svelte.dev/'
	},
	{
		name: 'Flask',
		category: 'Web Technologies',
		repos: [
			{ name: 'bankarstvo', url: 'https://github.com/koke1997/bankarstvo' }
		],
		homepageUrl: 'https://flask.palletsprojects.com/',
		note: 'SQLAlchemy, SocketIO, Login'
	},
	{
		name: 'Play Framework',
		category: 'Web Technologies',
		repos: [
			{ name: 'ScalaCast', url: 'https://github.com/koke1997/ScalaCast' }
		],
		homepageUrl: 'https://www.playframework.com/',
		note: 'Scala-based web framework'
	},

	// Security & Identity
	{
		name: 'Keycloak',
		category: 'Security & Identity',
		repos: [
			{ name: 'keycloak-terragrunt-forge', url: 'https://github.com/koke1997/keycloak-terragrunt-forge' }
		],
		homepageUrl: 'https://www.keycloak.org/'
	},
	{
		name: 'OpenID Connect',
		category: 'Security & Identity',
		homepageUrl: 'https://openid.net/connect/'
	},
	{
		name: 'IAM',
		category: 'Security & Identity',
		note: 'Identity & Access Management'
	},

	// AI & Computer Vision
	{
		name: 'PyTorch',
		category: 'AI & Computer Vision',
		repos: [
			{ name: 'LaBanCompiler', url: 'https://github.com/koke1997/LaBanCompiler' }
		],
		homepageUrl: 'https://pytorch.org/'
	},
	{
		name: 'Hugging Face',
		category: 'AI & Computer Vision',
		repos: [
			{ name: 'guska', url: 'https://github.com/koke1997/guska' }
		],
		homepageUrl: 'https://huggingface.co/',
		note: 'Transformers, LLM integration'
	},
	{
		name: 'YOLO',
		category: 'AI & Computer Vision',
		repos: [
			{ name: 'LaBanCompiler', url: 'https://github.com/koke1997/LaBanCompiler' }
		],
		homepageUrl: 'https://ultralytics.com/',
		note: 'Ultralytics object detection'
	},
	{
		name: 'MediaPipe',
		category: 'AI & Computer Vision',
		repos: [
			{ name: 'LaBanCompiler', url: 'https://github.com/koke1997/LaBanCompiler' }
		],
		homepageUrl: 'https://mediapipe.dev/',
		note: 'Pose detection & tracking'
	},
	{
		name: 'OpenAI API',
		category: 'AI & Computer Vision',
		repos: [
			{ name: 'guska', url: 'https://github.com/koke1997/guska' }
		],
		homepageUrl: 'https://openai.com/api/'
	},
	{
		name: 'MCP Servers',
		category: 'AI & Computer Vision',
		repos: [
			{ name: 'plane-mcp-server', url: 'https://github.com/koke1997/plane-mcp-server' },
			{ name: 'terraform-mcp-server', url: 'https://github.com/koke1997/terraform-mcp-server' },
			{ name: 'terragrunt-docs', url: 'https://github.com/koke1997/terragrunt-docs' }
		],
		note: 'Model Context Protocol - 3 servers built'
	},
	{
		name: 'AI Agents',
		category: 'AI & Computer Vision',
		repos: [
			{ name: 'guska', url: 'https://github.com/koke1997/guska' },
			{ name: 'OmniParser', url: 'https://github.com/koke1997/OmniParser' }
		],
		note: 'Autonomous AI systems'
	},

	// Testing & Quality
	{
		name: 'Playwright',
		category: 'Testing & Quality',
		homepageUrl: 'https://playwright.dev/'
	}
];

export function getSkillsByCategory(category: string): Skill[] {
	return skills.filter((skill) => skill.category === category);
}

export function getSkillUrl(skill: Skill): string | undefined {
	if (skill.repos && skill.repos.length > 0) {
		return skill.repos[0].url;
	}
	return skill.homepageUrl;
}
