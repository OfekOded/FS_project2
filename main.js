async function loadComponent(containerId, basePath) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const htmlResponse = await fetch(`${basePath}.html`);
        if (htmlResponse.ok) {
            container.innerHTML = await htmlResponse.text();
        } else {
            console.error(`Failed to load HTML for ${basePath}`);
            return;
        }

      
        if (!document.querySelector(`link[href="${basePath}.css"]`)) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = `${basePath}.css`;
            document.head.appendChild(link);
        }

        const scriptPath = `${basePath}.js`;
        const oldScript = document.querySelector(`script[src="${scriptPath}"]`);
        if (oldScript) oldScript.remove();

        const script = document.createElement("script");
        script.src = scriptPath;
        document.body.appendChild(script);

    } catch (error) {
        console.error(`Error loading component ${basePath}:`, error);
    }
}