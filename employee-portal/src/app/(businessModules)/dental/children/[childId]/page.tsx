/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { redirect } from "next/navigation";

import { DentalChildPageProps } from "@/app/(businessModules)/dental/children/[childId]/layout";
import { routes } from "@/lib/businessModules/dental/shared/routes";

export default function DentalChildIndexPage(props: DentalChildPageProps) {
  redirect(routes.children.byId(props.params.childId).details);
}
