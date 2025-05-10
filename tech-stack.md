# 🧱 Airline Ticket Booking System - Tech Stack (Microservices, Java)

This document outlines the complete technology stack used for the Airline Ticket Booking System, designed to handle 3,000 RPS while ensuring high availability, data integrity, and scalability.

---

## ⚙️ Core Technologies

| Purpose               | Technology      |
| --------------------- | --------------- |
| Language              | Java 17         |
| Framework             | Spring Boot 3.x |
| Microservices Toolkit | Spring Cloud    |
| Build Tool            | Gradle          |

---

## 🔀 Service Communication

| Type         | Technology           |
| ------------ | -------------------- |
| Synchronous  | REST + OpenFeign     |
| Asynchronous | Apache Kafka         |
| API Gateway  | Spring Cloud Gateway |

---

## 🔐 Security

| Purpose         | Technology                                   |
| --------------- | -------------------------------------------- |
| Authentication  | Keycloak                                     |
| Token Format    | OAuth2 + JWT                                 |
| Gateway Filters | Spring Gateway Filters (rate limiting, auth) |

---

## 🛢️ Data Storage

| Use Case         | Technology |
| ---------------- | ---------- |
| Relational DB    | PostgreSQL |
| Caching Layer    | Redis      |
| Distributed Lock | Redisson   |

---

## 📦 Messaging & Event Streaming

| Purpose         | Technology     |
| --------------- | -------------- |
| Event Bus       | Apache Kafka   |
| Schema          | JSON           |
| Event Guarantee | Outbox Pattern |

---

## 🧪 Testing & Quality

| Purpose             | Technology     |
| ------------------- | -------------- |
| Unit Testing        | JUnit 5        |
| Mocking             | Mockito        |
| Integration Testing | TestContainers |
| Load Testing        | k6             |

---

## 🛠️ DevOps & Deployment

| Area             | Technology     |
| ---------------- | -------------- |
| Containerization | Docker         |
| Orchestration    | Kubernetes     |
| Package Manager  | Helm           |
| CI/CD            | GitHub Actions |

---

## 📈 Monitoring & Observability

| Purpose               | Technology           |
| --------------------- | -------------------- |
| Monitoring            | Prometheus + Grafana |
| Logging               | Loki + Grafana       |
| Tracing (Distributed) | Jaeger               |
| Health Check          | Spring Boot Actuator |

---

## 📬 Notifications

| Type  | Technology                     |
| ----- | ------------------------------ |
| Email | Mailgun                        |
| SMS   | Twilio                         |
| Push  | Firebase Cloud Messaging (FCM) |

---

## 📁 Configuration & Discovery

| Purpose           | Technology          |
| ----------------- | ------------------- |
| Central Config    | Spring Cloud Config |
| Service Discovery | Eureka              |

---

## 🧭 Summary

This tech stack supports a modular, scalable, and resilient architecture for airline ticket booking. With Spring Cloud’s microservices features, Kafka for eventual consistency, and Kubernetes for deployment, the system is capable of handling high throughput with strong fault tolerance and observability.
