/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isNullish } from "remeda";

import { ApiLanguage } from "@eshg/base-api";

import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";

export async function buildOptionalFilePayload(
  value: ConfigFile | null | undefined,
  downloadFn: () => Promise<Blob>,
  name: string,
  mimeType: string,
) {
  return isNullish(value)
    ? undefined
    : await buildFilePayload(value, downloadFn, name, mimeType);
}

export async function buildFilePayload(
  value: ConfigFile,
  downloadFn: () => Promise<Blob>,
  name: string,
  mimeType: string,
) {
  return value instanceof File
    ? value
    : new File([await downloadFn()], name, {
        type: mimeType,
      });
}

export async function buildMultiLanguagePayload(
  { de, en }: { de: ConfigFile; en?: ConfigFile },
  downloadFn: (lang: ApiLanguage) => Promise<Blob>,
  name: string,
  mimeType: string,
): Promise<{ de: File; en?: File }> {
  return {
    de: await buildFilePayload(
      de,
      () => downloadFn(ApiLanguage.German),
      name,
      mimeType,
    ),
    en: await buildOptionalFilePayload(
      en,
      () => downloadFn(ApiLanguage.English),
      name,
      mimeType,
    ),
  };
}
