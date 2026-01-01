/**
 * loadComponent
 * -------------
 * פונקציה אסינכרונית לטעינת רכיבי אתר (HTML, CSS, JS) בצורה דינמית.
 * משמשת לטעינת קומפוננטות כמו Navbar ו-Footer לפי נתיב בסיס.
 *
 * @param {string} containerId - ה-ID של האלמנט שבו יוזרק ה-HTML
 * @param {string} basePath - נתיב בסיס לקבצי הקומפוננטה (ללא סיומת)
 */
async function loadComponent(containerId, basePath) {

    // איתור אלמנט היעד בדף
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        // טעינת קובץ HTML
        const htmlResponse = await fetch(`${basePath}.html`);
        if (htmlResponse.ok) {
            container.innerHTML = await htmlResponse.text();
        } else {
            console.error(`Failed to load HTML for ${basePath}`);
            return;
        }

        // טעינת קובץ CSS אם לא נטען עדיין
        if (!document.querySelector(`link[href="${basePath}.css"]`)) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = `${basePath}.css`;
            document.head.appendChild(link);
        }

        // טעינת קובץ JavaScript 
        // הסרת סקריפט קודם אם קיים (למניעת כפילויות)
        const scriptPath = `${basePath}.js`;
        const oldScript = document.querySelector(`script[src="${scriptPath}"]`);
        if (oldScript) oldScript.remove();

        // הוספת סקריפט חדש לדף
        const script = document.createElement("script");
        script.src = scriptPath;
        document.body.appendChild(script);

    } catch (error) {
        // טיפול בשגיאות טעינה
        console.error(`Error loading component ${basePath}:`, error);
    }
}
