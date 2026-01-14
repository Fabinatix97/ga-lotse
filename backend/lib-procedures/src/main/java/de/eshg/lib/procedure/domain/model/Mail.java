/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import static jakarta.persistence.CascadeType.PERSIST;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Mail extends File {
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(
      cascade = PERSIST,
      orphanRemoval = true,
      mappedBy = MailMetaData_.MAIL,
      fetch = FetchType.LAZY,
      optional = false)
  private MailMetaData metaData;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToMany(mappedBy = "attachedToMail", cascade = PERSIST, orphanRemoval = true)
  @OrderBy
  private final List<File> attachments = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private int removedInvalidAttachments;

  @Override
  public MailMetaData getMetaData() {
    return metaData;
  }

  public void addMetaData(MailMetaData metaData) {
    this.metaData = metaData;
    metaData.setMail(this);
  }

  public List<File> getAttachments() {
    return attachments;
  }

  public void addAttachment(File attachment) {
    if (attachment == null) {
      return;
    }

    attachments.add(attachment);
    attachment.setAttachedToMail(this);
  }

  public int getRemovedInvalidAttachments() {
    return removedInvalidAttachments;
  }

  public void setRemovedInvalidAttachments(int removedInvalidAttachments) {
    this.removedInvalidAttachments = removedInvalidAttachments;
  }

  @Override
  public void lockByProgressEntry(boolean lockedByProgressEntry) {
    super.lockByProgressEntry(lockedByProgressEntry);
    this.attachments.forEach(file -> file.lockByProgressEntry(lockedByProgressEntry));
  }

  @Override
  public void lock(boolean locked) {
    super.lock(locked);
    this.attachments.forEach(file -> file.lockByMail(locked));
  }

  @Override
  public void updateDeletable(boolean deletable) {
    super.updateDeletable(deletable);
    this.attachments.forEach(file -> file.updateDeletable(deletable));
  }

  @Override
  public Mail copy() {
    if (getAttachedToMail() != null) {
      return (Mail) copyWithMail();
    }
    Mail copy = new Mail();
    copy(copy);
    copy.metaData = metaData.copy();
    copy.metaData.setMail(copy);
    copy.attachments.addAll(
        attachments.stream()
            .map(
                attachment -> {
                  File attachmentCopy = attachment.copy();
                  attachmentCopy.setAttachedToMail(copy);
                  return attachmentCopy;
                })
            .toList());
    copy.removedInvalidAttachments = removedInvalidAttachments;
    return copy;
  }
}
