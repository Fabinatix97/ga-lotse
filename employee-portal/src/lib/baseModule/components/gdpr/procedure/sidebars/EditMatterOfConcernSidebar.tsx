/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetGdprProcedureResponse } from "@eshg/base-api";
import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  TextareaField,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Stack } from "@mui/joy";
import { Formik } from "formik";

import { useSetMatterOfConcern } from "@/lib/baseModule/api/mutations/gdpr";
import { statusTranslation } from "@/lib/baseModule/components/gdpr/i18n";

interface EditMatterOfConcernSidebarProps extends SidebarWithFormRefProps {
  procedure: ApiGetGdprProcedureResponse;
}

interface EditMatterOfConcernFormValues {
  matterOfConcern: string;
  status: string;
  date: string;
}

export function useEditMatterOfConcernSidebar() {
  return useSidebarWithFormRef({
    component: EditMatterOfConcernSidebar,
  });
}

function EditMatterOfConcernSidebar({
  procedure,
  formRef,
  onClose,
}: EditMatterOfConcernSidebarProps) {
  const fieldName = createFieldNameMapper<EditMatterOfConcernFormValues>();
  const setMatterOfConcern = useSetMatterOfConcern(
    procedure.id,
    procedure.version,
  );

  return (
    <Formik
      initialValues={{
        matterOfConcern: procedure.matterOfConcern ?? "",
        status: statusTranslation[procedure.status],
        date: formatDate(procedure.createdAt),
      }}
      onSubmit={async (values: EditMatterOfConcernFormValues) => {
        await setMatterOfConcern.mutateAsync(values.matterOfConcern, {
          onSuccess: () => onClose(true),
        });
      }}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={formRef}>
          <SidebarContent title={"Vorgang bearbeiten"}>
            <Stack gap={2}>
              <InputField
                label={"Erstellt"}
                name={fieldName("date")}
                readOnly
              />
              <InputField
                label={"Status"}
                name={fieldName("status")}
                readOnly
              />
              <TextareaField
                label={"Anliegen"}
                name={fieldName("matterOfConcern")}
                required={"Bitte ein Anliegen angeben."}
                sxTextarea={{
                  minHeight: "6rem",
                }}
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={isSubmitting}
              submitLabel={"Speichern"}
              onCancel={() => onClose(false)}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
