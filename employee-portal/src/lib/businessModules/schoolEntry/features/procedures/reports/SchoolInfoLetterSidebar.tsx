/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCreateSchoolInfoLetterRequest } from "@eshg/employee-portal-api/schoolEntry";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { HiddenContainer } from "@eshg/lib-portal/components/HiddenContainer";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Button, Divider, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";

import { useCreateSchoolInfoLetter } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useSchoolInfoLetterSidebar(): UseSidebarWithFormRefResult<SchoolInfoLetterSidebarProps> {
  return useSidebarWithFormRef({
    component: SchoolInfoLetterSidebar,
  });
}

interface SchoolInfoLetterFormValues {
  note: OptionalFieldValue<string>;
  consultationWithCustodianRecommended: boolean;
  meetingBetweenYouthHealthServicesAndSchoolManagementRecommended: boolean;
  parentsWishNote: OptionalFieldValue<string>;
  referredToFurtherConsultationFromSchool: boolean;
}

const INITIAL_VALUES: SchoolInfoLetterFormValues = {
  note: "",
  consultationWithCustodianRecommended: false,
  meetingBetweenYouthHealthServicesAndSchoolManagementRecommended: false,
  parentsWishNote: "",
  referredToFurtherConsultationFromSchool: false,
};

interface SchoolInfoLetterSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
}

function SchoolInfoLetterSidebar(props: SchoolInfoLetterSidebarProps) {
  const createSchoolInfoLetter = useCreateSchoolInfoLetter(props.procedureId);
  const { downloadContainerRef, download } = useFileDownload(
    createSchoolInfoLetter.mutateAsync,
  );

  async function handleSubmit(values: SchoolInfoLetterFormValues) {
    await download(mapToRequest(values));
    props.onClose(true);
  }

  return (
    <>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        {({ handleSubmit, isSubmitting }) => (
          <SidebarForm ref={props.formRef} onSubmit={handleSubmit}>
            <SidebarContent title="Schulinfobrief erstellen">
              <Stack gap={2}>
                <TextareaField
                  name="note"
                  label="Bemerkung"
                  minRows={15}
                  sxTextarea={{ maxHeight: 450 }}
                />
                <CheckboxField
                  name="consultationWithCustodianRecommended"
                  label="Rücksprache mit den PSB empfohlen"
                />
                <CheckboxField
                  name="meetingBetweenYouthHealthServicesAndSchoolManagement"
                  label="Besprechung Kinder- und Jugendgesundheitsdienst mit Schulleitung"
                />
                <Divider />
                <Typography level="h2">Elternwunsch</Typography>
                <TextareaField
                  name="parentsWishNote"
                  label="Bemerkung"
                  minRows={8}
                  sxTextarea={{ maxHeight: 200 }}
                />
                <CheckboxField
                  name="referredToFurtherConsultationFromSchool"
                  label="auf weitere Beratung der Schule verwiesen"
                />
              </Stack>
              <HiddenContainer ref={downloadContainerRef} />
            </SidebarContent>
            <SidebarActions>
              <ButtonBar
                left={
                  <Button
                    variant="plain"
                    color="primary"
                    onClick={() => props.onClose()}
                  >
                    Abbrechen
                  </Button>
                }
                right={
                  <SubmitButton submitting={isSubmitting}>
                    Erstellen
                  </SubmitButton>
                }
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </>
  );
}

function mapToRequest(
  values: SchoolInfoLetterFormValues,
): ApiCreateSchoolInfoLetterRequest {
  return {
    ...values,
    note: mapOptionalValue(values.note),
    parentsWishNote: mapOptionalValue(values.parentsWishNote),
  };
}
