package com.rts.game.buildings;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;

@Service
public class BuildingService {
  private final BuildingRepository buildingRepository;


  @Autowired
  public BuildingService(BuildingRepository buildingRepository) {
    this.buildingRepository = buildingRepository;
  }


  public Building getBuildingById(Long buildingId) {
    return buildingRepository.findById(buildingId)
        .orElseThrow(() -> new IllegalStateException("Base does NOT exists"));
  }

  @Transactional
  public void completeBuild(Building building) {
    if (building.getCompleteTime().isAfter(LocalDateTime.now())) {
      throw new IllegalStateException("More time required");
    }
    if (building.isBuild()) {
      throw new IllegalStateException("Build completed");
    }

    building.setBuild(true);
    building.setLevel(building.getLevel() + 1);
  }

}
