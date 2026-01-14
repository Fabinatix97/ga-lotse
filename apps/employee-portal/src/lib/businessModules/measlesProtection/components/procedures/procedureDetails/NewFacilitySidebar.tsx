/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

import { useAddFacility } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { mapToDefaultFacilityFormValues } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/helpers";
import { ReferenceFacilityWithOptionalMeaslesFacilityType } from "@/lib/shared/components/facilitySidebar/FacilityDetailsSidebar";
import {
  FacilitySidebar,
  FacilitySidebarProps,
} from "@/lib/shared/components/facilitySidebar/FacilitySidebar";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { FacilitySearchFormValues } from "@/lib/shared/components/facilitySidebar/search/FacilitySearchForm";

export function useNewFacilitySidebar(): UseSidebarWithFormRefResult<NewFacilitySidebarProps> {
  return useSidebarWithFormRef({ component: NewFacilitySidebar });
}

interface NewFacilitySidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
}

function NewFacilitySidebar(props: Readonly<NewFacilitySidebarProps>) {
  const addFacility = useAddFacility();

  async function handleSubmit(facility: DefaultFacilityFormValues) {
    await addFacility.mutateAsync({ procedureId: props.procedureId, facility });
  }

  async function handleSelectFacility(
    facility: ReferenceFacilityWithOptionalMeaslesFacilityType,
  ) {
    const request = mapToDefaultFacilityFormValues(facility);
    await addFacility.mutateAsync({
      procedureId: props.procedureId,
      facility: request,
    });
  }

  const facilitySidebarProps: FacilitySidebarProps<FacilitySearchFormValues> = {
    title: "Einrichtung hinzufügen",
    submitLabel: "Speichern",
    onCreateNew: (values) => handleSubmit(values.createInputs),
    onSelect: (values) => handleSelectFacility(values.facility),
    formRef: props.formRef,
    onClose: props.onClose,
    requiresContactPerson: true,
    showMeaslesFacilityType: true,
  };

  return <FacilitySidebar {...facilitySidebarProps} />;
}
