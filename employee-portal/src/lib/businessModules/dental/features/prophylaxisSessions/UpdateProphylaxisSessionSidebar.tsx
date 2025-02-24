/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ProphylaxisSessionDetails } from "@eshg/dental/api/models/ProphylaxisSessionDetails";
import { useUpdateProphylaxisSession } from "@eshg/dental/api/mutations/prophylaxisSessionApi";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { toDateTimeString } from "@eshg/lib-portal/helpers/dateTime";
import { parseOptionalValue } from "@eshg/lib-portal/helpers/form";
import { Formik } from "formik";

import {
  ProphylaxisSessionForm,
  ProphylaxisSessionValues,
  mapValues,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/ProphylaxisSessionForm";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

import { useGetStaff } from "./staff";

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

  const initialValues: ProphylaxisSessionValues = {
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

  function onSubmit(values: ProphylaxisSessionValues) {
    updateSession
      .mutateAsync(
        {
          version: prophylaxisSession.version,
          ...mapValues(values),
        },
        {
          onSuccess: () => props.onClose(true),
        },
      )
      .catch(() => snackbar.error("Die Daten konnten nicht geändert werden."));
  }

  return (
    <Formik<ProphylaxisSessionValues>
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
