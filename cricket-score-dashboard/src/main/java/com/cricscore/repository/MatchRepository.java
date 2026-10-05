package com.cricscore.repository;

import com.cricscore.entity.Match;
import com.cricscore.entity.enums.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByStatus(MatchStatus status);
    List<Match> findAllByOrderByMatchDateDesc();
}
