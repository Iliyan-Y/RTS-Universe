package com.rts.game.base;

import com.rts.game.buildings.Building;
import com.rts.game.buildings.Dockyard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class BaseService {
  private final BaseRepository baseRepository;

  @Autowired
  public BaseService(BaseRepository baseRepository) {
    this.baseRepository = baseRepository;
  }

  public Base getBaseById(Long baseId) {
    Base base = baseRepository.findById(baseId)
        .orElseThrow(() -> new IllegalStateException("Base does NOT exists"));
    return base;
  }

  @Transactional
  public void test() {
    Base base = getBaseById(1L);
    completeBuild(base, BaseManager.buildDockyard(base));
  }

  @Transactional
  public void completeBuild(Base base, Building building) {

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
