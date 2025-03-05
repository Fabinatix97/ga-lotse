/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EnumMap } from "@eshg/lib-portal/types/helpers";
import { ApiBookingState } from "@eshg/official-medical-service-api";
import { EventAvailableOutlined, InfoOutlined } from "@mui/icons-material";
import { Chip, IconButton } from "@mui/joy";
import { DefaultColorPalette } from "@mui/joy/styles/types";

import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";

const BOOKING_STATE_COLORS: EnumMap<ApiBookingState, DefaultColorPalette> = {
  [ApiBookingState.Bookable]: "warning",
  [ApiBookingState.Booked]: "success",
  [ApiBookingState.Cancelled]: "danger",
  [ApiBookingState.Withdrawn]: "danger",
} as const;

export function AppointmentStatusSection({
  bookingState,
  localePath,
}: Readonly<{
  bookingState: ApiBookingState;
  localePath: string;
}>) {
  const { t } = useTranslation([`${localePath}`]);

  function handleInfoClick() {
    // TODO
  }

  return (
    <InfoSection
      icon={<EventAvailableOutlined />}
      slotProps={{
        stack: {
          sx: {
            overflow: "unset",
          },
        },
      }}
    >
      <InfoSectionTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {t("information.appointment_status_section.title")}
        <IconButton
          color="primary"
          size="sm"
          sx={{ marginY: -1 }}
          onClick={handleInfoClick}
        >
          <InfoOutlined size="xs" />
        </IconButton>
      </InfoSectionTitle>
      <Chip color={BOOKING_STATE_COLORS[bookingState]}>
        {t(
          `information.appointment_status_section.booking_state.${bookingState}`,
        )}
      </Chip>
    </InfoSection>
  );
}
