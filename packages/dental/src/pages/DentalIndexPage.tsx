/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { redirect } from "next/navigation";

import { routes } from "@/shared/routes";

export function DentalIndexPage() {
  redirect(routes.prophylaxisSessions.overview);
}
