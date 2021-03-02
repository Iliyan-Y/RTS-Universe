package com.rts.game.base;

import com.rts.game.buildings.Building;
import com.rts.game.buildings.BuildingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
public class BaseService {
  private final BaseRepository baseRepository;


  @Autowired
  public BaseService(BaseRepository baseRepository) {
    this.baseRepository = baseRepository;
  }

  public Base getBaseById(Long baseId) {
    return baseRepository.findById(baseId)
        .orElseThrow(() -> new IllegalStateException("Base does NOT exists"));
  }

  @Transactional
  public void buildDockyard() {
    Base base = getBaseById(1L);
    BaseManager.buildDockyard(base);
  }

  @Scheduled(fixedRate = 2 * 60 * 1000) // min * sec * millis
  @Transactional
  public void timeResourceUpdate() {
    List<Base> allBases = baseRepository.findAll();
    if (!allBases.isEmpty()) {
      for (Base currentBase : allBases) {
        currentBase.timeResourceUpdate();
      }
    }
  }
}
