/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";
import assert from "assert";
import { formatDate } from "date-fns";
import { isDefined } from "remeda";

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { isNonEmptyString } from "@eshg/lib-portal";
import {
  ApiConcernCategoryConfig,
  ApiConcernConfig,
  ApiEmployeeOmsProcedureDetails,
  UpdateAdditionalInfoRequest,
} from "@eshg/official-medical-service-api";

import { usePatchAdditionalInfo } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { useGetAllPhysiciansQuery } from "@/lib/businessModules/officialMedicalService/api/queries/appointmentStaffApi";
import { useGetAllConcernsQuery } from "@/lib/businessModules/officialMedicalService/api/queries/concerns";
import {
  ALL_CATEGORIES_KEY,
  AdditionalInfoForm,
  AdditionalInfoFormValues,
} from "@/lib/businessModules/officialMedicalService/components/procedures/details/baseData/AdditionalInfoForm";

export function useAdditionalInfoSidebar(): UseSidebarWithFormRefResult<AdditionalInfoSidebarProps> {
  return useSidebarWithFormRef({ component: AdditionalInfoSidebar });
}

interface AdditionalInfoSidebarProps extends SidebarWithFormRefProps {
  procedure: ApiEmployeeOmsProcedureDetails;
}

function AdditionalInfoSidebar(props: Readonly<AdditionalInfoSidebarProps>) {
  const [{ data: allPhysicians }, { data: allConcerns }] = useSuspenseQueries({
    queries: [useGetAllPhysiciansQuery(), useGetAllConcernsQuery()],
  });
  const patchAdditionalInfo = usePatchAdditionalInfo();

  const concernMap: Map<string, ApiConcernConfig> = allConcerns.categories
    .flatMap((category) => category.concerns)
    .reduce((map, concern) => {
      map.set(concern.nameDe, concern);
      return map;
    }, new Map<string, ApiConcernConfig>());

  const categoryMap: Map<string, ApiConcernCategoryConfig> =
    allConcerns.categories.reduce((map, category) => {
      for (const concern of category.concerns) {
        map.set(concern.nameDe, category);
      }
      return map;
    }, new Map<string, ApiConcernCategoryConfig>());

  function mapPhysicianFormValues(procedure: ApiEmployeeOmsProcedureDetails) {
    return isDefined(procedure.physician) ? procedure.physician.userId : "";
  }

  async function handleSubmit(values: AdditionalInfoFormValues) {
    assert(values.concern !== undefined);
    const concern = concernMap.get(values.concern)!;
    const request: UpdateAdditionalInfoRequest = {
      id: props.procedure.id,
      apiPatchAdditionalInfoRequest: {
        concern: {
          ...concern,
          version: props.procedure.concern?.version ?? 0,
          categoryNameDe: categoryMap.get(values.concern)!.nameDe,
          categoryNameEn: categoryMap.get(values.concern)!.nameEn,
        },
        physicianId: values.physician,
        cutOffDate: isNonEmptyString(values.cutOffDate)
          ? new Date(values.cutOffDate)
          : undefined,
        sendEmailNotifications: values.sendEmailNotifications,
      },
    };
    await patchAdditionalInfo.mutateAsync(request, {
      onSuccess: () => {
        props.onClose(true);
      },
    });
  }

  return (
    <AdditionalInfoForm
      title="Zusatzinfos"
      formRef={props.formRef}
      procedureStatus={props.procedure.status}
      allPhysicians={allPhysicians}
      allConcerns={allConcerns}
      emailAddressesNumber={
        props.procedure.affectedPerson.emailAddresses?.length ?? 0
      }
      initialValues={{
        category: props.procedure.concern
          ? props.procedure.concern.categoryNameDe
          : ALL_CATEGORIES_KEY,
        concern: props.procedure.concern?.nameDe,
        physician: mapPhysicianFormValues(props.procedure),
        ...(!!props.procedure.affectedPerson.emailAddresses?.length && {
          sendEmailNotifications: props.procedure.sendEmailNotifications,
        }),
        cutOffDate: isDefined(props.procedure.medicalOpinionCutOffDate)
          ? formatDate(props.procedure.medicalOpinionCutOffDate, "yyyy-MM-dd")
          : "",
      }}
      submitLabel="Speichern"
      onSubmit={handleSubmit}
      onCancel={props.onClose}
    />
  );
}
