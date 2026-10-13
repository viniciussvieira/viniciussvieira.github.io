document.addEventListener('DOMContentLoaded', () => {

// ===========================================
// 1. Highlighting the Active Link in Navigation
// ===========================================
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('.menu a');

// Settings for the Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
// A threshold of 0.5 means that 50% of the section must be visible
// to be considered the 'active' section.
        threshold: 0.5 
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSectionId = entry.target.id;
//Remove the 'active' highlight from all links.
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

// Adds highlighting to the link that corresponds to the visible section.
                const targetLink = document.querySelector(`.menu a[href="#${currentSectionId}"]`);
                if (targetLink) {
                    targetLink.classList.add('active');
                }
            }
        });
    }, observerOptions);
// Start looking at all the main sections
    sections.forEach(section => {
        sectionObserver.observe(section);
    });



// ===========================================
// 2. "Back to Top" Button
// ===========================================
    const scrollToTopButton = document.getElementById('scrollToTopBtn');

    if (scrollToTopButton) {
// Show/hide the button based on the scroll position.
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopButton.style.opacity = '1';
                scrollToTopButton.style.visibility = 'visible';
            } else {
                scrollToTopButton.style.opacity = '0';
                scrollToTopButton.style.visibility = 'hidden';
            }
        });

// Click event to smoothly scroll to the top
        scrollToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


// ===========================================
// 3. Contact Form (Web3Forms -> email)
// ===========================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalLabel = submitButton.innerHTML;

            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: new FormData(contactForm)
                });
                const result = await response.json();

                if (response.ok && result.success) {
                    formStatus.textContent = 'Thanks! Your message was sent. I will get back to you soon.';
                    formStatus.classList.add('success');
                    contactForm.reset();
                } else {
                    throw new Error(result.message || 'Request failed');
                }
            } catch (error) {
                formStatus.textContent = 'Sorry, something went wrong. Please try again or reach me on LinkedIn.';
                formStatus.classList.add('error');
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalLabel;
            }
        });
    }
});
