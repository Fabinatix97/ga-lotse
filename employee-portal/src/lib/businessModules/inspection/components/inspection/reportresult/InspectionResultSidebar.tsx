/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiFollowupType,
  ApiInspectionFollowupInfo,
  ApiInspectionResult,
} from "@eshg/employee-portal-api/inspection";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { optionsFromRecord } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import { Grid } from "@mui/joy";
import { addDays, setHours, setMinutes } from "date-fns";
import { Formik } from "formik";

import { useUpdateInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import {
  followupTypeNames,
  inspectionResultNames,
} from "@/lib/businessModules/inspection/shared/enums";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { validateTodayOrFutureDate } from "@/lib/shared/helpers/validators";

const FOLLOWUP_INSPECTION_INTERVAL_IN_DAYS = 14;

export interface InspectionResultSidebarProps {
  open: boolean;
  onClose: () => void;
  procedureId: string;
  result: ApiInspectionResult;
  followupInfo?: ApiInspectionFollowupInfo;
  executedAppointment: Date;
}

interface ResultFormType {
  result: ApiInspectionResult | null;
  followupType: ApiFollowupType | null;
  followupDate: string;
}

export function InspectionResultSidebar({
  open,
  onClose,
  procedureId,
  result,
  followupInfo,
  executedAppointment,
}: Readonly<InspectionResultSidebarProps>) {
  function handleClose() {
    onClose();
  }

  const { mutateAsync: updateInspection } = useUpdateInspection();

  const initialValues: ResultFormType = {
    result: result === ApiInspectionResult.Open ? null : result,
    followupType: followupInfo?.followupType ?? null,
    followupDate: toDateString(
      addDays(
        followupInfo?.followupDate ?? new Date(),
        FOLLOWUP_INSPECTION_INTERVAL_IN_DAYS,
      ),
    ),
  };

  const resultOptions = optionsFromRecord(inspectionResultNames).filter(
    ({ value }) => value !== ApiInspectionResult.Open,
  );

  const followupTypes = optionsFromRecord(followupTypeNames);

  async function handleSubmit(values: ResultFormType) {
    const result = values.result;
    if (result !== null) {
      const followupType =
        result === ApiInspectionResult.SuccessfulWithIncidents &&
        values.followupType !== null
          ? values.followupType
          : undefined;
      let followupDate =
        followupType === ApiFollowupType.Review
          ? new Date(values.followupDate)
          : undefined;
      if (followupDate) {
        // followupDate should start by default at the same time as the current appointment
        followupDate = setHours(followupDate, executedAppointment.getHours());
        followupDate = setMinutes(
          followupDate,
          executedAppointment.getMinutes(),
        );
      }
      await updateInspection(
        {
          id: procedureId,
          apiUpdateInspectionRequest: {
            result,
            followupType,
            followupDate,
          },
        },
        {
          onSuccess: handleClose,
        },
      );
    }
  }

  return (
    <Sidebar open={open} onClose={onClose}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, handleSubmit, values }) => (
          <SidebarForm onSubmit={handleSubmit}>
            <SidebarContent title="Bewertung">
              <Grid container columnSpacing={2} rowSpacing={3}>
                <Grid xs={12}>
                  <SelectField
                    name="result"
                    label="Ergebnis"
                    options={resultOptions}
                    required="Bitte ein Ergebnis auswählen."
                  />
                </Grid>
                {values.result ===
                  ApiInspectionResult.SuccessfulWithIncidents && (
                  <>
                    <Grid xs={12}>
                      <SelectField
                        name="followupType"
                        label="Folgebegehungstyp"
                        options={followupTypes}
                        required="Bitte den Folgebegehungstyp auswählen"
                      />
                    </Grid>
                    {values.followupType === ApiFollowupType.Review && (
                      <Grid xs={12}>
                        <DateField
                          name="followupDate"
                          label="Datum der Nachprüfung"
                          required="Bitte das Datum der Nachprüfung auswählen"
                          validate={validateTodayOrFutureDate}
                        />
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
            </SidebarContent>
            <SidebarActions>
              <FormButtonBar
                submitLabel="Speichern"
                submitting={isSubmitting}
                onCancel={onClose}
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}
