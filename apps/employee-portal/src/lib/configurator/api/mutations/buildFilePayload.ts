/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
import { SupportedLanguage, supportedLanguages } from "@/lib/i18n/language";

export async function buildFilePayload(
  value: ConfigFile,
  downloadFn: () => Promise<Blob>,
  name: string,
  mimeType: string,
) {
  if (value instanceof File) {
    return new File([value], name, { type: value.type });
  }

  return new File([await downloadFn()], name, {
    type: mimeType,
  });
}

export async function buildMultiLanguagePayload(
  multiLangDocument: { de: ConfigFile } & Partial<
    Record<SupportedLanguage, ConfigFile>
  >,
  downloadFn: (lang: SupportedLanguage) => Promise<Blob>,
  fileType: "md" | "csv" | "pdf",
): Promise<File[]> {
  const mimeType =
    fileType === "md"
      ? "text/markdown"
      : fileType === "pdf"
        ? "application/pdf"
        : "text/csv";

  return await Promise.all(
    supportedLanguages
      .filter((it) => multiLangDocument[it])
      .map((lang) =>
        buildFilePayload(
          multiLangDocument[lang]!,
          () => downloadFn(lang),
          `${lang}.${fileType}`,
          mimeType,
        ),
      ),
  );
}
