package com.andy.iot.service.interf;

import com.andy.iot.model.Schedule;

import java.util.List;

public interface ScheduleServiceInterface {
    void checkAndControlDevices();

    List<Schedule> getSchedules(Integer deviceId);

    Schedule createSchedule(Schedule schedule);

    Schedule updateSchedule(Integer id, Schedule newSchedule);

    void deleteSchedule(Integer id);
}
