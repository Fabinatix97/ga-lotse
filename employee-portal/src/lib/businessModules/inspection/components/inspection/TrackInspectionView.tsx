/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useInspectionViewed } from "@/lib/businessModules/inspection/api/queries/inspection";

interface TrackInspectionViewProps {
  inspectionId: string;
}

export function TrackInspectionView({
  inspectionId,
}: TrackInspectionViewProps) {
  useInspectionViewed(inspectionId);

  return false;
}
