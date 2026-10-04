/** One parsed bulk row ready for QR generation. */
export type BulkRow = {
  id: number;
  title: string;
  payload: string;
  valid: boolean;
};

export type CsvParseResult = {
  rows: BulkRow[];
  delimiter: "," | ";" | "\t";
  hasHeader: boolean;
  duplicates: number;
  errors: string[];
};

const HEADER_PAYLOAD_KEYS = ["url", "link", "payload", "destination", "data", "content", "text"];
const HEADER_TITLE_KEYS = ["title", "name", "label", "campaign"];

const SCHEME_RE =
  /^(https?:\/\/|www\.|wifi:|mailto:|tel:|geo:|sms:|smsto:|begin:vcard|begin:vevent|bitcoin:|ethereum:|http)/i;

function detectDelimiter(firstLine: string): "," | ";" | "\t" {
  const counts = [
    [",", (firstLine.match(/,/g) ?? []).length] as const,
    [";", (firstLine.match(/;/g) ?? []).length] as const,
    ["\t", (firstLine.match(/\t/g) ?? []).length] as const,
  ];
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0][1] > 0 ? (counts[0][0] as "," | ";" | "\t") : ",";
}

/** Split delimited text into records, honouring double-quoted cells. */
export function parseDelimited(text: string, delimiter: string): string[][] {
  const records: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      records.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    records.push(row);
  }

  return records.filter((record) => record.some((value) => value.trim() !== ""));
}

function findIndex(cells: string[], keys: string[]): number {
  return cells.findIndex((cell) => keys.includes(cell.trim().toLowerCase()));
}

function schemeLike(value: string): boolean {
  return SCHEME_RE.test(value.trim());
}

const MAX_PAYLOAD = 2000;

/**
 * Parse CSV/TSV text into bulk rows.
 * Expected shape: `title,url` with or without a header row; otherwise the first
 * scheme-looking cell is the payload and a neighbouring cell becomes the title.
 */
export function parseCsv(text: string): CsvParseResult {
  const errors: string[] = [];
  const trimmed = text.trim();
  if (!trimmed) {
    return { rows: [], delimiter: ",", hasHeader: false, duplicates: 0, errors: ["Nothing to parse."] };
  }

  const firstLine = trimmed.split(/\r?\n/, 1)[0] ?? "";
  const delimiter = detectDelimiter(firstLine);
  const records = parseDelimited(trimmed, delimiter);
  if (!records.length) {
    return { rows: [], delimiter, hasHeader: false, duplicates: 0, errors: ["No rows found."] };
  }

  const payloadKeyIndex = findIndex(records[0], HEADER_PAYLOAD_KEYS);
  const titleKeyIndex = findIndex(records[0], HEADER_TITLE_KEYS);
  const hasHeader = payloadKeyIndex !== -1 || titleKeyIndex !== -1;

  const dataRecords = hasHeader ? records.slice(1) : records;
  const fixedPayloadIndex = hasHeader && payloadKeyIndex !== -1 ? payloadKeyIndex : -1;
  const fixedTitleIndex = hasHeader && titleKeyIndex !== -1 ? titleKeyIndex : -1;

  const rows: BulkRow[] = dataRecords.map((cells, index) => {
    let payload = "";
    let title = "";

    if (fixedPayloadIndex !== -1) {
      payload = cells[fixedPayloadIndex] ?? "";
      title = fixedTitleIndex !== -1 ? (cells[fixedTitleIndex] ?? "") : "";
    } else {
      const schemeIndex = cells.findIndex((cell) => schemeLike(cell));
      const payloadIndex = schemeIndex !== -1 ? schemeIndex : cells.findIndex((cell) => cell.trim() !== "");
      if (payloadIndex === -1) {
        payload = "";
      } else {
        payload = cells[payloadIndex];
        const otherIndex = cells.findIndex(
          (cell, cellIndex) => cellIndex !== payloadIndex && cell.trim() !== "",
        );
        title = otherIndex === -1 ? "" : cells[otherIndex];
      }
    }

    const cleanPayload = payload.trim();
    const valid = cleanPayload.length > 0 && cleanPayload.length <= MAX_PAYLOAD;
    if (cleanPayload.length > MAX_PAYLOAD) {
      errors.push(`Row ${index + 1}: payload exceeds ${MAX_PAYLOAD} characters.`);
    }
    if (!cleanPayload) {
      errors.push(`Row ${index + 1}: empty payload, skipped as invalid.`);
    }

    return {
      id: index + 1,
      title: title.trim() || `Row ${index + 1}`,
      payload: cleanPayload,
      valid,
    };
  });

  const seen = new Set<string>();
  let duplicates = 0;
  for (const row of rows) {
    if (!row.valid) continue;
    if (seen.has(row.payload)) duplicates += 1;
    seen.add(row.payload);
  }

  return { rows, delimiter, hasHeader, duplicates, errors };
}

/** Serialize rows back into a downloadable `title,payload` CSV. */
export function toCsv(rows: BulkRow[]): string {
  const escape = (value: string) =>
    /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  const lines = rows.map((row) => `${escape(row.title)},${escape(row.payload)}`);
  return ["title,payload", ...lines].join("\n");
}

/** Hand-on sample so the page is usable before anyone has a CSV handy. */
export const SAMPLE_CSV = `title,url
Product Landing,https://scancraft.studio/products/tea-blend
Menu PDF,https://scancraft.studio/files/menu.pdf
Review Us,https://g.page/r/scancraft/review
WiFi Card,wifi:S:ScanCraft-Guest;T:WPA;P:welcome2025;;
Support Chat,https://wa.me/8801712345678?text=Hi%20from%20a%20QR%20scan`;
