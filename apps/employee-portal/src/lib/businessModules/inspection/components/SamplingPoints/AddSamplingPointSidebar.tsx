/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid } from "@mui/joy";
import { Formik } from "formik";

import { ApiGetReferenceFacilityResponse } from "@eshg/inspection-api";
import {
  FormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { InputField, SelectObjectField } from "@eshg/lib-portal";

import { useCreateSamplingPoints } from "@/lib/businessModules/inspection/api/mutations/samplingPoints";
import { useGetFacilities } from "@/lib/businessModules/inspection/api/queries/samplingPoints";

export interface AddSamplingPoint {
  facility: {
    value: string;
    label: string;
  };
  name: string;
  zid: string;
  version: number;
}

export function useAddSamplingPointSidebar() {
  return useSidebarWithFormRef({
    component: AddSamplingPointSidebarWithQueriesAndMutations,
  });
}

function AddSamplingPointSidebarWithQueriesAndMutations({
  onClose,
  formRef,
}: Readonly<SidebarWithFormRefProps>) {
  const initialValues: AddSamplingPoint = {
    facility: { value: "", label: "" },
    name: "",
    zid: "",
    version: 0,
  };

  const { mutateAsync: saveSamplingPoint } = useCreateSamplingPoints();
  const { data: facilities, isLoading } = useGetFacilities();

  const facilityOptionsArray: { value: string; label: string }[] = [];
  const facilityRecord: Record<string, ApiGetReferenceFacilityResponse> =
    facilities;

  Object.entries(facilityRecord).forEach(([key, value]) => {
    facilityOptionsArray.push({ label: value.name, value: key });
  });

  async function save(values: AddSamplingPoint) {
    await saveSamplingPoint(
      {
        facilityId: values.facility.value,
        name: values.name,
        zid: values.zid,
        version: values.version,
      },
      {
        onSuccess: () => onClose(true),
      },
    );

    return Promise.resolve();
  }

  return (
    <Formik initialValues={initialValues} enableReinitialize onSubmit={save}>
      {({ isSubmitting, setFieldValue }) => (
        <SidebarForm ref={formRef} aria-label="Entnahmestelle hinzufügen">
          <SidebarContent title="Entnahmestelle hinzufügen">
            <Grid container columnSpacing={1} rowSpacing={3}>
              <Grid xs={12}>
                <SelectObjectField
                  label="Einrichtung"
                  required="Einrichtung Auswählen"
                  name="facility"
                  loading={isLoading}
                  options={facilityOptionsArray}
                  sx={{ flex: 1 }}
                  getOptionLabel={(option) => option.label}
                  getOptionKey={(option) => option.value}
                  isOptionEqualToValue={(option, value) =>
                    value.value === option.value
                  }
                  onValueChanged={(value) => {
                    void setFieldValue("facility.value", value?.value);
                    void setFieldValue("facility.label", value?.label);
                  }}
                />
              </Grid>
              <Grid xs={12}>
                <InputField
                  name="name"
                  label="Name"
                  required="Bitte füllen Sie dieses Feld aus"
                />
              </Grid>
              <Grid xs={12}>
                <InputField
                  name="zid"
                  label="ZID"
                  required="Bitte füllen Sie dieses Feld aus"
                />
              </Grid>
            </Grid>
          </SidebarContent>
          <SidebarActions>
            <FormButtonBar
              submitLabel="Speichern"
              submitting={isSubmitting}
              onCancel={() => onClose(false)}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
