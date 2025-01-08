/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProcedureDetails } from "@eshg/employee-portal-api/schoolEntry";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";

import { mapOptional } from "@/lib/shared/api/models/utils";

import { Appointment, mapAppointment } from "./Appointment";
import { Label, mapLabels } from "./Label";
import { Location, mapLocation } from "./Location";
import { PersonDetails, mapPersonDetails } from "./Person";
import { Procedure, mapProcedure } from "./Procedure";
import { WaitingRoom, mapWaitingRoom } from "./WaitingRoom";

export interface ProcedureDetails extends Procedure {
  readonly version: number;
  readonly labels: Label[];
  readonly appointment?: Appointment;
  readonly location?: Location;
  readonly isEntryLevel: boolean;
  readonly child: PersonDetails;
  readonly isInvitationSent: boolean;
  readonly isDeceased: boolean;
  readonly deceased?: Date;
  readonly custodians: PersonDetails[];
  readonly waitingRoom: WaitingRoom;
  readonly isDeletable: boolean;
  readonly schoolInfoLetterCreatedAt?: Date;
  readonly hasInformationBlock: boolean;
  readonly hasBeenClosed: boolean;
  readonly isPastProcedure: boolean;
}

export function mapProcedureDetails(
  response: ApiProcedureDetails,
): ProcedureDetails {
  return {
    ...mapProcedure(response),
    version: response.version,
    labels: mapLabels(response.labels),
    appointment: mapOptional(response.appointment, mapAppointment),
    location: mapOptional(response.location, mapLocation),
    isEntryLevel: response.isEntryLevel,
    child: mapPersonDetails(response.child),
    isInvitationSent: response.isInvitationSent,
    isDeceased: response.isDeceased,
    deceased: mapOptionalValue(response.deceased),
    custodians: response.custodians.map(mapPersonDetails),
    waitingRoom: mapWaitingRoom(response.waitingRoom),
    isDeletable: response.isDeletable,
    schoolInfoLetterCreatedAt: response.schoolInfoLetterCreatedAt,
    hasInformationBlock: response.hasInformationBlock,
    hasBeenClosed: response.hasBeenClosed,
    isPastProcedure: response.isPastProcedure,
  };
}
