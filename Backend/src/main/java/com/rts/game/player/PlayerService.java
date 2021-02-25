package com.rts.game.player;

import com.rts.game.helpers.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

  public void createPlayer(Player player) {
    checkFields(player.getEmail(), player.getName());
    checkForEmail(player.getEmail());
    playerRepository.save(player);
    System.out.println("Player " + player.getName() + " created !");
  }

  private void checkForEmail(String email) {
    Optional<Player> playerByEmail =
        playerRepository.findByEmail(email);

    if (playerByEmail.isPresent()) {
      throw new IllegalStateException("Email taken");
    }
  }

  private void checkFields(String emailValue, String nameValue) {
    Validator.validateInputString("Email", emailValue);
    Validator.validateInputString("Name", nameValue);
  }
}
