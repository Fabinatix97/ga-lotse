/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiPerformingPerson,
  ApiProphylaxisSessionDetails,
} from "@eshg/dental-api";

import { ChildExamination, mapChildExamination } from "./ChildExamination";
import {
  ProphylaxisSession,
  mapProphylaxisSession,
} from "./ProphylaxisSession";

export interface ProphylaxisSessionDetails extends ProphylaxisSession {
  version: number;
  participants: ChildExamination[];
  dentists: ApiPerformingPerson[];
  zfas: ApiPerformingPerson[];
}

export function mapProphylaxisSessionDetails(
  response: ApiProphylaxisSessionDetails,
): ProphylaxisSessionDetails {
  return {
    ...response,
    ...mapProphylaxisSession(response),
    participants: response.participants.map(mapChildExamination),
    version: response.version,
  };
}
