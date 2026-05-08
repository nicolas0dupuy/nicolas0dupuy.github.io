document.addEventListener("DOMContentLoaded", () => {
    /* Logique du menu de navigation mobile */
    const boutonDeclencheur = document.getElementById("declencheur-menu");
    const menuPrincipal = document.getElementById("menu-principal");

    if (boutonDeclencheur && menuPrincipal) {
        boutonDeclencheur.addEventListener("click", () => {
            const estDeploye = menuPrincipal.classList.toggle("déployé");
            boutonDeclencheur.setAttribute("aria-expanded", estDeploye);
        });
    }

    /* Logique du sélecteur de rôles */
    const conteneurRoles = document.getElementById("conteneur-roles");
    if (conteneurRoles) {
        const roles = conteneurRoles.getAttribute("data-roles").split(",").map(role => role.trim());
        const affichageRole = document.getElementById("role-actuel");
        const btnPrec = document.getElementById("role-prec");
        const btnSuiv = document.getElementById("role-suiv");
        let indexRole = 0;

        btnPrec.addEventListener("click", () => {
            indexRole = (indexRole - 1 + roles.length) % roles.length;
            affichageRole.textContent = roles[indexRole];
        });

        btnSuiv.addEventListener("click", () => {
            indexRole = (indexRole + 1) % roles.length;
            affichageRole.textContent = roles[indexRole];
        });
    }
});