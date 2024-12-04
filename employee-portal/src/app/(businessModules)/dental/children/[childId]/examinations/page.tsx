/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { DentalChildPageProps } from "@/app/(businessModules)/dental/children/[childId]/layout";
import { useChildApi } from "@/lib/businessModules/dental/api/clients";
import { getChildDetailsQuery } from "@/lib/businessModules/dental/api/queries/childApi";
import { ExaminationsTable } from "@/lib/businessModules/dental/features/children/details/ExaminationsTable";

export default function DentalChildExaminationsPage(
  props: DentalChildPageProps,
) {
  const childId = props.params.childId;
  const childApi = useChildApi();
  const { data: child } = useSuspenseQuery(
    getChildDetailsQuery(childApi, childId),
  );

  return <ExaminationsTable examinations={child.examinations} />;
}
