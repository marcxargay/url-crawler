# Url Crawler

## Backend (node, express, mongodb, cheerio )

Una vez llega la petición al backend, se comprueba que la url exista.
En caso de que no exista se devuelve un error, si existe se llama a la funcion **getRecursiveUrls**
la cual  dada una profundidad iterará recursivamente para conseguir todas las url ( a través de la función **getUrls**) que contengan las nuevas url hasta llegar a la profundidad deseada.

Durante este proceso se comprobará a través de la función **checkIfExistInMatrix** que la url a visitar no se haya visitado con anterioridad.

Todas las url nuevas recogidas, que no existan ya en la base de datos se guardarán a través de la función **saveToDb**.

## Frontend (vue, boostrap)

### Componentes

**v-search**
Componente principal el cual contiene la barra de búsqueda y la función principal que llama al backend y recupera los datos o en el caso de error, muestra el error pertinente.

**v-list**
Componente que contiene la tabla donde se mostrarán los datos recuperados de backend.

**v-spinner**
Componente spinner para informar al usuario que el proceso esta activo.

**v-error**
Componente para mostrar errores.

