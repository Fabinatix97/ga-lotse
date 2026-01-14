/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { Ref, useState } from "react";

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import {
  DateField,
  NumberField,
  SelectField,
  validateIntegerAnd,
  validateRange,
} from "@eshg/lib-portal";
import {
  ApiCountryCode,
  ApiTravelTimeUnit,
  ApiTravelType,
} from "@eshg/travel-medicine-api";

import { CountryFieldMulti } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/CountryFieldMulti";
import {
  VACCINATION_CONSULTATION_TRAVEL_TIME_UNITS,
  VACCINATION_CONSULTATION_TRAVEL_TYPE_OPTIONS,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/options";

const MIN_TRAVEL_TIME = 1;
const MAX_TRAVEL_TIME = 1000;

export interface TravelDataFormValues {
  travelType: ApiTravelType;
  travelDestinations: ApiCountryCode[];
  travelStartDate?: string;
  travelTimeAmount?: number;
  travelTimeUnit?: ApiTravelTimeUnit;
}

interface TravelDataFormProps {
  initialValues: TravelDataFormValues;
  formRef: Ref<SidebarFormHandle>;
  procedureId: string;
  title: string;
  onSubmit: (travelData: TravelDataFormValues) => Promise<void>;
  onCancel: () => void;
  validate?: (
    travelData: TravelDataFormValues,
  ) => FormikErrors<TravelDataFormValues>;
}

export function TravelDataForm(props: Readonly<TravelDataFormProps>) {
  const [hideTravelData, setHideTravelData] = useState(
    props.initialValues.travelType === ApiTravelType.NoTravel,
  );

  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize
      onSubmit={props.onSubmit}
    >
      {({ isSubmitting, setFieldValue }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <Stack gap={2} rowGap={2}>
              <SelectField
                name="travelType"
                label="Reiseart"
                options={VACCINATION_CONSULTATION_TRAVEL_TYPE_OPTIONS}
                required="Bitte eine Reiseart auswählen."
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
              />
              {!hideTravelData ? (
                <>
                  <CountryFieldMulti
                    name="travelDestinations"
                    label="Reiseziele"
                  />
                  <DateField name="travelStartDate" label="Reisebeginn" />
                  <Grid container columnSpacing={2}>
                    <Grid xs={6}>
                      <NumberField
                        name="travelTimeAmount"
                        label="Reisedauer"
                        validate={validateIntegerAnd(
                          validateRange(MIN_TRAVEL_TIME, MAX_TRAVEL_TIME),
                        )}
                        min={MIN_TRAVEL_TIME}
                        max={MAX_TRAVEL_TIME}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <SelectField
                        name="travelTimeUnit"
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
              onCancel={props.onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
