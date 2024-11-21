/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { redirect } from "next/navigation";

import { routes } from "@/lib/businessModules/dental/shared/routes";

export default function DentalIndexPage() {
  redirect(routes.procedures.overview);
}
