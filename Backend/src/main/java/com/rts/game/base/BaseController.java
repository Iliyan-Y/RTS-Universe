package com.rts.game.base;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
