/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiContactCategory } from "@eshg/employee-portal-api/base";
import { ApiProphylaxisType } from "@eshg/employee-portal-api/dental";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";
import { useHasChanged } from "@eshg/lib-portal/hooks/useHasChanged";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Stack } from "@mui/joy";
import { FormikProvider, useFormik } from "formik";
import { useEffect } from "react";

import { useCreateProphylaxisSession } from "@/lib/businessModules/dental/api/mutations/prophylaxisSessionApi";
import { SearchGroupField } from "@/lib/businessModules/dental/features/prophylaxisSessions/SearchGroupField";
import { PROPHYLAXIS_TYPE_OPTIONS } from "@/lib/businessModules/dental/features/prophylaxisSessions/options";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { DateTimeField } from "@/lib/shared/components/formFields/DateTimeField";
import { SearchMultipleContactsField } from "@/lib/shared/components/formFields/SearchMultipleContactsField";
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
  groupName: OptionalFieldValue<string>;
  type: OptionalFieldValue<ApiProphylaxisType>;
}

function mapValues(values: CreateProphylaxisSessionValues) {
  return {
    dateAndTime: new Date(values.dateAndTime),
    institutionId: mapRequiredValue(values.institutionId),
    groupName: mapRequiredValue(values.groupName),
    type: mapRequiredValue(values.type),
  };
}

function CreateProphylaxisSessionSidebar(props: SidebarWithFormRefProps) {
  const createSession = useCreateProphylaxisSession();

  const formik = useFormik<CreateProphylaxisSessionValues>({
    initialValues: {
      dateAndTime: "",
      institutionId: "",
      groupName: "",
      type: "",
    },
    onSubmit: (values) =>
      createSession.mutateAsync(mapValues(values), {
        onSuccess: () => {
          props.onClose(true);
        },
      }),
  });

  const shouldClearGroupName = useHasChanged(formik.values.institutionId);
  useEffect(() => {
    if (shouldClearGroupName) {
      void formik.setFieldValue("groupName", "");
    }
  }, [shouldClearGroupName, formik, formik.setFieldValue]);

  return (
    <FormikProvider value={formik}>
      <SidebarForm ref={props.formRef} onSubmit={formik.handleSubmit}>
        <SidebarContent title="Prophylaxe anlegen">
          <Stack gap={3}>
            <DateTimeField
              name="dateAndTime"
              label="Datum und Uhrzeit"
              required="Bitte ein Datum mit Uhrzeit angeben."
            />
            <SearchMultipleContactsField
              name="institutionId"
              label="Einrichtung"
              categories={new Set<ApiContactCategory>()
                .add(ApiContactCategory.School)
                .add(ApiContactCategory.Daycare)}
            />
            <SearchGroupField
              name="groupName"
              label="Gruppe"
              institutionId={formik.values.institutionId}
            />
            <SelectField
              name="type"
              label="Typ"
              options={PROPHYLAXIS_TYPE_OPTIONS}
              required="Bitte den Typ der Prophylaxe angeben."
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
