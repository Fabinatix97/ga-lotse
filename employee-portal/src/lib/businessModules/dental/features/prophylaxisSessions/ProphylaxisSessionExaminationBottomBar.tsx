/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { routes } from "@eshg/dental/shared/routes";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import {
  KeyboardArrowLeftOutlined,
  KeyboardArrowRightOutlined,
} from "@mui/icons-material";
import { isDefined } from "remeda";

import { StickyBottomButtonBar } from "@/lib/shared/components/buttons/StickyBottomButtonBar";

interface ProphylaxisSessionExaminationBottomBarProps {
  prophylaxisSessionId: string;
  previousParticipantIndex?: number;
  nextParticipantIndex?: number;
}

export function ProphylaxisSessionExaminationBottomBar(
  props: ProphylaxisSessionExaminationBottomBarProps,
) {
  const {
    prophylaxisSessionId,
    previousParticipantIndex,
    nextParticipantIndex,
  } = props;

  return (
    <StickyBottomButtonBar
      left={
        <>
          {isDefined(previousParticipantIndex) && (
            <InternalLinkButton
              href={routes.prophylaxisSessions
                .byId(prophylaxisSessionId)
                .examinations.byIndex(previousParticipantIndex)}
              startDecorator={<KeyboardArrowLeftOutlined />}
              variant="outlined"
            >
              Vorheriges Kind
            </InternalLinkButton>
          )}
          <InternalLinkButton
            href={routes.prophylaxisSessions.byId(prophylaxisSessionId).details}
            variant="plain"
          >
            Zur Übersicht
          </InternalLinkButton>
        </>
      }
      right={
        isDefined(nextParticipantIndex) ? (
          <InternalLinkButton
            href={routes.prophylaxisSessions
              .byId(prophylaxisSessionId)
              .examinations.byIndex(nextParticipantIndex)}
            endDecorator={<KeyboardArrowRightOutlined />}
          >
            Fertig & nächstes Kind
          </InternalLinkButton>
        ) : (
          <InternalLinkButton
            href={routes.prophylaxisSessions.byId(prophylaxisSessionId).details}
            endDecorator={<KeyboardArrowRightOutlined />}
          >
            Fertig & zur Übersicht
          </InternalLinkButton>
        )
      }
    />
  );
}
