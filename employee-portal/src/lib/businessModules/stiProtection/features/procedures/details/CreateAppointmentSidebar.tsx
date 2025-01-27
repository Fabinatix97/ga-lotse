/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentBookingType,
  ApiAppointmentType,
  ApiConcern,
  ApiCreateAppointmentRequest,
  ApiStiProtectionProcedure,
  ApiUpdateAppointmentRequest,
} from "@eshg/employee-portal-api/stiProtection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { ApiAppointment } from "@eshg/measles-protection-api";
import { differenceInMinutes } from "date-fns";
import { Formik, FormikHelpers } from "formik";
import { ReactNode, useMemo, useReducer } from "react";

import {
  useCreateAppointmentMutation,
  useEditAppointmentMutation,
} from "@/lib/businessModules/stiProtection/api/mutations/procedures";
import { AppointmentForm } from "@/lib/businessModules/stiProtection/features/procedures/addNewProcedure/AppointmentForm";
import {
  AppointmentFieldSetProps,
  SummaryForm,
} from "@/lib/businessModules/stiProtection/features/procedures/addNewProcedure/SummaryForm";
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

export interface CreateAppointmentForm {
  appointmentType?: ApiAppointmentType | "" | null;
  appointmentBookingType?: ApiAppointmentBookingType | "";
  blockAppointment?: null | ApiAppointment;
  concern?: ApiConcern | "RESULTS_REVIEW" | "";
  customAppointmentDate: string;
  customAppointmentDuration: string;
}

const initialValues: CreateAppointmentForm = {
  appointmentType: null,
  appointmentBookingType: "",
  blockAppointment: null,
  concern: "",
  customAppointmentDate: "",
  customAppointmentDuration: "",
};

interface CreateAppointmentSidebarProps {
  procedure: ApiStiProtectionProcedure;
}

export const CREATE_APPOINTMENT_SEARCH_PARAM = "create-appointment";
export const EDIT_APPOINTMENT_SEARCH_PARAM = "edit-appointment";

interface SidebarStep {
  title: string;
  subTitle: string;
  fields: (props: AppointmentFieldSetProps) => ReactNode | JSX.Element;
}

function getSteps({
  mode,
}: {
  mode?: "createAppointment" | "editAppointment";
}): SidebarStep[] {
  return [
    {
      title: mode === "editAppointment" ? "Termin ändern" : "Termin buchen",
      subTitle: "Schritt 1 von 2",
      fields: ({
        startingConcern,
        editAppointmentType,
      }: AppointmentFieldSetProps) => (
        <AppointmentForm
          startingConcern={startingConcern}
          editAppointmentType={editAppointmentType}
        />
      ),
    },
    {
      title: "Zusammenfassung",
      subTitle: "Schritt 2 von 2",
      fields: (props: AppointmentFieldSetProps) => (
        <SummaryForm
          {...props}
          appointmentSummary={{ title: "Neuer Termin" }}
          show={{ personalData: false }}
        />
      ),
    },
  ];
}

