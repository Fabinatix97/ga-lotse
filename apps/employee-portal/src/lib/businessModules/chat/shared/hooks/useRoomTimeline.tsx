/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Direction,
  EventStatus,
  IContent,
  MatrixEvent,
  MatrixEventEvent,
  Room,
  RoomEvent,
  TimelineWindow,
} from "matrix-js-sdk";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { uniqueBy } from "remeda";
import { validate as isUUID, v4 as uuidv4 } from "uuid";

import { useMessageTeaser } from "@/lib/businessModules/chat/components/messageTeaser/MessageTeaserProvider";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import {
  ClientState,
  Membership,
  MessageTypeEnum,
} from "@/lib/businessModules/chat/shared/enums";
import { routes } from "@/lib/businessModules/chat/shared/routes";
import {
  ChatSystemMessage,
  Message,
  RoomWithCommunicationType,
} from "@/lib/businessModules/chat/shared/types";
import {
  getReadReceipts,
  getRoomNameAndCommunicationType,
  isMembershipChanged,
  shouldShowMessageTeaser,
  sortMessages,
} from "@/lib/businessModules/chat/shared/utils";

const messagesLimit = 20;

export function useRoomTimeline(roomId: string) {
  const [messages, setMessages] = useState<(Message | ChatSystemMessage)[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const { matrixClient, clientState } = useChatClientContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const currentRoom = matrixClient.getRoom(roomId);
  const loggedInUserId = useMemo(
    () => matrixClient.getUserId(),
    [matrixClient],
  );
  const room = useRef<RoomWithCommunicationType | null>(null);
  if (room?.current === null && currentRoom) {
    room.current = getRoomNameAndCommunicationType(matrixClient, currentRoom);
  }
  const showMessageTeaser = useMessageTeaser();
  const timelineWindow = useRef<TimelineWindow | null>(null);
  if (timelineWindow.current === null && room.current) {
    timelineWindow.current = new TimelineWindow(
      matrixClient,
      room.current.room.getUnfilteredTimelineSet(),
    );
  }

  const hasInitialData = useRef(false);

  const getMembership = useCallback(
    (event: MatrixEvent) => {
      const eventContent = event.getContent();
      if (eventContent.membership === Membership.Leave) {
        const sender = event.getSender();
        const stateKey = event.getStateKey();
        if (sender !== stateKey) {
          return Membership.Remove;
        }
        if (event.sender === matrixClient.getUserId()) {
          return Membership.SelfLeave;
        }
      }
      return eventContent.membership as Membership;
    },
    [matrixClient],
  );

  const getDisplayName = useCallback(
    (eventContent: IContent, sender?: string) => {
      if (
        eventContent.membership === Membership.Join &&
        isUUID(eventContent.displayname) &&
        sender &&
        currentRoom
      ) {
        return currentRoom.getMember(sender)?.name;
      }
      return eventContent.displayname;
    },
    [currentRoom],
  );

  const onTimelineEvent = useCallback(
    async (event: MatrixEvent, room: Room | undefined) => {
      if (event.isEncrypted()) {
        await matrixClient.decryptEventIfNeeded(event);
      }
      const eventType = event.getType();
      const sender = event.getSender();
      const roomId = room?.roomId;
      const timestamp = event.getDate();
      const associatedId = event.getAssociatedId();
      const replacingEvent = event.replacingEvent();
      if (replacingEvent?.isEncrypted()) {
        await matrixClient.decryptEventIfNeeded(replacingEvent);
      }
      const replacingEventContent = replacingEvent?.getContent();

      const currentEventContent = event.getContent();
      const eventContent = replacingEventContent ?? currentEventContent;

      if (!roomId) return;

      const newMessage = {
        id: event.getId() ?? uuidv4(),
        timestamp: event.getDate(),
        type: event.getType(),
      };

      switch (eventType) {
        case "m.room.message":
        case "m.room.encrypted": {
          const temporaryId = event.getId();
          const senderUser = sender ? matrixClient.getUser(sender) : null;
          // add listener only if it's message sent by logged-in user, and it is recent message, not historical one
          const hasRecentTimestamp =
            (timestamp?.getTime() ? timestamp?.getTime() + 5000 : 0) >=
            new Date().getTime();
          if (hasRecentTimestamp && senderUser?.userId === loggedInUserId) {
            event.on(MatrixEventEvent.Status, (eventEvent, status) => {
              void (async () => {
                if (!room) return;
                if (eventEvent.isEncrypted()) {
                  await matrixClient.decryptEventIfNeeded(eventEvent);
                }
                const eventContent = eventEvent.getContent();
                const isDecrypted = eventContent?.msgtype === "m.bad.encrypted";

                if (status === EventStatus.SENT) {
                  const updatedMessage = {
                    ...newMessage,
                    id: eventEvent.getId() ?? uuidv4(),
                    sender: senderUser,
                    content: eventContent.body as string,
                    roomId,
                    mentions: eventContent["m.mentions"]?.user_ids,
                    messageType: MessageTypeEnum.ChatMessage,
                    sent: true,
                    removed: !!event.isRedacted(),
                    decrypted: isDecrypted,
                  };
                  setMessages((prevState) => {
                    return prevState.map((message) =>
                      message.id === temporaryId
                        ? { ...updatedMessage, sent: true }
                        : message,
                    );
                  });
                }
              })();
            });
          }
          const guestCount = room
            .getMembers()
            .filter((member) => member.userId !== loggedInUserId).length;

          if (
            senderUser?.displayName &&
            shouldShowMessageTeaser({
              sender: senderUser,
              loggedInUser: loggedInUserId,
              timestamp: event.getDate(),
            })
          ) {
            showMessageTeaser({
              title: room.name,
              text: (guestCount > 1
                ? `${senderUser.displayName}: ${eventContent.body}`
                : eventContent.body) as string,
              link: routes.chatRoom(roomId),
              userPresence:
                guestCount > 1 ? "" : senderUser.presence.toString(),
            });
          }
          const isDecrypted = eventContent?.msgtype === "m.bad.encrypted";

          return {
            message: {
              ...newMessage,
              sender: senderUser,
              content: eventContent.body as string,
              roomId: room?.roomId,
              mentions: eventContent["m.mentions"]?.user_ids,
              messageType: MessageTypeEnum.ChatMessage,
              sent: event.getSender() !== loggedInUserId,
              removed: !!event.isRedacted(),
              decrypted: isDecrypted,
              edited: !!replacingEvent,
            },
            associatedId,
          };
        }
        case "m.room.redaction": {
          const messageId = (eventContent.redacts ??
            event.event.redacts) as string;
          return { removed: messageId };
        }
        case "m.room.member": {
          const membershipChanged = isMembershipChanged(event);
          if (!membershipChanged) return;

          const membership = getMembership(event);
          const senderUser = sender ? room?.getMember(sender) : undefined;
          return {
            message: {
              ...newMessage,
              membership,
              userName: getDisplayName(eventContent, sender),
              avatarUrl: eventContent.avatar_url,
              sender: senderUser?.name ?? sender,
              messageType: MessageTypeEnum.SystemMessage,
            },
          };
        }
        case "m.room.name": {
          return {
            message: {
              ...newMessage,
              roomName: eventContent.name as string,
              messageType: MessageTypeEnum.SystemMessage,
            },
          };
        }
        case "m.room.create": {
          const senderUser = sender ? room?.getMember(sender) : undefined;
          const creator =
            typeof eventContent.creator === "string"
              ? eventContent.creator
              : "";

          return {
            message: {
              ...newMessage,
              creator: sender === creator ? senderUser?.name : creator,
              messageType: MessageTypeEnum.SystemMessage,
            },
          };
        }
        case "m.room.power_levels": {
          const adminName =
            typeof eventContent.creator === "string" &&
            matrixClient.getUser(eventContent.creator || "");
          const newAdminIds = Object.entries(
            (eventContent.users ?? {}) as Record<string, number>,
          )
            ?.filter(([_, powerLevel]) => powerLevel === 100)
            ?.map(([userId]) => userId);
          const newAdmins = newAdminIds
            ?.map((newAdminId) => room?.getMember(newAdminId)?.rawDisplayName)
            .filter((item) => !!item) as string[];

          return {
            message: {
              ...newMessage,
              admin: newAdmins ?? [adminName],
              messageType: MessageTypeEnum.SystemMessage,
            },
          };
        }
        case "m.room.avatar": {
          return {
            message: {
              ...newMessage,
              userName: getDisplayName(eventContent, sender),
              avatarUrl: eventContent.avatar_url,
              messageType: MessageTypeEnum.SystemMessage,
            },
          };
        }
        default: {
          return {};
        }
      }
    },
    [
      getDisplayName,
      getMembership,
      loggedInUserId,
      matrixClient,
      showMessageTeaser,
    ],
  );

  const handleTimelineEvent = useCallback(
    async (event: MatrixEvent, room: Room | undefined) => {
      const newTimelineData = await onTimelineEvent(event, room);
      const roomId = room?.roomId;
      if (!roomId) return;
      const removedMessage = newTimelineData?.removed;
      if (removedMessage) {
        setMessages((prevState) => {
          return prevState.map((currMessage) =>
            currMessage.id === removedMessage
              ? {
                  ...currMessage,
                  content: "Nachricht gelöscht",
                  removed: true,
                }
              : currMessage,
          );
        });
      }
      if (newTimelineData?.associatedId) {
        setMessages((prevState) => {
          return prevState.map((currMessage) =>
            currMessage.id === newTimelineData.associatedId
              ? {
                  ...currMessage,
                  content: newTimelineData.message.content,
                  mentions: newTimelineData.message.mentions,
                  edited: true,
                }
              : currMessage,
          );
        });
        return;
      }
      const updatedMessage = newTimelineData?.message;
      if (updatedMessage) {
        setMessages((prevState) => {
          return sortMessages([...prevState, newTimelineData.message]);
        });
      }
    },
    [onTimelineEvent],
  );

  // listen to new messages
  useEffect(() => {
    function onRoomTimeline(
      event: MatrixEvent,
      room: Room | undefined,
      _: boolean | undefined,
    ) {
      if (clientState !== ClientState.Ready) return;
      if (room?.roomId !== roomId) return;
      void handleTimelineEvent(event, room);
    }

    matrixClient.on(RoomEvent.Timeline, onRoomTimeline);

    return () => {
      matrixClient.removeListener(RoomEvent.Timeline, onRoomTimeline);
    };
  }, [handleTimelineEvent, matrixClient, roomId, clientState]);

  const fetchRoomMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      if (!timelineWindow.current) return;
      if (!room.current) return;
      const lastRoomEvent = room.current.room.getLastLiveEvent();
      await timelineWindow.current.load(lastRoomEvent?.getId(), messagesLimit); // load the initial events (required step)
      const events = timelineWindow.current.getEvents();
      const removedMessages: string[] = [];
      const newRoomMessages = await Promise.all(
        events.map(async (event: MatrixEvent) => {
          if (!room.current) return;
          const isRead = getReadReceipts(
            event,
            room.current.room,
            loggedInUserId,
          );

          const timelineData = await onTimelineEvent(event, room.current.room);
          if (timelineData?.removed) {
            removedMessages.push(timelineData.removed);
          }

          const associatedId = event.getAssociatedId();
          if (associatedId) {
            return;
          }

          if (!timelineData?.message) return;
          return { ...timelineData.message, isRead, sent: true };
        }),
      );

      const filteredMessages = newRoomMessages.filter(
        (message) => !!message?.id,
      ) as (Message | ChatSystemMessage)[];
      const messagesWithRemoved = filteredMessages.map((msg) => {
        const wasRemoved = removedMessages.find((id) => id === msg.id);
        if (wasRemoved) {
          return { ...msg, content: "Nachricht gelöscht", removed: true };
        } else {
          return msg;
        }
      });
      setHasNextPage(timelineWindow.current.canPaginate(Direction.Backward));
      setMessages((prevState) => {
        return sortMessages([...prevState, ...messagesWithRemoved]);
      });
      setIsLoading(false);
      setError(false);
    } catch {
      setIsLoading(false);
      setError(true);
    }
  }, [loggedInUserId, onTimelineEvent]);

  const paginateMessages = useCallback(async () => {
    try {
      if (!room.current) return;
      if (!timelineWindow.current) return;
      const canPaginate = timelineWindow.current.canPaginate(
        Direction.Backward,
      );
      if (!canPaginate) return;
      setIsLoading(true);
      const moreMessages = await timelineWindow.current.paginate(
        Direction.Backward,
        messagesLimit,
      );
      if (moreMessages) {
        // there are more messages, lets remove the previous page's events
        timelineWindow.current.unpaginate(messagesLimit, !Direction.Backward);
      }
      setHasNextPage(timelineWindow.current.canPaginate(Direction.Backward));
      const removedMessages: string[] = [];
      const events = timelineWindow.current.getEvents();
      const newMessages = await Promise.all(
        events.map(async (event: MatrixEvent) => {
          const replacingEvent = event.replacingEvent();
          const associatedId = event.getAssociatedId();
          if (associatedId) return;
          const timelineData = await onTimelineEvent(
            event || replacingEvent,
            room.current?.room,
          );
          if (timelineData?.removed) {
            removedMessages.push(timelineData.removed);
            return;
          }
          if (!timelineData?.message) return;
          return { ...timelineData.message, sent: true };
        }),
      );
      const correctNewMessages = newMessages.filter(
        (message) => !!message?.id,
      ) as (Message | ChatSystemMessage)[];
      // handle removed messages
      const messagesWithRemoved = correctNewMessages.map((msg) => {
        const wasRemoved = removedMessages.find((id) => id === msg.id);
        if (wasRemoved) {
          return { ...msg, content: "Nachricht gelöscht", removed: true };
        } else {
          return msg;
        }
      });

      setMessages((prevState) => {
        const msgWithRemoved = [...prevState, ...messagesWithRemoved].map(
          (msg) => {
            const wasRemoved = removedMessages.find((id) => id === msg.id);
            if (wasRemoved) {
              return { ...msg, content: "Nachricht gelöscht", removed: true };
            } else {
              return msg;
            }
          },
        );
        return sortMessages(uniqueBy(msgWithRemoved, (msg) => msg.id));
      });
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  }, [onTimelineEvent, room]);

  useEffect(() => {
    void (async () => {
      if (hasInitialData.current) return;
      hasInitialData.current = true;
      await fetchRoomMessages();
    })();
  }, [fetchRoomMessages]);

  return {
    fetchRoomMessages,
    room,
    messages: messages || [],
    paginateMessages,
    hasNextPage,
    isLoading,
    error,
  };
}
