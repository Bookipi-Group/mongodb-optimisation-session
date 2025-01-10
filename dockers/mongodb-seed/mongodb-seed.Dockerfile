FROM mongo:latest
WORKDIR /app/testData
RUN apt-get update -y && \
    apt-get install -y curl && \
    curl https://atlas-education.s3.amazonaws.com/sampledata.archive -o sampledata.archive
CMD mongorestore --uri=mongodb://mongo-db:27017 --archive=sampledata.archive