/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  TextareaField,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { ApiCreateSchoolInfoLetterRequest } from "@eshg/school-entry-api";
import { Button, Divider, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";

import { useCreateSchoolInfoLetter } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";

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
  prefilled: boolean;
}

const INITIAL_VALUES: SchoolInfoLetterFormValues = {
  note: "",
  consultationWithCustodianRecommended: false,
  meetingBetweenYouthHealthServicesAndSchoolManagementRecommended: false,
  parentsWishNote: "",
  referredToFurtherConsultationFromSchool: false,
  prefilled: true,
};

interface SchoolInfoLetterSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
}

function SchoolInfoLetterSidebar(props: SchoolInfoLetterSidebarProps) {
  const createSchoolInfoLetter = useCreateSchoolInfoLetter(props.procedureId);
  const { download } = useFileDownload(createSchoolInfoLetter.mutateAsync);

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
                  name="meetingBetweenYouthHealthServicesAndSchoolManagementRecommended"
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
                <CheckboxField
                  name="prefilled"
                  label="Mit Ergebnissen aus der Anamnese und der Untersuchung vorausgefüllt"
                />
              </Stack>
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
