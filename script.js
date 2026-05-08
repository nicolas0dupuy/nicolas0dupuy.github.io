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