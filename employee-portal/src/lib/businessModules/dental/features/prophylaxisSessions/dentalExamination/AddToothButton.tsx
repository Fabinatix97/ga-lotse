/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import AddCircleIcon from "@mui/icons-material/AddCircle";
import { IconButton } from "@mui/joy";
import { styled } from "@mui/joy";

import { TOOTH_SIZE } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/styles";
import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { QuadrantNumber } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

interface AddToothButtonProps {
  index: number;
  quadrantNumber: QuadrantNumber;
}

export const ToothIconButton = styled(IconButton)({
  padding: 2,
  ...TOOTH_SIZE,
});

const SizedAddCircleIcon = styled(AddCircleIcon)({
  width: 28,
  height: 28,
});

export function AddToothButton(props: AddToothButtonProps) {
  const addTooth = useDentalExaminationStore((state) => state.addTooth);

  return (
    <ToothIconButton
      onClick={() => {
        addTooth({
          quadrantNumber: props.quadrantNumber,
          toothIndex: props.index,
        });
      }}
    >
      <SizedAddCircleIcon color="primary" />
    </ToothIconButton>
  );
}
