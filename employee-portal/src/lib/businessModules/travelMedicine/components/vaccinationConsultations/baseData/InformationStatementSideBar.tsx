/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDisease,
  ApiInformationStatementTemplate,
  ApiInformationStatementTemplateState,
} from "@eshg/employee-portal-api/travelMedicine";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { MultiAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/MultiAutocompleteField";
import { SetFieldValueHelper } from "@eshg/lib-portal/types/form";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { useState } from "react";

import {
  UseCreateInformationStatementRequest,
  useCreateInformationStatements,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { useGetAllInformationStatementTemplates } from "@/lib/businessModules/travelMedicine/api/queries/informationStatementTemplateApi";
import { SelectionOption } from "@/lib/shared/components/appointmentBlocks/AppointmentStaffSelection";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface InitFormValues {
  procedureId: string;
  diseases?: string[];
  informationStatementTemplates?: string[];
}

interface InformationStatementSideBarProps {
  sideBarOpen: boolean;
  closeSideBar: () => void;
  allDiseases: ApiDisease[];
  initialValues: InitFormValues;
}

export function InformationStatementSideBar(
  props: Readonly<InformationStatementSideBarProps>,
) {
  const [
    informationStatementTemplateOptions,
    setInformationStatementTemplateOptions,
  ] = useState<SelectionOption[]>([]);
  const createInformationStatements = useCreateInformationStatements();
  const allFinalInformationStatementTemplates =
    useGetAllInformationStatementTemplates().data.filter(
      (t) => t.state === ApiInformationStatementTemplateState.Final,
    );

  async function handleInformationStatementSideBarSubmit(
    values: InitFormValues,
    resetForm: () => void,
  ) {
    const request = createPostInformationStatementsRequest(values);
    await createInformationStatements.mutateAsync(request, {
      onSuccess: () => {
        props.closeSideBar();
        resetForm();
      },
    });
  }

  function createPostInformationStatementsRequest(
    values: InitFormValues,
  ): UseCreateInformationStatementRequest {
    return {
      procedureId: props.initialValues.procedureId,
      apiPostInformationStatements: {
        templateIds: values.informationStatementTemplates ?? [],
      },
    };
  }

  const createDiseaseOptions = props.allDiseases.map((disease) => ({
    value: disease.id,
    label: disease.name,
  }));

  function createInformationStatementTemplateOptions(
    templates: ApiInformationStatementTemplate[],
  ) {
    return templates.map((template) => ({
      value: template.id,
      label: template.title,
    }));
  }

  async function diseaseSelectionChanged(
    selectedDiseases: string[],
    setFieldValue: SetFieldValueHelper,
  ) {
    await setFieldValue("informationStatementTemplates", []);
    const filteredTemplates = allFinalInformationStatementTemplates.filter(
      (template) => {
        const diseaseIdsFromTemplate = template.diseases.map(
          (disease) => disease.id,
        );
        return selectedDiseases.some((diseaseId) =>
          diseaseIdsFromTemplate.includes(diseaseId),
        );
      },
    );
    setInformationStatementTemplateOptions(
      createInformationStatementTemplateOptions(filteredTemplates),
    );
  }

  return (
    <Sidebar open={props.sideBarOpen} onClose={props.closeSideBar}>
      <Formik
        initialValues={{
          ...props.initialValues,
          diseases: [],
          informationStatementTemplates: [],
        }}
        onSubmit={async (values, { resetForm }) => {
          await handleInformationStatementSideBarSubmit(values, resetForm);
        }}
        enableReinitialize
      >
        {({ isSubmitting, setFieldValue, resetForm }) => (
          <FormPlus style={{ display: "contents" }}>
            <SidebarContent title={"Bogen hinzufügen"}>
              <Stack flexDirection="column" gap={2}>
                <MultiAutocompleteField
                  name={"diseases"}
                  label={"Impfungen"}
                  options={createDiseaseOptions}
                  required={"Bitte mindestens eine Impfung auswählen."}
                  onChange={(newValues) =>
                    diseaseSelectionChanged(newValues, setFieldValue)
                  }
                ></MultiAutocompleteField>
                <MultiAutocompleteField
                  name={"informationStatementTemplates"}
                  label={"Aufklärungsbögen"}
                  options={informationStatementTemplateOptions}
                  required={
                    "Bitte mindestens einen Aufklärungsbogen auswählen."
                  }
                ></MultiAutocompleteField>
              </Stack>
            </SidebarContent>
            <SidebarActions>
              <MultiFormButtonBar
                submitLabel="Speichern"
                submitting={isSubmitting}
                onCancel={() => {
                  props.closeSideBar();
                  resetForm();
                }}
              />
            </SidebarActions>
          </FormPlus>
        )}
      </Formik>
    </Sidebar>
  );
}
