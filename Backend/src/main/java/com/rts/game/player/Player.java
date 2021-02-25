package com.rts.game.player;

import javax.persistence.*;

@Entity
@Table(name = "players")
public class Player {
  @Id
  @SequenceGenerator(
      name = "player_sequence",
      sequenceName = "player_sequence",
      allocationSize = 1
  )
  @GeneratedValue(
      strategy = GenerationType.SEQUENCE,
      generator = "player_sequence"
  )
  @Column(name = "id")
  private Long id;

  private String name;
  private String email;


  public Player() {
  }

  public Player(String name, String email) {
    this.name = name;
    this.email = email;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }
}
