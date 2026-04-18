# 🗺️ Intracom Master Roadmap (From MVP to Enterprise)

This is the exact, step-by-step roadmap to achieve the architecture goals. It is designed so you can pick off tasks one by one without getting overwhelmed.

---

## 🏗️ Phase 1: The "Lean & Mean" Architecture
*Target: Speed to market, low infra cost, proving the concept.*

### 1. The Embeddable Widget (Status: In Progress/Done)
- [x] **Initialize Widget:** Setup Preact + TS + Vite (Library Mode).
- [x] **State Management:** Implement Zustand for lightweight state (`useWidgetStore`).
- [x] **Isolation:** Create `loader.tsx` to render the widget inside a Shadow DOM to protect CSS.
- [x] **Real-Time Integration:** Add `socket.io-client` so the widget can talk to the NestJS backend.
- [x] **Publish:** Deploy `widget.js` to Cloudflare Pages (CDN).

### 2. The Backend Core (Monolith)
- [x] **Init Server:** Create a NestJS application (`npx @nestjs/cli new backend`).
- [x] **Database Setup:** Install Prisma and connect it to PostgreSQL.
- [x] **Schema Design:** Create `User`, `Conversation`, and `Message` tables in `schema.prisma` (Use `JSONB` for flexible data like custom user attributes).
- [x] **REST APIs:** Build basic CRUD endpoints for users and conversations.
- [x] **WebSockets Gateway:** Install `@nestjs/platform-socket.io` and create `ChatGateway` to handle real-time `sendMessage` events.

### 3. The Admin Dashboard
- [x] **Init Web App:** Setup Next.js (App Router) + Tailwind CSS.
- [x] **UI Integration:** Import and configure your internal `frontend-library` package.
- [x] **Dashboard Layout:** Build the Chat Interface, User List, and Settings pages.
- [x] **Real-Time Integration:** Use `socket.io-client` in a global React Context to listen for incoming messages from the NestJS Gateway.
- [ ] **Analytics:** Implement `Recharts` for visualizing active conversations and load times.

### 4. Caching & Background Jobs
- [x] **Cache Server:** Spin up a fast Redis instance (via Docker locally or upstash.com).
- [x] **Pub/Sub Adapter:** Configure NestJS Socket.IO to use the Redis adapter (crucial if you run multiple node instances later).
- [ ] **Job Queue:** Install `BullMQ` to handle async tasks (like sending "New Message" email notifications so the main thread doesn't lag).

### 5. Phase 1 DevOps Pipeline
- [ ] **Containerization:** Write a `Dockerfile` for the NestJS Backend.
- [ ] **Deploy Backend:** Push the container to AWS ECS (Fargate), Render, or Railway.
- [ ] **Deploy Dashboard:** Connect the Next.js repo to Vercel or AWS Amplify for zero-ops deployment.

---

## 🚀 Phase 2: The "Scale Up" Architecture
*Target: Handling growing traffic, segregating heavy workloads.*

### 1. Offloading the Database
- [ ] **Log Migration:** As the `Message` table crosses millions of rows in Postgres, spin up **MongoDB or Elasticsearch**.
- [ ] **Fuzzy Search:** Move the chat history text searching over to Elasticsearch to keep Postgres fast.

### 2. Emerging Microservices
- [ ] **Extract Workers:** Take the heavy background jobs (like sending marketing email sequences) out of the NestJS monolith.
- [ ] **Async Messaging:** Implement **AWS SQS / SNS** to route events reliably from the main API to these new isolated microservices.

---

## 🏢 Phase 3: The "Intercom Level" Architecture
*Target: Massive concurrency, high availability across regions.*

### 1. Cloud Native Infrastructure
- [ ] **Kubernetes Migration:** Move from ECS/Render into AWS **EKS (Kubernetes)**. Write Helm charts to manage dozens of microservice nodes granularly.
- [ ] **Event Streaming:** Replace AWS SQS with **Apache Kafka** to handle insane throughput of analytics events (e.g. "User hovered over button").

### 2. Advanced Software Patterns
- [ ] **CQRS Implementation:** Separate Read/Write concerns entirely. (e.g., Dashboard heavily reads from a materialized view, while the Widget heavily writes to a different database node).
- [ ] **Observability:** Deploy Prometheus + Grafana to monitor CPU/Memory across pods, and the ELK stack (Elasticsearch, Logstash, Kibana) or Datadog for tracing requests through the microservices.
