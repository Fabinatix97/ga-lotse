/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Formik } from "formik";

import {
  FormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { toDateTimeString } from "@eshg/lib-portal/helpers/dateTime";
import { parseOptionalValue } from "@eshg/lib-portal/helpers/form";

import { useGetStaff } from "@/api/queries/staff";
import { ProphylaxisSessionDetails } from "@/features/prophylaxisSessions/api/models/ProphylaxisSessionDetails";
import { useUpdateProphylaxisSession } from "@/features/prophylaxisSessions/api/mutations/details";

import {
  ProphylaxisSessionForm,
  ProphylaxisSessionFormValues,
  mapProphylaxisSessionFormValuesToRequest,
} from "./ProphylaxisSessionForm";

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

  const initialValues: ProphylaxisSessionFormValues = {
    dateAndTime: toDateTimeString(prophylaxisSession.dateAndTime),
    institution: prophylaxisSession.institution,
    groupName: prophylaxisSession.groupName,
    type: prophylaxisSession.type,
    isScreening: prophylaxisSession.isScreening,
    dentitionType: parseOptionalValue(prophylaxisSession.dentitionType),
    isFluoridation: !!prophylaxisSession.fluoridationVarnish,
    fluoridationVarnish: parseOptionalValue(
      prophylaxisSession.fluoridationVarnish,
    ),
    dentistIds: prophylaxisSession.dentists.map((dentist) => dentist.id),
    zfaIds: prophylaxisSession.zfas.map((zfa) => zfa.id),
  };

  function onSubmit(values: ProphylaxisSessionFormValues) {
    updateSession
      .mutateAsync(
        {
          version: prophylaxisSession.version,
          ...mapProphylaxisSessionFormValuesToRequest(values),
        },
        {
          onSuccess: () => props.onClose(true),
        },
      )
      .catch(() => snackbar.error("Die Daten konnten nicht geändert werden."));
  }

  return (
    <Formik<ProphylaxisSessionFormValues>
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
        <SidebarForm ref={props.formRef} onSubmit={handleSubmit}>
          <SidebarContent title="Prophylaxe ändern">
            <ProphylaxisSessionForm
              values={values}
              setFieldValue={setFieldValue}
              dentistOptions={allDentists}
              dentalAssistantOptions={allDentalAssistants}
              hasExaminationResults={hasExaminationResults}
            />
          </SidebarContent>
          <SidebarActions>
            <FormButtonBar
              submitLabel="Ändern"
              submitting={isSubmitting}
              onCancel={() => props.onClose(false)}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
