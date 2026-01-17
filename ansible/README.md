# Ansible Playbooks for CV Development

This directory contains Ansible playbooks to automate local development tasks for the CV website.

## Prerequisites

- Python 3.12+
- Ansible (`pip install ansible`)
- Virtual environment with dependencies installed

## Quick Start

All playbooks are run from the repository root:

```bash
# Start the development server
ansible-playbook -i ansible/inventory/hosts ansible/playbooks/serve.yml

# Stop the development server
ansible-playbook -i ansible/inventory/hosts ansible/playbooks/stop.yml

# Verify the server is running correctly
ansible-playbook -i ansible/inventory/hosts ansible/playbooks/verify.yml

# Rebuild and restart the server
ansible-playbook -i ansible/inventory/hosts ansible/playbooks/rebuild.yml
```

## Available Playbooks

### Core Playbooks

| Playbook | Description |
|----------|-------------|
| `serve.yml` | Start the MkDocs development server on port 8080 |
| `stop.yml` | Stop the running development server |
| `verify.yml` | Check if the server is running and responding correctly |
| `rebuild.yml` | Rebuild the site and restart the server |

### Content & Formatting

| Playbook | Description |
|----------|-------------|
| `generate-formats.yml` | Generate DOCX and ODT formats from CV markdown |
| `update-content.yml` | Update site content and configuration |
| `apply-changes.yml` | Apply changes to the running site |

### Analysis & Debugging

| Playbook | Description |
|----------|-------------|
| `analyze-site.yml` | Analyze the site for potential improvements |
| `fix-styling.yml` | Debug and fix CSS styling issues |
| `fix-site.yml` | Fix common site issues |

### Setup & Enhancement

| Playbook | Description |
|----------|-------------|
| `enhance-site.yml` | Add enhanced styling and features |
| `add-profile-image.yml` | Verify and setup profile image |

## Configuration

### Shared Variables

All playbooks use shared variables from `inventory/group_vars/all.yml`:

```yaml
# Project paths (automatically calculated)
project_dir: "{{ playbook_dir | dirname | dirname }}"
docs_dir: "{{ project_dir }}/docs"
venv_dir: "{{ project_dir }}/venv"

# Server configuration
serve_host: "127.0.0.1"
serve_port: 8080

# CV configuration
cv_name: "Ivan_Kokalovic_CV"
cv_yaml: "Ivan_Kokalovic_CV.yaml"
```

### Customization

To customize for your own CV:

1. Update the `cv_name` and `cv_yaml` variables in `inventory/group_vars/all.yml`
2. Optionally change `serve_port` if 8080 is in use

## Directory Structure

```
ansible/
├── inventory/
│   ├── hosts                    # Inventory file (localhost)
│   └── group_vars/
│       └── all.yml              # Shared variables
├── playbooks/
│   ├── serve.yml                # Start server
│   ├── stop.yml                 # Stop server
│   ├── verify.yml               # Verify server
│   ├── rebuild.yml              # Rebuild & restart
│   ├── generate-formats.yml     # Generate DOCX/ODT
│   └── ...                      # Other playbooks
└── README.md                    # This file
```

## Troubleshooting

### Port Already in Use

If port 8080 is already in use:

```bash
# Find and kill the process
lsof -ti:8080 | xargs kill -9

# Or run the stop playbook
ansible-playbook -i ansible/inventory/hosts ansible/playbooks/stop.yml
```

### Server Not Starting

1. Ensure the virtual environment is set up:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install "rendercv[full]" mkdocs-material
   ```

2. Check the server log:
   ```bash
   cat /tmp/mkdocs_cv.log
   ```

### Playbook Errors

Run with verbose output for debugging:

```bash
ansible-playbook -i ansible/inventory/hosts ansible/playbooks/serve.yml -vvv
```

## Notes

- All playbooks are designed to be idempotent
- The server runs in the background; use `stop.yml` to terminate
- Log files are stored in `/tmp/mkdocs_cv.log`
