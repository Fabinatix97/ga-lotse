/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.icd10.persistence.repository;

import de.eshg.base.icd10.persistence.entity.Icd10Code;
import java.util.List;
import java.util.stream.Stream;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface Icd10CodeRepository extends JpaRepository<Icd10Code, String> {
  @Query(
      nativeQuery = true,
      value =
          """

                 select c.code_without_dot as code,
                        c.title            as title,
                        false              as "group"
                 from icd10code c
                 where c.code_without_dot in :codes

                 union all

                 select (g.group_start || '-' || g.group_end) as code,
                         g.title                              as title,
                         true                                 as "group"
                 from icd10group g
                 where g.group_start || '-' || g.group_end in :codes
        """)
  Stream<Icd10SearchResult> findByCode(@Param("codes") List<String> codes);

  @Query(
      nativeQuery = true,
      value =
          """
                select code, "group", title from (
                    select c.code_without_dot as code, false as "group", c.title as title
                    from icd10code c
                    where c.code_without_dot in :codesWithoutDot
                    union
                    select g.group_start || '-' || g.group_end as code, true as "group", g.title as title
                    from icd10group g
                    where (g.group_start || '-' || g.group_end) in :codesWithoutDot
                )
                order by code asc, "group" asc
         """)
  Stream<Icd10SearchResult> findAllCodes(@Param("codesWithoutDot") List<String> codesWithoutDot);

  @Query(
      nativeQuery = true,
      value =
          """

                  select code, "group", title from (select *
                                               from (select group_start || '-' || group_end as code,
                                                            title                           as title,
                                                            true                            as "group",
                                                            greatest(
                                                                    case
                                                                        when starts_with(lower(group_start), lower(:searchString))
                                                                            then similarity(lower(group_start), lower(:searchString))
                                                                        else 0
                                                                        end,
                                                                    case
                                                                        when starts_with(lower(group_end), lower(:searchString))
                                                                            then similarity(lower(group_end), lower(:searchString))
                                                                        else 0
                                                                        end)
                                                                    +
                                                                    (case
                                                                         when length(:searchString) >= 3
                                                                             then similarity(unaccent(title), unaccent(:searchString))
                                                                         else 0
                                                                        end)
                                                                    +
                                                                    (case
                                                                         when length(:searchString) >= 3 and position(unaccent(lower(:searchString)) in unaccent(lower(title))) > 0
                                                                             then 0.1
                                                                         else 0
                                                                         end)
                                                                                            as rank
                                                   from icd10group

                                                   union all

                                                   select code_without_dot as code,
                                                          title            as title,
                                                          false            as "group",
                                                          greatest(
                                                                  case
                                                                      when starts_with(lower(code_without_dot), lower(:searchString))
                                                                          then similarity(lower(code_without_dot), lower(:searchString))
                                                                      else 0
                                                                      end,
                                                                  case
                                                                      when starts_with(lower(code), lower(:searchString))
                                                                          then similarity(lower(code), lower(:searchString))
                                                                      else 0
                                                                      end)
                                                                  +
                                                                  (case
                                                                       when length(:searchString) >= 3
                                                                           then similarity(unaccent(title), unaccent(:searchString))
                                                                       else 0
                                                                      end)
                                                                  +
                                                                  (case
                                                                       when length(:searchString) >= 3 and position(unaccent(lower(:searchString)) in unaccent(lower(title))) > 0
                                                                           then 0.1
                                                                       else 0
                                                                      end)
                                                                           as rank
                                                   from icd10code) as union_icd10_groups_codes
                                             where rank >= 0.1
                                             order by rank desc, code
                                             limit 25
                                            ) as ranked_icd10_result_list
          order by "group" desc, rank desc, code asc""")
  Stream<Icd10SearchResult> fuzzySearch(@Param("searchString") String searchString);

  interface Icd10SearchResult {

    String getCode();

    String getTitle();

    boolean isGroup();
  }
}
