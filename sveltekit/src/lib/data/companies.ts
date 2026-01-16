export interface Company {
	name: string;
	shortName: string;
	logo?: string;
	url?: string;
	color: string;
}

export const companies: Record<string, Company> = {
	'Research Industrial Systems Engineering (RISE)': {
		name: 'Research Industrial Systems Engineering (RISE)',
		shortName: 'RISE',
		url: 'https://2025.2037.to/de/',
		color: '#D35233'
	},
	'IDnow': {
		name: 'IDnow',
		shortName: 'IDnow',
		url: 'https://www.idnow.io/',
		color: '#00A3E0'
	},
	'In Voice d.o.o.': {
		name: 'In Voice d.o.o.',
		shortName: 'In Voice',
		url: undefined,
		color: '#4CAF50'
	},
	'Media One': {
		name: 'Media One',
		shortName: 'Media One',
		url: undefined,
		color: '#FF9800'
	}
};

export function getCompany(name: string): Company | undefined {
	// Try exact match first
	if (companies[name]) {
		return companies[name];
	}
	// Try partial match
	const key = Object.keys(companies).find(
		(k) => k.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(k.toLowerCase())
	);
	return key ? companies[key] : undefined;
}

export function getCompanyInitial(name: string): string {
	const company = getCompany(name);
	if (company) {
		return company.shortName.charAt(0).toUpperCase();
	}
	return name.charAt(0).toUpperCase();
}
