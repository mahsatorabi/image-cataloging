import { catalogImage } from "./catalog";

const UI = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Image Catalog — Objects · Describe · Concepts</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    :root {
      --bg: #0c0e14;
      --surface: rgba(255,255,255,.06);
      --surface-hover: rgba(255,255,255,.09);
      --border: rgba(255,255,255,.1);
      --text: #f0f2f8;
      --muted: #9aa3b5;
      --accent: #7c6cff;
      --accent-2: #4ecdc4;
      --accent-3: #ff8fab;
      --glow: rgba(124,108,255,.35);
      --radius: 16px;
      --shadow: 0 24px 48px rgba(0,0,0,.45);
    }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: "DM Sans", system-ui, sans-serif;
      color: var(--text);
      background: var(--bg);
      background-image:
        radial-gradient(ellipse 80% 60% at 50% -20%, rgba(124,108,255,.22), transparent),
        radial-gradient(ellipse 50% 40% at 100% 0%, rgba(78,205,196,.12), transparent),
        radial-gradient(ellipse 40% 30% at 0% 100%, rgba(255,143,171,.1), transparent);
    }
    .wrap { max-width: 880px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }
    header { text-align: center; margin-bottom: 2.5rem; }
    .badge {
      display: inline-flex; align-items: center; gap: .4rem;
      padding: .35rem .85rem; border-radius: 999px;
      background: rgba(124,108,255,.15); border: 1px solid rgba(124,108,255,.3);
      color: #c4baff; font-size: .78rem; font-weight: 500; margin-bottom: 1rem;
    }
    h1 {
      margin: 0 0 .75rem; font-size: clamp(1.6rem, 4vw, 2.2rem); font-weight: 700;
      background: linear-gradient(135deg, #fff 30%, #b8b0ff);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .subtitle { color: var(--muted); font-size: 1rem; line-height: 1.7; max-width: 520px; margin: 0 auto; }
    .layers { display: grid; gap: 1.25rem; margin-top: 2rem; }
    .upload-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 1.5rem; backdrop-filter: blur(12px);
      box-shadow: var(--shadow);
    }
    .dropzone {
      position: relative; border: 2px dashed rgba(124,108,255,.4);
      border-radius: 14px; padding: 2.5rem 1.5rem; text-align: center;
      cursor: pointer; transition: border-color .2s, background .2s, transform .2s;
      background: rgba(124,108,255,.04);
    }
    .dropzone:hover, .dropzone.dragover {
      border-color: var(--accent); background: rgba(124,108,255,.1); transform: translateY(-1px);
    }
    .dropzone.has-file { border-style: solid; border-color: rgba(78,205,196,.5); padding: 1.25rem; }
    .dropzone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
    .dz-icon {
      width: 56px; height: 56px; margin: 0 auto 1rem;
      border-radius: 14px; display: grid; place-items: center;
      background: linear-gradient(135deg, var(--accent), #5b4fd4); font-size: 1.6rem;
      box-shadow: 0 8px 24px var(--glow);
    }
    .dz-title { font-weight: 600; font-size: 1.05rem; margin-bottom: .35rem; }
    .dz-hint { color: var(--muted); font-size: .88rem; }
    .preview-wrap { display: none; align-items: center; gap: 1.25rem; text-align: left; }
    .dropzone.has-file .preview-wrap { display: flex; }
    .dropzone.has-file .dz-empty { display: none; }
    .preview-img {
      width: 96px; height: 96px; object-fit: cover; border-radius: 12px;
      border: 2px solid rgba(255,255,255,.15); flex-shrink: 0;
    }
    .preview-meta { flex: 1; min-width: 0; }
    .preview-name { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .preview-size { color: var(--muted); font-size: .85rem; margin-top: .2rem; }
    .btn-row { display: flex; gap: .75rem; margin-top: 1.25rem; flex-wrap: wrap; }
    .btn {
      flex: 1; min-width: 140px; padding: .85rem 1.5rem; border: none; border-radius: 12px;
      font-family: inherit; font-size: .95rem; font-weight: 600; cursor: pointer;
      transition: transform .15s, box-shadow .15s, opacity .15s;
    }
    .btn:disabled { opacity: .55; cursor: not-allowed; transform: none !important; }
    .btn-primary {
      background: linear-gradient(135deg, var(--accent), #5b4fd4); color: #fff;
      box-shadow: 0 8px 28px var(--glow);
    }
    .btn-primary:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 12px 32px var(--glow); }
    .btn-ghost {
      background: transparent; color: var(--muted); border: 1px solid var(--border);
    }
    .btn-ghost:hover { background: var(--surface-hover); color: var(--text); }
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 1.35rem 1.5rem;
      backdrop-filter: blur(10px); animation: fadeUp .45s ease both;
    }
    .card:nth-child(1) { animation-delay: .05s; }
    .card:nth-child(2) { animation-delay: .12s; }
    .card:nth-child(3) { animation-delay: .19s; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
    .card-head { display: flex; align-items: center; gap: .75rem; margin-bottom: 1rem; }
    .card-icon {
      width: 40px; height: 40px; border-radius: 10px; display: grid; place-items: center; font-size: 1.1rem;
    }
    .card-icon.objects { background: rgba(124,108,255,.2); }
    .card-icon.describe { background: rgba(78,205,196,.2); }
    .card-icon.concepts { background: rgba(255,143,171,.2); }
    .card h2 { margin: 0; font-size: 1rem; font-weight: 600; }
    .card .layer-num { font-size: .75rem; color: var(--muted); font-weight: 400; }
    .desc-text { line-height: 1.85; color: #d8dce8; font-size: .98rem; }
    .tags { display: flex; flex-wrap: wrap; gap: .5rem; }
    .tag {
      padding: .4rem .85rem; border-radius: 999px; font-size: .82rem; font-weight: 500;
      background: rgba(255,143,171,.12); border: 1px solid rgba(255,143,171,.25); color: #ffc4d4;
    }
    .obj-list { display: flex; flex-direction: column; gap: .6rem; }
    .obj-item {
      display: flex; align-items: center; justify-content: space-between; gap: .75rem;
      padding: .65rem .85rem; border-radius: 10px; background: rgba(255,255,255,.04);
      border: 1px solid rgba(255,255,255,.06);
    }
    .obj-label { font-weight: 500; text-transform: capitalize; }
    .obj-score {
      font-size: .78rem; padding: .2rem .55rem; border-radius: 6px;
      background: rgba(124,108,255,.2); color: #c4baff; white-space: nowrap;
    }
    .empty-state { color: var(--muted); font-size: .9rem; font-style: italic; }
    .loading-card {
      text-align: center; padding: 2.5rem 1.5rem;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); backdrop-filter: blur(10px);
    }
    .spinner {
      width: 48px; height: 48px; margin: 0 auto 1.25rem;
      border: 3px solid rgba(124,108,255,.2); border-top-color: var(--accent);
      border-radius: 50%; animation: spin .9s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .steps { display: flex; justify-content: center; gap: .5rem; margin-top: 1rem; flex-wrap: wrap; }
    .step {
      padding: .35rem .75rem; border-radius: 8px; font-size: .78rem;
      background: rgba(255,255,255,.05); color: var(--muted); border: 1px solid transparent;
      transition: all .3s;
    }
    .step.active { color: #c4baff; border-color: rgba(124,108,255,.4); background: rgba(124,108,255,.12); }
    .step.done { color: #7dffd8; border-color: rgba(78,205,196,.3); background: rgba(78,205,196,.1); }
    .error-card { border-color: rgba(255,100,100,.35); background: rgba(255,80,80,.08); }
    .error-card pre { color: #ffb4b4; white-space: pre-wrap; word-break: break-word; margin: 0; font-size: .88rem; }
    footer { text-align: center; margin-top: 3rem; color: var(--muted); font-size: .8rem; }
    footer a { color: #a89fff; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>Smart Image Catalog</h1>
      <p class="subtitle">Upload an image — three layers of <strong>objects</strong>, <strong>description</strong>, and <strong>concepts</strong> are extracted automatically.</p>
    </header>

    <div class="upload-card">
      <form id="form">
        <label class="dropzone" id="dropzone">
          <input type="file" name="image" accept="image/*" required />
          <div class="dz-empty">
            <div class="dz-icon">🖼</div>
            <div class="dz-title">Drop your image here</div>
            <div class="dz-hint">or click to browse — JPG, PNG, WebP up to 5 MB</div>
          </div>
          <div class="preview-wrap">
            <img class="preview-img" id="preview" alt="" />
            <div class="preview-meta">
              <div class="preview-name" id="fname"></div>
              <div class="preview-size" id="fsize"></div>
            </div>
          </div>
        </label>
        <div class="btn-row">
          <button type="submit" class="btn btn-primary" id="submitBtn">Analyze image</button>
          <button type="button" class="btn btn-ghost" id="clearBtn">Clear</button>
        </div>
      </form>
    </div>

    <div id="out" class="layers"></div>

    <footer>Image catalog · Objects · Describe · Concepts</footer>
  </div>

  <script>
    const form = document.getElementById("form");
    const out = document.getElementById("out");
    const dropzone = document.getElementById("dropzone");
    const fileInput = form.querySelector('input[type="file"]');
    const preview = document.getElementById("preview");
    const fname = document.getElementById("fname");
    const fsize = document.getElementById("fsize");
    const submitBtn = document.getElementById("submitBtn");
    const clearBtn = document.getElementById("clearBtn");

    function esc(s) {
      return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
    }
    function fmtSize(b) {
      if (b < 1024) return b + " B";
      if (b < 1048576) return (b/1024).toFixed(1) + " KB";
      return (b/1048576).toFixed(1) + " MB";
    }
    function showPreview(file) {
      if (!file) { dropzone.classList.remove("has-file"); return; }
      dropzone.classList.add("has-file");
      fname.textContent = file.name;
      fsize.textContent = fmtSize(file.size);
      preview.src = URL.createObjectURL(file);
    }
    fileInput.addEventListener("change", () => showPreview(fileInput.files[0]));
    clearBtn.addEventListener("click", () => {
      fileInput.value = "";
      showPreview(null);
      out.innerHTML = "";
    });
    ["dragenter","dragover"].forEach(ev => dropzone.addEventListener(ev, e => {
      e.preventDefault(); dropzone.classList.add("dragover");
    }));
    ["dragleave","drop"].forEach(ev => dropzone.addEventListener(ev, e => {
      e.preventDefault(); dropzone.classList.remove("dragover");
      if (ev === "drop" && e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        showPreview(fileInput.files[0]);
      }
    }));
    function renderObjects(objects) {
      if (!objects || !objects.length) return '<p class="empty-state">No objects detected — the image may be abstract or too busy.</p>';
      return '<div class="obj-list">' + objects.map(o =>
        '<div class="obj-item"><span class="obj-label">' + esc(o.label) + '</span>' +
        '<span class="obj-score">' + Math.round((o.score||0)*100) + '% confidence</span></div>'
      ).join("") + '</div>';
    }
    function loadingHtml() {
      return '<div class="loading-card"><div class="spinner"></div>' +
        '<div style="font-weight:600;margin-bottom:.25rem">Analyzing image…</div>' +
        '<div style="color:var(--muted);font-size:.88rem">Usually takes 15–60 seconds</div>' +
        '<div class="steps" id="steps">' +
        '<span class="step active" data-step="1">1 · Objects</span>' +
        '<span class="step" data-step="2">2 · Describe</span>' +
        '<span class="step" data-step="3">3 · Concepts</span></div></div>';
    }
    let stepTimer;
    function animateSteps() {
      let i = 0;
      stepTimer = setInterval(() => {
        const steps = document.querySelectorAll(".step");
        if (!steps.length) { clearInterval(stepTimer); return; }
        steps.forEach((s, j) => {
          s.classList.toggle("active", j === i);
          s.classList.toggle("done", j < i);
        });
        i = (i + 1) % 3;
      }, 4000);
    }
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!fileInput.files[0]) return;
      submitBtn.disabled = true;
      clearBtn.disabled = true;
      out.innerHTML = loadingHtml();
      animateSteps();
      try {
        const fd = new FormData(form);
        const res = await fetch("/api/catalog", { method: "POST", body: fd });
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } catch { data = { error: text || "Unknown server error" }; }
        clearInterval(stepTimer);
        if (!res.ok) {
          out.innerHTML = '<div class="card error-card"><div class="card-head"><div class="card-icon objects">⚠</div><div><h2>Error</h2></div></div><pre>' + esc(JSON.stringify(data, null, 2)) + '</pre></div>';
          return;
        }
        out.innerHTML =
          '<div class="card"><div class="card-head"><div class="card-icon objects">◎</div><div><div class="layer-num">Layer 1</div><h2>Detected objects</h2></div></div>' + renderObjects(data.objects) + '</div>' +
          '<div class="card"><div class="card-head"><div class="card-icon describe">✎</div><div><div class="layer-num">Layer 2</div><h2>Image description</h2></div></div><p class="desc-text">' + esc(data.description) + '</p></div>' +
          '<div class="card"><div class="card-head"><div class="card-icon concepts">◈</div><div><div class="layer-num">Layer 3</div><h2>Concepts & themes</h2></div></div><div class="tags">' +
          (data.concepts||[]).map(c => '<span class="tag">' + esc(c) + '</span>').join("") +
          '</div></div>';
      } catch (err) {
        clearInterval(stepTimer);
        out.innerHTML = '<div class="card error-card"><div class="card-head"><h2>Error</h2></div><pre>' + esc(err.message || err) + '</pre></div>';
      } finally {
        submitBtn.disabled = false;
        clearBtn.disabled = false;
      }
    });
  </script>
</body>
</html>`;

function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data, null, 2), {
		status,
		headers: { "content-type": "application/json" },
	});
}

function newId(): string {
	return crypto.randomUUID();
}

function isUploadFile(value: string | File | null): value is File {
	return value !== null && typeof value !== "string";
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
			return new Response(UI, { headers: { "content-type": "text/html; charset=utf-8" } });
		}

		if (request.method === "POST" && url.pathname === "/api/catalog") {
			try {
				const form = await request.formData();
				const file = form.get("image");
				if (!isUploadFile(file)) {
					return json({ error: "Missing image file" }, 400);
				}

				const image = await file.arrayBuffer();
				if (image.byteLength > 5 * 1024 * 1024) {
					return json({ error: "Image too large. Please use a file under 5 MB." }, 413);
				}

				const id = newId();
				const r2Key = `images/${id}`;

				if (env.IMAGES) {
					await env.IMAGES.put(r2Key, image, {
						httpMetadata: { contentType: file.type || "image/jpeg" },
					});
				}

				const catalog = await catalogImage(env.AI, image);

				await env.DB.prepare(
					`INSERT INTO images (id, filename, content_type, r2_key) VALUES (?, ?, ?, ?)`,
				)
					.bind(id, file.name, file.type || "image/jpeg", env.IMAGES ? r2Key : null)
					.run();

				await env.DB.prepare(
					`INSERT INTO catalog_layers (image_id, objects_json, description, concepts_json, embedding_json)
           VALUES (?, ?, ?, ?, ?)`,
				)
					.bind(
						id,
						JSON.stringify(catalog.objects),
						catalog.description,
						JSON.stringify(catalog.concepts),
						JSON.stringify(catalog.embedding),
					)
					.run();

				return json({
					id,
					objects: catalog.objects,
					description: catalog.description,
					concepts: catalog.concepts,
				});
			} catch (err) {
				const message = err instanceof Error ? err.message : String(err);
				console.error("catalog failed:", message);
				return json({ error: message }, 500);
			}
		}

		if (request.method === "GET" && url.pathname.startsWith("/api/catalog/")) {
			const id = url.pathname.split("/").pop();
			if (!id) return json({ error: "Missing id" }, 400);

			const row = await env.DB.prepare(
				`SELECT i.id, i.filename, i.content_type, i.r2_key, i.created_at,
                c.objects_json, c.description, c.concepts_json
         FROM images i
         JOIN catalog_layers c ON c.image_id = i.id
         WHERE i.id = ?`,
			)
				.bind(id)
				.first();

			if (!row) return json({ error: "Not found" }, 404);

			return json({
				id: row.id,
				filename: row.filename,
				content_type: row.content_type,
				created_at: row.created_at,
				objects: JSON.parse(String(row.objects_json)),
				description: row.description,
				concepts: JSON.parse(String(row.concepts_json)),
			});
		}

		if (request.method === "GET" && url.pathname === "/api/search") {
			const q = url.searchParams.get("q")?.trim();
			if (!q) return json({ error: "Missing q parameter" }, 400);

			const embedResult = await env.AI.run("@cf/baai/bge-base-en-v1.5", { text: [q] });
			const queryVec = ((embedResult as { data?: number[][] }).data ?? [[]])[0] ?? [];

			const rows = await env.DB.prepare(
				`SELECT image_id, description, concepts_json, embedding_json FROM catalog_layers`,
			).all();

			type CatalogRow = {
				image_id: string;
				description: string;
				concepts_json: string;
				embedding_json: string;
			};

			const scored = ((rows.results ?? []) as CatalogRow[])
				.map((row) => {
					const vec = JSON.parse(String(row.embedding_json)) as number[];
					let dot = 0;
					let normA = 0;
					let normB = 0;
					for (let i = 0; i < Math.min(vec.length, queryVec.length); i++) {
						dot += vec[i] * queryVec[i];
						normA += vec[i] * vec[i];
						normB += queryVec[i] * queryVec[i];
					}
					const score = dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
					return {
						id: row.image_id,
						description: row.description,
						concepts: JSON.parse(String(row.concepts_json)),
						score,
					};
				})
				.sort((a, b) => b.score - a.score)
				.slice(0, 10);

			return json({ query: q, results: scored });
		}

		return json({ error: "Not found" }, 404);
	},
} satisfies ExportedHandler<Env>;
