package com.rts.game.player;


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

  public List<Player> getAllPlayers()
  {
    Player player = playerRepository.findById(1L)
        .orElseThrow(() -> new IllegalStateException("Player does NOT exists"));
    player.getBase().build("TOwn", 0);
    System.out.println(player.getBase().getBuildings());
    return playerRepository.findAll();
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
