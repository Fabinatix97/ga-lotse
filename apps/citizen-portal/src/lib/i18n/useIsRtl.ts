/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useLang } from "@/lib/i18n/useLang";

export function useIsRtl() {
  const lang = useLang();
  switch (lang) {
    case "fa":
    case "ar":
    case "prs":
      return true;
    default:
      return false;
  }
}
