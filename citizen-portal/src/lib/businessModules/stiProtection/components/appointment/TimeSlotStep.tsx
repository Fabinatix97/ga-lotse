/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { ApiConcern } from "@eshg/sti-protection-api";
import { DateRangeOutlined } from "@mui/icons-material";
import { Sheet, Stack, Typography } from "@mui/joy";
import { startOfMonth } from "date-fns";

import { useFreeAppointments } from "@/lib/businessModules/stiProtection/api/queries/publicCitizenApi";
import { useCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";

import { useFormData } from "./AppointmentDataContext";
import { AppointmentPickerSection } from "./AppointmentPickerSection";
import { AppointmentFormData } from "./AppointmentStepper";
import { BookAppointmentTitle, StepLayout } from "./StepLayout";

export function TimeSlotStep() {
  const { t } = useTranslation("stiProtection/forms");
  const [formData, setFormData] = useFormData<AppointmentFormData>();
  const now = startOfMonth(new Date());
  const { data: appointments } = useFreeAppointments({
    concern: formData.concern,
    earliestDate: now,
  });

  if ((appointments?.length ?? 0) === 0) {
    return <NoAppointmentAvailable concern={formData.concern} />;
  }

  return (
    <StepLayout>
      <Typography level="h2">{t("time_slot.title")}</Typography>
      <Alert
        color="primary"
        title={t("time_slot.consent_note_title")}
        message={t("time_slot.consent_note_message")}
      />
      <AppointmentPickerSection
        appointments={appointments ?? []}
        name="appointment"
        t={t}
        onDateSelected={(value) =>
          setFormData({
            date: value,
            appointment: undefined,
          })
        }
        onAppointmentSelected={(value) => setFormData({ appointment: value })}
      />
    </StepLayout>
  );
}

function NoAppointmentAvailable({ concern }: { concern: ApiConcern }) {
  const { t } = useTranslation("stiProtection/forms");
  const routes = useCitizenRoutes();
  return (
    <Stack gap={3}>
      <BookAppointmentTitle />
      <Sheet>
        <Stack gap={3} sx={{ padding: 3, alignItems: "center" }}>
          <Typography level="h2" sx={{ alignSelf: "start" }}>
            {t(`time_slot.title`)}
          </Typography>
          <DateRangeOutlined
            sx={(theme) => ({
              height: theme.spacing(10),
              width: theme.spacing(10),
              color: theme.palette.primary.outlinedBorder,
            })}
          />
          <Typography level="title-md">
            {t("time_slot.no_appointments_available")}
          </Typography>
          <Typography
            sx={(theme) => ({
              maxWidth: theme.spacing(80),
            })}
          >
            {t("time_slot.try_later")}
          </Typography>
          <InternalLinkButton
            href={
              concern === ApiConcern.SexWork
                ? routes.sexWork
                : routes.stiConsultation
            }
            size="lg"
            sx={(theme) => ({
              maxWidth: theme.spacing(44),
              width: "100%",
              minWidth: "min-content",
            })}
          >
            {t("base/translations:common.back")}
          </InternalLinkButton>
        </Stack>
      </Sheet>
    </Stack>
  );
}
