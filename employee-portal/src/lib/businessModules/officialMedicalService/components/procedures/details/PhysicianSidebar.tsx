/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiEmployeeOmsProcedureDetails } from "@eshg/official-medical-service-api";
import { useSuspenseQueries } from "@tanstack/react-query";
import { isDefined } from "remeda";

import { usePatchPhysician } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { useGetAllPhysiciansQuery } from "@/lib/businessModules/officialMedicalService/api/queries/appointmentStaffApi";
import {
  PhysicianForm,
  PhysicianFormValues,
} from "@/lib/businessModules/officialMedicalService/components/procedures/details/PhysicianForm";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function usePhysicianSidebar(): UseSidebarWithFormRefResult<PhysicianSidebarProps> {
  return useSidebarWithFormRef({ component: PhysicianSidebar });
}

interface PhysicianSidebarProps extends SidebarWithFormRefProps {
  procedure: ApiEmployeeOmsProcedureDetails;
}

function PhysicianSidebar(props: Readonly<PhysicianSidebarProps>) {
  const patchPhysician = usePatchPhysician(props.procedure.id);
  const [{ data: allPhysicians }] = useSuspenseQueries({
    queries: [useGetAllPhysiciansQuery()],
  });

  async function handleSubmit(values: PhysicianFormValues) {
    await patchPhysician.mutateAsync(
      { physicianId: values.physician ?? "" },
      {
        onSuccess: () => {
          props.onClose(true);
        },
      },
    );
  }

  function mapPhysicianFormValues(
    procedure: ApiEmployeeOmsProcedureDetails,
  ): PhysicianFormValues {
    return {
      physician: isDefined(procedure.physician)
        ? procedure.physician.userId
        : "",
    };
  }

  return (
    <PhysicianForm
      title={
        props.procedure.physician ? "Ärzt:in bearbeiten" : "Ärzt:in hinzufügen"
      }
      onSubmit={handleSubmit}
      onCancel={props.onClose}
      formRef={props.formRef}
      initialValues={mapPhysicianFormValues(props.procedure)}
      allPhysicians={allPhysicians}
      submitLabel="Speichern"
    />
  );
}
