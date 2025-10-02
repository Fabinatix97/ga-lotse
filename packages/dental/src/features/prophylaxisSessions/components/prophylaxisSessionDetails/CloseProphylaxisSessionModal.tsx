/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { KeyboardArrowRightOutlined } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { BaseModal, BaseModalPropsRequiredClose } from "@eshg/lib-portal";

import { useCloseProphylaxisSession } from "../../api/mutations/details";
import { useProphylaxisSessionStore } from "../../stores/prophylaxisSession/ProphylaxisSessionStoreProvider";

export function CloseProphylaxisSessionModal(
  props: Omit<BaseModalPropsRequiredClose, "children" | "modalTitle">,
) {
  const prophylaxisSessionId = useProphylaxisSessionStore((state) => state.id);
  const prophylaxisSessionVersion = useProphylaxisSessionStore(
    (state) => state.version,
  );
  const institutionName = useProphylaxisSessionStore(
    (state) => state.institution.name,
  );
  const groupName = useProphylaxisSessionStore((state) => state.groupName);
  const allParticipants = useProphylaxisSessionStore(
    (state) => state.participants,
  );
  const closedParticipants = allParticipants.filter(
    (participant) => participant.status === "CLOSED",
  ).length;
  const absentParticipants = allParticipants.filter(
    (participant) => participant.status === "NOT_PRESENT",
  ).length;

  const { mutate: closeProphylaxisSession } =
    useCloseProphylaxisSession(prophylaxisSessionId);

  function handleCloseProphylaxisSession() {
    closeProphylaxisSession(prophylaxisSessionVersion, {
      onSuccess: () => props.onClose(),
    });
  }

  function getParticipantText(numberOfChildren: number) {
    return `${numberOfChildren} ${numberOfChildren === 1 ? "Kind" : "Kinder"}`;
  }

  return (
    <BaseModal modalTitle="Untersuchung abschließen?" {...props}>
      <Typography level="body-md" marginBottom={1}>
        Zusammenfassung der Untersuchung in der Einrichtung {institutionName}
        {isDefined(groupName) && ` Gruppe ${groupName}`}:
      </Typography>
      <Typography fontWeight={600}>
        {getParticipantText(closedParticipants)} untersucht
      </Typography>
      <Typography fontWeight={600}>
        {getParticipantText(absentParticipants)} nicht untersucht
      </Typography>
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="flex-end"
      >
        <Button variant="outlined" color="neutral" onClick={props.onClose}>
          Abbrechen
        </Button>
        <Button
          color="primary"
          endDecorator={<KeyboardArrowRightOutlined />}
          onClick={handleCloseProphylaxisSession}
        >
          Ja, abschließen
        </Button>
      </Stack>
    </BaseModal>
  );
}
