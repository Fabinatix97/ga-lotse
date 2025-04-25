/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChipProps } from "@mui/joy/Chip";

import {
  ApiContactType,
  ApiInboxProcedureStatus,
  ApiInboxProgressEntryType,
  ApiTitle,
} from "@eshg/lib-procedures-api";

export const statusNames = {
  [ApiInboxProcedureStatus.Closed]: "Geschlossen",
  [ApiInboxProcedureStatus.Open]: "Offen",
} satisfies Record<ApiInboxProcedureStatus, string>;

export const statusColors = {
  [ApiInboxProcedureStatus.Closed]: "danger",
  [ApiInboxProcedureStatus.Open]: "warning",
} satisfies Record<ApiInboxProcedureStatus, ChipProps["color"]>;

export const inboxProgressEntryTypeNames = {
  [ApiInboxProgressEntryType.Email]: "E-Mail",
  [ApiInboxProgressEntryType.Letter]: "Brief",
  [ApiInboxProgressEntryType.PhoneCall]: "Telefonanruf",
} satisfies Record<ApiInboxProgressEntryType, string>;

export const contactTypeNames = {
  [ApiContactType.Facility]: "Einrichtung",
  [ApiContactType.PrivatePerson]: "Privatperson",
} satisfies Record<ApiContactType, string>;

export const titleNames = {
  [ApiTitle.Dr]: "Dr.",
  [ApiTitle.Prof]: "Prof.",
  [ApiTitle.ProfDr]: "Prof. Dr.",
} satisfies Record<ApiTitle, string>;
