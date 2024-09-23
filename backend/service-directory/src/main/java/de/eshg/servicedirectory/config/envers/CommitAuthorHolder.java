/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.config.envers;

public class CommitAuthorHolder {

  private static final ThreadLocal<String> author = new ThreadLocal<>();

  private CommitAuthorHolder() {}

  public static String getAuthor() {
    return author.get();
  }

  public static void setAuthor(String newAuthor) {
    author.set(newAuthor);
  }

  public static void clearAuthor() {
    author.remove();
  }
}
