package com.rts.game.buildings;

import com.rts.game.base.Resources;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping(path = "api/v1/buildings")
public class BuildingController {

  private final BuildingService buildingService;

  public BuildingController(BuildingService buildingService) {
    this.buildingService = buildingService;
  }

  @GetMapping(path = "getCost/{buildingId}")
  public Map<Enum<Resources>, Integer> getCost(@PathVariable("buildingId") Long buildingId) {
      return buildingService.getCost(buildingId);
  }
}
