/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import AddCircleIcon from "@mui/icons-material/AddCircle";
import { IconButton } from "@mui/joy";

import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { QuadrantNumber } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

interface AddToothButtonProps {
  index: number;
  quadrantNumber: QuadrantNumber;
}

export function AddToothButton(props: AddToothButtonProps) {
  const addTooth = useDentalExaminationStore((state) => state.addTooth);

  return (
    <IconButton
      sx={{ padding: 2 }}
      onClick={() => {
        addTooth({
          quadrantNumber: props.quadrantNumber,
          toothIndex: props.index,
        });
      }}
    >
      <AddCircleIcon color="primary" />
    </IconButton>
  );
}
