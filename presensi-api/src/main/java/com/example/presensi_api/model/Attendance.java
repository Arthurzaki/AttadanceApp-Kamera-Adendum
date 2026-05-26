package com.example.presensi_api.model;// Sesuaikan dengan package kamu

import jakarta.persistence.*;


@Entity
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nim;
    private String nama;
    private String matakuliah;
    private String waktu;
    private String status;
    private String dosen;

    // Getter dan Setter (Wajib dibuat agar data bisa dibaca/tulis)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNim() { return nim; }
    public void setNim(String nim) { this.nim = nim; }
    public String getNama() { return nama; }
    public void setNama(String nama) { this.nama = nama; }
    public String getMatakuliah() { return matakuliah; }
    public void setMatakuliah(String matakuliah) { this.matakuliah = matakuliah; }
    public String getWaktu() { return waktu; }
    public void setWaktu(String waktu) { this.waktu = waktu; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDosen() { return dosen; }
    public void setDosen(String dosen) { this.dosen = dosen; }
}