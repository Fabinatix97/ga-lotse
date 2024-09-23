/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiOtherServiceTemplate } from "@eshg/employee-portal-api/travelMedicine";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/joy";

import { otherServiceTemplatesColumns } from "@/lib/businessModules/travelMedicine/components/otherServiceTemplates/columns";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

export function OtherServiceTable({
  data,
  handleAddEntry,
  handleDeleteEntry,
  openCloseVaccinationStepSidebar,
}: Readonly<{
  data: ApiOtherServiceTemplate[];
  handleAddEntry: () => void;
  handleDeleteEntry: (id: string) => Promise<void>;
  openCloseVaccinationStepSidebar: (
    otherServiceTemplateId: ApiOtherServiceTemplate,
  ) => void;
}>) {
  return (
    <TablePage
      controls={
        <ButtonBar
          right={
            <Button startDecorator={<AddIcon />} onClick={handleAddEntry}>
              Leistung hinzufügen
            </Button>
          }
        />
      }
    >
      <TableSheet>
        <DataTable
          data={data}
          columns={otherServiceTemplatesColumns(
            openCloseVaccinationStepSidebar,
            handleDeleteEntry,
          )}
        />
      </TableSheet>
    </TablePage>
  );
}
