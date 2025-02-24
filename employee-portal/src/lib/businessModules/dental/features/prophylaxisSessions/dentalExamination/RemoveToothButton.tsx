/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DeleteOutlined } from "@mui/icons-material";
import { styled } from "@mui/joy";

import { ToothIconButton } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/AddToothButton";
import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { ToothContext } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

interface RemoveToothButtonProps {
  toothContext: ToothContext;
}

const DeleteIconButton = styled(ToothIconButton)({
  position: "absolute",
  top: 0,
  right: 0,
});

const RoundedDeleteIcon = styled(DeleteOutlined)(({ theme }) => ({
  padding: 4,
  borderRadius: "50%",
  color: theme.palette.common.white,
  backgroundColor: theme.palette.danger.solidBg,
}));

export function RemoveToothButton(props: RemoveToothButtonProps) {
  const removeTooth = useDentalExaminationStore((state) => state.removeTooth);

  return (
    <DeleteIconButton
      color="danger"
      variant="plain"
      className="remove-tooth-button"
      onClick={() => {
        removeTooth(props.toothContext);
      }}
      aria-label={"Zahn entfernen"}
    >
      <RoundedDeleteIcon />
    </DeleteIconButton>
  );
}
