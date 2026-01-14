/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { NextGenerationEULogo } from "@eshg/lib-portal";

import { MarkdownPage } from "@/lib/baseModule/components/MarkdownPage";
import { useGetCitizenPortalMarkdown } from "@/lib/shared/api/queries/department";

export default function ImprintPage() {
  const source = useGetCitizenPortalMarkdown("IMPRINT");
  return (
    <MarkdownPage
      title="Impressum"
      source={source.data}
      footer={<NextGenerationEULogo />}
    />
  );
}
