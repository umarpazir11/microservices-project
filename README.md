Project Overview
This project is a complete, cloud-native application built from the ground up to demonstrate a modern microservices architecture. It simulates a simple e-commerce backend, handling users and orders through a collection of independent, containerized services.

The entire application is designed to be run and managed by Kubernetes, showcasing a full development-to-deployment workflow using industry-standard tools and practices.

Core Features & Architecture
This application is built using a microservices architecture, where each core business function is handled by a separate, independently deployable service. This design improves scalability, resilience, and maintainability.

The key components are:

API Gateway: A single entry point for all client requests, routing traffic to the appropriate downstream service.

User Service: Manages user data and is backed by a dedicated PostgreSQL database.

Order Service: Handles order creation and communicates with other services asynchronously.

Notification Service: A worker service that listens for events (like a new order) and simulates sending notifications.

Message Broker (RabbitMQ): Decouples the services by handling asynchronous communication, ensuring that services like order creation can complete instantly without waiting for downstream tasks.

Database (PostgreSQL): A dedicated relational database for the User Service, demonstrating persistent data storage.

Technology Stack
Backend: Node.js, Express.js

Containerization: Docker

Orchestration: Kubernetes

Database: PostgreSQL

Messaging: RabbitMQ

Version Control: Git & GitHub (using a feature-branch workflow)