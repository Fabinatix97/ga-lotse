/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GENDER_OPTIONS } from "@eshg/lib-portal/components/formFields/constants";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { countryOptions } from "@eshg/lib-portal/helpers/countryOption";
import {
  ApiGender,
  ApiStiProtectionProcedure,
  UpdatePersonDetailsRequest,
} from "@eshg/sti-protection-api";
import { Formik } from "formik";

import { useUpdatePersonDetails } from "@/lib/businessModules/stiProtection/api/mutations/procedures";
import { AddNewProcedureForm } from "@/lib/businessModules/stiProtection/features/procedures/addNewProcedure/AddNewProcedureSidebar";
import {
  PersonalDataForm,
  personalDataFormValidation,
} from "@/lib/businessModules/stiProtection/features/procedures/addNewProcedure/PersonalDataForm";
import {
  deleteUndefined,
  optionalInt,
} from "@/lib/businessModules/stiProtection/shared/helpers";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

export type EditPersonalDataForm = Pick<
  AddNewProcedureForm,
  "gender" | "countryOfBirth" | "inGermanySince" | "yearOfBirth"
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
        validate={personalDataFormValidation}
      >
        <SidebarForm ref={sidebarFormRef}>
          <SidebarContent title="Angaben zur Person bearbeiten">
            <PersonalDataForm />
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={updatePersonDetails.isPending}
              onCancel={handleClose}
              submitLabel={"Speichern"}
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
    countryOfBirth: countryOptions().find(
      (t) => t.value === form.countryOfBirth,
    )?.value,
    gender: GENDER_OPTIONS.find((t) => t.value === form.gender)?.value as
      | ApiGender
      | undefined,
    inGermanySince: optionalInt(form.inGermanySince),
    yearOfBirth: parseInt(form.yearOfBirth, 10),
  });
}

function mapApiToForm(
  procedure: ApiStiProtectionProcedure,
): EditPersonalDataForm {
  return {
    countryOfBirth: procedure.person.countryOfBirth ?? null,
    gender: procedure.person.gender,
    inGermanySince: procedure.person.inGermanySince?.toString() ?? "",
    yearOfBirth: procedure.person.yearOfBirth.toString() ?? "",
  };
}
