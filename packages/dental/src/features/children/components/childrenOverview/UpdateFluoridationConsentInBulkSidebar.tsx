/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { Formik } from "formik";

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  BooleanSelectField,
  DateField,
  toDateString,
  toUtcDate,
  useValidatePastOrTodayDate,
} from "@eshg/lib-portal";

import { useUpdateFluoridationConsentInBulk } from "../../api/mutations/overview";

interface UpdateFluoridationConsentBulkFormValues {
  dateOfConsent: string;
  consented: boolean;
}

const INITIAL_VALUES: UpdateFluoridationConsentBulkFormValues = {
  dateOfConsent: toDateString(new Date()),
  consented: true,
};

interface UpdateFluoridationConsentBulkProps extends SidebarWithFormRefProps {
  childIds: string[];
}

export function useUpdateFluoridationConsentBulkSidebar(): UseSidebarWithFormRefResult<UpdateFluoridationConsentBulkProps> {
  return useSidebarWithFormRef({
    component: UpdateFluoridationConsentBulkSidebar,
  });
}

function UpdateFluoridationConsentBulkSidebar(
  props: UpdateFluoridationConsentBulkProps,
) {
  const validatePastOrTodayDate = useValidatePastOrTodayDate();
  const { mutateAsync: updateFluoridationConsentInBulk } =
    useUpdateFluoridationConsentInBulk();

  async function handleSubmit(values: UpdateFluoridationConsentBulkFormValues) {
    await updateFluoridationConsentInBulk({
      apiUpdateFluoridationConsentBulkRequest: {
        childIds: props.childIds,
        dateOfConsent: toUtcDate(values.dateOfConsent),
        consented: values.consented,
      },
    });
    props.onClose(true);
  }

  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title="Einverständnis für die Fluoridierung">
            <Stack gap={2}>
              <DateField
                name="dateOfConsent"
                label="Datum der Einverständnis"
                validate={validatePastOrTodayDate}
                required="Bitte das Datum der Einverständniserklärung angeben."
              />
              <BooleanSelectField
                name="consented"
                label="Einverständnis gegeben"
                required='Bitte "Ja" oder "Nein" auswählen.'
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={isSubmitting}
              submitLabel="Speichern"
              onCancel={() => props.onClose(false)}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
