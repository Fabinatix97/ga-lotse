/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDentitionType,
  ApiFluoridationVarnish,
  ApiProphylaxisStatus,
  ApiProphylaxisType,
} from "@eshg/dental-api";

export const PROPHYLAXIS_TYPES: Record<ApiProphylaxisType, string> = {
  [ApiProphylaxisType.P1]: "P1 (mit FL/ mit und ohne U)",
  [ApiProphylaxisType.P2]: "P2 (mit FL)",
  [ApiProphylaxisType.P3]: "P3 (nur Unterrichtseinheit)",
  [ApiProphylaxisType.P4]: "P4 (Ernährung)",
  [ApiProphylaxisType.P5]: "P5 (P+3.FL)",
  [ApiProphylaxisType.P6]: "P6 (P+4.FL)",
  [ApiProphylaxisType.P7]: "P7 (nur Unterrichtseinheit)",
};

export const PROPHYLAXIS_STATUS: Record<ApiProphylaxisStatus, string> = {
  OPEN: "offen",
  CLOSED: "abgeschlossen",
};

export const DENTITION_TYPES: Record<ApiDentitionType, string> = {
  [ApiDentitionType.Primary]: "Milchgebiss",
  [ApiDentitionType.Mixed]: "Wechselgebiss",
  [ApiDentitionType.Secondary]: "Bleibendes Gebiss",
};

export const FLUORIDATION_VARNISH_TYPES: Record<
  ApiFluoridationVarnish,
  string
> = {
  [ApiFluoridationVarnish.A]: "A",
  [ApiFluoridationVarnish.B]: "B",
  [ApiFluoridationVarnish.C]: "C",
  [ApiFluoridationVarnish.D]: "D",
};

export const FLUORIDATION_VARNISH_DESCRIPTIONS: Record<
  ApiFluoridationVarnish,
  string
> = {
  [ApiFluoridationVarnish.A]: "Lack A",
  [ApiFluoridationVarnish.B]: "Lack B",
  [ApiFluoridationVarnish.C]: "Lack C",
  [ApiFluoridationVarnish.D]: "Lack D",
};
