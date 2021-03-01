package com.rts.game.player;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/player")
public class PlayerController {
  private final PlayerService playerService;

  public PlayerController(PlayerService playerService) {
    this.playerService = playerService;
  }

  @GetMapping
  public List<Player> getAllPlayers () {
   return playerService.getAllPlayers();
  }

  @PostMapping
  public void createPlayer(@RequestBody Player player) {
      playerService.createPlayer(player);
  }

  // Example
//  @PostMapping(path = "/more")
//  public void postPlay(@RequestBody Map<String, Object> params) {
//    System.out.println(params.get("name"));
//  }
}
