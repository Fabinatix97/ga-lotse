/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChipWithTooltip } from "../../../components/chip/ChipWithTooltip";
import { ProcedureLabel } from "../api/models/ProcedureLabel";

interface ProcedureLabelChipProps {
  value: ProcedureLabel;
}

export function ProcedureLabelChip(props: ProcedureLabelChipProps) {
  return (
    <ChipWithTooltip
      name={props.value.name}
      hexColor={props.value.hexColor}
      modalTitle="Kennung"
    />
  );
}
