/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.statistic;

import de.eshg.dental.domain.model.ProphylaxisSession;
import de.eshg.dental.domain.model.ProphylaxisSession_;
import de.eshg.dental.domain.repository.ProphylaxisSessionRepository;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.datasource.EntityDataSource;
import de.eshg.lib.statistics.util.TimeRange;
import java.time.Clock;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class DentalProphylaxisSessionDataSource
    extends EntityDataSource<ProphylaxisSession, DentalProphylaxisSessionAttributes> {

  public static final UUID DATA_SOURCE_ID = UUID.fromString("d87a715f-150a-4d68-913a-ce972e43630b");

  public static final String DATA_SOURCE_NAME = "ZAD Prophylaxe";

  private final ProphylaxisSessionRepository prophylaxisSessionRepository;
  private final Clock clock;

  public DentalProphylaxisSessionDataSource(
      ProphylaxisSessionRepository prophylaxisSessionRepository, Clock clock) {
    super(
        DATA_SOURCE_ID,
        DATA_SOURCE_NAME,
        DataSourceSensitivity.SENSITIVE,
        null,
        DentalProphylaxisSessionAttributes.values());
    this.prophylaxisSessionRepository = prophylaxisSessionRepository;
    this.clock = clock;
  }

  @Override
  protected Page<ProphylaxisSession> retrieveEntities(TimeRange timeRange, int page, int pageSize) {
    return prophylaxisSessionRepository.findAll(
        getSpecification(timeRange),
        PageRequest.of(page, pageSize, Sort.by(Sort.Direction.ASC, ProphylaxisSession_.ID)));
  }

  private Specification<ProphylaxisSession> getSpecification(TimeRange timeRange) {
    return (root, query, criteriaBuilder) ->
        isInTimeRange(criteriaBuilder, root.get(ProphylaxisSession_.dateAndTime), timeRange);
  }

  @Override
  protected Object mapSpecificValue(
      ProphylaxisSession prophylaxisSession,
      DentalProphylaxisSessionAttributes attribute,
      TimeRange timeRange) {
    return switch (attribute) {
      case EINRICHTUNG -> prophylaxisSession.getInstitutionId();
      case SCHULJAHR -> getSchoolYear(prophylaxisSession);
      case GRUPPE -> prophylaxisSession.getGroupName();
      case TYP -> prophylaxisSession.getType().name();
      case ANZAHL_KINDER -> prophylaxisSession.getExaminations().size();
      case REIHENUNTERSUCHUNG -> prophylaxisSession.isScreening();
      case FLUORIDIERUNGSLACK -> prophylaxisSession.getFluoridationVarnish();
    };
  }

  private int getSchoolYear(ProphylaxisSession prophylaxisSession) {
    return prophylaxisSession.getDateAndTime().atZone(clock.getZone()).getYear();
  }
}
