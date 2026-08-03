const toggleBtn = document.getElementById("themeToggle");

// page load pe theme apply + icon set
window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
    updateIcon();
});

// toggle click
toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }

    updateIcon();
});

// icon update function
function updateIcon() {
    toggleBtn.innerText = document.body.classList.contains("dark-mode")
        ? "☀️"
        : "🌙";
}