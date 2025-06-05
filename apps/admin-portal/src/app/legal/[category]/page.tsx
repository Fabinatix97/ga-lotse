/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useParams } from "next/navigation";

import { LegalContent } from "@/lib/components/view/legal/LegalContent";

export default function Page() {
  const { category } = useParams<{ category: string }>();
  return <LegalContent category={category} />;
}
