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