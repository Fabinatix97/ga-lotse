/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  PersonToolbarHeader,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";

import { ExaminationStatus } from "../../../../api/models/ExaminationStatus";
import { ExaminationStatusChip } from "../../../../components/examination/ExaminationStatusChip";
import { ProphylaxisSessionExamination } from "../../api/models/ProphylaxisSessionExamination";

interface ProphylaxisSessionExaminationToolbarProps {
  participant: ProphylaxisSessionExamination;
  status: ExaminationStatus;
  onBackClicked: () => void;
}

export function ProphylaxisSessionExaminationToolbar(
  props: ProphylaxisSessionExaminationToolbarProps,
) {
  return (
    <Toolbar
      title={<PersonToolbarHeader person={props.participant} showAge />}
      backButton={<ToolbarBackButton onClick={props.onBackClicked} />}
      afterTitle={
        <ExaminationStatusChip invisibleStatusLabel status={props.status} />
      }
    />
  );
}
