/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDentitionType } from "@eshg/dental-api";

import { Dentition } from "../types";

export function calcDentitionType(dentition: Dentition): ApiDentitionType {
  let hasPrimaryTeeth = false;
  let hasSecondaryTeeth = false;

  Object.values(dentition)
    .flatMap((quadrant) => quadrant.teeth)
    .forEach((tooth) => {
      if (tooth.type === "ToothWithDiagnosis") {
        if (tooth.toothType === "PRIMARY_TOOTH") {
          hasPrimaryTeeth = true;
        } else {
          hasSecondaryTeeth = true;
        }
      }
    });

  if (hasPrimaryTeeth && hasSecondaryTeeth) {
    return ApiDentitionType.Mixed;
  } else if (hasPrimaryTeeth) {
    return ApiDentitionType.Primary;
  } else {
    return ApiDentitionType.Secondary;
  }
}
