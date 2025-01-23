/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetReferenceFacilityResponse } from "@eshg/base-api";
import { InfoOutlined } from "@mui/icons-material";
import { Alert, Stack } from "@mui/joy";
import { useState } from "react";

import { usePostFacility } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { mapToDefaultFacilityFormValues } from "@/lib/businessModules/officialMedicalService/shared/helpers";
import { FacilitySidebar } from "@/lib/shared/components/facilitySidebar/FacilitySidebar";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { InfoTileAddButton } from "@/lib/shared/components/infoTile/InfoTileAddButton";
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
      <Stack gap={2} sx={{ pt: 1 }}>
        <Alert color={"warning"} startDecorator={<InfoOutlined />}>
          Um einen Vorgang anzulegen, muss ein Auftraggeber ergänzt werden.
        </Alert>
        <InfoTileAddButton onClick={() => setSidebarOpen(true)}>
          Hinzufügen
        </InfoTileAddButton>
      </Stack>
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
