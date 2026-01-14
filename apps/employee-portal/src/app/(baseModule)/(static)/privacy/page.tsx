/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useGetEmployeePortalMarkdown } from "@/lib/baseModule/api/queries/department";
import { MarkdownPage } from "@/lib/baseModule/components/markdown/MarkdownPage";

export default function PrivacyPage() {
  const source = useGetEmployeePortalMarkdown("PRIVACY");
  return <MarkdownPage title="Datenschutzerklärung" source={source.data} />;
}
