package com.rts.game.player;

import com.rts.game.base.Base;

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

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "base_id", referencedColumnName = "id")
  private Base base;

  private String name;
  private String email;

  public Player() {
  }

  public Player(Base base, String name, String email) {
    this.base = base;
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

  public Base getBase() {
    return base;
  }

  public void setBase(Base base) {
    this.base = base;
  }

  public void updateAllResources(int amount) {
   base.setPower(base.getPower() + amount);
    base.setPopulation(base.getPopulation() + amount);
    base.setStardust(base.getStardust() + amount);
  }
}
