async function loadComponent(containerId, path, name) {
    const response = await fetch(`${path}/${name}.html`);
    const html = await response.text();
    document.getElementById(containerId).innerHTML = html;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${path}/${name}.css`;
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = `${path}/${name}.js`;
    document.body.appendChild(script);
}

function loadPage(pageName) {
    loadComponent("content-placeholder", `pages/${pageName}`, pageName);
}

window.onload = () => {
    loadComponent("navbar-container", "components/navbar", "navbar");
    loadPage("home");
};