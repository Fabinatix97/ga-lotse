/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { getChildDetailsQuery, useDentalApi } from "@eshg/dental";
import { DisabledFormProvider } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { useSuspenseQuery } from "@tanstack/react-query";

import { DentalChildPageProps } from "@/app/(businessModules)/dental/children/[childId]/layout";
import { ChildDetailsPage } from "@/lib/businessModules/dental/features/children/details/ChildDetails";

export default function DentalChildDetailsPage(props: DentalChildPageProps) {
  const { childApi } = useDentalApi();
  const childResult = useSuspenseQuery(
    getChildDetailsQuery(childApi, props.params.childId),
  );
  const child = childResult.data;

  return (
    <DisabledFormProvider disabled={child.isClosed}>
      <ChildDetailsPage child={child} isFetching={childResult.isFetching} />
    </DisabledFormProvider>
  );
}
