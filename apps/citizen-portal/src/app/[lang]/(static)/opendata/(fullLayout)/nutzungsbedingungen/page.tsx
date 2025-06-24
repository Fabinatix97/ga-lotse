/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MarkdownPage } from "@/lib/baseModule/components/MarkdownPage";
import { useGetTermsOfUse } from "@/lib/businessModules/opendata/api/queries/citizenPublicApi";

export default function OpenDataTermsOfUsePage() {
  const source = useGetTermsOfUse();
  return <MarkdownPage title="Nutzungsbedingungen" source={source.data} />;
}
