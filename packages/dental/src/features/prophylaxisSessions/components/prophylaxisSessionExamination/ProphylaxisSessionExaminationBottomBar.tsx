/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CancelOutlined,
  KeyboardArrowLeftOutlined,
  KeyboardArrowRightOutlined,
} from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useState } from "react";
import { isDefined } from "remeda";
import { useShallow } from "zustand/react/shallow";

import { ApiReasonForAbsence } from "@eshg/dental-api";
import {
  BottomToolbar,
  ButtonBar,
  OverlayBoundary,
} from "@eshg/lib-employee-portal";

import { ProphylaxisSessionExamination } from "@/features/prophylaxisSessions/api/models/ProphylaxisSessionExamination";
import { ChangeReasonForAbsenceModal } from "@/features/prophylaxisSessions/components/absence/ChangeReasonForAbsenceModal";
import { useProphylaxisSessionStore } from "@/features/prophylaxisSessions/stores/prophylaxisSession/ProphylaxisSessionStoreProvider";
import { useExaminationStore } from "@/stores/examination/ExaminationStoreProvider";
import { selectCanBeMarkedAbsent } from "@/stores/examination/selectors/canBeMarkedAbsent";
import { ExaminationFormValues } from "@/types/examination";

interface ProphylaxisSessionExaminationBottomBarProps {
  onPreviousParticipantClicked?: (submit?: boolean) => void;
  onNextParticipantClicked?: (submit?: boolean) => void;
  onOverviewClicked: (submit?: boolean) => void;
  examination: ProphylaxisSessionExamination;
  examinationFormValues: ExaminationFormValues;
}

export function ProphylaxisSessionExaminationBottomBar(
  props: ProphylaxisSessionExaminationBottomBarProps,
) {
  const {
    onPreviousParticipantClicked,
    onNextParticipantClicked,
    onOverviewClicked,
    examination,
    examinationFormValues,
  } = props;

  const [dialogOpen, setDialogOpen] = useState(false);

  const canBeMarkedAbsent = useExaminationStore(
    useShallow(
      selectCanBeMarkedAbsent(examination.status, examinationFormValues),
    ),
  );
  const setExamination = useProphylaxisSessionStore(
    (state) => state.setExamination,
  );

  function onParticipantAbsentSubmit(reasonForAbsence: ApiReasonForAbsence) {
    setExamination(
      examination.examinationId,
      { type: "absence", reasonForAbsence },
      undefined,
    );
    setDialogOpen(false);
    if (isDefined(onNextParticipantClicked)) {
      onNextParticipantClicked(false);
    } else {
      onOverviewClicked(false);
    }
  }

  return (
    <BottomToolbar>
      <ButtonBar
        left={
          <>
            {isDefined(onPreviousParticipantClicked) && (
              <Button
                startDecorator={<KeyboardArrowLeftOutlined />}
                variant="outlined"
                onClick={() => onPreviousParticipantClicked?.()}
              >
                Vorheriges Kind
              </Button>
            )}
            <Button variant="plain" onClick={() => onOverviewClicked?.()}>
              Zur Übersicht
            </Button>
          </>
        }
        right={
          <>
            {canBeMarkedAbsent ? (
              <Button
                variant="plain"
                color="danger"
                startDecorator={<CancelOutlined />}
                onClick={() => setDialogOpen(true)}
              >
                Kind nicht untersucht
              </Button>
            ) : undefined}
            {isDefined(onNextParticipantClicked) ? (
              <Button
                endDecorator={<KeyboardArrowRightOutlined />}
                onClick={() => onNextParticipantClicked?.()}
              >
                Fertig & nächstes Kind
              </Button>
            ) : (
              <Button
                endDecorator={<KeyboardArrowRightOutlined />}
                onClick={() => onOverviewClicked()}
              >
                Fertig & zur Übersicht
              </Button>
            )}
          </>
        }
      />
      <OverlayBoundary>
        <ChangeReasonForAbsenceModal
          open={dialogOpen}
          onSubmit={onParticipantAbsentSubmit}
          onCancel={() => setDialogOpen(false)}
          examination={examination}
        />
      </OverlayBoundary>
    </BottomToolbar>
  );
}
