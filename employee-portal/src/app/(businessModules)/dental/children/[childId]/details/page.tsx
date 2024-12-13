/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { DentalChildPageProps } from "@/app/(businessModules)/dental/children/[childId]/layout";
import { useChildApi } from "@/lib/businessModules/dental/api/clients";
import { getChildDetailsQuery } from "@/lib/businessModules/dental/api/queries/childApi";
import { ChildDetailsPage } from "@/lib/businessModules/dental/features/children/details/ChildDetails";

export default function DentalChildDetailsPage(props: DentalChildPageProps) {
  const childApi = useChildApi();
  const { data: child } = useSuspenseQuery(
    getChildDetailsQuery(childApi, props.params.childId),
  );
  return <ChildDetailsPage child={child} />;
}
