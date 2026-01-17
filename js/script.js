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
});