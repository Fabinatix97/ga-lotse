/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";

import { ApiGetReferenceFacilityResponse } from "@eshg/base-api";
import {
  type ApiInspAddFacilityResponse,
  ApiProcedureStatus,
} from "@eshg/inspection-api";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal";

import {
  useAddInspectionFacility,
  useLinkBaseFacility,
} from "@/lib/businessModules/inspection/api/mutations/facility";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import {
  FacilitySidebar,
  FacilitySidebarProps,
} from "@/lib/shared/components/facilitySidebar/FacilitySidebar";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";

export function NewFacilityButton() {
  const facilitySidebar = useSidebarWithFormRef({
    component: ConfiguredFacilitySidebar,
  });

  return (
    <Button startDecorator={<Add />} onClick={() => facilitySidebar.open()}>
      Neue Erstbesichtigung anlegen
    </Button>
  );
}

function ConfiguredFacilitySidebar(props: SidebarWithFormRefProps) {
  const router = useRouter();
  const snackbar = useSnackbar();
  const { mutateAsync: linkBaseFacility } = useLinkBaseFacility();
  const { mutateAsync: addInspectionFacility } = useAddInspectionFacility();

  function afterSave(addFacilityResponse: ApiInspAddFacilityResponse) {
    // If we get an inspection that is not in draft status, we should route to that inspection and not to the new inspection dialog.
    if (addFacilityResponse.procedureStatus !== ApiProcedureStatus.Draft) {
      router.push(routes.procedures.details(addFacilityResponse.procedureId));
    } else {
      router.push(routes.procedures.new(addFacilityResponse.procedureId));
    }
    if (addFacilityResponse.isNew) {
      snackbar.confirmation("Einrichtung erfolgreich gespeichert.");
    } else {
      snackbar.notification(
        "Dies ist der neueste Vorgang für diese Einrichtung",
      );
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
        onSuccess: ({ inspectionId, procedureStatus, isNew }) => {
          if (procedureStatus !== ApiProcedureStatus.Draft) {
            router.push(routes.procedures.details(inspectionId));
          } else {
            router.push(routes.procedures.new(inspectionId));
          }
          if (isNew) {
            snackbar.confirmation("Vorgang erfolgreich angelegt.");
          } else {
            snackbar.notification(
              "Dies ist der neueste Vorgang für diese Einrichtung",
            );
          }
        },
      },
    );
  }

  const facilitySidebarProps: FacilitySidebarProps<DefaultFacilityFormValues> =
    {
      title: "Neue Erstbesichtigung anlegen",
      submitLabel: "Anlegen",
      onCreateNew: (values) => handleSubmit(values.createInputs),
      onSelect: (values) => handleSelectFacility(values.facility),
      ...props,
    };

  return <FacilitySidebar {...facilitySidebarProps} />;
}
