/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AccessTimeOutlined,
  DateRange,
  MedicalServicesOutlined,
} from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useFormikContext } from "formik";
import { isDefined } from "remeda";

import {
  DetailsColumn,
  DetailsList,
  formatDateToFullReadableString,
  formatTime,
} from "@eshg/lib-portal";
import { ApiGetCitizenProcedureDetailsResponse } from "@eshg/official-medical-service-api";

import { useGetAppointmentStandardDurationsQuery } from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
import { BookAppointmentFormValues } from "@/lib/businessModules/officialMedicalService/components/personalArea/bookAppointment/BookAppointmentWrapper";
import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  SupportedLanguage,
  mapToApiLanguage,
  supportedLanguages,
} from "@/lib/i18n/options";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { DetailsItem } from "@/lib/shared/components/DetailsItem";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { ScopedInternalLinkButton } from "@/lib/shared/components/scopedLinks";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";
import { useManualTranslation } from "@/lib/shared/hooks/useManualTranslation";

export function BookAppointmentSidePanel({
  procedure,
}: {
  procedure: ApiGetCitizenProcedureDetailsResponse;
}) {
  const { t } = useTranslation(["officialMedicalService/rebookAppointment"]);
  const { handleSubmit, values } =
    useFormikContext<BookAppointmentFormValues>();
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();

  const concernName = useManualTranslation<string>(
    supportedLanguages.reduce(
      (acc, it) => {
        acc[it] = procedure.concern.names[mapToApiLanguage(it)]!;
        return acc;
      },
      {} as { de: string } & Partial<Record<SupportedLanguage, string>>,
    ),
  );

  const [{ data: appointmentStandardDurations }] = useSuspenseQueries({
    queries: [useGetAppointmentStandardDurationsQuery()],
  });

  const appointmentDuration = isDefined(procedure.appointment?.appointmentType)
    ? appointmentStandardDurations[procedure.appointment?.appointmentType]
    : undefined;

  return (
    <ContentSheet data-testid="overview">
      <ContentSheetTitle>{t("sidePanel.title")}</ContentSheetTitle>
      <DetailsList data-testid="appointment-summary">
        <DetailsColumn sx={{ gap: byBreakpoint({ mobile: 1, desktop: 2 }) }}>
          <DetailsItem
            label={t("sidePanel.concernAndDuration", {
              context: "label",
            })}
            value={`${concernName} ${t("sidePanel.appointmentDuration", { durationInMinutes: appointmentDuration })}`}
            icon={<MedicalServicesOutlined />}
            hiddenLabel
          />
          {values.appointment && (
            <>
              <DetailsItem
                label={t("sidePanel.date", {
                  context: "label",
                })}
                value={formatDateToFullReadableString(
                  values.appointment?.start,
                )}
                icon={<DateRange />}
                hiddenLabel
              />
              <DetailsItem
                label={t("sidePanel.time", {
                  context: "label",
                })}
                value={t("sidePanel.time", {
                  context: "value",
                  appointmentStart: formatTime(values.appointment?.start),
                })}
                icon={<AccessTimeOutlined />}
                hiddenLabel
              />
            </>
          )}
        </DetailsColumn>
      </DetailsList>
      <Stack gap={2}>
        <Button color="primary" variant="solid" onClick={() => handleSubmit()}>
          {t("sidePanel.bookAppointment", {
            context: procedure.appointment?.bookingState
              .toString()
              .toLowerCase(),
          })}
        </Button>
        <ScopedInternalLinkButton
          variant="soft"
          color="neutral"
          href={citizenRoutes.personalArea.index(accessCode)}
        >
          {t("sidePanel.cancel")}
        </ScopedInternalLinkButton>
      </Stack>
    </ContentSheet>
  );
}
