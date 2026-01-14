/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.persistence.element;

import de.eshg.domain.model.BaseEntity;
import de.eshg.inspection.common.persistence.MediaFile;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
@Table(indexes = @Index(columnList = "checklist_audio_element_id"))
public class ChecklistAudio extends BaseEntity {

  @ManyToOne(optional = false)
  @JoinColumn(name = "checklist_audio_element_id")
  private ChecklistAudioElement checklistAudioElement;

  @OneToOne(
      cascade = {CascadeType.PERSIST},
      orphanRemoval = true)
  @NotNull
  private MediaFile audioFile;

  public ChecklistAudio getCopy() {
    ChecklistAudio copiedElement = new ChecklistAudio();
    copiedElement.setAudioFile(audioFile.getCopy());
    return copiedElement;
  }

  public void setAudioFile(@NotNull MediaFile audioFile) {
    this.audioFile = audioFile;
  }

  public ChecklistAudioElement getChecklistAudioElement() {
    return checklistAudioElement;
  }

  public void setChecklistAudioElement(ChecklistAudioElement checklistAudioElement) {
    this.checklistAudioElement = checklistAudioElement;
  }

  public @NotNull MediaFile getAudioFile() {
    return audioFile;
  }
}
