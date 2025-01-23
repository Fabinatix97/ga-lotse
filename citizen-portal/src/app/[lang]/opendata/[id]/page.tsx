/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useParams } from "next/navigation";

import { OpenDataDetailsContent } from "@/lib/businessModules/opendata/components/OpenDataDetailsContent";

export default function OpenDataDetailsPage() {
  const { id } = useParams<{ id: string }>();
  return <OpenDataDetailsContent versionId={id} />;
}
