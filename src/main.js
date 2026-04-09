const params = new URLSearchParams(window.location.search)
const url = params.get("url")

let markdown;
// Github activity

function resolveUrl(input) {
    if (!input) return null;

    try {
        new URL(input);
        return input;
    } catch (e) { }

    const parts = input.split("/");

    if (parts.length >= 4) {
        const [user, repo, branch, ...fileParts] = parts;
        const file = fileParts.join("/");

        return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${file}`;
    }

    // 3. Sinon invalide
    return 'https://raw.githubusercontent.com/frenchcast1234/markdown-preview/main/README.md';
}

const input = url || 'frenchcast1234/frenchcast1234/main/README.md';
const finalUrl = resolveUrl(input);
console.log(finalUrl);

if (!finalUrl) {
    document.getElementById("content").innerText = "Invalid URL format";
} else {
    fetch(finalUrl)
        .then(response => response.text())
        .then(data => {
            markdown = data;
            renderMarkdown();
        })
        .catch(error => {
            console.error('Error loading markdown:', error);
            document.getElementById("content").innerText = "Error loading file";
        });
}

function renderMarkdown() {
    const html = marked.parse(markdown);
    const render = DOMPurify.sanitize(html);
    document.getElementById("content").innerHTML = render;
}
