document.addEventListener("DOMContentLoaded", () => {
    // Ciblage autonome de chaque conteneur d'onglets pour isoler la logique
    const tabContainers = document.querySelectorAll(".tabs-container");

    tabContainers.forEach(container => {
        const tabButtons = container.querySelectorAll(".tab-btn");
        const tabPanels = container.querySelectorAll(".tab-panel");

        tabButtons.forEach(button => {
            button.addEventListener("click", () => {
                // Nettoyage limité exclusivement au conteneur parent actif
                tabButtons.forEach(btn => btn.classList.remove("active"));
                tabPanels.forEach(panel => panel.classList.remove("active"));

                // Activation locale du bouton sélectionné
                button.classList.add("active");

                // Activation locale du panneau cible correspondant
                const targetId = button.getAttribute("data-target");
                const targetPanel = container.querySelector(`#${targetId}`);
                if (targetPanel) {
                    targetPanel.classList.add("active");
                }
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const container = document.querySelector('.content');

  // Routine to instantly display initial layout configuration without rendering delays
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

  // Initialisation : check address parameters or fallback automatically
  const initialHash = window.location.hash.substring(1);
  if (initialHash && document.getElementById(initialHash)) {
    showSectionInstant(initialHash);
  } else {
    showSectionInstant('home');
  }

  // Navigation click routing rules
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      // Execute only if target is distinct from active screen and pipeline is clear
      if (targetElement && !targetElement.classList.contains('active-section') && !isTransitioning) {
        e.preventDefault(); 
        runVerticalTileTransition(targetId);
        window.history.pushState(null, null, `#${targetId}`);
      } else if (isTransitioning || (targetElement && targetElement.classList.contains('active-section'))) {
        e.preventDefault(); // Stop default movement during state adjustments
      }
    });
  });
});
// System flag preventing overlapping transitions
let isTransitioning = false;

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

  // Configuration parameters
  const tileSize = 40;          // 40px tiles
  const speed = 400;            // 450ms fade duration
  const tileColor = '#0f172a';   // Cosmic Indigo

  // Calculate grid dimensions dynamically to guarantee total canvas coverage
  const cols = Math.ceil(containerWidth / tileSize);
  const rows = Math.ceil(containerHeight / tileSize);

  // Initialize and style the absolute transition grid overlay
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

  // Populate the grid structural matrix
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = document.createElement('div');
      
      // Configure aesthetic baseline states
      tile.style.backgroundColor = tileColor;
      tile.style.opacity = '0';
      tile.style.transform = 'scale(0)';
      tile.style.borderRadius = '0px'; 
      
      // Apply specialized smooth timing curve
      tile.style.transition = `transform ${speed}ms cubic-bezier(0.25, 1, 0.5, 1), opacity ${speed}ms ease`;

      overlay.appendChild(tile);

      // Map sequential animation delay based exclusively on row index (top-to-bottom sweep)
      const delay = r * (speed / rows) * 1.5;
      
      tileElements.push({ element: tile, delay });
    }
  }

  // PHASE 1: Cover the active view layer with the growing grid overlay
  setTimeout(() => {
    tileElements.forEach(item => {
      item.element.style.transitionDelay = `${item.delay}ms`;
      item.element.style.opacity = '1';
      item.element.style.transform = 'scale(1.05)'; // Elimina hairline gaps
    });
  }, 20);

  // Compute total duration required for the longest delayed element to finish animating
  const maxDelay = Math.max(...tileElements.map(item => item.delay));
  const phase1Duration = maxDelay + speed;

  // MIDPOINT INTERMISSION: Invert content visibility properties under the solid curtain
  setTimeout(() => {
    const sections = container.querySelectorAll('section');
    sections.forEach(section => {
      if (section.id === targetSectionId) {
        section.classList.add('active-section');
      } else {
        section.classList.remove('active-section');
      }
    });

    // PHASE 2: Shrink and dissolve elements to elegantly unmask the loaded section
    tileElements.forEach(item => {
      item.element.style.transitionDelay = `${item.delay}ms`;
      item.element.style.opacity = '0';
      item.element.style.transform = 'scale(0)';
    });

    // Complete lifecycle garbage collection once animations conclude entirely
    setTimeout(() => {
      overlay.remove();
      isTransitioning = false;
    }, phase1Duration);

  }, phase1Duration);
}

document.addEventListener("DOMContentLoaded", () => {
    generateHashtagMenu();
});

function generateHashtagMenu() {
    const menuContainer = document.getElementById("hashtag-menu");
    const serviceCards = document.querySelectorAll(".service-card");
    
    if (!menuContainer) return;

    // 1. Extraire tous les hashtags uniques des attributs data-tags
    const allTags = new Set();
    serviceCards.forEach(card => {
        const tagsString = card.getAttribute("data-tags");
        if (tagsString) {
            tagsString.split(",").forEach(tag => {
                if (tag.trim() !== "") allTags.add(tag.trim());
            });
        }
    });

    // 2. Créer le bouton "All Services"
    const allButton = document.createElement("button");
    allButton.textContent = "All Services";
    allButton.className = "menu-tag-btn active"; // Activé par défaut
    allButton.onclick = () => filterByTag("all", allButton);
    menuContainer.appendChild(allButton);

    // 3. Générer dynamiquement les boutons pour chaque hashtag trouvé
    Array.from(allTags).sort().forEach(tag => {
        const button = document.createElement("button");
        button.textContent = `#${tag}`;
        button.className = "menu-tag-btn";
        button.onclick = () => filterByTag(tag, button);
        menuContainer.appendChild(button);
    });
}

function filterByTag(selectedTag, clickedButton) {
    const serviceCards = document.querySelectorAll(".service-card");
    const allButtons = document.querySelectorAll(".menu-tag-btn");

    // Gérer l'état visuel "allumé" des boutons du menu
    allButtons.forEach(btn => btn.classList.remove("active"));
    clickedButton.classList.add("active");

    // Filtrer les cartes de service
    serviceCards.forEach(card => {
        const cardTagsString = card.getAttribute("data-tags");
        const cardTags = cardTagsString ? cardTagsString.split(",") : [];

        if (selectedTag === "all" || cardTags.includes(selectedTag)) {
            card.style.display = "block"; // Affiche la carte
        } else {
            card.style.display = "none";  // Cache la carte
        }
    });
}
