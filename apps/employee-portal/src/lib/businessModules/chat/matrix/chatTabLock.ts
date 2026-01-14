/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { v4 as uuidv4 } from "uuid";

import { logger } from "@/lib/businessModules/chat/shared/helpers";

/**
 * TabLockManager ensures that chat client can be active in only one tab at once.
 *
 * Reason to do this is to prevent corrupting indexedDB crypto store by multiple
 * instances of matrixClients overwriting encryption keys inside it.
 */
const TAB_LOCK_CONSTANTS = {
  CHAT_LOCK_HEARTBEAT: "mx_chat_lock_heartbeat",
  MOST_RECENT_CHAT_TAB_ID: "mx_most_recent_chat_tab_id",
  TAB_LOCK_TIMEOUT_MS: 30000,
};

/**
 * Check if tab lock is not taken by chat in another tab.
 */
export function checkIfTabLockIsFree(): boolean {
  const lastHeartbeatTime = window.localStorage.getItem(
    TAB_LOCK_CONSTANTS.CHAT_LOCK_HEARTBEAT,
  );
  if (!lastHeartbeatTime) {
    logger.info(
      "TabLockManager lock check: No existing Lock heartbeat found — Lock is free to claim.",
    );
    return true;
  }

  const timeSinceLastHeartbeat = Date.now() - parseInt(lastHeartbeatTime);
  if (timeSinceLastHeartbeat > TAB_LOCK_CONSTANTS.TAB_LOCK_TIMEOUT_MS) {
    logger.info(
      `TabLockManager lock check: Lock is stale (${timeSinceLastHeartbeat}ms since last heartbeat) — Lock is free to claim.`,
    );
    return true;
  }

  logger.info(
    `TabLockManager lock check: Lock is currently held by other tab — last heartbeat was ${timeSinceLastHeartbeat}ms ago.`,
  );
  return false;
}

/**
 * Forces current tab lock to be released for another tab.
 *
 * MOST_RECENT_CHAT_TAB_ID holds information in secret storage which tab is currently requesting to claim the lock.
 * CHAT_LOCK_HEARTBEAT is being maintained by current tab that claimed the lock.
 *
 * @param `onLockTakenByAnotherTab` callback to be called by current tab lock owner when he loses the lock:
 * - stop the chat and display information to the user that the chat is opened in another tab.
 */
