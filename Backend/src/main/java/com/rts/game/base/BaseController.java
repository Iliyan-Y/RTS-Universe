package com.rts.game.base;

import com.rts.game.buildings.Dockyard;
import com.rts.game.buildings.SpaceHotel;
import com.rts.game.buildings.StardustPit;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping(path = "api/v1/base")
public class BaseController {

  private final BaseService baseService;

  public BaseController(BaseService baseService) {
    this.baseService = baseService;
  }

  @GetMapping(path = "{baseId}")
  public Base getBaseById(@PathVariable("baseId") Long baseId) {
      return baseService.getBaseById(baseId);
  }

  @GetMapping(path = "{baseId}/build/dockyard")
  public Dockyard buildDockyard(@PathVariable("baseId") Long baseId) {
    return baseService.buildDockyard(baseId);
  }

  @PostMapping(path = "complete/dockyard")
  public void completeDockyard(@RequestBody Map<String, Long > params) {
    baseService.completeDockyard(params.get("buildingId"));
  }

  @GetMapping(path = "{baseId}/build/hotel")
  public SpaceHotel buildHotel(@PathVariable("baseId") Long baseId) {
    return baseService.buildHotel(baseId);
  }

  @PostMapping(path = "complete/hotel")
  public void completeHotel(@RequestBody Map<String, Long > params) {
    baseService.completeHotel(params.get("baseId"), params.get("buildingId"));
  }

  @GetMapping(path = "{baseId}/build/pit")
  public StardustPit buildPit(@PathVariable("baseId") Long baseId) {
    return baseService.buildPit(baseId);
  }

  @PostMapping(path = "complete/pit")
  public void completePit(@RequestBody Map<String, Long > params) {
    baseService.completePit(params.get("baseId"), params.get("buildingId"));
  }

  @PostMapping(path = "upgradeBuilding")
  public Map<String, LocalDateTime> upgradeBuilding(@RequestBody Map<String, Long > params) {
   return Map.of( "completeTime", baseService.upgradeBuilding(params.get(
       "baseId"),
        params.get(
       "buildingId")));
  }

  @PostMapping(path = "finishHotelUpgrade")
  public void finishHotelUpgrade(@RequestBody Map<String, Long > params) {
    baseService.finishHotelUpgrade(params.get("baseId"), params.get("buildingId"));
  }

  @PostMapping(path = "finishDockyardUpgrade")
  public void finishDockyardUpgrade(@RequestBody Map<String, Long > params) {
    baseService.finishDockyardUpgrade( params.get("buildingId"));
  }

  @PostMapping(path = "finishPitUpgrade")
  public void finishPitUpgrade(@RequestBody Map<String, Long > params) {
    baseService.finishPitUpgrade(params.get("baseId"), params.get("buildingId"));
  }

  @GetMapping(path = "{baseId}/upgrade")
  public Base upgradeBase(@PathVariable("baseId") Long baseId) {
     return baseService.upgrade(baseId);
  }

  @GetMapping(path = "{baseId}/completeUpgrade")
  public void completeUpgrade(@PathVariable("baseId") Long baseId) {
    baseService.completeUpgrade(baseId);
  }

  @GetMapping(path = "{baseId}/getCost")
  public Map<Enum<Resources>, Integer> getBaseCost(@PathVariable("baseId")
                                                   Long baseId) {
    return baseService.getBaseCost(baseId);
  }

}
