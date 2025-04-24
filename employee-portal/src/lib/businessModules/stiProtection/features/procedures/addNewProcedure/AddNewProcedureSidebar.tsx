/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MultiFormButtonBar,
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  ApiAppointment,
  ApiAppointmentBookingType,
  ApiAppointmentType,
  ApiConcern,
  ApiCreateProcedureResponse,
  ApiGender,
} from "@eshg/sti-protection-api";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  useCreateStiProcedureMutation,
  useCreateStiProcedureOptions,
} from "@/lib/businessModules/stiProtection/api/mutations/procedures";
import {
  AppointmentForm,
  CreateAppointmentForm,
} from "@/lib/businessModules/stiProtection/shared/procedure/AppointmentForm";
import { SharePinModal } from "@/lib/businessModules/stiProtection/shared/procedure/SharePinModal";
import { CONCERN_OPTIONS } from "@/lib/businessModules/stiProtection/shared/procedure/helpers";
import { mapProcedureFormToApi } from "@/lib/businessModules/stiProtection/shared/procedure/mappers";
import { useFormWithSteps } from "@/lib/businessModules/stiProtection/shared/procedure/useFormWithSteps";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";
import { SelectableCardsField } from "@/lib/shared/components/formFields/SelectableCardsField";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

import { PersonalDataForm } from "./PersonalDataForm";
import { AppointmentFieldSetProps, SummaryForm } from "./SummaryForm";

export type CombinedAppointmentForm = Partial<
  AddNewProcedureForm & CreateAppointmentForm
>;

const steps = [
  {
    title: "Neuen Vorgang anlegen",
    subTitle: "Schritt 1 von 4",
    fields: () => (
      <SelectableCardsField
        name="concern"
        required="Bitte ein Anliegen auswählen"
        options={CONCERN_OPTIONS}
      />
    ),
  },
  {
    title: "Termin wählen",
    subTitle: "Schritt 2 von 4",
    fields: () => <AppointmentForm />,
  },
  {
    title: "Angaben zur Person",
    subTitle: "Schritt 3 von 4",
    fields: () => <PersonalDataForm />,
  },
  {
    title: "Zusammenfassung",
    subTitle: "Schritt 4 von 4",
    fields: (props: AppointmentFieldSetProps) => <SummaryForm {...props} />,
  },
];

const initialValues: AddNewProcedureForm = {
  concern: "",

  appointmentBookingType: "",
  blockAppointment: null,
  customAppointmentDate: "",
  customAppointmentDuration: "",

  gender: "",
  yearOfBirth: "",
  pronouns: "",
  hasSufficientGermanLanguageSkills: null,
  otherKnownLanguages: "",
};

export interface AddNewProcedureForm {
  concern?: ApiConcern | "";
  appointmentType?: ApiAppointmentType | "" | null;

  appointmentBookingType?: ApiAppointmentBookingType | "";
  blockAppointment?: null | ApiAppointment;
  customAppointmentDate: string;
  customAppointmentDuration: string;

  gender: ApiGender | "";
  yearOfBirth?: string;

  pronouns: string;
  hasSufficientGermanLanguageSkills: boolean | null;
  otherKnownLanguages: string;
}

export function AddNewProcedureSidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useSearchParam("add-procedure", "boolean");
  const [dataToShare, setDataToShare] = useState<
    { pin: string; id: string } | undefined
  >();

  const snackbar = useSnackbar();
  const addNewProcedureOptions = useCreateStiProcedureOptions();
  const addNewProcedure = useCreateStiProcedureMutation({
    onSuccess: (data: ApiCreateProcedureResponse) => {
      setIsOpen(false);
      snackbar.confirmation("Vorgang angelegt");
      setDataToShare({ pin: data.pin, id: data.procedureId });
    },
  });

  function onFinalSubmit(newValues: AddNewProcedureForm) {
    const mappedValues = mapProcedureFormToApi(newValues);
    return addNewProcedure.mutateAsync(mappedValues);
  }

  const {
    Fields,
    handleNext,
    handlePrev,
    changeToStep,
    step,
    isOnFirstStep,
    isOnLastStep,
  } = useFormWithSteps({ steps, onFinalSubmit });

  function pinIsShared() {
    if (dataToShare == null) {
      return;
    }
    router.push(routes.procedures.byId(dataToShare.id).details);
    setDataToShare(undefined);
  }

  const { sidebarFormRef, handleClose } = useSidebarForm({
    onClose: () => {
      setIsOpen(false);
      changeToStep(0);
    },
  });

  return (
    <>
      <Sidebar open={isOpen} onClose={handleClose}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleNext}
          validate={step.validate}
        >
          {({ values }) => (
            <SidebarForm ref={sidebarFormRef}>
              <ConfirmLeaveDirtyFormEffect
                onSaveMutation={{
                  mutationOptions: addNewProcedureOptions,
                  variableSupplier: () => mapProcedureFormToApi(values),
                }}
              />
              <SidebarContent title={step.title} subtitle={step.subTitle}>
                <Fields
                  jumpToAppointmentSelection={() => {
                    changeToStep(1);
                  }}
                  jumpToPersonalData={() => {
                    changeToStep(2);
                  }}
                />
              </SidebarContent>
              <SidebarActions>
                <MultiFormButtonBar
                  submitting={addNewProcedure.isPending}
                  onCancel={handleClose}
                  onBack={isOnFirstStep ? undefined : handlePrev}
                  submitLabel={isOnLastStep ? "Vorgang anlegen" : "Weiter"}
                />
              </SidebarActions>
            </SidebarForm>
          )}
        </Formik>
      </Sidebar>
      <SharePinModal pinToShare={dataToShare?.pin} onShared={pinIsShared} />
    </>
  );
}
