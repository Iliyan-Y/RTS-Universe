package com.rts.game.base;

import com.rts.game.buildings.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
public class BaseService {
  private final BaseRepository baseRepository;
  private final BuildingService buildingService;

  @Autowired
  public BaseService(BaseRepository baseRepository, BuildingService buildingService) {
    this.baseRepository = baseRepository;
    this.buildingService = buildingService;
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
  public void completeDockyard(Long buildingId) {
    Dockyard dockyard = (Dockyard) buildingService.getBuildingById(buildingId);
    buildingService.completeBuild(dockyard);
  }

  @Transactional
  public void buildHotel(Long baseId) {
    Base base = getBaseById(baseId);
    base.construct(new SpaceHotel(BuildingsType.SPACE_HOTEL));
  }

  @Transactional
  public void completeHotel(Long baseId, Long buildingId) {
    SpaceHotel spaceHotel = (SpaceHotel) buildingService.getBuildingById(buildingId);
    buildingService.completeBuild(spaceHotel);
    Base base = getBaseById(baseId);
    base.setCapacity(base.getCapacity() + spaceHotel.getCapacity());
  }

  @Transactional
  public void buildPit(Long baseId) {
    Base base = getBaseById(baseId);
    base.construct(new StardustPit(BuildingsType.STARDUST_PIT));
  }

  @Transactional
  public void completePit(Long baseId, Long buildingId) {
    StardustPit stardustPit = (StardustPit) buildingService.getBuildingById(buildingId);
    buildingService.completeBuild(stardustPit);
    Base base = getBaseById(baseId);
    base.setStardustPerTime(base.getStardustPerTime() + stardustPit.getProductionPerTime());
  }

  @Transactional
  public void upgradeBuilding(Long baseId, Long buildingId) {
    Base base = getBaseById(baseId);
    Building building = buildingService.getBuildingById(buildingId);
    base.upgradeBuilding(building);
  }

  @Transactional
  public void finishHotelUpgrade(Long baseId, Long buildingId) {
    SpaceHotel spaceHotel = (SpaceHotel) buildingService.completeUpgrade(buildingId);
    Base base = getBaseById(baseId);
    System.out.println("Current " + base.getCapacity());
    base.setCapacity(base.getCapacity() + spaceHotel.getCapacity());
    System.out.println("Updated " + base.getCapacity());
  }

  @Transactional
  public void finishDockyardUpgrade(Long buildingId) {
    buildingService.completeUpgrade(buildingId);
  }

  @Transactional
  public void finishPitUpgrade(Long baseId, Long buildingId) {
    StardustPit stardustPit = (StardustPit) buildingService.completeUpgrade(buildingId);
    Base base = getBaseById(baseId);
    base.setStardustPerTime(base.getStardustPerTime() + stardustPit.getProductionPerTime());
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
