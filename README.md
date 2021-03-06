# 42tokyo-stats-data-collector

[42tokyo-stats-website](https://github.com/nafuka11/42tokyo-stats-website) 用のデータを収集し、Cloud Storageに保管するためのCloud Functionsです。

## 必要物

- Firebaseプロジェクト（Blazeプラン）
- [Firebase CLI](https://github.com/firebase/firebase-tools)
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

Secret管理に関するコマンドの詳細については、公式ドキュメントを参照ください。

[Configure your environment  \|  Firebase Documentation](https://firebase.google.com/docs/functions/config-env#secret-manager)

### functions/src/utils/constants.ts

関数実行時の設定があります。適宜変更ください。

- 関数実行の際、環境変数が無効になるようで、定数で設定しています。

## コマンド

以下のコマンドは `functions` ディレクトリで実行します。

### 動作確認

1. Cloud Storageををローカルで動作させるためのエミュレータを起動

   ```bash
   yarn storage
   ```

1. Cloud Functionsをローカルで実行するためのエミュレータを起動

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
