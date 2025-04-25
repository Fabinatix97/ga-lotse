/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AccessTimeOutlined,
  CakeOutlined,
  DateRange,
  MedicalServicesOutlined,
} from "@mui/icons-material";
import { Box, Sheet, Stack, Typography } from "@mui/joy";
import { formatDate } from "date-fns";
import { Formik, useFormikContext } from "formik";
import {
  PropsWithChildren,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Alert } from "@eshg/lib-portal/components/Alert";
import { Row } from "@eshg/lib-portal/components/Row";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { PortalErrorCode } from "@eshg/lib-portal/errorHandling/PortalErrorCode";
import { ApiConcern } from "@eshg/sti-protection-api";

import {
  ConfirmLeaveDirtyFormEffect,
  ConfirmLeaveDirtyFormEffectProps,
} from "@/lib/baseModule/components/ConfirmLeaveDirtyFormEffect";
import { useCancelPendingAppointment } from "@/lib/businessModules/stiProtection/api/mutations/publicCitizenApi";
import { useStepContext } from "@/lib/businessModules/stiProtection/components/shared/StepContext";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/lib/i18n/useLocale";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageTitle } from "@/lib/shared/components/layout/page";

import { useFormData } from "./AppointmentDataContext";
import {
  AppointmentFormData,
  FormDataWithoutConcern,
} from "./AppointmentStepper";
import { StepButtons, StepButtonsProps } from "./StepButtons";

type InitialValues<T extends FormDataWithoutConcern> = {
  readonly [K in keyof T]: T[K] | "" | null;
};
export type StepLayoutProps<T extends FormDataWithoutConcern> =
  PropsWithChildren<
    {
      initialValues: InitialValues<T>;
      onSubmit: (
        e: T,
      ) => Promise<
        FormDataWithoutConcern | void | typeof PortalErrorCode.Conflict
      > | void;
    } & Omit<StepButtonsProps, "onCancel">
  >;

export function StepLayout<T extends FormDataWithoutConcern>({
  children,
  initialValues: givenInitialValues,
  onSubmit,
  ...buttonProps
}: StepLayoutProps<T>) {
  const [formData, updateFormData] = useFormData<T & AppointmentFormData>();
  const { goForward } = useStepContext();
  const scrollToErrorRef = useRef<() => void>(null);
  const [hasConflict, setHasConflict] = useState(false);

  const hasBookedAppointment = formData.procedureId != null;
  const hasCreatedAccount = formData.accessCode != null;
  async function handleSubmit(values: T) {
    const newValues = await onSubmit(values);
    if (!newValues) {
      return;
    }
    if (newValues === PortalErrorCode.Conflict) {
      // Server error
      // Assume appointment is no longer booked
      updateFormData({ bookedAppointment: undefined } as T &
        AppointmentFormData);
      setHasConflict(true);
      scrollToErrorRef?.current?.();
      return;
    }

    updateFormData(newValues as T & AppointmentFormData);
    goForward();
  }

  const cancelPendingAppointment = useCancelPendingAppointment(
    formData.procedureId,
  );

  const handleConfirmCancel = useCallback(() => {
    if (formData.procedureId == null) {
      return;
    }
    cancelPendingAppointment.mutate();
  }, [formData.procedureId, cancelPendingAppointment]);

  const initialValues = {
    ...givenInitialValues,
    ...formData,
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <FormPlus sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <BookAppointmentTitle />
        <DirtyCheck
          hasBookedAppointment={hasBookedAppointment}
          hasCreatedAccount={hasCreatedAccount}
          handleConfirmCancel={handleConfirmCancel}
        />
        <ConflictError
          hasConflict={hasConflict}
          scrollToErrorRef={scrollToErrorRef}
        />
        <TwoColumnGrid
          content={
            <Sheet>
              <Stack gap={3}>
                {children}
                <Box
                  sx={(theme) => ({
                    [theme.breakpoints.up("md")]: { display: "none" },
                  })}
                >
                  <StepButtons {...buttonProps} />
                </Box>
              </Stack>
            </Sheet>
          }
          sidePanel={<AppointmentOverview {...buttonProps} />}
        />
      </FormPlus>
    </Formik>
  );
}

