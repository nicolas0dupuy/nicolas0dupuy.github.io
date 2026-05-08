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

const roles = ["researcher", "data scientist"];
let roleIndex = 0;
const roleElement = document.getElementById("role-loop");

if (roleElement) {
    setInterval(() => {
        roleIndex = (roleIndex + 1) % roles.length;
        roleElement.textContent = roles[roleIndex];
    }, 2500);
}