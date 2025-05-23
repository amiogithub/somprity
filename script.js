// Enhanced JavaScript for Birthday Website
document.addEventListener('DOMContentLoaded', function() {
    // Improved background music autoplay handling
    const backgroundMusic = document.getElementById('background-music');
    const musicToggle = document.querySelector('.music-toggle');
    
    if (backgroundMusic) {
        // Set volume to a comfortable level
        backgroundMusic.volume = 0.3;
        
        // Function to handle music toggle
        function toggleMusic() {
            if (backgroundMusic.paused) {
                backgroundMusic.play().then(() => {
                    musicToggle.classList.remove('muted');
                }).catch(error => {
                    console.log("Failed to play music: ", error);
                });
            } else {
                backgroundMusic.pause();
                musicToggle.classList.add('muted');
            }
        }
        
        // Try to autoplay music as soon as possible
        function attemptAutoplay() {
            backgroundMusic.play().then(() => {
                console.log("Autoplay successful");
                musicToggle.classList.remove('muted');
            }).catch(error => {
                console.log("Autoplay prevented by browser, please enable manually");
                // Show a visual cue that music needs to be enabled manually
                if (musicToggle) {
                    musicToggle.classList.add('attention');
                    musicToggle.classList.add('muted');
                    setTimeout(() => {
                        musicToggle.classList.remove('attention');
                    }, 2000);
                }
            });
        }
        
        // Try autoplay immediately
        attemptAutoplay();
        
        // Also try autoplay on first user interaction with the page
        const handleFirstInteraction = () => {
            attemptAutoplay();
            // Remove the event listeners after first interaction
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
        };
        
        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);
        document.addEventListener('keydown', handleFirstInteraction);
        
        // Add event listener to music toggle button
        if (musicToggle) {
            musicToggle.addEventListener('click', toggleMusic);
        }
    }
    
    // Initialize AOS animation library if it exists
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: false,
            easing: 'ease',
            offset: 100
        });
    }

    // Initialize Swiper for spotlight gallery if it exists
    if (document.querySelector('.swiper-container') && typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.swiper-container', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            }
        });
    }

    // Scroll down button functionality
    const scrollDownBtn = document.querySelector('.scroll-down');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', function() {
            const specialMessageSection = document.getElementById('special-message');
            if (specialMessageSection) {
                specialMessageSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Navigation dots functionality
    const navDots = document.querySelectorAll('.nav-dot');
    
    function updateActiveNavDot() {
        const scrollPosition = window.scrollY;
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navDots.forEach(dot => dot.classList.remove('active'));
                if (index < navDots.length) {
                    navDots[index].classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavDot);
    updateActiveNavDot();

    // Enhanced Video Functionality with improved poster image handling
    const videoItems = document.querySelectorAll('.video-item');
    
    videoItems.forEach(item => {
        const video = item.querySelector('video');
        const overlay = item.querySelector('.video-overlay');
        const playButton = item.querySelector('.play-button');
        const controls = item.querySelector('.video-controls');
        const playPauseBtn = item.querySelector('.play-pause-btn');
        const fullscreenBtn = item.querySelector('.fullscreen-btn');
        const progressBar = item.querySelector('.progress-bar');
        const progress = item.querySelector('.progress');
        
        if (video) {
            // Fix for poster images - ensure they display properly
            if (video.poster) {
                // Force the browser to refresh the poster image
                const currentPoster = video.poster;
                video.poster = '';
                setTimeout(() => {
                    video.poster = currentPoster;
                }, 10);
                
                // Create a background fallback in case poster fails to load
                const posterStyle = `
                    background-color: #000000;
                    background-image: url('${currentPoster}');
                    background-size: contain;
                    background-position: center;
                    background-repeat: no-repeat;
                `;
                video.setAttribute('style', posterStyle);
            }
            
            // Create a function to handle video playback
            function togglePlayPause() {
                if (video.paused) {
                    // Pause all other videos first
                    document.querySelectorAll('video').forEach(v => {
                        if (v !== video && !v.paused) {
                            v.pause();
                            const otherOverlay = v.closest('.video-wrapper').querySelector('.video-overlay');
                            if (otherOverlay) otherOverlay.style.opacity = '1';
                            
                            const otherPlayPauseBtn = v.closest('.video-wrapper').querySelector('.play-pause-btn i');
                            if (otherPlayPauseBtn) {
                                otherPlayPauseBtn.classList.remove('fa-pause');
                                otherPlayPauseBtn.classList.add('fa-play');
                            }
                        }
                    });
                    
                    // Now play this video
                    video.play();
                    if (overlay) overlay.style.opacity = '0';
                    if (playPauseBtn) {
                        const icon = playPauseBtn.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-play');
                            icon.classList.add('fa-pause');
                        }
                    }
                } else {
                    video.pause();
                    if (overlay) overlay.style.opacity = '1';
                    if (playPauseBtn) {
                        const icon = playPauseBtn.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-pause');
                            icon.classList.add('fa-play');
                        }
                    }
                }
            }
            
            // Main overlay play button
            if (overlay && playButton) {
                overlay.addEventListener('click', togglePlayPause);
            }
            
            // Play/Pause button in controls
            if (playPauseBtn) {
                playPauseBtn.addEventListener('click', togglePlayPause);
            }
            
            // Fullscreen button
            if (fullscreenBtn) {
                fullscreenBtn.addEventListener('click', function() {
                    if (video.requestFullscreen) {
                        video.requestFullscreen();
                    } else if (video.webkitRequestFullscreen) { /* Safari */
                        video.webkitRequestFullscreen();
                    } else if (video.msRequestFullscreen) { /* IE11 */
                        video.msRequestFullscreen();
                    }
                });
            }
            
            // Progress bar
            if (progressBar && progress) {
                video.addEventListener('timeupdate', function() {
                    const percentage = (video.currentTime / video.duration) * 100;
                    progress.style.width = percentage + '%';
                });
                
                progressBar.addEventListener('click', function(e) {
                    const pos = (e.pageX - this.getBoundingClientRect().left) / this.offsetWidth;
                    video.currentTime = pos * video.duration;
                });
            }
            
            // Reset when video ends
            video.addEventListener('ended', function() {
                if (overlay) overlay.style.opacity = '1';
                if (playPauseBtn) {
                    const icon = playPauseBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-pause');
                        icon.classList.add('fa-play');
                    }
                }
            });
            
            // Force poster to display by setting currentTime to 0
            video.currentTime = 0;
        }
    });
    
    // Animate curtains when message section comes into view
    const messageSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.3 });

    const messageSection = document.querySelector('.message-section');
    if (messageSection) {
        messageSectionObserver.observe(messageSection);
    }
    
    // Smooth scroll for all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Animated typing effect for ribbon text
    const friendName = document.getElementById('friend-name');
    if (friendName) {
        const text = friendName.textContent;
        friendName.textContent = '';
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                friendName.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start the typing animation after a delay
        setTimeout(typeWriter, 1000);
    }
    
    // Make message section active on page load after a delay
    setTimeout(() => {
        if (messageSection) {
            messageSection.classList.add('active');
        }
    }, 2000);
    
    // Preload video poster images to ensure they display properly
    const videoElements = document.querySelectorAll('video[poster]');
    videoElements.forEach(video => {
        const img = new Image();
        img.src = video.poster;
        img.onload = function() {
            video.style.backgroundImage = `url('${video.poster}')`;
        };
    });
});