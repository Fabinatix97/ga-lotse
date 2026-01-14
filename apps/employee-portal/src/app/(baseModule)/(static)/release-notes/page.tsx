/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useGetReleaseNotesMarkdown } from "@/lib/baseModule/api/queries/department";
import { MarkdownPage } from "@/lib/baseModule/components/markdown/MarkdownPage";

export default function ReleaseNotesPage() {
  const source = useGetReleaseNotesMarkdown();
  return <MarkdownPage title="Release Notes" source={source.data} />;
}
