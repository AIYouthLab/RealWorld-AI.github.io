document.addEventListener('DOMContentLoaded', () => {
    // Language Switching Logic
    const langBtn = document.getElementById('lang-toggle');
    const elements = document.querySelectorAll('[data-en]');
    
    // Check local storage or default to 'en'
    let currentLang = localStorage.getItem('vinsoo-lang') || 'en';
    
    // Initial render
    updateLanguage(currentLang);
    
    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'zh' : 'en';
        updateLanguage(currentLang);
        localStorage.setItem('vinsoo-lang', currentLang);
    });

    function updateLanguage(lang) {
        // Update button text
        langBtn.textContent = lang === 'en' ? '中文' : 'English';
        
        // Update document title
        document.title = lang === 'en' 
            ? 'Vinsoo Agent - Technical Report' 
            : 'Vinsoo Agent - 技术报告';

        // Update content
        elements.forEach(el => {
            // Fade out
            el.style.opacity = '0.5';
            
            setTimeout(() => {
                if (el.hasAttribute(`data-${lang}`)) {
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                        el.placeholder = el.getAttribute(`data-${lang}`);
                    } else {
                        // Handle HTML content safely if needed, but textContent is safer for simple text
                        // For this report, some elements might contain HTML in the data attribute?
                        // The HTML source has plain text in data attributes mostly.
                        // However, some descriptions might need HTML rendered inside?
                        // Let's check index.html. 
                        // Most are text. One place has HTML in data attribute? 
                        // No, index.html structure shows text in data attributes.
                        // Wait, for 3.1 3.2 etc, I used <strong> tags in the HTML body but the data attribute is plain text or text with HTML?
                        // Looking at index.html: 
                        // <strong data-en="DYCODE" data-zh="DYCODE">DYCODE</strong>
                        // The text content is just "DYCODE".
                        // <span data-en="Pass@1 submission..." data-zh="Pass@1 提交...">
                        // So I can just use textContent for most, or innerHTML if I want to support formatting in translation.
                        // Given the content, innerHTML is safer to ensure formatting is preserved if I put any markup in data attributes (though I tried to keep them simple).
                        // Actually, looking at index.html, the longer texts are in data attributes.
                        // Example: data-zh="Vinsoo 是..."
                        // I should use innerHTML to be safe if I used entities or markup, but simple textContent works if data is plain text.
                        // I will use innerHTML to allow flexibility.
                        el.innerHTML = el.getAttribute(`data-${lang}`);
                    }
                }
                // Fade in
                el.style.opacity = '1';
            }, 200);
        });

        // Special handling for the logo/hero subtitle to ensure smooth transition
        document.documentElement.lang = lang;
    }

    // Scroll Animation (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
    
    // Add simple CSS transition for opacity on data-elements
    const style = document.createElement('style');
    style.textContent = `
        [data-en] {
            transition: opacity 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});