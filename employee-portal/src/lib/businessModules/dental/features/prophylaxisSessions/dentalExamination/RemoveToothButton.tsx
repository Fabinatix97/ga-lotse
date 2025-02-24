/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DeleteOutlined } from "@mui/icons-material";
import { styled } from "@mui/joy";

import { ToothIconButton } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/AddToothButton";
import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import {
  Tooth,
  ToothContext,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

import { ToothIcon } from "./Teeth";

interface RemoveToothButtonProps {
  tooth: Tooth;
  toothContext: ToothContext;
}

const RoundedDeleteIcon = styled(DeleteOutlined)(({ theme }) => ({
  padding: 4,
  borderRadius: "50%",
  color: theme.palette.common.white,
  backgroundColor: theme.palette.danger.solidBg,
}));

export function RemoveToothButton(props: RemoveToothButtonProps) {
  const removeTooth = useDentalExaminationStore((state) => state.removeTooth);

  return (
    <ToothIconButton
      color="danger"
      variant="plain"
      aria-label="Zahn entfernen"
      onClick={() => removeTooth(props.toothContext)}
      sx={{
        ".remove-icon": {
          display: "none",
        },
        "&:hover": {
          ".tooth-icon": {
            display: "none",
          },
          ".remove-icon": {
            display: "inline-flex",
          },
        },
      }}
    >
      <ToothIcon
        tooth={props.tooth}
        toothContext={props.toothContext}
        className="tooth-icon"
      />
      <RoundedDeleteIcon className="remove-icon" />
    </ToothIconButton>
  );
}
