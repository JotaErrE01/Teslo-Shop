# Nextjs TesloShop App
Para correr localmente se necesista la base de datos
```
docker-compose up -d
```

* El -d, significa __detached__ para que corra en background

## Configurar las variables de entorno
Renombrar el archivo __.env.template__ a __.env__
* Mongo URL Local:
```
MONGO_URL=mongodb://localhost:27017/teslodb
```

* Reconstruir los modulos de node y levantar Next
```
npm install
npm run dev
```

## Llenar la configuracion de la base de datos de pruebas
Llamara:
```
http://localhost:3000/api/seed
```