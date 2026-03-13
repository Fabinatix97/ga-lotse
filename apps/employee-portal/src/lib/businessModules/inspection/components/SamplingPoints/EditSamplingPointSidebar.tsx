/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid } from "@mui/joy";
import { Formik } from "formik";

import {
  ApiGetReferenceFacilityResponse,
  ApiSamplingPoint,
} from "@eshg/inspection-api";
import {
  FormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  useConfirmationDialog,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { InputField, SelectObjectField } from "@eshg/lib-portal";

import { useUpdateSamplingPoint } from "@/lib/businessModules/inspection/api/mutations/samplingPoints";
import { useGetFacilities } from "@/lib/businessModules/inspection/api/queries/samplingPoints";

export interface EditableSamplingPoint {
  facility: {
    value: string;
    label: string;
  };
  name: string;
  zid: string;
}

interface EditSamplingPointSidebarProps extends SidebarWithFormRefProps {
  samplingPoint: ApiSamplingPoint;
}

export function useEditSamplingPointSidebar() {
  return useSidebarWithFormRef({
    component: EditSamplingPointSidebarWithQueriesAndMutations,
  });
}

function EditSamplingPointSidebarWithQueriesAndMutations({
  onClose,
  formRef,
  samplingPoint,
}: Readonly<EditSamplingPointSidebarProps>) {
  const { openConfirmationDialog } = useConfirmationDialog();

  const initialValues: EditableSamplingPoint = {
    facility: {
      value: samplingPoint.facility?.externalId ?? "",
      label: samplingPoint.facility?.name ?? "",
    },
    name: samplingPoint.name ?? "",
    zid: samplingPoint.zid ?? "",
  };

  const { mutateAsync: updateSamplingPoint } = useUpdateSamplingPoint();
  const { data: facilities, isLoading } = useGetFacilities();

  const facilityOptionsArray: { value: string; label: string }[] = [];
  const facilityRecord: Record<string, ApiGetReferenceFacilityResponse> =
    facilities;

  Object.entries(facilityRecord).forEach(([key, value]) => {
    facilityOptionsArray.push({ label: value.name, value: key });
  });

  function saveWithConfirmation(values: EditableSamplingPoint) {
    async function confirmSave() {
      await updateSamplingPoint(
        {
          samplingPointId: samplingPoint.id,
          request: {
            facilityId: values.facility.value,
            name: values.name,
            version: samplingPoint.version,
            zid: values.zid,
          },
        },
        {
          onSuccess: () => onClose(true),
        },
      );
    }

    openConfirmationDialog({
      onConfirm: async () => {
        try {
          await confirmSave();
        } catch {
          close();
        }
      },
    });
    return Promise.resolve();
  }

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={saveWithConfirmation}
    >
      {({ isSubmitting, setFieldValue }) => (
        <SidebarForm
          ref={formRef}
          aria-label={`${samplingPoint.name} bearbeiten`}
        >
          <SidebarContent title={`${samplingPoint.name} bearbeiten`}>
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
