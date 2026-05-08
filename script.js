document.addEventListener("DOMContentLoaded", () => {
    const boutonDeclencheur = document.getElementById("declencheur-menu");
    const menuPrincipal = document.getElementById("menu-principal");

    if (boutonDeclencheur && menuPrincipal) {
        boutonDeclencheur.addEventListener("click", () => {
            const estDeploye = menuPrincipal.classList.toggle("déployé");
            boutonDeclencheur.setAttribute("aria-expanded", estDeploye);
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // ... [conservez ici le code du menu de la bannière] ...

    const conteneurRoles = document.getElementById("conteneur-roles");
    if (conteneurRoles) {
        // Extraction et nettoyage des options depuis l'attribut HTML
        const roles = conteneurRoles.getAttribute("data-roles").split(",").map(role => role.trim());
        const affichageRole = document.getElementById("role-actuel");
        const btnPrec = document.getElementById("role-prec");
        const btnSuiv = document.getElementById("role-suiv");
        let indexRole = 0;

        const mettreAJourAffichage = () => {
            affichageRole.textContent = roles[indexRole];
        };

        btnPrec.addEventListener("click", () => {
            indexRole = (indexRole - 1 + roles.length) % roles.length;
            mettreAJourAffichage();
        });

        btnSuiv.addEventListener("click", () => {
            indexRole = (indexRole + 1) % roles.length;
            mettreAJourAffichage();
        });
    }
});