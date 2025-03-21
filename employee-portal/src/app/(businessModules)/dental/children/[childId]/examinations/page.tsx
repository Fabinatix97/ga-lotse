/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  DentalChildRouteParams,
  getChildDetailsQuery,
  useChildRouteParams,
  useDentalApi,
} from "@eshg/dental";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ExaminationsTable } from "@/lib/businessModules/dental/features/children/details/ExaminationsTable";

export default function DentalChildExaminationsPage(
  props: DynamicPageProps<DentalChildRouteParams>,
) {
  const { childId } = useChildRouteParams(props.params);
  const { childApi } = useDentalApi();
  const { data: child } = useSuspenseQuery(
    getChildDetailsQuery(childApi, childId),
  );

  return (
    <ExaminationsTable examinations={child.examinations} childId={childId} />
  );
}
