async function loadComponent(containerId, path, name) {
    try {
        const htmlResponse = await fetch(`${path}/${name}.html`);
        if (!htmlResponse.ok) return;

        const html = await htmlResponse.text();
        document.getElementById(containerId).innerHTML = html;

        const cssPath = `${path}/${name}.css`;
        const oldLink = document.querySelector(`link[href="${cssPath}"]`);
        if (oldLink) oldLink.remove();

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssPath;
        document.head.appendChild(link);

        const jsPath = `${path}/${name}.js`;
        const oldScript = document.querySelector(`script[src="${jsPath}"]`);
        if (oldScript) oldScript.remove();

        try {
            const jsResponse = await fetch(jsPath);
            if (jsResponse.ok) {
                const script = document.createElement("script");
                script.src = jsPath;
                document.body.appendChild(script);
            }
        } catch (e) { }

    } catch (error) {
        console.error(error);
    }
}

function loadPage(pageName) {
    loadComponent("content-placeholder", `pages/${pageName}`, pageName);
}

window.onload = () => {
    loadComponent("navbar-container", "components/navbar", "navbar");
    loadComponent("footer-container", "components/footer", "footer");
    loadPage("home");
};