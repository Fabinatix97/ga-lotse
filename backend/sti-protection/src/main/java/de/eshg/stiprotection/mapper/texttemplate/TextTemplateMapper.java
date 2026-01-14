/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.texttemplate;

import de.eshg.stiprotection.api.texttemplate.CreateTextTemplateRequest;
import de.eshg.stiprotection.api.texttemplate.CreateTextTemplateResponse;
import de.eshg.stiprotection.api.texttemplate.GetTextTemplatesResponse;
import de.eshg.stiprotection.api.texttemplate.TextTemplateContextDto;
import de.eshg.stiprotection.api.texttemplate.TextTemplateDto;
import de.eshg.stiprotection.persistence.db.texttemplate.TextTemplate;
import java.util.List;
import org.springframework.util.CollectionUtils;

public class TextTemplateMapper {

  private TextTemplateMapper() {}

  public static TextTemplate toDatabase(CreateTextTemplateRequest request) {
    if (request == null) {
      throw new IllegalArgumentException("The request to be mapped should not be null.");
    }

    return createTextTemplate(request.name(), request.context(), request.content());
  }

  public static CreateTextTemplateResponse toInterface(TextTemplate entity) {
    if (entity == null) {
      throw new IllegalArgumentException("The entity to be mapped should not be null.");
    }

    return new CreateTextTemplateResponse(entity.getExternalId());
  }

  public static TextTemplateDto toInterfaceType(TextTemplate entity) {
    if (entity == null) {
      throw new IllegalArgumentException("The entity to be mapped should not be null.");
    }

    return new TextTemplateDto(
        entity.getExternalId(),
        entity.getName(),
        TextTemplateContextMapper.toInterfaceType(entity.getContext()),
        entity.getContent());
  }

  public static TextTemplate toDatabaseType(TextTemplateDto dto) {
    if (dto == null) {
      throw new IllegalArgumentException("The dto to be mapped should not be null.");
    }

    return createTextTemplate(dto.name(), dto.context(), dto.content());
  }

  private static TextTemplate createTextTemplate(
      String name, TextTemplateContextDto context, String content) {
    TextTemplate textTemplate = new TextTemplate();
    textTemplate.setName(name);
    textTemplate.setContext(TextTemplateContextMapper.toDatabaseType(context));
    textTemplate.setContent(content);
    return textTemplate;
  }

  public static GetTextTemplatesResponse toInterfaceType(List<TextTemplate> textTemplates) {
    if (CollectionUtils.isEmpty(textTemplates)) {
      return new GetTextTemplatesResponse(List.of());
    }

    return new GetTextTemplatesResponse(
        textTemplates.stream().map(TextTemplateMapper::toInterfaceType).toList());
  }
}
