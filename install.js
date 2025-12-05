let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const installBtn = document.getElementById("installBtn");
    installBtn.style.display = "block";

    installBtn.addEventListener("click", async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;

        console.log("User choice:", result.outcome);

        deferredPrompt = null;
        installBtn.style.display = "none";
    });
});
