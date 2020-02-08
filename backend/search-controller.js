
const cheerio = require('cheerio')
const request = require('request-promise-native')
const Url = require('./url-model.js');

// Función principal
const search = async (req, res) => {

  const { url: origin, depth } = req.body;

  let matrixUrls = [];
  matrixUrls[0] = await getUrls(origin);

  if (matrixUrls[0].error) return res.status(400).send(matrixUrls[0].error);

  matrixUrls = await getRecursiveUrls(matrixUrls, 0, depth);

  if (matrixUrls.error) return res.status(500).send(matrixUrls.error);

  res.send(matrixUrls);
}

// Función que devuelve todas las url que contiene el html recuperado de la url pasada por parametro
const getUrls = async url => {
  try {
    let foundurls = [];
    // Recuperar html
    const body = await request({ uri: url });
    const $ = cheerio.load(body);
    // Recuperar urls
    $('a').each((i, e) => {
      const url = e.attribs['href']
      const match =
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
          .test(url)

      if (match) { foundurls.push(url); }
    });
    // Eliminar valores repetidos en array
    const uniqueurls = [...new Set(foundurls)];
    return uniqueurls;

  } catch (error) {
    return error;
  }
}

// Función que itera recursivamente sobre la matriz dada una profundidad y el índice actual
const getRecursiveUrls = async (matrixUrls, index, depth) => {
  try {

    if (index < depth) {
      const urls = [];
      for (let i = 0; i < matrixUrls[index].length; i++) {
        // Comprovar si la url existe en la matriz
        const exists = checkIfExistInMatrix(matrixUrls[index][i])
        let foundurls = null;
        if (!exists) {
          foundurls = await getUrls(matrixUrls[index][i]);

        }

        if (Array.isArray(foundurls)) {
          // Guardar en la BD
          saveToDb(foundurls);
          urls.push(...foundurls);
        }

      }

      matrixUrls.push(urls);
      index++;
      await getRecursiveUrls(matrixUrls, index, depth);
    }
    return matrixUrls
  } catch (error) {
    return error
  }
}

// Función para comprovar si el valor actual ya existe en la matriz
const checkIfExistInMatrix = (matrix, matrixIndex, value) => {
  let found = false;
  let i = 0;
  while (!found && i < matrix.length && i !== matrixIndex) {
    found = matrix[i].includes(value);
    i++;
  }
  return found;
}

// Función para guardar en la BD
const saveToDb = (arr) => {

  for (let i = 0; i < arr.length; i++) {
    Url.findOne({ value: arr[i] }, (err, doc) => {
      if (!doc) {
        const url = new Url({
          value: arr[i]
        })
        url.save()
          .then(res => { console.log('url saved') })
          .catch(err => { console.log(err) })
      }
    })
  }
}
module.exports = { search };