const { response } = require('@hapi/hapi/lib/validation');
const { nanoid } = require('nanoid');
const books = require('./books');
const con = require('./database');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const finished = pageCount === readPage ? true : false;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  const sql = `INSERT INTO buku (id, name, year, author, summary, publisher, pageCount,
    readPage, finished, reading, insertedAt, updatedAt) VALUES('${id}', '${name}', '${year}', '${author}',
  '${summary}', '${publisher}', '${pageCount}', '${readPage}', '${finished}', '${reading}', '${insertedAt}',
  '${updatedAt}')`;

  con.query(sql);

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

function getAllBooksFromDatabase() {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM buku', (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
}

const getAllBooksHandler = async (request, h) => {
  const results = await getAllBooksFromDatabase();

  const response = h.response({
    status: 'success',
    data: {
      relawan: results,
    },
  });
  response.code(200);
  return response;
};

function getBookIdFromDatabase(id) {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM buku WHERE id = '${id}'`, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
}

const getBookByIdHandler = async (request, h) => {
  const { bookId } = request.params;

  const results = await getBookIdFromDatabase(bookId);

  if (results.length > 0) {
    const response = h.response({
      status: 'success',
      data: {
        relawan: results,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = async (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const finished = pageCount === readPage ? true : false;
  const updatedAt = new Date().toISOString();

  const cekId = await getBookIdFromDatabase(bookId);

  if (cekId.length === 1) {
    const sql = `UPDATE buku SET name = '${name}', year = '${year}', author = '${author}', summary = '${summary}', 
    publisher = '${publisher}', pageCount = '${pageCount}', readPage = '${readPage}', finished = '${finished}', 
    reading = '${reading}', updatedAt = '${updatedAt}' WHERE id = '${bookId}'`;

    con.query(sql);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

function deleteBookIdFromDatabase(id) {
  return new Promise((resolve, reject) => {
    con.query(`DELETE FROM buku WHERE id = '${id}'`, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
}

const deleteBookByIdHandler = async (request, h) => {
  const { bookId } = request.params;

  const cekId = await getBookIdFromDatabase(bookId);

  if (cekId.length === 1) {
    await deleteBookIdFromDatabase(bookId);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
