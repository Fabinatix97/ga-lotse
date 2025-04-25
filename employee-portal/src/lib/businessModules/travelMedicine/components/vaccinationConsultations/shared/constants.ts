/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChipProps } from "@mui/joy";

import {
  ApiAppointmentBookingType,
  ApiServiceStatus,
} from "@eshg/travel-medicine-api";

export const statusColors = {
  [ApiServiceStatus.Open]: "neutral",
  [ApiServiceStatus.Planned]: "warning",
  [ApiServiceStatus.Accomplished]: "success",
} satisfies Record<ApiServiceStatus, ChipProps["color"]>;

export const statusColorsAppointment = {
  [ApiAppointmentBookingType.UserDefined]: "primary",
  [ApiAppointmentBookingType.AppointmentBlock]: "primary",
  [ApiAppointmentBookingType.SelfBooking]: "neutral",
  [ApiAppointmentBookingType.Cancelled]: "danger",
} satisfies Record<ApiAppointmentBookingType, ChipProps["color"]>;
