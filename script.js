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
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.content section');

  function showSection(targetId) {
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
    showSection(initialHash);
  } else {
    showSection('home');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      showSection(targetId);
      window.history.pushState(null, null, `#${targetId}`);
    });
  });
});
