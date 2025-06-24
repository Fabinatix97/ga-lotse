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

import { useExaminationStore } from "../../../../stores/examination/ExaminationStoreProvider";
import { selectCanBeMarkedAbsent } from "../../../../stores/examination/selectors/canBeMarkedAbsent";
import { ExaminationFormValues } from "../../../../types/examination";
import { ProphylaxisSessionExamination } from "../../api/models/ProphylaxisSessionExamination";
import { useProphylaxisSessionStore } from "../../stores/prophylaxisSession/ProphylaxisSessionStoreProvider";
import { ChangeReasonForAbsenceModal } from "../absence/ChangeReasonForAbsenceModal";

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
      examination.note,
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
          examination={examination}
          onSubmit={onParticipantAbsentSubmit}
          onCancel={() => setDialogOpen(false)}
        />
      </OverlayBoundary>
    </BottomToolbar>
  );
}
