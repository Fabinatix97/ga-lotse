/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiContactType,
  ApiInboxProcedureStatus,
  ApiInboxProgressEntryType,
  ApiTitle,
} from "@eshg/lib-procedures-api";

export const statusNames: Record<ApiInboxProcedureStatus, string> = {
  [ApiInboxProcedureStatus.Closed]: "Geschlossen",
  [ApiInboxProcedureStatus.Open]: "Offen",
};

export const inboxProgressEntryTypeNames: Record<
  ApiInboxProgressEntryType,
  string
> = {
  [ApiInboxProgressEntryType.Email]: "E-Mail",
  [ApiInboxProgressEntryType.Letter]: "Brief",
  [ApiInboxProgressEntryType.PhoneCall]: "Telefonanruf",
};

export const contactTypeNames: Record<ApiContactType, string> = {
  [ApiContactType.Facility]: "Einrichtung",
  [ApiContactType.PrivatePerson]: "Privatperson",
};

export const titleNames: Record<ApiTitle, string> = {
  [ApiTitle.Dr]: "Dr.",
  [ApiTitle.Prof]: "Prof.",
  [ApiTitle.ProfDr]: "Prof. Dr.",
};
