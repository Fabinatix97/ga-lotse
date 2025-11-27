/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import {
  PROCEDURE_STATUS_NAMES,
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
  parseOptionalValue,
  useSnackbar,
  useValidateLength,
} from "@eshg/lib-portal";
import {
  ApiConsultationType,
  ApiProcedureDetails,
  ApiProcedureStatus,
} from "@eshg/prostitute-protection-api";

import {
  CONSULTATION_TYPE_VALUES,
  PROCEDURE_FIELD_NAME,
} from "../../../../shared/constants";

import { SidebarFormProvider } from "./SidebarFormProvider";

export interface EditProcedureDetailsDataForm {
  consultationType: OptionalFieldValue<ApiConsultationType>;
  procedureStatus: ApiProcedureStatus;
  consultant: OptionalFieldValue<string>;
  createdBy: OptionalFieldValue<string>;
}

interface EditProcedureDetailsSidebarProps extends SidebarWithFormRefProps {
  procedure: ApiProcedureDetails;
}

function EditProcedureDetailsSidebar({
  formRef,
  onClose,
  procedure,
}: EditProcedureDetailsSidebarProps) {
  const snackbar = useSnackbar();
  const validateLength = useValidateLength();

  function handleSubmit(values: EditProcedureDetailsDataForm) {
    return new Promise((resolve) => {
      setTimeout(() => {
        snackbar.confirmation("Angaben zum Vorgang erfolgreich aktualisiert");
        const apiValues = mapFormToApi(values);
        // eslint-disable-next-line no-console
        console.log({ procedureDetailsPayload: apiValues });
        onClose();
        resolve(true);
      }, 1000);
    });
  }

  const initialValues = mapApiToForm(procedure);

  return (
    <SidebarFormProvider
      formRef={formRef}
      initialValues={initialValues}
      title="Angaben zum Vorgang bearbeiten"
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Stack gap={2}>
        <SelectField
          name="consultationType"
          label={PROCEDURE_FIELD_NAME.consultationType}
          options={buildEnumOptions(CONSULTATION_TYPE_VALUES)}
        />
        <SelectField
          name="procedureStatus"
          label={PROCEDURE_FIELD_NAME.procedureStatus}
          options={buildEnumOptions(PROCEDURE_STATUS_NAMES)}
        />
        <InputField
          disabled
          name="consultant"
          label={PROCEDURE_FIELD_NAME.consultant}
          validate={validateLength(1, 80)}
        />
        <InputField
          disabled
          name="createdBy"
          label={PROCEDURE_FIELD_NAME.createdBy}
          validate={validateLength(1, 80)}
        />
      </Stack>
    </SidebarFormProvider>
  );
}

function mapApiToForm(
  procedure: ApiProcedureDetails,
): EditProcedureDetailsDataForm {
  return {
    consultationType: parseOptionalValue(procedure.consultationType),
    procedureStatus: procedure.procedureStatus,
    consultant: parseOptionalValue(""),
    createdBy: parseOptionalValue(""),
  };
}

function mapFormToApi(values: EditProcedureDetailsDataForm) {
  return {
    consultationType: mapOptionalValue(values.consultationType),
    procedureStatus: mapRequiredValue(values.procedureStatus),
  };
}

export function useEditProcedureDetailsSidebar(
  procedure: ApiProcedureDetails,
): UseSidebarWithFormRefResult {
  return useSidebarWithFormRef({
    component: (props) => (
      <EditProcedureDetailsSidebar procedure={procedure} {...props} />
    ),
  });
}
