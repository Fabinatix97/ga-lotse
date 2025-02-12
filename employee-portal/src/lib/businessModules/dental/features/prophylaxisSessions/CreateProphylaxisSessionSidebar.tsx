/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useCreateProphylaxisSession } from "@eshg/dental/api/mutations/prophylaxisSessionApi";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
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
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

import { useGetStaff } from "./staff";

export function useCreateProphylaxisSessionSidebar() {
  return useSidebarWithFormRef({
    component: CreateProphylaxisSessionSidebar,
  });
}

function CreateProphylaxisSessionSidebar(props: SidebarWithFormRefProps) {
  const createSession = useCreateProphylaxisSession();
  const { allDentists, allDentalAssistants } = useGetStaff();
  const snackbar = useSnackbar();

  const initialValues: ProphylaxisSessionValues = {
    dateAndTime: "",
    institution: "",
    groupName: "",
    type: "",
    isScreening: false,
    isFluoridation: false,
    fluoridationVarnish: "",
    dentistIds: [],
    zfaIds: [],
  };

  function onSubmit(values: ProphylaxisSessionValues) {
    createSession
      .mutateAsync(
        {
          ...mapValues(values),
        },
        {
          onSuccess: () => props.onClose(true),
        },
      )
      .catch(() =>
        snackbar.error("Die Daten konnten nicht gespeichert werden."),
      );
  }

  return (
    <Formik<ProphylaxisSessionValues>
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
        <SidebarForm ref={props.formRef} onSubmit={handleSubmit}>
          <SidebarContent title="Prophylaxe anlegen">
            <ProphylaxisSessionForm
              values={values}
              setFieldValue={setFieldValue}
              dentistOptions={allDentists}
              dentalAssistantOptions={allDentalAssistants}
            />
          </SidebarContent>
          <SidebarActions>
            <FormButtonBar
              submitLabel="Anlegen"
              submitting={isSubmitting}
              onCancel={() => props.onClose(false)}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
