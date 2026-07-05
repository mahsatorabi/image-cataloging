const VISION_MODEL = "@cf/meta/llama-3.2-11b-vision-instruct";

export interface DetectedObject {
	label: string;
	score: number;
	box: { xmin: number; ymin: number; xmax: number; ymax: number };
}

export interface CatalogResult {
	objects: DetectedObject[];
	description: string;
	concepts: string[];
	embedding: number[];
}

function detectMime(image: ArrayBuffer): string {
	const bytes = new Uint8Array(image);
	if (bytes[0] === 0xff && bytes[1] === 0xd8) return "image/jpeg";
	if (bytes[0] === 0x89 && bytes[1] === 0x50) return "image/png";
	if (bytes[0] === 0x47 && bytes[1] === 0x49) return "image/gif";
	if (bytes[0] === 0x52 && bytes[1] === 0x49) return "image/webp";
	return "image/jpeg";
}

function toDataUrl(image: ArrayBuffer): string {
	const mime = detectMime(image);
	const bytes = new Uint8Array(image);
	const chunk = 0x8000;
	let binary = "";
	for (let i = 0; i < bytes.length; i += chunk) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	}
	return `data:${mime};base64,${btoa(binary)}`;
}

function visionText(result: unknown): string {
	if (typeof result === "string") return result;
	const obj = result as { response?: string; description?: string; result?: string };
	return obj.response ?? obj.description ?? obj.result ?? JSON.stringify(result);
}

function parseVisionPayload(raw: unknown): { description: string; concepts: string[] } {
	const text = visionText(raw);
	let description = text;
	let concepts: string[] = [];

	try {
		const jsonMatch = text.match(/\{[\s\S]*\}/);
		if (jsonMatch) {
			const parsed = JSON.parse(jsonMatch[0]) as { description?: string; concepts?: unknown };
			if (parsed.description) description = String(parsed.description);
			if (Array.isArray(parsed.concepts)) {
				concepts = parsed.concepts.map((item) => String(item).trim()).filter(Boolean);
			}
		}
	} catch {
		// use fallback below
	}

	if (!concepts.length) {
		const trimmed = text.trim();
		const arrayMatch = trimmed.match(/\[[\s\S]*\]/);
		if (arrayMatch) {
			try {
				const parsed = JSON.parse(arrayMatch[0]) as unknown;
				if (Array.isArray(parsed)) {
					concepts = parsed.map((item) => String(item).trim()).filter(Boolean);
				}
			} catch {
				// fall through
			}
		}
		if (!concepts.length) {
			concepts = trimmed
				.split(/[\n,;]+/)
				.map((line) => line.replace(/^[-*•\d.)\s]+/, "").trim())
				.filter(Boolean)
				.slice(0, 12);
		}
	}

	return { description, concepts };
}

let visionReady = false;

async function ensureVisionReady(ai: Ai): Promise<void> {
	if (visionReady) return;
	try {
		await ai.run(VISION_MODEL, { prompt: "agree" });
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		if (!message.includes("5016") && !message.includes("agreeing")) {
			throw err;
		}
	}
	visionReady = true;
}

async function detectObjects(ai: Ai, image: ArrayBuffer): Promise<DetectedObject[]> {
	try {
		const result = await ai.run("@cf/facebook/detr-resnet-50", {
			image: Array.from(new Uint8Array(image)),
		});
		return ((result as { results?: DetectedObject[] }).results ?? []).map((item) => ({
			label: item.label,
			score: item.score,
			box: item.box,
		}));
	} catch (err) {
		console.error("object detection failed:", err);
		return [];
	}
}

async function describeAndConcepts(ai: Ai, image: ArrayBuffer): Promise<{ description: string; concepts: string[] }> {
	const dataUrl = toDataUrl(image);
	const result = await ai.run(VISION_MODEL, {
		messages: [
			{ role: "system", content: "You are a helpful assistant." },
			{
				role: "user",
				content:
					"Describe this image in one paragraph, then list 5 abstract concepts/themes as a JSON array. Reply as JSON only: {\"description\":\"...\",\"concepts\":[\"...\"]}",
			},
		],
		image: dataUrl,
		max_tokens: 512,
	});
	return parseVisionPayload(result);
}

export async function catalogImage(ai: Ai, image: ArrayBuffer): Promise<CatalogResult> {
	await ensureVisionReady(ai);

	const [objects, vision] = await Promise.all([
		detectObjects(ai, image),
		describeAndConcepts(ai, image),
	]);

	const { description, concepts } = vision;
	const embedText = [description, ...concepts].join(" | ");
	const embeddingResult = await ai.run("@cf/baai/bge-base-en-v1.5", { text: [embedText] });
	const embedding = ((embeddingResult as { data?: number[][] }).data ?? [[]])[0] ?? [];

	return { objects, description, concepts, embedding };
}
