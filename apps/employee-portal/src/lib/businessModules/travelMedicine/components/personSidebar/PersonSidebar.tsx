/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikHelpers } from "formik";
import { isDeepEqual } from "remeda";

import {
  DefaultPersonForm,
  DefaultPersonFormValues,
  PersonSidebarForm,
  SidebarWithFormRefProps,
  useReplaceSearchParams,
  useSidebarFromSearchParam,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal";
import { ApiPatient } from "@eshg/travel-medicine-api";

import { useUpdatePatient } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import {
  mapApiPatientToForm,
  mapToApiPatchVaccinationConsultationPatientRequest,
} from "@/lib/businessModules/travelMedicine/components/personSidebar/personSidebarHelper";

const EDIT_PATIENT_SEARCH_PARAM = "edit-patient";

interface EditPersonDetailsSidebarProps extends SidebarWithFormRefProps {
  patient: ApiPatient;
  procedureId: string;
}

function EditPersonDetailsSidebar({
  formRef,
  patient,
  procedureId,
  onClose,
}: EditPersonDetailsSidebarProps) {
  const replaceSearchParams = useReplaceSearchParams();
  const updatePatientApi = useUpdatePatient();
  const snackbar = useSnackbar();

  const initialValues = mapApiPatientToForm(patient);

  async function handleSubmit(
    data: DefaultPersonFormValues,
    helpers: FormikHelpers<DefaultPersonFormValues>,
  ) {
    if (isDeepEqual(data, initialValues)) {
      snackbar.notification("Daten wurden nicht verändert");
      return;
    }
    const apiRequest = mapToApiPatchVaccinationConsultationPatientRequest(data);
    const request = { apiRequest, procedureId };
    await updatePatientApi.mutateAsync(request).then(() => {
      helpers.resetForm();
      replaceSearchParams([
        {
          name: EDIT_PATIENT_SEARCH_PARAM,
          value: "",
        },
      ]);
    });
  }

  return (
    <PersonSidebarForm
      mode="edit"
      title="Patient bearbeiten"
      initialValues={initialValues}
      component={DefaultPersonForm}
      sidebarFormRef={formRef}
      canChooseAddressType={false}
      onCancel={() => onClose(true)}
      onSubmit={(values, helpers) => handleSubmit(values, helpers)}
    />
  );
}

type EditPersonDetailsSidebarConfig = Pick<
  EditPersonDetailsSidebarProps,
  "patient" | "procedureId"
>;

export function useEditPersonDetailsSidebar({
  patient,
  procedureId,
}: EditPersonDetailsSidebarConfig) {
  return useSidebarFromSearchParam({
    component: ({ formRef, onClose }) => (
      <EditPersonDetailsSidebar
        formRef={formRef}
        patient={patient}
        procedureId={procedureId}
        onClose={onClose}
      />
    ),
    searchParam: EDIT_PATIENT_SEARCH_PARAM,
  });
}
