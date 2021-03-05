package com.rts.game.base;

import com.rts.game.buildings.BuildingsType;
import com.rts.game.buildings.Dockyard;
import com.rts.game.buildings.SpaceHotel;
import com.rts.game.buildings.StardustPit;
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
  public void buildDockyard(Long baseId) {
    Base base = getBaseById(baseId);
    base.construct(new Dockyard(BuildingsType.DOCKYARD));
  }

  @Transactional
  public void buildHotel(Long baseId) {
    Base base = getBaseById(baseId);
    base.construct(new SpaceHotel(BuildingsType.SPACE_HOTEL));
  }

  @Transactional
  public void buildPit(Long baseId) {
    Base base = getBaseById(baseId);
    base.construct(new StardustPit(BuildingsType.STARDUST_PIT));
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
