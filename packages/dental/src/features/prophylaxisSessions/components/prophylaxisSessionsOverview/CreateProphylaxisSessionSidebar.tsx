/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Formik } from "formik";

import { ApiDentitionType } from "@eshg/dental-api";
import {
  FormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal";

import { useGetStaff } from "../../../../api/queries/staff";
import { useCreateProphylaxisSession } from "../../api/mutations/overview";
import {
  ProphylaxisSessionForm,
  ProphylaxisSessionFormValues,
  mapProphylaxisSessionFormValuesToRequest,
} from "../prophylaxisSessionDetails/ProphylaxisSessionForm";

const INITIAL_VALUES: ProphylaxisSessionFormValues = {
  dateAndTime: "",
  institution: null,
  groupName: "",
  type: "",
  isScreening: false,
  dentitionType: ApiDentitionType.Mixed,
  isFluoridation: false,
  fluoridationVarnish: "",
  dentistIds: [],
  zfaIds: [],
};

export function useCreateProphylaxisSessionSidebar(): UseSidebarWithFormRefResult {
  return useSidebarWithFormRef({
    component: CreateProphylaxisSessionSidebar,
  });
}

function CreateProphylaxisSessionSidebar(props: SidebarWithFormRefProps) {
  const createSession = useCreateProphylaxisSession();
  const { allDentists, allDentalAssistants } = useGetStaff();
  const snackbar = useSnackbar();

  function onSubmit(values: ProphylaxisSessionFormValues) {
    createSession
      .mutateAsync(mapProphylaxisSessionFormValuesToRequest(values), {
        onSuccess: () => props.onClose(true),
      })
      .catch(() =>
        snackbar.error("Die Daten konnten nicht gespeichert werden."),
      );
  }

  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={onSubmit}>
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
