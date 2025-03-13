/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChildExamination } from "@eshg/dental";
import { ApiReasonForAbsence } from "@eshg/dental-api";
import { BottomToolbar } from "@eshg/lib-employee-portal";
import {
  KeyboardArrowLeftOutlined,
  KeyboardArrowRightOutlined,
} from "@mui/icons-material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Button } from "@mui/joy";
import { useState } from "react";
import { isDefined } from "remeda";
import { useShallow } from "zustand/react/shallow";

import { ExaminationFormValues } from "@/lib/businessModules/dental/features/examinations/ExaminationFormLayout";
import { ChangeReasonForAbsenceModal } from "@/lib/businessModules/dental/features/prophylaxisSessions/ChangeReasonForAbsenceModal";
import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { selectCanBeMarkedAbsent } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/selectors/canBeMarkedAbsent";
import { useProphylaxisSessionStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/prophylaxisSessionStore/ProphylaxisSessionStoreProvider";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";

interface ParticipantExaminationBottomBarProps {
  onPreviousParticipantClicked?: () => void;
  onNextParticipantClicked?: () => void;
  onOverviewClicked: () => void;
  examination: ChildExamination;
  examinationFormValues: ExaminationFormValues;
}

export function ParticipantExaminationBottomBar(
  props: ParticipantExaminationBottomBarProps,
) {
  const {
    onPreviousParticipantClicked,
    onNextParticipantClicked,
    onOverviewClicked,
    examination,
    examinationFormValues,
  } = props;

  const [dialogOpen, setDialogOpen] = useState(false);

  const canBeMarkedAbsent = useDentalExaminationStore(
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
    if (isDefined(onNextParticipantClicked)) {
      onNextParticipantClicked();
    } else {
      onOverviewClicked();
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
                onClick={props.onPreviousParticipantClicked}
              >
                Vorheriges Kind
              </Button>
            )}
            <Button variant="plain" onClick={props.onOverviewClicked}>
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
                startDecorator={<CancelOutlinedIcon />}
                onClick={() => setDialogOpen(true)}
              >
                Kind nicht untersucht
              </Button>
            ) : undefined}
            {isDefined(onNextParticipantClicked) ? (
              <Button
                endDecorator={<KeyboardArrowRightOutlined />}
                onClick={onNextParticipantClicked}
              >
                Fertig & nächstes Kind
              </Button>
            ) : (
              <Button
                endDecorator={<KeyboardArrowRightOutlined />}
                onClick={onOverviewClicked}
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
