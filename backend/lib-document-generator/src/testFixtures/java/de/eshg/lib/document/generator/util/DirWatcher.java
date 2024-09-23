/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.document.generator.util;

import static java.nio.file.StandardWatchEventKinds.ENTRY_CREATE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_DELETE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_MODIFY;
import static java.nio.file.StandardWatchEventKinds.OVERFLOW;

import de.cronn.commons.lang.Action;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DirWatcher {

  private static final Logger log = LoggerFactory.getLogger(DirWatcher.class);

  /**
   * Watch a directory for changes (files in it get created, updated, deleted) and run the given
   * {@code action} on every change.
   *
   * <p>If the action throws an exception it will only be logged, and the method continues.
   *
   * <p>Note: this method goes into an endless loop and returns only if the directory is deleted or
   * gets inaccessible.
   *
   * @param dir the directory to watch for changes
   * @param action the action to run on any change
   */
  public void watchDir(Path dir, Action action) throws IOException {
    try (WatchService watchService = FileSystems.getDefault().newWatchService()) {
      dir.register(watchService, ENTRY_CREATE, ENTRY_DELETE, ENTRY_MODIFY);

      while (true) {
        WatchKey key = getNextWatchKey(watchService);
        if (key == null) return;

        if (hasAnyFileChanges(key)) {
          try {
            action.execute();
          } catch (Exception e) {
            log.error("error running task on change", e);
          }
        }

        boolean valid = key.reset();
        // if the key is no longer valid, the directory is inaccessible so exit the loop
        if (!valid) {
          break;
        }
      }
    }
  }

  private WatchKey getNextWatchKey(WatchService watchService) {
    WatchKey key;
    try {
      key = watchService.take();
    } catch (InterruptedException x) {
      return null;
    }
    return key;
  }

  private boolean hasAnyFileChanges(WatchKey key) {
    boolean changes = false;
    for (WatchEvent<?> event : key.pollEvents()) {
      // ignore OVERFLOW events
      if (event.kind() == OVERFLOW) continue;
      Path file = cast(event).context();
      // ignore backup files, e.g. those created by IntelliJ
      if (isBackupFile(file)) continue;
      log.info("file {} changed", file);
      changes = true;
    }
    return changes;
  }

  private boolean isBackupFile(Path file) {
    String filename = file.getFileName().toString();
    return filename.endsWith("~") || filename.endsWith(".bak") || filename.endsWith(".dup");
  }

  @SuppressWarnings("unchecked")
  private static WatchEvent<Path> cast(WatchEvent<?> event) {
    return (WatchEvent<Path>) event;
  }
}
