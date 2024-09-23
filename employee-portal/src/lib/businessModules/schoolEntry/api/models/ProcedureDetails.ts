/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentLocation,
  ApiProcedureDetails,
} from "@eshg/employee-portal-api/schoolEntry";
import {
  mapOptionalValue,
  parseOptionalValue,
} from "@eshg/lib-portal/helpers/form";

import {
  Label,
  mapLabels,
} from "@/lib/businessModules/schoolEntry/api/models/Label";
import {
  WaitingRoom,
  mapWaitingRoom,
} from "@/lib/businessModules/schoolEntry/api/models/WaitingRoom";

import { Appointment, mapAppointment } from "./Appointment";
import { PersonDetails, mapPersonDetails } from "./Person";
import { Procedure, mapProcedure } from "./Procedure";
import { mapOptional } from "./utils";

export interface Location {
  readonly id: string;
  readonly name: string;
}

export interface ProcedureDetails extends Procedure {
  readonly version: number;
  readonly labels: Label[];
  readonly appointment?: Appointment;
  readonly location: Location;
  readonly isEntryLevel: boolean;
  readonly child: PersonDetails;
  readonly isInvitationSent: boolean;
  readonly isDeceased: boolean;
  readonly deceased?: Date;
  readonly custodians: PersonDetails[];
  readonly waitingRoom?: WaitingRoom;
  readonly isDeletable: boolean;
}

export function mapProcedureDetails(
  response: ApiProcedureDetails,
): ProcedureDetails {
  return {
    ...mapProcedure(response),
    version: response.version,
    labels: mapLabels(response.labels),
    appointment: mapOptional(response.appointment, mapAppointment),
    location: mapLocation(response.location),
    isEntryLevel: response.isEntryLevel,
    child: mapPersonDetails(response.child),
    isInvitationSent: response.isInvitationSent,
    isDeceased: response.isDeceased,
    deceased: mapOptionalValue(response.deceased),
    custodians: response.custodians.map(mapPersonDetails),
    waitingRoom: mapOptional(response.waitingRoom, mapWaitingRoom),
    isDeletable: response.isDeletable,
  };
}

function mapLocation(location?: ApiAppointmentLocation): Location {
  return {
    id: parseOptionalValue(location?.id),
    name: parseOptionalValue(location?.name),
  };
}
