/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack } from "@mui/joy";
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
  InputField,
  OptionalFieldValue,
  SelectField,
  buildEnumOptions,
  mapOptionalValue,
  mapRequiredValue,
  useNavigation,
  useValidateLength,
} from "@eshg/lib-portal";
import {
  type ApiEmployeeOmsProcedureDetails,
  ApiOmsAssessmentType,
  ApiOmsCreateAssessment,
  ApiOmsRecipientType,
} from "@eshg/official-medical-service-api";

import { useCreateAssessment } from "@/lib/businessModules/officialMedicalService/api/mutations/omsAssessmentApi";
import { buildRecipientOptions } from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/helpers";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { NAMES_ASSESSMENT_TYPE } from "@/lib/businessModules/officialMedicalService/shared/translations";

export function useAddAssessmentSidebar(): UseSidebarWithFormRefResult<AddAssessmentSidebarProps> {
  return useSidebarWithFormRef({ component: AddAssessmentSidebar });
}

interface AddAssessmentFormValues {
  title: string;
  assessmentType: OptionalFieldValue<ApiOmsAssessmentType>;
  recipient: OptionalFieldValue<ApiOmsRecipientType>;
}

interface AddAssessmentSidebarProps extends SidebarWithFormRefProps {
  procedure: ApiEmployeeOmsProcedureDetails;
}

const INITIAL_VALUES: AddAssessmentFormValues = {
  title: "",
  assessmentType: "",
  recipient: "",
};

function AddAssessmentSidebar(props: Readonly<AddAssessmentSidebarProps>) {
  const createAssessment = useCreateAssessment();
  const validateLength = useValidateLength();
  const { tryNavigate } = useNavigation();

  const recipientOptions = buildRecipientOptions(props.procedure);

  async function handleSubmit(values: AddAssessmentFormValues) {
    const request: ApiOmsCreateAssessment = {
      procedureExternalId: props.procedure.id,
      assessmentType: mapRequiredValue(values.assessmentType),
      title: mapRequiredValue(values.title),
      recipientType: mapOptionalValue(values.recipient),
    };

    await createAssessment.mutateAsync(request, {
      onSuccess: (assessmentId) => {
        if (localStorage.getItem("oms-assessment-no-details-redirect")) {
          props.onClose(true);
        } else {
          tryNavigate(
            routes.procedures
              .byId(props.procedure.id)
              .assessmentDetails(assessmentId),
          );
        }
      },
    });
  }

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title="Neues Schriftgut anlegen">
            <Stack gap={2} rowGap={4}>
              <InputField
                name="title"
                label="Bezeichnung"
                required="Bitte geben Sie eine Bezeichnung an"
                validate={validateLength(1, 60)}
              />
              <SelectField
                name="assessmentType"
                label="Dokumentenart"
                required="Bitte geben Sie eine Dokumentenart an"
                options={buildEnumOptions(NAMES_ASSESSMENT_TYPE)}
              />
              <Divider orientation="horizontal" />
              <SelectField
                name="recipient"
                label="Ansprechperson"
                groupedOptions={recipientOptions}
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel="Erstellen"
              submitting={isSubmitting}
              onCancel={props.onClose}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
