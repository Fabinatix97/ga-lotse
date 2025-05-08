/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ClientMarkdownPage } from "@/lib/baseModule/components/ClientMarkdownPage";
import { useGetCitizenPortalMarkdown } from "@/lib/shared/api/queries/department";

export default function PrivacyPolicyPage() {
  const source = useGetCitizenPortalMarkdown("PRIVACY");
  return (
    <ClientMarkdownPage title="Datenschutzerklärung" source={source.data} />
  );
}
