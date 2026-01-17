# Contributing to cv-website CV Template

Thank you for your interest in contributing! This project serves as both my personal CV and a template for others to create their own professional CV websites.

## Using This Template for Your Own CV

The easiest way to use this template is to fork it:

1. **Fork the repository** to your GitHub account
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/cv-website.git
   cd cv-website
   ```
3. **Replace the CV content**:
   - Edit `Ivan_Kokalovic_CV.yaml` with your information
   - Rename the file to `Your_Name_CV.yaml`
   - Update references in `mkdocs.yml` and `.github/workflows/`
4. **Update personal details**:
   - Replace `docs/assets/images/profile.jpg` with your photo
   - Update contact information in `docs/contact.md`
   - Modify `docs/index.md` with your summary
5. **Test locally**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install "rendercv[full]" mkdocs-material
   rendercv render Your_Name_CV.yaml
   mkdocs serve
   ```
6. **Deploy** by pushing to your repository - GitHub Actions handles the rest!

## Contributing Improvements

If you've made improvements to the template, automation, or documentation that could benefit others, contributions are welcome!

### What We Accept

- Bug fixes in Ansible playbooks or GitHub Actions
- Documentation improvements
- New playbooks that enhance the workflow
- CSS/theme improvements for better CV presentation
- Accessibility improvements

### What We Don't Accept

- Changes to the CV content (that's personal)
- Breaking changes to the existing workflow
- Dependencies on paid services

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-improvement
   ```
3. **Make your changes**
4. **Test your changes**:
   ```bash
   # Test Ansible playbooks
   ansible-playbook -i ansible/inventory/hosts ansible/playbooks/serve.yml

   # Verify the site works
   open http://127.0.0.1:8080
   ```
5. **Commit with a clear message**:
   ```bash
   git commit -m "Add: description of your change"
   ```
6. **Push and create a Pull Request**

### Commit Message Guidelines

- `Add:` for new features
- `Fix:` for bug fixes
- `Update:` for updates to existing features
- `Docs:` for documentation changes
- `Refactor:` for code refactoring

## Development Setup

### Prerequisites

- Python 3.12+
- Ansible (for local development automation)
- Node.js 22+ (for SvelteKit frontend)

### Local Development

```bash
# Clone and setup
git clone https://github.com/koke1997/cv-website.git
cd cv-website
python3 -m venv venv
source venv/bin/activate
pip install "rendercv[full]" mkdocs-material

# Start development server
ansible-playbook -i ansible/inventory/hosts ansible/playbooks/serve.yml

# Or manually
mkdocs serve -a 127.0.0.1:8080
```

### Project Structure

```
.
├── Ivan_Kokalovic_CV.yaml    # CV source (YAML)
├── mkdocs.yml                # MkDocs configuration
├── docs/                     # Website content
├── sveltekit/                # SvelteKit frontend (alternative)
├── ansible/
│   ├── inventory/            # Ansible inventory
│   └── playbooks/            # Automation playbooks
└── .github/workflows/        # CI/CD pipelines
```

## Questions?

If you have questions about using or contributing to this template, please open an issue.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
