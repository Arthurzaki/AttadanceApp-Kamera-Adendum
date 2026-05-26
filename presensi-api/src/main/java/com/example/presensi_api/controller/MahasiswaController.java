package com.example.presensi_api.controller;

import com.example.presensi_api.model.Mahasiswa;
import com.example.presensi_api.repository.MahasiswaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/mahasiswa")
@CrossOrigin(origins = "*")
public class MahasiswaController {

    @Autowired
    private MahasiswaRepository repository;

    // GET: Ambil data mahasiswa termasuk foto
    @GetMapping("/{nim}")
    public ResponseEntity<?> getMahasiswa(@PathVariable String nim) {
        return repository.findById(nim)
                .map(mhs -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("nimMhs", mhs.getNimMhs());
                    response.put("namaMhs", mhs.getNamaMhs());

                    if (mhs.getFotoMhs() != null) {
                        String fotoBase64 = Base64.getEncoder().encodeToString(mhs.getFotoMhs());
                        response.put("fotoMhs", fotoBase64);
                    } else {
                        response.put("fotoMhs", null);
                    }

                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // POST: Upload / update foto mahasiswa
    @PostMapping("/upload")
    public ResponseEntity<?> uploadProfile(
            @RequestParam("nim") String nim,
            @RequestParam("nama") String nama,
            @RequestParam("foto") MultipartFile file
    ) throws IOException {

        Mahasiswa mhs = repository.findById(nim).orElse(new Mahasiswa());

        mhs.setNimMhs(nim);
        mhs.setNamaMhs(nama);
        mhs.setFotoMhs(file.getBytes());

        repository.save(mhs);

        return ResponseEntity.ok("Data berhasil diperbarui");
    }
}