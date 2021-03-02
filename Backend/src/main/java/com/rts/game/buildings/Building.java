package com.rts.game.buildings;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Table(name = "buildings")
public class Building {
  @Id
  @SequenceGenerator(
      name = "buildings_sequence",
      sequenceName = "buildings_sequence",
      allocationSize = 1
  )
  @GeneratedValue(
      strategy = GenerationType.SEQUENCE,
      generator = "buildings_sequence"
  )
  @Column(name = "id")
  private Long id;

  private String type;
  private int level = 0;
  private boolean build = false;
  private LocalDateTime completeTime;

  public Building() {
  }

  public Building(String type) {
    this.type = type;
  }

  public Long getId() {
    return id;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public int getLevel() {
    return level;
  }

  public void setLevel(int level) {
    this.level = level;
  }

  public boolean isBuild() {
    return build;
  }

  public void setBuild(boolean build) {
    this.build = build;
  }

  public LocalDateTime getCompleteTime() {
    return this.completeTime;
  }

  public void setCompleteTime(int minutes) {
    this.completeTime = LocalDateTime.now().plusMinutes(minutes);
  }
}
