/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { mapOptional, mapProcedureLabels } from "@eshg/lib-employee-portal";
import { mapOptionalValue } from "@eshg/lib-portal";
import {
  ApiProcedureDetails,
  ApiStatisticsInclusion,
} from "@eshg/school-entry-api";

import { Appointment, mapAppointment } from "./Appointment";
import { CustodianDetails, mapCustodianDetails } from "./CustodianDetails";
import { Location, mapLocation } from "./Location";
import { PersonDetails, mapPersonDetails } from "./Person";
import { Procedure, mapProcedure } from "./Procedure";
import { WaitingRoom, mapWaitingRoom } from "./WaitingRoom";

export interface ProcedureDetails extends Procedure {
  readonly appointment?: Appointment;
  readonly location?: Location;
  readonly isEntryLevel: boolean;
  readonly child: PersonDetails;
  readonly isInvitationSent: boolean;
  readonly isDeceased: boolean;
  readonly deceased?: Date;
  readonly custodians: CustodianDetails[];
  readonly waitingRoom: WaitingRoom;
  readonly isDeletable: boolean;
  readonly schoolInfoLetterCreatedAt?: Date;
  readonly hasInformationBlock: boolean;
  readonly hasBeenClosed: boolean;
  readonly isPastProcedure: boolean;
  readonly statisticsInclusion: ApiStatisticsInclusion;
}

export function mapProcedureDetails(
  response: ApiProcedureDetails,
): ProcedureDetails {
  return {
    ...mapProcedure(response),
    labels: mapProcedureLabels(response.labels),
    appointment: mapOptional(response.appointment, mapAppointment),
    location: mapOptional(response.location, mapLocation),
    isEntryLevel: response.isEntryLevel,
    child: mapPersonDetails(response.child),
    isInvitationSent: response.isInvitationSent,
    isDeceased: response.isDeceased,
    deceased: mapOptionalValue(response.deceased),
    custodians: response.custodians.map(mapCustodianDetails),
    waitingRoom: mapWaitingRoom(response.waitingRoom),
    isDeletable: response.isDeletable,
    schoolInfoLetterCreatedAt: response.schoolInfoLetterCreatedAt,
    hasInformationBlock: response.hasInformationBlock,
    hasBeenClosed: response.hasBeenClosed,
    isPastProcedure: response.isPastProcedure,
    statisticsInclusion: response.statisticsInclusion,
  };
}
