/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Formik } from "formik";

import {
  MultiFormButtonBar,
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  useSearchParam,
} from "@eshg/lib-employee-portal";
import { GENDER_OPTIONS } from "@eshg/lib-portal/components/formFields/constants";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import {
  ApiGender,
  ApiStiProtectionProcedure,
  UpdatePersonDetailsRequest,
} from "@eshg/sti-protection-api";

import { useUpdatePersonDetails } from "@/lib/businessModules/stiProtection/api/mutations/procedures";
import { AddNewProcedureForm } from "@/lib/businessModules/stiProtection/features/procedures/addNewProcedure/AddNewProcedureSidebar";
import { PersonalDataForm } from "@/lib/businessModules/stiProtection/features/procedures/addNewProcedure/PersonalDataForm";
import { deleteUndefined } from "@/lib/businessModules/stiProtection/shared/helpers";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

type EditPersonalDataForm = Pick<
  AddNewProcedureForm,
  | "gender"
  | "pronouns"
  | "hasSufficientGermanLanguageSkills"
  | "otherKnownLanguages"
  | "yearOfBirth"
>;

export const EDIT_PERSONAL_DATA_SEARCH_PARAM = "edit-person-details";

export function EditPersonalDataSidebar({
  procedure,
}: Readonly<{
  procedure: ApiStiProtectionProcedure;
}>) {
  const [isOpen, setIsOpen] = useSearchParam(
    EDIT_PERSONAL_DATA_SEARCH_PARAM,
    "boolean",
  );

  const snackbar = useSnackbar();
  const updatePersonDetails = useUpdatePersonDetails({
    onSuccess: (_data: void) => {
      setIsOpen(false);
      snackbar.confirmation("Angaben zur Person erfolgreich aktualisiert");
    },
  });

  const { sidebarFormRef, handleClose } = useSidebarForm({
    onClose: () => {
      setIsOpen(false);
    },
  });

  return (
    <Sidebar open={isOpen} onClose={handleClose}>
      <Formik
        initialValues={mapApiToForm(procedure)}
        onSubmit={(values) =>
          updatePersonDetails.mutateAsync({
            id: procedure.id,
            data: mapFormToApi(values),
          })
        }
      >
        <SidebarForm ref={sidebarFormRef}>
          <SidebarContent title="Angaben zur Person bearbeiten">
            <PersonalDataForm />
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={updatePersonDetails.isPending}
              submitLabel="Speichern"
              onCancel={handleClose}
            />
          </SidebarActions>
        </SidebarForm>
      </Formik>
    </Sidebar>
  );
}

function mapFormToApi(
  form: EditPersonalDataForm,
): UpdatePersonDetailsRequest["apiUpdatePersonDetailsRequest"] {
  if (!form.yearOfBirth) {
    throw new Error("Year of birth must be defined");
  }

  return deleteUndefined({
    gender: GENDER_OPTIONS.find((t) => t.value === form.gender)?.value as
      | ApiGender
      | undefined,
    pronouns: mapOptionalValue(form.pronouns),
    hasSufficientGermanLanguageSkills:
      form.hasSufficientGermanLanguageSkills ?? undefined,
    otherKnownLanguages: mapOptionalValue(form.otherKnownLanguages),

    yearOfBirth: form.yearOfBirth.toString(),
  });
}

function mapApiToForm(
  procedure: ApiStiProtectionProcedure,
): EditPersonalDataForm {
  return {
    pronouns: procedure.person.pronouns ?? "",
    gender: procedure.person.gender,
    hasSufficientGermanLanguageSkills:
      procedure.person.hasSufficientGermanLanguageSkills ?? null,
    otherKnownLanguages: procedure.person.otherKnownLanguages ?? "",
    yearOfBirth: parseInt(procedure.person.yearOfBirth, 10),
  };
}
