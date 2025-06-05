/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Versioned, mapVersioned } from "@eshg/lib-employee-portal";
import {
  ApiBooleanWithUnknown,
  ApiOtherVaccination,
  ApiVaccinationSchemeValue,
  ApiVaccinationStatus,
} from "@eshg/school-entry-api";

interface VaccinationStatus extends Versioned {
  vaccinationScheme?: ApiVaccinationSchemeValue;
  diphtheria?: number;
  tetanus?: number;
  pertussis?: number;
  hib?: number;
  polio?: number;
  hepatitisB?: number;
  pneumococcus?: number;
  mmr?: number;
  varicella?: number;
  meningococcusB?: number;
  meningococcusC?: number;
  hepatitisA?: number;
  rota?: number;
  tbe?: number;
  otherVaccinations: ApiOtherVaccination[];
  vaccinationPassPresented?: boolean;
  perkombiHbv?: ApiBooleanWithUnknown;
  measlesContraIndication?: boolean;
  measlesContraIndicationIsPermanent?: boolean;
  measlesContraIndicationUntil?: Date;
}

export function mapVaccinationStatus(
  response: ApiVaccinationStatus,
): VaccinationStatus {
  return {
    ...mapVersioned(response),
    vaccinationScheme: response.vaccinationScheme,
    diphtheria: response.diphtheria,
    tetanus: response.tetanus,
    pertussis: response.pertussis,
    hib: response.hib,
    polio: response.polio,
    hepatitisB: response.hepatitisB,
    pneumococcus: response.pneumococcus,
    mmr: response.mmr,
    varicella: response.varicella,
    meningococcusB: response.meningococcusB,
    meningococcusC: response.meningococcusC,
    hepatitisA: response.hepatitisA,
    rota: response.rota,
    tbe: response.tbe,
    otherVaccinations: response.otherVaccinations,
    vaccinationPassPresented: response.vaccinationPassPresented,
    perkombiHbv: response.perkombiHbv,
    measlesContraIndication: response.measlesContraIndication,
    measlesContraIndicationIsPermanent:
      response.measlesContraIndicationIsPermanent,
    measlesContraIndicationUntil: response.measlesContraIndicationUntil,
  };
}
