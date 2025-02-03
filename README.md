# Receipt Processor

## Description
A simple receipt processing application that calculates points based on receipt details. This application is fully Dockerized and can be run directly using a pre-built Docker image from Docker Hub.

## Prerequisites
Before you begin, ensure you have the following installed:
- [Docker](https://www.docker.com/get-started)

## Getting Started

### Running the Docker Container

You can run the application directly from Docker Hub by pulling the pre-built image.

1. **Pull the Docker image**:
   ```bash
   docker pull sanjanvadi/my-repo:v1
   ```
2. **Run the Docker container with port mapping:**
   ```bash
   docker run -d -p 8080:3000 sanjanvadi/my-repo:v1
   ```
3. **Access the Application:**
   Once the container is running, your application will be accessible at:

   http://localhost:8080
   
## Interacting with the API

### **Submit a Receipt for Processing**
  Make a POST request to /receipts/process with the required JSON payload. For example, you can use curl:
  ```bash
  curl -X POST http://localhost:8080/receipts/process \
     -H "Content-Type: application/json" \
     -d '{
           "retailer": "M&M Corner Market",
           "purchaseDate": "2022-01-01",
           "purchaseTime": "13:01",
           "items": [
             { "shortDescription": "Mountain Dew 12PK", "price": "6.49" }
           ],
           "total": "6.49"
         }'
  ```

### **Retrieve Points for a Receipt**
  Make a GET request to /receipts/{id}/points where {id} is the receipt ID returned from the previous request. For example:
  ```bash
  curl http://localhost:8080/receipts/adb6b560-0eef-42bc-9d16-df48f30e89b2/points
  ```

### **Retrieve all Receipt Ids with points**
  Make a GET request to /receipts/ For example:
  ```bash
  curl http://localhost:8080/receipts/
  ```
