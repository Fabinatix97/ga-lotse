/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MarkdownPage } from "@/lib/baseModule/components/MarkdownPage";
import { useGetCitizenPortalMarkdown } from "@/lib/shared/api/queries/department";

export default function PrivacyPolicyPage() {
  const source = useGetCitizenPortalMarkdown("PRIVACY");
  return <MarkdownPage title="Datenschutzerklärung" source={source.data} />;
}
