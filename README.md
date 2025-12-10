# Nv

![License](https://img.shields.io/badge/license-ISC-green)

## 📝 Description

Nv is a web application meticulously crafted using Electron, React, and Vite for a seamless user experience. The backend is powered by Express.js, ensuring robust performance and efficient data management. Nv offers a web-based interface, bringing the power of a web application.

## ✨ Features

- 🕸️ Web

## 🛠️ Tech Stack

- 🚀 Express.js

## 📦 Key Dependencies

```
cors: ^2.8.5
express: ^5.1.0
wait-on: ^9.0.1
```

## 🚀 Run Commands

- **dev**: `npm run dev`
- **devd**: `npm run devd`
- **build**: `npm run build`
- **start**: `npm run start`

## 📁 Project Structure

```
.
├── backend
│   ├── package.json
│   ├── prisma
│   │   ├── migrations
│   │   │   ├── 20251105224312_init
│   │   │   │   └── migration.sql
│   │   │   ├── 20251106124557_accountholder
│   │   │   │   └── migration.sql
│   │   │   ├── 20251106144153_account_number
│   │   │   │   └── migration.sql
│   │   │   ├── 20251119131822_soft_delete
│   │   │   │   └── migration.sql
│   │   │   ├── 20251122073139_transaction_reversal
│   │   │   │   └── migration.sql
│   │   │   ├── 20251122074738_related_transaction_id
│   │   │   │   └── migration.sql
│   │   │   └── migration_lock.toml
│   │   └── schema.prisma
│   ├── prisma.config.ts
│   ├── src
│   │   ├── controllers
│   │   │   ├── accountManagment.controller.ts
│   │   │   ├── accountholder.controller.ts
│   │   │   └── auth.controller.ts
│   │   ├── index.ts
│   │   ├── middleware
│   │   │   ├── authorizeRoles.ts
│   │   │   └── validateRequest.ts
│   │   ├── passport
│   │   │   └── jwt.strategy.ts
│   │   ├── prismaClient.ts
│   │   ├── routes
│   │   │   ├── accountHolder.route.ts
│   │   │   ├── accountManagement.route.ts
│   │   │   └── auth.route.ts
│   │   ├── services
│   │   │   ├── accountMangment
│   │   │   │   ├── accountManagment.service.ts
│   │   │   │   ├── deposit.service.ts
│   │   │   │   ├── loan.service.ts
│   │   │   │   ├── repayment.service.ts
│   │   │   │   └── transfer.service.ts
│   │   │   ├── acountHolder.service.ts
│   │   │   └── auth.service.ts
│   │   ├── utils
│   │   │   ├── ApiError.ts
│   │   │   └── token.ts
│   │   └── validations
│   │       ├── accountHolder.validation.ts
│   │       ├── accountMangement.validation.ts
│   │       └── auth.validations.ts
│   └── tsconfig.json
├── frontend
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── public
│   │   └── vite.svg
│   ├── src
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── PageGuards.tsx
│   │   ├── assets
│   │   │   └── react.svg
│   │   ├── components
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── DataTablePagination.tsx
│   │   │   ├── Loader.tsx
│   │   │   ├── Logout.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── PageWrapper.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── accountHolders
│   │   │   │   ├── columns.tsx
│   │   │   │   ├── data-table.tsx
│   │   │   │   └── delete.tsx
│   │   │   ├── accountMangment
│   │   │   │   ├── columns.tsx
│   │   │   │   ├── data-table.tsx
│   │   │   │   └── reverse.tsx
│   │   │   └── ui
│   │   │       ├── alert-dialog.tsx
│   │   │       ├── breadcrumb.tsx
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── collapsible.tsx
│   │   │       ├── dropdown-menu.tsx
│   │   │       ├── form.tsx
│   │   │       ├── input.tsx
│   │   │       ├── label.tsx
│   │   │       ├── navigation-menu.tsx
│   │   │       ├── pagination.tsx
│   │   │       ├── select.tsx
│   │   │       ├── separator.tsx
│   │   │       ├── sheet.tsx
│   │   │       ├── sidebar.tsx
│   │   │       ├── skeleton.tsx
│   │   │       ├── table.tsx
│   │   │       └── tooltip.tsx
│   │   ├── hooks
│   │   │   ├── use-mobile.ts
│   │   │   ├── useAccountHolder.ts
│   │   │   ├── useAccountManager.ts
│   │   │   └── useAuth.ts
│   │   ├── index.css
│   │   ├── lib
│   │   │   └── utils.ts
│   │   ├── main.tsx
│   │   ├── pages
│   │   │   ├── Auth
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Reg.tsx
│   │   │   └── main
│   │   │       ├── accontHolders
│   │   │       │   ├── accountHolders.tsx
│   │   │       │   ├── createAccHolder.tsx
│   │   │       │   └── editAccHolder.tsx
│   │   │       ├── accountManagement
│   │   │       │   ├── accountMangement.tsx
│   │   │       │   ├── deposit.tsx
│   │   │       │   ├── loan.tsx
│   │   │       │   ├── repayment.tsx
│   │   │       │   └── transfer.tsx
│   │   │       ├── home.tsx
│   │   │       ├── layout.tsx
│   │   │       └── users
│   │   │           ├── createUsers.tsx
│   │   │           ├── editUsers.tsx
│   │   │           └── users.tsx
│   │   └── utils
│   │       ├── accountHolderService.ts
│   │       ├── accountManagmentService.ts
│   │       ├── api.ts
│   │       ├── authService.ts
│   │       └── socket.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── types.ts
│   └── vite.config.ts
└── package.json
```

## 👥 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/benjiki/Nv.git`
3. **Create** a new branch: `git checkout -b feature/your-feature`
4. **Commit** your changes: `git commit -am 'Add some feature'`
5. **Push** to your branch: `git push origin feature/your-feature`
6. **Open** a pull request

Please ensure your code follows the project's style guidelines and includes tests where applicable.
