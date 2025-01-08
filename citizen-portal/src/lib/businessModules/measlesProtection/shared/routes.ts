/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { routes as baseRoutes } from "@/lib/baseModule/shared/routes";
import { SupportedLanguage } from "@/lib/i18n/options";
import { useGivenLang } from "@/lib/i18n/useLang";

export function routes(locale: SupportedLanguage | undefined) {
  const organizationBasePath = `${baseRoutes(locale).organizationPath.index}/masernschutz`;

  return {
    organizationPath: {
      overview: organizationBasePath,
      report: `${organizationBasePath}/meldeformular`,
    },
  } as const;
}

export type Routes = ReturnType<typeof routes>;

export function useRoutes() {
  const locale = useGivenLang();
  return routes(locale);
}
