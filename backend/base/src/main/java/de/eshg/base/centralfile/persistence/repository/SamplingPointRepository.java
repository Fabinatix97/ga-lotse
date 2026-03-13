/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence.repository;

import de.eshg.base.centralfile.persistence.entity.DataOrigin;
import de.eshg.base.centralfile.persistence.entity.SamplingPoint;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface SamplingPointRepository
    extends JpaRepository<SamplingPoint, UUID>, JpaSpecificationExecutor<SamplingPoint> {

  default List<SamplingPoint> findReferenceSamplingPointByName(String name) {
    return findByNameAndDataOriginIsNotAndReferenceSamplingPointIsNullOrderByIdAsc(
        name, DataOrigin.EXTERNAL);
  }

  default List<SamplingPoint> findReferenceSamplingPointByNameAndZid(String name, String zid) {
    return findByNameAndZidAndDataOriginIsNotAndReferenceSamplingPointIsNullOrderByIdAsc(
        name, zid, DataOrigin.EXTERNAL);
  }

  Optional<SamplingPoint> findByExternalId(UUID externalId);

  List<SamplingPoint> findByNameAndDataOriginIsNotAndReferenceSamplingPointIsNullOrderByIdAsc(
      String name, DataOrigin excludedDataOrigin);

  List<SamplingPoint> findByNameAndZidAndDataOriginIsNotAndReferenceSamplingPointIsNullOrderByIdAsc(
      String name, String zid, DataOrigin excludedDataOrigin);

  default Optional<SamplingPoint> findFileStateByExternalId(UUID id) {
    return findByExternalIdEqualsAndReferenceSamplingPointIsNotNull(id);
  }

  List<SamplingPoint> findAllByReferenceSamplingPointIdOrderByIdAsc(long referenceSamplingPointId);

  Optional<SamplingPoint> findByExternalIdEqualsAndReferenceSamplingPointIsNotNull(UUID id);

  Optional<SamplingPoint> findByExternalIdEqualsAndReferenceSamplingPointIsNull(UUID id);

  List<SamplingPoint> findAllByExternalIdInAndReferenceSamplingPointIsNotNullOrderByIdAsc(
      Collection<UUID> ids);

  @Query("select f.referenceSamplingPoint from SamplingPoint f where f.externalId = :externalId")
  Optional<SamplingPoint> findReferenceSamplingPointByExternalId(UUID externalId);

  Optional<SamplingPoint> findSamplingPointByExternalIdAndReferenceSamplingPointIsNull(
      UUID externalId);

  List<SamplingPoint>
      findAllByReferenceSamplingPointIsNullAndReferenceFacilityExternalIdAndNameStartsWithIgnoreCaseOrderByIdAsc(
          UUID extFacilityId, String namePrefix);

  List<SamplingPoint> findByReferenceSamplingPointIsNullAndNameStartsWithIgnoreCaseOrderByIdAsc(
      String namePrefix);

  List<SamplingPoint> findByReferenceSamplingPoint_ZidEndsWithOrderByIdAsc(
      @Param("zidFragment") String zidFragment);

  List<SamplingPoint> findAllByReferenceSamplingPoint_ExternalId(UUID fileStateId);

  boolean existsByZid(String zid);
}
