/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiGetReferenceFacilityResponse } from "@eshg/employee-portal-api/base";
import {
  type ApiInspAddFacilityResponse,
  ApiProcedureStatus,
} from "@eshg/employee-portal-api/inspection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  useAddInspectionFacility,
  useLinkBaseFacility,
} from "@/lib/businessModules/inspection/api/mutations/facility";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { FacilitySidebar } from "@/lib/shared/components/facilitySidebar/FacilitySidebar";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

export function NewFacilityButton() {
  return (
    <OverlayBoundary>
      <NewFacilityButtonWithinOverlay />
    </OverlayBoundary>
  );
}

function NewFacilityButtonWithinOverlay() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const snackbar = useSnackbar();
  const { mutateAsync: linkBaseFacility } = useLinkBaseFacility();
  const { mutateAsync: addInspectionFacility } = useAddInspectionFacility();

  const { handleClose, closeSidebar, sidebarFormRef } = useSidebarForm({
    onClose: () => setOpen(false),
  });

  function afterSave(addFacilityResponse: ApiInspAddFacilityResponse) {
    closeSidebar();

    // If we get an inspection that is not in draft status, we should route to that inspection and not to the new inspection dialog.
    if (addFacilityResponse.procedureStatus !== ApiProcedureStatus.Draft) {
      router.push(routes.procedures.details(addFacilityResponse.procedureId));
      snackbar.notification(
        "Dies ist der neueste Vorgang für diese Einrichtung",
      );
    } else {
      snackbar.confirmation("Einrichtung erfolgreich gespeichert.");
      router.push(routes.procedures.new(addFacilityResponse.procedureId));
    }
  }

  async function handleSubmit(facility: DefaultFacilityFormValues) {
    await addInspectionFacility(
      { facility },
      {
        onSuccess: afterSave,
      },
    );
  }

  async function handleSelectFacility(
    facility: ApiGetReferenceFacilityResponse,
  ) {
    await linkBaseFacility(
      { facility },
      {
        onSuccess: ({ inspectionId, procedureStatus }) => {
          if (procedureStatus !== ApiProcedureStatus.Draft) {
            router.push(routes.procedures.details(inspectionId));
            snackbar.notification(
              "Dies ist der neueste Vorgang für diese Einrichtung",
            );
          } else {
            router.push(routes.procedures.new(inspectionId));
          }
        },
      },
    );
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Neue Erstbesichtigung anlegen
      </Button>

      <FacilitySidebar
        title="Neue Erstbesichtigung anlegen"
        submitLabel="Anlegen"
        sidebarFormRef={sidebarFormRef}
        onCreateNew={(values) => handleSubmit(values.createInputs)}
        onSelect={(values) => handleSelectFacility(values.facility)}
        onClose={handleClose}
        open={open}
      />
    </>
  );
}
