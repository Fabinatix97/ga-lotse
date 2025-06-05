/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Switch } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";

export function LanguageSwitch() {
  const { i18n, t } = useTranslation();
  const supportedLngs = {
    de: "de",
    en: "en",
  };

  return (
    <Switch
      key="language-switch"
      color="primary"
      size="sm"
      variant="outlined"
      checked={i18n.resolvedLanguage === "en"}
      startDecorator={supportedLngs.de.toUpperCase()}
      endDecorator={supportedLngs.en.toUpperCase()}
      slotProps={{
        input: {
          "aria-label": t("toggleLanguage"),
        },
      }}
      onClick={() =>
        i18n.changeLanguage(i18n.resolvedLanguage === "de" ? "en" : "de")
      }
    />
  );
}
