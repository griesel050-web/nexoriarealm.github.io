// Simple scroll effect
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {
        navbar.style.background = "#000";
        navbar.style.boxShadow = "0 2px 10px rgba(139,0,0,0.5)";
    } else {
        navbar.style.boxShadow = "none";
    }
});

// Example future functionality placeholder
console.log("Nexoria site loaded ✔️");