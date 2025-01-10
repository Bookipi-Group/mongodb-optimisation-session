# Pre-requisites
to start, please run the following command:
```docker compose up```

mongodb is running on port 27017

please have a look at the performance of the following scenarios

# test1
```yarn test1```

in sample_restaurants.restaurants, it lists the restaurants with their names and cuisines provided. Alice wants to have the list of restaurants serving American/Chinese/Pizza/Italian cuisine in dictionary order of the names. Help Alice to get the list of restaurants serving American/Chinese/Pizza/Italian cuisines, please help her with that.
here is the query used:
```
db.restaurants.find({
    cuisine: {$in: ["American", "Chinese", "Pizza", "Italian"]}
}).sort({ cuisine: 1, name: 1 })
```
Please help her improve the performance of the query.

## Baseline Performance(1000 executions)

### before index:
lean mongoose object took 148210ms

normal mongoose object took 205651ms


### after normal index:
lean mongoose object took 137307ms

normal mongoose object took 196226ms


### after hashed index:
lean mongoose object took 126853ms

normal mongoose object took 187190ms


### after partial index:
lean mongoose object took 124768ms

normal mongoose object took 179129ms


# test 2
```yarn test2```

Bob is the data analyst in a financial company, 
he wants to know the number of users who have an account with over-10000(inclusive) limit, 
please help him with that.

here are the indexes created:
```
db.customers.createIndex({
    accounts: 1,
  });
db.accounts.createIndex({
   account_id: 1,
  });
db.accounts.createIndex({
   limit: 1,
   account_id: 1,
  });
```

query1:
```
db.customers.aggregate([
    {
      $lookup: {
        from: "accounts",
        localField: "accounts",
        foreignField: "account_id",
        as: "account",
      },
    },
    {
      $match: {
        "account.limit": { $gte: 10000 },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
      },
    },
  ])
```

query2:
```
db.accounts.aggregate([
     {
      $match: {
        limit: { $gte: 10000 },
      },
    },
    {
      $lookup: {
        from: "customers",
        localField: "account_id",
        foreignField: "accounts",
        as: "customer",
      },
    },
    {
      $group: {
        _id: { $first: "$customer._id" },
        name: { $first: { $first: "$customer.name" } },
      },
    },
  ])
```


query3:(add $unwind stage to query2) 
```
db.accounts.aggregate([
    {
      $match: {
        limit: { $gte: 10000 },
      },
    },
    {
      $lookup: {
        from: "customers",
        localField: "account_id",
        foreignField: "accounts",
        as: "customer",
      },
    },
    {
      $unwind: "$customer",
    },
    {
      $group: {
        _id: "$customer._id",
        name: { $first: "$customer.name" },
      },
    },
  ])
```
