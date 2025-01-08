/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetReferenceFacilityResponse } from "@eshg/employee-portal-api/base";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useState } from "react";

import { usePostFacility } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { mapToDefaultFacilityFormValues } from "@/lib/businessModules/officialMedicalService/shared/helpers";
import { FacilitySidebar } from "@/lib/shared/components/facilitySidebar/FacilitySidebar";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

export function AddFacility({ id }: Readonly<{ id: string }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const postFacility = usePostFacility();
  const { handleClose, closeSidebar, sidebarFormRef } = useSidebarForm({
    onClose: () => setSidebarOpen(false),
  });

  async function handleSubmit(facility: DefaultFacilityFormValues) {
    await postFacility.mutateAsync(
      {
        id: id,
        facility: facility,
      },
      {
        onSuccess: () => {
          closeSidebar();
        },
      },
    );
  }

  async function handleSelectFacility(
    facility: ApiGetReferenceFacilityResponse,
  ) {
    await postFacility.mutateAsync(
      {
        id: id,
        facility: mapToDefaultFacilityFormValues(facility),
      },
      {
        onSuccess: () => {
          closeSidebar();
        },
      },
    );
  }

  return (
    <>
      <div>
        <Button
          startDecorator={<Add />}
          variant="plain"
          onClick={() => setSidebarOpen(true)}
        >
          Hinzufügen
        </Button>
      </div>
      <FacilitySidebar
        title="Auftraggeber hinzufügen"
        submitLabel="Speichern"
        sidebarFormRef={sidebarFormRef}
        onCreateNew={(values) => handleSubmit(values.createInputs)}
        onSelect={(values) => handleSelectFacility(values.facility)}
        onClose={handleClose}
        open={sidebarOpen}
      />
    </>
  );
}
