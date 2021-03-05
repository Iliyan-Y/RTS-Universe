package com.rts.game.base;

import org.springframework.web.bind.annotation.*;

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
  public void buildDockyard(@PathVariable("baseId") Long baseId) {
    baseService.buildDockyard(baseId);
  }

  @GetMapping(path = "{baseId}/build/hotel")
  public void buildHotel(@PathVariable("baseId") Long baseId) {
    baseService.buildHotel(baseId);
  }

  @GetMapping(path = "{baseId}/build/pit")
  public void buildPit(@PathVariable("baseId") Long baseId) {
    baseService.buildPit(baseId);
  }

}
