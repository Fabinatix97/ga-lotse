/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { format } from "date-fns";
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
import { useSnackbar } from "@eshg/lib-portal";
import { ApiPersonLanguage } from "@eshg/prostitute-protection-api";

import { ApiProstituteProtectionProcedure } from "../../mock";

import { EditPersonDetailsForm } from "./EditPersonDetailsForm";

export interface EditPersonalDataForm {
  firstName: string;
  lastName: string;
  alias: string;
  dateOfBirth: string;
  gender: string;
  consultationLanguage: ApiPersonLanguage[];
  hasSufficientGermanLanguageSkills: boolean;
}

interface EditPersonDetailsSidebarProps extends SidebarWithFormRefProps {
  procedure: ApiProstituteProtectionProcedure;
}

function EditPersonDetailsSidebar({
  formRef,
  onClose,
  procedure,
}: EditPersonDetailsSidebarProps) {
  const snackbar = useSnackbar();

  function handleSubmit() {
    return new Promise((resolve) => {
      setTimeout(() => {
        snackbar.confirmation("Angaben zur Person erfolgreich aktualisiert");
        onClose();
        resolve(true);
      }, 1000);
    });
  }

  return (
    <Formik initialValues={mapApiToForm(procedure)} onSubmit={handleSubmit}>
      <SidebarForm ref={formRef}>
        <SidebarContent title="Angaben zur Person bearbeiten">
          <EditPersonDetailsForm />
        </SidebarContent>
        <SidebarActions>
          <MultiFormButtonBar
            submitting={false}
            submitLabel="Speichern"
            onCancel={onClose}
          />
        </SidebarActions>
      </SidebarForm>
    </Formik>
  );
}

function mapApiToForm(
  procedure: ApiProstituteProtectionProcedure,
): EditPersonalDataForm {
  const consultationLanguage = procedure.consultationLanguage;
  const hasGerman = consultationLanguage.includes(ApiPersonLanguage.German);

  return {
    firstName: procedure.person.firstName,
    lastName: procedure.person.lastName,
    alias: procedure.alias.alias ?? "",
    dateOfBirth: format(procedure.person.dateOfBirth, "yyyy-MM-dd"),
    gender: procedure.gender,
    consultationLanguage,
    hasSufficientGermanLanguageSkills: hasGerman,
  };
}

export function useEditPersonDetailsSidebar(
  procedure: ApiProstituteProtectionProcedure,
): UseSidebarWithFormRefResult {
  return useSidebarWithFormRef({
    component: (props) => (
      <EditPersonDetailsSidebar procedure={procedure} {...props} />
    ),
  });
}
