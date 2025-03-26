/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ButtonBar,
  DrawerProps,
  SidebarActions,
  SidebarContent,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Button, RadioGroup, Stack } from "@mui/joy";
import { ReactNode, useState } from "react";

import { useResolveFacilityDuplicate } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { useGetFacilityDuplicates } from "@/lib/businessModules/inspection/api/queries/inspection";
import { FacilityDuplicateTile } from "@/lib/businessModules/inspection/components/facility/pending/FacilityDuplicateTile";

export function useReviewFacilityDuplicateSidebar() {
  return useSidebar({
    component: ReviewFacilityDuplicateSidebar,
  });
}

interface ReviewFacilityDuplicateSidebarProps extends DrawerProps {
  inspectionId: string;
}

function ReviewFacilityDuplicateSidebar({
  inspectionId,
  onClose,
}: ReviewFacilityDuplicateSidebarProps): ReactNode {
  const { data: facilityDuplicateReview } =
    useGetFacilityDuplicates(inspectionId);
  const snackbar = useSnackbar();

  const { mutateAsync: resolveFacilityDuplicate } =
    useResolveFacilityDuplicate();

  const [selectedReferenceId, setSelectedReferenceId] = useState(
    facilityDuplicateReview.importedFacility.referenceId,
  );

  async function handleSubmit() {
    const payload = {
      id: inspectionId,
      apiResolveFacilityDuplicateRequest: {
        chosenReferenceId: selectedReferenceId,
      },
    };
    await resolveFacilityDuplicate(payload, {
      onSuccess: () =>
        snackbar.confirmation(
          selectedReferenceId ===
            facilityDuplicateReview.importedFacility.referenceId
            ? "Die Einrichtung wurde bestätigt."
            : "Die Einrichtungen wurden zusammengeführt.",
        ),
    });
    onClose();
  }

  return (
    <>
      <SidebarContent title={"Duplikatprüfung (Einrichtung)"}>
        <Stack direction={"column"} spacing={2}>
          <Alert
            color="primary"
            message="Es gibt ein potentielles Duplikat in der Datenbank. Sie können die importierte Einrichtung bestätigen oder mit einer vorhandenen Einrichtung zusammenführen."
          />
          <RadioGroup
            defaultValue={facilityDuplicateReview.importedFacility.referenceId}
            name="facilities-radio-group"
            onChange={(event) => setSelectedReferenceId(event.target.value)}
          >
            <Stack direction={"column"} spacing={2}>
              <FacilityDuplicateTile
                facility={facilityDuplicateReview.importedFacility}
                importedFacility={facilityDuplicateReview.importedFacility}
                isImportedFacility={true}
              ></FacilityDuplicateTile>
              {facilityDuplicateReview.existingFacilities.map((facility) => (
                <FacilityDuplicateTile
                  key={facility.referenceId}
                  facility={facility}
                  importedFacility={facilityDuplicateReview.importedFacility}
                  isImportedFacility={false}
                ></FacilityDuplicateTile>
              ))}
            </Stack>
          </RadioGroup>
        </Stack>
      </SidebarContent>

      <SidebarActions>
        <ButtonBar
          right={
            <Button
              component="a"
              onClick={handleSubmit}
              variant="solid"
              color="primary"
              sx={{ alignSelf: "end" }}
            >
              Bestätigen
            </Button>
          }
        />
      </SidebarActions>
    </>
  );
}
