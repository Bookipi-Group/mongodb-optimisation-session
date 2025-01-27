# Set up MongoDB 

1. Start the containers:

```
docker-compose up -d
```

2. Access one of the MongoDB containers:

```
docker exec -it mongo1 mongosh 
```

3. Initiate the replica set: In the Mongo shell, run:

```
rs.initiate({
_id: "dbrs",
members: [
{ _id: 0, host: "localhost:27017" },
]
});
```

4. Verify the replica set status:

```
rs.status();
```