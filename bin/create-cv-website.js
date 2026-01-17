#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

async function main() {
  console.log('\n🎨 CV Website Template Generator\n');
  console.log('This will create a new CV website project.\n');

  // Get user info
  const name = await question('Your full name: ');
  const email = await question('Your email: ');
  const projectName = await question('Project folder name (default: cv-website): ') || 'cv-website';

  const targetDir = path.resolve(process.cwd(), projectName);

  // Check if directory exists
  if (fs.existsSync(targetDir)) {
    console.error(`\n❌ Error: Directory "${projectName}" already exists.`);
    rl.close();
    process.exit(1);
  }

  console.log(`\n📁 Creating project in ${targetDir}...\n`);

  // Clone the template
  try {
    execSync(`git clone --depth 1 https://github.com/koke1997/cv-website.git "${targetDir}"`, {
      stdio: 'inherit'
    });

    // Remove .git directory
    fs.rmSync(path.join(targetDir, '.git'), { recursive: true, force: true });

    // Update CV YAML with user's name
    const cvYamlPath = path.join(targetDir, 'Ivan_Kokalovic_CV.yaml');
    if (fs.existsSync(cvYamlPath)) {
      let cvContent = fs.readFileSync(cvYamlPath, 'utf8');
      cvContent = cvContent.replace(/Ivan Kokalović/g, name);
      cvContent = cvContent.replace(/ivankokalovic@protonmail\.ch/g, email);

      // Rename the file
      const newFileName = name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') + '_CV.yaml';
      fs.writeFileSync(path.join(targetDir, newFileName), cvContent);
      fs.unlinkSync(cvYamlPath);

      console.log(`\n✅ Created ${newFileName}`);
    }

    // Update README
    const readmePath = path.join(targetDir, 'README.md');
    if (fs.existsSync(readmePath)) {
      let readme = fs.readFileSync(readmePath, 'utf8');
      readme = readme.replace(/Ivan Kokalovic/g, name);
      readme = readme.replace(/koke1997\/cv-website/g, `YOUR_USERNAME/${projectName}`);
      fs.writeFileSync(readmePath, readme);
    }

    console.log('\n✅ Project created successfully!\n');
    console.log('Next steps:\n');
    console.log(`  1. cd ${projectName}`);
    console.log('  2. python3 -m venv venv && source venv/bin/activate');
    console.log('  3. pip install "rendercv[full]" mkdocs-material ansible');
    console.log('  4. Edit your CV YAML file');
    console.log('  5. ansible-playbook -i ansible/inventory/hosts ansible/playbooks/serve.yml');
    console.log('  6. git init && git add . && git commit -m "Initial commit"');
    console.log('  7. Push to GitHub and enable GitHub Pages\n');

  } catch (error) {
    console.error('\n❌ Error creating project:', error.message);
    process.exit(1);
  }

  rl.close();
}

main();
