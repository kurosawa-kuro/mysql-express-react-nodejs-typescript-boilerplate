// backend\utils\index.ts

// External Imports
import { Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Internal Imports
import { User as UserType } from "@prisma/client";

export const generateToken = (res: Response, userId: UserType["id"]): void => {
  const { NODE_ENV, JWT_SECRET } = process.env;

  const token = jwt.sign({ userId }, JWT_SECRET!, { expiresIn: "30d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: NODE_ENV !== "development",
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

// Todo Utilsに下記をまとめる
// エラーハンドリングユーティリティ: エラーメッセージの形式を一貫させ、エラーログを生成したり、特定のエラーに基づいて特定のHTTPステータスコードをレスポンスするなどの機能を提供する。
// 認証・認可ユーティリティ: ユーザーの認証や認可を処理するユーティリティ。JWTトークンの生成や検証、セッション管理、権限に基づくルート保護などが含まれます。
// 日付・時間ユーティリティ: 一貫した日付と時間の形式を保証し、時刻の変換や操作を行う。
// パスワードハッシュ・検証ユーティリティ: パスワードのハッシュ化と検証を行う。
