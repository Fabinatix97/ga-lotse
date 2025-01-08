/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Button } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  PatchMedicalHistoryTemplateFlagRequest,
  useDeleteMedicalHistoryTemplateById,
  usePatchMedicalHistoryTemplateFollowUpFlag,
  usePatchMedicalHistoryTemplateMainFlag,
} from "@/lib/businessModules/travelMedicine/api/mutations/medicalHistoryTemplates";
import { useGetAllMedicalHistoryTemplatesQuery } from "@/lib/businessModules/travelMedicine/api/queries/medicalHistoryTemplates";
import { medicalHistoryColumns } from "@/lib/businessModules/travelMedicine/components/templates/medicalHistory/columns";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

export function MedicalHistoryTemplateOverviewTable() {
  const router = useRouter();
  const [{ data: allMedicalHistoryTemplates, refetch }] = useSuspenseQueries({
    queries: [useGetAllMedicalHistoryTemplatesQuery()],
  });
  const deleteMedicalHistoryTemplateById =
    useDeleteMedicalHistoryTemplateById();
  const patchMedicalHistoryTemplateMainFlag =
    usePatchMedicalHistoryTemplateMainFlag();
  const patchMedicalHistoryTemplateFollowUpFlag =
    usePatchMedicalHistoryTemplateFollowUpFlag();

  async function deleteEntry(entryId: string) {
    await deleteMedicalHistoryTemplateById.mutateAsync(entryId, {
      onSuccess: () => void refetch(),
    });
  }

  async function updateMainFlag(entryId: string) {
    const request: PatchMedicalHistoryTemplateFlagRequest = {
      id: entryId,
      request: { flag: true },
    };
    await patchMedicalHistoryTemplateMainFlag.mutateAsync(request, {
      onSuccess: () => void refetch(),
    });
  }

  async function updateFollowUpFlag(entryId: string) {
    const request: PatchMedicalHistoryTemplateFlagRequest = {
      id: entryId,
      request: { flag: true },
    };
    await patchMedicalHistoryTemplateFollowUpFlag.mutateAsync(request, {
      onSuccess: () => void refetch(),
    });
  }

  return (
    <TablePage
      controls={
        <ButtonBar
          right={
            <Button
              startDecorator={<AddOutlinedIcon />}
              onClick={() => router.push(routes.medicalHistoryTemplates.new)}
            >
              Anamnesebogen hinzufügen
            </Button>
          }
        />
      }
      data-testid="table-medical-history-templates"
    >
      <TableSheet>
        <DataTable
          data={allMedicalHistoryTemplates.medicalHistoryTemplates}
          columns={medicalHistoryColumns(
            updateMainFlag,
            updateFollowUpFlag,
            deleteEntry,
          )}
          rowNavigation={{
            route: (row) =>
              routes.medicalHistoryTemplates.details(row.original.id),
            focusColumnAccessorKey: "title",
          }}
        />
      </TableSheet>
    </TablePage>
  );
}
