g
const themes = {
    light: {
        background: '#F7F7FF',
        text: '#2A2A2A',
        primary: '#7C83FD'
    },
    dark: {
        background: '#1A1A1A',
        text: '#F7F7FF',
        primary: '#96BAFF'
    }
};

const userPreferences = {
    theme: 'light',
    notifications: true,
    language: 'en'
};


document.addEventListener('DOMContentLoaded', () => {

    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href').includes(currentPage)) {
            link.classList.add('active');
        }
    });


    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});


const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        
        if(elementPosition < screenPosition) {
            element.classList.add('animate');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
