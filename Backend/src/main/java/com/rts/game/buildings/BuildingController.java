package com.rts.game.buildings;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/v1/buildings")
public class BuildingController {

  private final BuildingService buildingService;

  public BuildingController(BuildingService buildingService) {
    this.buildingService = buildingService;
  }

  @GetMapping(path = "complete/{buildingId}")
  public void completeBuilding(@PathVariable("buildingId") Long buildingId) {
    buildingService.completeBuild(buildingId);
  }
}
