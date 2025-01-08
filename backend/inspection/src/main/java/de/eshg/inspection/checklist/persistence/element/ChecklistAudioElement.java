/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.persistence.element;

import de.eshg.inspection.checklistdefinition.api.ChecklistElementType;
import de.eshg.inspection.checklistdefinition.api.ChecklistElementType.ElementType;
import de.eshg.inspection.common.persistence.MediaFile;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue(value = ElementType.AUDIO)
public class ChecklistAudioElement extends ChecklistElement {
  @OneToMany(
      mappedBy = ChecklistAudio_.CHECKLIST_AUDIO_ELEMENT,
      fetch = FetchType.LAZY,
      cascade = {CascadeType.PERSIST, CascadeType.MERGE},
      orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @OrderBy
  private final List<ChecklistAudio> audios = new ArrayList<>();

  public List<ChecklistAudio> getAudios() {
    return audios;
  }

  @Override
  public ChecklistElementType getType() {
    return ChecklistElementType.AUDIO;
  }

  @Override
  public ChecklistElement getCopy() {
    ChecklistAudioElement copiedElement = new ChecklistAudioElement();
    audios.forEach(
        sourceAudio -> {
          ChecklistAudio copiedAudio = sourceAudio.getCopy();
          copiedAudio.setChecklistAudioElement(copiedElement);
          copiedElement.getAudios().add(copiedAudio);
        });
    return enrichCopy(copiedElement);
  }

  @Override
  public String getValueForKey(String elementKey) {
    return switch (elementKey) {
      case "audios" ->
          audios.stream()
              .map(ChecklistAudio::getAudioFile)
              .filter(MediaFile::isNotDeleted)
              .map(MediaFile::getFileExternalId)
              .toList()
              .toString();
      default -> getCommonValueForKey(elementKey);
    };
  }

  public void addAudio(MediaFile mediaFile) {
    checkIllegalModification();
    ChecklistAudio checklistAudio = new ChecklistAudio();
    checklistAudio.setAudioFile(mediaFile);
    checklistAudio.setChecklistAudioElement(this);
    audios.add(checklistAudio);
  }
}
