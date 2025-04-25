/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MedicalServicesOutlined } from "@mui/icons-material";

import {
  PersonToolbarHeader,
  TabNavigationToolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";

import { routes } from "@/config/routes";
import { ProphylaxisSessionExamination } from "@/features/prophylaxisSessions/api/models/ProphylaxisSessionExamination";

interface ProphylaxisSessionExaminationToolbarProps {
  prophylaxisSessionId: string;
  participant: ProphylaxisSessionExamination;
  onBackClicked: () => void;
}

export function ProphylaxisSessionExaminationToolbar(
  props: ProphylaxisSessionExaminationToolbarProps,
) {
  return (
    <TabNavigationToolbar
      header={<PersonToolbarHeader person={props.participant} showAge />}
      items={[
        {
          tabButtonName: "Untersuchung",
          href: routes.prophylaxisSessions
            .byId(props.prophylaxisSessionId)
            .examinations.byExaminationId(props.participant.examinationId),
          decorator: <MedicalServicesOutlined />,
        },
      ]}
      backButton={<ToolbarBackButton onClick={props.onBackClicked} />}
    />
  );
}
