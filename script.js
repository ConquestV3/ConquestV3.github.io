document.addEventListener('DOMContentLoaded', () => {
    // === Initialize Lucide Icons if available ===
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // === Core Components Initialization ===
    initTheme();
    initMobileMenu();
    initTypingEffect();
    initScrollSpy();
    initProjectsFilter();
    initTicTacToeGame();
    initScrollReveal();
});

// ==========================================
// 1. Theme Toggler (Dark / Light Mode)
// ==========================================
function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggle');
    if (!themeToggleBtn) return;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

    if (defaultDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Dynamic feedback for the button transition
        themeToggleBtn.style.transform = 'scale(0.9) rotate(45deg)';
        setTimeout(() => {
            themeToggleBtn.style.transform = '';
        }, 150);
    });
}

// ==========================================
// 2. Mobile Menu Toggler
// ==========================================
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (!menuBtn || !navMenu) return;

    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        if (icon) {
            if (navMenu.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    });

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'menu');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        });
    });
}

// ==========================================
// 3. Typing Carousel Effect
// ==========================================
function initTypingEffect() {
    const typingTarget = document.getElementById('typingTarget');
    if (!typingTarget) return;

    const roles = ['Software Engineer', 'Full-Stack Developer', 'Creative Problem Solver'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingTarget.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Deletes faster
        } else {
            typingTarget.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 120; // Natural typing speed
        }

        // Handle word completions and deletions
        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at the end of the word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Small break before typing next word
        }

        setTimeout(type, typeSpeed);
    }

    // Start the typing loop
    setTimeout(type, 1000);
}

// ==========================================
// 4. Scroll Spy (Active Navigation Highlight)
// ==========================================
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // Offset for sticky header
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ==========================================
// 5. Projects Filter Grid
// ==========================================
function initProjectsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Set active class
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Trigger reflow for fade animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ==========================================
// 6. Interactive Tic-Tac-Toe Game (Modal & Widget)
// ==========================================
function initTicTacToeGame() {
    const modal = document.getElementById('gameModal');
    const openGameBtns = document.querySelectorAll('[data-open-game]');
    const closeGameBtn = document.getElementById('closeGame');
    const boardElement = document.getElementById('gameBoard');
    const cells = document.querySelectorAll('.game-cell');
    const statusElement = document.getElementById('gameStatus');
    const resetBtn = document.getElementById('gameResetBtn');

    if (!modal || !boardElement) return;

    let boardState = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X"; // X is Cross (Red), O is Circle (Green)
    let isGameActive = true;

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Open/Close Modal Listeners
    openGameBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            resetGame();
        });
    });

    if (closeGameBtn) {
        closeGameBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal-overlay')) {
            modal.classList.remove('active');
        }
    });

    // Game Action Listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', resetGame);
    }

    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (boardState[clickedCellIndex] !== "" || !isGameActive) {
            return;
        }

        updateCell(clickedCell, clickedCellIndex);
        checkResult();
    }

    function updateCell(cell, index) {
        boardState[index] = currentPlayer;
        cell.innerText = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase(), 'taken');
    }

    function changePlayer() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusElement.innerText = `Player ${currentPlayer}'s Turn`;
        statusElement.style.color = currentPlayer === 'X' ? '#ff4757' : '#2ed573';
    }

    function checkResult() {
        let roundWon = false;

        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = boardState[winCondition[0]];
            let b = boardState[winCondition[1]];
            let c = boardState[winCondition[2]];

            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            statusElement.innerText = `Player ${currentPlayer} Wins! 🎉`;
            statusElement.style.color = '#06b6d4'; // Cyan win highlight
            isGameActive = false;
            return;
        }

        let roundDraw = !boardState.includes("");
        if (roundDraw) {
            statusElement.innerText = "It's a Draw! 🤝";
            statusElement.style.color = 'var(--text-secondary)';
            isGameActive = false;
            return;
        }

        changePlayer();
    }

    function resetGame() {
        boardState = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        isGameActive = true;
        statusElement.innerText = "Player X's Turn";
        statusElement.style.color = '#ff4757';
        cells.forEach(cell => {
            cell.innerText = "";
            cell.className = "game-cell"; // Resets styles
        });
    }
}

// ==========================================
// 7. Scroll-Reveal & Stats Counter Trigger
// ==========================================
function initScrollReveal() {
    const reveals = document.querySelectorAll('.bento-card, .skill-category, .timeline-item, .project-card');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    
    // Skill bars animation helper
    function animateSkills() {
        skillBars.forEach(bar => {
            const percent = bar.getAttribute('data-percent');
            bar.style.width = percent;
        });
    }

    function checkReveal() {
        const triggerBottom = window.innerHeight * 0.85;

        // Reveal standard elements on scroll
        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            if (revealTop < triggerBottom) {
                reveal.style.opacity = '1';
                reveal.style.transform = 'translateY(0)';
            }
        });

        // Trigger skills progress bars
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            const sectionTop = skillsSection.getBoundingClientRect().top;
            if (sectionTop < triggerBottom) {
                animateSkills();
            }
        }
    }

    // Set initial state
    reveals.forEach(reveal => {
        reveal.style.opacity = '0';
        reveal.style.transform = 'translateY(20px)';
        reveal.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    window.addEventListener('scroll', checkReveal);
    // Initial check on load
    checkReveal();
}
