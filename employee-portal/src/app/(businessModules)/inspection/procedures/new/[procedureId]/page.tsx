/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useGetInspection } from "@/lib/businessModules/inspection/api/queries/inspection";
import { useGetObjectTypes } from "@/lib/businessModules/inspection/api/queries/objectTypes";
import { AddInspectionTiles } from "@/lib/businessModules/inspection/components/inspection/new/AddInspectionTiles";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function NewInspectionProcedurePage({
  params,
}: Readonly<{
  params: { procedureId: string };
}>) {
  const { data: inspection } = useGetInspection(params.procedureId);
  const facility = inspection.facility;
  const { data: objectTypes } = useGetObjectTypes();

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          backHref={routes.procedures.index}
          title={facility.baseFacility.name}
        />
      }
    >
      <MainContentLayout>
        <AddInspectionTiles inspection={inspection} objectTypes={objectTypes} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
