// Dictionnaire de mots-clés de personnalisation (URL GET "?choices=...")
const CHOICE_PRESETS = {
    "seagull": ["ComputerVision", "MachineLearning", "AppliedMathematics", "ComputationalPhysics", "ResearchCollaboration"],
    "math": ["AppliedMathematics", "ComputationalPhysics"],
    "researcher": ["GenerativeAI", "MachineLearning", "ComputerVision"],
    "quant": ["QuantitativeFinance", "AppliedMathematics", "SignalProcessing", "DataScience"],
    "consulting": ["MachineLearning", "DataScience", "DataEngineering", "ComputerVision"],
    "curator": ["ComputerVision", "ResearchCollaboration"]
};


// Helper permettant de changer le hash de l'URL de manière sécurisée en local (évite SecurityError avec file://)
function safePushHash(hash) {
    try {
        window.history.pushState(null, null, hash);
    } catch (e) {
        window.location.hash = hash;
    }
}

// System flag preventing overlapping transitions
let isTransitioning = false;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialiser la logique des onglets (Tabs)
    const tabContainers = document.querySelectorAll(".tabs-container");
    tabContainers.forEach(container => {
        const tabButtons = container.querySelectorAll(".tab-btn");
        const tabPanels = container.querySelectorAll(".tab-panel");

        tabButtons.forEach(button => {
            button.addEventListener("click", () => {
                tabButtons.forEach(btn => btn.classList.remove("active"));
                tabPanels.forEach(panel => panel.classList.remove("active"));

                button.classList.add("active");

                const targetId = button.getAttribute("data-target");
                const targetPanel = container.querySelector(`#${targetId}`);
                if (targetPanel) {
                    targetPanel.classList.add("active");
                }
            });
        });
    });

    // 2. Initialiser le routage et les transitions de navigation
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const container = document.querySelector('.content');

    function showSectionInstant(targetId) {
        if (!container) return;
        const sections = container.querySelectorAll('section');
        sections.forEach(section => {
            if (section.id === targetId) {
                section.classList.add('active-section');
            } else {
                section.classList.remove('active-section');
            }
        });
    }

    const initialHash = window.location.hash.substring(1);
    if (initialHash && document.getElementById(initialHash)) {
        showSectionInstant(initialHash);
    } else {
        showSectionInstant('home');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement && !targetElement.classList.contains('active-section') && !isTransitioning) {
                e.preventDefault();
                runVerticalTileTransition(targetId);
                safePushHash(`#${targetId}`);
            } else if (isTransitioning || (targetElement && targetElement.classList.contains('active-section'))) {
                e.preventDefault();
            }
        });
    });

    // 3. Générer le menu des hashtags
    generateHashtagMenu();

    // 4. Appliquer les préconfigurations GET par URL (?choices=...)
    function applyUrlPresets() {
        const urlParams = new URLSearchParams(window.location.search);
        const choicesParam = urlParams.get("choices");
        if (!choicesParam) return;

        const key = choicesParam.toLowerCase().trim();
        if (CHOICE_PRESETS[key]) {
            const targetTags = CHOICE_PRESETS[key];
            const checkboxes = document.querySelectorAll(".filter-checkbox");
            const allButton = document.getElementById("all-services-btn");
            
            let activatedAny = false;
            checkboxes.forEach(cb => {
                if (targetTags.includes(cb.value)) {
                    cb.checked = true;
                    cb.closest(".filter-checkbox-container").classList.add("active");
                    activatedAny = true;
                } else {
                    cb.checked = false;
                    cb.closest(".filter-checkbox-container").classList.remove("active");
                }
            });
            
            if (activatedAny && allButton) {
                allButton.classList.remove("active");
            }
            
            applyFilters();
            
            // Afficher automatiquement la section Services (id: section2)
            showSectionInstant('section2');
            safePushHash('#section2');
        }
    }
    applyUrlPresets();
});

/**
 * Executes a top-to-bottom linear tile transition to swap content sections.
 * @param {string} targetSectionId - The HTML ID of the section to reveal.
 */
