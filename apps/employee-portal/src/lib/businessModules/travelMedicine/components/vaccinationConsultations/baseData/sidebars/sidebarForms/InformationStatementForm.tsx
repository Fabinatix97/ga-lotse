/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref, useState } from "react";
import { isDefined, isEmpty } from "remeda";

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import {
  MultiAutocompleteField,
  SelectOption,
  SetFieldValueHelper,
} from "@eshg/lib-portal";
import {
  ApiDisease,
  ApiInformationStatementTemplate,
  ApiInformationStatementTemplateState,
} from "@eshg/travel-medicine-api";

import {
  createDiseaseOptions,
  createInformationStatementTemplateOptions,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/helpers";

export interface InformationStatementFormValues {
  procedureId: string;
  diseases?: string[];
  informationStatementTemplates?: string[];
}

interface InformationStatementFormProps {
  initialValues: InformationStatementFormValues;
  allInformationStatementTemplates: ApiInformationStatementTemplate[];
  allDiseases: ApiDisease[];
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSubmit: (values: InformationStatementFormValues) => Promise<void>;
  title: string;
  submitLabel: string;
}

interface SelectionOption {
  label: string;
  value: string;
}

export function InformationStatementForm(
  props: Readonly<InformationStatementFormProps>,
) {
  const [
    informationStatementTemplateOptions,
    setInformationStatementTemplateOptions,
  ] = useState<SelectionOption[]>([]);

  const diseaseOptions: SelectOption[] = createDiseaseOptions(
    props.allDiseases,
  );

  const allFinalInformationStatementTemplates = isDefined(
    props.allInformationStatementTemplates,
  )
    ? props.allInformationStatementTemplates.filter(
        (t) => t.state === ApiInformationStatementTemplateState.Final,
      )
    : [];

  async function handleDiseaseChange(
    selectedDiseases: string[],
    setFieldValue: SetFieldValueHelper,
  ) {
    await setFieldValue("informationStatementTemplates", []);

    setInformationStatementTemplateOptions(
      createInformationStatementTemplateOptions(
        allFinalInformationStatementTemplates,
        selectedDiseases,
      ),
    );
  }

  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize
      onSubmit={props.onSubmit}
    >
      {({ isSubmitting, setFieldValue }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <Stack flexDirection="column" gap={2}>
              <MultiAutocompleteField
                name="diseases"
                label="Impfungen"
                options={diseaseOptions}
                required="Bitte mindestens eine Impfung auswählen."
                onChange={(newValues) =>
                  handleDiseaseChange(newValues, setFieldValue)
                }
              />
              <MultiAutocompleteField
                name="informationStatementTemplates"
                label="Aufklärungsbögen"
                options={
                  isEmpty(informationStatementTemplateOptions) &&
                  props.initialValues.diseases
                    ? createInformationStatementTemplateOptions(
                        allFinalInformationStatementTemplates,
                        props.initialValues.diseases,
                      )
                    : informationStatementTemplateOptions
                }
                required="Bitte mindestens einen Aufklärungsbogen auswählen."
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel={props.submitLabel}
              submitting={isSubmitting}
              onCancel={props.onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
