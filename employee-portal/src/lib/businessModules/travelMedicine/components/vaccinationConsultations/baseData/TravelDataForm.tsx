/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCountryCode } from "@eshg/employee-portal-api/base";
import {
  ApiTravelTimeUnit,
  ApiTravelType,
} from "@eshg/employee-portal-api/travelMedicine";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { Grid, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { RefObject, useState } from "react";

import { CountryFieldMulti } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/CountryFieldMulti";
import {
  VACCINATION_CONSULTATION_TRAVEL_TIME_UNITS,
  VACCINATION_CONSULTATION_TRAVEL_TYPE_OPTIONS,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/options";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { validatePositiveInteger } from "@/lib/shared/helpers/validators";

export interface TravelData {
  travelType: ApiTravelType;
  travelDestinations: ApiCountryCode[];
  travelStartDate?: string;
  travelTimeAmount?: number;
  travelTimeUnit?: ApiTravelTimeUnit;
}

interface TravelDataFormProps {
  title: string;
  travelData: TravelData;
  onSubmit: (travelData: TravelData) => Promise<unknown>;
  onCancel: () => void;
  validate?: (travelData: TravelData) => FormikErrors<TravelData>;
  sidebarFormRef?: RefObject<SidebarFormHandle>;
}

export function TravelDataForm({
  title,
  travelData,
  onSubmit,
  onCancel,
  validate,
  sidebarFormRef,
}: Readonly<TravelDataFormProps>) {
  const [hideTravelData, setHideTravelData] = useState(
    travelData.travelType === ApiTravelType.NoTravel,
  );

  return (
    <Formik
      initialValues={travelData}
      onSubmit={onSubmit}
      validate={validate}
      enableReinitialize
    >
      {({ isSubmitting, setFieldValue }) => (
        <SidebarForm ref={sidebarFormRef}>
          <SidebarContent title={title}>
            <Stack gap={2} rowGap={2}>
              <SelectField
                name="travelType"
                label="Reiseart"
                options={VACCINATION_CONSULTATION_TRAVEL_TYPE_OPTIONS}
                onChange={async (option) => {
                  if (option === ApiTravelType.NoTravel) {
                    setHideTravelData(true);
                    await setFieldValue("travelDestinations", []);
                    await setFieldValue("travelStartDate", "");
                    await setFieldValue("travelTimeAmount", "");
                    await setFieldValue(
                      "travelTimeUnit",
                      ApiTravelTimeUnit.Days,
                    );
                  } else {
                    setHideTravelData(false);
                  }
                }}
                required="Bitte eine Reiseart auswählen."
              />
              {!hideTravelData ? (
                <>
                  <CountryFieldMulti
                    name={"travelDestinations"}
                    label={"Reiseziele"}
                  />
                  <DateField name={"travelStartDate"} label={"Reisebeginn"} />
                  <Grid container columnSpacing={2}>
                    <Grid xs={6}>
                      <NumberField
                        name={"travelTimeAmount"}
                        label="Reisedauer"
                        validate={validatePositiveInteger}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <SelectField
                        name={"travelTimeUnit"}
                        label="Einheit"
                        options={VACCINATION_CONSULTATION_TRAVEL_TIME_UNITS}
                      />
                    </Grid>
                  </Grid>
                </>
              ) : null}
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel="Speichern"
              submitting={isSubmitting}
              onCancel={() => {
                onCancel();
              }}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
