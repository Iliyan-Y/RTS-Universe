package com.rts.game.player;


import com.rts.game.base.BaseManager;
import com.rts.game.buildings.Building;
import com.rts.game.buildings.Dockyard;
import com.rts.game.buildings.StardustMine;
import com.rts.game.helpers.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class PlayerService {
  private final PlayerRepository playerRepository;


  @Autowired
  public PlayerService(PlayerRepository playerRepository) {
    this.playerRepository = playerRepository;
  }

  public List<Player> getAllPlayers() {
    return playerRepository.findAll();
  }

  @Transactional
  public void test() {
    Player player = playerRepository.findById(1L)
        .orElseThrow(() -> new IllegalStateException("Player does NOT exists"));
   player.getBase().getBuildings().add(new Building("dock"));
   player.getBase().buildMine();

    StardustMine mine = (StardustMine) player.getBase().getBuildings().stream()
        .filter(object -> object.getType().equals("Mine v1"))
        .findFirst().get();
    mine.setLevel(12);
    mine.topUpStardust(player.getBase());
    System.out.println(mine.info);
    BaseManager.buildDockyard(player.getBase());

    Dockyard dockyard = (Dockyard) player.getBase().getBuildings().stream()
        .filter(object -> object.getType().equals("doker one"))
        .findFirst().get();
    dockyard.buildBattleship();
    dockyard.buildBattleship();
    System.out.println(dockyard.getShips());
    System.out.println(player.getBase().getBuildings());
  }

  public void createPlayer(Player player) {
    validateNewUser(player.getEmail(), player.getName(), player.getBase().getName());
    playerRepository.save(player);
    System.out.println("Player " + player.getName() + " created !");
  }

  @Scheduled(fixedRate = 2 * 60 * 1000)
  @Transactional
  public void updateResources() {
    List<Player> players = playerRepository.findAll();
    if (!players.isEmpty()) {
      for (Player currentPlayer : players) {
       currentPlayer.updateAllResources(1);
      }
    }
  }

  private void checkForEmail(String email) {
    Optional<Player> playerByEmail =
        playerRepository.findByEmail(email);
    if (playerByEmail.isPresent()) {
      throw new IllegalStateException("Email taken");
    }
  }


  private void validateNewUser(String emailValue, String nameValue,
                               String baseName) {
    Validator.validateInputString("Email", emailValue);
    Validator.validateInputString("Name", nameValue);
    Validator.validateInputString("Base Name", baseName);
    checkForEmail(emailValue);
  }
}
