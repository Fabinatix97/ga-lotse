/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  KeyboardArrowLeftOutlined,
  KeyboardArrowRightOutlined,
} from "@mui/icons-material";
import { Button } from "@mui/joy";
import { isDefined } from "remeda";

import { StickyBottomButtonBar } from "@/lib/shared/components/buttons/StickyBottomButtonBar";

interface ParticipantExaminationBottomBarProps {
  onPreviousParticipantClicked?: () => void;
  onNextParticipantClicked?: () => void;
  onOverviewClicked: () => void;
}

export function ParticipantExaminationBottomBar(
  props: ParticipantExaminationBottomBarProps,
) {
  const {
    onPreviousParticipantClicked,
    onNextParticipantClicked,
    onOverviewClicked,
  } = props;

  return (
    <StickyBottomButtonBar
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
        isDefined(onNextParticipantClicked) ? (
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
        )
      }
    />
  );
}
