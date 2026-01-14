/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack, Typography } from "@mui/joy";
import { FormikProvider, useFormik } from "formik";

import {
  ApiDentitionType,
  ApiFluoridationVarnish,
  ApiProphylaxisType,
  ApiUpdateProphylaxisSessionRequest,
} from "@eshg/dental-api";
import {
  DateTimeField,
  FormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  UserField,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  Alert,
  OptionalFieldValue,
  SelectField,
  mapOptionalValue,
  mapRequiredValue,
  parseOptionalValue,
  toDateTimeString,
  useSnackbar,
} from "@eshg/lib-portal";

import { useGetStaff } from "../../../../api/queries/staff";
import { PROPHYLAXIS_TYPE_OPTIONS_WITH_DESELECTION } from "../../../../config/prophylaxisSession";
import { ProphylaxisSessionDetails } from "../../api/models/ProphylaxisSessionDetails";
import { useUpdateProphylaxisSession } from "../../api/mutations/details";

import { FluoridationField } from "./FluoridationField";
import { ScreeningField } from "./ScreeningField";

interface UpdateProphylaxisSessionFormValues {
  dateAndTime: string;
  type: OptionalFieldValue<ApiProphylaxisType>;
  isScreening: boolean;
  dentitionType: OptionalFieldValue<ApiDentitionType>;
  isFluoridation: boolean;
  fluoridationVarnish: OptionalFieldValue<ApiFluoridationVarnish>;
  dentistIds: string[];
  zfaIds: string[];
}

export function useUpdateProphylaxisSessionSidebar(): UseSidebarWithFormRefResult<UpdateProphylaxisSessionSidebarProps> {
  return useSidebarWithFormRef({
    component: UpdateProphylaxisSessionSidebar,
  });
}

interface UpdateProphylaxisSessionSidebarProps extends SidebarWithFormRefProps {
  prophylaxisSession: ProphylaxisSessionDetails;
}

function UpdateProphylaxisSessionSidebar(
  props: UpdateProphylaxisSessionSidebarProps,
) {
  const prophylaxisSession = props.prophylaxisSession;
  const updateSession = useUpdateProphylaxisSession(prophylaxisSession.id);
  const { allDentists, allDentalAssistants } = useGetStaff();
  const snackbar = useSnackbar();

  const hasExaminationResults = prophylaxisSession.participants.some(
    (item) => !!item.result,
  );

  const INITIAL_VALUES: UpdateProphylaxisSessionFormValues = {
    dateAndTime: toDateTimeString(prophylaxisSession.dateAndTime),
    type: parseOptionalValue(prophylaxisSession.type),
    isScreening: prophylaxisSession.isScreening,
    dentitionType: parseOptionalValue(prophylaxisSession.dentitionType),
    isFluoridation: !!prophylaxisSession.fluoridationVarnish,
    fluoridationVarnish: parseOptionalValue(
      prophylaxisSession.fluoridationVarnish,
    ),
    dentistIds: prophylaxisSession.dentists.map((dentist) => dentist.id),
    zfaIds: prophylaxisSession.zfas.map((zfa) => zfa.id),
  };

  const form = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: onSubmit,
  });

  function onSubmit(values: UpdateProphylaxisSessionFormValues) {
    updateSession
      .mutateAsync(
        mapProphylaxisSessionFormValuesToRequest(
          values,
          prophylaxisSession.version,
        ),

        {
          onSuccess: () => props.onClose(true),
        },
      )
      .catch(() => snackbar.error("Die Daten konnten nicht geändert werden."));
  }

  return (
    <FormikProvider value={form}>
      <SidebarForm ref={props.formRef}>
        <SidebarContent title="Maßnahme ändern">
          <Stack gap={3}>
            {hasExaminationResults && (
              <Alert
                color="primary"
                message="Da bereits Ergebnisse zu dieser Untersuchung eingetragen wurden, können einige Daten nicht mehr geändert werden."
              />
            )}
            <DateTimeField
              name="dateAndTime"
              label="Datum und Uhrzeit"
              required="Bitte ein Datum mit Uhrzeit angeben."
            />
            <SelectField
              name="type"
              label="Typ"
              options={PROPHYLAXIS_TYPE_OPTIONS_WITH_DESELECTION}
            />
            <ScreeningField screeningDisabled={hasExaminationResults} />
            <FluoridationField disabled={hasExaminationResults} />
            <Typography component="h2" level="title-sm">
              Durchführende Personen
            </Typography>
            <UserField
              name="dentistIds"
              options={allDentists}
              blockedStaff={[]}
              freeStaff={[]}
              label="Zahnarzt/-ärztin"
            />
            <UserField
              name="zfaIds"
              options={allDentalAssistants}
              blockedStaff={[]}
              freeStaff={[]}
              label="ZFA"
            />
          </Stack>
        </SidebarContent>
        <SidebarActions>
          <FormButtonBar
            submitLabel="Ändern"
            submitting={form.isSubmitting}
            onCancel={() => props.onClose(false)}
          />
        </SidebarActions>
      </SidebarForm>
    </FormikProvider>
  );
}

function mapProphylaxisSessionFormValuesToRequest(
  values: UpdateProphylaxisSessionFormValues,
  version: number,
): ApiUpdateProphylaxisSessionRequest {
  return {
    version,
    dateAndTime: new Date(values.dateAndTime),
    type: mapOptionalValue(values.type),
    isScreening: values.isScreening,
    dentitionType: values.isScreening
      ? mapRequiredValue(values.dentitionType)
      : undefined,
    fluoridationVarnish: values.isFluoridation
      ? mapRequiredValue(values.fluoridationVarnish)
      : undefined,
    dentistIds: values.dentistIds,
    zfaIds: values.zfaIds,
  };
}
