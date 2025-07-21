/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.stiprotection.persistence.db.texttemplate.TextTemplate;
import de.eshg.stiprotection.persistence.db.texttemplate.TextTemplateContext;
import de.eshg.stiprotection.persistence.db.texttemplate.TextTemplateRepository;
import de.eshg.stiprotection.persistence.db.texttemplate.TextTemplate_;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
public class TextTemplateService {

  private final TextTemplateRepository textTemplateRepository;

  public TextTemplateService(TextTemplateRepository textTemplateRepository) {
    this.textTemplateRepository = textTemplateRepository;
  }

  public TextTemplate createTextTemplate(TextTemplate entity) {
    return textTemplateRepository.save(entity);
  }

  public TextTemplate getTextTemplate(UUID externalId) {
    return textTemplateRepository
        .findByExternalId(externalId)
        .orElseThrow(
            () ->
                new BadRequestException(
                    "Text template with id: %s does not exist.".formatted(externalId)));
  }

  public void updateTextTemplate(UUID externalId, TextTemplate newEntity) {
    TextTemplate oldEntity = getTextTemplate(externalId);
    oldEntity.setName(newEntity.getName());
    oldEntity.setContext(newEntity.getContext());
    oldEntity.setContent(newEntity.getContent());
  }

  public void deleteTextTemplate(UUID externalId) {
    TextTemplate entity = getTextTemplate(externalId);
    textTemplateRepository.delete(entity);
  }

  public List<TextTemplate> getTextTemplates(Set<TextTemplateContext> contexts) {
    Sort sortByNameAsc = Sort.by(Sort.Direction.ASC, TextTemplate_.NAME);
    if (CollectionUtils.isEmpty(contexts)) {
      return textTemplateRepository.findAll(sortByNameAsc);
    } else {
      return textTemplateRepository.findAll(contextIsIn(contexts), sortByNameAsc);
    }
  }

  private static Specification<TextTemplate> contextIsIn(Set<TextTemplateContext> contexts) {
    return (root, query, criteriaBuilder) -> root.get(TextTemplate_.CONTEXT).in(contexts);
  }
}
