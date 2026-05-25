document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove the active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabPanels.forEach(panel => panel.classList.remove("active"));

            // Add the active class to the clicked button
            button.classList.add("active");

            // Identify and activate the corresponding panel
            const targetId = button.getAttribute("data-target");
            document.getElementById(targetId).classList.add("active");
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.content section');

  // Fonction pour basculer l'affichage
  function showSection(targetId) {
    sections.forEach(section => {
      if (section.id === targetId) {
        section.classList.add('active-section');
      } else {
        section.classList.remove('active-section');
      }
    });
  }

  // Initialisation : lire le hash de l'URL ou afficher section1 par défaut
  const initialHash = window.location.hash.substring(1);
  if (initialHash && document.getElementById(initialHash)) {
    showSection(initialHash);
  } else {
    showSection('section1');
  }

  // Écoute des clics sur le menu
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Bloque le saut visuel instantané du navigateur
      const targetId = link.getAttribute('href').substring(1);
      
      showSection(targetId);
      
      // Met à jour l'URL sans recharger la page
      window.history.pushState(null, null, `#${targetId}`);
    });
  });
});
