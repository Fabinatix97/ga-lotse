/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { routes } from "@eshg/dental/shared/routes";
import { MedicalServicesOutlined } from "@mui/icons-material";

import { ChildExamination } from "@/lib/businessModules/dental/api/models/ChildExamination";
import { PersonToolbarHeader } from "@/lib/shared/components/layout/PersonToolbarHeader";
import { TabNavigationToolbar } from "@/lib/shared/components/tabNavigationToolbar/TabNavigationToolbar";

interface ProphylaxisSessionExaminationToolbarProps {
  prophylaxisSessionId: string;
  participant: ChildExamination;
  participantIndex: number;
}

export function ProphylaxisSessionExaminationToolbar(
  props: ProphylaxisSessionExaminationToolbarProps,
) {
  return (
    <TabNavigationToolbar
      header={<PersonToolbarHeader person={props.participant} showAge />}
      routeBack={
        routes.prophylaxisSessions.byId(props.prophylaxisSessionId).details
      }
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
