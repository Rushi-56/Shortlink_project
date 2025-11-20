// Handle form submit
const form = document.getElementById('shortenForm');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const longUrl = document.getElementById('longUrl').value;
        const customAlias = document.getElementById('customAlias').value;
        const title = document.getElementById('title').value;

        try {
            const res = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ longUrl, customAlias, title })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Server Error");
                return;
            }

            document.getElementById('result').style.display = 'block';
            document.getElementById('shortLink').href = data.shortUrl;
            document.getElementById('shortLink').innerText = data.shortUrl;
            document.getElementById('clickCount').innerText = data.clicks;

        } catch (err) {
            alert("Server Error");
        }
    });
}

// Load admin table
async function loadAdminLinks() {
    const container = document.getElementById('linksTable');
    if (!container) return;

    const res = await fetch('/api/links');
    const links = await res.json();

    if (!Array.isArray(links)) {
        container.innerHTML = "<p>Error loading links</p>";
        return;
    }

    let html = `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Short</th>
          <th>Long</th>
          <th>Clicks</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
    `;

    links.forEach(link => {
        html += `
          <tr>
            <td>${link.id}</td>
            <td><a href="/${link.short_code}" target="_blank">${link.short_code}</a></td>
            <td>${link.long_url}</td>
            <td>${link.clicks}</td>
            <td>${new Date(link.created_at).toLocaleString()}</td>
          </tr>
        `;
    });

    html += "</tbody></table>";
    container.innerHTML = html;
}

// Load admin links if admin.html
loadAdminLinks();
