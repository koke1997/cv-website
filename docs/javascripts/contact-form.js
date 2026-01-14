document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    const contactType = document.getElementById('contact-type');
    const salarySection = document.getElementById('salary-section');
    const freelanceSection = document.getElementById('freelance-section');
    
    contactType.addEventListener('change', function() {
        const type = this.value;
        salarySection.style.display = type === 'fulltime' ? 'block' : 'none';
        freelanceSection.style.display = type === 'freelance' ? 'block' : 'none';
        document.getElementById('salary-range').required = (type === 'fulltime');
        document.getElementById('project-budget').required = (type === 'freelance');
    });
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const type = contactType.value;
        
        if (type === 'fulltime' && !formData.get('salary-range')) {
            alert('Please select a salary range for full-time positions.');
            return;
        }
        
        let body = `Name: ${formData.get('name')}\nEmail: ${formData.get('email')}\nCompany: ${formData.get('company')}\n\n`;
        if (type === 'fulltime') {
            body += `Salary: ${formData.get('salary-range')}\n`;
        }
        body += `\nMessage:\n${formData.get('message')}`;
        
        window.location.href = `mailto:ivankokalovic@protonmail.ch?subject=[${type.toUpperCase()}] Contact&body=${encodeURIComponent(body)}`;
    });
});
