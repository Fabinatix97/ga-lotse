/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.file;

import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.FileType;
import de.eshg.lib.procedure.domain.model.MailMetaData;
import java.util.ArrayList;
import java.util.List;

class ParsedMail {
  private String fileName;
  private FileType fileType;
  private byte[] content;
  private String subject;
  private String messageText;
  private MailMetaData metaData;
  private boolean deletable;
  private List<File> attachments = new ArrayList<>();
  private int removedInvalidAttachments;

  public String getFileName() {
    return fileName;
  }

  public void setFileName(String fileName) {
    this.fileName = fileName;
  }

  FileType getFileType() {
    return fileType;
  }

  void setFileType(FileType fileType) {
    this.fileType = fileType;
  }

  byte[] getContent() {
    return content;
  }

  void setContent(byte[] content) {
    this.content = content;
  }

  String getSubject() {
    return subject;
  }

  void setSubject(String subject) {
    this.subject = subject;
  }

  String getMessageText() {
    return messageText;
  }

  void setMessageText(String messageText) {
    this.messageText = messageText;
  }

  MailMetaData getMetaData() {
    return metaData;
  }

  void setMetaData(MailMetaData metaData) {
    this.metaData = metaData;
  }

  public boolean isDeletable() {
    return deletable;
  }

  public void setDeletable(boolean deletable) {
    this.deletable = deletable;
  }

  List<File> getAttachments() {
    return attachments;
  }

  int getRemovedInvalidAttachments() {
    return removedInvalidAttachments;
  }

  void setRemovedInvalidAttachments(int removedInvalidAttachments) {
    this.removedInvalidAttachments = removedInvalidAttachments;
  }
}