export async function claimTabLock(
  onLockTakenByAnotherTab: () => Promise<void>,
): Promise<boolean> {
  const currentTabId = uuidv4();

  let heartbeatIntervalId: number | null = null;

  /**
   * Check when current tab lock heartbeat will stop or already stopped.
   */
  function checkCurrentLockHeartbeat(): number {
    const latestTabIdRequestingTheLock = window.localStorage.getItem(
      TAB_LOCK_CONSTANTS.MOST_RECENT_CHAT_TAB_ID,
    );

    if (latestTabIdRequestingTheLock !== currentTabId) {
      logger.warn(
        `TabLockManager heartbeat check: Lock was claimed by more recent tab "${latestTabIdRequestingTheLock}" while we were waiting — aborting claiming.`,
      );
      return -1;
    }

    const lastHeartbeat = window.localStorage.getItem(
      TAB_LOCK_CONSTANTS.CHAT_LOCK_HEARTBEAT,
    );

    if (lastHeartbeat === null) {
      logger.info(
        "TabLockManager heartbeat check:  No existing Lock heartbeat found — claiming the Lock.",
      );
      return 0;
    }

    const timeSinceLastHeartbeat = Date.now() - parseInt(lastHeartbeat);
    const timeUntilTimeout =
      TAB_LOCK_CONSTANTS.TAB_LOCK_TIMEOUT_MS - timeSinceLastHeartbeat;

    if (timeUntilTimeout <= 0) {
      logger.info(
        `TabLockManager heartbeat check: Lock is stale (${timeSinceLastHeartbeat}ms since last heartbeat) — claiming the Lock.`,
      );
      return 0;
    }

    logger.info(
      `TabLockManager heartbeat check: Current tab lock heartbeat is still active ${timeSinceLastHeartbeat}ms ago — waiting ${timeUntilTimeout}ms for another check.`,
    );
    return timeUntilTimeout;
  }

  function onTabLockClaimEvent(event: StorageEvent): void {
    if (event.key === TAB_LOCK_CONSTANTS.MOST_RECENT_CHAT_TAB_ID) {
      const claimingTabId = window.localStorage.getItem(
        TAB_LOCK_CONSTANTS.MOST_RECENT_CHAT_TAB_ID,
      );
      if (claimingTabId === currentTabId) {
        return; // Avoid releasing lock if the claim came from our tab by some accident
      }
      logger.info(`TabLockManager: Tab ${claimingTabId} is claiming the lock`);
      window.removeEventListener("storage", onTabLockClaimEvent);
      releaseTabLock().catch((err) => {
        logger.error("Failed to release lock", err);
      });
    }
  }

  function onPagehideEvent(): void {
    if (heartbeatIntervalId !== null) {
      stopHeartbeat(heartbeatIntervalId);
      heartbeatIntervalId = null;
    }
  }

  async function releaseTabLock(): Promise<void> {
    await onLockTakenByAnotherTab();
    if (heartbeatIntervalId !== null) {
      stopHeartbeat(heartbeatIntervalId);
      heartbeatIntervalId = null;
    }
  }

  function requestTabLock() {
    window.localStorage.setItem(
      TAB_LOCK_CONSTANTS.MOST_RECENT_CHAT_TAB_ID,
      currentTabId,
    );
  }

  async function waitUntilCurrentTabReleasesLock(msUntilTimeout: number) {
    // someone else has the lock.
    // wait for either the heartbeat to expire, or a onStorageUpdate event.
    let onStorageUpdate: (event: StorageEvent) => void;

    const storageUpdatePromise = new Promise((resolve) => {
      onStorageUpdate = (event: StorageEvent) => {
        if (
          event.key === TAB_LOCK_CONSTANTS.CHAT_LOCK_HEARTBEAT ||
          event.key === TAB_LOCK_CONSTANTS.MOST_RECENT_CHAT_TAB_ID
        )
          resolve(event);
      };
    });

    const sleepPromise = new Promise((resolve) => {
      setTimeout(resolve, msUntilTimeout, undefined);
    });

    window.addEventListener("storage", onStorageUpdate!);
    await Promise.race([sleepPromise, storageUpdatePromise]);
    window.removeEventListener("storage", onStorageUpdate!);
  }

  // Wait for the lock is free to claim.
  requestTabLock();
  while (true) {
    const msUntilTimeout = checkCurrentLockHeartbeat();
    if (msUntilTimeout === 0) {
      // Lock is free to be claimed
      break;
    } else if (msUntilTimeout < 0) {
      // Lock was claimed by more recent tab while we were waiting — aborting claiming.
      await onLockTakenByAnotherTab();
      return false;
    }
    await waitUntilCurrentTabReleasesLock(msUntilTimeout);
  }
  // At this point, the lock is free — we can claim it here by starting updating the heartbeat by ourselves.
  updateHeartbeat();
  heartbeatIntervalId = window.setInterval(updateHeartbeat, 1000);
  // Start listening for other tabs attempting to claim the lock.
  window.addEventListener("storage", onTabLockClaimEvent);
  // Clear our lock claims when our app window (tab) is closed.
  window.addEventListener("pagehide", onPagehideEvent);

  return true;
}

function updateHeartbeat(): void {
  window.localStorage.setItem(
    TAB_LOCK_CONSTANTS.CHAT_LOCK_HEARTBEAT,
    Date.now().toString(),
  );
}

function stopHeartbeat(intervalId: number): void {
  window.clearInterval(intervalId);
  window.localStorage.removeItem(TAB_LOCK_CONSTANTS.CHAT_LOCK_HEARTBEAT);
}
