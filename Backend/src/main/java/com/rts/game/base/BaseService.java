package com.rts.game.base;

import com.rts.game.player.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BaseService {
  private final BaseRepository baseRepository;

  @Autowired
  public BaseService(BaseRepository baseRepository) {
    this.baseRepository = baseRepository;
  }

  public Base getBaseById(Long baseId) {
    Base base = baseRepository.findById(baseId)
        .orElseThrow(() -> new IllegalStateException("Base does NOT exists"));
    return base;
  }
}