export function DirtyCheck({
  handleConfirmCancel,
  hasBookedAppointment,
  hasCreatedAccount,
}: {
  handleConfirmCancel: ConfirmLeaveDirtyFormEffectProps["onConfirm"];
  hasBookedAppointment: boolean;
  hasCreatedAccount: boolean;
}) {
  const { t } = useTranslation("stiProtection/forms");
  const { isValid, dirty } = useFormikContext();
  const isAccountCreatedAndShared = dirty && isValid && hasCreatedAccount;
  return (
    <ConfirmLeaveDirtyFormEffect
      title={t("cancel_booking.title")}
      description={t("cancel_booking.message")}
      cancelLabel={t("cancel_booking.cancel")}
      confirmLabel={t("cancel_booking.confirm")}
      isDirty={hasBookedAppointment && !isAccountCreatedAndShared}
      onConfirm={handleConfirmCancel}
    />
  );
}

export function BookAppointmentTitle() {
  const { t } = useTranslation("stiProtection/forms");
  const { currentStepIndex, totalSteps } = useStepContext();
  return (
    <PageTitle>
      <Row justifyContent="space-between">
        {t("common.appointment_booking_title")}
        <Row sx={{ alignContent: "center" }}>
          <Typography
            level="h4"
            sx={{ alignContent: "center" }}
            textColor="text.tertiary"
          >
            {t("common.current_step", {
              currentStep: currentStepIndex + 1,
              totalSteps,
            })}
          </Typography>
        </Row>
      </Row>
    </PageTitle>
  );
}

export function ConflictError({
  hasConflict,
  scrollToErrorRef,
}: {
  hasConflict: boolean | undefined;
  scrollToErrorRef: RefObject<(() => void) | null>;
}) {
  const { goBack, currentStepIndex, isFirstStep } = useStepContext();
  const { t } = useTranslation("stiProtection/forms");
  const action = isFirstStep
    ? undefined
    : {
        text: t("common.select_new_appointment"),
        onClick: () => goBack(currentStepIndex),
      };
  const alertRef = useRef<HTMLDivElement>(null);
  function scrollToError() {
    alertRef?.current?.scrollIntoView({ behavior: "smooth" });
  }
  scrollToErrorRef.current = scrollToError;
  useEffect(() => () => scrollToErrorRef.current?.(), [scrollToErrorRef]);
  if (!hasConflict) {
    return;
  }
  return (
    <Alert
      ref={alertRef}
      color="danger"
      message={t("common.timeslot_taken")}
      action={action}
    />
  );
}

export function AppointmentOverview(buttonProps: StepButtonsProps) {
  const { t } = useTranslation("stiProtection/forms");
  const [{ concern, ...data }] = useFormData<AppointmentFormData>();
  const locale = useLocale();

  const concernLabel =
    concern === ApiConcern.SexWork
      ? t("common.sex_work")
      : t("common.hiv_sti_consultation");
  return (
    <Sheet
      sx={(theme) => ({
        [theme.breakpoints.down("md")]: { display: "none" },
      })}
    >
      <Stack gap={3}>
        <Typography level="h2">{t("common.overview_title")}</Typography>
        <Stack gap={2}>
          <Row sx={{ flexWrap: "nowrap" }}>
            <MedicalServicesOutlined /> {concernLabel}
          </Row>
          {data.date != null ? (
            <Row sx={{ flexWrap: "nowrap" }}>
              <DateRange />
              {formatDate(data.date, "EEEE, d. MMMM y", { locale })}
            </Row>
          ) : null}
          {data.appointment != null ? (
            <Row sx={{ flexWrap: "nowrap" }}>
              <AccessTimeOutlined />
              {formatDate(data.appointment.start, "HH:mm", { locale })}
            </Row>
          ) : null}
          {data.birthYear ? (
            <Row sx={{ flexWrap: "nowrap" }}>
              <CakeOutlined /> {data.birthYear}
            </Row>
          ) : null}
        </Stack>
        <StepButtons {...buttonProps} />
      </Stack>
    </Sheet>
  );
}
