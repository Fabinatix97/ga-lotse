/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useGetEmployeePortalMarkdown } from "@/lib/baseModule/api/queries/department";
import { MarkdownPage } from "@/lib/baseModule/components/markdown/MarkdownPage";

export default function AccessibilityPage() {
  const source = useGetEmployeePortalMarkdown("ACCESSIBILITY");
  return (
    <MarkdownPage title="Erklärung zur Barrierefreiheit" source={source.data} />
  );
}
