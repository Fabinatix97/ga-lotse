/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export function formatFileSize(bytes: number) {
  const kilo = 1024;
  const mega = 1024 * 1024;
  if (bytes < mega) return `${(bytes / kilo).toFixed(1)} KB`;
  return `${(bytes / mega).toFixed(1)} MB`;
}

/**
 * Normalizes a file name so it complies with the strict backend regex
 * ^([A-Za-z0-9\-_]+\.[A-Za-z0-9]+)$ by
 * - keeping the original extension (sanitized to alphanumerics)
 * - converting umlauts/accents to ASCII
 * - replacing any disallowed character (spaces, parentheses, etc.) with '-'
 * - collapsing duplicate separators and trimming
 */
export function normalizeFileName(file: File | null): File | null {
  if (file === null) return null;

  const { name, type, lastModified } = file;
  const parts = name.split(".");

  if (parts.length < 2) {
    // No extension - keep original and let backend/validator handle rejection
    return file;
  }

  const extensionRaw = parts.pop() ?? "";
  const baseRaw = parts.join(".");

  const extension = sanitizeExtension(extensionRaw);
  const base = sanitizeBaseName(baseRaw);

  const safeBase = base.length > 0 ? base : "file";
  const safeExtension = extension.length > 0 ? extension : "bin";

  const normalizedName = `${safeBase}.${safeExtension}`;

  return new File([file], normalizedName, { type, lastModified });
}

function sanitizeExtension(ext: string) {
  return ext.replace(/[^A-Za-z0-9]/g, "");
}

function sanitizeBaseName(base: string) {
  // Pre-map common German umlauts before stripping accents
  const preMapped = base
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/Ä/g, "Ae")
    .replace(/Ö/g, "Oe")
    .replace(/Ü/g, "Ue")
    .replace(/ß/g, "ss");

  return preMapped
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^A-Za-z0-9\-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "");
}
