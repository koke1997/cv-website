# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- MIT LICENSE file for open-source distribution
- CONTRIBUTING.md with fork and contribution guidelines
- This CHANGELOG.md file
- Ansible playbook documentation (ansible/README.md)
- GitHub issue and PR templates
- GitHub Release workflow for automated versioning

### Changed
- Ansible playbooks now use dynamic paths instead of hard-coded values
- Updated README with badges and template usage instructions

## [1.0.0] - 2025-01-17

### Added
- Initial open-source release
- RenderCV-based CV generation from YAML
- MkDocs Material website with custom styling
- SvelteKit alternative frontend
- Ansible playbooks for local development:
  - `serve.yml` - Start development server
  - `stop.yml` - Stop development server
  - `rebuild.yml` - Rebuild and restart
  - `verify.yml` - Verify server status
  - `generate-formats.yml` - Generate PDF and DOCX
- GitHub Actions deployment to GitHub Pages
- ATS-optimized CV format:
  - Arial font for maximum compatibility
  - Expanded acronyms (IAM, SLA, AML, OCR, etc.)
  - Standard section headers
  - Text-based PDF output
- PDF and DOCX download options
- Contact form with validation
- Responsive design (mobile, tablet, desktop)
- Dark/light mode support

### Technical Details
- Python 3.12+ required
- RenderCV with Typst backend
- MkDocs Material theme
- SvelteKit with static adapter
- Ansible for local automation

[Unreleased]: https://github.com/koke1997/cv-website/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/koke1997/cv-website/releases/tag/v1.0.0
