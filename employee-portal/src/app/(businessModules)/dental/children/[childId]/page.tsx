/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { routes } from "@eshg/dental";
import { redirect } from "next/navigation";

import { DentalChildPageProps } from "@/app/(businessModules)/dental/children/[childId]/layout";

export default function DentalChildIndexPage(props: DentalChildPageProps) {
  redirect(routes.children.byId(props.params.childId).details);
}
