/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiOtherVaccination,
  ApiVaccinationStatus,
  UpdateVaccinationStatusRequest,
} from "@eshg/employee-portal-api/schoolEntry";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { DisabledFormProvider } from "@eshg/lib-portal/components/form/DisabledFormContext";
import {
  mapOptionalDate,
  mapOptionalValue,
  mapRequiredValue,
  parseOptionalDate,
  parseOptionalValue,
} from "@eshg/lib-portal/helpers/form";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import { useSuspenseQueries } from "@tanstack/react-query";
import { isEmpty } from "remeda";

import { SchoolEntryProcedurePageProps } from "@/app/(businessModules)/school-entry/procedures/[procedureId]/layout";
import { useSchoolEntryApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { useUpdateVaccinationStatusOptions } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import {
  getProcedureQuery,
  getVaccinationStatusQuery,
} from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import {
  OtherVaccinationValues,
  VaccinationForm,
  VaccinationFormValues,
  emptyOtherVaccination,
} from "@/lib/businessModules/schoolEntry/features/procedures/vaccination/VaccinationForm";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { ContentPanelTitle } from "@/lib/shared/components/contentPanel/ContentPanelTitle";

export default function SchoolEntryVaccinationStatusPage(
  props: SchoolEntryProcedurePageProps,
) {
  const procedureId = props.params.procedureId;
  const schoolEntryApi = useSchoolEntryApi();
  const [{ data: procedure }, { data: vaccinationStatus }] = useSuspenseQueries(
    {
      queries: [
        getProcedureQuery(schoolEntryApi, procedureId),
        getVaccinationStatusQuery(schoolEntryApi, procedureId),
      ],
    },
  );
  const updateVaccinationStatusOptions = useUpdateVaccinationStatusOptions();
  const updateVaccinationStatus = useHandledMutation(
    updateVaccinationStatusOptions,
  );

  async function handleSubmit(values: VaccinationFormValues) {
    await updateVaccinationStatus.mutateAsync(
      mapToRequest(procedureId, values, vaccinationStatus.version),
    );
  }

  return (
    <ContentPanel>
      <ContentPanelTitle tooltip="(0 - Sicher nicht erfolgt, 1-8 - Anzahl Impfungen, 9 - unbekannt)">
        Impfstatus
      </ContentPanelTitle>
      <DisabledFormProvider disabled={procedure.isClosed}>
        <VaccinationForm
          initialValues={mapToFormValues(vaccinationStatus)}
          onSubmit={handleSubmit}
          valuesToMutationBundle={(values) => ({
            mutationOptions: updateVaccinationStatusOptions,
            variableSupplier: () =>
              mapToRequest(procedureId, values, vaccinationStatus.version),
          })}
        />
      </DisabledFormProvider>
    </ContentPanel>
  );
}

function mapToFormValues(
  vaccinationStatus: ApiVaccinationStatus,
): VaccinationFormValues {
  return {
    vaccinationScheme: parseOptionalValue(vaccinationStatus.vaccinationScheme),
    diphtheria: parseOptionalValue(vaccinationStatus.diphtheria),
    tetanus: parseOptionalValue(vaccinationStatus.tetanus),
    pertussis: parseOptionalValue(vaccinationStatus.pertussis),
    hib: parseOptionalValue(vaccinationStatus.hib),
    polio: parseOptionalValue(vaccinationStatus.polio),
    hepatitisB: parseOptionalValue(vaccinationStatus.hepatitisB),
    pneumococcus: parseOptionalValue(vaccinationStatus.pneumococcus),
    mmr: parseOptionalValue(vaccinationStatus.mmr),
    varicella: parseOptionalValue(vaccinationStatus.varicella),
    meningococcusB: parseOptionalValue(vaccinationStatus.meningococcusB),
    meningococcusC: parseOptionalValue(vaccinationStatus.meningococcusC),
    rota: parseOptionalValue(vaccinationStatus.rota),
    tbe: parseOptionalValue(vaccinationStatus.tbe),
    hepatitisA: parseOptionalValue(vaccinationStatus.hepatitisA),
    otherVaccinations: isEmpty(vaccinationStatus.otherVaccinations)
      ? [emptyOtherVaccination()]
      : vaccinationStatus.otherVaccinations.map(parseOtherVaccination),
    vaccinationPassPresented: parseOptionalValue(
      vaccinationStatus.vaccinationPassPresented,
    ),
    perkombiHbv: parseOptionalValue(vaccinationStatus.perkombiHbv),
    measlesContraIndication: parseOptionalValue(
      vaccinationStatus.measlesContraIndication,
    ),
    measlesContraIndicationIsPermanent: parseOptionalValue(
      vaccinationStatus.measlesContraIndicationIsPermanent,
    ),
    measlesContraIndicationUntil: parseOptionalDate(
      vaccinationStatus.measlesContraIndicationUntil,
    ),
  };
}

function parseOtherVaccination(
  value: ApiOtherVaccination,
): OtherVaccinationValues {
  return {
    description: parseOptionalValue(value.description),
    count: parseOptionalValue(value.count),
  };
}

function mapToRequest(
  procedureId: string,
  formValues: VaccinationFormValues,
  version: number,
): UpdateVaccinationStatusRequest {
  return {
    procedureId,
    apiVaccinationStatus: {
      version: version,
      vaccinationScheme: mapOptionalValue(formValues.vaccinationScheme),
      diphtheria: mapOptionalValue(formValues.diphtheria),
      tetanus: mapOptionalValue(formValues.tetanus),
      pertussis: mapOptionalValue(formValues.pertussis),
      hib: mapOptionalValue(formValues.hib),
      polio: mapOptionalValue(formValues.polio),
      hepatitisB: mapOptionalValue(formValues.hepatitisB),
      pneumococcus: mapOptionalValue(formValues.pneumococcus),
      mmr: mapOptionalValue(formValues.mmr),
      varicella: mapOptionalValue(formValues.varicella),
      meningococcusB: mapOptionalValue(formValues.meningococcusB),
      meningococcusC: mapOptionalValue(formValues.meningococcusC),
      rota: mapOptionalValue(formValues.rota),
      tbe: mapOptionalValue(formValues.tbe),
      hepatitisA: mapOptionalValue(formValues.hepatitisA),
      otherVaccinations: formValues.otherVaccinations
        .filter(isNonEmptyOtherVaccination)
        .map(mapOtherVaccination),
      vaccinationPassPresented: mapOptionalValue(
        formValues.vaccinationPassPresented,
      ),
      perkombiHbv: mapOptionalValue(formValues.perkombiHbv),
      measlesContraIndication: mapOptionalValue(
        formValues.measlesContraIndication,
      ),
      measlesContraIndicationIsPermanent: formValues.measlesContraIndication
        ? mapOptionalValue(formValues.measlesContraIndicationIsPermanent)
        : undefined,
      measlesContraIndicationUntil: formValues.measlesContraIndication
        ? mapOptionalDate(formValues.measlesContraIndicationUntil)
        : undefined,
    },
  };
}

function isNonEmptyOtherVaccination(otherVaccination: OtherVaccinationValues) {
  return isNonEmptyString(otherVaccination.description);
}

function mapOtherVaccination(
  values: OtherVaccinationValues,
): ApiOtherVaccination {
  return {
    description: values.description,
    count: mapRequiredValue(values.count),
  };
}
