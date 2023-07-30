# mysql-express-react-nodejs-typescript-boilerplate

## ユーザー管理

### ユーザー向け機能

1. ユーザーの登録: POST `/api/users/register`
2. ユーザーのログイン: POST `/api/users/login`
3. ユーザーのログアウト: POST `/api/users/logout`
4. ユーザープロフィールの取得: GET `/api/users/profile`
5. ユーザープロフィールの更新: PUT `/api/users/profile`

### 管理者向け機能

1. 特定ユーザー情報の取得: GET `/api/users/:id`
2. 全ユーザーの取得: GET `/api/users`
3. ユーザー情報の更新: PUT `/api/users/:id`
4. ユーザーの削除: DELETE `/api/users/:id`

### 画像アップロード

1. 画像のアップロード: POST `/api/upload`

### User Data

```json
export const AdminData = {
  name: "Admin",
  email: "admin@email.com",
  password: "123456",
  isAdmin: true,
};

export const UserData = {
  name: "User",
  email: "user@email.com",
  password: "123456",
  isAdmin: false,
};
export const User2Data = {
  name: "User2",
  email: "user2@email.com",
  password: "123456",
  isAdmin: false,
};
```

```:powershell
C:\Users\kuros\local_dev\full-stack-basic\shopping\sample\mysql-express-react-nodejs-javascript-shopping
npm run dev
```

```:powershell
C:\Users\kuros\local_dev\full-stack-basic\shopping\sample\mysql-express-react-nodejs-javascript-shopping
npx playwright test frontend/src/tests/e2e/auth/login.test.js
npx playwright test --debug frontend/src/tests/e2e/auth/login.test.js
```

```:powershell
C:\Users\kuros\local_dev\full-stack-basic\shopping\mysql-express-react-nodejs-typescript-shopping> cd .\frontend\
C:\Users\kuros\local_dev\full-stack-basic\shopping\mysql-express-react-nodejs-typescript-shopping\frontend> npm test ./src/__test__/
```

```:powershell
C:\Users\kuros\local_dev\full-stack-basic\shopping\mysql-express-react-nodejs-typescript-shopping> npm test ./backend/__test__
```

```:powershell
C:\Users\kuros\local_dev\full-stack-basic\shopping\mysql-express-react-nodejs-typescript-shopping> npm run test
C:\Users\kuros\local_dev\full-stack-basic\shopping\mysql-express-react-nodejs-typescript-shopping> npm run test:client
```

```:powershell
npx create-next-app@13.4.1 frontend
```
