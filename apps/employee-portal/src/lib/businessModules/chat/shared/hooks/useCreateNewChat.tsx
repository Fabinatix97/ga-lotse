/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DeviceMap,
  EventType,
  HistoryVisibility,
  IClaimOTKsResult,
  ICreateRoomOpts,
  JoinRule,
  Preset,
  Visibility,
} from "matrix-js-sdk";
import { CryptoApi } from "matrix-js-sdk/lib/crypto-api";
import { KnownMembership } from "matrix-js-sdk/lib/types";
import { useCallback } from "react";

import { getCryptoApi } from "@/lib/businessModules/chat/matrix/crypto";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { useChatSearchParams } from "@/lib/businessModules/chat/shared/hooks/useChatSearchParams";
import {
  findDirectChat,
  getRoomNameAndCommunicationType,
  retryAsyncOperation,
  retryOperation,
} from "@/lib/businessModules/chat/shared/utils";

const MEGOLM_ENCRYPTION_ALGORITHM = "m.megolm.v1.aes-sha2";

export function useCreateNewChat() {
  const { matrixClient } = useChatClientContext();
  const { setRoomIdParam } = useChatSearchParams();

  const findExisingRoom = useCallback(
    (userId: string) => {
      const joinedRooms = matrixClient
        .getRooms()
        .filter(
          (room) => room.getMyMembership() === KnownMembership.Join.toString(),
        );
      const chatRooms = joinedRooms.map((room) =>
        getRoomNameAndCommunicationType(matrixClient, room),
      );

      return findDirectChat({ chatRooms, userId });
    },
    [matrixClient],
  );

  const canEncryptToAllUsers = useCallback(
    async (userIds: string[]) => {
      try {
        const cryptoApi: CryptoApi = getCryptoApi(matrixClient);

        for (const userId of userIds) {
          const userHasCrossSigningKeys =
            await cryptoApi.userHasCrossSigningKeys(userId, true);
          if (!userHasCrossSigningKeys) {
            throw new Error(`User ${userId} has no cross-signing keys`);
          }
        }

        const usersDeviceMap = await cryptoApi.getUserDeviceInfo(userIds, true);
        if (!usersDeviceMap) {
          return false;
        }

        for (const allUserDevices of usersDeviceMap.values()) {
          if (allUserDevices.size === 0) {
            throw new Error(
              "One of users does not have any encryption-capable devices",
            );
          }
          let hasEncryptionKeys = false;

          for (const device of allUserDevices.values()) {
            logger.warn(
              `Checking keys for ${device.userId} device ${device.deviceId}`,
            );
            logger.warn({ device });
            logger.warn(
              `Fingerprint: ${device.getFingerprint()}, IdentityKey: ${device.getIdentityKey()}`,
            );
            if (
              device.getFingerprint() &&
              device.getIdentityKey() &&
              device.keys
            ) {
              //TODO: figure out if any missing key might be causing ** unable to decrypt ** errors
              hasEncryptionKeys = true;
              break;
            }
          }
          if (!hasEncryptionKeys) {
            throw new Error(
              "None of user's devices has encryption capabilities",
            );
          }
        }
      } catch (e) {
        logger.error("Error canEncryptToAllUsers: ", e);
        throw e;
      }
    },
    [matrixClient],
  );

  /**
   * This is our "last resort" method in our journey to debug why the hell some users are not able to decrypt the message.
   *
   * Our reasoning here is that some user's matrixClient did not yet kickstart uploading their one-time keys which are vital for encrypted messaging,
   * and we will check that by simply claiming single one-time key from each participant. If any of them throws us an error
   * then we are 100% sure they will not be able to participate in encrypted conversation and our bug is finally caught.
   *
   * @deprecated This method is deprecated because it *wastes* one-time keys just to make sure there are any.
   * This method should be replaced by some api call that will not waste one-time keys or should not be used at
   * all when we finally understand what is the root cause of our notorious ** Unable to decrypt ** bug.
   */
  const tryToClaimOneTimeKeyFromEachParticipant = useCallback(
    async (userIds: string[]) => {
      try {
        const cryptoApi: CryptoApi = getCryptoApi(matrixClient);
        const usersDeviceMap: DeviceMap = await cryptoApi.getUserDeviceInfo(
          userIds,
          true,
        );
        const devicesToClaim: [string, string][] = [];
        for (const allUserDevices of usersDeviceMap.values()) {
          if (allUserDevices.size === 0) {
            logger.error(
              "One of users does not have any encryption-capable devices",
            );
            return false;
          }
          for (const device of allUserDevices.values()) {
            devicesToClaim.push([device.userId, device.deviceId]);
          }
        }
        const result: IClaimOTKsResult = await matrixClient.claimOneTimeKeys(
          devicesToClaim,
          "signed_curve25519",
          3000,
        );

        logger.warn("tryToClaimOneTimeKeyFromEachParticipant result ", {
          result,
        });
        if (Object.keys(result.failures).length !== 0) {
          throw new Error(JSON.stringify(result.failures));
        }
      } catch (error) {
        logger.error("Failed to claim one-time keys", error);
        throw new Error("Not all users are prepared for encrypted messaging");
      }
    },
    [matrixClient],
  );

  const createRoom = useCallback(
    async (opts: ICreateRoomOpts) => {
      if (!opts.invite || opts.invite.length === 0) {
        throw new Error("Unable to create room, userIds list is empty");
      }

      if (opts.is_direct && opts.invite?.[0]) {
        const dmRoom = findExisingRoom(opts.invite?.[0]);
        if (dmRoom) {
          return dmRoom.room.roomId;
        }
      }

      // await setAllUsersAsVerified(opts.invite); //TODO: when to verify devices? im getting `Error setAllUsersAsVerified Error: Unknown device ` at this stage
      await canEncryptToAllUsers(opts.invite);
      await tryToClaimOneTimeKeyFromEachParticipant(opts.invite);

      const createOpts: ICreateRoomOpts = opts;

      createOpts.preset = opts.is_direct
        ? Preset.TrustedPrivateChat
        : Preset.PrivateChat;

      createOpts.room_version = "10";

      createOpts.visibility = Visibility.Private;

      createOpts.initial_state = [
        {
          type: EventType.RoomHistoryVisibility,
          content: {
            history_visibility: HistoryVisibility.Invited,
          },
        },
        {
          type: EventType.RoomEncryption,
          state_key: "",
          content: {
            algorithm: MEGOLM_ENCRYPTION_ALGORITHM,
          },
        },
        {
          type: EventType.RoomJoinRules,
          content: {
            join_rule: JoinRule.Invite,
          },
        },
      ];

      try {
        const { room_id } = await matrixClient.createRoom(createOpts);
        return room_id;
      } catch (e) {
        throw e;
      }
    },
    [
      canEncryptToAllUsers,
      findExisingRoom,
      matrixClient,
      tryToClaimOneTimeKeyFromEachParticipant,
    ],
  );

  const createNewChat = useCallback(
    async (opts: ICreateRoomOpts) => {
      try {
        const roomId = await createRoom(opts);
        const room = matrixClient.getRoom(roomId);
        if (room) {
          const cryptoApi: CryptoApi = getCryptoApi(matrixClient);

          await retryAsyncOperation(
            () => cryptoApi.isEncryptionEnabledInRoom(room.roomId),
            (isEncryptionEnabledInRoom) => isEncryptionEnabledInRoom,
            30,
            1000,
            true,
            "Failed to create encrypted room.",
          );

          // Here are a few checks added to verify if the local user list is in sync with server user list
          // and to ensure that the users invited to the room will be able to decrypt the messages.
          // (otherwise wrong encryption keys will be sent with the first chat messagge...)
          await room.getEncryptionTargetMembers();
          const membersLoaded = await retryOperation(
            () => room.membersLoaded(),
            (membersLoaded) => membersLoaded,
            30,
            1000,
          );
          if (membersLoaded) {
            setRoomIdParam(room.roomId);
            return room.roomId;
          }
        }
      } catch (error) {
        logger.error("Creating new room failed", error);
      }
    },
    [createRoom, matrixClient, setRoomIdParam],
  );

  return {
    findExisingRoom,
    createNewChat,
  };
}
