/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Button, Stack, Typography } from "@mui/joy";
import { ReactNode } from "react";

import { useResolveInspectionDuplicate } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { useGetInspectionDuplicates } from "@/lib/businessModules/inspection/api/queries/inspection";
import { InspectionDuplicateTile } from "@/lib/businessModules/inspection/components/facility/pending/InspectionDuplicateTile";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import { useSidebar } from "@/lib/shared/components/drawer/useSidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export function useReviewInspectionDuplicateSidebar() {
  return useSidebar({
    component: ReviewInspectionDuplicateSidebar,
  });
}

interface ReviewInspectionDuplicateSidebarProps extends DrawerProps {
  inspectionId: string;
}

function ReviewInspectionDuplicateSidebar({
  inspectionId,
  onClose,
}: ReviewInspectionDuplicateSidebarProps): ReactNode {
  const { data: inspectionDuplicates } =
    useGetInspectionDuplicates(inspectionId);
  const snackbar = useSnackbar();

  const resolveInspectionDuplicate = useResolveInspectionDuplicate();

  async function handleSubmit(keepInspection: boolean) {
    const payload = {
      id: inspectionId,
      apiResolveInspectionDuplicateRequest: {
        keepInspection: keepInspection,
      },
    };
    await resolveInspectionDuplicate.mutateAsync(payload, {
      onSuccess: () =>
        snackbar.confirmation(
          keepInspection
            ? "Der Vorgang wurde bestätigt."
            : "Der Vorgang wurde verworfen.",
        ),
    });
    onClose();
  }

  return (
    <>
      <SidebarContent title={"Duplikatprüfung (Vorgang)"}>
        <Stack direction={"column"} spacing={2}>
          <Alert
            color="primary"
            message="Es gibt ein potentielles Duplikat in der Datenbank. Sie können den importierten Vorgang bestätigen oder mit einem vorhandenen Vorgang zusammenführen."
          />
          <Stack direction={"column"} spacing={2}>
            <Typography level="h4" component="p" sx={{ marginTop: 2 }}>
              Importierter Vorgang:
            </Typography>
            <InspectionDuplicateTile
              inspection={inspectionDuplicates.importedInspection}
              importedInspection={inspectionDuplicates.importedInspection}
              isImportedInspection={true}
              testId={"importedProcess"}
            ></InspectionDuplicateTile>
            <Typography level="h4" component="p" sx={{ marginTop: 2 }}>
              Bereits existierende Vorgänge:
            </Typography>
            {inspectionDuplicates.existingInspections.map((inspection) => (
              <InspectionDuplicateTile
                key={inspection.externalId}
                inspection={inspection}
                importedInspection={inspectionDuplicates.importedInspection}
                isImportedInspection={false}
                testId={"existingProcess"}
              ></InspectionDuplicateTile>
            ))}
          </Stack>
        </Stack>
      </SidebarContent>

      <SidebarActions>
        <ButtonBar
          right={
            <>
              <Button
                component="a"
                onClick={() => handleSubmit(false)}
                variant="solid"
                color="neutral"
                sx={{
                  alignSelf: "end",
                }}
              >
                Verwerfen
              </Button>
              <Button
                component="a"
                onClick={() => handleSubmit(true)}
                variant="solid"
                color="primary"
                sx={{
                  alignSelf: "end",
                }}
              >
                Import bestätigen
              </Button>
            </>
          }
        />
      </SidebarActions>
    </>
  );
}
