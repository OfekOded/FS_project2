async function loadComponent(containerId, folderPath, fileName) {
    const response = await fetch(`${folderPath}/${fileName}.html`);
    const html = await response.text();
    document.getElementById(containerId).innerHTML = html;

    const cssId = `css-${fileName}`;
    if (!document.getElementById(cssId)) {
        const link = document.createElement("link");
        link.id = cssId;
        link.rel = "stylesheet";
        link.href = `${folderPath}/${fileName}.css`;
        document.head.appendChild(link);
    }

    const script = document.createElement("script");
    script.src = `${folderPath}/${fileName}.js`;
    document.body.appendChild(script);
}

window.onload = () => {
    loadComponent("navbar-container", "components/navbar", "navbar");
    loadComponent("content-placeholder", "pages/home", "home");
};