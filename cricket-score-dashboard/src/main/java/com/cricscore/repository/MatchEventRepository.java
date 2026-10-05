package com.cricscore.repository;

import com.cricscore.entity.MatchEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchEventRepository extends JpaRepository<MatchEvent, Long> {
    List<MatchEvent> findByInningsIdOrderByTimestampAsc(Long inningsId);
    List<MatchEvent> findByInningsIdOrderByTimestampDesc(Long inningsId);
    List<MatchEvent> findByInningsMatchIdOrderByTimestampAsc(Long matchId);
    List<MatchEvent> findByInningsMatchIdOrderByTimestampDesc(Long matchId);
}
