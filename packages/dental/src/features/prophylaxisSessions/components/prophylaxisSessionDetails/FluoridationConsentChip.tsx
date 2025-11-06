/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip, ChipProps } from "@mui/joy";

import { ApiBooleanWithUnknown } from "@eshg/dental-api";

import { ExaminationResult } from "../../../../api/models/ExaminationResult";
import { FluoridationConsent } from "../../../../utils/childDetails/FluoridationConsent";

type FluoridationStatus =
  | "Open"
  | "FluorideVarnishApplied"
  | "NoFluorideVarnishApplied"
  | "Absent"
  | "NoConsent";

const fluoridationConsentTranslations: Record<FluoridationStatus, string> = {
  Open: "offen",
  FluorideVarnishApplied: "erledigt - ja",
  NoFluorideVarnishApplied: "erledigt - nein",
  Absent: "Nicht anwesend",
  NoConsent: "kein Einverständnis",
};

const fluoridationConsentColors: Record<
  FluoridationStatus,
  ChipProps["color"]
> = {
  Open: "neutral",
  FluorideVarnishApplied: "success",
  NoFluorideVarnishApplied: "success",
  Absent: "danger",
  NoConsent: "warning",
};

interface FluoridationConsentChipProps {
  result: ExaminationResult | undefined;
  fluoridationConsent: FluoridationConsent | undefined;
}

export function FluoridationConsentChip(props: FluoridationConsentChipProps) {
  const status = getStatus(props.result, props.fluoridationConsent);
  return (
    <Chip color={fluoridationConsentColors[status]}>
      {fluoridationConsentTranslations[status]}
    </Chip>
  );
}

function getStatus(
  result: ExaminationResult | undefined,
  fluoridationConsent: FluoridationConsent | undefined,
): FluoridationStatus {
  if (result === undefined) {
    if (
      fluoridationConsent === undefined ||
      fluoridationConsent.consented === ApiBooleanWithUnknown.False ||
      fluoridationConsent.consented === ApiBooleanWithUnknown.Unknown
    ) {
      return "NoConsent";
    }
    return "Open";
  }

  switch (result.type) {
    case "absence":
      return "Absent";
    case "fluoridation": {
      if (
        fluoridationConsent === undefined ||
        fluoridationConsent.consented === ApiBooleanWithUnknown.False ||
        fluoridationConsent.consented === ApiBooleanWithUnknown.Unknown
      ) {
        return "NoConsent";
      }
      if (result.fluorideVarnishApplied === undefined) {
        return "Open";
      }
      return result.fluorideVarnishApplied
        ? "FluorideVarnishApplied"
        : "NoFluorideVarnishApplied";
    }
    case "screening":
      throw new Error("Unexpected examination type");
  }
}