export function CreateAppointmentSidebar({
  procedure,
}: Readonly<CreateAppointmentSidebarProps>) {
  const [isOpenCreateAppointment, setIsOpenCreateAppointment] = useSearchParam(
    CREATE_APPOINTMENT_SEARCH_PARAM,
    "boolean",
  );
  const [editAppointmentType, setEditAppointmentType] = useSearchParam(
    EDIT_APPOINTMENT_SEARCH_PARAM,
  );

  const steps = useMemo(
    () =>
      getSteps({
        mode:
          editAppointmentType != null ? "editAppointment" : "createAppointment",
      }),
    [editAppointmentType],
  );

  const lastStepIndex = steps.length - 1;
  const [stepIndex, changeToStep] = useReducer(
    (_index: number, newIndex: number) =>
      Math.max(Math.min(newIndex, lastStepIndex), 0),
    0,
  );
  const step = steps[stepIndex]!;

  const snackbar = useSnackbar();
  const createAppointment = useCreateAppointmentMutation({
    onSuccess: () => {
      setIsOpenCreateAppointment(false);
      snackbar.confirmation("Der Termin wurde erfolgreich gebucht.");
    },
  });
  const editAppointment = useEditAppointmentMutation({
    onSuccess: () => {
      setEditAppointmentType(null);
      snackbar.confirmation("Der Termin wurde geändert.");
    },
  });

  const { sidebarFormRef, handleClose } = useSidebarForm({
    onClose: () => {
      if (isOpenCreateAppointment) {
        setIsOpenCreateAppointment(false);
      } else {
        setEditAppointmentType(null);
      }
      changeToStep(0);
    },
  });

  async function handleSubmit(values: CreateAppointmentForm) {
    if (editAppointmentType) {
      await editAppointment.mutateAsync({
        id: procedure.id,
        data: mapFormToApi(values, "edit"),
      });
    } else {
      await createAppointment.mutateAsync({
        id: procedure.id,
        data: mapFormToApi(values, "create"),
      });
    }
  }

  const isOnFirstStep = stepIndex === 0;
  const isOnLastStep = stepIndex === lastStepIndex;
  const appointmentType = editAppointmentType as ApiAppointmentType | undefined;

  async function handleNext(
    newValues: CreateAppointmentForm,
    helpers: FormikHelpers<CreateAppointmentForm>,
  ) {
    if (isOnLastStep) {
      await handleSubmit(newValues);
      helpers.resetForm();
      changeToStep(0);
    } else {
      changeToStep(stepIndex + 1);
    }
  }
  const Fields = step.fields;

  return (
    <Sidebar
      open={isOpenCreateAppointment || editAppointmentType != null}
      onClose={handleClose}
    >
      <Formik initialValues={initialValues} onSubmit={handleNext}>
        <SidebarForm ref={sidebarFormRef}>
          <SidebarContent title={step.title} subtitle={step.subTitle}>
            <Fields
              jumpToAppointmentSelection={() => {
                changeToStep(0);
              }}
              startingConcern={procedure.concern}
              editAppointmentType={appointmentType}
            />
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={createAppointment.isPending}
              onCancel={handleClose}
              onBack={
                isOnFirstStep ? undefined : () => changeToStep(stepIndex - 1)
              }
              submitLabel={isOnLastStep ? "Bestätigen" : "Weiter"}
            />
          </SidebarActions>
        </SidebarForm>
      </Formik>
    </Sidebar>
  );
}

function mapFormToApi(
  form: CreateAppointmentForm,
  type: "create",
): ApiCreateAppointmentRequest;
function mapFormToApi(
  form: CreateAppointmentForm,
  type: "edit",
): ApiUpdateAppointmentRequest;
function mapFormToApi(form: CreateAppointmentForm, type: "edit" | "create") {
  if (type === "create" && !form.appointmentType) {
    throw new Error("Appointment type must be defined");
  }
  if (!form.appointmentBookingType) {
    throw new Error("Appointment booking type must be defined");
  }
  const isCustomAppointment =
    form.appointmentBookingType === ApiAppointmentBookingType.UserDefined;

  const appointmentStart = isCustomAppointment
    ? new Date(form.customAppointmentDate)
    : form.blockAppointment?.start;

  if (!appointmentStart) {
    throw new Error("Appointment start must be defined");
  }

  const blockAppointmentEnd = form.blockAppointment?.end;
  if (!isCustomAppointment && blockAppointmentEnd == null) {
    throw new Error("Appointment end must be defined");
  }

  return deleteUndefined({
    ...(type === "create" && {
      appointmentType: form.appointmentType,
    }),
    appointmentBookingType: form.appointmentBookingType,
    durationInMinutes: isCustomAppointment
      ? optionalInt(form.customAppointmentDuration)
      : differenceInMinutes(blockAppointmentEnd!, appointmentStart),
    appointmentStart,
  });
}
