/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetReferenceFacilityResponse } from "@eshg/base-api";
import { InfoOutlined } from "@mui/icons-material";
import { Alert, Stack } from "@mui/joy";

import { usePostFacility } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { mapToDefaultFacilityFormValues } from "@/lib/businessModules/officialMedicalService/shared/helpers";
import {
  FacilitySidebar,
  FacilitySidebarProps,
} from "@/lib/shared/components/facilitySidebar/FacilitySidebar";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { FacilitySearchFormValues } from "@/lib/shared/components/facilitySidebar/search/FacilitySearchForm";
import { InfoTileAddButton } from "@/lib/shared/components/infoTile/InfoTileAddButton";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function AddFacility({ id }: Readonly<{ id: string }>) {
  const facilitySidebar = useSidebarWithFormRef({
    component: ConfiguredFacilitySidebar,
  });

  return (
    <>
      <Stack gap={2} sx={{ pt: 1 }}>
        <Alert color={"warning"} startDecorator={<InfoOutlined />}>
          Um einen Vorgang anzulegen, muss ein Auftraggeber ergänzt werden.
        </Alert>
        <InfoTileAddButton onClick={() => facilitySidebar.open({ id })}>
          Hinzufügen
        </InfoTileAddButton>
      </Stack>
    </>
  );
}

function ConfiguredFacilitySidebar(
  props: SidebarWithFormRefProps &
    Readonly<{
      id: string;
    }>,
) {
  const postFacility = usePostFacility();

  async function handleSubmit(facility: DefaultFacilityFormValues) {
    await postFacility.mutateAsync({
      id: props.id,
      facility: facility,
    });
  }

  async function handleSelectFacility(
    facility: ApiGetReferenceFacilityResponse,
  ) {
    await postFacility.mutateAsync({
      id: props.id,
      facility: mapToDefaultFacilityFormValues(facility),
    });
  }

  const facilitySidebarProps: FacilitySidebarProps<FacilitySearchFormValues> = {
    title: "Auftraggeber hinzufügen",
    submitLabel: "Speichern",
    onCreateNew: (values) => handleSubmit(values.createInputs),
    onSelect: (values) => handleSelectFacility(values.facility),
    formRef: props.formRef,
    onClose: props.onClose,
    allowMainContactPerson: true,
  };

  return <FacilitySidebar {...facilitySidebarProps} />;
}
