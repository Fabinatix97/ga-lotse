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
import { Box, Sheet, Stack, Typography, useTheme } from "@mui/joy";
import { formatDate } from "date-fns";
import { Formik, useFormikContext } from "formik";
import {
  PropsWithChildren,
  RefObject,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { isNonNullish } from "remeda";

import { Alert, FormPlus, PortalErrorCode, Row } from "@eshg/lib-portal";
import { ApiConcern } from "@eshg/sti-protection-api";

import {
  ConfirmLeaveDirtyFormEffect,
  ConfirmLeaveDirtyFormEffectProps,
} from "@/lib/baseModule/components/ConfirmLeaveDirtyFormEffect";
import { useCancelPendingAppointment } from "@/lib/businessModules/stiProtection/api/mutations/publicCitizenApi";
import { useStepContext } from "@/lib/businessModules/stiProtection/components/shared/StepContext";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/lib/i18n/useLocale";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
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
type StepLayoutProps<T extends FormDataWithoutConcern> = PropsWithChildren<
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

  const hasBookedAppointment = formData.procedureId !== undefined;
  const hasCreatedAccount = formData.accessCode !== undefined;

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
    if (formData.procedureId === undefined) {
      return;
    }
    cancelPendingAppointment.mutate();
  }, [formData.procedureId, cancelPendingAppointment]);

  const initialValues = {
    ...givenInitialValues,
    ...formData,
  };

  const titleId = useId();
  const stepTitleId = useId();
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <FormPlus
        aria-labelledby={titleId}
        aria-describedby={stepTitleId}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <BookAppointmentTitle titleId={titleId} stepTitleId={stepTitleId} />
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

function DirtyCheck({
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
  const i18nKey = hasCreatedAccount ? "leave_without_pin" : "cancel_booking";
  return (
    <ConfirmLeaveDirtyFormEffect
      title={t(`${i18nKey}.title`)}
      description={t(`${i18nKey}.message`)}
      cancelLabel={t(`${i18nKey}.cancel`)}
      confirmLabel={t(`${i18nKey}.confirm`)}
      isDirty={hasBookedAppointment && !isAccountCreatedAndShared}
      onConfirm={handleConfirmCancel}
    />
  );
}

function BookAppointmentTitle(props: { titleId: string; stepTitleId: string }) {
  const { t } = useTranslation("stiProtection/forms");
  const { currentStepIndex, totalSteps } = useStepContext();
  return (
    <PageTitle titleId={props.titleId}>
      <Row justifyContent="space-between">
        {t("common.appointment_booking_title")}
        <Row sx={{ alignContent: "center" }}>
          <Typography
            level="h4"
            sx={{ alignContent: "center" }}
            textColor="text.tertiary"
            id={props.stepTitleId}
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

function ConflictError({
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

function AppointmentOverview(buttonProps: StepButtonsProps) {
  const { t } = useTranslation("stiProtection/forms");
  const [{ concern, ...data }] = useFormData<AppointmentFormData>();
  const locale = useLocale();
  const theme = useTheme();

  const concernLabel =
    concern === ApiConcern.SexWork
      ? t("common.sex_work")
      : t("common.hiv_sti_consultation");
  return (
    <ContentSheet
      sx={{
        [theme.breakpoints.down("md")]: { display: "none" },
      }}
    >
      <ContentSheetTitle>{t("common.overview_title")}</ContentSheetTitle>
      <Stack gap={2}>
        <Row sx={{ flexWrap: "nowrap" }}>
          <MedicalServicesOutlined /> {concernLabel}
        </Row>
        {isNonNullish(data.date) ? (
          <Row sx={{ flexWrap: "nowrap" }}>
            <DateRange />
            {formatDate(data.date, "EEEE, d. MMMM y", { locale })}
          </Row>
        ) : null}
        {isNonNullish(data.appointment) ? (
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
    </ContentSheet>
  );
}
