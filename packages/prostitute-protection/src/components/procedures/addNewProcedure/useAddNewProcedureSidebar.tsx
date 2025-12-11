/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { Ref } from "react";

import {
  SidebarFormHandle,
  useSidebarFromSearchParam,
  useStepper,
} from "@eshg/lib-employee-portal";
import {
  isNonEmptyString,
  mapOptionalValue,
  useSnackbar,
} from "@eshg/lib-portal";
import {
  ApiAppointment,
  ApiAppointmentBookingType,
  ApiConsultationType,
  ApiCreateProstituteProtectionProcedureRequest,
  ApiPersonLanguage,
} from "@eshg/prostitute-protection-api";

import { useCreateProcedureMutation } from "../../../api/mutations/procedures";
import { useGetAppointmentStandardDuration } from "../../../api/queries/appointmentStandardDuration";
import { routes } from "../../../config/routes";

import { AppointmentStep } from "./AppointmentStep";
import { PersonStep } from "./PersonStep";
import { SummaryFormStep } from "./SummaryForm";

export interface FieldProps {
  formRef: Ref<SidebarFormHandle>;
  onClose: () => void;
  handleNext: (newValues: AddNewProcedureForm) => Promise<unknown> | void;
  handlePrev: () => void;
  changeToStep: (index: number) => void;
  isOnFirstStep: boolean;
  isOnLastStep: boolean;
  title: string;
  subTitle?: string;
  jumpToAppointmentSelection: () => void;
  jumpToPersonalData: () => void;
}
const steps = [
  {
    title: "Neuen Vorgang anlegen",
    subTitle: "Schritt 1 von 3",
    fields: PersonStep,
  },
  {
    title: "Termin wählen",
    subTitle: "Schritt 2 von 3",
    fields: AppointmentStep,
  },
  {
    title: "Zusammenfassung",
    subTitle: "Schritt 3 von 3",
    fields: SummaryFormStep,
  },
];

export interface AddNewProcedureForm {
  alias: string;
  hasSufficientGermanLanguageSkills?: boolean;
  languages: ApiPersonLanguage[];
  consultationType: ApiConsultationType | "";
  customAppointmentDate?: string;
  duration: number;
  blockAppointment?: ApiAppointment;
  appointmentBookingType: ApiAppointmentBookingType | "";
}

const searchParam = "add-procedure";

export function useAddNewProcedureSidebar() {
  return useSidebarFromSearchParam({
    component: ({ formRef, onClose }) => (
      <SidebarWrapper formRef={formRef} onClose={onClose} />
    ),
    searchParam,
  });
}

function SidebarWrapper({
  formRef,
  onClose,
}: {
  formRef: Ref<SidebarFormHandle>;
  onClose: () => void;
}) {
  const snackbar = useSnackbar();
  const addNewProcedure = useCreateProcedureMutation();
  const { data } = useGetAppointmentStandardDuration();
  const router = useRouter();
  const initialValues: AddNewProcedureForm = {
    alias: "",
    languages: [],
    customAppointmentDate: "",
    consultationType: "",
    duration: data.PROSTITUTE_PROTECTION_CONSULTATION,
    appointmentBookingType: "",
  };

  async function onFinalSubmit(newValues: AddNewProcedureForm) {
    const mappedValues = mapProcedureFormToApi(newValues);
    const { id } = await addNewProcedure.mutateAsync(mappedValues);
    router.push(routes.procedures.byId(id).details);
    snackbar.confirmation("Vorgang erstellt");
  }

  const {
    Fields,
    handleNext,
    handlePrev,
    changeToStep,
    isOnFirstStep,
    isOnLastStep,
    step,
  } = useStepper({ steps, onFinalSubmit });

  function jumpToAppointmentSelection() {
    changeToStep(1);
  }
  function jumpToPersonalData() {
    changeToStep(0);
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleNext}>
      <Fields
        title={step.title}
        subTitle={step.subTitle}
        formRef={formRef}
        isOnLastStep={isOnLastStep}
        isOnFirstStep={isOnFirstStep}
        handleNext={handleNext}
        handlePrev={handlePrev}
        changeToStep={changeToStep}
        jumpToAppointmentSelection={jumpToAppointmentSelection}
        jumpToPersonalData={jumpToPersonalData}
        onClose={onClose}
      />
    </Formik>
  );
}

function mapProcedureFormToApi(
  form: AddNewProcedureForm,
): ApiCreateProstituteProtectionProcedureRequest {
  const appointmentStart = getAppointmentDate(form);
  if (!appointmentStart) {
    throw new Error("Appointment start must be defined");
  }
  if (!form.appointmentBookingType) {
    throw new Error("Appointment booking type must be defined");
  }
  return {
    appointmentStart,
    durationInMinutes: form.duration,
    alias: form.alias,
    languages: form.languages ?? [],
    appointmentBookingType: form.appointmentBookingType,
    consultationType: mapOptionalValue(form.consultationType),
  };
}

export function getAppointmentDate(form: AddNewProcedureForm) {
  const customAppointmentDate = isNonEmptyString(form.customAppointmentDate)
    ? new Date(form.customAppointmentDate)
    : undefined;
  const date =
    form.appointmentBookingType === ApiAppointmentBookingType.AppointmentBlock
      ? form.blockAppointment?.start
      : customAppointmentDate;
  return date ?? undefined;
}
