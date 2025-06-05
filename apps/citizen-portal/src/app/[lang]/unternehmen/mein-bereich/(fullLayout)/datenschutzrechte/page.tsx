/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { GdprRightsOverview } from "@/lib/baseModule/components/gdpr/page/GdprRightsOverviewPage";

export default function OrganizationGdprOverview() {
  return <GdprRightsOverview userType="organization" />;
}
