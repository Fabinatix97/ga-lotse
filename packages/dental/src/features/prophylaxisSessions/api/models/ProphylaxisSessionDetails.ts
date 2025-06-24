/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import {
  ApiDentitionType,
  ApiPerformingPerson,
  ApiProphylaxisSessionDetails,
} from "@eshg/dental-api";

import {
  ProphylaxisSession,
  mapProphylaxisSession,
} from "./ProphylaxisSession";
import {
  ProphylaxisSessionExamination,
  mapProphylaxisSessionExamination,
} from "./ProphylaxisSessionExamination";

export interface ProphylaxisSessionDetails extends ProphylaxisSession {
  version: number;
  dentitionType?: ApiDentitionType;
  participants: ProphylaxisSessionExamination[];
  dentists: ApiPerformingPerson[];
  zfas: ApiPerformingPerson[];
}

export function mapProphylaxisSessionDetails(
  response: ApiProphylaxisSessionDetails,
): ProphylaxisSessionDetails {
  const isFluoridation = isDefined(response.fluoridationVarnish);
  return {
    ...response,
    ...mapProphylaxisSession(response),
    dentitionType: response.dentitionType,
    participants: response.participants.map((participant) =>
      mapProphylaxisSessionExamination(
        participant,
        response.isScreening,
        isFluoridation,
      ),
    ),
    version: response.version,
  };
}
