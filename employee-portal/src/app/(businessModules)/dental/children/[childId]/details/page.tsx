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
import { DisabledFormProvider } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ChildDetailsPage } from "@/lib/businessModules/dental/features/children/details/ChildDetails";

export default function DentalChildDetailsPage(
  props: DynamicPageProps<DentalChildRouteParams>,
) {
  const { childId } = useChildRouteParams(props.params);
  const { childApi } = useDentalApi();
  const childResult = useSuspenseQuery(getChildDetailsQuery(childApi, childId));
  const child = childResult.data;

  return (
    <DisabledFormProvider disabled={child.isClosed}>
      <ChildDetailsPage child={child} isFetching={childResult.isFetching} />
    </DisabledFormProvider>
  );
}
