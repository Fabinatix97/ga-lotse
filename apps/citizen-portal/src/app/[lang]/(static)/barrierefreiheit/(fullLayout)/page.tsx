/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ClientMarkdownPage } from "@/lib/baseModule/components/ClientMarkdownPage";
import { useGetCitizenPortalMarkdown } from "@/lib/shared/api/queries/department";

export default function AccessibilityPage() {
  const source = useGetCitizenPortalMarkdown("ACCESSIBILITY");
  return (
    <ClientMarkdownPage
      title="Erklärung zur Barrierefreiheit"
      source={source.data}
    />
  );
}
