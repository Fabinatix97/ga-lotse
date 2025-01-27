/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { getChildDetailsQuery } from "@eshg/dental/api/queries/childApi";
import { useDentalApi } from "@eshg/dental/shared/DentalProvider";
import { useSuspenseQuery } from "@tanstack/react-query";

import { DentalChildPageProps } from "@/app/(businessModules)/dental/children/[childId]/layout";
import { ExaminationsTable } from "@/lib/businessModules/dental/features/children/details/ExaminationsTable";

export default function DentalChildExaminationsPage(
  props: DentalChildPageProps,
) {
  const childId = props.params.childId;
  const { childApi } = useDentalApi();
  const { data: child } = useSuspenseQuery(
    getChildDetailsQuery(childApi, childId),
  );

  return (
    <ExaminationsTable examinations={child.examinations} childId={childId} />
  );
}
