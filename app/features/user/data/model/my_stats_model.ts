import type { MyStats } from '../../domain/entities/my_stats';

export class MyStatsModel implements MyStats {
  readonly user_id: number;
  readonly statistics: MyStats['statistics'];
  readonly events: MyStats['events'];
  readonly events_by_month: MyStats['events_by_month'];

  constructor(stats: MyStats) {
    this.user_id = stats.user_id;
    this.statistics = stats.statistics;
    this.events = stats.events;
    this.events_by_month = stats.events_by_month;
  }

  static fromJson(json: MyStats): MyStatsModel {
    return new MyStatsModel({
      user_id: json.user_id,
      statistics: json.statistics,
      events: json.events,
      events_by_month: json.events_by_month,
    });
  }

  toJson(): MyStats {
    return this.toEntity();
  }

  toEntity(): MyStats {
    return {
      user_id: this.user_id,
      statistics: this.statistics,
      events: this.events,
      events_by_month: this.events_by_month,
    };
  }
}