function runVerticalTileTransition(targetSectionId) {
    if (isTransitioning) return;
    isTransitioning = true;

    const container = document.querySelector('.content');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    const tileSize = 40;
    const speed = 400;
    const tileColor = '#0f172a';

    const cols = Math.ceil(containerWidth / tileSize);
    const rows = Math.ceil(containerHeight / tileSize);

    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.display = 'grid';
    overlay.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    overlay.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '40';
    container.appendChild(overlay);

    const tileElements = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const tile = document.createElement('div');
            tile.style.backgroundColor = tileColor;
            tile.style.opacity = '0';
            tile.style.transform = 'scale(0)';
            tile.style.borderRadius = '0px';
            tile.style.transition = `transform ${speed}ms cubic-bezier(0.25, 1, 0.5, 1), opacity ${speed}ms ease`;
            overlay.appendChild(tile);

            const delay = r * (speed / rows) * 1.5;
            tileElements.push({ element: tile, delay });
        }
    }

    setTimeout(() => {
        tileElements.forEach(item => {
            item.element.style.transitionDelay = `${item.delay}ms`;
            item.element.style.opacity = '1';
            item.element.style.transform = 'scale(1.05)';
        });
    }, 20);

    const maxDelay = Math.max(...tileElements.map(item => item.delay));
    const phase1Duration = maxDelay + speed;

    setTimeout(() => {
        const sections = container.querySelectorAll('section');
        sections.forEach(section => {
            if (section.id === targetSectionId) {
                section.classList.add('active-section');
            } else {
                section.classList.remove('active-section');
            }
        });

        tileElements.forEach(item => {
            item.element.style.transitionDelay = `${item.delay}ms`;
            item.element.style.opacity = '0';
            item.element.style.transform = 'scale(0)';
        });

        setTimeout(() => {
            overlay.remove();
            isTransitioning = false;
        }, phase1Duration);

    }, phase1Duration);
}

function generateHashtagMenu() {
    const menuContainer = document.getElementById("hashtag-menu");
    const serviceCards = document.querySelectorAll(".service-card");

    if (!menuContainer) return;

    const allTags = new Set();
    serviceCards.forEach(card => {
        const tagsString = card.getAttribute("data-tags");
        if (tagsString) {
            tagsString.split(",").forEach(tag => {
                if (tag.trim() !== "") allTags.add(tag.trim());
            });
        }
    });

    const allButton = document.createElement("button");
    allButton.textContent = "All Services";
    allButton.id = "all-services-btn";
    allButton.className = "menu-tag-btn active";
    allButton.onclick = () => filterByTag("all");
    menuContainer.appendChild(allButton);

    Array.from(allTags).sort().forEach(tag => {
        const label = document.createElement("label");
        label.className = "filter-checkbox-container";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = tag;
        checkbox.className = "filter-checkbox";
        
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                label.classList.add("active");
            } else {
                label.classList.remove("active");
            }
            
            const checkedBoxes = document.querySelectorAll(".filter-checkbox:checked");
            const allBtn = document.getElementById("all-services-btn");
            if (checkedBoxes.length > 0) {
                if (allBtn) allBtn.classList.remove("active");
            } else {
                if (allBtn) allBtn.classList.add("active");
            }
            
            applyFilters();
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(`#${tag}`));
        menuContainer.appendChild(label);
    });
}

function applyFilters() {
    const serviceCards = document.querySelectorAll(".service-card");
    const checkedBoxes = document.querySelectorAll(".filter-checkbox:checked");
    
    const activeTags = Array.from(checkedBoxes).map(cb => cb.value);

    serviceCards.forEach(card => {
        const cardTagsString = card.getAttribute("data-tags");
        const cardTags = cardTagsString ? cardTagsString.split(",") : [];

        if (activeTags.length === 0) {
            card.style.display = "block";
        } else {
            const hasMatch = cardTags.some(tag => activeTags.includes(tag));
            if (hasMatch) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        }
    });
}

function filterByTag(selectedTag) {
    const checkboxes = document.querySelectorAll(".filter-checkbox");
    const allButton = document.getElementById("all-services-btn");
    
    if (selectedTag === "all") {
        checkboxes.forEach(cb => {
            cb.checked = false;
            cb.closest(".filter-checkbox-container").classList.remove("active");
        });
        if (allButton) {
            allButton.classList.add("active");
        }
        applyFilters();
    } else {
        checkboxes.forEach(cb => {
            if (cb.value === selectedTag) {
                cb.checked = true;
                cb.closest(".filter-checkbox-container").classList.add("active");
                cb.closest(".filter-checkbox-container").scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                cb.checked = false;
                cb.closest(".filter-checkbox-container").classList.remove("active");
            }
        });
        if (allButton) {
            allButton.classList.remove("active");
        }
        applyFilters();
    }
}
