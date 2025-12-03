/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useRouter } from "next/navigation";
import { Ref, useState } from "react";

import {
  SidebarFormHandle,
  useSidebarFromSearchParam,
  useStepper,
} from "@eshg/lib-employee-portal";
import { mapOptionalValue, useSnackbar } from "@eshg/lib-portal";
import {
  ApiAppointmentBookingType,
  ApiConsultationType,
  ApiCreateProstituteProtectionProcedureRequest,
  ApiPersonLanguage,
} from "@eshg/prostitute-protection-api";

import { useCreateProcedureMutation } from "../../../api/mutations/procedures";
import { useGetAppointmentStandardDuration } from "../../../api/queries/appointmentStandardDuration";
import { routes } from "../../../config/routes";

import { AppointmentStep } from "./AppointmentStep";
import { ConsultationDetailsStep } from "./ConsultationDetailsStep";

export interface FieldProps {
  formRef: Ref<SidebarFormHandle>;
  onClose: () => void;
  handleNext: (newValues: AddNewProcedureForm) => Promise<unknown> | void;
  handlePrev: () => void;
  changeToStep: (index: number) => void;
  isOnFirstStep: boolean;
  isOnLastStep: boolean;
  currentState: AddNewProcedureForm;
  isPending: boolean;
  title: string;
  subTitle?: string;
}
const steps = [
  {
    title: "Neuen Vorgang anlegen",
    fields: ConsultationDetailsStep,
  },
  {
    title: "Neuen Vorgang anlegen",
    subTitle: "Termin",
    fields: AppointmentStep,
  },
];

export interface AddNewProcedureForm {
  alias: string;
  hasSufficientGermanLanguageSkills?: boolean;
  languages: ApiPersonLanguage[];
  consultationType: ApiConsultationType | "";
  customAppointmentDate: string;
  duration: number;
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
  };
  const [currentState, setState] = useState<AddNewProcedureForm>(initialValues);

  async function onFinalSubmit(newValues: AddNewProcedureForm) {
    const mappedValues = mapProcedureFormToApi(newValues);
    const { id } = await addNewProcedure.mutateAsync(mappedValues);
    router.push(routes.procedures.byId(id).details);
    snackbar.confirmation("Vorgang erstellt");
  }
  function onNext(newValues: AddNewProcedureForm) {
    setState(newValues);
  }
  const {
    Fields,
    handleNext,
    handlePrev,
    changeToStep,
    isOnFirstStep,
    isOnLastStep,
    step,
  } = useStepper({ steps, onFinalSubmit, onNext });

  return (
    <Fields
      title={step.title}
      subTitle={step.subTitle}
      currentState={currentState}
      isPending={false}
      formRef={formRef}
      isOnLastStep={isOnLastStep}
      isOnFirstStep={isOnFirstStep}
      handleNext={handleNext}
      handlePrev={handlePrev}
      changeToStep={changeToStep}
      onClose={onClose}
    />
  );
}

function mapProcedureFormToApi(
  form: AddNewProcedureForm,
): ApiCreateProstituteProtectionProcedureRequest {
  return {
    appointmentStart: new Date(form.customAppointmentDate),
    durationInMinutes: form.duration,
    alias: form.alias,
    languages: form.languages ?? [],
    appointmentBookingType: ApiAppointmentBookingType.UserDefined,
    consultationType: mapOptionalValue(form.consultationType),
  };
}
