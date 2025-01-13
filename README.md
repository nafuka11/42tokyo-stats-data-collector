# 42tokyo-stats-data-collector

> [!CAUTION]
> 42Tokyo Statsのクローズに伴い、このリポジトリはアーカイブされています。

[42tokyo-stats-website](https://github.com/nafuka11/42tokyo-stats-website) 用のデータを収集し、Cloud Storageに保管するためのCloud Functionsです。

## 必要物

- Firebaseプロジェクト（Blazeプラン）
- [Firebase CLI](https://github.com/firebase/firebase-tools)
- Node.js v16
- JDK v11以上
- [42 API](https://api.intra.42.fr/apidoc)

## 使用するリソース

- Cloud Functions
- Cloud Storage
  - 毎日1つObjectが増加します。
- Google Cloud Secret Manager
  - 42 APIのuid, secretを保管するために使います。

## 設定項目

### .env

BUCKET_NAME

- バケット名を指定ください。

### Google Cloud Secret Manager

1. Secretを追加します。

   ```bash
   firebase functions:secrets:set FT_CLIENT_ID
   firebase functions:secrets:set FT_CLIENT_SECRET
   ```

   - 「Error: HTTP Error: 403, Secret Manager API has not been used in project...」が表示される場合は、指示に従いURLにアクセスしてSecret Manager APIを有効にしてください。

1. Secretの値が正しく設定されたか確認します。

   ```bash
   firebase functions:secrets:access FT_CLIENT_ID
   firebase functions:secrets:access FT_CLIENT_SECRET
   ```

1. 不要になった以前のバージョンのSecretを削除します。

   ```bash
   firebase functions:secrets:prune
   ```

1. Secretのバージョンの有効/無効を確認します。

   ```bash
   firebase functions:secrets:get FT_CLIENT_ID
   firebase functions:secrets:get FT_CLIENT_SECRET
   ```

   Secret削除後、それぞれのSecretで1つのバージョンだけ `ENABLED` になっているはずです。

Secret管理に関するコマンドの詳細については、公式ドキュメントを参照ください。

[Configure your environment  \|  Firebase Documentation](https://firebase.google.com/docs/functions/config-env#secret-manager)

### functions/src/utils/constants.ts

関数実行時の設定があります。適宜変更ください。

- 関数実行の際、環境変数が無効になるようで、定数で設定しています。

## コマンド

### セットアップ

Firebaseプロジェクトを現在のディレクトリに関連づけます。

以下のコマンドを、リポジトリのルートディレクトリで実行してください。
```bash
firebase use --add
? Which project do you want to add? <Firebaseプロジェクトを選択>
? What alias do you want to use for this project? (e.g. staging) default
```
コマンド実行後、リポジトリのルートディレクトリに `.firebaserc` が生成されます。

### 動作確認

以下のコマンドは `functions` ディレクトリで実行します。

1. Cloud Storageををローカルで動作させるためのエミュレータを起動

   ```bash
   yarn storage
   ```

1. Cloud Functionsをローカルで実行するためのエミュレータを起動

   `yarn storage` とは別のTerminalで実行してください。

   ```bash
   yarn shell
   ```

1. 関数を実行して動作確認する

   ```bash
   collectCursusUsers()
   ```

### 単体テスト

```bash
yarn test
```

### lint

```bash
yarn lint
```

### デプロイ

```bash
yarn deploy
```
