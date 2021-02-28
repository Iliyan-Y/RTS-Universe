package com.rts.game.base;

import com.rts.game.player.Player;

import javax.persistence.*;
@Entity
@Table(name = "base")
public class Base {
  @Id
  @SequenceGenerator(
      name = "base_sequence",
      sequenceName = "base_sequence",
      allocationSize = 1
  )
  @GeneratedValue(
      strategy = GenerationType.SEQUENCE,
      generator = "base_sequence"
  )
  @Column(name = "id")
  private Long id;

  @OneToOne(mappedBy = "base")
  private Player player;

  private String name;
  private int power = 10;
  private int population = 10;
  private int stardust = 10;

  public Base() {
  }

  public Base(Long id, String name) {
    this.id = id;
    this.name = name;
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

  public int getPower() {
    return power;
  }

  public void setPower(int power) {
    this.power = power;
  }

  public int getPopulation() {
    return population;
  }

  public void setPopulation(int population) {
    this.population = population;
  }

  public int getStardust() {
    return stardust;
  }

  public void setStardust(int stardust) {
    this.stardust = stardust;
  }
}
