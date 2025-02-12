/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ChildExamination } from "@eshg/dental/api/models/ChildExamination";
import { routes } from "@eshg/dental/shared/routes";
import { MedicalServicesOutlined } from "@mui/icons-material";

import { PersonToolbarHeader } from "@/lib/shared/components/layout/PersonToolbarHeader";
import {
  BackButton,
  TabNavigationToolbar,
} from "@/lib/shared/components/tabNavigationToolbar/TabNavigationToolbar";

interface ParticipantExaminationToolbarProps {
  prophylaxisSessionId: string;
  participant: ChildExamination;
  participantIndex: number;
  onBackClicked: () => void;
}

export function ParticipantExaminationToolbar(
  props: ParticipantExaminationToolbarProps,
) {
  return (
    <TabNavigationToolbar
      header={<PersonToolbarHeader person={props.participant} showAge />}
      routeBack={<BackButton onClick={props.onBackClicked} />}
      items={[
        {
          tabButtonName: "Untersuchung",
          href: routes.prophylaxisSessions
            .byId(props.prophylaxisSessionId)
            .examinations.byIndex(props.participantIndex),
          decorator: <MedicalServicesOutlined />,
        },
      ]}
    />
  );
}
