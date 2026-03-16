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
  OptionalFieldValue,
  SelectField,
  mapRequiredValue,
} from "@eshg/lib-portal";
import {
  ApiEmployeeOmsProcedureDetails,
  ApiOmsAssessmentDetails,
  ApiOmsRecipientType,
  UpdateAssessmentRecipientRequest,
} from "@eshg/official-medical-service-api";

import { useUpdateAssessmentRecipient } from "@/lib/businessModules/officialMedicalService/api/mutations/omsAssessmentApi";
import { buildRecipientOptions } from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/helpers";

export function useEditAssessmentRecipientSidebar(): UseSidebarWithFormRefResult<EditAssessmentRecipientSidebarProps> {
  return useSidebarWithFormRef({
    component: EditAssessmentRecipientSidebar,
  });
}

interface EditAssessmentRecipientSidebarProps extends SidebarWithFormRefProps {
  procedure: ApiEmployeeOmsProcedureDetails;
  assessment: ApiOmsAssessmentDetails;
}

function EditAssessmentRecipientSidebar(
  props: Readonly<EditAssessmentRecipientSidebarProps>,
) {
  const recipientOptions = buildRecipientOptions(props.procedure);
  const updateAssessmentRecipient = useUpdateAssessmentRecipient();

  function handleSubmit(values: {
    recipient: OptionalFieldValue<ApiOmsRecipientType>;
  }) {
    const request = {
      id: props.assessment.id,
      apiUpdateAssessmentRecipientTypeRequest: {
        recipientTypeDto: mapRequiredValue(values.recipient),
      },
    } satisfies UpdateAssessmentRecipientRequest;
    return updateAssessmentRecipient.mutateAsync(request, {
      onSuccess: () => {
        props.onClose(true);
      },
    });
  }

  return (
    <Formik
      initialValues={{ recipient: props.assessment.recipientType ?? "" }}
      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title="Ansprechperson">
            <SelectField
              name="recipient"
              label="Ansprechperson"
              groupedOptions={recipientOptions}
              required="Bitte wählen Sie eine Ansprechperson aus."
            />
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel="Speichern"
              submitting={isSubmitting}
              onCancel={props.onClose}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
