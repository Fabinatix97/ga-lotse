/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Box, Button, Stack, Switch, Typography } from "@mui/joy";
import { Formik, FormikHelpers } from "formik";
import { EventType } from "matrix-js-sdk/lib/matrix";
import { useEffect, useState } from "react";
import { filter } from "remeda";

import { ChatAvatar } from "@/lib/businessModules/chat/components/ChatAvatar";
import { InfoPanelHeader } from "@/lib/businessModules/chat/components/infoPanel/InfoPanelHeader";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { useRoomInfo } from "@/lib/businessModules/chat/shared/hooks/useRoomInfo";
import { reassignAdminRole } from "@/lib/businessModules/chat/shared/utils";
import { SwitchField } from "@/lib/shared/components/formFields/SwitchField";

type AdminFormValues = Record<string, boolean>;
export interface AssignAdminProps {
  roomId: string;
  onClose: () => void;
  onCancel: () => void;
}

export function AssignAdminView({
  roomId,
  onClose,
  onCancel,
}: Readonly<AssignAdminProps>) {
  const roomInfo = useRoomInfo(roomId);
  const { joinedMembers } = roomInfo;
  const { matrixClient } = useChatClientContext();
  const roomMembers = matrixClient
    .getRoom(roomId)
    ?.getMembers()
    .filter((roomMember) => roomMember.membership === "join");
  const roomMembersMap = roomMembers?.map((item) => ({ [item.userId]: false }));
  const initialFormValues =
    roomMembersMap?.reduce<AdminFormValues>((acc, value) => {
      return { ...acc, ...value };
    }, {}) ?? {};
  const [initialValues, setInitialValues] =
    useState<AdminFormValues>(initialFormValues);
  const snackbar = useSnackbar();
  function isUserTheOnlyAdmin(
    userId: string,
    adminFormValues: Record<string, boolean>,
  ): boolean {
    const admins = Object.keys(adminFormValues).filter(
      (id) => adminFormValues[id],
    );

    return admins.length === 1 && admins[0] === userId;
  }

  const sortedMembers = [
    ...filter(joinedMembers, (x) => x.isRoomCreator),
    ...filter(joinedMembers, (x) => !x.isRoomCreator),
  ];

  useEffect(() => {
    void (async () => {
      const room = matrixClient.getRoom(roomId);
      if (!room) return;
      const roomMembers = room
        .getMembers()
        .filter((roomMember) => roomMember.membership === "join");
      const data = await matrixClient.getStateEvent(
        roomId,
        EventType.RoomPowerLevels,
        "",
      );
      const powerLevels = ("users" in data ? data.users : data) as Record<
        string,
        number
      >;
      const values = roomMembers.reduce<AdminFormValues>((acc, user) => {
        const userPowerLevel = Number(powerLevels?.[user.userId] ?? 0);
        const isAdmin = userPowerLevel === 100;
        return { ...acc, [user.userId]: isAdmin };
      }, {});
      setInitialValues(values);
    })();
  }, [matrixClient, roomId]);

  async function handleSubmit(
    values: AdminFormValues,
    formikHelpers: FormikHelpers<AdminFormValues>,
  ) {
    try {
      const loggedInUserId = matrixClient.getUserId() ?? "";
      if (
        initialValues[loggedInUserId] === true &&
        isUserTheOnlyAdmin(loggedInUserId, initialValues) &&
        values[loggedInUserId] === false
      ) {
        throw new Error(
          "You can't change settings, because you are the only admin in the chat room",
        );
      }
      const users = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, value ? 100 : 0]),
      );
      await reassignAdminRole({ matrixClient, roomId, users });
      onCancel();
    } catch (error) {
      logger.error("Die Berechtigungen konnten nicht geändert werden", error);
      formikHelpers.resetForm({ values: initialValues });
      snackbar.error("Etwas ist schief gelaufen");
    }
  }

  return (
    <>
      <InfoPanelHeader data={roomInfo} close={onClose} />
      <Box sx={{ overflowY: "auto" }}>
        <Stack
          spacing={2}
          sx={{
            padding: 3,
            overflowY: "auto",
          }}
        >
          <Typography level="title-lg">Admins bestimmen</Typography>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            <FormPlus>
              {sortedMembers.map(({ member }) => {
                return (
                  <Stack
                    key={`['${member.userId}']`}
                    direction="row"
                    justifyContent="space-between"
                    marginBottom={2}
                  >
                    <Stack direction="row" alignItems="center" gap={1}>
                      <ChatAvatar
                        avatarUrl={null}
                        userId={member.userId}
                        name={member.name}
                        size="sm"
                      />
                      <Typography level="title-sm">{member.name}</Typography>
                    </Stack>
                    {initialValues[member.userId] ? (
                      <Switch checked={true} size="lg" disabled />
                    ) : (
                      <SwitchField name={`['${member.userId}']`} label="" />
                    )}
                  </Stack>
                );
              })}
              <Stack
                direction="row"
                justifyContent="space-between"
                gap={2}
                marginTop={3}
              >
                <Button
                  type="buttom"
                  variant="soft"
                  onClick={onCancel}
                  fullWidth
                >
                  Abbrechen
                </Button>
                <Button type="submit" fullWidth>
                  Speichern
                </Button>
              </Stack>
            </FormPlus>
          </Formik>
        </Stack>
      </Box>
    </>
  );
}
