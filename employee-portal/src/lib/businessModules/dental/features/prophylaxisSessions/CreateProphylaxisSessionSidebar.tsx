/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiContactCategory } from "@eshg/employee-portal-api/base";
import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Stack } from "@mui/joy";
import { FormikProvider, useFormik } from "formik";

import { useCreateProphylaxisSession } from "@/lib/businessModules/dental/api/mutations/prophylaxisSessionApi";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { DateTimeField } from "@/lib/shared/components/formFields/DateTimeField";
import { SearchContactField } from "@/lib/shared/components/formFields/SearchContactField";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useCreateProphylaxisSessionSidebar() {
  return useSidebarWithFormRef({
    component: CreateProphylaxisSessionSidebar,
  });
}

export interface CreateProphylaxisSessionValues {
  dateAndTime: string;
  institutionId: OptionalFieldValue<string>;
}

function mapValues(values: CreateProphylaxisSessionValues) {
  return {
    dateAndTime: new Date(values.dateAndTime),
    institutionId: mapRequiredValue(values.institutionId),
  };
}

function CreateProphylaxisSessionSidebar(props: SidebarWithFormRefProps) {
  const createSession = useCreateProphylaxisSession();

  const formik = useFormik<CreateProphylaxisSessionValues>({
    initialValues: {
      dateAndTime: "",
      institutionId: "",
    },
    onSubmit: (values) =>
      createSession.mutateAsync(mapValues(values), {
        onSuccess: () => {
          props.onClose(true);
        },
      }),
  });

  return (
    <FormikProvider value={formik}>
      <SidebarForm ref={props.formRef} onSubmit={formik.handleSubmit}>
        <SidebarContent title="Prophylaxe anlegen">
          <Stack gap={3}>
            <DateTimeField
              name="dateAndTime"
              label="Datum und Uhrzeit"
              allowEmpty={false}
            />
            <SearchContactField
              name="institutionId"
              label="Einrichtung"
              category={ApiContactCategory.School} // Todo: Allow multiple categories, School and Daycare
            />
          </Stack>
        </SidebarContent>
        <SidebarActions>
          <FormButtonBar
            submitLabel="Anlegen"
            submitting={formik.isSubmitting}
            onCancel={() => {
              props.onClose(false);
            }}
          />
        </SidebarActions>
      </SidebarForm>
    </FormikProvider>
  );
}
