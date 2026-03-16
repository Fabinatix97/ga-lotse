/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
  mapRequiredValue,
  useValidateLength,
} from "@eshg/lib-portal";
import {
  ApiOmsAssessment,
  ApiOmsAssessmentType,
  UpdateAssessmentTitleAndTypeRequest,
} from "@eshg/official-medical-service-api";

import { useUpdateAssessmentTitleAndType } from "@/lib/businessModules/officialMedicalService/api/mutations/omsAssessmentApi";
import { NAMES_ASSESSMENT_TYPE } from "@/lib/businessModules/officialMedicalService/shared/translations";

export function useEditAssessmentInfoSidebar(): UseSidebarWithFormRefResult<EditAssessmentInfoSidebarProps> {
  return useSidebarWithFormRef({ component: EditAssessmentInfoSidebar });
}

interface EditAssessmentFormValues {
  title: string;
  assessmentType: OptionalFieldValue<ApiOmsAssessmentType>;
}

interface EditAssessmentInfoSidebarProps extends SidebarWithFormRefProps {
  assessment: ApiOmsAssessment;
}

function EditAssessmentInfoSidebar({
  assessment,
  formRef,
  onClose,
}: Readonly<EditAssessmentInfoSidebarProps>) {
  const updateAssessmentTitleAndType = useUpdateAssessmentTitleAndType();
  const validateLength = useValidateLength();

  async function handleSubmit(values: EditAssessmentFormValues) {
    const request: UpdateAssessmentTitleAndTypeRequest = {
      id: assessment.id,
      apiUpdateAssessmentTitleAndTypeRequest: {
        title: mapRequiredValue(values.title),
        assessmentType: mapRequiredValue(values.assessmentType),
      },
    };

    await updateAssessmentTitleAndType.mutateAsync(request, {
      onSuccess: () => {
        onClose(true);
      },
    });
  }

  return (
    <Formik
      initialValues={assessment}
      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={formRef}>
          <SidebarContent title="Angaben">
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
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel="Speichern"
              submitting={isSubmitting}
              onCancel={onClose}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
