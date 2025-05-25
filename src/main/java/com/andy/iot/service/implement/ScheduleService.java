package com.andy.iot.service.implement;

import com.andy.iot.model.DeviceStatusLog;
import com.andy.iot.model.Schedule;
import com.andy.iot.repository.DeviceStatusLogRepository;
import com.andy.iot.repository.ScheduleRepository;
import com.andy.iot.service.DeviceControlService;
import com.andy.iot.service.interf.ScheduleServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class ScheduleService implements ScheduleServiceInterface {
    private final ScheduleRepository scheduleRepo;
    private final DeviceStatusLogRepository logRepo;
    private final DeviceControlService deviceControlService;
    @Override
    public void checkAndControlDevices() {
        LocalDateTime now = LocalDateTime.now();
        System.out.println(now.toLocalTime());
        LocalDate today = now.toLocalDate();
        String day = now.getDayOfWeek().name().toLowerCase();
        System.out.println(day);
        // Reset các schedule bị vô hiệu hóa của ngày trước
        resetDisabledSchedules(today);

        List<Schedule> schedules = scheduleRepo.findActiveSchedules(day, now.toLocalTime());
        System.out.println(schedules);
        for (Schedule schedule : schedules) {
            Integer scheduleId = schedule.getId();
            Integer deviceId = schedule.getDevice().getId();
            String deviceName = schedule.getDevice().getFeedName();

            // Bỏ qua nếu schedule bị vô hiệu hóa
            if (isScheduleDisabled(scheduleId, today)) {
                System.out.println("Vô hiệu hóa rồi");
                System.out.println("Skipping disabled schedule " + scheduleId + " for device " + deviceName);
                continue;
            }

            // Xác định desiredState
            LocalTime nowTime = now.toLocalTime();
            boolean isWithinSchedule = !nowTime.isBefore(schedule.getFrom()) && nowTime.isBefore(schedule.getTo());
            int desiredState = isWithinSchedule ? 1 : 0;

            LocalDateTime threshold = LocalDateTime.of(today, schedule.getFrom());

            // Kiểm tra hành động người dùng gần đây
            List<DeviceStatusLog> recentUserActions = logRepo.findRecentUserActions(deviceId, threshold);
            if (!recentUserActions.isEmpty() && isWithinSchedule) {
                DeviceStatusLog latestAction = recentUserActions.get(0); // Lấy bản ghi mới nhất
                disableSchedule(scheduleId, today);
                continue;
            }

            try {
                System.out.println("Vô đây được rồi");
                int currentState = deviceControlService.getDeviceState(deviceName);
                if (currentState != desiredState) {
                    System.out.println("Sắp toggle");
                    Integer toggled = deviceControlService.toggleDevice(deviceName);
                    String status = desiredState == 1 ? "ON" : "OFF";
                    DeviceStatusLog log = new DeviceStatusLog();
                    log.setDevice(schedule.getDevice());
                    log.setStatus(status);
                    log.setSource("AUTO");
                    logRepo.save(log);
                }
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
//        LocalDateTime now = LocalDateTime.now();
//        String day = now.getDayOfWeek().name().toLowerCase();
//        LocalDateTime threshold = now.minusMinutes(1);
//
//        List<Schedule> schedules = scheduleRepo.findActiveSchedules(day, now.toLocalTime());
//
//        for (Schedule schedule : schedules) {
//            Integer deviceId = schedule.getDevice().getId();
//            String deviceName = schedule.getDevice().getFeedName();
//
//            // Xác định desiredState dựa vào thời gian
//            int desiredState;
//            if (now.toLocalTime().isAfter(schedule.getFrom()) &&
//                    now.toLocalTime().isBefore(schedule.getTo())) {
//                desiredState = 1; // BẬT trong khoảng thời gian
//            } else if (now.toLocalTime().isAfter(schedule.getTo())) {
//                desiredState = 0; // TẮT sau thời gian kết thúc
//            } else {
//                continue; // chưa đến thời điểm bật/tắt
//            }
//
//            Optional<DeviceStatusLog> recentUserAction = logRepo.findRecentUserAction(deviceId, threshold);
//            if (recentUserAction.isPresent()) {
//                continue; // người dùng đã can thiệp gần đây → bỏ qua
//            }
//
//            try {
//                int currentState = deviceControlService.getDeviceState(deviceName);
//                if (currentState != desiredState) {
//                    deviceControlService.toggleDevice(deviceName); // toggle nếu cần
//                    String status = desiredState == 1 ? "ON" : "OFF";
//
//                    DeviceStatusLog log = new DeviceStatusLog();
//                    log.setDevice(schedule.getDevice());
//                    log.setStatus(status);
//                    log.setSource("AUTO");
//                    logRepo.save(log);
//                }
//            } catch (Exception e) {
//                System.err.println("Failed to control device " + deviceName + ": " + e.getMessage());
//            }
//        }
    }

    @Override
    public List<Schedule> getSchedules(Integer deviceId) {
        return scheduleRepo.findByDeviceId(deviceId);
    }

    @Override
    public Schedule createSchedule(Schedule schedule) {
        return scheduleRepo.save(schedule);
    }

    @Override
    public Schedule updateSchedule(Integer id, Schedule newSchedule) {
        Schedule old = scheduleRepo.findById(id).orElseThrow();
        old.setFrom(newSchedule.getFrom());
        old.setTo(newSchedule.getTo());
        old.setMon(newSchedule.isMon());
        old.setTue(newSchedule.isTue());
        old.setWed(newSchedule.isWed());
        old.setThu(newSchedule.isThu());
        old.setFri(newSchedule.isFri());
        old.setSat(newSchedule.isSat());
        old.setSun(newSchedule.isSun());
        return scheduleRepo.save(old);
    }

    @Override
    public void deleteSchedule(Integer id) {
        scheduleRepo.deleteById(id);
    }

    // Map lưu các schedule bị vô hiệu hóa: scheduleId -> ngày vô hiệu hóa
    private final Map<Integer, LocalDate> disabledSchedules = new ConcurrentHashMap<>();

    // Reset các schedule bị vô hiệu hóa của ngày trước đó
    private void resetDisabledSchedules(LocalDate today) {
        disabledSchedules.entrySet().removeIf(entry -> !entry.getValue().equals(today));
    }

    // Kiểm tra xem schedule có bị vô hiệu hóa không
    private boolean isScheduleDisabled(Integer scheduleId, LocalDate today) {
        return disabledSchedules.containsKey(scheduleId) && disabledSchedules.get(scheduleId).equals(today);
    }

    // Vô hiệu hóa schedule trong ngày hiện tại
    private void disableSchedule(Integer scheduleId, LocalDate today) {
        disabledSchedules.put(scheduleId, today);
    }
}
