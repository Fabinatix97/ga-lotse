/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ProphylaxisSessionExamination, routes } from "@eshg/dental";
import {
  PersonToolbarHeader,
  TabNavigationBackButton,
  TabNavigationToolbar,
} from "@eshg/lib-employee-portal";
import { MedicalServicesOutlined } from "@mui/icons-material";

interface ParticipantExaminationToolbarProps {
  prophylaxisSessionId: string;
  participant: ProphylaxisSessionExamination;
  onBackClicked: () => void;
}

export function ParticipantExaminationToolbar(
  props: ParticipantExaminationToolbarProps,
) {
  return (
    <TabNavigationToolbar
      header={<PersonToolbarHeader person={props.participant} showAge />}
      routeBack={<TabNavigationBackButton onClick={props.onBackClicked} />}
      items={[
        {
          tabButtonName: "Untersuchung",
          href: routes.prophylaxisSessions
            .byId(props.prophylaxisSessionId)
            .examinations.byExaminationId(props.participant.examinationId),
          decorator: <MedicalServicesOutlined />,
        },
      ]}
    />
  );
}
