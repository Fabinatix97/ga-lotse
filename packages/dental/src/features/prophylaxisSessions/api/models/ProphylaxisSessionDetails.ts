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
import { mapBaseEntity, mapVersioned } from "@eshg/lib-employee-portal";

import { mapInstitution } from "../../../../api/models/Institution";

import { ProphylaxisSession } from "./ProphylaxisSession";
import {
  ProphylaxisSessionExamination,
  mapProphylaxisSessionExamination,
} from "./ProphylaxisSessionExamination";

export interface ProphylaxisSessionDetails
  extends Omit<ProphylaxisSession, "isDeletable"> {
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
  };
}

function mapProphylaxisSession(
  response: ApiProphylaxisSessionDetails,
): Omit<ProphylaxisSession, "isDeletable"> {
  return {
    ...mapBaseEntity(response),
    ...mapVersioned(response),
    dateAndTime: response.dateAndTime,
    institution: mapInstitution(response.institution),
    groupName: response.groupName,
    type: response.type,
    isScreening: response.isScreening,
    fluoridationVarnish: response.fluoridationVarnish,
    status: response.status,
  };
}
