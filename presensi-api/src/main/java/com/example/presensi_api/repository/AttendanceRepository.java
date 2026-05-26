package com.example.presensi_api.repository;

import com.example.presensi_api.model.Attendance; // Tambahkan .presensi_api di sini
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendanceRepository extends PagingAndSortingRepository<Attendance, Long>, CrudRepository<Attendance, Long> {
}