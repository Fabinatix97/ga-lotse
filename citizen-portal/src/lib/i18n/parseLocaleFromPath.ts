/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SupportedLanguage, options } from "./options";

export function parseLocaleFromPath(
  pathname: string,
): SupportedLanguage | undefined {
  const pathPrefix = pathname.split("/").find((t) => t) ?? "";
  const exactMatch = options.supportedLngs.indexOf(
    pathPrefix as SupportedLanguage,
  );
  if (exactMatch != -1) {
    return options.supportedLngs[exactMatch];
  }
  const pathPrefixDash = `${pathPrefix}-`;
  return options.supportedLngs.find((t) => t.startsWith(pathPrefixDash));
}
