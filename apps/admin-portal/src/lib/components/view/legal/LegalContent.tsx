/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";

import { ContentHeader } from "@/lib/components/layout/page/header/ContentHeader";
import { useTranslation } from "@/lib/i18n/client";

export function LegalContent({
  category,
}: Readonly<{
  category: string;
}>) {
  const { t } = useTranslation();

  return (
    <>
      <ContentHeader title={t(`legal.${category}.title`)} />
      <Typography>
        <div
          dangerouslySetInnerHTML={{
            __html: t(`legal.${category}.content`, {
              joinArrays: " ",
              interpolation: { escapeValue: false },
            }),
          }}
        />
      </Typography>
    </>
  );
}
