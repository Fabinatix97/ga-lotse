/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInformationStatementTemplateState } from "@eshg/employee-portal-api/travelMedicine";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { MultiAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/MultiAutocompleteField";
import { SetFieldValueHelper } from "@eshg/lib-portal/types/form";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { useState } from "react";
import { isDefined, isEmpty } from "remeda";

import {
  UseCreateInformationStatementRequest,
  useCreateInformationStatements,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { useGetAllDiseasesUnsuspended } from "@/lib/businessModules/travelMedicine/api/queries/diseaseApi";
import { useGetAllInformationStatementTemplatesUnsuspended } from "@/lib/businessModules/travelMedicine/api/queries/informationStatementTemplateApi";
import { VaccinationConsultationSidebarsProps } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationConsultationDetails";
import {
  createDiseaseOptions,
  createInformationStatementTemplateOptions,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/helpers";
import { SelectionOption } from "@/lib/shared/components/appointmentBlocks/AppointmentStaffSelection";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export interface InformationStatementValues {
  procedureId: string;
  diseases?: string[];
  informationStatementTemplates?: string[];
}

export const initialValuesInformationStatementSidebar: InformationStatementValues =
  {
    procedureId: "",
    diseases: [],
    informationStatementTemplates: [],
  };

interface InformationStatementSidebarProps {
  onSuccess: () => void;
  onCancel: () => void;
  onClose: (item: VaccinationConsultationSidebarsProps) => void;
  open: boolean;
  initialValues: InformationStatementValues;
}

export function InformationStatementSidebar(
  props: Readonly<InformationStatementSidebarProps>,
) {
  const createInformationStatements = useCreateInformationStatements();

  const getAllDiseases = useGetAllDiseasesUnsuspended(props.open);
  const allDiseases = getAllDiseases.data ?? [];

  const getAllInformationStatementTemplates =
    useGetAllInformationStatementTemplatesUnsuspended(props.open);
  const allFinalInformationStatementTemplates = isDefined(
    getAllInformationStatementTemplates.data,
  )
    ? getAllInformationStatementTemplates.data.filter(
        (t) => t.state === ApiInformationStatementTemplateState.Final,
      )
    : [];

  const [
    informationStatementTemplateOptions,
    setInformationStatementTemplateOptions,
  ] = useState<SelectionOption[]>([]);

  const diseaseOptions: SelectOption[] = createDiseaseOptions(allDiseases);

  async function handleSubmit(values: InformationStatementValues) {
    await createInformationStatements
      .mutateAsync(createPostInformationStatementsRequest(values), {
        onSuccess: props.onSuccess,
      })
      .catch();
  }

  function createPostInformationStatementsRequest(
    values: InformationStatementValues,
  ): UseCreateInformationStatementRequest {
    return {
      procedureId: values.procedureId,
      apiPostInformationStatements: {
        templateIds: values.informationStatementTemplates ?? [],
      },
    };
  }

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
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Sidebar
          onClose={() =>
            props.onClose({
              open: false,
              initialValues: {
                ...values,
              },
            })
          }
          open={props.open}
        >
          <SidebarForm style={{ display: "contents" }}>
            <SidebarContent title={"Bogen hinzufügen"}>
              <Stack flexDirection="column" gap={2}>
                <MultiAutocompleteField
                  name={"diseases"}
                  label={"Impfungen"}
                  options={diseaseOptions}
                  required={"Bitte mindestens eine Impfung auswählen."}
                  onChange={(newValues) =>
                    handleDiseaseChange(newValues, setFieldValue)
                  }
                ></MultiAutocompleteField>
                <MultiAutocompleteField
                  name={"informationStatementTemplates"}
                  label={"Aufklärungsbögen"}
                  options={
                    isEmpty(informationStatementTemplateOptions) &&
                    props.initialValues.diseases
                      ? createInformationStatementTemplateOptions(
                          allFinalInformationStatementTemplates,
                          props.initialValues.diseases,
                        )
                      : informationStatementTemplateOptions
                  }
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
                onCancel={props.onCancel}
              />
            </SidebarActions>
          </SidebarForm>
        </Sidebar>
      )}
    </Formik>
  );
}
