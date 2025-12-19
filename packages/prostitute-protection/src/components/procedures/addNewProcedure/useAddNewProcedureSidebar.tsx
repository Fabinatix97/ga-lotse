/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
  useStepper,
} from "@eshg/lib-employee-portal";
import { isNonEmptyString, mapOptionalValue } from "@eshg/lib-portal";
import {
  ApiAppointmentBookingType,
  ApiConsultationType,
  ApiCreateProstituteProtectionProcedureRequest,
} from "@eshg/prostitute-protection-api";

import { useCreateProcedureMutation } from "../../../api/mutations/procedures";
import { useGetAppointmentStandardDuration } from "../../../api/queries/appointmentStandardDuration";
import { routes } from "../../../config/routes";
import { AppointmentFieldsData } from "../../form/AppointmentFields";
import { LanguageFieldsData } from "../../form/LanguageFields";

import { AppointmentStep } from "./AppointmentStep";
import { PersonStep } from "./PersonStep";
import { SummaryFormStep } from "./SummaryForm";

export interface LayoutProps<T> extends SidebarWithFormRefProps {
  children: ReactNode;
  handleNext: (newValues: T) => Promise<unknown> | void;
  handlePrev: () => void;
  isOnLastStep: boolean;
  isOnFirstStep: boolean;
  title: string;
  subTitle?: string;
}

export interface FieldProps extends SidebarWithFormRefProps {
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

export interface AddNewProcedureForm
  extends LanguageFieldsData,
    AppointmentFieldsData {
  alias: string;
  consultationType: ApiConsultationType | "";
}

export function useAddNewProcedureSidebar(): UseSidebarWithFormRefResult {
  return useSidebarWithFormRef({
    component: SidebarWrapper,
  });
}

function SidebarWrapper(props: SidebarWithFormRefProps) {
  const addNewProcedure = useCreateProcedureMutation();
  const { data } = useGetAppointmentStandardDuration();
  const router = useRouter();

  const initialValues: AddNewProcedureForm = {
    alias: "",
    languages: [],
    hasSufficientGermanLanguageSkills: false,
    customAppointmentDate: "",
    consultationType: "",
    duration: data.standardDurations.PROSTITUTE_PROTECTION_CONSULTATION ?? 0,
    appointmentBookingType: "",
  };

  async function onFinalSubmit(newValues: AddNewProcedureForm) {
    const mappedValues = mapProcedureFormToApi(newValues);
    await addNewProcedure.mutateAsync(mappedValues, {
      onSuccess: (response) => {
        router.push(routes.procedures.byId(response.id).details);
      },
    });
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
        formRef={props.formRef}
        isOnLastStep={isOnLastStep}
        isOnFirstStep={isOnFirstStep}
        handleNext={handleNext}
        handlePrev={handlePrev}
        changeToStep={changeToStep}
        jumpToAppointmentSelection={jumpToAppointmentSelection}
        jumpToPersonalData={jumpToPersonalData}
        onClose={props.onClose}
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
