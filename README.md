# CV - Ivan Kokalovic

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/koke1997/cv-website)](https://github.com/koke1997/cv-website/releases)
[![GitHub Package](https://img.shields.io/github/v/release/koke1997/cv-website?label=npm)](https://github.com/koke1997/cv-website/packages)
[![Deploy](https://github.com/koke1997/cv-website/actions/workflows/deploy.yml/badge.svg)](https://github.com/koke1997/cv-website/actions/workflows/deploy.yml)

Professional CV website built with RenderCV and SvelteKit, deployed on GitHub Pages.

## Live Site

**[https://koke1997.github.io/cv-website/](https://koke1997.github.io/cv-website/)**

## Downloads

Get the latest CV from [Releases](https://github.com/koke1997/cv-website/releases):
- **PDF** - Best for viewing and printing
- **DOCX** - Best for ATS systems and editing

## Quick Install (npm)

Create your own CV website with one command:

```bash
npx @koke1997/cv-website-template
```

This will:
1. Ask for your name and email
2. Clone the template
3. Customize files with your information
4. Set up everything ready to go

## Use as Template

Want more control? Fork this repository:

1. **Fork** this repository
2. **Clone** your fork locally
3. **Edit** `Ivan_Kokalovic_CV.yaml` with your information
4. **Rename** the file to match your name
5. **Push** and GitHub Actions deploys automatically

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions.

## Tech Stack

- **[RenderCV](https://rendercv.com/)** - CV as YAML code, rendered to PDF/HTML/Markdown
- **[SvelteKit](https://kit.svelte.dev/)** - Modern web framework
- **[Ansible](https://www.ansible.com/)** - Development automation
- **GitHub Pages** - Free hosting
- **GitHub Actions** - Automated deployment and releases

## Features

- Professional, modern design
- Fully responsive (mobile, tablet, desktop)
- Dark/Light mode support
- Downloadable PDF and DOCX versions
- ATS-optimized format
- Automated deployment on git push
- Release workflow with auto-generated changelog

## Quick Start

### Prerequisites

- Python 3.12+
- Node.js 22+ (for SvelteKit)
- Ansible (optional, for automation)

### Local Development

```bash
# Clone the repository
git clone https://github.com/koke1997/cv-website.git
cd cv-website

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install "rendercv[full]" mkdocs-material ansible

# Using Ansible (recommended)
ansible-playbook -i ansible/inventory/hosts ansible/playbooks/serve.yml

# Or manually
rendercv render Ivan_Kokalovic_CV.yaml
mkdocs serve -a 127.0.0.1:8080
```

Open [http://127.0.0.1:8080](http://127.0.0.1:8080) in your browser.

## Ansible Playbooks

Ansible playbooks simplify development tasks:

```bash
# Start server
ansible-playbook -i ansible/inventory/hosts ansible/playbooks/serve.yml

# Stop server
ansible-playbook -i ansible/inventory/hosts ansible/playbooks/stop.yml

# Rebuild and restart
ansible-playbook -i ansible/inventory/hosts ansible/playbooks/rebuild.yml

# Generate DOCX/ODT formats
ansible-playbook -i ansible/inventory/hosts ansible/playbooks/generate-formats.yml
```

See [ansible/README.md](ansible/README.md) for all available playbooks.

## Project Structure

```
.
├── Ivan_Kokalovic_CV.yaml     # CV source (YAML)
├── mkdocs.yml                 # MkDocs configuration
├── docs/                      # Website content
├── sveltekit/                 # SvelteKit frontend
├── ansible/
│   ├── inventory/             # Ansible inventory
│   │   └── group_vars/        # Shared variables
│   └── playbooks/             # Automation playbooks
└── .github/
    └── workflows/
        ├── deploy.yml         # Deploy to GitHub Pages
        └── release.yml        # Create releases
```

## Creating a Release

Releases are automated. To create a new release:

```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions will:
1. Render the CV to PDF
2. Generate DOCX format
3. Create a GitHub Release with both files attached

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

The repository structure, automation, and configuration are freely available for anyone to fork and use. CV content is personal.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

## Contact

**Ivan Kokalovic**
- Email: [ivankokalovic@protonmail.ch](mailto:ivankokalovic@protonmail.ch)
- LinkedIn: [linkedin.com/in/kokalovic](https://www.linkedin.com/in/kokalovic/)
- GitHub: [github.com/koke1997](https://github.com/koke1997)
