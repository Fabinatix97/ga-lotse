/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { routes } from "@eshg/dental";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { redirect } from "next/navigation";

import { DentalChildRouteParams } from "@/app/(businessModules)/dental/children/[childId]/layout";

export default function DentalChildIndexPage(
  props: DynamicPageProps<DentalChildRouteParams>,
) {
  const { childId } = props.params;

  redirect(routes.children.byId(childId).details);
}
