document.addEventListener('DOMContentLoaded', () => {

// ===========================================
// 1. Highlighting the Active Link in Navigation
// ===========================================
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('.menu a');

// A section becomes 'active' when it crosses the middle of the screen.
// This works even for sections taller than the viewport (e.g. Skills on mobile).
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const targetLink = document.querySelector(`.menu a[href="#${entry.target.id}"]`);
                if (targetLink) {
                    targetLink.classList.add('active');
                }
            }
        });
    }, { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => sectionObserver.observe(section));


// ===========================================
// 2. Mobile Menu (hamburger)
// ===========================================
    const nav = document.querySelector('nav');
    const menuToggle = document.querySelector('.menu-toggle');

    if (nav && menuToggle) {
        const setMenu = (open) => {
            nav.classList.toggle('menu-open', open);
            menuToggle.setAttribute('aria-expanded', String(open));
            menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        };

        menuToggle.addEventListener('click', () => {
            setMenu(!nav.classList.contains('menu-open'));
        });

// Close the menu after choosing a section, pressing Esc, or tapping outside
        navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') setMenu(false);
        });
        document.addEventListener('click', (event) => {
            if (!nav.contains(event.target)) setMenu(false);
        });
    }


// ===========================================
// 3. "Back to Top" Button
// ===========================================
    const scrollToTopButton = document.getElementById('scrollToTopBtn');

    if (scrollToTopButton) {
        window.addEventListener('scroll', () => {
            const show = window.scrollY > 300;
            scrollToTopButton.style.opacity = show ? '1' : '0';
            scrollToTopButton.style.visibility = show ? 'visible' : 'hidden';
        });

        scrollToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


// ===========================================
// 4. Reveal Sections on Scroll
// ===========================================
// Classes are added here (not in the HTML) so content stays visible if JS fails.
    const revealItems = document.querySelectorAll(
        'main section:not(#sobre) h2, main section:not(#sobre) > p, .skill-card, .contact-form'
    );

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealItems.forEach((item, index) => {
            item.classList.add('reveal');
            if (item.classList.contains('skill-card')) {
                item.style.transitionDelay = `${(index % 3) * 80}ms`;
            }
            revealObserver.observe(item);
        });
    }


// ===========================================
// 5. Contact Form (Web3Forms -> email)
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
