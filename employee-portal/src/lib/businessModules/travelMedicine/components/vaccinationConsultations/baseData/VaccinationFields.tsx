/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiVaccinationType } from "@eshg/employee-portal-api/travelMedicine";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { Divider, Grid } from "@mui/joy";
import { FormikErrors, useFormikContext } from "formik";
import { useState } from "react";

import { Disease } from "@/lib/businessModules/travelMedicine/api/models/Disease";
import { Vaccines } from "@/lib/businessModules/travelMedicine/api/models/Vaccines";
import {
  ServiceValues,
  ServicesRequest,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ServicePlanSidebar";
import { HorizontalFieldLabelEnd } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/HorizontalFieldLabelEnd";
import {
  createDiseaseOptions,
  createVaccinesOptions,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/helpers";
import { VACCINATION_TYPE } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/options";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { LOCALE_OPTION, formatCurrency } from "@/lib/shared/helpers/numbers";
import { validatePositiveInteger } from "@/lib/shared/helpers/validators";

interface VaccinationFieldsProps {
  val: ServicesRequest;
  index: number;
  allVaccines: Vaccines[];
  allDiseases: Disease[];
}

export function VaccinationFields({
  val,
  index,
  allVaccines,
  allDiseases,
}: Readonly<VaccinationFieldsProps>) {
  const { setFieldValue } = useFormikContext<ServiceValues>();

  const [offset, setOffset] = useState<number>();

  const diseaseOptions: SelectOption[] = createDiseaseOptions(allDiseases);
  const vaccinesOptions: SelectOption[][] = createVaccinesOptions(
    allVaccines,
    diseaseOptions,
  );

  function getVaccineOffsets(vaccineId: string) {
    if (vaccineId) {
      const vaccine = allVaccines.find((vaccine) => vaccine.id === vaccineId);
      if (vaccine) {
        return vaccine.offsets.length;
      }
    }
  }

  async function getFeeForVaccine(
    index: number,
    vaccineId: string,
    setFieldValue: (
      field: string,
      value: number,
    ) => Promise<void | FormikErrors<ServiceValues>>,
  ) {
    if (vaccineId) {
      const vaccine = allVaccines.find((vaccine) => vaccine.id === vaccineId);
      if (vaccine) {
        await setFieldValue(`services.${index}.fee`, vaccine.fee ?? 0);
      }
    } else {
      await setFieldValue(`services.${index}.fee`, 0);
    }
  }

  return (
    <>
      <SelectField
        name={`services.${index}.vaccinationType`}
        label="Impfart"
        options={VACCINATION_TYPE}
        required="Bitte eine Impfart auswählen."
        onChange={() => setFieldValue(`services.${index}.vaccinationNumber`, 1)}
      />
      <SelectField
        name={`services.${index}.diseaseId`}
        label="Impfung"
        placeholder="auswählen"
        options={diseaseOptions}
        required="Bitte eine Impfung auswählen."
      />
      <SelectField
        name={`services.${index}.vaccineId`}
        label="Impfstoff"
        placeholder="auswählen"
        options={
          vaccinesOptions[Number.parseInt(val.diseaseId.split(",")[1]!)] ?? []
        }
        required="Bitte einen Impfstoff auswählen."
        onChange={async (vaccineId) => {
          await setFieldValue(`services.${index}.createSeries`, false);
          await getFeeForVaccine(index, vaccineId, setFieldValue);
          setOffset(getVaccineOffsets(vaccineId));
        }}
      />
      <DetailsCell
        name={`services.${index}.fee`}
        label="Preis"
        value={formatCurrency(val.fee, {
          localOption: LOCALE_OPTION.manual,
          locale: "de-DE",
        })}
      />
      {val.vaccinationType !== ApiVaccinationType.Booster && (
        <>
          <Divider />
          <Grid container alignContent="center" justifyContent="space-between">
            <Grid>
              {offset! > 0 && (
                <CheckboxField
                  name={`services.${index}.createSeries`}
                  label="Impfserie erstellen"
                  sx={{
                    pt: "8px",
                    fontSize: "14px",
                  }}
                />
              )}
            </Grid>
            <Grid>
              {!val.createSeries && (
                <NumberField
                  name={`services.${index}.vaccinationNumber`}
                  label="Nr."
                  required="Bitte einen Anzahl angeben"
                  component={HorizontalFieldLabelEnd}
                  sx={{
                    width: "60px",
                  }}
                  validate={validatePositiveInteger}
                />
              )}
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}
