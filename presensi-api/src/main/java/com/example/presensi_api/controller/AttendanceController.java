package com.example.presensi_api.controller; // Tambahkan .presensi_api

import com.example.presensi_api.model.Attendance; // Tambahkan .presensi_api
import com.example.presensi_api.repository.AttendanceRepository; // Tambahkan .presensi_api
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*") // Agar bisa diakses dari perangkat luar (HP)
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    // Endpoint untuk Simpan Absen (POST)
    @PostMapping
    public Attendance saveAttendance(@RequestBody Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    // Endpoint untuk Ambil Riwayat dengan Pagination (GET)
    @GetMapping
    public Page<Attendance> getAllAttendance(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return attendanceRepository.findAll(PageRequest.of(page, size));
    }
}