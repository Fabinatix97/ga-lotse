/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiGetProcedure200Response,
  ApiGetProcedureDraftResponse,
  ApiMedicalRegistryEntryProcedureType,
} from "@eshg/employee-portal-api/medicalRegistry";
import { useControlledAlert } from "@eshg/lib-portal/errorHandling/AlertContext";
import { Button, Grid, Stack } from "@mui/joy";
import { useRouter } from "next/navigation";

import { useDeleteDraftProcedure } from "@/lib/businessModules/medicalRegistry/api/mutations/medicalRegistryEntries";
import { useGetProcedure } from "@/lib/businessModules/medicalRegistry/api/queries/medicalRegistryEntries";
import { PracticesDetailsSection } from "@/lib/businessModules/medicalRegistry/components/procedures/details/PracticesDetailsSection";
import { ProfessionalDetailsSection } from "@/lib/businessModules/medicalRegistry/components/procedures/details/ProfessionalDetailsSection";
import { TypeOfChangeSection } from "@/lib/businessModules/medicalRegistry/components/procedures/details/TypeOfChangeSection";
import { WrittenConfirmationSection } from "@/lib/businessModules/medicalRegistry/components/procedures/details/WrittenConfirmationSection";
import { routes } from "@/lib/businessModules/medicalRegistry/shared/routes";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";
import { PageGrid } from "@/lib/shared/components/page/PageGrid";

interface MedicalRegistryProcedureDetailsProps {
  procedureId: string;
}

const SPACING = { xxs: 2, sm: 3, md: 4, xxl: 5 };

export function MedicalRegistryProcedureDetails(
  props: Readonly<MedicalRegistryProcedureDetailsProps>,
) {
  const { data: procedure } = useGetProcedure(props.procedureId);
  const isDraft = procedure.type === "GetProcedureDraftResponse";

  useDraftAlerts(procedure);

  return (
    <>
      <PageGrid>
        <Grid xxs={12} md={9}>
          <Stack spacing={SPACING}>
            <ProfessionalDetailsSection procedure={procedure} />
            <PracticesDetailsSection procedure={procedure} />
          </Stack>
        </Grid>

        <Grid xxs={12} md={3}>
          <Stack spacing={SPACING}>
            <WrittenConfirmationSection procedure={procedure} />
            {isDraft && (
              <>
                <TypeOfChangeSection procedure={procedure} />
                <DraftActions procedure={procedure} />
              </>
            )}
          </Stack>
        </Grid>
      </PageGrid>
    </>
  );
}

function useDraftAlerts(procedure: ApiGetProcedure200Response) {
  const { procedureType } = procedure;

  useControlledAlert({
    open: procedureType === ApiMedicalRegistryEntryProcedureType.CitizenDraft,
    type: "error",
    message:
      "Dieser Entwurf kommt aus einer externen Quelle. Bitte kontrollieren Sie die Daten, bevor Sie den Eintrag anlegen.",
  });

  useControlledAlert({
    open: procedureType === ApiMedicalRegistryEntryProcedureType.EmployeeDraft,
    type: "warning",
    message:
      "Bitte kontrollieren Sie die Daten, bevor Sie den Eintrag anlegen.",
  });
}

function DraftActions({
  procedure,
}: Readonly<{ procedure: ApiGetProcedureDraftResponse }>) {
  const router = useRouter();
  const deleteDraftProcedure = useDeleteDraftProcedure();
  const { openConfirmationDialog } = useConfirmationDialog();

  function handleDeleteDraft() {
    openConfirmationDialog({
      color: "danger",
      title: "Wollen Sie den Entwurf wirklich verwerfen?",
      description: "Die Aktion kann nicht rückgängig gemacht werden.",
      confirmLabel: "Verwerfen",
      onConfirm: () => {
        deleteDraftProcedure.mutate(
          {
            procedureId: procedure.id,
            version: procedure.version,
          },
          { onSuccess: () => router.push(routes.procedures.index) },
        );
      },
    });
  }

  function handleConfirmDraft() {
    // TODO ISSUE-5889
  }

  return (
    <InformationSheet>
      <Stack gap={3} direction="row" flexWrap="wrap">
        <Button
          color="danger"
          variant="soft"
          onClick={handleDeleteDraft}
          sx={{ flexGrow: 1 }}
        >
          Entwurf verwerfen
        </Button>
        <Button onClick={handleConfirmDraft} sx={{ flexGrow: 1 }} disabled>
          Entwurf übernehmen
        </Button>
      </Stack>
    </InformationSheet>
  );
}
