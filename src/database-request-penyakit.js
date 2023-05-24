const { con } = require('./database-connection');

function addPenyakit(data) {
  const sql = `INSERT INTO penyakit (id, kodePenyakit, namaPenyakit, detailPenyakit, solusi, gambar, sumberGambar, insertedAt, updatedAt, isDeleted) VALUES ('${data.id}', '${data.kodePenyakit}', '${data.namaPenyakit}', '${data.detailPenyakit}', '${data.detailPenyakit}', '${data.solusi}', '${data.gambar}', '${data.sumberGambar}', '${data.insertedAt}', '${data.updatedAt}', '${data.isDeleted}')`;

  return new Promise((resolve, reject) => {
    con.query(sql, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
}

function getAllPenyakit() {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM penyakit', (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
}

function getPenyakitById(id) {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM penyakit WHERE id = '${id}'`, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
}

function editPenyakit(data) {
  const sql = `UPDATE penyakit SET kodePenyakit = '${data.kodePenyakit}', namaPenyakit = '${data.namaPenyakit}', detailPenyakit = '${data.detailPenyakit}', solusi = '${data.solusi}', gambar = '${data.gambar}', sumberGambar = '${data.sumberGambar}', updatedAt = '${data.updatedAt}' WHERE id = '${data.id}'`;

  return new Promise((resolve, reject) => {
    con.query(sql, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
}

function editPenyakitWithoutImage(data) {
  const sql = `UPDATE penyakit SET kodePenyakit = '${data.kodePenyakit}', namaPenyakit = '${data.namaPenyakit}', detailPenyakit = '${data.detailPenyakit}', solusi = '${data.solusi}', sumberGambar = '${data.sumberGambar}', updatedAt = '${data.updatedAt}' WHERE id = '${data.id}'`;

  return new Promise((resolve, reject) => {
    con.query(sql, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
}

function deletePenyakit(id) {
  const sql = `UPDATE penyakit SET isDeleted = TRUE WHERE id = '${id}'`;

  return new Promise((resolve, reject) => {
    con.query(sql, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
}

module.exports = {
  addPenyakit,
  getAllPenyakit,
  getPenyakitById,
  editPenyakit,
  editPenyakitWithoutImage,
  deletePenyakit,
};
