# OmiseBiz Backend

The robust API powering the OmiseBiz platform. Written in TypeScript, it handles data consistency, media uploads, and business logic for restaurant management.

## 🌟 Overview

This backend service provides a secure RESTful API for managing users, restaurants, and media assets. It is built to be scalable and type-safe, using Prisma ORM for database interactions.

## 🚀 Key Capabilities (MVP)

- **Authentication & Security**:
  - JWT-based authentication (Access & Refresh tokens).
  - Secure password hashing.
  - Role-based route protection.
- **Restaurant API**:
  - Full CRUD operations for restaurants.
  - Slug-based public retrieval.
  - Complex nested data handling (Hours, Attributes, Menu).
- **Media Service**:
  - Secure image upload handling.
  - Integration with Object Storage (S3/R2).
- **Public API**:
  - Optimized endpoints for public page generation.
  - Filtering and search capabilities.

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Documentation**: Swagger UI

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL Database URL
- AWS S3 or Cloudflare R2 credentials (for uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd omisebiz-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file based on `.env.example`:
   ```env
   DATABASE_URL="postgresql://..."
   JWT_SECRET="your-secret"
   FRONTEND_URL="http://localhost:3000"
   # Storage credentials...
   ```

4. **Database Setup**
   ```bash
   npm run db:migrate
   ```

5. **Run Server**
   ```bash
   npm run dev
   ```

The server will start on port **4000** by default. API Documentation is available at `/api-docs`.

---

# OmiseBiz バックエンド

OmiseBizプラットフォームを支える堅牢なAPIです。TypeScriptで記述されており、データの整合性、メディアのアップロード、レストラン管理のビジネスロジックを処理します。

## 🌟 概要

このバックエンドサービスは、ユーザー、レストラン、メディア資産を管理するための安全なRESTful APIを提供します。データベース操作にPrisma ORMを使用し、スケーラブルかつ型安全に構築されています。

## 🚀 主な機能 (MVP)

- **認証とセキュリティ**:
  - JWTベースの認証（アクセス＆リフレッシュトークン）。
  - 安全なパスワードハッシュ化。
  - ロールベースのルート保護。
- **レストランAPI**:
  - レストランの完全なCRUD操作（作成、読み取り、更新、削除）。
  - スラグ（slug）ベースの公開データ取得。
  - 複雑なネストデータ（営業時間、属性、メニュー）の処理。
- **メディアサービス**:
  - 安全な画像アップロード処理。
  - オブジェクトストレージ（S3/R2）との統合。
- **公開API**:
  - 公開ページ生成用に最適化されたエンドポイント。
  - フィルタリングと検索機能。

## 🛠 技術スタック

- **ランタイム**: Node.js
- **フレームワーク**: Express.js
- **言語**: TypeScript
- **データベース**: PostgreSQL
- **ORM**: Prisma
- **バリデーション**: Zod
- **ドキュメント**: Swagger UI

## 🚦 始め方

### 前提条件
- Node.js 18以上
- PostgreSQL データベースURL
- AWS S3 または Cloudflare R2 の認証情報（アップロード用）

### インストール

1. **リポジトリのクローン**
   ```bash
   git clone <repo-url>
   cd omisebiz-backend
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **環境設定**
   `.env.example` を元に `.env` ファイルを作成します:
   ```env
   DATABASE_URL="postgresql://..."
   JWT_SECRET="your-secret"
   FRONTEND_URL="http://localhost:3000"
   # ストレージ認証情報...
   ```

4. **データベースのセットアップ**
   ```bash
   npm run db:migrate
   ```

5. **サーバーの起動**
   ```bash
   npm run dev
   ```

サーバーはデフォルトでポート **4000** で起動します。APIドキュメントは `/api-docs` で確認できます。
