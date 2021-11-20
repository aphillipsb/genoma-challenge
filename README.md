# genoma-challenge

La aplicación consta de una API escrita en Python, utilizando el _framework_ FastAPI.
El desarrollo de la API fue fuertemente basado en el [tutorial](https://fastapi.tiangolo.com/tutorial/) de la documentación oficial de FastAPI, en especial la [sección](https://fastapi.tiangolo.com/tutorial/sql-databases/) de bases de datos relacionales.

Para correr el servidor, desde la raíz del proyecto se debe ejecutar los siguientes comandos (es prerrequisito tener instalado `pipenv`, se puede instalar con `pip install pipenv`):

```cd backend```

```pipenv install```

```pipenv run uvicorn main:app```


El _frontend_ es una aplicación web desarrollada utilizando React, con la librería de diseño Bootstrap, además de Reactstrap para las ventanas modales. El desarrollo de las funcionalidades de CRUD se basó en [este ejemplo](https://github.com/Borja95/crudHooks/blob/master/src/App.js) y la funcionalidad de ordenar las columnas se basó en [este tutorial](https://www.smashingmagazine.com/2020/03/sortable-tables-react/).

Para correr la aplicación, se debe ejecutar lo siguiente desde el directorio raíz del proyecto:

```cd frontend```

```npm install```

```npm start```