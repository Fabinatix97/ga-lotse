/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.config.envers;

import de.eshg.domain.model.BaseRevisionEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity(name = "revinfo")
@org.hibernate.envers.RevisionEntity(RevisionListenerImpl.class)
@EntityListeners(AuditingEntityListener.class)
@DataSensitivity(SensitivityLevel.PUBLIC)
public class RevisionEntity extends BaseRevisionEntity {

  @Column(nullable = false)
  private String author;

  private String committer;

  private String ip;

  private String resource;

  public String getAuthor() {
    return author;
  }

  public void setAuthor(String author) {
    this.author = author;
  }

  public String getCommitter() {
    return committer;
  }

  public void setCommitter(String committer) {
    this.committer = committer;
  }

  public String getIp() {
    return ip;
  }

  public void setIp(String ip) {
    this.ip = ip;
  }

  public String getResource() {
    return resource;
  }

  public void setResource(String resource) {
    this.resource = resource;
  }
}
