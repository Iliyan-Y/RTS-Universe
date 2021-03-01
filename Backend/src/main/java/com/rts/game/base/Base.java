package com.rts.game.base;

import com.rts.game.buildings.Building;
import com.rts.game.player.Player;

import javax.persistence.*;
import java.util.Set;

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

  @OneToMany( cascade = CascadeType.ALL)
  private Set<Building> buildings;

  private String name;
  private int power = 10;
  private int capacity = 10;
  private int stardust = 10;
  private int powerPerHour = 1;
  private int stardustPerHour = 1;

  public Base() {
  }

  public Base(Long id, String name) {
    this.id = id;
    this.name = name;
  }

  public Long getId() {
    return id;
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

  public int getCapacity() {
    return capacity;
  }

  public void setCapacity(int capacity) {
    this.capacity = capacity;
  }

  public int getStardust() {
    return stardust;
  }

  public void setStardust(int stardust) {
    this.stardust = stardust;
  }

  public Set<Building> getBuildings() {
    return buildings;
  }

  public int getPowerPerHour() {
    return powerPerHour;
  }

  public void setPowerPerHour(int powerPerHour) {
    this.powerPerHour = powerPerHour;
  }

  public int getStardustPerHour() {
    return stardustPerHour;
  }

  public void setStardustPerHour(int stardustPerHour) {
    this.stardustPerHour = stardustPerHour;
  }
}
